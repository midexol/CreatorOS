import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const GoogleLogo: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signup' }) => {
  const { signupWithEmail, loginWithEmail, loginWithGoogle } = useDashboard();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (!email.trim() || !password.trim()) throw new Error('Please enter email and password');
        await signupWithEmail(name, email, password);
      } else {
        if (!email.trim() || !password.trim()) throw new Error('Please enter email and password');
        await loginWithEmail(email, password);
      }
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-border2 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border2 pb-3">
          <div>
            <h2 className="text-lg font-display text-slate-50">
              {mode === 'signup' ? 'Create your CreatorOS account' : 'Welcome back to CreatorOS'}
            </h2>
            <p className="text-xs text-slate-400 font-mono2">
              {mode === 'signup'
                ? 'Sign up to manage multi-platform AI scheduling'
                : 'Sign in to access your agents and content planner'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 transition-colors rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono2">
            {error}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-canvas border border-border2 hover:border-amber/40 hover:bg-white/[0.04] text-slate-200 font-medium py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
        >
          <GoogleLogo size={18} />
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-border2" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">Or with email</span>
          <div className="flex-1 h-px bg-border2" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-canvas border border-border2 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber/50 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@domain.com"
                className="w-full bg-canvas border border-border2 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber/50 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-canvas border border-border2 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber/50 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber hover:bg-amber-soft text-[#08090A] font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm disabled:opacity-50 mt-2"
          >
            <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="text-center pt-2 border-t border-border2">
          {mode === 'signup' ? (
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-amber hover:underline font-medium ml-1"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-amber hover:underline font-medium ml-1"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
