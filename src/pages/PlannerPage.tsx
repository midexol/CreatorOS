import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, CheckCircle, Clock, Edit2, Trash2, X, Calendar } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { CalendarIcon, XIcon, LinkedInIcon, YouTubeIcon, InstagramIcon, TikTokIcon, ThreadsIcon } from '../components/Icons';
import { Platform } from '../types';
import { useDashboard } from '../context/DashboardContext';

interface Project {
  id: string;
  name: string;
  clientName: string;
}

interface ScheduledPost {
  id: string;
  projectId: string;
  platform: Platform;
  date: number; // day of month 1-31
  time: string;
  title: string;
  body?: string;
  status: 'scheduled' | 'published' | 'draft';
}

const DEFAULT_PROJECTS: Project[] = [
  { id: 'proj_1', name: 'Personal Creator Brand', clientName: 'Alex Creator' },
  { id: 'proj_2', name: 'TechPulse Media', clientName: 'TechPulse Client' },
  { id: 'proj_3', name: 'Web3 & AI Insights', clientName: 'Animoca Guild' },
];

const INITIAL_SCHEDULED: ScheduledPost[] = [
  { id: 'sch_1', projectId: 'proj_1', platform: 'twitter', date: 26, time: '14:00', title: 'Why persistent AI memory changes creator workflows', body: 'Stateless LLMs forget your context on refresh. Multi-session Minds memory keeps state.', status: 'scheduled' },
  { id: 'sch_2', projectId: 'proj_1', platform: 'linkedin', date: 27, time: '10:30', title: '5 metric-backed lessons from 500 creator posts', body: 'whitespace formatting + contrarian hook = 42% higher click rate.', status: 'scheduled' },
  { id: 'sch_3', projectId: 'proj_2', platform: 'youtube_shorts', date: 28, time: '18:00', title: 'Repurposing 1-hour audio into 10 shorts in 30 seconds', body: '[VISUAL: Quick cuts]\n[AUDIO: Tech synth]\n1. Transcribe\n2. Score hooks', status: 'draft' },
  { id: 'sch_4', projectId: 'proj_1', platform: 'instagram', date: 29, time: '12:00', title: 'Behind the scenes: Multi-agent creator setup', body: 'Building autonomous agents for digital creators in 2026.', status: 'scheduled' },
  { id: 'sch_5', projectId: 'proj_3', platform: 'threads', date: 30, time: '09:00', title: 'Tokenized community rewards vs traditional Patreon', body: 'Replacing monthly fees with token incentives.', status: 'published' },
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
  const { scheduleDraftBackend } = useDashboard();
  const [projects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    try {
      const saved = localStorage.getItem('creator_os_scheduled_posts');
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULED;
    } catch {
      return INITIAL_SCHEDULED;
    }
  });

  useEffect(() => {
    localStorage.setItem('creator_os_scheduled_posts', JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  const [isPlanning, setIsPlanning] = useState(false);

  // Modal / Drawer State for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formPlatform, setFormPlatform] = useState<Platform>('twitter');
  const [formProjectId, setFormProjectId] = useState<string>('proj_1');
  const [formDate, setFormDate] = useState<number>(26);
  const [formTime, setFormTime] = useState<string>('14:00');
  const [formStatus, setFormStatus] = useState<'scheduled' | 'published' | 'draft'>('scheduled');

  const filteredPosts = selectedProjectId === 'all'
    ? scheduledPosts
    : scheduledPosts.filter((p) => p.projectId === selectedProjectId);

  const openCreateModal = (dayDate: number = 26) => {
    setEditingPost(null);
    setFormTitle('');
    setFormBody('');
    setFormPlatform('twitter');
    setFormProjectId(selectedProjectId === 'all' ? 'proj_1' : selectedProjectId);
    setFormDate(dayDate);
    setFormTime('14:00');
    setFormStatus('scheduled');
    setIsModalOpen(true);
  };

  const openEditModal = (post: ScheduledPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormBody(post.body || '');
    setFormPlatform(post.platform);
    setFormProjectId(post.projectId);
    setFormDate(post.date);
    setFormTime(post.time);
    setFormStatus(post.status);
    setIsModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingPost) {
      // Edit existing post
      setScheduledPosts((prev) =>
        prev.map((p) =>
          p.id === editingPost.id
            ? {
                ...p,
                title: formTitle,
                body: formBody,
                platform: formPlatform,
                projectId: formProjectId,
                date: formDate,
                time: formTime,
                status: formStatus,
              }
            : p
        )
      );
    } else {
      // Create new post & trigger backend schedule API
      const newPost: ScheduledPost = {
        id: `sch_${Date.now()}`,
        projectId: formProjectId,
        platform: formPlatform,
        date: formDate,
        time: formTime,
        title: formTitle,
        body: formBody,
        status: formStatus,
      };
      setScheduledPosts((prev) => [...prev, newPost]);

      // Connect to Zernio API backend scheduling
      const isoDate = new Date(2026, 7, formDate, parseInt(formTime.split(':')[0] || '14'), 0).toISOString();
      await scheduleDraftBackend(`${formTitle}\n\n${formBody}`, formPlatform, isoDate);
    }

    setIsModalOpen(false);
  };

  const handleDeletePost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
    setIsModalOpen(false);
  };

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
        body: 'Auto-planned content calendar batch.',
        status: 'scheduled',
      };
      setScheduledPosts((prev) => [...prev, newPost]);
      setIsPlanning(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center justify-between border-b border-border2 pb-4">
          <div>
            <h1 className="font-display text-2xl text-amber flex items-center gap-2.5 mb-1">
              <CalendarIcon size={22} className="text-amber" />
              Content Planner & Visual Calendar
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Organize multi-platform posts, separate content into brand projects, schedule manually, and edit upcoming posts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openCreateModal(26)}
              className="flex items-center gap-1.5 border border-amber/40 bg-amber/10 hover:bg-amber/20 text-amber font-medium px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Schedule Post
            </button>
            <button
              onClick={handleAiPlan}
              disabled={isPlanning}
              className="flex items-center gap-2 bg-amber hover:bg-amber-soft text-[#08090A] font-medium px-4 py-2 rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
            >
              {isPlanning ? 'Planning…' : 'Generate 7-Day Plan'}
            </button>
          </div>
        </div>
      </Reveal>

      {/* Brand & Project Filter Selector */}
      <Reveal delay={50}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 mr-1">Projects:</span>
            <button
              onClick={() => setSelectedProjectId('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedProjectId === 'all'
                  ? 'bg-amber/15 text-amber border border-amber/30'
                  : 'text-slate-400 border border-border2 hover:text-slate-100 hover:bg-white/[0.04]'
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
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                    isSel
                      ? 'border-amber/40 text-amber bg-amber/10'
                      : 'border-border2 text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                  }`}
                >
                  {proj.name} ({count})
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono2 text-slate-500">August 2026</span>
        </div>
      </Reveal>

      {/* Calendar Navigation */}
      <Reveal delay={90}>
        <div className="flex items-center justify-between border-y border-border2 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">August 2026</span>
            <span className="text-xs text-slate-500 font-mono2">• {filteredPosts.length} posts scheduled</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <button className="p-1 rounded-md border border-border2 hover:text-slate-100 hover:bg-white/5">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-md border border-border2 hover:text-slate-100 hover:bg-white/5">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Reveal>

      {/* Visual Calendar Grid (Days 25 - 31 focus) */}
      <Reveal delay={130}>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {[25, 26, 27, 28, 29, 30, 31].map((dayNum) => {
            const dayPosts = filteredPosts.filter((p) => p.date === dayNum);
            const isToday = dayNum === 26;

            return (
              <div
                key={dayNum}
                className={`min-h-[160px] p-3 rounded-xl border flex flex-col justify-between transition-all ${
                  isToday
                    ? 'bg-amber/5 border-amber/35'
                    : 'bg-panel/40 border-border2'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border2">
                  <span className={`text-xs font-mono font-semibold ${isToday ? 'text-amber' : 'text-slate-400'}`}>
                    Aug {dayNum} {isToday && '(Today)'}
                  </span>
                  <button
                    onClick={() => openCreateModal(dayNum)}
                    className="text-slate-500 hover:text-amber transition-colors"
                    title="Schedule post on this date"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  {dayPosts.map((post) => {
                    const proj = projects.find((p) => p.id === post.projectId);
                    return (
                      <div
                        key={post.id}
                        onClick={() => openEditModal(post)}
                        className="p-2.5 rounded-lg bg-canvas/60 border border-border2 text-xs space-y-1 hover:border-amber/40 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="inline-flex items-center gap-1 font-mono text-slate-300">
                            <PlatformMiniLogo platform={post.platform} />
                            {post.time}
                          </span>
                          <div className="flex items-center gap-1">
                            <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity text-amber" />
                            {post.status === 'published' ? (
                              <CheckCircle className="w-3 h-3 text-emerald2" />
                            ) : (
                              <Clock className="w-3 h-3 text-amber" />
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] font-medium text-slate-200 line-clamp-2 leading-snug group-hover:text-amber transition-colors">
                          {post.title}
                        </p>
                        {proj && (
                          <div className="text-[9px] font-mono text-slate-500 truncate">{proj.name}</div>
                        )}
                      </div>
                    );
                  })}
                  {dayPosts.length === 0 && (
                    <button
                      onClick={() => openCreateModal(dayNum)}
                      className="w-full text-[10px] text-slate-600 hover:text-slate-400 font-mono2 text-center py-6 transition-colors"
                    >
                      + Add post
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Manual Schedule & Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-border2 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-border2 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber" />
                <h2 className="text-base font-display text-slate-50">
                  {editingPost ? 'Edit Scheduled Post' : 'Schedule New Post'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Post Title / Hook</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 5 metric-backed lessons for creators"
                  className="w-full bg-canvas border border-border2 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Content Body</label>
                <textarea
                  rows={3}
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="Enter full post copy or script instructions..."
                  className="w-full bg-canvas border border-border2 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber/50 font-mono2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Target Platform</label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as Platform)}
                    className="w-full bg-canvas border border-border2 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="twitter">X / Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube_shorts">YouTube Shorts</option>
                    <option value="youtube_longform">YouTube Video</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="threads">Threads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Project / Brand</label>
                  <select
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value)}
                    className="w-full bg-canvas border border-border2 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Day of Month</label>
                  <select
                    value={formDate}
                    onChange={(e) => setFormDate(Number(e.target.value))}
                    className="w-full bg-canvas border border-border2 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    {[25, 26, 27, 28, 29, 30, 31].map((d) => (
                      <option key={d} value={d}>
                        Aug {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Schedule Time</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="14:00"
                    className="w-full bg-canvas border border-border2 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none font-mono2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-canvas border border-border2 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border2">
                {editingPost ? (
                  <button
                    type="button"
                    onClick={() => handleDeletePost(editingPost.id)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Post
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-100 px-4 py-2 rounded-xl border border-border2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber hover:bg-amber-soft text-[#08090A] font-medium text-xs px-5 py-2 rounded-xl transition-all shadow-sm"
                  >
                    {editingPost ? 'Save Changes' : 'Schedule Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
