import { ContentDraft, Platform, TrendOpportunity, PerformanceMetric } from '../types';
import { mindsStore } from '../memory/mindsStore';
import { repurposeWithMinds, MindsNotConfiguredError } from '../lib/minds';

type HookStyle = 'contrarian' | 'question' | 'stat' | 'story' | 'standard';

const ALL_PLATFORMS: Platform[] = ['instagram', 'youtube_shorts', 'youtube_longform'];

export class ContentAgent {
  public name = "Content Repurposing & Generation Agent";

  private selectWinningHookStyle(platform: Platform): { style: HookStyle; insight: string } {
    const history = mindsStore.getPerformanceHistory().filter(p => p.platform === platform);

    if (history.length === 0) {
      return { style: 'standard', insight: 'No prior performance data for this platform yet — using standard hook.' };
    }

    const best = [...history].sort((a, b) => b.engagementRate - a.engagementRate)[0];
    return { style: this.classifyHookStyle(best), insight: best.insight };
  }

  private classifyHookStyle(metric: PerformanceMetric): HookStyle {
    const label = metric.hookStyle.toLowerCase();
    if (label.includes('contrarian') || label.includes('bold')) return 'contrarian';
    if (label.includes('question')) return 'question';
    if (label.includes('case study') || label.includes('number') || label.includes('stat')) return 'stat';
    if (label.includes('visual') || label.includes('problem') || label.includes('story')) return 'story';
    return 'standard';
  }

  private craftHook(style: HookStyle, platform: Platform, topic: string): string {
    switch (style) {
      case 'contrarian':
        if (platform === 'instagram') return `Stop. Everything you know about ${topic} is wrong 📸👇`;
        if (platform === 'youtube_shorts') return `The biggest myth about ${topic} is costing you views.`;
        if (platform === 'youtube_longform') return `Why 90% of creators get ${topic} completely backwards.`;
        if (platform === 'linkedin') return `Unpopular opinion: most creators are approaching ${topic} completely backwards.`;
        return `Everyone is wrong about ${topic}. Here's what the data actually shows.`;

      case 'question':
        if (platform === 'instagram') return `Ever wonder why ${topic} is taking over your feed? 🤔`;
        if (platform === 'youtube_shorts') return `What if ${topic} was easier than everyone makes it look?`;
        if (platform === 'youtube_longform') return `Is ${topic} the biggest opportunity for digital creators in 2026?`;
        if (platform === 'linkedin') return `Why are so few creators talking about ${topic}?`;
        return `What if ${topic} isn't what you think it is?`;

      case 'stat':
        if (platform === 'instagram') return `The real numbers behind ${topic} will surprise you 📈`;
        if (platform === 'youtube_shorts') return `${topic} just generated a +36% retention boost. Here's why.`;
        if (platform === 'youtube_longform') return `The complete data breakdown on ${topic} (Real Analytics).`;
        if (platform === 'linkedin') return `The numbers on ${topic} are in — and they're bigger than expected.`;
        return `${topic} just moved the needle by double digits. Here's the breakdown.`;

      case 'story':
        if (platform === 'instagram') return `I almost missed this: ${topic} is quietly changing everything 📸`;
        if (platform === 'youtube_shorts') return `[VISUAL: Quick hook shot] Here's what happened with ${topic}.`;
        if (platform === 'youtube_longform') return `How we built an autonomous system around ${topic}.`;
        if (platform === 'linkedin') return `Last week I watched ${topic} unfold in real time. Here's what I learned.`;
        return `I almost missed this: ${topic} is quietly changing everything.`;

      default:
        if (platform === 'instagram') return `Stop scrolling! Here is the 30-second update on ${topic} 📸`;
        if (platform === 'youtube_shorts') return `Here is the fastest way to master ${topic} in 30 seconds.`;
        if (platform === 'youtube_longform') return `The definitive guide to ${topic} for digital creators.`;
        if (platform === 'linkedin') return `Most creators are sleeping on ${topic}. Here's what the data shows:`;
        return `${topic} is changing the creator economy right now.`;
    }
  }

