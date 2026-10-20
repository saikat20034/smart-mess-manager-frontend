import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Coins,
  UtensilsCrossed,
  Receipt,
  Home,
  Users,
  Layers,
  ArrowRight,
  Sparkles,
  PlayCircle,
  Smartphone,
  CreditCard,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Edit2,
  ShoppingCart
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useLiveClock } from '../hooks/useLiveClock';
import { formatBDT } from '../utils/calculations';
import { MealRequestWidget } from '../components/MealRequestWidget';
import { BazarRosterModal } from '../components/BazarRosterModal';
import { WhatsAppReminderModal } from '../components/WhatsAppReminderModal';
import { InviteShareCard } from '../components/InviteShareCard';
import { Modal } from '../components/Modal';

export const DashboardPage = () => {
  const { user, isManager } = useAuth();
  const { t, isBn } = useLanguage();
  const { liveTimeStr, liveDateFull } = useLiveClock(isBn);
  const {
    metrics,
    memberBalances,
    members,
    mess,
    addDeposit,
    bazarSchedule
  } = useMess();

  // Modals state
  const [bazarRosterOpen, setBazarRosterOpen] = useState(false);
  const [reminderTarget, setReminderTarget] = useState(null);
  const [quickDepositOpen, setQuickDepositOpen] = useState(false);
  const [depositForm, setDepositForm] = useState({
    member_id: '',
    amount: '',
    payment_method: 'bKash',
    transaction_ref: '',
    notes: ''
  });

  // Find logged-in user summary or default to first member (Saikat)
  const currentMember =
    memberBalances.find((m) => m.name.toLowerCase() === (user?.name || '').toLowerCase()) ||
    memberBalances[0] || {
      mealUnits: 0,
      totalDeposits: 0,
      totalCost: 0,
      netBalance: 0
    };

  // Only consider schedules for members who have actually joined this mess
  const activeMemberIds = new Set((members || []).map((m) => m.id));
  const activeMemberNames = new Set((members || []).map((m) => (m.name || '').trim().toLowerCase()));

  const validSchedules = (bazarSchedule || []).filter((s) => {
    return (
      activeMemberIds.has(s.member_id) ||
      activeMemberNames.has((s.member_name || '').trim().toLowerCase())
    );
  });

  // Next upcoming duty in mess (only for joined members)
  const nextUpcomingBazar = validSchedules
    .filter((s) => s.status === 'Upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  // Helper to format date in Bengali or English
  const formatScheduleDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = d.getDate();
      const monthIndex = d.getMonth();
      const bnMonths = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const enMonths = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      if (isBn) {
        const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        const bnDay = String(day).replace(/[0-9]/g, (w) => bnDigits[Number(w)]);
        return `${bnDay} ${bnMonths[monthIndex]}`;
      }
      return `${day} ${enMonths[monthIndex]}`;
    } catch {
      return dateStr;
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositForm.member_id || !depositForm.amount) return;

    const member = memberBalances.find((m) => m.memberId === depositForm.member_id);
    await addDeposit({
      member_id: depositForm.member_id,
      member_name: member?.name || 'Member',
      amount: Number(depositForm.amount),
      date: new Date().toISOString().split('T')[0],
      payment_method: depositForm.payment_method,
      transaction_ref: depositForm.transaction_ref,
      notes: depositForm.notes
    });

    setQuickDepositOpen(false);
    setDepositForm({
      member_id: '',
      amount: '',
      payment_method: 'bKash',
      transaction_ref: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Real-time Live Date & Time Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:px-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
            <Calendar className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-rose-300 font-semibold uppercase tracking-wider">
                {isBn ? 'লাইভ তারিখ ও সময়' : 'Live Real-time Clock'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {liveDateFull}
            </h1>
          </div>
        </div>

        {/* Live Digital Clock Display */}
        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 self-start md:self-auto">
          <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-base sm:text-lg font-mono font-bold tracking-wider text-emerald-300">
            {liveTimeStr}
          </span>
          <span className="text-[10px] font-medium text-slate-300 border-l border-white/15 pl-2">
            {isBn ? 'বাংলাদেশ সময়' : 'BST (UTC+6)'}
          </span>
        </div>
      </div>

      {/* Top Main Section (Left Mess Summary + Right Personal & Meal Request) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mess Summary Card (Matching screenshot) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Dark Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold truncate max-w-[200px]">
                {mess?.name || 'আপাতত নাম নাই, ...'}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {mess?.subtitle || 'চলতি মাসের হিসাব'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t('running')}</span>
            </div>
          </div>

          {/* Key Metric Rows */}
          <div className="p-4 space-y-3.5 text-xs text-slate-700">
            {/* মেস ব্যালেন্স */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-600">{t('messBalance')}</span>
              </div>
              <span className="font-bold font-mono text-slate-900 text-sm">
                {formatBDT(metrics.cashInHand)}
              </span>
            </div>

            {/* মেসের মোট জমা */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-600">{t('totalDeposits')}</span>
              </div>
              <span className="font-bold font-mono text-slate-900 text-sm">
                {formatBDT(metrics.totalDeposits)}
              </span>
            </div>

            {/* মোট মিল */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-600">{t('totalMeals')}</span>
              </div>
              <span className="font-bold font-mono text-slate-900 text-sm">
                {metrics.totalMealUnits.toFixed(2)}
              </span>
            </div>

            {/* মোট মিল খরচ */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-600">{t('totalMealCost')}</span>
              </div>
              <span className="font-bold font-mono text-slate-900 text-sm">
                {formatBDT(metrics.mealExpenses)}
              </span>
            </div>

            {/* মিল রেট */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-600">{t('mealRate')}</span>
              </div>
              <span className="font-bold font-mono text-slate-900 text-sm">
                {formatBDT(metrics.mealRate)}
              </span>
            </div>

            {/* মোট একক অন্যান্য খরচ */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-600">{t('individualExpense')}</span>
              </div>
              <span className="font-bold font-mono text-slate-900 text-sm">
                ৳ 0.00
              </span>
            </div>

            {/* মোট যৌথ অন্যান্য খরচ */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-medium text-slate-600">{t('sharedExpense')}</span>
              </div>
              <span className="font-bold font-mono text-slate-900 text-sm">
                {formatBDT(metrics.sharedExpenses)}
              </span>
            </div>

            {/* Pink 'বিস্তারিত হিসাব' Button */}
            <div className="pt-2">
              <Link
                to="/settlement"
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center transition-colors text-center border border-rose-100"
              >
                {t('detailedCalcBtn')}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: "আমার হিসাব" + "মিল রিকুয়েস্ট" + "বাজারের তারিখ" */}
        <div className="lg:col-span-8 space-y-5">
          {/* "আমার হিসাব" Header & 4 Colorful Cards (Matching screenshot) */}
          <div>
            <h3 className="text-sm font-bold text-rose-500 mb-3">
              {t('myAccountTitle')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* মোট মিল (Light Blue) */}
              <div className="bg-[#e0f2fe] rounded-2xl p-4 border border-sky-100/60 shadow-xs flex flex-col justify-between">
                <div className="w-7 h-7 rounded-lg bg-sky-200/80 text-sky-800 flex items-center justify-center mb-2">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xl font-bold font-mono text-slate-900">
                    {currentMember?.mealUnits?.toFixed(2) || '23.00'}
                  </h4>
                  <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                    {t('myTotalMeals')}
                  </span>
                </div>
              </div>

              {/* মোট জমা (Light Teal / Emerald) */}
              <div className="bg-[#d1fae5] rounded-2xl p-4 border border-emerald-100/60 shadow-xs flex flex-col justify-between">
                <div className="w-7 h-7 rounded-lg bg-emerald-200/80 text-emerald-800 flex items-center justify-center mb-2">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xl font-bold font-mono text-slate-900">
                    {currentMember?.totalDeposits?.toFixed(2) || '1597.13'} <span className="text-xs">৳</span>
                  </h4>
                  <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                    {t('myTotalDeposits')}
                  </span>
                </div>
              </div>

              {/* মোট খরচ (Light Pink) */}
              <div className="bg-[#fce7f3] rounded-2xl p-4 border border-pink-100/60 shadow-xs flex flex-col justify-between">
                <div className="w-7 h-7 rounded-lg bg-pink-200/80 text-pink-800 flex items-center justify-center mb-2">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xl font-bold font-mono text-slate-900">
                    {currentMember?.totalCost?.toFixed(2) || '1612.98'} <span className="text-xs">৳</span>
                  </h4>
                  <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                    {t('myTotalExpenses')}
                  </span>
                </div>
              </div>

              {/* ব্যালেন্স (Light Yellow / Amber) */}
              <div className="bg-[#fef3c7] rounded-2xl p-4 border border-amber-100/60 shadow-xs flex flex-col justify-between">
                <div className="w-7 h-7 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center mb-2">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4
                    className={`text-xl font-bold font-mono ${
                      currentMember?.netBalance >= 0 ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {currentMember?.netBalance?.toFixed(2) || '-15.85'} <span className="text-xs">৳</span>
                  </h4>
                  <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                    {t('myBalance')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* "মিল রিকুয়েস্ট" Card (Interactive) */}
          <MealRequestWidget />

          {/* "আমার বাজারের তারিখ" Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-rose-500">
                {t('myBazarDateTitle')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {nextUpcomingBazar ? (
                  <>
                    {t('nextBazar')}:{' '}
                    <strong className="text-slate-800">
                      {formatScheduleDate(nextUpcomingBazar.date)} ({nextUpcomingBazar.member_name})
                    </strong>
                  </>
                ) : (
                  <>
                    {t('nextBazar')}:{' '}
                    <span className="text-slate-400 font-medium">
                      {t('noBazarScheduled')}
                    </span>
                  </>
                )}
              </p>
            </div>

            <button
              onClick={() => setBazarRosterOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {t('setBazarDateBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* Mess Invitation & Roommate Share Card (WhatsApp, Telegram, Messenger) */}
      <InviteShareCard mess={mess} memberCount={memberBalances.length} />

      {/* Promotional Banners Carousel (Matching screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner 1 */}
        <div className="bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl p-5 text-white flex items-center justify-between shadow-xs">
          <div>
            <h4 className="text-base font-bold">
              দেখুন কিভাবে অ্যাপটি ব্যবহার করবেন
            </h4>
            <p className="text-xs text-rose-100 mt-1">
              ইউজার গাইড ও ভিডিও টিউটোরিয়াল
            </p>
            <button
              onClick={() => alert('ভিডিও গাইড শীঘ্রই আসছে!')}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/30 hover:bg-black/50 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Watch Video</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="hidden sm:block text-rose-200">
            <PlayCircle className="w-12 h-12 opacity-80" />
          </div>
        </div>

        {/* Banner 2: Smart Bazar Shopping Checklist & Planner */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-5 text-white flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 bg-white/20 text-emerald-100 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {isBn ? 'নতুন ফিচার' : 'New Feature'}
              </span>
              <span className="text-xs text-emerald-100 font-medium">
                {isBn ? 'স্বচ্ছ ও সাশ্রয়ী মেস হিসাব' : '100% Transparent Mess'}
              </span>
            </div>
            <h4 className="text-base font-bold">
              {isBn ? 'স্মার্ট বাজারের ফর্দ ও কেনাকাটা প্ল্যানার' : 'Smart Bazar Planner & Grocery Checklist'}
            </h4>
            <p className="text-xs text-emerald-100 mt-1">
              {isBn
                ? 'বাজারের ফর্দ তৈরি করুন এবং এক ক্লিকেই মেস খরচে রূপান্তর করুন'
                : 'Create your grocery shopping checklist & convert to mess expenses with 1 click'}
            </p>
            <Link
              to="/bazar-planner"
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/30 hover:bg-black/50 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <span>{isBn ? 'বাজারের ফর্দ খুলুন' : 'Open Bazar Planner'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="hidden sm:block text-emerald-200">
            <ShoppingCart className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* "সকল মেম্বার" Grid Section (Total 7 Members - Matching reference screenshot) */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-bold text-rose-500">
            {t('allMembersTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('totalMembersCount', { count: memberBalances.length })}
          </p>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memberBalances.map((member) => {
            const isDue = member.netBalance < 0;

            return (
              <div
                key={member.memberId}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Avatar, Name, Status Pill, Balance */}
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {member.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDue ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          ></span>
                          <span
                            className={`text-[10px] font-semibold ${
                              isDue ? 'text-rose-500' : 'text-emerald-600'
                            }`}
                          >
                            {isDue ? t('dueTag') : t('receivableTag')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">ব্যালেন্স</span>
                      <span
                        className={`text-sm font-bold font-mono ${
                          isDue ? 'text-rose-500' : 'text-emerald-600'
                        }`}
                      >
                        {formatBDT(member.netBalance)}
                      </span>
                    </div>
                  </div>

                  {/* 2-Column Details Table (Matching screenshot) */}
                  <div className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('cardMeals')}</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {member.mealUnits.toFixed(2)}
                      </span>
                      <span className="text-slate-400 ml-3">{t('cardDeposits')}</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {formatBDT(member.totalDeposits)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400">{t('cardMealCost')}</span>
                      <span className="font-mono text-slate-700">
                        {formatBDT(member.mealCost)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('cardIndividualCost')}</span>
                      <span className="font-mono text-slate-700">0.00 ৳</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('cardSharedCost')}</span>
                      <span className="font-mono text-slate-700">
                        {formatBDT(member.sharedCost)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-bold">
                      <span className="text-slate-800">{t('cardTotalCost')}</span>
                      <span className="font-mono text-rose-500">
                        {formatBDT(member.totalCost)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Quick Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setDepositForm({
                        member_id: member.memberId,
                        amount: isDue ? Math.abs(member.netBalance) : '',
                        payment_method: 'bKash',
                        transaction_ref: '',
                        notes: ''
                      });
                      setQuickDepositOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold rounded-lg text-center transition-colors cursor-pointer"
                  >
                    {t('recordDeposit')}
                  </button>

                  {isDue && (
                    <button
                      onClick={() => setReminderTarget(member)}
                      className="py-1.5 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      title="হোয়াটসঅ্যাপে বকেয়া তাগাদা মেসেজ পাঠান"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>তাগাদা</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* If new mess with 0 or 1 member, show dashed invite card */}
          {memberBalances.length <= 1 && (
            <div className="bg-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-300 p-6 flex flex-col items-center justify-center text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">রুমমেটদের যুক্ত করুন</h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                আপনার মেসে এখনো কোনো মেম্বার যুক্ত হয়নি। ইনভাইটেশন কোড পাঠিয়ে রুমমেটদের যুক্ত হতে বলুন।
              </p>
              <div className="mt-3 flex items-center gap-2">
                <code className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-700 font-mono font-bold text-xs rounded-lg">
                  {mess?.invite_code || 'MESS2026'}
                </code>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bazar Roster Modal */}
      <BazarRosterModal
        isOpen={bazarRosterOpen}
        onClose={() => setBazarRosterOpen(false)}
      />

      {/* WhatsApp Due Reminder Modal */}
      <WhatsAppReminderModal
        isOpen={Boolean(reminderTarget)}
        onClose={() => setReminderTarget(null)}
        member={reminderTarget}
        mess={mess}
      />

      {/* Quick Deposit Modal */}
      <Modal
        isOpen={quickDepositOpen}
        onClose={() => setQuickDepositOpen(false)}
        title="মেম্বার জমা যুক্ত করুন"
      >
        <form onSubmit={handleDepositSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              মেম্বার নির্বাচন করুন *
            </label>
            <select
              required
              value={depositForm.member_id}
              onChange={(e) => setDepositForm({ ...depositForm, member_id: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">-- মেম্বার বাছাই করুন --</option>
              {memberBalances.map((m) => (
                <option key={m.memberId} value={m.memberId}>
                  {m.name} - ব্যালেন্স: {formatBDT(m.netBalance)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              জমার পরিমাণ (BDT ৳) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="any"
              placeholder="যেমন: ১৫০০"
              value={depositForm.amount}
              onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              পেমেন্ট মাধ্যম *
            </label>
            <select
              value={depositForm.payment_method}
              onChange={(e) => setDepositForm({ ...depositForm, payment_method: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="bKash">bKash (বিকাশ)</option>
              <option value="Nagad">Nagad (নগদ)</option>
              <option value="Rocket">Rocket (রকেট)</option>
              <option value="Cash">Cash (ক্যাশ জমা)</option>
              <option value="Bank">Bank Transfer (ব্যাংক)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              ট্রানজেকশন রেফারেন্স / TrxID (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="যেমন: BKASH8X9102"
              value={depositForm.transaction_ref}
              onChange={(e) => setDepositForm({ ...depositForm, transaction_ref: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setQuickDepositOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
            >
              জমা সম্পন্ন করুন
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
