import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Building,
  DollarSign,
  UtensilsCrossed,
  Key,
  Check,
  Copy,
  AlertTriangle,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Crown,
  ShieldAlert
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { MessProfilePictureModal } from '../components/MessProfilePictureModal';
import { TransferManagerModal } from '../components/TransferManagerModal';

export const SettingsPage = () => {
  const { isManager } = useAuth();
  const { mess, updateMessSettings, currentManager } = useMess();
  const { theme, setTheme } = useTheme();
  const { isBn } = useLanguage();

  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: mess?.name || 'Padma Hall Mess (Dhaka University)',
    subtitle: mess?.subtitle || 'চলতি মাসের হিসাব',
    address: mess?.address || 'Room 402, Shahidullah Hall Extension, Curzon Hall, Dhaka',
    currency: mess?.currency || 'BDT',
    month_start_day: mess?.month_start_day || 1,
    breakfast_unit: Number(mess?.breakfast_unit ?? 1.0),
    lunch_unit: mess?.lunch_unit || 1.0,
    dinner_unit: mess?.dinner_unit || 1.0,
    shared_expense_policy: mess?.shared_expense_policy || 'equal',
    invite_code: mess?.invite_code || 'PADMA2026'
  });

  useEffect(() => {
    if (mess) {
      setForm((prev) => ({
        ...prev,
        name: mess.name || prev.name,
        subtitle: mess.subtitle || prev.subtitle || 'চলতি মাসের হিসাব',
        address: mess.address || prev.address,
        currency: mess.currency || prev.currency,
        month_start_day: mess.month_start_day || prev.month_start_day,
        breakfast_unit: Number(mess.breakfast_unit ?? prev.breakfast_unit),
        lunch_unit: mess.lunch_unit ?? prev.lunch_unit,
        dinner_unit: mess.dinner_unit ?? prev.dinner_unit,
        shared_expense_policy: mess.shared_expense_policy || prev.shared_expense_policy,
        invite_code: mess.invite_code || prev.invite_code
      }));
    }
  }, [mess]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messLogoModalOpen, setMessLogoModalOpen] = useState(false);

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
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Mess Details & Location</h3>
          </div>

          {/* Mess Logo / Profile Picture Row */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="relative shrink-0">
              {mess?.logo ? (
                <img
                  src={mess.logo}
                  alt={mess?.name || 'Mess Logo'}
                  className="w-14 h-14 rounded-full border-2 border-rose-500 object-cover shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-xs">
                  {form.name ? form.name.trim().charAt(0).toUpperCase() : 'M'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {isBn ? 'মেস প্রোফাইল ছবি / লোগো' : 'Mess Profile Picture / Logo'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn
                  ? 'ন্যাভবারের শীর্ষে ও মেস পরিচিতিতে এই ছবি প্রদর্শিত হবে'
                  : 'Distinct from your personal manager profile photo'}
              </p>
            </div>
            {isManager && (
              <button
                type="button"
                onClick={() => setMessLogoModalOpen(true)}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {isBn ? 'লোগো পরিবর্তন' : 'Change Logo'}
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Mess Name *</label>
            <input
              type="text"
              required
              disabled={!isManager}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Subtitle / Tagline (উপ-শিরোনাম)</label>
            <input
              type="text"
              disabled={!isManager}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="e.g. চলতি মাসের হিসাব"
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

        {/* Mess Administration & Sole Manager Authority */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {isBn ? 'মেস প্রশাসন ও একক ম্যানেজার' : 'Mess Administration & Sole Manager'}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 px-2.5 py-0.5 rounded-full">
              {isBn ? 'একক ক্ষমতা নীতি' : 'Single Manager Invariant'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBn
              ? 'মেসের নিয়ম অনুযায়ী এক সময়ে কেবল একজনই মেস ম্যানেজার দায়িত্ব পালন করতে পারেন। বর্তমান ম্যানেজার চাইলে অন্য যেকোনো সক্রিয় সদস্যকে এই দায়িত্ব হস্তান্তর করতে পারেন।'
              : 'Strict single manager rule is active. Only the active manager possesses authority to edit mess data, logs, and settings. Leadership can be transferred anytime.'}
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {currentManager?.avatar ? (
                <img
                  src={currentManager.avatar}
                  alt={currentManager.name}
                  className="w-12 h-12 rounded-full border-2 border-amber-500 object-cover shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-base shadow-xs">
                  {currentManager?.name ? currentManager.name.slice(0, 2).toUpperCase() : 'M'}
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>{currentManager?.name || 'Saikat'}</span>
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentManager?.phone || 'ফোন নম্বর নাই'} • Room: {currentManager?.room_number || currentManager?.roomNumber || 'N/A'}
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  {isBn ? 'বর্তমান দায়িত্বপ্রাপ্ত মেস ম্যানেজার' : 'Active Sole Mess Manager'}
                </span>
              </div>
            </div>

            {isManager ? (
              <button
                type="button"
                onClick={() => setTransferModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
              >
                <Crown className="w-4 h-4" />
                <span>{isBn ? 'ম্যানেজার পরিবর্তন করুন' : 'Transfer Leadership'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{isBn ? 'শুধুমাত্র বর্তমান ম্যানেজার দায়িত্ব হস্তান্তর করতে পারেন।' : 'Only current manager can transfer role.'}</span>
              </div>
            )}
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

        {/* Day & Night Mode (Theme Settings) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sun className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              {isBn ? 'থিম ও ডিসপ্লে মোড (দিন / রাত)' : 'Theme & Display (Day / Night)'}
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            {isBn
              ? 'আপনার সুবিধামতো দিন মোড (লাইট) অথবা রাত মোড (ডার্ক) নির্বাচন করুন।'
              : 'Choose between Day mode (Light) or Night mode (Dark) for comfortable viewing.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Sun className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <span className="text-xs font-bold block">{isBn ? 'দিন মোড' : 'Day Mode'}</span>
                <span className="text-[10px] text-slate-500">{isBn ? 'উজ্জ্বল লাইট থিম' : 'Clean Light'}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-50/40 text-indigo-900 ring-2 ring-indigo-500/20 font-bold'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <span className="text-xs font-bold block">{isBn ? 'রাত মোড' : 'Night Mode'}</span>
                <span className="text-[10px] text-slate-500">{isBn ? 'চোখের জন্য আরামদায়ক' : 'Dark Navy'}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                theme === 'system'
                  ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Laptop className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <span className="text-xs font-bold block">{isBn ? 'সিস্টেম থিম' : 'System Theme'}</span>
                <span className="text-[10px] text-slate-500">{isBn ? 'ডিভাইসের সাথে মিল রেখে' : 'Auto Match'}</span>
              </div>
            </button>
          </div>
        </div>
      </form>

      <MessProfilePictureModal
        isOpen={messLogoModalOpen}
        onClose={() => setMessLogoModalOpen(false)}
      />

      <TransferManagerModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
      />
    </div>
  );
};
