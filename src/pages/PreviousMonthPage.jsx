import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  ArrowRight,
  Calculator,
  UtensilsCrossed,
  ShoppingCart,
  Printer,
  Calendar,
  CheckCircle,
  Coins,
  Wallet,
  Receipt,
  Users
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useLanguage } from '../context/LanguageContext';
import { formatBDT } from '../utils/calculations';
import { Badge } from '../components/Badge';

export const PreviousMonthPage = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    previousMonthYear,
    currentMonthYear,
    switchToCurrentMonth,
    metrics,
    memberBalances,
    mess,
    formatMonthName
  } = useMess();
  const { t, isBn } = useLanguage();
  const navigate = useNavigate();

  // Ensure previous month is actively selected upon entering this page
  useEffect(() => {
    if (selectedMonth !== previousMonthYear) {
      setSelectedMonth(previousMonthYear);
    }
  }, [previousMonthYear]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-2xs">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                {isBn ? 'পূর্ববর্তী মাসের হিসাব বিবরণী' : 'Previous Month Accounting'}
              </h1>
              <Badge variant="credit" size="sm">
                {isBn ? 'সম্পন্ন / Finalized' : 'Finalized'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatMonthName(previousMonthYear, isBn)} ({isBn ? 'পূর্ববর্তী মাস' : 'Previous Month'})-এর পূর্ণাঙ্গ হিসাব ও মেম্বার ব্যালেন্স।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              switchToCurrentMonth();
              navigate('/dashboard');
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>{isBn ? 'চলতি মাসে ফিরুন' : 'Back to Current Month'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6 Key Metrics Cards for Previous Month */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Mess Balance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-500 mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">{t('messBalance')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900">
            {formatBDT(metrics.cashInHand)}
          </div>
        </div>

        {/* Total Deposits */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-teal-600 mb-2">
            <Coins className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">{t('totalDeposits')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900">
            {formatBDT(metrics.totalDeposits)}
          </div>
        </div>

        {/* Total Meals */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-sky-600 mb-2">
            <UtensilsCrossed className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">{t('totalMeals')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900">
            {metrics.totalMealUnits.toFixed(2)}
          </div>
        </div>

        {/* Meal Food Cost */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Receipt className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">{t('totalMealCost')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900">
            {formatBDT(metrics.mealExpenses)}
          </div>
        </div>

        {/* Meal Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Calculator className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">{t('mealRate')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-emerald-700">
            {formatBDT(metrics.mealRate)}
          </div>
        </div>

        {/* Shared Expenses */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Receipt className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">{t('sharedExpense')}</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-900">
            {formatBDT(metrics.sharedExpenses)}
          </div>
        </div>
      </div>

      {/* Quick Links & Actions for Previous Month */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          to="/settlement"
          className="p-4 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200 transition-colors shadow-2xs flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">{isBn ? 'হিসাব রুম / ফাইনাল শিট' : 'Settlement Sheet'}</p>
              <p className="text-[11px] text-slate-500">{isBn ? 'সম্পূর্ণ মাসভিত্তিক হিসাব শিট দেখুন' : 'View full audit sheet'}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to="/expenses"
          className="p-4 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200 transition-colors shadow-2xs flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">{isBn ? 'বিগত মাসের খরচের তালিকা' : 'Past Month Expenses'}</p>
              <p className="text-[11px] text-slate-500">{isBn ? 'বাজার ও যৌথ খরচের ভাউচার' : 'Detailed bazar expenses'}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to="/reports"
          className="p-4 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200 transition-colors shadow-2xs flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">{isBn ? 'রিপোর্ট ও প্রিন্ট' : 'Reports & Print'}</p>
              <p className="text-[11px] text-slate-500">{isBn ? 'CSV ডাউনলোড বা প্রিন্ট করুন' : 'Export CSV or print'}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* Member Balances Table for Previous Month */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {isBn ? 'মেম্বারদের পূর্ববর্তী মাসের হিসাব' : 'Member Balances for Previous Month'}
            </h2>
            <p className="text-[11px] text-slate-500">
              {formatMonthName(previousMonthYear, isBn)} • Total {memberBalances.length} Members
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-100">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-3 text-center">Room</th>
                <th className="py-3 px-3 text-center">Total Meals</th>
                <th className="py-3 px-3 text-right">Deposits</th>
                <th className="py-3 px-3 text-right">Meal Cost</th>
                <th className="py-3 px-3 text-right">Shared Cost</th>
                <th className="py-3 px-3 text-right">Total Cost</th>
                <th className="py-3 px-4 text-center">Final Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memberBalances.map((m) => {
                const isDue = m.netBalance < 0;
                return (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {m.name}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      {m.roomNumber || '-'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                      {m.mealUnits.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-teal-700 font-semibold">
                      {formatBDT(m.totalDeposits)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      {formatBDT(m.mealCost)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      {formatBDT(m.sharedCost)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatBDT(m.totalCost)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isDue
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}
                      >
                        {isDue ? `${formatBDT(Math.abs(m.netBalance))} ${isBn ? 'দিতে' : 'Due'}` : `${formatBDT(m.netBalance)} ${isBn ? 'পায়' : 'Refund'}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
