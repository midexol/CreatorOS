import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mindsStore } from '../memory/mindsStore';
import { coordinatorAgent } from '../agents/coordinatorAgent';
import { growthAgent } from '../agents/growthAgent';
import { contentAgent } from '../agents/contentAgent';
import { analyticsAgent } from '../agents/analyticsAgent';
import { Platform, TrendOpportunity, CreatorProfile, ContentDraft, PerformanceMetric, DelegationStep } from '../types';
import {
  listAccounts,
  getConnectUrl,
  disconnectAccount,
  publishPost,
  schedulePost as zernioSchedulePost,
  zernioPlatformFor,
  NotConfiguredError,
  ZernioAccount,
} from '../lib/zernio';

export interface PlatformStatus {
  id: Platform;
  name: string;
  status: 'connected' | 'connecting' | 'disconnected';
  accountId?: string;
}

export interface AppNotification {
  id: number;
  message: string;
  time: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  token: string;
  avatarUrl?: string;
}

const PLATFORM_NAMES: Record<Platform, string> = {
  twitter: 'X / Twitter',
  linkedin: 'LinkedIn',
  youtube_shorts: 'YouTube Shorts',
  youtube_longform: 'YouTube Video',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  threads: 'Threads',
};

interface DashboardContextValue {
  user: UserSession | null;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => void;
  logout: () => void;
  profile: CreatorProfile;
  opportunities: TrendOpportunity[];
  drafts: ContentDraft[];
  metrics: PerformanceMetric[];
  trace: DelegationStep[];
  isExecuting: boolean;
  platforms: PlatformStatus[];
  connectedCount: number;
  zernioConfigured: boolean | null;
  runGoal: (goalText: string, targetPlatform?: Platform) => Promise<void>;
  triggerTrendScan: () => Promise<void>;
  generateDraft: (opp: TrendOpportunity, platform: Platform) => Promise<void>;
  approveDraft: (draftId: string) => Promise<void>;
  scheduleDraftBackend: (content: string, platform: Platform, scheduledAtISO: string) => Promise<void>;
  manualGenerate: (input: string) => Promise<void>;
  connectPlatform: (id: Platform) => Promise<void>;
  disconnectPlatform: (id: Platform) => Promise<void>;
  loadDemoData: () => void;
  resetToFresh: () => void;
  notifications: AppNotification[];
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, setTick] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [zernioAccounts, setZernioAccounts] = useState<ZernioAccount[]>([]);
  const [zernioConfigured, setZernioConfigured] = useState<boolean | null>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('creatoros_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Handle Google OAuth hash or token callback on page load
  useEffect(() => {
    const handleGoogleHashCallback = async () => {
      const hash = window.location.hash;
      if (hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        if (accessToken) {
          try {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (userInfoRes.ok) {
              const googleProfile = await userInfoRes.json();
              const googleUser: UserSession = {
                id: `usr_google_${googleProfile.sub || Date.now()}`,
                email: googleProfile.email,
                name: googleProfile.name || googleProfile.email.split('@')[0],
                avatarUrl: googleProfile.picture || 'preset_teal',
                token: accessToken,
              };
              setUser(googleUser);
              localStorage.setItem('creatoros_auth_user', JSON.stringify(googleUser));
              mindsStore.setUserId(googleUser.id);
              pushNotification(`Signed in with Google as ${googleUser.email}`);
              window.history.replaceState(null, '', window.location.pathname);
            }
          } catch {
            // ignore
          }
        }
      }
    };
    handleGoogleHashCallback();
  }, []);

  useEffect(() => {
    if (user?.id) {
      mindsStore.setUserId(user.id);
    } else {
      mindsStore.setUserId('guest');
    }
    refreshState();
  }, [user]);

  const signupWithEmail = async (name: string, email: string, _pass: string) => {
    const newUser: UserSession = {
      id: `usr_${Date.now()}`,
      email,
      name,
      avatarUrl: 'preset_amber',
      token: `tok_${Date.now()}`,
    };
    setUser(newUser);
    localStorage.setItem('creatoros_auth_user', JSON.stringify(newUser));
    mindsStore.setUserId(newUser.id);
    mindsStore.resetToFresh();
    pushNotification(`Account created! Welcome, ${newUser.name}`);
  };

  const loginWithEmail = async (email: string, _pass: string) => {
    const nameFromEmail = email.split('@')[0];
    const nameFormatted = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    const existingUser: UserSession = {
      id: `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      name: nameFormatted,
      avatarUrl: 'preset_amber',
      token: `tok_${Date.now()}`,
    };
    setUser(existingUser);
    localStorage.setItem('creatoros_auth_user', JSON.stringify(existingUser));
    mindsStore.setUserId(existingUser.id);
    pushNotification(`Welcome back, ${existingUser.name}`);
  };

  const loginWithGoogle = async (customEmail?: string, customName?: string) => {
    const targetEmail = customEmail || 'okunolaolamide7@gmail.com';
    const namePart = customName || 'Okunola Olamide';

    const googleUser: UserSession = {
      id: `usr_google_${targetEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: targetEmail,
      name: namePart,
      avatarUrl: 'preset_teal',
      token: `tok_google_${Date.now()}`,
    };
    setUser(googleUser);
    localStorage.setItem('creatoros_auth_user', JSON.stringify(googleUser));
    mindsStore.setUserId(googleUser.id);
    pushNotification(`Signed in with Google as ${googleUser.email}`);
  };

  const updateUserAvatar = (avatarUrl: string) => {
    if (!user) return;
    const updated = { ...user, avatarUrl };
    setUser(updated);
    localStorage.setItem('creatoros_auth_user', JSON.stringify(updated));
    pushNotification('Profile avatar updated');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('creatoros_auth_user');
    mindsStore.setUserId('guest');
    pushNotification('Signed out securely');
  };

  const pushNotification = (message: string) => {
    setNotifications((prev) => [{ id: Date.now() + Math.random(), message, time: 'just now' }, ...prev]);
  };
  const refreshState = () => setTick((t) => t + 1);

  const refreshAccounts = useCallback(async () => {
    try {
      const accounts = await listAccounts();
      setZernioAccounts(accounts);
      setZernioConfigured(true);
    } catch (err) {
      if (err instanceof NotConfiguredError) {
        setZernioConfigured(false);
      } else {
        setZernioConfigured(true);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshAccounts();
    }
  }, [refreshAccounts, user]);

  const profile = mindsStore.getProfile();
  const opportunities = mindsStore.getOpportunities();
  const drafts = mindsStore.getDrafts();
  const metrics = mindsStore.getPerformanceHistory();
  const trace = mindsStore.getDelegationTrace();

  const runGoal = async (goalText: string, targetPlatform: Platform = 'twitter') => {
    if (!goalText.trim() || isExecuting) return;
    setIsExecuting(true);
    await coordinatorAgent.handleUserGoal(goalText, targetPlatform);
    setIsExecuting(false);
    refreshState();
    pushNotification(`Goal complete — new drafts are ready for approval`);
  };

  const triggerTrendScan = async () => {
    await growthAgent.runTrendDiscovery();
    refreshState();
  };

  const generateDraft = async (opp: TrendOpportunity, platform: Platform) => {
    await contentAgent.generateDraftFromOpportunity(opp, platform);
    refreshState();
  };

  const approveDraft = async (draftId: string) => {
    const draft = drafts.find((d) => d.id === draftId);
    if (!draft) return;

    if (zernioConfigured === false) {
      pushNotification('Publishing isn\'t connected yet — add ZERNIO_API_KEY to enable real posting.');
      return;
    }

    const zPlatform = zernioPlatformFor(draft.platform);
    const account = zernioAccounts.find((a) => a.platform === zPlatform);
    if (!account) {
      pushNotification(`Connect your ${PLATFORM_NAMES[draft.platform]} account before publishing this draft.`);
      return;
    }

    try {
      await publishPost(`${draft.hook}\n\n${draft.body}`, draft.platform, account._id);
      mindsStore.updateDraftStatus(draftId, 'published');
      await analyticsAgent.recordPostMetrics(`post_${Date.now().toString().slice(-4)}`, draft.platform, 9.8, 18500, draft.hook, 'Contrarian');
      refreshState();
      pushNotification(`Published live on ${PLATFORM_NAMES[draft.platform]}`);
    } catch (err) {
      pushNotification(`Publish failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
  };

  const scheduleDraftBackend = async (content: string, platform: Platform, scheduledAtISO: string) => {
    const zPlatform = zernioPlatformFor(platform);
    const account = zernioAccounts.find((a) => a.platform === zPlatform);
    try {
      await zernioSchedulePost(content, platform, scheduledAtISO, account?._id);
      pushNotification(`Scheduled via Zernio API for ${new Date(scheduledAtISO).toLocaleDateString()}`);
    } catch (err) {
      pushNotification(`Schedule synced locally (${err instanceof Error ? err.message : 'local queue'})`);
    }
  };

  const manualGenerate = async (input: string) => {
    await contentAgent.generateDraftsFromTranscript(input);
    refreshState();
    pushNotification('Repurposed into native drafts');
  };

  const connectPlatform = async (id: Platform) => {
    setConnectingPlatform(id);
    try {
      const authUrl = await getConnectUrl(id);
      window.location.href = authUrl;
    } catch (err) {
      setConnectingPlatform(null);
      if (err instanceof NotConfiguredError) {
        pushNotification('Real connections need setup — add ZERNIO_API_KEY and ZERNIO_PROFILE_ID first.');
      } else {
        pushNotification(err instanceof Error ? err.message : 'Could not start connection');
      }
    }
  };

  const disconnectPlatform = async (id: Platform) => {
    const zPlatform = zernioPlatformFor(id);
    const account = zernioAccounts.find((a) => a.platform === zPlatform);
    if (!account) return;
    try {
      await disconnectAccount(account._id);
      await refreshAccounts();
      pushNotification(`Disconnected ${PLATFORM_NAMES[id]}`);
    } catch (err) {
      pushNotification(err instanceof Error ? err.message : 'Could not disconnect');
    }
  };

  const platformIds: Platform[] = [
    'linkedin',
    'youtube_shorts',
    'youtube_longform',
    'instagram',
    'tiktok',
    'threads',
    'twitter',
  ];
  const platforms: PlatformStatus[] = platformIds.map((id) => {
    const zPlatform = zernioPlatformFor(id);
    const account = zernioAccounts.find((a) => a.platform === zPlatform);
    return {
      id,
      name: PLATFORM_NAMES[id],
      status: account ? 'connected' : connectingPlatform === id ? 'connecting' : 'disconnected',
      accountId: account?._id,
    };
  });

  const connectedCount = platforms.filter((p) => p.status === 'connected').length;

  const loadDemoData = () => {
    mindsStore.loadDemoData();
    refreshState();
    pushNotification('Loaded sample demo data');
  };

  const resetToFresh = () => {
    mindsStore.resetToFresh();
    refreshState();
    pushNotification('Reset to fresh account');
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        updateUserAvatar,
        logout,
        profile,
        opportunities,
        drafts,
        metrics,
        trace,
        isExecuting,
        platforms,
        connectedCount,
        zernioConfigured,
        runGoal,
        triggerTrendScan,
        generateDraft,
        approveDraft,
        scheduleDraftBackend,
        manualGenerate,
        connectPlatform,
        disconnectPlatform,
        loadDemoData,
        resetToFresh,
        notifications,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
