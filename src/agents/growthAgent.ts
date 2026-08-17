import { TrendOpportunity } from '../types';
import { mindsStore } from '../memory/mindsStore';

export class GrowthAgent {
  public name = "Growth & Trend Discovery Agent";

  private mockTrends: Partial<TrendOpportunity>[] = [
    {
      topic: "Minds Agent Cognition Boost & Memory Scaling",
      source: "Animoca Brands & hellominds.ai Docs",
      opportunityScore: 98,
      angle: "How developers are building multi-agent systems using native cognition credits",
      category: "AI"
    },
    {
      topic: "Open Campus Decentralized Learning Networks",
      source: "Open Campus Telegram Community",
      opportunityScore: 91,
      angle: "Combining Web3 education credentials with autonomous AI tutors",
      category: "Creator Economy"
    },
    {
      topic: "Shorts Repurposing Engine for Tech Founders",
      source: "X Developer API Signal",
      opportunityScore: 89,
      angle: "How top tech creators turn release notes into viral 30s clips",
      category: "Tech"
    }
  ];

  public async runTrendDiscovery(): Promise<TrendOpportunity> {
    // Select a trend and add timestamp
    const randomIndex = Math.floor(Math.random() * this.mockTrends.length);
    const template = this.mockTrends[randomIndex];
    
    const newOpportunity: TrendOpportunity = {
      id: `opp_${Date.now()}`,
      topic: template.topic || "Trending Topic",
      source: template.source || "X / Reddit Signals",
      opportunityScore: template.opportunityScore || 90,
      angle: template.angle || "Unique creator angle",
      category: template.category || "AI",
      timestamp: "Just now"
    };

    // Write into Minds Memory Store namespace: growth.opportunities
    mindsStore.addOpportunity(newOpportunity);

    mindsStore.addTraceStep({
      id: `step_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentName: "Growth Agent",
      action: "Search & Score Opportunities",
      details: `Identified top trend "${newOpportunity.topic}" (Score: ${newOpportunity.opportunityScore}/100). Written to growth.opportunities memory.`,
      status: "completed"
    });

    return newOpportunity;
  }
}

export const growthAgent = new GrowthAgent();
