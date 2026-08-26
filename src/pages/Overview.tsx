import React, { useState } from 'react';
import { Send, RefreshCw, Zap } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Reveal } from '../components/Reveal';
import { OverviewIcon } from '../components/Icons';

const suggestions = [
  'Grow my YouTube channel',
  'Get more engagement on X',
  'Prepare LinkedIn thought-leadership posts',
];

export const Overview: React.FC = () => {
  const {
    profile,
    opportunities,
    drafts,
    connectedCount,
    isExecuting,
    runGoal,
    loadDemoData,
    resetToFresh,
  } = useDashboard();
  const [goalInput, setGoalInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    const value = goalInput;
    setGoalInput('');
    await runGoal(value);
  };

  const submitSuggestion = async (text: string) => {
    if (isExecuting) return;
    await runGoal(text);
  };

  const pendingCount = drafts.filter((d) => d.status === 'pending_approval').length;
  const isEmpty = opportunities.length === 0 && drafts.length === 0;

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="flex items-center gap-2.5 mb-2">
          <OverviewIcon size={24} className="text-amber" />
          <h1 className="font-display text-2xl text-amber">Overview</h1>
        </div>
        <p className="text-slate-400 text-sm max-w-xl">
          Tell CreatorOS what you're trying to grow. It finds the opportunity, drafts the content,
          and gets it ready for your approval.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid grid-cols-3 border-y border-border2">
          <div className="px-1 py-5 border-r border-border2">
            <p className="text-2xl font-display">{opportunities.length}</p>
            <p className="text-slate-500 text-xs font-mono2 mt-1">opportunities found</p>
          </div>
          <div className="px-6 py-5 border-r border-border2">
            <p className="text-2xl font-display">{pendingCount}</p>
            <p className="text-slate-500 text-xs font-mono2 mt-1">drafts awaiting approval</p>
          </div>
          <div className="px-6 py-5">
            <p className="text-2xl font-display">{connectedCount}<span className="text-slate-500">/4</span></p>
            <p className="text-slate-500 text-xs font-mono2 mt-1">accounts connected</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div className="bg-panel/40 border border-border2 p-6 rounded-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-display text-slate-50">What's your goal today?</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-canvas/60 px-3 py-1.5 rounded-xl border border-border2">
              <Zap className="w-4 h-4 text-amber" />
              <span>Voice: <strong className="text-slate-200">{profile.brandVoice.split(',')[0]}</strong></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g. 'Help me grow my YouTube channel this week'"
              className="flex-1 bg-canvas border border-border2-strong focus:border-amber/50 rounded-xl px-5 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isExecuting}
              className="flex items-center gap-2 bg-amber hover:bg-amber-soft text-[#08090A] font-medium px-6 py-3.5 rounded-xl text-xs transition-all disabled:opacity-50 shadow-sm"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Working on it…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Start
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => submitSuggestion(s)}
                disabled={isExecuting}
                className="text-xs text-slate-400 border border-border2-strong rounded-full px-3 py-1 hover:text-slate-100 hover:border-white/25 transition-colors disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {isEmpty ? (
        <Reveal delay={180}>
          <p className="text-xs text-slate-500">
            Nothing here yet — that's expected for a new account.{' '}
            <button onClick={loadDemoData} className="text-amber hover:underline">
              Load sample data
            </button>{' '}
            if you just want to look around.
          </p>
        </Reveal>
      ) : (
        <Reveal delay={180}>
          <p className="text-xs text-slate-500">
            Testing with sample data?{' '}
            <button onClick={resetToFresh} className="text-amber hover:underline">
              Reset to a fresh account
            </button>
            . This clears local data — it doesn't affect anything published live.
          </p>
        </Reveal>
      )}
    </div>
  );
};
