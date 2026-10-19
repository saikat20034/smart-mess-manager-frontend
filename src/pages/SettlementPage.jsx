import React, { useState } from 'react';
import {
  Calculator,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  Info,
  DollarSign,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { formatBDT } from '../utils/calculations';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const SettlementPage = () => {
  const { isManager } = useAuth();
  const {
    selectedMonth,
    metrics,
    memberBalances,
    settlements,
    finalizeMonthlySettlement
  } = useMess();

  const [confirmFinalizeOpen, setConfirmFinalizeOpen] = useState(false);
  const [finalizeSuccess, setFinalizeSuccess] = useState(false);

  // Check if current month is already finalized
  const [yearStr, monthStr] = selectedMonth.split('-');
  const currentMonthNum = parseInt(monthStr, 10);
  const currentYearNum = parseInt(yearStr, 10);

  const existingFinalized = settlements.find(
    (s) => s.month === currentMonthNum && s.year === currentYearNum && s.is_finalized
  );

  const handleFinalize = async () => {
    await finalizeMonthlySettlement({
      finalized_by_name: 'Tanvir Ahmed (Manager)'
    });
    setFinalizeSuccess(true);
    setTimeout(() => setFinalizeSuccess(false), 4000);
  };

  const printSettlement = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Monthly Settlement & Balance Reconciliation
            </h1>
            {existingFinalized ? (
              <Badge variant="credit" size="sm">
                Finalized Snapshot
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                Live Draft Preview
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Reconcile meal costs, shared utility overheads, deposits, and net payable/refundable amounts for {selectedMonth}.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={printSettlement}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Sheet</span>
          </button>

          {isManager && !existingFinalized && (
            <button
              onClick={() => setConfirmFinalizeOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Finalize Settlement</span>
            </button>
          )}
        </div>
      </div>

      {finalizeSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">
            Monthly settlement for {selectedMonth} has been finalized and preserved as an official snapshot!
          </span>
        </div>
      )}

      {/* Formula & Calculation Transparency Card */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          <span>Transparent Mathematical Settlement Formula</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block mb-1">1. Meal Rate</span>
            <div className="font-mono font-bold text-white text-sm">
              {metrics.totalMealUnits > 0
                ? `${formatBDT(metrics.mealExpenses)} ÷ ${metrics.totalMealUnits.toFixed(1)} meals`
                : '৳ 0.00'}
            </div>
            <div className="mt-1 text-emerald-400 font-bold font-mono">
              = {formatBDT(metrics.mealRate)} / meal
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block mb-1">2. Shared Overhead / Person</span>
            <div className="font-mono font-bold text-white text-sm">
              {metrics.activeMembers > 0
                ? `${formatBDT(metrics.sharedExpenses)} ÷ ${metrics.activeMembers} members`
                : '৳ 0.00'}
            </div>
            <div className="mt-1 text-indigo-400 font-bold font-mono">
              = {formatBDT(metrics.activeMembers > 0 ? metrics.sharedExpenses / metrics.activeMembers : 0)} / member
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block mb-1">3. Outstanding Dues</span>
            <div className="font-mono font-bold text-rose-400 text-sm">
              {formatBDT(metrics.outstandingDues)}
            </div>
            <div className="mt-1 text-slate-400 text-[10px]">
              Owed by residents to the mess
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block mb-1">4. Total Member Credits</span>
            <div className="font-mono font-bold text-emerald-400 text-sm">
              {formatBDT(metrics.totalCredits)}
            </div>
            <div className="mt-1 text-slate-400 text-[10px]">
              Surplus advance remaining
            </div>
          </div>
        </div>
      </div>

      {/* Main Settlement Sheet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Monthly Settlement Sheet ({selectedMonth})
            </h3>
            <p className="text-[11px] text-slate-500">
              Sign convention: Positive (+) = Credit (Refund / Mess owes member), Negative (-) = Due (Member must pay)
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600">
            Active Rate: {formatBDT(metrics.mealRate)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-100">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-3 text-center">Room</th>
                <th className="py-3 px-3 text-center">Meals</th>
                <th className="py-3 px-3 text-right">Meal Cost (৳)</th>
                <th className="py-3 px-3 text-right">Shared Bill (৳)</th>
                <th className="py-3 px-3 text-right">Total Cost (৳)</th>
                <th className="py-3 px-3 text-right">Deposits (৳)</th>
                <th className="py-3 px-4 text-right">Final Balance (৳)</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {memberBalances.map((item) => (
                <tr key={item.memberId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-500 font-mono">
                    {item.roomNumber || '-'}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700 font-mono font-medium">
                    {item.mealUnits.toFixed(1)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 font-mono">
                    {formatBDT(item.mealCost)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 font-mono">
                    {formatBDT(item.sharedCost)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-900 font-mono font-bold">
                    {formatBDT(item.totalCost)}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-mono font-medium">
                    {formatBDT(item.totalDeposits)}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-mono font-bold ${
                      item.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {item.netBalance >= 0 ? '+' : ''}
                    {formatBDT(item.netBalance)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant={item.netBalance >= 0 ? 'credit' : 'due'} size="sm">
                      {item.netBalance >= 0 ? 'Refundable' : 'Payable'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-xs text-slate-900 border-t border-slate-200">
                <td colSpan="2" className="py-3 px-4">Total Mess Sums:</td>
                <td className="py-3 px-3 text-center font-mono">{metrics.totalMealUnits.toFixed(1)}</td>
                <td className="py-3 px-3 text-right font-mono">{formatBDT(metrics.mealExpenses)}</td>
                <td className="py-3 px-3 text-right font-mono">{formatBDT(metrics.sharedExpenses)}</td>
                <td className="py-3 px-3 text-right font-mono">{formatBDT(metrics.totalExpenses)}</td>
                <td className="py-3 px-3 text-right font-mono text-emerald-800">{formatBDT(metrics.totalDeposits)}</td>
                <td className="py-3 px-4 text-right font-mono text-slate-900">
                  Cash Balance: {formatBDT(metrics.cashInHand)}
                </td>
                <td className="py-3 px-3 text-center">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Settlement Finalize Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmFinalizeOpen}
        onClose={() => setConfirmFinalizeOpen(false)}
        onConfirm={handleFinalize}
        title="Finalize Monthly Settlement?"
        message="Finalizing will capture an immutable snapshot of this month's calculations (Total Meals, Meal Rate, Deposits, and Member Balances). You will still be able to inspect this official snapshot at any time."
        confirmText="Finalize and Lock"
        isDestructive={false}
      />
    </div>
  );
};
