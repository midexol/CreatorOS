import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { OrbitMark } from './OrbitMark';
import { UserProfileSidebar } from './ui/menu';
import { useDashboard } from '../context/DashboardContext';
import {
  OverviewIcon,
  CoordinatorIcon,
  GrowthIcon,
  ContentIcon,
  AnalyticsIcon,
  ConnectionsIcon,
  SettingsIcon,
} from './Icons';

export const Sidebar: React.FC = () => {
  const { user, logout } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  const userProfile = {
    name: user?.name || 'Alex Creator',
    email: user?.email || 'creator@creatoros.ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  };

  const navItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: <OverviewIcon size={16} />,
      isActive: location.pathname === '/dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      label: 'Coordinator',
      href: '/dashboard/coordinator',
      icon: <CoordinatorIcon size={16} />,
      isActive: location.pathname === '/dashboard/coordinator',
      onClick: () => navigate('/dashboard/coordinator'),
    },
    {
      label: 'Growth agent',
      href: '/dashboard/growth',
      icon: <GrowthIcon size={16} />,
      isActive: location.pathname === '/dashboard/growth',
      onClick: () => navigate('/dashboard/growth'),
    },
    {
      label: 'Content agent',
      href: '/dashboard/content',
      icon: <ContentIcon size={16} />,
      isActive: location.pathname === '/dashboard/content',
      onClick: () => navigate('/dashboard/content'),
    },
    {
      label: 'Analytics agent',
      href: '/dashboard/analytics',
      icon: <AnalyticsIcon size={16} />,
      isActive: location.pathname === '/dashboard/analytics',
      onClick: () => navigate('/dashboard/analytics'),
    },
    {
      label: 'Connections',
      href: '/dashboard/connections',
      icon: <ConnectionsIcon size={16} />,
      isActive: location.pathname === '/dashboard/connections',
      onClick: () => navigate('/dashboard/connections'),
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <SettingsIcon size={16} />,
      isActive: location.pathname === '/dashboard/settings',
      onClick: () => navigate('/dashboard/settings'),
      isSeparator: true,
    },
  ];

  const logoutItem = {
    label: 'Sign out',
    icon: <LogOut size={16} />,
    onClick: () => {
      logout();
      navigate('/');
    },
  };

  return (
    <aside className="relative w-64 shrink-0 border-r border-border2 h-screen sticky top-0 flex flex-col bg-panel/60 backdrop-blur-md overflow-hidden p-3 space-y-3">
      <Link to="/" className="flex items-center gap-2.5 px-3 py-2 border-b border-border2 hover:bg-white/[0.03] transition-colors rounded-xl">
        <OrbitMark size={26} animate={false} />
        <span className="font-display text-sm">
          Creator<span className="text-amber font-semibold">OS</span>
        </span>
      </Link>

      <UserProfileSidebar
        user={userProfile}
        navItems={navItems}
        logoutItem={logoutItem}
        className="flex-1 max-w-full bg-transparent border-none p-0 shadow-none"
      />
    </aside>
  );
};
