import React from 'react';
import { ArrowUpRight, Link2, AlertTriangle } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Reveal } from '../components/Reveal';

const statusMeta = {
  connected: { dot: 'bg-emerald2', label: 'Connected' },
  connecting: { dot: 'bg-amber animate-pulse', label: 'Redirecting…' },
  disconnected: { dot: 'bg-slate-500', label: 'Not connected' },
};

export const ConnectionsPage: React.FC = () => {
  const { platforms, connectedCount, connectPlatform, disconnectPlatform, zernioConfigured } = useDashboard();

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-2xl text-amber flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Connections
          </h1>
          <span className="text-xs font-mono2 text-slate-400">{connectedCount} connected</span>
        </div>
        <p className="text-slate-400 text-sm max-w-xl">
          Connect the accounts you want CreatorOS to post to. Once connected, approved drafts publish
          for real, and results feed back into your next batch of ideas. The free plan covers your
          first 2 accounts.
        </p>
      </Reveal>

      {zernioConfigured === false && (
        <Reveal>
          <div className="flex items-start gap-3 bg-amber/10 border border-amber/25 rounded-xl p-4">
            <AlertTriangle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
            <p className="text-xs text-amber/90 leading-relaxed">
              Real connections aren't set up yet. This needs a Zernio API key (
              <a href="https://zernio.com/signup" target="_blank" rel="noreferrer" className="underline">
                free to create
              </a>
              ), added as <code className="font-mono2">ZERNIO_API_KEY</code> and{' '}
              <code className="font-mono2">ZERNIO_PROFILE_ID</code> in your Vercel project's environment
              variables. See the README for the full setup.
            </p>
          </div>
        </Reveal>
      )}

      <div className="border-t border-border2">
        {platforms.map((p, i) => {
          const meta = statusMeta[p.status];
          return (
            <Reveal key={p.id} delay={i * 70}>
              <div className="flex items-center justify-between py-5 border-b border-border2">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  <div>
                    <p className="text-sm text-slate-100">{p.name}</p>
                    <p className="text-xs text-slate-500 font-mono2 mt-0.5">{meta.label}</p>
                  </div>
                </div>
                {p.status === 'connected' && (
                  <button
                    onClick={() => disconnectPlatform(p.id)}
                    className="text-xs font-medium text-slate-300 border border-border2-strong px-3.5 py-1.5 rounded-lg hover:text-slate-50 hover:bg-white/[0.05] transition-colors"
                  >
                    Disconnect
                  </button>
                )}
                {p.status === 'disconnected' && (
                  <button
                    onClick={() => connectPlatform(p.id)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-[#08090A] px-3.5 py-1.5 rounded-lg hover:bg-white transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Connect
                  </button>
                )}
                {p.status === 'connecting' && (
                  <span className="text-xs font-mono2 text-slate-500 px-3.5 py-1.5">Redirecting…</span>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};
