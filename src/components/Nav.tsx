import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { OrbitMark } from './OrbitMark';

export const Nav: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-canvas/70 border-b border-border2">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <OrbitMark size={28} animate={false} />
          <span className="font-display text-[15px] tracking-tight">
            Creator<span className="text-amber font-semibold">OS</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#how-it-works" className="hover:text-slate-100 transition-colors">How it works</a>
          <a href="#agents" className="hover:text-slate-100 transition-colors">Agents</a>
        </nav>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm font-medium bg-amber text-[#08090A] px-4 py-2 rounded-lg hover:bg-amber-soft transition-colors"
        >
          Open dashboard
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
};
