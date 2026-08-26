import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, UserCheck } from 'lucide-react';
import { OrbitMark } from './OrbitMark';
import { AuthModal } from './AuthModal';
import { useDashboard } from '../context/DashboardContext';

export const Nav: React.FC = () => {
  const { user } = useDashboard();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-canvas/70 border-b border-border2">
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

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-xs font-semibold bg-amber text-[#08090A] px-4 py-2 rounded-xl hover:bg-amber-soft transition-colors shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                Go to Dashboard ({user.name})
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className="text-xs font-medium text-slate-300 hover:text-slate-100 px-3 py-2 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-amber text-[#08090A] px-4 py-2 rounded-xl hover:bg-amber-soft transition-colors shadow-sm"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};
