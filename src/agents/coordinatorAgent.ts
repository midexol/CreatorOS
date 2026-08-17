import { mindsStore } from '../memory/mindsStore';
import { growthAgent } from './growthAgent';
import { contentAgent } from './contentAgent';
import { analyticsAgent } from './analyticsAgent';
import { Platform } from '../types';

export class CoordinatorAgent {
  public name = "Minds Coordinator Agent (Chief of Staff)";

  public async handleUserGoal(goalText: string, targetPlatform: Platform = 'twitter') {
    mindsStore.addTraceStep({
      id: `step_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentName: "Coordinator",
      action: "Goal Received & Parsed",
      details: `User Objective: "${goalText}". Routing task to sub-agents.`,
      status: "completed"
    });

    // 1. Delegate to Growth Agent
    const trend = await growthAgent.runTrendDiscovery();

    // 2. Delegate to Content Agent
    const draft = await contentAgent.generateDraftFromOpportunity(trend, targetPlatform);

    // 3. Delegate to Analytics Agent (Simulated initial tracking)
    await analyticsAgent.recordPostMetrics(`post_${Date.now().toString().slice(-4)}`, targetPlatform, 9.2, 14200);

    return { trend, draft };
  }
}

export const coordinatorAgent = new CoordinatorAgent();
