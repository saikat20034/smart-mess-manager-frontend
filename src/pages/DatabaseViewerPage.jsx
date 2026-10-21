import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  ShieldAlert,
  ShieldCheck,
  Key,
  Download,
  Copy,
  Check,
  Code,
  Table as TableIcon,
  RefreshCw,
  Search,
  Server,
  Lock,
  Layers,
  FileJson,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { STORAGE_KEYS } from '../services/storageService';

const TABLE_DEFINITIONS = [
  {
    key: STORAGE_KEYS.MEMBERS,
    label: 'সদস্য ও ম্যানেজার তালিকা',
    labelEn: 'Mess Members & Roles',
    desc: 'সকল সদস্যের নাম, রোল (ম্যানেজার/মেম্বার), ফোন, ইমেইল ও প্রোফাইল'
  },
  {
    key: STORAGE_KEYS.MEALS,
    label: 'দৈনিক মিল রেকর্ডসমূহ',
    labelEn: 'Daily Meals Matrix',
    desc: 'সকাল, দুপুর ও রাতের মিলের হিসাব (০.২৫ নির্ভুল স্টেপসহ)'
  },
  {
    key: STORAGE_KEYS.EXPENSES,
    label: 'বাজার ও যাবতীয় খরচ',
    labelEn: 'Mess Expenses Ledger',
    desc: 'দৈনিক বাজার, খালার বেতন, গ্যাস, ওয়াইফাই ও অন্যান্য খরচের হিসাব'
  },
  {
    key: STORAGE_KEYS.DEPOSITS,
    label: 'জমা ও পেমেন্ট হিস্ট্রি',
    labelEn: 'Deposits & Advances',
    desc: 'সদস্যদের বিকাশ, নগদ ও ক্যাশ জমার হিস্ট্রি এবং ট্রানজেকশন আইডি'
  },
  {
    key: STORAGE_KEYS.BAZAR_LIST,
    label: 'বাজারের ফর্দ',
    labelEn: 'Bazar Grocery Checklist',
    desc: 'চলতি কেনাকাটার ফর্দ, আনুমানিক খরচ ও ক্রয় স্ট্যাটাস'
  },
  {
    key: STORAGE_KEYS.BAZAR_SCHEDULE,
    label: 'বাজার ডিউটি শিডিউল',
    labelEn: 'Bazar Duty Schedule',
    desc: 'কার কোন তারিখে বাজার করার দায়িত্ব তার বিস্তারিত তালিকা'
  },
  {
    key: STORAGE_KEYS.MESS,
    label: 'মেস কনফিগারেশন ও রুলস',
    labelEn: 'Mess Configuration',
    desc: 'মেসের নাম, ঠিকানা, মিল ইউনিট রেসিও, ইনভাইট কোড ও নীতিমালা'
  },
  {
    key: STORAGE_KEYS.SETTLEMENTS,
    label: 'মাসিক ফাইনাল সেটেলমেন্ট',
    labelEn: 'Monthly Settlement Audits',
    desc: 'মাস শেষে ফাইনাল অডিট হিসাব, মোট মিল রেট ও ব্যালেন্স রসিদ'
  }
];

