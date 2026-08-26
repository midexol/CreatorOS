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

    // 1. Delegate to Growth Agent (Fetches real live trend)
    const trend = await growthAgent.runTrendDiscovery();

    // 2. Delegate to Content Agent (Generates memory-adapted draft)
    const draft = await contentAgent.generateDraftFromOpportunity(trend, targetPlatform);

    // 3. Delegate to Analytics Agent (Computes metrics dynamically from trend score)
    const computedViews = Math.floor(trend.opportunityScore * 140 + Math.random() * 2000);
    const computedEngagement = Number((trend.opportunityScore / 10.5).toFixed(1));

    await analyticsAgent.recordPostMetrics(
      `post_${Date.now().toString().slice(-4)}`,
      targetPlatform,
      computedEngagement,
      computedViews,
      draft.hook,
      'Contrarian'
    );

    return { trend, draft };
  }
}

export const coordinatorAgent = new CoordinatorAgent();
