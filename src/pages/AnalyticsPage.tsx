import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Reveal } from '../components/Reveal';
import { AnalyticsIcon, XIcon, LinkedInIcon, YouTubeIcon } from '../components/Icons';
import { Platform } from '../types';

const PlatformMetricLogo: React.FC<{ platformId: Platform }> = ({ platformId }) => {
  if (platformId === 'twitter') return <XIcon size={12} className="text-white inline mr-1" />;
  if (platformId === 'linkedin') return <LinkedInIcon size={12} className="text-[#0A66C2] inline mr-1" />;
  return <YouTubeIcon size={12} className="text-[#FF0000] inline mr-1" />;
};

export const AnalyticsPage: React.FC = () => {
  const { metrics } = useDashboard();

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="bg-panel/40 border border-border2 p-6 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2.5 mb-2">
            <AnalyticsIcon size={22} className="text-amber" />
            <h1 className="text-2xl font-display text-amber">Analytics agent</h1>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4 max-w-xl">
            After a post goes live, this checks how it performed and uses that to make your next
            draft's hook even better — so CreatorOS gets sharper the more you use it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-canvas/50 p-3 rounded-xl border border-border2">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Avg engagement</div>
              <div className="text-lg font-display text-emerald2">9.7% (+36%)</div>
            </div>
            <div className="bg-canvas/50 p-3 rounded-xl border border-border2">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Learning status</div>
              <div className="text-lg font-display text-teal">Active</div>
            </div>
            <div className="bg-canvas/50 p-3 rounded-xl border border-border2">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Recent adaptation</div>
              <div className="text-lg font-display text-amber">Contrarian + visual</div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base text-slate-50 flex items-center gap-2">
            <AnalyticsIcon size={18} className="text-emerald2" />
            Recent post performance
          </h2>
        </div>
      </Reveal>

      <div className="border-t border-border2">
        {metrics.map((metric, i) => (
          <Reveal key={metric.postId + i} delay={i * 70}>
            <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 px-1 py-5 border-b border-border2 items-center">
              <div>
                <span className="inline-flex items-center text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-white/5 text-slate-300 border border-border2">
                  <PlatformMetricLogo platformId={metric.platform} />
                  {metric.platform}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 font-mono2">{metric.timestamp}</p>
              </div>

              <div>
                <div className="text-xs text-slate-400">{metric.hookStyle}</div>
                <p className="text-xs text-emerald2 leading-relaxed mt-1">
                  {metric.insight}
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0 text-right">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">Views</div>
                  <div className="text-xs font-medium text-slate-100">{metric.views.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">Engagement</div>
                  <div className="text-xs font-medium text-emerald2">{metric.engagementRate}%</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};
