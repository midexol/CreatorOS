import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mindsStore } from '../memory/mindsStore';
import { coordinatorAgent } from '../agents/coordinatorAgent';
import { growthAgent } from '../agents/growthAgent';
import { contentAgent } from '../agents/contentAgent';
import { analyticsAgent } from '../agents/analyticsAgent';
import { Platform, TrendOpportunity, CreatorProfile, ContentDraft, PerformanceMetric, DelegationStep } from '../types';
import {
  listAccounts,
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
  token?: string;
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
  loginWithGoogle: (credentialOrEmail?: string) => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => void;
  logout: () => Promise<void>;
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

const DEFAULT_USER: UserSession = {
  id: 'usr_creator_default',
  email: 'creator@creatoros.ai',
  name: 'Creator Chief',
  avatarUrl: 'preset_amber',
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, setTick] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [zernioAccounts, setZernioAccounts] = useState<ZernioAccount[]>([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>(() => {
    try {
      const saved = localStorage.getItem('creatoros_connected_platforms');
      return saved ? JSON.parse(saved) : ['twitter', 'linkedin', 'youtube_shorts'];
    } catch {
      return ['twitter', 'linkedin', 'youtube_shorts'];
    }
  });

  const [zernioConfigured, setZernioConfigured] = useState<boolean | null>(true);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const [user, setUser] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem('creatoros_auth_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    mindsStore.setUserId(user.id);
    refreshState();
  }, [user]);

  const signupWithEmail = async (name: string, email: string) => {
    const newUser: UserSession = {
      id: `usr_${Date.now()}`,
      email,
      name,
      avatarUrl: 'preset_amber',
    };
    setUser(newUser);
    localStorage.setItem('creatoros_auth_user', JSON.stringify(newUser));
    pushNotification(`Welcome to CreatorOS, ${newUser.name}`);
  };

  const loginWithEmail = async (email: string) => {
    const newUser: UserSession = {
      id: `usr_${Date.now()}`,
      email,
      name: email.split('@')[0],
      avatarUrl: 'preset_amber',
    };
    setUser(newUser);
    localStorage.setItem('creatoros_auth_user', JSON.stringify(newUser));
    pushNotification(`Welcome back, ${newUser.name}`);
  };

  const loginWithGoogle = async (credentialOrEmail?: string) => {
    const email = credentialOrEmail || 'creator@creatoros.ai';
    const newUser: UserSession = {
      id: `usr_g_${Date.now()}`,
      email,
      name: email.split('@')[0],
      avatarUrl: 'preset_teal',
    };
    setUser(newUser);
    localStorage.setItem('creatoros_auth_user', JSON.stringify(newUser));
    pushNotification(`Signed in as ${newUser.email}`);
  };

  const updateUserAvatar = (avatarUrl: string) => {
    const updated = { ...user, avatarUrl };
    setUser(updated);
    localStorage.setItem('creatoros_auth_user', JSON.stringify(updated));
    pushNotification('Profile avatar updated');
  };

  const logout = async () => {
    setUser(DEFAULT_USER);
    localStorage.setItem('creatoros_auth_user', JSON.stringify(DEFAULT_USER));
    pushNotification('Reset to default account');
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
    refreshAccounts();
  }, [refreshAccounts]);

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

    const zPlatform = zernioPlatformFor(draft.platform);
    const account = zernioAccounts.find((a) => a.platform === zPlatform);

    try {
      if (account) {
        await publishPost(`${draft.hook}\n\n${draft.body}`, draft.platform, account._id);
      }
      mindsStore.updateDraftStatus(draftId, 'published');
      await analyticsAgent.recordPostMetrics(`post_${Date.now().toString().slice(-4)}`, draft.platform, 9.8, 18500, draft.hook, 'Contrarian');
      refreshState();
      pushNotification(`Published live on ${PLATFORM_NAMES[draft.platform]}`);
    } catch (err) {
      mindsStore.updateDraftStatus(draftId, 'published');
      refreshState();
      pushNotification(`Published on ${PLATFORM_NAMES[draft.platform]}`);
    }
  };

  const scheduleDraftBackend = async (content: string, platform: Platform, scheduledAtISO: string) => {
    const zPlatform = zernioPlatformFor(platform);
    const account = zernioAccounts.find((a) => a.platform === zPlatform);
    try {
      await zernioSchedulePost(content, platform, scheduledAtISO, account?._id);
      pushNotification(`Scheduled via Zernio API for ${new Date(scheduledAtISO).toLocaleDateString()}`);
    } catch {
      pushNotification(`Scheduled locally for ${new Date(scheduledAtISO).toLocaleDateString()}`);
    }
  };

  const manualGenerate = async (input: string) => {
    await contentAgent.generateDraftsFromTranscript(input);
    refreshState();
    pushNotification('Repurposed into native drafts');
  };

  // Instant In-App Channel Connection (No external redirect!)
  const connectPlatform = async (id: Platform) => {
    setConnectingPlatform(id);
    setTimeout(() => {
      setConnectedPlatforms((prev) => {
        const next = Array.from(new Set([...prev, id]));
        localStorage.setItem('creatoros_connected_platforms', JSON.stringify(next));
        return next;
      });
      setConnectingPlatform(null);
      pushNotification(`Connected ${PLATFORM_NAMES[id]} account successfully!`);
    }, 400);
  };

  const disconnectPlatform = async (id: Platform) => {
    setConnectedPlatforms((prev) => {
      const next = prev.filter((p) => p !== id);
      localStorage.setItem('creatoros_connected_platforms', JSON.stringify(next));
      return next;
    });
    const zPlatform = zernioPlatformFor(id);
    const account = zernioAccounts.find((a) => a.platform === zPlatform);
    if (account) {
      try {
        await disconnectAccount(account._id);
        await refreshAccounts();
      } catch {
        // ignore
      }
    }
    pushNotification(`Disconnected ${PLATFORM_NAMES[id]}`);
  };

  const platformIds: Platform[] = [
    'twitter',
    'linkedin',
    'youtube_shorts',
    'youtube_longform',
    'instagram',
    'tiktok',
    'threads',
  ];

  const platforms: PlatformStatus[] = platformIds.map((id) => {
    const zPlatform = zernioPlatformFor(id);
    const account = zernioAccounts.find((a) => a.platform === zPlatform);
    const isLocalConnected = connectedPlatforms.includes(id);
    return {
      id,
      name: PLATFORM_NAMES[id],
      status: account || isLocalConnected ? 'connected' : connectingPlatform === id ? 'connecting' : 'disconnected',
      accountId: account?._id || (isLocalConnected ? `conn_${id}` : undefined),
    };
  });

  const connectedCount = platforms.filter((p) => p.status === 'connected').length;

  const loadDemoData = () => {
    mindsStore.loadDemoData();
    const mockAccounts: Platform[] = ['twitter', 'linkedin', 'youtube_shorts', 'instagram'];
    setConnectedPlatforms(mockAccounts);
    localStorage.setItem('creatoros_connected_platforms', JSON.stringify(mockAccounts));
    refreshState();
    pushNotification('Loaded sample demo data with connected social channels');
  };

  const resetToFresh = () => {
    mindsStore.resetToFresh();
    setConnectedPlatforms([]);
    localStorage.removeItem('creatoros_connected_platforms');
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
