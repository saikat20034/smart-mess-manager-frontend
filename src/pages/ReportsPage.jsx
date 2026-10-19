import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Table,
  CheckCircle,
  PieChart,
  BarChart2
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { formatBDT } from '../utils/calculations';
import { Badge } from '../components/Badge';

export const ReportsPage = () => {
  const {
    selectedMonth,
    mess,
    memberBalances,
    metrics,
    expenses,
    deposits,
    meals
  } = useMess();

  const [activeTab, setActiveTab] = useState('summary'); // summary, members, expenses, deposits

  // Export to CSV helper
  const exportToCSV = (data, filename) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers.join(','),
        ...data.map((row) =>
          headers
            .map((header) => {
              const val = row[header] ?? '';
              return `"${String(val).replace(/"/g, '""')}"`;
            })
            .join(',')
        )
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}-${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCurrent = () => {
    if (activeTab === 'members' || activeTab === 'summary') {
      const data = memberBalances.map((m) => ({
        Name: m.name,
        Room: m.roomNumber,
        Meals: m.mealUnits,
        MealCost: m.mealCost,
        SharedCost: m.sharedCost,
        TotalCost: m.totalCost,
        Deposits: m.totalDeposits,
        NetBalance: m.netBalance,
        Status: m.netBalance >= 0 ? 'Credit' : 'Due'
      }));
      exportToCSV(data, 'member-balance-sheet');
    } else if (activeTab === 'expenses') {
      const data = expenses.map((e) => ({
        Title: e.title,
        Category: e.category_name,
        Date: e.date,
        AmountBDT: e.amount,
        PaidBy: e.paid_by_name,
        Type: e.is_meal_related ? 'Meal Bazar' : 'Shared Overhead',
        Notes: e.notes || ''
      }));
      exportToCSV(data, 'expenses-ledger');
    } else if (activeTab === 'deposits') {
      const data = deposits.map((d) => ({
        Member: d.member_name,
        Date: d.date,
        AmountBDT: d.amount,
        PaymentMethod: d.payment_method,
        TransactionRef: d.transaction_ref || '',
        Notes: d.notes || ''
      }));
      exportToCSV(data, 'deposits-ledger');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Reports & Financial Statements
          </h1>
          <p className="text-xs text-slate-500">
            Generate printable audit statements and download spreadsheet CSV files for {selectedMonth}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCurrent}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 no-print">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Executive Summary
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'members'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Member Balance Sheet
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Bazar & Expense Ledger
        </button>
        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'deposits'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Deposit History
        </button>
      </div>

      {/* Report Content Card (Formatted for screen and printing) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {/* Printable Header */}
        <div className="border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{mess?.name || 'Padma Hall Mess, DU'}</h2>
              <p className="text-xs text-slate-500">{mess?.address || 'Curzon Hall, Dhaka'}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-900 block">Monthly Statement</span>
              <span className="text-xs font-mono text-emerald-600 font-semibold">{selectedMonth}</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Executive Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Total Meals</span>
                <span className="text-lg font-bold text-slate-900 font-mono">
                  {metrics.totalMealUnits.toFixed(1)}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-700 block">Meal Rate</span>
                <span className="text-lg font-bold text-emerald-800 font-mono">
                  {formatBDT(metrics.mealRate)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Total Expenses</span>
                <span className="text-lg font-bold text-slate-900 font-mono">
                  {formatBDT(metrics.totalExpenses)}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-700 block">Total Deposits</span>
                <span className="text-lg font-bold text-emerald-800 font-mono">
                  {formatBDT(metrics.totalDeposits)}
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold text-slate-600">Metric Description</th>
                    <th className="py-2.5 px-4 text-right font-semibold text-slate-600">Value (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Total Bazar Expenses (Divided by meals)</td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium">{formatBDT(metrics.mealExpenses)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Total Shared Bills (Cook Khala, Gas, WiFi, Utilities)</td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium">{formatBDT(metrics.sharedExpenses)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Outstanding Unpaid Dues</td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium text-rose-600">
                      {formatBDT(metrics.outstandingDues)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-700">Total Advance Credits</td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium text-emerald-600">
                      {formatBDT(metrics.totalCredits)}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2.5 px-4 text-slate-900">Current Cash in Hand</td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-700">
                      {formatBDT(metrics.cashInHand)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Member Balance Sheet */}
        {(activeTab === 'members' || activeTab === 'summary') && (
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Member-wise Balance Sheet</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3 text-center">Meals</th>
                    <th className="py-2.5 px-3 text-right">Meal Cost</th>
                    <th className="py-2.5 px-3 text-right">Shared Bill</th>
                    <th className="py-2.5 px-3 text-right">Total Cost</th>
                    <th className="py-2.5 px-3 text-right">Deposits</th>
                    <th className="py-2.5 px-3 text-right">Net Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {memberBalances.map((m) => (
                    <tr key={m.memberId}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{m.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{m.mealUnits.toFixed(1)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatBDT(m.mealCost)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatBDT(m.sharedCost)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold">{formatBDT(m.totalCost)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700">{formatBDT(m.totalDeposits)}</td>
                      <td
                        className={`py-2.5 px-3 text-right font-mono font-bold ${
                          m.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {formatBDT(m.netBalance)} ({m.netBalance >= 0 ? 'Credit' : 'Due'})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Expenses Ledger */}
        {activeTab === 'expenses' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Paid By</th>
                  <th className="py-2.5 px-3 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{e.date}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{e.title}</td>
                    <td className="py-2.5 px-3 text-slate-600">{e.category_name}</td>
                    <td className="py-2.5 px-3 text-slate-700">{e.paid_by_name}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatBDT(e.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Deposits Ledger */}
        {activeTab === 'deposits' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deposits.map((d) => (
                  <tr key={d.id}>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{d.date}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{d.member_name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{d.payment_method}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{d.transaction_ref || '-'}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                      +{formatBDT(d.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Printable Signature Section */}
        <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
          <div>
            <div className="border-b border-slate-300 w-48 mb-1"></div>
            <p className="font-semibold text-slate-800">Mess Manager Signature</p>
            <p className="text-[11px] text-slate-400">Date: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="border-b border-slate-300 w-48 mb-1"></div>
            <p className="font-semibold text-slate-800">Member Auditor / Representative</p>
            <p className="text-[11px] text-slate-400">Verified & Approved</p>
          </div>
        </div>
      </div>
    </div>
  );
};
