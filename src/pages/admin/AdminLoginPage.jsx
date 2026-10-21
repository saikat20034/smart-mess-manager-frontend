import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_CREDENTIALS } from '../../services/adminService';

export const AdminLoginPage = () => {
  const { loginSuperAdmin, superAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('it24647@mbstu.ac.bd');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated as super admin, redirect to admin dashboard
  React.useEffect(() => {
    if (superAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [superAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginSuperAdmin({ email, password });
    setLoading(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'ভুল অ্যাডমিন ইমেইল অথবা পাসওয়ার্ড!');
    }
  };

  const handleQuickFill = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative font-sans overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/10 to-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Shield */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-950/60 mx-auto mb-4 border border-emerald-400/30">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>MBSTU Super Admin Console</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          সুপার অ্যাডমিন লগইন
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          সমগ্র স্মার্ট মেস ম্যানেজার অ্যাপ্লিকেশনের সেন্ট্রাল মাস্টার কন্ট্রোল
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                অ্যাডমিন ইমেইল এড্রেস (Admin Gmail)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="it24647@mbstu.ac.bd"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                অ্যাডমিন পাসওয়ার্ড (Master Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Fill Test Button */}
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">অনুমোদিত আইডি:</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline flex items-center gap-1"
                title="অ্যাডমিন আইডি ও পাসওয়ার্ড অটো ফিল করুন"
              >
                <KeyRound className="w-3 h-3" />
                <span>অ্যাডমিন ক্রেডেনশিয়াল অটো ফিল</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'যাচাই করা হচ্ছে...' : 'সুপার অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সাধারণ মেস ড্যাশবোর্ডে ফিরে যান</span>
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <p className="mt-4 text-center text-[11px] text-slate-500">
          🔒 এনক্রিপ্টেড সেশন • শুধুমাত্র সমগ্র অ্যাপ্লিকেশনের প্রধান অ্যাডমিনের জন্য
        </p>
      </div>
    </div>
  );
};