export const DatabaseViewerPage = () => {
  const { user, isAdmin, isManager, verifyAdminKey } = useAuth();
  const { isBn } = useLanguage();

  const [activeTableKey, setActiveTableKey] = useState(STORAGE_KEYS.MEMBERS);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'json'
  const [searchQuery, setSearchQuery] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Read all tables from localStorage
  const databaseData = useMemo(() => {
    if (typeof localStorage === 'undefined') return {};
    const result = {};
    TABLE_DEFINITIONS.forEach((t) => {
      try {
        const raw = localStorage.getItem(t.key);
        result[t.key] = raw ? JSON.parse(raw) : null;
      } catch (e) {
        result[t.key] = { error: 'Failed to parse JSON', raw: localStorage.getItem(t.key) };
      }
    });
    return result;
  }, [refreshKey]);

  // Total records count across all tables
  const totalRecords = useMemo(() => {
    let count = 0;
    Object.values(databaseData).forEach((val) => {
      if (Array.isArray(val)) {
        count += val.length;
      } else if (val && typeof val === 'object') {
        count += 1;
      }
    });
    return count;
  }, [databaseData]);

  const activeTableDef = TABLE_DEFINITIONS.find((t) => t.key === activeTableKey) || TABLE_DEFINITIONS[0];
  const activeTableRawData = databaseData[activeTableKey];

  // Filtered rows for active table
  const filteredRows = useMemo(() => {
    if (!activeTableRawData) return [];
    if (!Array.isArray(activeTableRawData)) {
      return [activeTableRawData];
    }
    if (!searchQuery.trim()) return activeTableRawData;

    const q = searchQuery.toLowerCase();
    return activeTableRawData.filter((row) => {
      const rowStr = JSON.stringify(row).toLowerCase();
      return rowStr.includes(q);
    });
  }, [activeTableRawData, searchQuery]);

  // Extract columns dynamically
  const tableColumns = useMemo(() => {
    if (!filteredRows || filteredRows.length === 0) return [];
    const sample = filteredRows[0];
    if (typeof sample !== 'object' || sample === null) return ['Value'];
    return Object.keys(sample);
  }, [filteredRows]);

  // Admin PIN verification handler
  const handlePinSubmit = (e) => {
    e.preventDefault();
    setPinError('');
    if (!adminPin.trim()) {
      setPinError('দয়া করে অ্যাডমিন সিক্রেট কি প্রবেশ করান');
      return;
    }

    const verified = verifyAdminKey(adminPin.trim());
    if (verified) {
      setPinSuccess(true);
      setAdminPin('');
    } else {
      setPinError('ভুল অ্যাডমিন কি! শুধুমাত্র নির্ধারিত অ্যাডমিন এই পেইজে প্রবেশ করতে পারবেন।');
    }
  };

  // Download entire database as a JSON backup
  const handleDownloadBackup = () => {
    const backupPayload = {
      app: 'Smart Mess Manager',
      backup_timestamp: new Date().toISOString(),
      super_admin: user?.email || 'Admin',
      tables: databaseData
    };
    const jsonStr = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_mess_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy current table JSON
  const handleCopyTableJson = () => {
    const jsonStr = JSON.stringify(activeTableRawData, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // =========================================================================
  // ACCESS RESTRICTION SCREEN (If not Admin)
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>শুধুমাত্র সুপার অ্যাডমিন অনুমতিপ্রাপ্ত</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            অ্যাডমিন অ্যাক্সেস প্রয়োজন
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            মেস ম্যানেজার বা সাধারণ মেম্বাররা সিস্টেম ডাটাবেস দেখতে পারবেন না। সমগ্র অ্যাপের জন্য <strong>একমাত্র সুপার অ্যাডমিন</strong> নির্ধারিত রয়েছে।
          </p>

          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>বর্তমান ইউজার:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name || 'Guest'}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>ইউজার রোল:</span>
              <span className="font-mono uppercase font-bold text-amber-600 dark:text-amber-400">{user?.role || 'member'}</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>নির্ধারিত অ্যাডমিন:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">mazharulislamsaikat2000gmail.com</span>
            </p>
          </div>

          {/* Admin Passkey Verification Form */}
          <form onSubmit={handlePinSubmit} className="mt-6 text-left space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              আপনি কি অ্যাপ অ্যাডমিন? অ্যাডমিন কি (Admin Passkey) দিয়ে ভেরিফাই করুন:
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="অ্যাডমিন সিক্রেট কি লিখুন..."
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{pinError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>অ্যাডমিন ভেরিফাই করুন</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ড্যাশবোর্ডে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUPER ADMIN DATABASE VIEWER SCREEN
  // =========================================================================
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>সুপার অ্যাডমিন ডাটাবেস এক্সপ্লোরার</span>
            <span className="text-emerald-500">•</span>
            <span className="text-slate-300 text-[11px]">{user?.email || 'mazharulislamsaikat2000gmail.com'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Database className="w-6 h-6 text-emerald-400" />
            <span>সিস্টেম ডাটাবেস ভিউয়ার</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            অ্যাপ্লিকেশনের সকল মেস, মেম্বার, মিল, খরচ ও ট্রানজেকশনের সম্পূর্ণ লাইভ ডাটাবেস পরিদর্শন ও ব্যাকআপ।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Reload from LocalStorage"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>রিফ্রেশ</span>
          </button>
          <button
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            title="Download full JSON database backup"
          >
            <Download className="w-4 h-4" />
            <span>ডাটাবেস ব্যাকআপ ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* 4 Health & Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>মোট ডাটাবেস টেবিল</span>
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {TABLE_DEFINITIONS.length} টি টেবিল
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            সকল স্কিমা সক্রিয়
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <FileJson className="w-4 h-4 text-indigo-500" />
            <span>মোট রেকর্ড সংখ্যা</span>
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {totalRecords} টি রেকর্ড
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            সদস্য, মিল, খরচ ও ট্রানজেকশন
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <Server className="w-4 h-4 text-amber-500" />
            <span>স্টোরেজ ইঞ্জিন</span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white font-mono truncate">
            Local Storage
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            PostgreSQL / Supabase Ready
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <UserCheck className="w-4 h-4 text-rose-500" />
            <span>অ্যাক্সেস প্রিভিলেজ</span>
          </div>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            Super Admin
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            ১ জন অনুমোদিত অ্যাডমিন
          </p>
        </div>
      </div>

      {/* Main Table Explorer */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Selector Tabs */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {TABLE_DEFINITIONS.map((tab) => {
              const isActive = tab.key === activeTableKey;
              const rowCount = Array.isArray(databaseData[tab.key])
                ? databaseData[tab.key].length
                : (databaseData[tab.key] ? 1 : 0);

              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTableKey(tab.key);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {rowCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action & Filter Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeTableDef.label}
              </h2>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {activeTableDef.key}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {activeTableDef.desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search within table */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="এই টেবিলে সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Structured Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>টেবিল ভিউ</span>
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'json'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Raw JSON View"
              >
                <Code className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>

            {/* Copy Table JSON Button */}
            <button
              onClick={handleCopyTableJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Copy active table JSON to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে!' : 'কপি JSON'}</span>
            </button>
          </div>
        </div>

        {/* Content Viewer (Table or JSON) */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            {filteredRows.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Database className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">কোনো রেকর্ড পাওয়া যায়নি (খালি টেবিল)।</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center text-slate-400">#</th>
                    {tableColumns.map((col) => (
                      <th key={col} className="py-3 px-4 uppercase tracking-wider font-mono text-[11px]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {filteredRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center text-slate-400 text-[11px] font-sans">
                        {idx + 1}
                      </td>
                      {tableColumns.map((col) => {
                        const cellVal = row ? row[col] : undefined;
                        let display = '';
                        if (cellVal === null || cellVal === undefined) {
                          display = <span className="text-slate-400 italic font-sans text-[11px]">null</span>;
                        } else if (typeof cellVal === 'object') {
                          display = (
                            <span className="text-indigo-600 dark:text-indigo-400 text-[11px]">
                              {JSON.stringify(cellVal)}
                            </span>
                          );
                        } else if (col === 'role') {
                          display = (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                cellVal === 'manager'
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {cellVal}
                            </span>
                          );
                        } else if (col === 'status') {
                          display = (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                cellVal === 'active'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                              }`}
                            >
                              {cellVal}
                            </span>
                          );
                        } else {
                          display = String(cellVal);
                        }

                        return (
                          <td key={col} className="py-3 px-4 text-slate-800 dark:text-slate-200 text-xs truncate max-w-xs">
                            {display}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[600px]">
            <pre className="text-emerald-400">
              {JSON.stringify(activeTableRawData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
