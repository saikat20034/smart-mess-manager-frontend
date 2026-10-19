import React, { useState } from 'react';
import {
  Settings,
  Save,
  Building,
  DollarSign,
  UtensilsCrossed,
  Key,
  RotateCcw,
  Check,
  Copy,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const SettingsPage = () => {
  const { isManager } = useAuth();
  const { mess, updateMessSettings, resetAllDemoData } = useMess();

  const [form, setForm] = useState({
    name: mess?.name || 'Padma Hall Mess (Dhaka University)',
    address: mess?.address || 'Room 402, Shahidullah Hall Extension, Curzon Hall, Dhaka',
    currency: mess?.currency || 'BDT',
    month_start_day: mess?.month_start_day || 1,
    breakfast_unit: mess?.breakfast_unit || 0.5,
    lunch_unit: mess?.lunch_unit || 1.0,
    dinner_unit: mess?.dinner_unit || 1.0,
    shared_expense_policy: mess?.shared_expense_policy || 'equal',
    invite_code: mess?.invite_code || 'PADMA2026'
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateMessSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(form.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateInviteCode = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = form.name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'MESS');
    setForm({
      ...form,
      invite_code: `${prefix}${randomSuffix}`
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Mess Settings & Configuration
          </h1>
          <p className="text-xs text-slate-500">
            Configure mess identity, meal unit weights, overhead policies, and member invite codes.
          </p>
        </div>

        {isManager && (
          <button
            type="submit"
            form="settings-form"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Mess settings updated successfully!</span>
        </div>
      )}

      <form id="settings-form" onSubmit={handleSave} className="space-y-6">
        {/* Mess Basic Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Mess Details & Location</h3>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Mess Name *</label>
            <input
              type="text"
              required
              disabled={!isManager}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Address / University Hall</label>
            <input
              type="text"
              disabled={!isManager}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none disabled:bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
              <input
                type="text"
                disabled
                value="BDT (৳ Bangladeshi Taka)"
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Month Start Day</label>
              <input
                type="number"
                min="1"
                max="28"
                disabled={!isManager}
                value={form.month_start_day}
                onChange={(e) => setForm({ ...form, month_start_day: parseInt(e.target.value, 10) || 1 })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none disabled:bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Meal Weight Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Meal Calculation Weights</h3>
          </div>
          <p className="text-xs text-slate-500">
            Configure how many meal units each meal type contributes to total meal calculations. Standard Bangladeshi student mess policy defaults to 0.5 for breakfast and 1.0 for lunch/dinner.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Breakfast Unit Weight</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                disabled={!isManager}
                value={form.breakfast_unit}
                onChange={(e) => setForm({ ...form, breakfast_unit: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 font-mono focus:border-emerald-500 focus:outline-none disabled:bg-slate-50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 0.5 unit</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Lunch Unit Weight</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                disabled={!isManager}
                value={form.lunch_unit}
                onChange={(e) => setForm({ ...form, lunch_unit: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 font-mono focus:border-emerald-500 focus:outline-none disabled:bg-slate-50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 1.0 unit</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Dinner Unit Weight</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                disabled={!isManager}
                value={form.dinner_unit}
                onChange={(e) => setForm({ ...form, dinner_unit: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 font-mono focus:border-emerald-500 focus:outline-none disabled:bg-slate-50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 1.0 unit</span>
            </div>
          </div>
        </div>

        {/* Member Invitation & Access */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Key className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Member Invitation Code</h3>
          </div>
          <p className="text-xs text-slate-500">
            New residents can use this secure code during signup to join this mess automatically.
          </p>

          <div className="flex items-center gap-3 max-w-md">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono font-bold text-slate-900 tracking-wider text-sm flex items-center justify-between">
              <span>{form.invite_code}</span>
              <button
                type="button"
                onClick={copyCode}
                className="text-slate-400 hover:text-emerald-600 p-1 rounded cursor-pointer"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {isManager && (
              <button
                type="button"
                onClick={regenerateInviteCode}
                className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 cursor-pointer"
              >
                Regenerate
              </button>
            )}
          </div>
        </div>

        {/* Demo Data Reset (For Testing) */}
        <div className="bg-rose-50/50 rounded-2xl border border-rose-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-rose-900">Reset Demo Data</h4>
            <p className="text-xs text-rose-700 mt-0.5">
              Reset all local sample data back to the clean Bangladeshi university demo state.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Store</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={resetAllDemoData}
        title="Reset All Demo Data?"
        message="This will re-initialize the sample Bangladeshi mess records (Padma Hall Mess, 5 members, meals, and bazar expenses). Use this whenever you want to test from scratch."
        confirmText="Confirm Reset"
        isDestructive={true}
      />
    </div>
  );
};
