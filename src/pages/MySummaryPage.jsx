import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  CreditCard,
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  Receipt,
  FileCheck,
  Building
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { formatBDT } from '../utils/calculations';
import { Badge } from '../components/Badge';

export const MySummaryPage = () => {
  const { user } = useAuth();
  const {
    memberBalances,
    meals,
    deposits,
    metrics,
    selectedMonth,
    mess
  } = useMess();

  // Allow switching member view to inspect anyone's summary
  const [selectedMemberId, setSelectedMemberId] = useState(user?.id || 'mem-001');

  // Find active member in balances
  const activeSummary = memberBalances.find((m) => m.memberId === selectedMemberId) || memberBalances[0];

  // Filter member's specific meals & deposits
  const memberMeals = meals.filter((m) => m.member_id === activeSummary?.memberId);
  const memberDeposits = deposits.filter((d) => d.member_id === activeSummary?.memberId);

  return (
    <div className="space-y-6">
      {/* Header & Member Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Personal Financial Summary
          </h1>
          <p className="text-xs text-slate-500">
            Transparent breakdown of meals consumed, deposits made, and net balance for {selectedMonth}.
          </p>
        </div>

        {/* Member View Switcher */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-medium text-slate-500">Viewing:</span>
          <select
            value={activeSummary?.memberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          >
            {memberBalances.map((m) => (
              <option key={m.memberId} value={m.memberId}>
                {m.name} ({m.roomNumber || 'Room N/A'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Member Hero Card */}
      {activeSummary && (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center text-xl font-bold">
                {activeSummary.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{activeSummary.name}</h2>
                  <Badge variant={activeSummary.role === 'manager' ? 'manager' : 'member'} size="sm">
                    {activeSummary.role === 'manager' ? 'Mess Manager' : 'Resident'}
                  </Badge>
                </div>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Room: {activeSummary.roomNumber || 'Not assigned'} • Phone: {activeSummary.phone || 'N/A'}
                </p>
              </div>
            </div>

            {/* Net Balance Status */}
            <div className="bg-slate-950/40 rounded-xl p-4 border border-emerald-500/30 text-right min-w-[200px]">
              <span className="text-xs text-emerald-300 font-medium block">
                {activeSummary.netBalance >= 0 ? 'Surplus / Credit Balance' : 'Outstanding Mess Due'}
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
                  ? 'Mess owes you refund or advance is remaining'
                  : 'Please pay dues via bKash/Nagad/Cash'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4 Financial Components */}
      {activeSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Meal Units Consumed</span>
            <h4 className="text-xl font-bold text-slate-900 mt-1 font-mono">
              {activeSummary.mealUnits.toFixed(1)} meals
            </h4>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Rate: {formatBDT(metrics.mealRate)} / unit
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Your Food Cost</span>
            <h4 className="text-xl font-bold text-slate-900 mt-1 font-mono">
              {formatBDT(activeSummary.mealCost)}
            </h4>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {activeSummary.mealUnits.toFixed(2)} × {formatBDT(metrics.mealRate)}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Shared Bills Share</span>
            <h4 className="text-xl font-bold text-indigo-700 mt-1 font-mono">
              {formatBDT(activeSummary.sharedCost)}
            </h4>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Cook Khala, Gas, WiFi share
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Total Deposits Paid</span>
            <h4 className="text-xl font-bold text-emerald-700 mt-1 font-mono">
              {formatBDT(activeSummary.totalDeposits)}
            </h4>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {memberDeposits.length} payments recorded
            </span>
          </div>
        </div>
      )}

      {/* Tables: Daily Meals & Deposits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Meal Activity for this member */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recorded Meals This Month</h3>
            <span className="text-xs text-slate-500 font-mono">
              {memberMeals.length} days logged
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase sticky top-0 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-2 text-center">Breakfast</th>
                  <th className="py-2.5 px-2 text-center">Lunch</th>
                  <th className="py-2.5 px-2 text-center">Dinner</th>
                  <th className="py-2.5 px-3 text-right">Units</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {memberMeals.map((m) => {
                  const bWeight = Number(mess?.breakfast_unit ?? 1.0);
                  const lWeight = Number(mess?.lunch_unit ?? 1.0);
                  const dWeight = Number(mess?.dinner_unit ?? 1.0);
                  const dayUnits =
                    (Number(m.breakfast) || 0) * bWeight +
                    (Number(m.lunch) || 0) * lWeight +
                    (Number(m.dinner) || 0) * dWeight;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-700 font-sans">{m.date}</td>
                      <td className="py-2 px-2 text-center text-slate-600">{m.breakfast}</td>
                      <td className="py-2 px-2 text-center text-slate-600">{m.lunch}</td>
                      <td className="py-2 px-2 text-center text-slate-600">{m.dinner}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">
                        {dayUnits.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
                {memberMeals.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400">
                      No meals recorded for this member.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Member's Deposit History */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Your Payment History</h3>
            <span className="text-xs text-emerald-700 font-mono font-semibold">
              Total: {formatBDT(activeSummary?.totalDeposits || 0)}
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase sticky top-0 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Reference / Notes</th>
                  <th className="py-2.5 px-4 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {memberDeposits.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{d.date}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="bkash" size="sm">
                        {d.payment_method}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <span className="font-mono text-slate-700 block">{d.transaction_ref || '-'}</span>
                      {d.notes && <span className="text-[10px] text-slate-400 block">{d.notes}</span>}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">
                      +{formatBDT(d.amount)}
                    </td>
                  </tr>
                ))}
                {memberDeposits.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-slate-400">
                      No deposits recorded yet.
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
