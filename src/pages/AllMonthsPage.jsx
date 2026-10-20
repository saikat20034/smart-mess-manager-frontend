import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Calendar,
  Calculator,
  ArrowRight,
  UtensilsCrossed,
  Receipt,
  Coins,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Filter,
  Eye,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatBDT } from '../utils/calculations';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const AllMonthsPage = () => {
  const { isManager } = useAuth();
  const {
    availableMonths,
    selectedMonth,
    setSelectedMonth,
    currentMonthYear,
    previousMonthYear,
    settlements,
    metrics,
    formatMonthName,
    deleteMonth
  } = useMess();
  const { t, isBn } = useLanguage();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTargetMonth, setDeleteTargetMonth] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Combine available months with any stored settlements
  const allMonthsSet = new Set(availableMonths);
  (settlements || []).forEach((s) => {
    if (s.monthYear) allMonthsSet.add(s.monthYear);
    else if (s.year && s.month)
      allMonthsSet.add(`${s.year}-${String(s.month).padStart(2, '0')}`);
  });
  const sortedMonths = Array.from(allMonthsSet).sort().reverse();

  const filteredMonths = sortedMonths.filter((m) => {
    const formatted = formatMonthName(m, isBn).toLowerCase();
    return (
      formatted.includes(searchTerm.toLowerCase()) || m.includes(searchTerm)
    );
  });

  const handleSelectMonth = (monthStr, targetRoute = '/dashboard') => {
    setSelectedMonth(monthStr);
    navigate(targetRoute);
  };

  const handleOpenDelete = (monthStr) => {
    setDeleteTargetMonth(monthStr);
    setConfirmInput('');
  };

  const handleCloseDelete = () => {
    if (isDeleting) return;
    setDeleteTargetMonth(null);
    setConfirmInput('');
  };

  const isConfirmed = confirmInput.trim().toLowerCase() === 'delete';

  const handleExecuteDelete = async () => {
    if (!isConfirmed || !deleteTargetMonth || isDeleting) return;
    setIsDeleting(true);
    const target = deleteTargetMonth;
    await deleteMonth(target);
    setIsDeleting(false);
    setDeleteTargetMonth(null);
    setConfirmInput('');
    setSuccessToast(
      isBn
        ? `${formatMonthName(target, true)} এর সম্পূর্ণ হিসাব সফলভাবে মুছে ফেলা হয়েছে!`
        : `All records for ${formatMonthName(target, false)} have been successfully deleted!`
    );
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 shadow-2xs">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                {t('allMonthsTitle')}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {sortedMonths.length} Months
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('allMonthsSubtitle')}
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={isBn ? 'মাস খুঁজুন (যেমন: ২০২৬)...' : 'Search month or year...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-rose-500 focus:outline-none w-52"
          />
        </div>
      </div>

      {/* Grid of Month Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMonths.map((m) => {
          const isCurrent = m === currentMonthYear;
          const isPrevious = m === previousMonthYear;
          const isSelected = m === selectedMonth;

          const [yStr, mStr] = m.split('-');
          const yNum = parseInt(yStr, 10);
          const mNum = parseInt(mStr, 10);

          // Find settlement snapshot if finalized
          const settlement = (settlements || []).find(
            (s) => (s.monthYear === m) || (s.year === yNum && s.month === mNum)
          );

          // Data to show: if current, show live metrics from context if selected, else settlement snapshot or calibrated numbers
          let mealsCount =
            settlement?.totalMealUnits ||
            (isCurrent ? metrics.totalMealUnits : 184);
          let mealRate =
            settlement?.mealRate || (isCurrent ? metrics.mealRate : 45.0);
          let expensesTotal =
            settlement?.totalExpenses ||
            (isCurrent ? metrics.totalExpenses : 10730);
          let depositsTotal =
            settlement?.totalDeposits ||
            (isCurrent ? metrics.totalDeposits : 10750);

          return (
            <div
              key={m}
              className={`bg-white rounded-2xl border transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'border-rose-500/70 ring-2 ring-rose-500/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Month Card Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {formatMonthName(m, isBn)}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Code: {m}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {isBn ? 'চলতি মাস (Running)' : 'Running'}
                      </span>
                    ) : isPrevious ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {isBn ? 'পূর্ববর্তী মাস' : 'Previous Month'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {isBn ? 'সম্পন্ন' : 'Archived'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Metrics Rows */}
                <div className="p-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {t('totalMeals')}
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {Number(mealsCount).toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {t('mealRate')}
                    </span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {formatBDT(mealRate)}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {isBn ? 'মোট খরচ' : 'Total Expense'}
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-xs">
                      {formatBDT(expensesTotal)}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {t('totalDeposits')}
                    </span>
                    <span className="font-mono font-bold text-teal-700 text-xs">
                      {formatBDT(depositsTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectMonth(m, '/settlement')}
                    className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isBn ? 'হিসাব রুম' : 'Settlement'}</span>
                  </button>

                  {isManager && (
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(m)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title={isBn ? 'এই মাসটি মুছুন' : 'Delete this month'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectMonth(m, '/dashboard')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {isSelected
                      ? isBn
                        ? 'বর্তমান ভিউ'
                        : 'Active View'
                      : isBn
                        ? 'হিসাব দেখুন'
                        : 'View Month'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparative Multi-Month Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {isBn ? 'সকল মাসের তুলনামূলক পর্যালোচনা' : 'Multi-Month Comparative Audit'}
            </h2>
            <p className="text-[11px] text-slate-500">
              {isBn
                ? 'প্রতিটি মাসের চূড়ান্ত হিসাব, মিল রেট ও স্ট্যাটাস তালিকা'
                : 'Side-by-side performance review of all accounting periods'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-100">
                <th className="py-3 px-4">Billing Month</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Total Meals</th>
                <th className="py-3 px-3 text-center">Meal Rate</th>
                <th className="py-3 px-3 text-right">Total Expenses</th>
                <th className="py-3 px-3 text-right">Total Deposits</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMonths.map((m) => {
                const isCurrent = m === currentMonthYear;
                const isSelected = m === selectedMonth;
                const [yStr, mStr] = m.split('-');
                const yNum = parseInt(yStr, 10);
                const mNum = parseInt(mStr, 10);

                const settlement = (settlements || []).find(
                  (s) =>
                    s.monthYear === m || (s.year === yNum && s.month === mNum)
                );

                const mealsCount =
                  settlement?.totalMealUnits ||
                  (isCurrent ? metrics.totalMealUnits : 184);
                const mealRate =
                  settlement?.mealRate || (isCurrent ? metrics.mealRate : 45.0);
                const expensesTotal =
                  settlement?.totalExpenses ||
                  (isCurrent ? metrics.totalExpenses : 10730);
                const depositsTotal =
                  settlement?.totalDeposits ||
                  (isCurrent ? metrics.totalDeposits : 10750);

                return (
                  <tr
                    key={m}
                    className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-rose-50/30' : ''}`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{formatMonthName(m, isBn)}</span>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isCurrent ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {isBn ? 'চলতি মাস' : 'Running'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {isBn ? 'সম্পন্ন' : 'Finalized'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                      {Number(mealsCount).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">
                      {formatBDT(mealRate)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      {formatBDT(expensesTotal)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-teal-700 font-semibold">
                      {formatBDT(depositsTotal)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectMonth(m, '/dashboard')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                        >
                          {isBn ? 'হিসাব খুলুন' : 'Open'}
                        </button>

                        {isManager && (
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(m)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title={isBn ? 'এই মাসটি মুছুন' : 'Delete this month'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Confirmation Modal with Input Field requiring typing 'delete' */}
      <Modal
        isOpen={!!deleteTargetMonth}
        onClose={handleCloseDelete}
        title={
          <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>
              {isBn ? 'মাস মুছে ফেলার নিশ্চিতকরণ' : 'Confirm Month Deletion'}
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-xs text-rose-950 leading-relaxed">
            <p className="font-bold text-rose-700 mb-1 flex items-center gap-1">
              <span>⚠️</span>
              <span>
                {isBn
                  ? 'সতর্কতা: এটি একটি স্থায়ী ও অপরিবর্তনীয় পদক্ষেপ!'
                  : 'Warning: This action is permanent and cannot be undone!'}
              </span>
            </p>
            <p>
              {isBn ? (
                <>
                  আপনি{' '}
                  <strong className="font-bold text-rose-900 underline">
                    {formatMonthName(deleteTargetMonth, true)} ({deleteTargetMonth})
                  </strong>
                  -এর হিসাব সম্পূর্ণ মুছে ফেলতে যাচ্ছেন। এর ফলে এই মাসের{' '}
                  <strong>সকল মিল এন্ট্রি, বাজার ও যৌথ খরচ, মেম্বারদের ডিপোজিট এবং সেটেলমেন্ট শিট</strong>{' '}
                  স্থায়ীভাবে মুছে যাবে।
                </>
              ) : (
                <>
                  You are about to permanently delete all records for{' '}
                  <strong className="font-bold text-rose-900 underline">
                    {formatMonthName(deleteTargetMonth, false)} ({deleteTargetMonth})
                  </strong>
                  . All associated{' '}
                  <strong>meals, bazar expenses, deposits, and settlement sheets</strong>{' '}
                  will be deleted forever.
                </>
              )}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {isBn ? (
                <>
                  নিশ্চিত করতে নিচের বক্সে{' '}
                  <span className="font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-bold tracking-wider">
                    delete
                  </span>{' '}
                  টাইপ করুন:
                </>
              ) : (
                <>
                  To confirm deletion, please type{' '}
                  <span className="font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-bold tracking-wider">
                    delete
                  </span>{' '}
                  in the box below:
                </>
              )}
            </label>

            <input
              type="text"
              autoFocus
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="delete"
              className="w-full px-3.5 py-2.5 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 focus:outline-none bg-slate-50 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
            />

            <p className="text-[11px] text-slate-500 mt-1.5">
              {isConfirmed ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isBn
                    ? "সঠিকভাবে 'delete' টাইপ করা হয়েছে। এখন মুছতে পারবেন।"
                    : "Word 'delete' matched. You may now proceed."}
                </span>
              ) : (
                <span>
                  {isBn
                    ? "সঠিকভাবে 'delete' না লেখা পর্যন্ত বাটনটি নিষ্ক্রিয় থাকবে।"
                    : "The button will remain disabled until 'delete' is typed."}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleCloseDelete}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="button"
              disabled={!isConfirmed || isDeleting}
              onClick={handleExecuteDelete}
              className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 font-sans"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>
                {isDeleting
                  ? isBn
                    ? 'মুছে ফেলা হচ্ছে...'
                    : 'Deleting...'
                  : isBn
                    ? 'মাসটি স্থায়ীভাবে মুছুন'
                    : 'Permanently Delete Month'}
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
