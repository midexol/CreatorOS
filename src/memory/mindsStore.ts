import { CreatorProfile, TrendOpportunity, ContentDraft, PerformanceMetric, DelegationStep } from '../types';

// Sample data for demo recording only — not loaded by default. A fresh
// account starts empty, matching what a real new creator would see.
export const DEMO_SEED = {
  opportunities: [
    {
      id: "opp_1",
      topic: "Autonomous AI Agent Memory & Multi-Session State",
      source: "Reddit r/LocalLLaMA & X Trends",
      opportunityScore: 96,
      angle: "Why persistent memory is the boundary separating chatbot toys from true production agents",
      category: "AI",
      timestamp: "10 mins ago"
    },
    {
      id: "opp_2",
      topic: "Creator Economy Monetization via Tokenized Communities",
      source: "Open Campus & Animoca Pulse",
      opportunityScore: 88,
      angle: "How creators are replacing traditional Patreon subscriptions with autonomous agent rewards",
      category: "Creator Economy",
      timestamp: "45 mins ago"
    },
    {
      id: "opp_3",
      topic: "Repurposing Long-form Audio to Micro-Video Scripts",
      source: "YouTube Shorts Analytics",
      opportunityScore: 82,
      angle: "3-step workflow to turn a 60-min podcast into 10 viral short-form hooks automatically",
      category: "Tech",
      timestamp: "2 hours ago"
    }
  ] as TrendOpportunity[],
  drafts: [
    {
      id: "draft_1",
      opportunityId: "opp_1",
      platform: "twitter" as const,
      hook: "AI agents without memory are glorified search bars.",
      body: "Here is how persistent multi-session state changes everything for AI builders in 2026 🧵👇\n\n1. Single-session LLMs forget your context the second you refresh.\n2. Autonomous memory namespaces allow agents to write past performance back into state.\n3. Content agents learn what hook styles perform 35% better and adapt autonomously.",
      cta: "What memory architecture are you using for your agents?",
      status: "pending_approval" as const,
      createdAt: "Just now",
      predictedPerformanceScore: 94
    },
    {
      id: "draft_2",
      opportunityId: "opp_1",
      platform: "linkedin" as const,
      hook: "The biggest bottleneck in AI agent deployment isn't model intelligence—it's memory continuity.",
      body: "Over the last month, we tested multi-agent delegation across 500 creator posts.\n\nThe single biggest performance multiplier? Persistence.\n\nWhen your AI Chief of Staff writes engagement analytics back into its own memory store, every future post inherits historical insights.\n\nStop building stateless prompts. Start building persistent agent systems.",
      cta: "Read our technical build breakdown in the comments.",
      status: "pending_approval" as const,
      createdAt: "15 mins ago",
      predictedPerformanceScore: 91
    },
    {
      id: "draft_3",
      opportunityId: "opp_3",
      platform: "youtube_shorts" as const,
      hook: "Stop manually cutting 1-hour podcast videos!",
      body: "[VISUAL: Quick zoom on timeline with 50 cuts]\n[AUDIO: Upbeat tech synth background]\n\nHere is how CreatorOS repurposes long-form audio in 30 seconds:\n1. Transcribe audio transcript\n2. Extract top 5 virality-scored hooks\n3. Generate timed caption scripts with visual cues automatically.",
      cta: "Subscribe for more AI creator workflows!",
      status: "published" as const,
      createdAt: "1 hour ago",
      predictedPerformanceScore: 88
    }
  ] as ContentDraft[],
  performanceHistory: [
    {
      postId: "post_101",
      platform: "twitter" as const,
      hookStyle: "Contrarian Bold Statement",
      views: 24500,
      engagementRate: 8.6,
      insight: "Contrarian hooks performed +36% higher than generic questions. Retained in memory.",
      timestamp: "Yesterday"
    },
    {
      postId: "post_102",
      platform: "linkedin" as const,
      hookStyle: "Case Study & Numbers",
      views: 18200,
      engagementRate: 9.1,
      insight: "Whitespace formatting with 1-sentence paragraphs boosted link clicks by 42%.",
      timestamp: "2 days ago"
    },
    {
      postId: "post_103",
      platform: "youtube_shorts" as const,
      hookStyle: "3-Second Visual Problem Hook",
      views: 52000,
      engagementRate: 11.4,
      insight: "Visual cues in square brackets increased 30s completion rate by 28%.",
      timestamp: "3 days ago"
    }
  ] as PerformanceMetric[],
  delegationTrace: [
    {
      id: "step_1",
      timestamp: "11:58:10",
      agentName: "Coordinator" as const,
      action: "Goal Received",
      details: 'Objective: "Scale tech audience engagement using latest AI trend signals."',
      status: "completed" as const
    },
    {
      id: "step_2",
      timestamp: "11:58:12",
      agentName: "Growth Agent" as const,
      action: "Search Trends",
      details: "Polled X API & Reddit r/LocalLLaMA. Found 'Autonomous AI Agent Memory' (Score: 96/100). Written to growth.opportunities memory.",
      status: "completed" as const
    },
    {
      id: "step_3",
      timestamp: "11:58:15",
      agentName: "Content Agent" as const,
      action: "Read Memory & Generate Drafts",
      details: "Fetched analytics.performance_history: Contrarian hook style selected based on +36% historical engagement boost. Saved to content.drafts.",
      status: "completed" as const
    },
    {
      id: "step_4",
      timestamp: "11:58:18",
      agentName: "Analytics Agent" as const,
      action: "Persistence Feedback Verification",
      details: "Monitoring post metrics. Ready to write new engagement deltas into Minds memory.",
      status: "active" as const
    }
  ] as DelegationStep[],
};

