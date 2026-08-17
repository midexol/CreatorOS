import React, { useState } from 'react';
import { CreatorProfile, TrendOpportunity, ContentDraft, PerformanceMetric } from '../types';
import { Database, Eye, Key } from 'lucide-react';

interface MemoryInspectorProps {
  profile: CreatorProfile;
  opportunities: TrendOpportunity[];
  drafts: ContentDraft[];
  metrics: PerformanceMetric[];
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({
  profile,
  opportunities,
  drafts,
  metrics
}) => {
  const [activeNamespace, setActiveNamespace] = useState<'profile' | 'growth' | 'content' | 'analytics'>('profile');

  const getNamespaceData = () => {
    switch (activeNamespace) {
      case 'profile':
        return profile;
      case 'growth':
        return opportunities;
      case 'content':
        return drafts;
      case 'analytics':
        return metrics;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-['Outfit']">Minds Memory Namespace Inspector</h2>
            <p className="text-xs text-slate-400">Live view of active Minds multi-agent state keys</p>
          </div>
        </div>

        {/* Namespace tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveNamespace('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeNamespace === 'profile'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            creator.profile
          </button>

          <button
            onClick={() => setActiveNamespace('growth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeNamespace === 'growth'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            growth.opportunities
          </button>

          <button
            onClick={() => setActiveNamespace('content')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeNamespace === 'content'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            content.drafts
          </button>

          <button
            onClick={() => setActiveNamespace('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeNamespace === 'analytics'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            analytics.performance_history
          </button>
        </div>
      </div>

      {/* JSON Viewer */}
      <div className="relative">
        <div className="flex items-center justify-between bg-slate-950 px-4 py-2 rounded-t-xl border border-slate-800 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-purple-400" />
            Namespace Key: <strong className="text-purple-300">{activeNamespace}</strong>
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Eye className="w-3 h-3" />
            Read/Write Verified
          </span>
        </div>

        <pre className="bg-slate-950/90 border-x border-b border-slate-800 p-4 rounded-b-xl overflow-x-auto text-xs font-mono text-purple-300 leading-relaxed max-h-96">
          {JSON.stringify(getNamespaceData(), null, 2)}
        </pre>
      </div>
    </div>
  );
};
