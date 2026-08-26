import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw, Database } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Reveal } from '../components/Reveal';
import { SettingsIcon, MindsIcon } from '../components/Icons';
import { fetchMindsMemory, ConversationMessage } from '../lib/minds';

export const SettingsPage: React.FC = () => {
  const { profile } = useDashboard();
  const [history, setHistory] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'minds' | 'profile'>('minds');

  useEffect(() => {
    setLoading(true);
    fetchMindsMemory()
      .then((msgs) => setHistory(msgs || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const learnedRules = [
    {
      id: 'rule_1',
      title: 'Contrarian Statement Openers (+36% Engagement Boost)',
      description: 'Minds AI identified that bold, contrarian hooks outperform generic question hooks on X.',
      confidence: '98%',
      appliedCount: 14,
    },
    {
      id: 'rule_2',
      title: 'Short-Form Visual Cues in Brackets (+28% Completion Rate)',
      description: 'Minds AI formats YouTube Shorts scripts with [VISUAL: ...] cues to maximize viewer retention.',
      confidence: '94%',
      appliedCount: 9,
    },
    {
      id: 'rule_3',
      title: 'Single-Sentence Paragraph Spacing (+42% Link Clicks)',
      description: 'Minds AI enforces whitespace paragraph separation for LinkedIn thought-leadership posts.',
      confidence: '96%',
      appliedCount: 12,
    },
  ];

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-2xl text-amber flex items-center gap-2.5">
            <SettingsIcon size={24} className="text-amber" />
            Settings & AI Engine
          </h1>
          <span className="text-xs font-mono2 text-slate-400">System v1.0.0</span>
        </div>
        <p className="text-slate-400 text-sm max-w-xl">
          Manage your Minds AI memory engine configuration, learned creator style rules, and profile settings.
        </p>
      </Reveal>

      {/* Tabs */}
      <Reveal delay={60}>
        <div className="flex items-center gap-3 border-b border-border2 pb-3">
          <button
            onClick={() => setActiveTab('minds')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'minds'
                ? 'bg-amber/20 text-amber border border-amber/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            <MindsIcon size={16} className="text-teal" />
            Minds AI Engine & Memory
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-amber/20 text-amber border border-amber/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber" />
            Creator Profile & Voice
          </button>
        </div>
      </Reveal>

      {activeTab === 'minds' ? (
        <div className="space-y-6">
          <Reveal delay={100}>
            <div className="bg-panel/40 border border-border2 p-6 rounded-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/25 flex items-center justify-center shrink-0">
                    <MindsIcon size={20} className="text-teal" />
                  </div>
                  <div>
                    <h2 className="text-base font-display text-slate-100">Minds AI Engine Status</h2>
                    <p className="text-xs text-slate-400 font-mono2">Powered by @animocabrands/minds-client-lib</p>
                  </div>
                </div>
                <span className="text-xs font-mono uppercase bg-emerald2/10 text-emerald2 border border-emerald2/25 px-3 py-1 rounded-full">
                  ONLINE & ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-canvas/50 p-3.5 rounded-xl border border-border2">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">API Host</div>
                  <div className="text-xs font-mono2 text-slate-200 mt-1">build.hellominds.ai</div>
                </div>
                <div className="bg-canvas/50 p-3.5 rounded-xl border border-border2">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Thread Alias</div>
                  <div className="text-xs font-mono2 text-teal mt-1">repurpose-main</div>
                </div>
                <div className="bg-canvas/50 p-3.5 rounded-xl border border-border2">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Memory Scope</div>
                  <div className="text-xs font-mono2 text-amber mt-1">Multi-Session Persistent</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Learned Memory Rules */}
          <Reveal delay={140}>
            <div className="space-y-3">
              <h2 className="text-sm font-display text-slate-100 flex items-center gap-2">
                <MindsIcon size={16} className="text-amber" />
                Learned Style Rules & Memory Adaptations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {learnedRules.map((rule) => (
                  <div key={rule.id} className="bg-panel/40 border border-border2 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber">{rule.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono2 leading-relaxed">{rule.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      Confidence: <strong className="text-slate-200">{rule.confidence}</strong> | Applied {rule.appliedCount}x
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Server Thread Logs */}
          <Reveal delay={180}>
            <div className="bg-panel/40 border border-border2 p-6 rounded-2xl backdrop-blur-xl space-y-3">
              <h2 className="text-sm font-display text-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-teal" />
                Minds Server Thread Memory Logs
              </h2>
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-4">
                  <RefreshCw className="w-4 h-4 animate-spin text-teal" />
                  Loading thread memory from hellominds.ai…
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((msg, i) => (
                    <div key={i} className="p-3 bg-canvas/60 border border-border2 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Role: {msg.role}</span>
                        <span>{msg.timestamp || 'Synced'}</span>
                      </div>
                      <p className="text-slate-300 font-mono2 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-mono2 py-2">
                  Thread memory active. Feedback messages record to hellominds.ai whenever you approve content drafts.
                </p>
              )}
            </div>
          </Reveal>
        </div>
      ) : (
        <Reveal delay={100}>
          <div className="bg-panel/40 border border-border2 p-6 rounded-2xl backdrop-blur-xl space-y-4">
            <h2 className="text-base font-display text-slate-100">Creator Profile & Brand Voice</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Creator Name</label>
                <input
                  type="text"
                  readOnly
                  value={profile.name}
                  className="w-full bg-canvas border border-border2 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Brand Voice Directives</label>
                <input
                  type="text"
                  readOnly
                  value={profile.brandVoice}
                  className="w-full bg-canvas border border-border2 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
};
