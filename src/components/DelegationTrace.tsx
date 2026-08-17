import React from 'react';
import { DelegationStep } from '../types';
import { Bot, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface DelegationTraceProps {
  steps: DelegationStep[];
}

export const DelegationTrace: React.FC<DelegationTraceProps> = ({ steps }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Live Agent Delegation Trace
            </h3>
            <p className="text-xs text-slate-400">Coordinator Agent orchestrating sub-agent execution & memory scopes</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Tool Loop Active
        </span>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 pl-6">
        {steps.map((step, idx) => (
          <div key={step.id || idx} className="relative group">
            {/* Timeline node icon */}
            <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              step.status === 'completed'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                : 'bg-blue-950 border-blue-500 text-blue-400 animate-pulse'
            }`}>
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Step card */}
            <div className="bg-slate-950/70 border border-slate-800/80 hover:border-blue-500/30 p-4 rounded-xl transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    step.agentName === 'Coordinator'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : step.agentName === 'Growth Agent'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : step.agentName === 'Content Agent'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {step.agentName}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{step.action}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{step.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                {step.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
