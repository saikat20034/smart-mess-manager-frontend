import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  UtensilsCrossed,
  Calculator,
  Receipt,
  Users,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Mail,
  Phone,
  MapPin,
  Send,
  ExternalLink,
  Shield,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Check
} from 'lucide-react';

export const Footer = ({ onLaunchDemo }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 4000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-slate-800/80 transition-colors overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Interactive CTA Card (Modern Bento Banner) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ঝামেলামুক্ত মেস জীবনের আধুনিক প্ল্যাটফর্ম</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                মেসের খাতা-কলমের হিসাব বাদ দিন, আজই শুরু করুন স্মার্ট মেস ম্যানেজার
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                সহজ মিল ট্র্যাকিং, বাজারের ফর্দ, খালার বেতন বন্টন ও স্বয়ংক্রিয় মিল রেট হিসাবের সম্পূর্ণ আধুনিক সমাধান।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onLaunchDemo && onLaunchDemo('manager')}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <span>ম্যানেজার ডেমো দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onLaunchDemo && onLaunchDemo('member')}
                className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                <span>মেম্বার ভিউ</span>
              </button>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/15 transition-all"
              >
                <span>নতুন মেস রেজিস্টার</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* Column 1: Brand & Platform (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight block">
                  Smart Mess <span className="text-emerald-400">Manager</span>
                </span>
                <span className="text-[11px] text-slate-400 block -mt-1">
                  স্বচ্ছ মেস হিসাব ও ব্যবস্থাপনা প্ল্যাটফর্ম
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              ব্যাচেলর মেস, ফ্ল্যাট ও শেয়ার্ড হোস্টেল হিসাবের সম্পূর্ণ নির্ভরযোগ্য ও নিরাপদ সমাধান। খাতা-কলমের জটিল হিসাব ও হিসাবের ভুলভ্রান্তি চিরতরে বন্ধ করুন।
            </p>

            {/* Status Beacon */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>লাইভ ও সক্রিয় • BST (UTC+6)</span>
            </div>

            {/* Payment & Currency Badges */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                পেমেন্ট ও মুদ্রা সামঞ্জস্য
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold text-[11px]">
                  বিকাশ (bKash)
                </span>
                <span className="px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-300 font-bold text-[11px]">
                  নগদ (Nagad)
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                  টাকা (৳ BDT)
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Core Features (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>কোর ফিচারসমূহ</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>০.২৫ স্টেপ মিল রোস্টার</span>
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>লাইভ মিল রেট ক্যালকুলেটর</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>বাজারের ফর্দ ও শিডিউল প্ল্যানার</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>বিকাশ ও নগদ পেমেন্ট লেজার</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>১-ক্লিক হোয়াটসঅ্যাপ তাগাদা মেসেজ</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>মাসিক ফাইনাল সেটেলমেন্ট শিট</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>একক ম্যানেজার নিরাপত্তা ও রোল ট্রান্সফার</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Use Cases & Calculation Rules (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              <span>ব্যবহার ও নিয়মাবলী</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default block">
                  ব্যাচেলর ফ্ল্যাট ও সাবলেট
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default block">
                  চাকরিজীবী অ্যাপার্টমেন্ট
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default block">
                  আবাসিক মেস ও হোস্টেল
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default block">
                  সঠিক মিল রেট হিসাবের নিয়ম
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default block">
                  খালার বেতন ও গ্যাস বিল বন্টন
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default block">
                  জিরো ফ্র্যাকশন ড্রাফট গ্যারান্টি
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>সহায়তা ও যোগাযোগ</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>পান্থপথ, ঢাকা - ১২০৫, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="mailto:support@smartmess.app" className="hover:text-emerald-300 transition-colors">
                  support@smartmess.app
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/8801630496007"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  +880 1630 496007 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>সকাল ৯:০০ - রাত ১১:০০ (৭ দিন)</span>
              </div>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="pt-2">
              <p className="text-[11px] text-slate-300 font-medium mb-2">
                নতুন ফিচার ও মেস সেভিংস টিপস পান:
              </p>
              {subscribed ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ধন্যবাদ! আপনি সফলভাবে যুক্ত হয়েছেন।</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="আপনার ইমেইল লিখুন..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors pr-10"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1.5 p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                      title="Subscribe"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 3 Trust Pillars */}
        <div className="mt-12 pt-8 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">১০০% স্বচ্ছ ও ত্রুটিমুক্ত</p>
              <p className="text-[11px]">এক পয়সার ফ্র্যাকশন এরর ছাড়া নির্ভুল হিসাব</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">হাজারো রুমমেটের আস্থা</p>
              <p className="text-[11px]">বন্ধুত্বপূর্ণ ও ঝামেলামুক্ত মেস জীবন</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">স্বয়ংক্রিয় মিল রেট</p>
              <p className="text-[11px]">খাতা-কলমে হিসাব করার কষ্ট চিরতরে বিদায়</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-center sm:text-left">
            <span>© {currentYear} Smart Mess Manager. সর্বস্বত্ব সংরক্ষিত।</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> in Dhaka, Bangladesh
            </span>
          </div>

          {/* Policy Links & Social */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-[11px]">
            <a href="#faqs" className="hover:text-emerald-400 transition-colors">
              গোপনীয়তা নীতি (Privacy)
            </a>
            <a href="#faqs" className="hover:text-emerald-400 transition-colors">
              ব্যবহারের শর্তাবলী (Terms)
            </a>
            <a href="#faqs" className="hover:text-emerald-400 transition-colors">
              নিরাপত্তা নীতি
            </a>
            <a
              href="https://github.com/saikat20034/smart-mess-manager-frontend"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
