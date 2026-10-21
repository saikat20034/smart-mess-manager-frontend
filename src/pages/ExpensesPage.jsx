import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  DollarSign,
  Receipt,
  Calendar,
  Trash2,
  Edit3,
  ExternalLink,
  Tag,
  Check,
  ShieldAlert
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { formatBDT } from '../utils/calculations';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const ExpensesPage = () => {
  const { isManager } = useAuth();
  const {
    expenses,
    categories,
    members,
    selectedMonth,
    addExpense,
    updateExpense,
    deleteExpense
  } = useMess();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // all, meal, shared

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Delete confirm
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form state
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    paid_by_member_id: '',
    is_meal_related: true,
    receipt_url: '',
    notes: ''
  });

  // Calculate top summaries
  const { mealTotal, sharedTotal, grandTotal } = React.useMemo(() => {
    let mealTotal = 0;
    let sharedTotal = 0;
    expenses.forEach((e) => {
      const amt = Number(e.amount || 0);
      if (e.is_meal_related) mealTotal += amt;
      else sharedTotal += amt;
    });
    return { mealTotal, sharedTotal, grandTotal: mealTotal + sharedTotal };
  }, [expenses]);

  // Filtered list
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.paid_by_name && e.paid_by_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' || e.category_id === categoryFilter;

    const matchesType =
      typeFilter === 'all'
        ? true
        : typeFilter === 'meal'
        ? e.is_meal_related
        : !e.is_meal_related;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    const member = members.find((m) => m.id === form.paid_by_member_id);
    const cat = categories.find((c) => c.id === form.category_id);

    await addExpense({
      ...form,
      amount: Number(form.amount),
      paid_by_name: member?.name || 'Tanvir Ahmed',
      category_name: cat?.name || 'General Expense'
    });

    setAddModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExpense || !form.title || !form.amount) return;

    const member = members.find((m) => m.id === form.paid_by_member_id);
    const cat = categories.find((c) => c.id === form.category_id);

    await updateExpense(selectedExpense.id, {
      ...form,
      amount: Number(form.amount),
      paid_by_name: member?.name || selectedExpense.paid_by_name,
      category_name: cat?.name || selectedExpense.category_name
    });

    setEditModalOpen(false);
    setSelectedExpense(null);
  };

  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category_id: expense.category_id || '',
      date: expense.date,
      paid_by_member_id: expense.paid_by_member_id || '',
      is_meal_related: expense.is_meal_related !== false,
      receipt_url: expense.receipt_url || '',
      notes: expense.notes || ''
    });
    setEditModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      amount: '',
      category_id: categories[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      paid_by_member_id: members[0]?.id || '',
      is_meal_related: true,
      receipt_url: '',
      notes: ''
    });
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteExpense(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Bazar & Shared Expenses
          </h1>
          <p className="text-xs text-slate-500">
            Track daily groceries, food items, gas refills, cook salary, and utilities in Bangladeshi Taka (৳).
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => {
              resetForm();
              setAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Expense</span>
          </button>
        )}
      </div>

      {!isManager && (
        <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <span className="font-bold block text-slate-900 dark:text-white">
              শুধুমাত্র মেস ম্যানেজার খরচ যুক্ত ও সম্পাদনা করতে পারেন
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              মেম্বার হিসেবে আপনি খরচের সকল ভাউচার, ক্যাটাগরি এবং বিস্তারিত তালিকা স্বচ্ছতার সাথে পর্যবেক্ষণ করতে পারবেন।
            </span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Meal Bazar (Included in Rate)</span>
          <h4 className="text-xl font-bold text-emerald-700 mt-1 font-mono">{formatBDT(mealTotal)}</h4>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Divided by total meal units</span>
        </div>

        <div className="bg-white rounded-xl border border-indigo-100 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Shared Overhead (Cook, WiFi, Gas)</span>
          <h4 className="text-xl font-bold text-indigo-700 mt-1 font-mono">{formatBDT(sharedTotal)}</h4>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Divided equally among members</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Spending for {selectedMonth}</span>
          <h4 className="text-xl font-bold text-slate-900 mt-1 font-mono">{formatBDT(grandTotal)}</h4>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{expenses.length} transactions recorded</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expense, item or buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:border-emerald-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:border-emerald-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="meal">Meal Bazar Only</option>
            <option value="shared">Shared Overhead Only</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-100">
                <th className="py-3 px-4">Item / Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Paid By</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-4 text-right">Amount (BDT)</th>
                {isManager && <th className="py-3 px-4 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{expense.title}</span>
                    {expense.notes && (
                      <span className="text-[11px] text-slate-400 block mt-0.5">{expense.notes}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {expense.category_name || 'Bazar'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">
                    {expense.date}
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {expense.paid_by_name || 'Tanvir'}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={expense.is_meal_related ? 'primary' : 'default'} size="sm">
                      {expense.is_meal_related ? 'Meal Food' : 'Shared Cost'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatBDT(expense.amount)}
                  </td>
                  {isManager && (
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(expense)}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget(expense);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={isManager ? 7 : 6} className="py-8 text-center text-slate-400 text-xs">
                    No expenses match your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Record New Expense / Bazar">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Expense Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Miniket Rice & Cooking Spices"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Amount in BDT (৳) *</label>
              <input
                type="number"
                required
                min="1"
                step="any"
                placeholder="e.g. 1500"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => {
                  const catId = e.target.value;
                  const cat = categories.find((c) => c.id === catId);
                  setForm({
                    ...form,
                    category_id: catId,
                    is_meal_related: cat ? cat.is_meal_related : true
                  });
                }}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Paid By Member</label>
              <select
                value={form.paid_by_member_id}
                onChange={(e) => setForm({ ...form, paid_by_member_id: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Classification Toggle */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-800 block">Calculation Classification</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="classification"
                  checked={form.is_meal_related === true}
                  onChange={() => setForm({ ...form, is_meal_related: true })}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Include in Meal Rate (Food/Bazar)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="classification"
                  checked={form.is_meal_related === false}
                  onChange={() => setForm({ ...form, is_meal_related: false })}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Shared Overhead (Equal split)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Market Location</label>
            <input
              type="text"
              placeholder="e.g. Palashi Bazar or Karwan Bazar purchase"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
            >
              Save Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Expense Entry">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Expense Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Amount in BDT (৳) *</label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-800 block">Calculation Classification</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="edit-classification"
                  checked={form.is_meal_related === true}
                  onChange={() => setForm({ ...form, is_meal_related: true })}
                />
                <span>Include in Meal Rate (Food/Bazar)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="edit-classification"
                  checked={form.is_meal_related === false}
                  onChange={() => setForm({ ...form, is_meal_related: false })}
                />
                <span>Shared Overhead (Equal split)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
            >
              Update Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Expense Entry?"
        message={`Are you sure you want to delete "${deleteTarget?.title}" (৳ ${deleteTarget?.amount})? This will automatically recalculate the monthly meal rate.`}
        confirmText="Delete Expense"
        isDestructive={true}
      />
    </div>
  );
};
