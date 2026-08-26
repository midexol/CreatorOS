import React, { useState } from 'react';
import { PlusCircle, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Platform } from '../types';
import { useDashboard } from '../context/DashboardContext';
import { Reveal } from '../components/Reveal';
import { GrowthIcon, ConnectionsIcon } from '../components/Icons';

export const GrowthPage: React.FC = () => {
  const { opportunities, triggerTrendScan, generateDraft, loadDemoData, connectedCount } = useDashboard();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('twitter');

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-panel/40 border border-border2 p-6 rounded-2xl backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <GrowthIcon size={22} className="text-teal" />
              <h1 className="text-xl font-display text-amber">Growth agent</h1>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Polls X public signals, Reddit, and HackerNews live trends. Scores topics 1–100 for virality and niche fit.
            </p>
          </div>
          <button
            onClick={() => triggerTrendScan()}
            className="flex items-center gap-2 bg-amber hover:bg-amber-soft text-[#08090A] font-medium px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Poll fresh trends
          </button>
        </div>
      </Reveal>

      {opportunities.length === 0 ? (
        <Reveal delay={150}>
          <div className="bg-panel/40 border border-border2 p-10 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-6 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-teal/10 border border-teal/25 flex items-center justify-center mx-auto text-teal">
              <ConnectionsIcon size={24} />
            </div>
            <div>
              <h3 className="font-display text-lg text-slate-100 mb-1">No Active Trend Scans</h3>
              <p className="text-xs text-slate-400 font-mono2 leading-relaxed">
                {connectedCount === 0
                  ? 'Connect your social accounts or click "Poll fresh trends" to run automated virality discovery.'
                  : 'Click "Poll fresh trends" to scan X, Reddit, and HackerNews live trend signals.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => triggerTrendScan()}
                className="inline-flex items-center gap-2 bg-amber hover:bg-amber-soft text-[#08090A] font-medium px-4 py-2 rounded-xl text-xs transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Poll Fresh Trends
              </button>
              <Link
                to="/dashboard/connections"
                className="inline-flex items-center gap-2 border border-border2 hover:bg-white/5 text-slate-300 font-medium px-4 py-2 rounded-xl text-xs transition-all"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Connect Accounts
              </Link>
              <button
                onClick={loadDemoData}
                className="inline-flex items-center gap-2 border border-border2 hover:bg-white/5 text-slate-300 font-medium px-4 py-2 rounded-xl text-xs transition-all"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        </Reveal>
      ) : (
        <div className="border-t border-border2">
          {opportunities.map((opp, i) => (
            <Reveal key={opp.id} delay={i * 70}>
              <div className="grid md:grid-cols-[1fr_auto] gap-6 px-1 py-6 border-b border-border2 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-teal/10 text-teal border border-teal/25">
                      {opp.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <GrowthIcon size={14} className="text-emerald2" />
                      <span className="text-xs font-mono text-emerald2">{opp.opportunityScore}/100</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono2">{opp.timestamp}</span>
                  </div>
                  <h3 className="font-display text-base text-slate-50 mb-1.5">{opp.topic}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-amber font-medium">Angle:</strong> {opp.angle}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2 font-mono2">Source: {opp.source}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
                    className="bg-canvas text-xs text-slate-300 border border-border2-strong rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber/50"
                  >
                    <option value="twitter">X / Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube_shorts">YT Shorts</option>
                    <option value="youtube_longform">YouTube Video</option>
                  </select>
                  <button
                    onClick={() => generateDraft(opp, selectedPlatform)}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-border2-strong text-slate-100 text-xs font-medium py-1.5 px-3 rounded-lg transition-all whitespace-nowrap"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Repurpose
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
};
