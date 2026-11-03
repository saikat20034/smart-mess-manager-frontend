import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMess } from '../context/MessContext';
import { useLanguage } from '../context/LanguageContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { STORAGE_KEYS } from '../services/storageService';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { sendVerificationOTP, verifyOTP } from '../services/emailVerificationService';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email verification states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resending OTP code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Send verification code to email
  const handleSendOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setOtpError('দয়া করে প্রথমে একটি সঠিক ইমেইল এড্রেস লিখুন');
      return;
    }

    setOtpError('');
    setOtpNotice('');
    setIsSendingOtp(true);

    try {
      const res = await sendVerificationOTP({
        email: formData.email,
        name: formData.name || 'মেস মেম্বার'
      });
      setOtpSent(true);
      setResendCooldown(60);
      setOtpNotice(res.message || 'আপনার ইমেইলে ৬ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে!');
      if (res.previewCode) {
        console.log(`[VERIFICATION CODE PREVIEW]: ${res.previewCode}`);
      }
    } catch (err) {
      setOtpError(err.message || 'ভেরিফিকেশন কোড পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify entered 6-digit OTP code
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpError('দয়া করে ইমেইলে পাওয়া ৬ ডিজিটের কোডটি লিখুন');
      return;
    }

    setOtpError('');
    setIsVerifyingOtp(true);

    try {
      const res = await verifyOTP({
        email: formData.email,
        code: otpCode.trim()
      });

      if (res.success && res.verified) {
        setIsEmailVerified(true);
        setOtpNotice('ইমেইল সফলভাবে ভেরিফাইড হয়েছে! ✓');
        setOtpError('');
      } else {
        setOtpError(res.error || 'ভুল কোড! দয়া করে সঠিক কোড দিন।');
      }
    } catch (err) {
      setOtpError(err.message || 'ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('দয়া করে আপনার পূর্ণ নাম লিখুন');
      return;
    }
    if (!isEmailVerified) {
      setError('দয়া করে সাইন আপ সম্পন্ন করতে প্রথমে আপনার ইমেইলটি ভেরিফাই করুন! (কোড পাঠান বাটনে ক্লিক করে ইমেইলের কোডটি যাচাই করুন)');
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

    if (mode === 'join' && !formData.inviteCode.trim()) {
      setError('দয়া করে মেসের ইনভাইট কোডটি লিখুন');
      return;
    }

    setLoading(true);

    try {
      const role = mode === 'create' ? 'manager' : 'member';

      // 1. Look up mess if joining
      let targetMess = null;
      if (mode === 'join') {
        const cleanCode = formData.inviteCode.trim().toUpperCase();

        let tableMissing = false;
        if (isSupabaseConfigured && supabase) {
          try {
            const { data, error: sbErr } = await supabase
              .from('messes')
              .select('*')
              .eq('invite_code', cleanCode)
              .maybeSingle();
            if (sbErr && sbErr.code === 'PGRST205') {
              tableMissing = true;
            } else if (!sbErr && data) {
              targetMess = data;
            }
          } catch (e) {}
        }

        if (tableMissing) {
          setError('Supabase ডাটাবেসে এখনও টেবিল তৈরি করা হয়নি! দয়া করে Supabase SQL Editor-এ schema.sql রান করুন।');
          setLoading(false);
          return;
        }

        if (!targetMess && typeof localStorage !== 'undefined') {
          const rawActive = localStorage.getItem(STORAGE_KEYS.MESS);
          if (rawActive) {
            try {
              const act = JSON.parse(rawActive);
              if (act.invite_code && act.invite_code.toUpperCase() === cleanCode) {
                targetMess = act;
              }
            } catch (e) {}
          }
        }

        if (!targetMess && typeof localStorage !== 'undefined') {
          const rawAll = localStorage.getItem(STORAGE_KEYS.ALL_MESSES);
          if (rawAll) {
            try {
              const list = JSON.parse(rawAll);
              if (Array.isArray(list)) {
                targetMess = list.find(
                  (m) => m.invite_code && m.invite_code.toUpperCase() === cleanCode
                );
              }
            } catch (e) {}
          }
        }

        if (!targetMess) {
          setError(`ইনভাইট কোড "${cleanCode}" সঠিক নয়! কোনো সক্রিয় মেস পাওয়া যায়নি।`);
          setLoading(false);
          return;
        }
      }

      // 2. Register with auth system
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
          if (targetMess && typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.MESS, JSON.stringify(targetMess));
            localStorage.removeItem('smm_active_mess_deleted');
          }

          await addMember({
            id: res.user.id,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            role: 'member',
            status: 'active',
            avatar: res.user.avatar,
            mess_id: targetMess?.id,
            mess_name: targetMess?.name,
            invite_code: targetMess?.invite_code
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative transition-colors duration-200">
      {/* Top Right Day/Night Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="sm" showLabel={false} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">
            Smart Mess <span className="text-rose-500">Manager</span>
          </span>
        </Link>
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          নতুন একাউন্ট সাইন আপ করুন
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          ইতিমধ্যে একাউন্ট আছে?{' '}
          <Link to="/login" className="font-semibold text-rose-500 hover:text-rose-600">
            লগইন করুন
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl border border-slate-100 dark:border-slate-800 sm:rounded-2xl sm:px-10">
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'create'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              নতুন মেস খুলুন (Manager)
            </button>
            <button
              type="button"
              onClick={() => setMode('join')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'join'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              কোড দিয়ে যোগ দিন (Member)
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-rose-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            {/* Email with Verification & Phone */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email Address with Verify Button */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      ইমেইল এড্রেস *
                    </label>
                    {isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ভেরিফাইড
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || resendCooldown > 0 || !formData.email}
                        className="text-[11px] font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 disabled:opacity-50 cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        {isSendingOtp ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>পাঠানো হচ্ছে...</span>
                          </>
                        ) : resendCooldown > 0 ? (
                          <span>পুনরায় পাঠান ({resendCooldown}s)</span>
                        ) : otpSent ? (
                          <>
                            <RefreshCw className="w-3 h-3" />
                            <span>পুনরায় কোড পাঠান</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3" />
                            <span>কোড পাঠান</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      disabled={isEmailVerified}
                      placeholder="student@univ.edu.bd"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (isEmailVerified) setIsEmailVerified(false);
                        if (otpSent) setOtpSent(false);
                      }}
                      className={`w-full text-xs pl-9 pr-3 py-2.5 border rounded-xl focus:outline-none transition-colors ${
                        isEmailVerified
                          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-medium'
                          : 'border-slate-200 dark:border-slate-700 focus:border-rose-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Mobile / Bkash */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-rose-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* OTP Input Section (shown when code is sent and email not yet verified) */}
              {otpSent && !isEmailVerified && (
                <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
                    <span className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-rose-500" />
                      ইমেইলে পাঠানো ৬-ডিজিটের কোডটি লিখুন:
                    </span>
                    {resendCooldown > 0 ? (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {resendCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                        className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        নতুন কোড চান?
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="যেমন: 482915"
                        value={otpCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setOtpCode(val);
                          setOtpError('');
                        }}
                        className="w-full text-sm pl-9 pr-3 py-2 tracking-widest font-mono font-bold text-center border border-rose-300 dark:border-rose-800 rounded-lg focus:border-rose-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp || otpCode.length !== 6}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>যাচাই হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>যাচাই করুন</span>
                        </>
                      )}
                    </button>
                  </div>

                  {otpError && (
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}
                  {otpNotice && !otpError && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{otpNotice}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Verified Success Badge Banner */}
              {isEmailVerified && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold">
                      ইমেইল ({formData.email}) সফলভাবে ভেরিফাইড হয়েছে!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmailVerified(false);
                      setOtpSent(false);
                      setOtpCode('');
                    }}
                    className="text-[11px] text-slate-500 hover:text-rose-500 underline cursor-pointer"
                  >
                    ইমেইল পরিবর্তন করুন
                  </button>
                </div>
              )}
            </div>

            {/* Mess Name or Invite Code */}
            {mode === 'create' ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-rose-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-rose-500 focus:outline-none font-mono font-bold tracking-wider bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full text-xs pl-9 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-rose-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  পাসওয়ার্ড নিশ্চিত করুন *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full text-xs pl-9 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-rose-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    title={showConfirmPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
