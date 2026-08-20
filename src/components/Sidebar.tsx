import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, TrendingUp, PenLine, BarChart3, Link2, ArrowLeft } from 'lucide-react';
import { OrbitMark } from './OrbitMark';
import { PanelTexture } from './PanelTexture';

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/coordinator', label: 'Coordinator', icon: Bot },
  { to: '/dashboard/growth', label: 'Growth agent', icon: TrendingUp },
  { to: '/dashboard/content', label: 'Content agent', icon: PenLine },
  { to: '/dashboard/analytics', label: 'Analytics agent', icon: BarChart3 },
  { to: '/dashboard/connections', label: 'Connections', icon: Link2 },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="relative w-60 shrink-0 border-r border-border2 h-screen sticky top-0 flex flex-col bg-panel/60 backdrop-blur-md overflow-hidden">
      <PanelTexture />
      <Link to="/" className="relative h-16 flex items-center gap-2.5 px-5 border-b border-border2 hover:bg-white/[0.03] transition-colors">
        <OrbitMark size={26} animate={false} />
        <span className="font-display text-sm">
          Creator<span className="text-amber font-semibold">OS</span>
        </span>
      </Link>

      <nav className="relative flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors border-l-2 ${
                  isActive
                    ? 'text-slate-50 border-amber bg-white/[0.04]'
                    : 'text-slate-400 border-transparent hover:text-slate-100 hover:bg-white/[0.03]'
                }`
              }
            >
              <Icon size={16} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="relative px-3 pb-4">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-100 hover:bg-white/[0.04] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    </aside>
  );
};
