import React, { useState } from 'react';
import {
  Key,
  Copy,
  Check,
  Share2,
  MessageSquare,
  Send,
  Users,
  Sparkles,
  Link2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLiveBaseUrl } from '../utils/constants';

export const InviteShareCard = ({ mess, memberCount = 0 }) => {
  const { isBn } = useLanguage();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const inviteCode = mess?.invite_code || 'MESS2026';
  const messName = mess?.name || 'আমাদের মেস';

  const baseUrl = getLiveBaseUrl();
  const joinLink = `${baseUrl}/register?code=${inviteCode}`;

  const shareText = isBn
    ? `আসসালামু আলাইকুম!\nআমাদের মেসের ডিজিটাল মিল, বাজার ও ব্যালেন্স হিসাবের জন্য স্মার্ট মেস ম্যানেজারে যুক্ত হোন।\n\n🏠 মেসের নাম: ${messName}\n🔑 মেস ইনভাইটেশন কোড: ${inviteCode}\n\n👉 লাইভ ওয়েবসাইটে সরাসরি যুক্ত হওয়ার লিঙ্ক:\n${joinLink}`
    : `Hello!\nJoin our Smart Mess Manager for digital meal tracking and expense transparency.\n\n🏠 Mess Name: ${messName}\n🔑 Invite Code: ${inviteCode}\n\n👉 Live Join Link:\n${joinLink}`;

  const copyCodeOnly = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyFullLink = () => {
    navigator.clipboard.writeText(joinLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 1. WhatsApp Share
  const shareWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // 2. Telegram Share
  const shareTelegram = () => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(joinLink);
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  // 3. Messenger / Web Share
  const shareMessenger = () => {
    if (navigator.share) {
      navigator.share({
        title: `${messName} - Smart Mess Manager`,
        text: shareText,
        url: joinLink
      }).catch(() => {});
    } else {
      // Fallback copy full text
      navigator.clipboard.writeText(shareText);
      alert('ইনভাইটেশন মেসেজ ক্লিপবোর্ডে কপি হয়েছে! মেসেঞ্জারে যেকোনো চ্যাটে পেস্ট করে পাঠান।');
    }
  };

  const isNewMess = memberCount <= 1;

  return (
    <div className={`rounded-2xl border p-5 shadow-xs transition-all ${
      isNewMess
        ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-emerald-200 dark:border-emerald-800/60'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-emerald-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{isBn ? 'মেস ইনভাইটেশন কোড ও মেম্বার জয়েন' : 'Mess Invitation & Member Join'}</span>
              {isNewMess && (
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                  নতুন মেস
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-300">
              {isNewMess
                ? 'আপনার মেসে এখনো কোনো মেম্বার যুক্ত হয়নি। রুমমেটদের সাথে এই কোড শেয়ার করুন!'
                : 'রুমমেটরা এই কোড দিয়ে সরাসরি মেসে যুক্ত হতে পারবে।'}
            </p>
          </div>
        </div>

        {/* Code display pill */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/80 rounded-xl px-3 py-1.5 shadow-2xs">
          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium uppercase tracking-wider">CODE:</span>
          <code className="text-sm font-mono font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wider">
            {inviteCode}
          </code>
          <button
            onClick={copyCodeOnly}
            title="কোড কপি করুন"
            className="p-1 rounded text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Share Buttons Row: WhatsApp, Telegram, Messenger */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp Button */}
          <button
            onClick={shareWhatsApp}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white text-[#25D366]" />
            <span>WhatsApp-এ শেয়ার</span>
          </button>

          {/* Telegram Button */}
          <button
            onClick={shareTelegram}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0088cc] hover:bg-[#0077b5] transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </button>

          {/* Messenger / Native Share */}
          <button
            onClick={shareMessenger}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0084FF] hover:bg-[#0073e6] transition-all shadow-xs cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Messenger</span>
          </button>
        </div>

        {/* 1-Click Copy Direct Link */}
        <button
          onClick={copyFullLink}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
          <span>{copiedLink ? 'লাইভ লিঙ্ক কপি হয়েছে!' : 'লাইভ জয়েন লিঙ্ক কপি'}</span>
        </button>
      </div>

      {/* Live website link display pill */}
      <div className="mt-3.5 p-2.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/50">
            {isBn ? 'লাইভ ওয়েবসাইট' : 'LIVE LINK'}
          </span>
          <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate select-all">
            {joinLink}
          </span>
        </div>
        <button
          onClick={copyFullLink}
          className="text-emerald-600 dark:text-emerald-400 hover:underline text-[11px] font-bold shrink-0 cursor-pointer"
        >
          {copiedLink ? (isBn ? '✓ কপি হয়েছে' : '✓ Copied') : (isBn ? 'কপি' : 'Copy')}
        </button>
      </div>

      {/* Step Guide for Roommates when mess is fresh */}
      {isNewMess && (
        <div className="mt-4 pt-3 border-t border-emerald-100/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 bg-white/70 dark:bg-slate-800/80 rounded-lg p-2 border border-emerald-100 dark:border-slate-700">
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
              ১
            </span>
            <span>লিঙ্ক রুমমেটদের গ্রুপে পাঠান</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/70 dark:bg-slate-800/80 rounded-lg p-2 border border-emerald-100 dark:border-slate-700">
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
              ২
            </span>
            <span>তারা 'কোড দিয়ে যোগ দিন' সিলেক্ট করবে</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/70 dark:bg-slate-800/80 rounded-lg p-2 border border-emerald-100 dark:border-slate-700">
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
              ৩
            </span>
            <span>কোড দিলেই সরাসরি মেসে যুক্ত হবে</span>
          </div>
        </div>
      )}
    </div>
  );
};
