import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { DelegationTrace } from '../components/DelegationTrace';
import { Reveal } from '../components/Reveal';
import { CoordinatorIcon } from '../components/Icons';

export const CoordinatorPage: React.FC = () => {
  const { trace } = useDashboard();

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex items-center gap-2.5 mb-2">
          <CoordinatorIcon size={24} className="text-amber" />
          <h1 className="font-display text-2xl text-amber">Coordinator</h1>
        </div>
        <p className="text-slate-400 text-sm max-w-xl">
          Holds your goal and calls each agent in order, so you can see exactly how it got to a
          finished draft — not just the end result.
        </p>
      </Reveal>
      <Reveal delay={120}>
        <DelegationTrace steps={trace} />
      </Reveal>
    </div>
  );
};
