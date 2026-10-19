import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  Key,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMess } from '../context/MessContext';
import { useLanguage } from '../context/LanguageContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { addMember, createNewMess, mess } = useMess();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Read URL query params (e.g. ?code=SAIKAT2026)
  const queryParams = new URLSearchParams(window.location.search);
  const initialCode = queryParams.get('code') || '';

  const [mode, setMode] = useState(initialCode ? 'join' : 'create'); // 'create' or 'join'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    messName: '',
    inviteCode: initialCode
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('দয়া করে আপনার পূর্ণ নাম লিখুন');
      return;
    }
    if (formData.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('দুই পাসওয়ার্ড মেলেনি! পুনরায় যাচাই করুন');
      return;
    }

    setLoading(true);

    try {
      const role = mode === 'create' ? 'manager' : 'member';

      // 1. Register with auth system
      const res = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role
      });

      if (res.success) {
        if (mode === 'create') {
          // Manager creates a fresh new mess with zero balance and zero members!
          await createNewMess({
            messName: formData.messName || 'আমাদের মেস',
            managerUser: res.user
          });
        } else {
          // Resident joins existing mess with invite code
          await addMember({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            role: 'member',
            status: 'active'
          });
        }

        // Navigate to dashboard with fresh clean slate or joined mess
        navigate('/dashboard');
      } else {
        setError(res.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setError(err.message || 'একটি ত্রুটি ঘটেছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
          <span className="font-bold text-slate-900 text-xl tracking-tight">
            Smart Mess <span className="text-rose-500">Manager</span>
          </span>
        </Link>
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-slate-900">
          নতুন একাউন্ট সাইন আপ করুন
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          ইতিমধ্যে একাউন্ট আছে?{' '}
          <Link to="/login" className="font-semibold text-rose-500 hover:text-rose-600">
            লগইন করুন
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10">
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'create'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              নতুন মেস খুলুন (Manager)
            </button>
            <button
              type="button"
              onClick={() => setMode('join')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'join'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              কোড দিয়ে যোগ দিন (Member)
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                আপনার পূর্ণ নাম *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ সাইফুল ইসলাম"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ইমেইল এড্রেস *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@univ.edu.bd"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  মোবাইল / বিকাশ নম্বর *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Mess Name or Invite Code */}
            {mode === 'create' ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  মেসের নাম *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: পদ্মা হল এক্সটেনশন মেস"
                    value={formData.messName}
                    onChange={(e) => setFormData({ ...formData, messName: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  মেস ইনভাইট কোড *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: SAIKAT2026"
                    value={formData.inviteCode}
                    onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none font-mono font-bold tracking-wider"
                  />
                </div>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  পাসওয়ার্ড নিশ্চিত করুন *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-xs text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'একাউন্ট তৈরি হচ্ছে...' : 'সাইন আপ সম্পন্ন করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
