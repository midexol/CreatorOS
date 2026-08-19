import { ContentDraft, Platform, TrendOpportunity, PerformanceMetric } from '../types';
import { mindsStore } from '../memory/mindsStore';

type HookStyle = 'contrarian' | 'question' | 'stat' | 'story' | 'standard';

const ALL_PLATFORMS: Platform[] = ['twitter', 'linkedin', 'youtube_shorts'];

export class ContentAgent {
  public name = "Content Repurposing & Generation Agent";

  /**
   * Dynamic Memory Reading: inspects analytics.performance_history for the given
   * platform, ranks hook styles by engagementRate, and returns the winning style
   * (falling back to 'standard' when there is no history yet).
   */
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
        return platform === 'twitter'
          ? `🔥 Everyone is wrong about ${topic}. Here's what the data actually shows.`
          : platform === 'linkedin'
          ? `Unpopular opinion: most creators are approaching ${topic} completely backwards.`
          : `Stop. Everything you know about ${topic} is wrong.`;
      case 'question':
        return platform === 'twitter'
          ? `What if ${topic} isn't what you think it is?`
          : platform === 'linkedin'
          ? `Why are so few creators talking about ${topic}?`
          : `Ever wonder why ${topic} keeps blowing up?`;
      case 'stat':
        return platform === 'twitter'
          ? `${topic} just moved the needle by double digits. Here's the breakdown 🧵`
          : platform === 'linkedin'
          ? `The numbers on ${topic} are in — and they're bigger than expected.`
          : `The stats on ${topic} will surprise you.`;
      case 'story':
        return platform === 'twitter'
          ? `I almost missed this: ${topic} is quietly changing everything.`
          : platform === 'linkedin'
          ? `Last week I watched ${topic} unfold in real time. Here's what I learned.`
          : `[VISUAL: Quick hook shot] Here's what happened with ${topic}.`;
      default:
        return platform === 'twitter'
          ? `🔥 ${topic} is changing the creator economy right now.`
          : platform === 'linkedin'
          ? `Most creators are sleeping on ${topic}. Here's what the data shows:`
          : `Stop scrolling! Here is the 30-second update on ${topic}.`;
    }
  }

  private craftBody(platform: Platform, topic: string, angle: string, source: string, score: number): string {
    if (platform === 'twitter') {
      return `Here is why this matters and how to stay ahead 🧵👇\n\n1. Angle: ${angle}\n2. Source: Verified via ${source}.\n3. Persistence Loop: Minds agents write performance metrics back into state autonomously.`;
    }
    if (platform === 'linkedin') {
      return `Over the past week, trend signals scored this topic at ${score}/100 for audience growth potential.\n\nKey Takeaway:\n${angle}\n\nBy leveraging persistent multi-agent memory, creators no longer have to spend 4 hours daily repurposing manually.`;
    }
    return `[VISUAL: Glowing Minds Agent diagram]\n[AUDIO: Upbeat tech track]\n\nTopic: ${topic}\nAngle: ${angle}\n[TEXT ON SCREEN: Score ${score}/100]\n[CUT: 3s hook -> 20s explainer -> 7s CTA]`;
  }

  private craftCta(style: HookStyle, platform: Platform): string {
    if (platform === 'twitter') {
      return style === 'question' ? "Reply with your take 👇" : "Retweet to share with fellow builders! What's your take?";
    }
    if (platform === 'linkedin') {
      return style === 'stat' ? "Read the full breakdown in the comments." : "Drop your thoughts in the comments below.";
    }
    return "Follow for daily AI creator tools!";
  }

  private buildDraft(opportunity: TrendOpportunity, platform: Platform): ContentDraft {
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
    return this.buildDraft(opportunity, platform);
  }

  private extractTopicAndAngle(transcript: string): { topic: string; angle: string } {
    const cleaned = transcript.trim().replace(/\s+/g, ' ');
    const firstSentence = cleaned.split(/(?<=[.!?])\s/)[0] || cleaned;
    const topic = firstSentence.length > 80 ? `${firstSentence.slice(0, 77)}...` : firstSentence;
    const angle = cleaned.length > 220 ? `${cleaned.slice(0, 217)}...` : cleaned;
    return { topic, angle };
  }

  /**
   * Multi-Platform Native Output: takes one raw transcript and repurposes it into
   * 3 distinct, platform-native drafts (X Thread, LinkedIn, YouTube Shorts script)
   * in a single pass, each independently adapted via performance memory.
   */
  public async generateDraftsFromTranscript(transcript: string): Promise<ContentDraft[]> {
    const { topic, angle } = this.extractTopicAndAngle(transcript);

    const opportunity: TrendOpportunity = {
      id: `opp_transcript_${Date.now()}`,
      topic,
      source: "Creator Transcript Input",
      opportunityScore: 90,
      angle,
      category: "Tech",
      timestamp: "Just now"
    };

    return ALL_PLATFORMS.map(platform => this.buildDraft(opportunity, platform));
  }
}

export const contentAgent = new ContentAgent();
