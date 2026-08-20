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

const PLATFORM_NAMES: Record<Platform, string> = {
  twitter: 'X / Twitter',
  linkedin: 'LinkedIn',
  youtube_shorts: 'YouTube Shorts',
};

interface DashboardContextValue {
  profile: CreatorProfile;
  opportunities: TrendOpportunity[];
  drafts: ContentDraft[];
  metrics: PerformanceMetric[];
  trace: DelegationStep[];
  isExecuting: boolean;
  platforms: PlatformStatus[];
  connectedCount: number;
  zernioConfigured: boolean | null; // null = still checking
  runGoal: (goalText: string, targetPlatform?: Platform) => Promise<void>;
  triggerTrendScan: () => Promise<void>;
  generateDraft: (opp: TrendOpportunity, platform: Platform) => Promise<void>;
  approveDraft: (draftId: string) => Promise<void>;
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
        setZernioConfigured(true); // configured, but this call failed — don't block the UI
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

  // Real publish: finds a connected Zernio account for the draft's platform
  // and posts through it. If nothing is connected (or Zernio isn't
  // configured yet), this is honest about that instead of faking success.
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
      // Real engagement numbers arrive over time via Zernio's analytics API —
      // Person 4's real-time polling isn't wired in yet, so this bookkeeping
      // step is still simulated to keep the persistence-loop demo working.
      await analyticsAgent.recordPostMetrics(`post_${Date.now().toString().slice(-4)}`, draft.platform, 9.8, 18500);
      refreshState();
      pushNotification(`Published live on ${PLATFORM_NAMES[draft.platform]}`);
    } catch (err) {
      pushNotification(`Publish failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
  };

  // Uses the Content agent's real transcript-repurposing method — reads
  // performance memory and produces 3 platform-native drafts in one pass.
  const manualGenerate = async (input: string) => {
    await contentAgent.generateDraftsFromTranscript(input);
    refreshState();
    pushNotification('Repurposed into 3 platform-native drafts');
  };

  // Real OAuth redirect via Zernio — this navigates the whole browser away
  // to the platform's real authorization screen, then back once approved.
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

  const platformIds: Platform[] = ['twitter', 'linkedin', 'youtube_shorts'];
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
  };

  const resetToFresh = () => {
    mindsStore.resetToFresh();
    refreshState();
    pushNotification('Reset to a fresh account');
  };

  return (
    <DashboardContext.Provider
      value={{
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
