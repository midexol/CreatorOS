import React, { useState } from 'react';
import { Sparkles, Plus, Layers, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { CalendarIcon, XIcon, LinkedInIcon, YouTubeIcon, InstagramIcon, TikTokIcon, ThreadsIcon } from '../components/Icons';
import { Platform } from '../types';

interface Project {
  id: string;
  name: string;
  clientName: string;
  badgeColor: string;
}

interface ScheduledPost {
  id: string;
  projectId: string;
  platform: Platform;
  date: number; // day of month 1-31
  time: string;
  title: string;
  status: 'scheduled' | 'published' | 'draft';
}

const DEFAULT_PROJECTS: Project[] = [
  { id: 'proj_1', name: 'Personal Creator Brand', clientName: 'Alex Creator', badgeColor: 'border-amber/40 bg-amber/10 text-amber' },
  { id: 'proj_2', name: 'TechPulse Media', clientName: 'TechPulse Client', badgeColor: 'border-teal/40 bg-teal/10 text-teal' },
  { id: 'proj_3', name: 'Web3 & AI Insights', clientName: 'Animoca Guild', badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-400' },
];

const INITIAL_SCHEDULED: ScheduledPost[] = [
  { id: 'sch_1', projectId: 'proj_1', platform: 'twitter', date: 26, time: '14:00', title: 'Why persistent AI memory changes creator workflows', status: 'scheduled' },
  { id: 'sch_2', projectId: 'proj_1', platform: 'linkedin', date: 27, time: '10:30', title: '5 metric-backed lessons from 500 creator posts', status: 'scheduled' },
  { id: 'sch_3', projectId: 'proj_2', platform: 'youtube_shorts', date: 28, time: '18:00', title: 'Repurposing 1-hour audio into 10 shorts in 30 seconds', status: 'draft' },
  { id: 'sch_4', projectId: 'proj_1', platform: 'instagram', date: 29, time: '12:00', title: 'Behind the scenes: Multi-agent creator setup', status: 'scheduled' },
  { id: 'sch_5', projectId: 'proj_3', platform: 'threads', date: 30, time: '09:00', title: 'Tokenized community rewards vs traditional Patreon', status: 'published' },
];

const PlatformMiniLogo: React.FC<{ platform: Platform }> = ({ platform }) => {
  if (platform === 'twitter') return <XIcon size={12} className="text-white" />;
  if (platform === 'linkedin') return <LinkedInIcon size={12} className="text-[#0A66C2]" />;
  if (platform === 'instagram') return <InstagramIcon size={12} className="text-[#E4405F]" />;
  if (platform === 'tiktok') return <TikTokIcon size={12} className="text-[#00F2FE]" />;
  if (platform === 'threads') return <ThreadsIcon size={12} className="text-slate-200" />;
  return <YouTubeIcon size={12} className="text-[#FF0000]" />;
};

export const PlannerPage: React.FC = () => {
  const [projects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED);
  const [isPlanning, setIsPlanning] = useState(false);

  const filteredPosts = selectedProjectId === 'all'
    ? scheduledPosts
    : scheduledPosts.filter((p) => p.projectId === selectedProjectId);

  const handleAiPlan = () => {
    setIsPlanning(true);
    setTimeout(() => {
      const newPost: ScheduledPost = {
        id: `sch_${Date.now()}`,
        projectId: selectedProjectId === 'all' ? 'proj_1' : selectedProjectId,
        platform: 'twitter',
        date: 31,
        time: '15:00',
        title: 'Minds AI 7-Day Planned Content Batch',
        status: 'scheduled',
      };
      setScheduledPosts((prev) => [...prev, newPost]);
      setIsPlanning(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-amber flex items-center gap-2.5 mb-1">
              <CalendarIcon size={24} className="text-amber" />
              Content Planner & Visual Calendar
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Organize multi-platform posts, separate content into different brand projects, and use AI to plan your content calendar.
            </p>
          </div>

          <button
            onClick={handleAiPlan}
            disabled={isPlanning}
            className="flex items-center gap-2 bg-amber hover:bg-amber-soft text-[#08090A] font-medium px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isPlanning ? 'Minds AI Planning…' : 'AI Generate 7-Day Plan'}
          </button>
        </div>
      </Reveal>

      {/* Brand & Project Filter Selector */}
      <Reveal delay={60}>
        <div className="flex flex-wrap items-center gap-2 bg-panel/40 border border-border2 p-3 rounded-2xl backdrop-blur-xl">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 px-2">
            <Layers className="w-3.5 h-3.5 text-amber" />
            Projects / Clients:
          </span>

          <button
            onClick={() => setSelectedProjectId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedProjectId === 'all'
                ? 'bg-amber/20 text-amber border border-amber/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
            }`}
          >
            All Projects ({scheduledPosts.length})
          </button>

          {projects.map((proj) => {
            const count = scheduledPosts.filter((p) => p.projectId === proj.id).length;
            const isSel = selectedProjectId === proj.id;
            return (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  isSel
                    ? proj.badgeColor
                    : 'border-border2 text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                {proj.name} ({count})
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Visual Calendar Grid Header */}
      <Reveal delay={100}>
        <div className="flex items-center justify-between bg-panel/40 border border-border2 p-4 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-display text-slate-50">August 2026</h2>
            <span className="text-xs font-mono2 text-slate-400">{filteredPosts.length} posts scheduled</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button className="p-1 rounded-lg border border-border2 hover:text-slate-100 hover:bg-white/5">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-lg border border-border2 hover:text-slate-100 hover:bg-white/5">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Reveal>

      {/* Visual Calendar Grid (Days 25 - 31 focus) */}
      <Reveal delay={140}>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {[25, 26, 27, 28, 29, 30, 31].map((dayNum) => {
            const dayPosts = filteredPosts.filter((p) => p.date === dayNum);
            const isToday = dayNum === 26;

            return (
              <div
                key={dayNum}
                className={`min-h-[140px] p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                  isToday
                    ? 'bg-amber/10 border-amber/40 shadow-sm'
                    : 'bg-panel/40 border-border2 backdrop-blur-xl'
                }`}
              >
                <div className="flex items-center justify-between border-b border-border2/60 pb-2 mb-2">
                  <span className={`text-xs font-mono font-semibold ${isToday ? 'text-amber' : 'text-slate-400'}`}>
                    Aug {dayNum} {isToday && '(Today)'}
                  </span>
                  <button className="text-slate-500 hover:text-slate-200">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  {dayPosts.map((post) => {
                    const proj = projects.find((p) => p.id === post.projectId);
                    return (
                      <div
                        key={post.id}
                        className="p-2 rounded-xl bg-canvas/60 border border-border2 text-xs space-y-1 hover:border-amber/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="inline-flex items-center gap-1 font-mono text-slate-300">
                            <PlatformMiniLogo platform={post.platform} />
                            {post.time}
                          </span>
                          {post.status === 'published' ? (
                            <CheckCircle className="w-3 h-3 text-emerald2" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber" />
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-slate-200 line-clamp-2">{post.title}</p>
                        {proj && (
                          <div className="text-[9px] font-mono text-slate-500 truncate">{proj.name}</div>
                        )}
                      </div>
                    );
                  })}
                  {dayPosts.length === 0 && (
                    <div className="text-[10px] text-slate-600 font-mono2 text-center py-4">No posts scheduled</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
};
