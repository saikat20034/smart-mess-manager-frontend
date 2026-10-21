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
  Globe,
  Shield,
  MessageSquare,
  Sparkles,
  ArrowRight
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
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 transition-colors">
      {/* Top Value Banner / Pre-Footer */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>বাংলাদেশের বিশ্ববিদ্যালয় ও ব্যাচেলর মেসের বিশ্বস্ত প্ল্যাটফর্ম</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                মেসের খাতা-কলমের হিসাব বাদ দিন, আজই শুরু করুন স্মার্ট মেস ম্যানেজার
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                সহজ মিল ট্র্যাকিং, বাজারের ফর্দ, খালার বেতন বন্টন ও স্বয়ংক্রিয় মিল রেট হিসাবের সম্পূর্ণ আধুনিক সমাধান।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onLaunchDemo && onLaunchDemo('manager')}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <span>ফ্রি ডেমো দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-slate-700 transition-all"
              >
                <span>নতুন মেস খুলুন</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Multi-Column Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Column 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Smart Mess <span className="text-emerald-400">Manager</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              ঢাকা বিশ্ববিদ্যালয়, বুয়েট, রুয়েট, কুয়েট, চুয়েট, শাবিপ্রবি সহ বাংলাদেশের প্রতিটি বিশ্ববিদ্যালয় হল ও ব্যাচেলর ফ্ল্যাটের জন্য নির্মিত সর্বাধুনিক মেস ম্যানেজমেন্ট সিস্টেম।
            </p>

            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational • BST (UTC+6)</span>
            </div>

            {/* Supported Payment Logos */}
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

          {/* Column 2: Product & Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              মূল ফিচারসমূহ
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>০.২৫ স্টেপ মিল কাউন্টিং</span>
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>লাইভ মিল রেট ক্যালকুলেটর</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>বাজারের ফর্দ ও শিডিউল</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>বিকাশ/নগদ জমা ও তাগাদা</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>মাসিক ফাইনাল সেটেলমেন্ট</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>একক ম্যানেজার নিরাপত্তা নীতি</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions & Use Cases */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              সমাধানসমূহ
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default">
                  বিশ্ববিদ্যালয় আবাসিক হল মেস
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default">
                  ব্যাচেলর স্টুডেন্ট ফ্ল্যাট ও সাবলেট
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default">
                  চাকরিজীবী শেয়ার্ড অ্যাপার্টমেন্ট
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default">
                  মহিলা হোস্টেল ও ওয়ার্কিং উইমেন মেস
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default">
                  কোচিং সেন্টার ও পলিটেকনিক হোস্টেল
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 transition-colors cursor-default">
                  অফিস ও ছোট কর্পোরেট ক্যান্টিন
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              যোগাযোগ ও নিউজলেটার
            </h3>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>কার্জন হল, ঢাকা বিশ্ববিদ্যালয়, ঢাকা</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="mailto:support@smartmess.ac.bd" className="hover:text-emerald-300 transition-colors">
                  support@smartmess.ac.bd
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:+8801630496007" className="hover:text-emerald-300 transition-colors">
                  +880 1630 496007 (WhatsApp)
                </a>
              </div>
            </div>

            {/* Newsletter Subscription Form */}
            <div className="pt-2">
              <p className="text-[11px] text-slate-300 font-medium mb-2">
                মেস ম্যানেজমেন্ট টিপস ও নতুন আপডেট পান:
              </p>
              {subscribed ? (
                <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
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

        {/* Trust Badges & Campus Quote */}
        <div className="mt-12 pt-8 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">১০০% স্বচ্ছ ও ত্রুটিমুক্ত</p>
              <p className="text-[11px]">এক পয়সার ফ্র্যাকশন এরর ছাড়া নির্ভুল ব্যালেন্স</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">৫০০+ বিশ্ববিদ্যালয় মেস</p>
              <p className="text-[11px]">সারাদেশের হাজারো শিক্ষার্থীর আস্থা</p>
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

          {/* Quick Legal / Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-[11px]">
            <a href="#faqs" className="hover:text-emerald-400 transition-colors">
              গোপনীয়তা নীতি (Privacy)
            </a>
            <a href="#faqs" className="hover:text-emerald-400 transition-colors">
              ব্যবহারের শর্তাবলী (Terms)
            </a>
            <a href="#faqs" className="hover:text-emerald-400 transition-colors">
              কুকি পলিসি
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
