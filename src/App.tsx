import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DelegationTrace } from './components/DelegationTrace';
import { GrowthTab } from './components/GrowthTab';
import { ContentTab } from './components/ContentTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { MemoryInspector } from './components/MemoryInspector';
import { TeamRolesModal } from './components/TeamRolesModal';
import { mindsStore } from './memory/mindsStore';
import { coordinatorAgent } from './agents/coordinatorAgent';
import { growthAgent } from './agents/growthAgent';
import { contentAgent } from './agents/contentAgent';
import { analyticsAgent } from './agents/analyticsAgent';
import { TabType, Platform, TrendOpportunity } from './types';
import { Sparkles, Send, RefreshCw, Zap, Cpu, Database } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // Trigger state refresh
  const [, setTick] = useState(0);
  const refreshState = () => setTick(t => t + 1);

  const profile = mindsStore.getProfile();
  const opportunities = mindsStore.getOpportunities();
  const drafts = mindsStore.getDrafts();
  const metrics = mindsStore.getPerformanceHistory();
  const trace = mindsStore.getDelegationTrace();

  // Handlers
  const handleRunGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim() || isExecuting) return;

    setIsExecuting(true);
    await coordinatorAgent.handleUserGoal(goalInput);
    setGoalInput('');
    setIsExecuting(false);
    refreshState();
  };

  const handleTriggerTrendScan = async () => {
    await growthAgent.runTrendDiscovery();
    refreshState();
  };

  const handleGenerateDraft = async (opp: TrendOpportunity, platform: Platform) => {
    await contentAgent.generateDraftFromOpportunity(opp, platform);
    setActiveTab('repurpose');
    refreshState();
  };

  const handleApproveDraft = async (draftId: string) => {
    mindsStore.updateDraftStatus(draftId, 'published');
    // Also trigger analytics agent to record metric
    await analyticsAgent.recordPostMetrics(`post_${Date.now().toString().slice(-4)}`, 'twitter', 9.8, 18500);
    refreshState();
  };

  const handleManualGenerate = async (input: string) => {
    const mockOpp: TrendOpportunity = {
      id: `opp_${Date.now()}`,
      topic: input,
      source: "Manual Creator Input",
      opportunityScore: 92,
      angle: "Repurposed from creator notes",
      category: "Tech",
      timestamp: "Just now"
    };
    await contentAgent.generateDraftFromOpportunity(mockOpp, 'twitter');
    refreshState();
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cognitionCredits={profile.cognitionCredits}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">

        {/* Top Coordinator Goal Input Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Coordinator Agent Active
                </span>
                <span className="text-xs text-slate-400">Creator: {profile.name}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
                What is your audience objective today?
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Voice: <strong className="text-slate-200">{profile.brandVoice.split(',')[0]}</strong></span>
            </div>
          </div>

          <form onSubmit={handleRunGoal} className="flex gap-3">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g. 'Find high-virality AI trend topics and prepare Twitter & LinkedIn content drafts for this week'"
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl px-5 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
            />

            <button
              type="submit"
              disabled={isExecuting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-6 py-3.5 rounded-2xl text-xs shadow-xl shadow-blue-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Orchestrating Agents...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Execute Goal
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DelegationTrace steps={trace} />
            </div>

            <div className="space-y-6">
              {/* Quick Status Cards */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-['Outfit']">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  Active Minds Agents (4 Built)
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-white">Coordinator Agent</div>
                      <div className="text-[10px] text-slate-400">Routes intent & tools</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Person 1</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-white">Growth Agent</div>
                      <div className="text-[10px] text-slate-400">Polled 3 trends</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Person 2</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-white">Content Agent</div>
                      <div className="text-[10px] text-slate-400">3 drafts formatted</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Person 3</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-xs font-bold text-white">Analytics Agent</div>
                      <div className="text-[10px] text-slate-400">Persistence feedback live</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Person 4</span>
                  </div>
                </div>
              </div>

              {/* Memory namespaces quick preview */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-['Outfit']">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Minds Memory Keys
                  </h3>
                  <button
                    onClick={() => setActiveTab('memory')}
                    className="text-[10px] text-blue-400 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-purple-300">creator.profile</span>
                    <span className="text-emerald-400 font-bold">1 key</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-purple-300">growth.opportunities</span>
                    <span className="text-emerald-400 font-bold">{opportunities.length} items</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-purple-300">content.drafts</span>
                    <span className="text-emerald-400 font-bold">{drafts.length} drafts</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-purple-300">analytics.performance_history</span>
                    <span className="text-emerald-400 font-bold">{metrics.length} metrics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <GrowthTab
            opportunities={opportunities}
            onTriggerTrendScan={handleTriggerTrendScan}
            onGenerateDraft={handleGenerateDraft}
          />
        )}

        {activeTab === 'repurpose' && (
          <ContentTab
            drafts={drafts}
            onApproveDraft={handleApproveDraft}
            onManualGenerate={handleManualGenerate}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab metrics={metrics} />
        )}

        {activeTab === 'memory' && (
          <MemoryInspector
            profile={profile}
            opportunities={opportunities}
            drafts={drafts}
            metrics={metrics}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>Built for <strong>Creative Minds Jam #1</strong> by Animoca Brands & Open Campus • Powered by <a href="https://hellominds.ai" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Minds Agents</a></p>
      </footer>

      {/* Team Roles Modal */}
      <TeamRolesModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </div>
  );
}
