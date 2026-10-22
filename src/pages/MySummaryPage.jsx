import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Calendar,
  CreditCard,
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  Receipt,
  FileCheck,
  Building,
  ArrowLeft,
  RotateCcw,
  User as UserIcon
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatBDT } from '../utils/calculations';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';

export const MySummaryPage = () => {
  const { user } = useAuth();
  const {
    memberBalances,
    members,
    meals,
    deposits,
    metrics,
    selectedMonth,
    mess
  } = useMess();
  const { isBn, t } = useLanguage();
  const navigate = useNavigate();

  // Resolve the current logged-in member who is using the app
  const loggedInMember = useMemo(() => {
    if (!members || members.length === 0) return null;
    return (
      members.find((m) => m.id === user?.id) ||
      members.find((m) => m.email && user?.email && m.email.toLowerCase() === user.email.toLowerCase()) ||
      members.find((m) => m.phone && user?.phone && m.phone === user.phone) ||
      members.find((m) => m.name && user?.name && m.name.toLowerCase() === user.name.toLowerCase()) ||
      null
    );
  }, [user, members]);

  // ID of the user who is using the app
  const currentUserId = loggedInMember?.id || user?.id;

  // Selected member to view (defaults to the user who is using the app)
  const [selectedMemberId, setSelectedMemberId] = useState('');

  // Proactively synchronize selectedMemberId to the logged-in user once loaded
  useEffect(() => {
    if (currentUserId && (!selectedMemberId || selectedMemberId === 'mem-001')) {
      setSelectedMemberId(currentUserId);
    }
  }, [currentUserId]);

  // Find active member summary in balances:
  // Strictly prioritize:
  // 1. Explicitly chosen member in dropdown (if not stale hardcoded mem-001)
  // 2. The logged-in user who is using the app (by ID, email, name, or member record)
  // 3. First available member in balances
  const activeSummary = useMemo(() => {
    if (selectedMemberId && selectedMemberId !== 'mem-001') {
      const found = memberBalances.find((m) => m.memberId === selectedMemberId);
      if (found) return found;
    }

    if (currentUserId) {
      const byId = memberBalances.find((m) => m.memberId === currentUserId);
      if (byId) return byId;
    }

    if (user?.email) {
      const byEmail = memberBalances.find(
        (m) => m.email && m.email.toLowerCase() === user.email.toLowerCase()
      );
      if (byEmail) return byEmail;
    }

    if (user?.name) {
      const byName = memberBalances.find(
        (m) => m.name && m.name.toLowerCase() === user.name.toLowerCase()
      );
      if (byName) return byName;
    }

    if (loggedInMember) {
      const byMember = memberBalances.find((m) => m.memberId === loggedInMember.id);
      if (byMember) return byMember;
    }

    return memberBalances[0] || null;
  }, [selectedMemberId, currentUserId, user, loggedInMember, memberBalances]);

  // Filter active member's specific meals & deposits
  const memberMeals = meals.filter((m) => m.member_id === activeSummary?.memberId);
  const memberDeposits = deposits.filter((d) => d.member_id === activeSummary?.memberId);

  const isViewingSelf = activeSummary?.memberId === currentUserId;

  return (
    <div className="space-y-6">
      {/* Header & Back Navigation & Member Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-all cursor-pointer shrink-0"
            title={isBn ? 'পূর্ববর্তী পেজে ফিরুন' : 'Back to previous page'}
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-rose-500" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {isBn ? 'ব্যক্তিগত আর্থিক সারসংক্ষেপ' : 'Personal Financial Summary'}
              </h1>
              {isViewingSelf && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                  {isBn ? 'আপনার হিসাব' : 'Your Account'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn
                ? `${selectedMonth}-এর মিল, খরচ, মোট জমা ও ব্যালেন্সের নিখুঁত বিবরণী।`
                : `Transparent breakdown of meals consumed, deposits made, and net balance for ${selectedMonth}.`}
            </p>
          </div>
        </div>

        {/* Member View Switcher with Reset to Self Button */}
        <div className="flex items-center gap-2">
          {!isViewingSelf && currentUserId && (
            <button
              type="button"
              onClick={() => setSelectedMemberId(currentUserId)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
              title={isBn ? 'আপনার নিজের হিসাবে ফিরে যান' : 'Reset to your summary'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isBn ? 'আমার হিসাবে ফিরুন' : 'View Mine'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-xs">
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isBn ? 'মেম্বার:' : 'Viewing:'}
            </span>
            <select
              value={activeSummary?.memberId || ''}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none cursor-pointer"
            >
              {memberBalances.map((m) => (
                <option
                  key={m.memberId}
                  value={m.memberId}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                >
                  {m.name} {m.memberId === currentUserId ? `(${isBn ? 'আপনি' : 'You'})` : `(${m.roomNumber || 'Room N/A'})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Member Hero Card */}
      {activeSummary && (
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-700/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={activeSummary.avatar}
                name={activeSummary.name}
                size="xl"
                border={false}
                className="w-14 h-14 border-2 border-emerald-400 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">{activeSummary.name}</h2>
                  <Badge variant={activeSummary.role === 'manager' ? 'manager' : 'member'} size="sm">
                    {activeSummary.role === 'manager'
                      ? (isBn ? 'মেস ম্যানেজার' : 'Mess Manager')
                      : (isBn ? 'মেস মেম্বার' : 'Resident')}
                  </Badge>
                  {isViewingSelf && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                      {isBn ? 'সক্রিয় ইউজার' : 'Active User'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-200 mt-1">
                  {isBn ? 'রুম:' : 'Room:'} {activeSummary.roomNumber || (isBn ? 'নির্ধারিত নয়' : 'Not assigned')} • {isBn ? 'ফোন:' : 'Phone:'} {activeSummary.phone || 'N/A'}
                </p>
              </div>
            </div>

            {/* Net Balance Status */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-emerald-500/30 text-right min-w-[210px] backdrop-blur-xs">
              <span className="text-xs text-emerald-300 font-medium block">
                {activeSummary.netBalance >= 0
                  ? (isBn ? 'উদ্বৃত্ত / ফেরত পাবে (Credit)' : 'Surplus / Credit Balance')
                  : (isBn ? 'বকেয়া দিতে হবে (Due)' : 'Outstanding Mess Due')}
              </span>
              <div
                className={`text-2xl font-mono font-bold mt-1 ${
                  activeSummary.netBalance >= 0 ? 'text-emerald-300' : 'text-rose-400'
                }`}
              >
                {activeSummary.netBalance >= 0 ? '+' : ''}
                {formatBDT(activeSummary.netBalance)}
              </div>
              <span className="text-[10px] text-slate-300 block mt-0.5">
                {activeSummary.netBalance >= 0
                  ? (isBn ? 'মেসের কাছে আপনার টাকা জমা রয়েছে' : 'Mess owes you refund or advance is remaining')
                  : (isBn ? 'bKash/Nagad/ক্যাশে বকেয়া পরিশোধ করুন' : 'Please pay dues via bKash/Nagad/Cash')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4 Financial Components */}
      {activeSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isBn ? 'মোট মিল খাওয়া হয়েছে' : 'Meal Units Consumed'}
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {activeSummary.mealUnits.toFixed(1)} {isBn ? 'টি' : 'meals'}
            </h4>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
              {isBn ? 'মিল রেট:' : 'Rate:'} {formatBDT(metrics.mealRate)} / {isBn ? 'মিল' : 'unit'}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isBn ? 'আপনার মোট মিল খরচ' : 'Your Food Cost'}
            </span>
            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {formatBDT(activeSummary.mealCost)}
            </h4>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block font-mono">
              {activeSummary.mealUnits.toFixed(2)} × {formatBDT(metrics.mealRate)}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isBn ? 'যৌথ বিল শেয়ার' : 'Shared Bills Share'}
            </span>
            <h4 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
              {formatBDT(activeSummary.sharedCost)}
            </h4>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
              {isBn ? 'খালা, গ্যাস, ওয়াইফাই বিল' : 'Cook Khala, Gas, WiFi share'}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isBn ? 'আপনার মোট জমা' : 'Total Deposits Paid'}
            </span>
            <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              {formatBDT(activeSummary.totalDeposits)}
            </h4>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
              {memberDeposits.length} {isBn ? 'টি কিস্তিতে জমা' : 'payments recorded'}
            </span>
          </div>
        </div>
      )}

      {/* Tables: Daily Meals & Deposits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Meal Activity for this member */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isBn ? 'চলতি মাসের দৈনিক মিল লগ' : 'Recorded Meals This Month'}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {memberMeals.length} {isBn ? 'দিন এন্ট্রি' : 'days logged'}
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase sticky top-0 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">{isBn ? 'তারিখ' : 'Date'}</th>
                  <th className="py-2.5 px-2 text-center">{isBn ? 'সকাল' : 'Breakfast'}</th>
                  <th className="py-2.5 px-2 text-center">{isBn ? 'দুপুর' : 'Lunch'}</th>
                  <th className="py-2.5 px-2 text-center">{isBn ? 'রাত' : 'Dinner'}</th>
                  <th className="py-2.5 px-3 text-right">{isBn ? 'মোট মিল' : 'Units'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {memberMeals.map((m) => {
                  const bWeight = Number(mess?.breakfast_unit ?? 1.0);
                  const lWeight = Number(mess?.lunch_unit ?? 1.0);
                  const dWeight = Number(mess?.dinner_unit ?? 1.0);
                  const dayUnits =
                    (Number(m.breakfast) || 0) * bWeight +
                    (Number(m.lunch) || 0) * lWeight +
                    (Number(m.dinner) || 0) * dWeight;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-sans">{m.date}</td>
                      <td className="py-2 px-2 text-center text-slate-600 dark:text-slate-400">{m.breakfast}</td>
                      <td className="py-2 px-2 text-center text-slate-600 dark:text-slate-400">{m.lunch}</td>
                      <td className="py-2 px-2 text-center text-slate-600 dark:text-slate-400">{m.dinner}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {dayUnits.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
                {memberMeals.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400 dark:text-slate-500">
                      {isBn ? 'এই মেম্বারের কোনো মিল এন্ট্রি পাওয়া যায়নি।' : 'No meals recorded for this member.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Member's Deposit History */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isBn ? 'জমার বিবরণী (Payment History)' : 'Your Payment History'}
            </h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
              {isBn ? 'মোট:' : 'Total:'} {formatBDT(activeSummary?.totalDeposits || 0)}
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase sticky top-0 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">{isBn ? 'তারিখ' : 'Date'}</th>
                  <th className="py-2.5 px-3">{isBn ? 'মাধ্যম' : 'Method'}</th>
                  <th className="py-2.5 px-3">{isBn ? 'রেফারেন্স / নোট' : 'Reference / Notes'}</th>
                  <th className="py-2.5 px-4 text-right">{isBn ? 'পরিমাণ' : 'Amount (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {memberDeposits.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">{d.date}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="bkash" size="sm">
                        {d.payment_method}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      <span className="font-mono text-slate-700 dark:text-slate-200 block">{d.transaction_ref || '-'}</span>
                      {d.notes && <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{d.notes}</span>}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatBDT(d.amount)}
                    </td>
                  </tr>
                ))}
                {memberDeposits.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-slate-400 dark:text-slate-500">
                      {isBn ? 'এখনও কোনো জমা রেকর্ড করা হয়নি।' : 'No deposits recorded yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySummaryPage;