  private craftBody(platform: Platform, topic: string, angle: string, source: string, score: number): string {
    if (platform === 'instagram') {
      return `Here is why this matters and how to stay ahead 📸👇\n\n1. Key Angle: ${angle}\n2. Source: ${source}\n3. Virality Score: ${score}/100\n\nMinds memory agents automatically learn from past post engagement to improve future hooks.`;
    }
    if (platform === 'youtube_shorts') {
      return `[VISUAL: Split screen showing stateless vs persistent agent memory]\n[AUDIO: Fast-paced synth beat]\n\nTopic: ${topic}\nAngle: ${angle}\n[TEXT ON SCREEN: Virality Score ${score}/100]\n[CUT: 3s hook -> 20s explainer -> 7s CTA]`;
    }
    if (platform === 'youtube_longform') {
      return `In this full deep dive video, we explore ${topic} and how to scale your creator workflow:\n\n0:00 - Introduction & Hook\n1:45 - The Problem with Stateless AI\n4:12 - Autonomous Memory with Minds\n8:30 - Step-by-Step Blueprint: ${angle}`;
    }
    if (platform === 'linkedin') {
      return `Over the past week, trend signals scored this topic at ${score}/100 for audience growth potential.\n\nKey Takeaway:\n${angle}\n\nBy leveraging persistent multi-agent memory, creators no longer have to spend 4 hours daily repurposing manually.`;
    }
    return `Here is why this matters and how to stay ahead 👇\n\n1. Angle: ${angle}\n2. Source: Verified via ${source}.\n3. Persistence Loop: Minds agents write performance metrics back into state autonomously.`;
  }

  private craftCta(style: HookStyle, platform: Platform): string {
    if (platform === 'instagram') {
      return style === 'question' ? "Drop a comment below with your take! 👇" : "Save & Share this post with a fellow creator!";
    }
    if (platform === 'youtube_shorts') {
      return "Subscribe for daily AI creator tips!";
    }
    if (platform === 'youtube_longform') {
      return "Subscribe to the channel and check the description link for CreatorOS!";
    }
    if (platform === 'linkedin') {
      return style === 'stat' ? "Read the full breakdown in the comments." : "Drop your thoughts in the comments below.";
    }
    return "Retweet to share with fellow builders!";
  }

  private buildFallbackDraft(opportunity: TrendOpportunity, platform: Platform): ContentDraft {
    const { style, insight } = this.selectWinningHookStyle(platform);

    const hook = this.craftHook(style, platform, opportunity.topic);
    const body = this.craftBody(platform, opportunity.topic, opportunity.angle, opportunity.source, opportunity.opportunityScore);
    const cta = this.craftCta(style, platform);

    const newDraft: ContentDraft = {
      id: `draft_${Date.now()}_${platform}`,
      opportunityId: opportunity.id,
      platform,
      hook,
      body,
      cta,
      status: 'pending_approval',
      createdAt: 'Just now',
      predictedPerformanceScore: Math.min(99, opportunity.opportunityScore + 2)
    };

    mindsStore.addDraft(newDraft);

    mindsStore.addTraceStep({
      id: `step_${Date.now()}_${platform}`,
      timestamp: new Date().toLocaleTimeString(),
      agentName: "Content Agent",
      action: "Generate Draft (Memory-Adapted)",
      details: `Read analytics.performance_history for ${platform} → selected "${style}" hook style (${insight}). Generated native ${platform.toUpperCase()} draft for "${opportunity.topic}". Saved to content.drafts.`,
      status: "completed"
    });

    return newDraft;
  }

  public async generateDraftFromOpportunity(opportunity: TrendOpportunity, platform: Platform): Promise<ContentDraft> {
    return this.buildFallbackDraft(opportunity, platform);
  }