export class MindsMemoryStore {
  private static STORAGE_KEY = 'creator_os_minds_memory_v1';

  private profile: CreatorProfile = {
    name: "New Creator",
    niche: "",
    brandVoice: "Informative, high-signal, punchy",
    targetAudience: "",
    cognitionCredits: 1450
  };

  // A fresh account starts empty — no opportunities, drafts, metrics, or
  // trace history until a real cycle runs (or demo data is explicitly loaded).
  private opportunities: TrendOpportunity[] = [];
  private drafts: ContentDraft[] = [];
  private performanceHistory: PerformanceMetric[] = [];
  private delegationTrace: DelegationStep[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(MindsMemoryStore.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.profile = parsed.profile || this.profile;
        this.opportunities = parsed.opportunities || this.opportunities;
        this.drafts = parsed.drafts || this.drafts;
        this.performanceHistory = parsed.performanceHistory || this.performanceHistory;
        this.delegationTrace = parsed.delegationTrace || this.delegationTrace;
      } catch (e) {
        console.error("Failed to parse saved Minds memory", e);
      }
    }
  }

  public saveToStorage() {
    localStorage.setItem(MindsMemoryStore.STORAGE_KEY, JSON.stringify({
      profile: this.profile,
      opportunities: this.opportunities,
      drafts: this.drafts,
      performanceHistory: this.performanceHistory,
      delegationTrace: this.delegationTrace
    }));
  }

  // Getters
  public getProfile() { return this.profile; }
  public getOpportunities() { return this.opportunities; }
  public getDrafts() { return this.drafts; }
  public getPerformanceHistory() { return this.performanceHistory; }
  public getDelegationTrace() { return this.delegationTrace; }

  // Mutations
  public addOpportunity(opp: TrendOpportunity) {
    this.opportunities.unshift(opp);
    this.saveToStorage();
  }

  public addDraft(draft: ContentDraft) {
    this.drafts.unshift(draft);
    this.saveToStorage();
  }

  public updateDraftStatus(id: string, status: ContentDraft['status']) {
    const draft = this.drafts.find(d => d.id === id);
    if (draft) {
      draft.status = status;
      this.saveToStorage();
    }
  }

  public addMetric(metric: PerformanceMetric) {
    this.performanceHistory.unshift(metric);
    this.saveToStorage();
  }

  public addTraceStep(step: DelegationStep) {
    this.delegationTrace.push(step);
    this.saveToStorage();
  }

  // Explicit demo helper — not called automatically. Lets the team load
  // sample history for a recording session without it being any real
  // creator's default experience.
  public loadDemoData() {
    this.opportunities = [...DEMO_SEED.opportunities];
    this.drafts = [...DEMO_SEED.drafts];
    this.performanceHistory = [...DEMO_SEED.performanceHistory];
    this.delegationTrace = [...DEMO_SEED.delegationTrace];
    this.saveToStorage();
  }

  public resetToFresh() {
    this.opportunities = [];
    this.drafts = [];
    this.performanceHistory = [];
    this.delegationTrace = [];
    this.saveToStorage();
  }
}

export const mindsStore = new MindsMemoryStore();
