import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  User,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

export const LoginPage = () => {
  const { login, loginAsManager, loginAsMember, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login({ email, password });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid email or password');
    }
  };

  const handleDemoManager = () => {
    loginAsManager();
    navigate('/dashboard');
  };

  const handleDemoMember = () => {
    loginAsMember();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors duration-200">
      {/* Top Right Day/Night Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="sm" showLabel={false} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">
            Smart Mess <span className="text-emerald-500 dark:text-emerald-400">Manager</span>
          </span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in to your mess
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Or{' '}
          <Link to="/register" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
            register a new mess or join with invite code
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl border border-slate-100 dark:border-slate-800 sm:rounded-2xl sm:px-10">
          {/* Quick 1-Click Demo Buttons */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-100 dark:border-emerald-800/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Instant Demo Mode (No Setup Required)</span>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-200 mb-3 leading-relaxed">
              Explore the fully functional application with sample Bangladeshi mess data immediately:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoManager}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>As Manager</span>
              </button>
              <button
                type="button"
                onClick={handleDemoMember}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>As Resident</span>
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 dark:text-slate-500 font-medium">Or continue with credentials</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="tanvir@du.ac.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-emerald-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-emerald-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