  private extractTopicAndAngle(transcript: string): { topic: string; angle: string } {
    const cleaned = transcript.trim().replace(/\s+/g, ' ');
    const firstSentence = cleaned.split(/(?<=[.!?])\s/)[0] || cleaned;
    const topic = firstSentence.length > 80 ? `${firstSentence.slice(0, 77)}...` : firstSentence;
    const angle = cleaned.length > 220 ? `${cleaned.slice(0, 217)}...` : cleaned;
    return { topic, angle };
  }

  /**
   * Multi-Platform Native Output with Real Minds Integration:
   * First attempts to call real Minds Agent API via /api/minds/repurpose.
   * If Minds API is configured, uses real Minds LLM response!
   * Fallbacks gracefully if key is not configured.
   */
  public async generateDraftsFromTranscript(transcript: string): Promise<ContentDraft[]> {
    const { topic, angle } = this.extractTopicAndAngle(transcript);

    try {
      const mindsResult = await repurposeWithMinds(transcript, 'Tech & AI Creator', 'contrarian');

      if (mindsResult && mindsResult.drafts) {
        const timestamp = Date.now();
        const drafts: ContentDraft[] = [];

        if (mindsResult.drafts.instagram) {
          const ig = mindsResult.drafts.instagram;
          const draft: ContentDraft = {
            id: `draft_${timestamp}_instagram`,
            opportunityId: `opp_${timestamp}`,
            platform: 'instagram',
            hook: ig.hook,
            body: ig.body,
            cta: ig.cta,
            status: 'pending_approval',
            createdAt: 'Just now',
            predictedPerformanceScore: 96,
          };
          mindsStore.addDraft(draft);
          drafts.push(draft);
        }

        if (mindsResult.drafts.youtube_shorts) {
          const yt = mindsResult.drafts.youtube_shorts;
          const draft: ContentDraft = {
            id: `draft_${timestamp}_youtube_shorts`,
            opportunityId: `opp_${timestamp}`,
            platform: 'youtube_shorts',
            hook: yt.hook,
            body: yt.script,
            cta: yt.cta,
            status: 'pending_approval',
            createdAt: 'Just now',
            predictedPerformanceScore: 94,
          };
          mindsStore.addDraft(draft);
          drafts.push(draft);
        }

        if (mindsResult.drafts.youtube_longform) {
          const ytl = mindsResult.drafts.youtube_longform;
          const draft: ContentDraft = {
            id: `draft_${timestamp}_youtube_longform`,
            opportunityId: `opp_${timestamp}`,
            platform: 'youtube_longform',
            hook: ytl.hook,
            body: ytl.body,
            cta: ytl.cta,
            status: 'pending_approval',
            createdAt: 'Just now',
            predictedPerformanceScore: 92,
          };
          mindsStore.addDraft(draft);
          drafts.push(draft);
        }

        mindsStore.addTraceStep({
          id: `step_${timestamp}_minds`,
          timestamp: new Date().toLocaleTimeString(),
          agentName: 'Content Agent',
          action: 'Minds Agent Execution',
          details: `Processed transcript via real Minds API. Memory adapted: ${mindsResult.adapted_from_memory ? 'Yes' : 'Initial'}. Insight: ${mindsResult.memory_insight || 'Active'}.`,
          status: 'completed',
        });

        if (drafts.length > 0) return drafts;
      }
    } catch (err) {
      if (err instanceof MindsNotConfiguredError) {
        console.log('[Minds] Key not configured — falling back to local memory engine');
      } else {
        console.warn('[Minds] API call error:', err);
      }
    }

    const opportunity: TrendOpportunity = {
      id: `opp_transcript_${Date.now()}`,
      topic,
      source: "Creator Transcript Input",
      opportunityScore: 90,
      angle,
      category: "Tech",
      timestamp: "Just now"
    };

    return ALL_PLATFORMS.map(platform => this.buildFallbackDraft(opportunity, platform));
  }
}

export const contentAgent = new ContentAgent();
