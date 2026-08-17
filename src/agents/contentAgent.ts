import { ContentDraft, Platform, TrendOpportunity } from '../types';
import { mindsStore } from '../memory/mindsStore';

export class ContentAgent {
  public name = "Content Repurposing & Generation Agent";

  public async generateDraftFromOpportunity(opportunity: TrendOpportunity, platform: Platform): Promise<ContentDraft> {
    // 1. Read past performance memory namespace: analytics.performance_history
    const performanceHistory = mindsStore.getPerformanceHistory();
    const relevantInsights = performanceHistory.filter(p => p.platform === platform);
    
    let hookStyleNote = "Standard hook";
    if (relevantInsights.length > 0) {
      hookStyleNote = relevantInsights[0].insight;
    }

    // 2. Format draft based on platform
    let hook = "";
    let body = "";
    let cta = "";

    if (platform === 'twitter') {
      hook = `🔥 ${opportunity.topic} is changing the creator economy right now.`;
      body = `Here is why this matters and how to stay ahead 🧵👇\n\n1. Angle: ${opportunity.angle}\n2. Source: Verified via ${opportunity.source}.\n3. Persistence Loop: Minds agents write performance metrics back into state autonomously.`;
      cta = "Retweet to share with fellow builders! What's your take?";
    } else if (platform === 'linkedin') {
      hook = `Most creators are sleeping on ${opportunity.topic}. Here's what the data shows:`;
      body = `Over the past week, trend signals scored this topic at ${opportunity.opportunityScore}/100 for audience growth potential.\n\nKey Takeaway:\n${opportunity.angle}\n\nBy leveraging persistent multi-agent memory, creators no longer have to spend 4 hours daily repurposing manually.`;
      cta = "Drop your thoughts in the comments below.";
    } else {
      hook = `Stop scrolling! Here is the 30-second AI trend update you need today.`;
      body = `[VISUAL: Glowing Minds Agent diagram]\n[AUDIO: Upbeat tech track]\n\nTopic: ${opportunity.topic}\nAngle: ${opportunity.angle}\n\n[TEXT ON SCREEN: Score ${opportunity.opportunityScore}/100]`;
      cta = "Follow for daily AI creator tools!";
    }

    const newDraft: ContentDraft = {
      id: `draft_${Date.now()}`,
      opportunityId: opportunity.id,
      platform,
      hook,
      body,
      cta,
      status: 'pending_approval',
      createdAt: 'Just now',
      predictedPerformanceScore: Math.min(99, opportunity.opportunityScore + 2)
    };

    // Save to Minds Memory Store namespace: content.drafts
    mindsStore.addDraft(newDraft);

    mindsStore.addTraceStep({
      id: `step_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentName: "Content Agent",
      action: "Generate Draft (Memory-Adapted)",
      details: `Read analytics memory (${hookStyleNote}). Generated native ${platform.toUpperCase()} draft for "${opportunity.topic}". Saved to content.drafts.`,
      status: "completed"
    });

    return newDraft;
  }
}

export const contentAgent = new ContentAgent();
