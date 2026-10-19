import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UtensilsCrossed,
  TrendingUp,
  DollarSign,
  CreditCard,
  Wallet,
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { formatBDT } from '../utils/calculations';
import { MetricCard } from '../components/MetricCard';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const DashboardPage = () => {
  const { isManager } = useAuth();
  const {
    metrics,
    memberBalances,
    expenses,
    meals,
    selectedMonth,
    addDeposit,
    addExpense
  } = useMess();

  // Quick Deposit modal state
  const [quickDepositOpen, setQuickDepositOpen] = useState(false);
  const [depositForm, setDepositForm] = useState({
    member_id: '',
    amount: '',
    payment_method: 'bKash',
    transaction_ref: '',
    notes: ''
  });

  // Prepare chart data: Income vs Expenses
  const financialChartData = React.useMemo(() => {
    return [
      {
        name: 'Food Bazar',
        amount: metrics.mealExpenses,
        color: '#10b981'
      },
      {
        name: 'Shared Bills',
        amount: metrics.sharedExpenses,
        color: '#6366f1'
      },
      {
        name: 'Total Spent',
        amount: metrics.totalExpenses,
        color: '#f59e0b'
      },
      {
        name: 'Deposits',
        amount: metrics.totalDeposits,
        color: '#059669'
      }
    ];
  }, [metrics]);

  // Prepare daily meal chart data
  const dailyMealsData = React.useMemo(() => {
    const dayMap = {};
    meals.forEach((m) => {
      const day = m.date.slice(8); // '01', '02', etc.
      if (!dayMap[day]) {
        dayMap[day] = { day: `Day ${parseInt(day, 10)}`, breakfast: 0, lunch: 0, dinner: 0, total: 0 };
      }
      dayMap[day].breakfast += Number(m.breakfast || 0);
      dayMap[day].lunch += Number(m.lunch || 0);
      dayMap[day].dinner += Number(m.dinner || 0);
      dayMap[day].total += (Number(m.breakfast || 0) * 0.5) + Number(m.lunch || 0) + Number(m.dinner || 0);
    });

    return Object.values(dayMap).sort((a, b) => parseInt(a.day.slice(4)) - parseInt(b.day.slice(4)));
  }, [meals]);

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
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Period: {selectedMonth}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Mess Overview & Financial Health
          </h1>
          <p className="mt-1 text-xs text-slate-300 max-w-xl">
            Live calculation of meal rates, bazar expenses, student deposits, and net balances in Bangladeshi Taka (৳).
          </p>
        </div>

        {isManager && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuickDepositOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Deposit</span>
            </button>
            <Link
              to="/meals"
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Enter Daily Meals</span>
            </Link>
          </div>
        )}
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Active Members"
          value={`${metrics.activeMembers} / ${metrics.totalMembers}`}
          subtitle="Registered residents"
          icon={Users}
          color="indigo"
        />
        <MetricCard
          title="Total Meals"
          value={metrics.totalMealUnits.toFixed(1)}
          subtitle="Current month units"
          icon={UtensilsCrossed}
          color="emerald"
        />
        <MetricCard
          title="Current Meal Rate"
          value={formatBDT(metrics.mealRate)}
          subtitle="৳ per meal unit"
          icon={TrendingUp}
          color="amber"
        />
        <MetricCard
          title="Total Expenses"
          value={formatBDT(metrics.totalExpenses)}
          subtitle={`Bazar: ${formatBDT(metrics.mealExpenses)}`}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Total Deposits"
          value={formatBDT(metrics.totalDeposits)}
          subtitle="Collected payments"
          icon={CreditCard}
          color="emerald"
        />
        <MetricCard
          title="Cash in Hand"
          value={formatBDT(metrics.cashInHand)}
          subtitle={metrics.cashInHand >= 0 ? 'Surplus balance' : 'Deficit / Shortage'}
          icon={Wallet}
          color={metrics.cashInHand >= 0 ? 'emerald' : 'rose'}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Financial Distribution</h3>
              <p className="text-xs text-slate-500">Meal Bazar vs Overhead vs Deposits (BDT)</p>
            </div>
            <Badge variant="primary" size="sm">
              Live Recalculation
            </Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(val) => `৳${val}`}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [formatBDT(value), 'Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="amount" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Meal Activity Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Daily Meal Consumption</h3>
              <p className="text-xs text-slate-500">Total meal units recorded by date</p>
            </div>
            <Link to="/meals" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              View Matrix &rarr;
            </Link>
          </div>
          <div className="h-64">
            {dailyMealsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyMealsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No daily meals recorded for this month yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Balances & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Balances Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Member Accounts & Net Balances</h3>
              <p className="text-xs text-slate-500">
                Positive = Credit (Mess owes member), Negative = Due (Member owes mess)
              </p>
            </div>
            <Link
              to="/settlement"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Settlement Sheet</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-100">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-3 text-center">Meals</th>
                  <th className="py-3 px-3 text-right">Deposits</th>
                  <th className="py-3 px-3 text-right">Total Cost</th>
                  <th className="py-3 px-4 text-right">Net Balance</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {memberBalances.map((member) => (
                  <tr key={member.memberId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">
                      <div>
                        <span className="font-semibold">{member.name}</span>
                        {member.roomNumber && (
                          <span className="text-[10px] text-slate-400 ml-1.5 font-normal">
                            (Room {member.roomNumber})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-mono">
                      {member.mealUnits.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700 font-mono">
                      {formatBDT(member.totalDeposits)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 font-mono">
                      {formatBDT(member.totalCost)}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-bold ${
                        member.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {formatBDT(member.netBalance)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={member.netBalance >= 0 ? 'credit' : 'due'} size="sm">
                        {member.netBalance >= 0 ? 'Credit' : 'Due'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bazar Expenses */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Recent Bazar Entries</h3>
                <p className="text-xs text-slate-500">Latest recorded expenses</p>
              </div>
              <Link to="/expenses" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                All Bazar &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {expenses.slice(0, 5).map((exp) => (
                <div
                  key={exp.id}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-semibold text-slate-800">{exp.title}</h5>
                    <p className="text-[11px] text-slate-400">
                      Paid by {exp.paid_by_name || 'Tanvir'} • {exp.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono block">
                      {formatBDT(exp.amount)}
                    </span>
                    <Badge variant={exp.is_meal_related ? 'primary' : 'default'} size="sm">
                      {exp.is_meal_related ? 'Meal' : 'Shared'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/expenses"
              className="w-full block text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
            >
              Add New Bazar Entry
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Deposit Modal */}
      <Modal
        isOpen={quickDepositOpen}
        onClose={() => setQuickDepositOpen(false)}
        title="Record Member Deposit"
      >
        <form onSubmit={handleDepositSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Select Member *
            </label>
            <select
              required
              value={depositForm.member_id}
              onChange={(e) => setDepositForm({ ...depositForm, member_id: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">-- Choose Member --</option>
              {memberBalances.map((m) => (
                <option key={m.memberId} value={m.memberId}>
                  {m.name} ({m.roomNumber || 'Room N/A'}) - Current Balance: {formatBDT(m.netBalance)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Deposit Amount (BDT ৳) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="any"
              placeholder="e.g. 3000"
              value={depositForm.amount}
              onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Payment Method *
            </label>
            <select
              value={depositForm.payment_method}
              onChange={(e) => setDepositForm({ ...depositForm, payment_method: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="Rocket">Rocket</option>
              <option value="Cash">Cash to Manager</option>
              <option value="Bank">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Transaction Reference / TrxID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. BKASH8X9102"
              value={depositForm.transaction_ref}
              onChange={(e) => setDepositForm({ ...depositForm, transaction_ref: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. October 1st installment"
              value={depositForm.notes}
              onChange={(e) => setDepositForm({ ...depositForm, notes: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setQuickDepositOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
