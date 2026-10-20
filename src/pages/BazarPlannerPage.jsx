import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  UserCheck,
  Check,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { formatBDT } from '../utils/calculations';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';

export const BazarPlannerPage = () => {
  const { t } = useLanguage();
  const { isManager } = useAuth();
  const {
    bazarList,
    addBazarItem,
    toggleBazarItem,
    deleteBazarItem,
    members,
    addExpense
  } = useMess();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    estimatedCost: '',
    buyer: members[0]?.name || 'Saikat'
  });

  const totalEstimated = bazarList.reduce((sum, item) => sum + (Number(item.estimatedCost) || 0), 0);
  const completedCount = bazarList.filter((item) => item.completed).length;

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    await addBazarItem({
      name: form.name,
      quantity: form.quantity || '১ একক',
      estimatedCost: Number(form.estimatedCost) || 0,
      buyer: form.buyer
    });

    setAddModalOpen(false);
    setForm({ name: '', quantity: '', estimatedCost: '', buyer: members[0]?.name || 'Saikat' });
  };

  // Convert completed items into an actual expense
  const handleConvertToExpense = async (item) => {
    const mem = members.find((m) => m.name === item.buyer) || members[0];
    await addExpense({
      title: `${item.name} (${item.quantity})`,
      amount: item.estimatedCost || 500,
      date: new Date().toISOString().split('T')[0],
      paid_by_member_id: mem?.id || 'mem-001',
      paid_by_name: item.buyer || 'Saikat',
      category_name: 'Groceries & Bazar',
      is_meal_related: true,
      notes: 'বাজারের ফর্দ থেকে স্বয়ংক্রিয়ভাবে খরচ হিসেবে যুক্ত'
    });
    alert(`"${item.name}" সফলভাবে মেস খরচে যুক্ত হয়েছে!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            বাজারের ফর্দ ও কেনাকাটা প্ল্যানার (Bazar Planner)
          </h1>
          <p className="text-xs text-slate-500">
            বাজারে যাওয়ার আগে জিনিসপত্রের তালিকা তৈরি করুন, আনুমানিক খরচ নির্ধারণ করুন এবং এক ক্লিকে মেস খরচে যুক্ত করুন।
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন আইটেম যুক্ত করুন</span>
          </button>
        )}
      </div>

      {!isManager && (
        <div className="p-4 bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">শুধুমাত্র মেস ম্যানেজার বাজারের ফর্দ তৈরি করতে পারেন</p>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
              মেম্বাররা মেসের আসন্ন বাজারের তালিকা ও আনুমানিক বাজেট দেখতে পারেন। নতুন আইটেম যুক্ত বা মুছে ফেলার ক্ষমতা ম্যানেজারের রয়েছে।
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">মোট আইটেম</span>
          <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">{bazarList.length} টি</h4>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 block">
            {completedCount} টি কেনা সম্পন্ন
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">আনুমানিক মোট বাজার বাজেট</span>
          <h4 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
            {formatBDT(totalEstimated)}
          </h4>
          <span className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5 block">প্রাক্কলিত হিসাব</span>
        </div>

        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">স্মার্ট সুবিধা:</span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block mt-0.5">
              কেনা শেষ হলে 'মেস খরচে যুক্ত করুন' চাপুন
            </span>
          </div>
          <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>

      {/* Checklist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">চলতি বাজারের ফর্দ</h3>
          <span className="text-xs text-slate-500 font-medium">টিক চিহ্ন দিয়ে কেনা চিহ্নিত করুন</span>
        </div>

        <div className="divide-y divide-slate-100">
          {bazarList.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-center justify-between transition-colors ${
                item.completed ? 'bg-slate-50/70' : 'hover:bg-slate-50/40'
              }`}
            >
              <div className="flex items-center gap-3">
                {isManager ? (
                  <button
                    onClick={() => toggleBazarItem(item.id)}
                    className="text-emerald-600 cursor-pointer"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                    )}
                  </button>
                ) : (
                  <div className="text-emerald-600 opacity-75">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                )}

                <div>
                  <h4
                    className={`text-xs font-bold ${
                      item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    পরিমাণ: <strong>{item.quantity}</strong> • ক্রেতা মেম্বার: {item.buyer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-slate-900 block">
                    {formatBDT(item.estimatedCost)}
                  </span>
                  <span className="text-[10px] text-slate-400">আনুমানিক</span>
                </div>

                {isManager && item.completed && (
                  <button
                    onClick={() => handleConvertToExpense(item)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    title="মেস খরচে রূপান্তর করুন"
                  >
                    <span>খরচে যোগ</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {isManager && (
                  <button
                    onClick={() => deleteBazarItem(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="আইটেম মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {bazarList.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              বাজারে কেনাকাটার কোনো তালিকা এখনো তৈরি করা হয়নি।
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="বাজারের ফর্দে নতুন আইটেম যুক্ত করুন">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">জিনিসের নাম *</label>
            <input
              type="text"
              required
              placeholder="যেমন: মিনিকেট চাল, দেশি মুরগি, তেল"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">পরিমাণ</label>
              <input
                type="text"
                placeholder="যেমন: ৫ কেজি, ২ ডজন"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">আনুমানিক খরচ (৳)</label>
              <input
                type="number"
                min="0"
                placeholder="যেমন: 850"
                value={form.estimatedCost}
                onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">ক্রেতা মেম্বার</label>
            <select
              value={form.buyer}
              onChange={(e) => setForm({ ...form, buyer: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
            >
              {members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
            >
              যুক্ত করুন
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
