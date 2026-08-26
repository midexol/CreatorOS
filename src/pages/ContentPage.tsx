import React, { useState } from 'react';
import { CheckCircle, Send, Sparkles, AlertCircle } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Reveal } from '../components/Reveal';
import { ContentIcon, XIcon, LinkedInIcon, YouTubeIcon } from '../components/Icons';
import { Platform } from '../types';

const platformLabel: Record<string, string> = {
  twitter: 'X / Twitter thread',
  linkedin: 'LinkedIn post',
  youtube_shorts: 'YT Shorts script',
  youtube_longform: 'YouTube Longform Video',
};

const PlatformBadgeLogo: React.FC<{ platformId: Platform }> = ({ platformId }) => {
  if (platformId === 'twitter') return <XIcon size={12} className="text-white inline mr-1.5" />;
  if (platformId === 'linkedin') return <LinkedInIcon size={12} className="text-[#0A66C2] inline mr-1.5" />;
  return <YouTubeIcon size={12} className="text-[#FF0000] inline mr-1.5" />;
};

export const ContentPage: React.FC = () => {
  const { drafts, approveDraft, manualGenerate } = useDashboard();
  const [customInput, setCustomInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const value = customInput;
    setCustomInput('');
    await manualGenerate(value);
  };

  const pendingCount = drafts.filter((d) => d.status === 'pending_approval').length;

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="bg-panel/40 border border-border2 p-6 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <ContentIcon size={22} className="text-amber" />
            <h1 className="text-xl font-display text-amber">Content agent</h1>
          </div>
          <p className="text-xs text-slate-400 mb-4 max-w-xl">
            Paste a video script, transcript, or article link. The Content agent reads performance
            memory to adapt hook styles before formatting native posts for X, LinkedIn, YouTube Shorts, and YouTube Longform.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. Paste transcript: 'In this video we talk about Minds agent memory namespaces...'"
              className="flex-1 bg-canvas border border-border2-strong focus:border-amber/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-amber hover:bg-amber-soft text-[#08090A] font-medium px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Repurpose
            </button>
          </form>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base text-slate-50">Drafts awaiting approval</h2>
          <span className="text-xs font-mono2 text-slate-400">{pendingCount} pending</span>
        </div>
      </Reveal>

      <div className="border-t border-border2">
        {drafts.map((draft, i) => (
          <Reveal key={draft.id} delay={i * 70}>
            <div className="grid md:grid-cols-[1fr_auto] gap-6 px-1 py-6 border-b border-border2 items-start">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-teal/10 text-teal border border-teal/25">
                    <PlatformBadgeLogo platformId={draft.platform} />
                    {platformLabel[draft.platform]}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      draft.status === 'published'
                        ? 'bg-emerald2/10 text-emerald2 border-emerald2/25'
                        : 'bg-amber/10 text-amber border-amber/25'
                    }`}
                  >
                    {draft.status === 'published' ? 'Published' : 'Pending approval'}
                  </span>
                </div>

                <div className="bg-canvas/50 p-3.5 rounded-xl border border-border2">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">Memory-optimized hook</div>
                  <p className="text-xs font-medium text-amber">{draft.hook}</p>
                </div>

                <div className="bg-canvas/30 p-3.5 rounded-xl border border-border2">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">Body</div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap font-mono2 leading-relaxed">{draft.body}</p>
                </div>

                {draft.cta && (
                  <div className="text-[11px] text-slate-300 bg-white/[0.03] p-2.5 rounded-lg border border-border2">
                    <strong className="text-slate-100">CTA:</strong> {draft.cta}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end justify-between gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                  <AlertCircle className="w-3.5 h-3.5 text-teal" />
                  <span>Virality: <strong className="text-slate-100">{draft.predictedPerformanceScore}%</strong></span>
                </div>

                {draft.status === 'pending_approval' ? (
                  <button
                    onClick={() => approveDraft(draft.id)}
                    className="flex items-center gap-1.5 bg-amber hover:bg-amber-soft text-[#08090A] text-xs font-medium py-2 px-4 rounded-xl transition-all whitespace-nowrap shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & publish
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-emerald2 font-medium whitespace-nowrap">
                    <Send className="w-3.5 h-3.5" />
                    Live on platform
                  </span>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};
