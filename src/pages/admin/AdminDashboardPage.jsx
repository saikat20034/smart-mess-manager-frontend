import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Users,
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  LogOut,
  Download,
  Search,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  Database,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  BarChart3,
  Clock,
  RefreshCw,
  Copy,
  Check,
  Code,
  Table as TableIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { adminService, ADMIN_CREDENTIALS } from '../../services/adminService';
import { STORAGE_KEYS } from '../../services/storageService';
import { formatBDT } from '../../utils/calculations';

export const AdminDashboardPage = () => {
  const { superAdmin, logoutSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('messes'); // 'messes' | 'users' | 'analytics' | 'database'
  const [searchMesses, setSearchMesses] = useState('');
  const [searchUsers, setSearchUsers] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [activeDbTable, setActiveDbTable] = useState(STORAGE_KEYS.MEMBERS);
  const [dbViewMode, setDbViewMode] = useState('table'); // 'table' | 'json'
  const [copied, setCopied] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch live aggregated data
  const messes = useMemo(() => adminService.getAllMesses(), [refreshTrigger]);
  const users = useMemo(() => adminService.getAllUsers(), [refreshTrigger]);
  const stats = useMemo(() => adminService.getPlatformStats(), [refreshTrigger]);

  const handleLogout = () => {
    logoutSuperAdmin();
    navigate('/admin/login');
  };

  // Filter messes
  const filteredMesses = useMemo(() => {
    if (!searchMesses.trim()) return messes;
    const q = searchMesses.toLowerCase();
    return messes.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.invite_code.toLowerCase().includes(q) ||
        m.manager_name.toLowerCase().includes(q) ||
        (m.location && m.location.toLowerCase().includes(q))
    );
  }, [messes, searchMesses]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const q = searchUsers.toLowerCase();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.mess_name.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q));
      return matchRole && matchSearch;
    });
  }, [users, userRoleFilter, searchUsers]);

  // Live Database reader for the DB tab
  const activeTableRawData = useMemo(() => {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(activeDbTable);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }, [activeDbTable, refreshTrigger]);

  // Download entire platform backup
  const handleDownloadFullBackup = () => {
    const backupData = {
      app: 'Smart Mess Manager Platform',
      backup_timestamp: new Date().toISOString(),
      super_admin: ADMIN_CREDENTIALS.email,
      platform_metrics: stats,
      all_messes: messes,
      all_users: users,
      raw_database_tables: {
        members: localStorage.getItem(STORAGE_KEYS.MEMBERS),
        meals: localStorage.getItem(STORAGE_KEYS.MEALS),
        expenses: localStorage.getItem(STORAGE_KEYS.EXPENSES),
        deposits: localStorage.getItem(STORAGE_KEYS.DEPOSITS),
        bazar_list: localStorage.getItem(STORAGE_KEYS.BAZAR_LIST),
        bazar_schedule: localStorage.getItem(STORAGE_KEYS.BAZAR_SCHEDULE),
        mess_config: localStorage.getItem(STORAGE_KEYS.MESS),
        settlements: localStorage.getItem(STORAGE_KEYS.SETTLEMENTS)
      }
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `super_admin_full_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    if (!activeTableRawData) return;
    navigator.clipboard.writeText(JSON.stringify(activeTableRawData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/60">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">
                  Smart Mess <span className="text-emerald-400">Manager</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold tracking-wide uppercase">
                  Super Admin
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                {ADMIN_CREDENTIALS.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick link to regular app dashboard */}
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <span>মেস ভিউতে যান</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Full Database Backup Button */}
            <button
              onClick={handleDownloadFullBackup}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ব্যাকআপ ডাউনলোড</span>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
              title="Logout from Super Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Welcome & Live Status Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>মাস্টার সিস্টেম কন্ট্রোল সক্রিয়</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              স্বাগতম, সুপার অ্যাডমিন!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              এখান থেকে আপনি অ্যাপের সকল সক্রিয় মেস, মেম্বার সংখ্যা, কোন তারিখে মেস শুরু হয়েছে, এবং সামগ্রিক পরিসংখ্যান দেখতে পাচ্ছেন।
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
              <p className="text-[11px] text-slate-400">সিস্টেম স্বাস্থ্য</p>
              <p className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>১০০% কার্যকর ও সক্রিয়</span>
              </p>
            </div>
          </div>
        </div>

        {/* 5 High-Level KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Messes */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">মোট সক্রিয় মেস</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">
              {stats.totalMesses}
            </p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>{stats.activeMesses}টি নিয়মিত ব্যবহারকারী</span>
            </p>
          </div>

          {/* Card 2: Total Users */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">মোট ইউজার সংখ্যা</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">
              {stats.totalUsers}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              ম্যানেজার: <strong className="text-amber-400">{stats.totalManagers}</strong> • মেম্বার: <strong className="text-slate-200">{stats.totalMembers}</strong>
            </p>
          </div>

          {/* Card 3: Total Meals Tracked */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">মোট মিল ট্র্যাকিং</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">
              {stats.totalMeals.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              গড় মিল রেট: <strong className="text-emerald-400">{formatBDT(stats.averageMealRate)}</strong>
            </p>
          </div>

          {/* Card 4: Total Turnover */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">মোট আর্থিক লেনদেন</span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono truncate">
              {formatBDT(stats.totalTurnover)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              খরচ: {formatBDT(stats.totalExpenses)}
            </p>
          </div>

          {/* Card 5: System Engine */}
          <div className="col-span-2 sm:col-span-1 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">মাস্টার ডাটাবেস</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-bold text-white font-mono">
              ৮টি সক্রিয় স্কিমা
            </p>
            <p className="text-[11px] text-emerald-400 mt-1">
              HTML5 Web Storage
            </p>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('messes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'messes'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>সকল মেসের তালিকা ({messes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>সকল মেম্বার ও ইউজার ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>পরিসংখ্যান ও প্রবৃদ্ধি চার্ট</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'database'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>সিস্টেম ডাটাবেস ইন্সপেক্টর</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: ALL MESSES DIRECTORY
           ========================================================================= */}
        {activeTab === 'messes' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">অ্যাপ ব্যবহারকারী মেসসমূহ</h2>
                <p className="text-xs text-slate-400">
                  কোন মেস কোন তারিখ থেকে চালু আছে, ম্যানেজারের তথ্য ও মোট সদস্য সংখ্যা।
                </p>
              </div>

              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="মেস নাম, কোড বা ম্যানেজার খুঁজুন..."
                  value={searchMesses}
                  onChange={(e) => setSearchMesses(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">মেসের নাম ও লোকেশন</th>
                      <th className="py-3 px-4">ইনভাইট কোড</th>
                      <th className="py-3 px-4">ম্যানেজার ও যোগাযোগ</th>
                      <th className="py-3 px-4 text-center">মেম্বার সংখ্যা</th>
                      <th className="py-3 px-4">ব্যবহারের শুরুর তারিখ</th>
                      <th className="py-3 px-4">মোট মিল ও খরচ</th>
                      <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredMesses.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-500">
                          <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-70" />
                          <p className="text-xs font-semibold text-slate-400">কোনো মেস পাওয়া যায়নি</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">নতুন কোনো মেস নিবন্ধিত হলে এখানে স্বয়ংক্রিয়ভাবে তালিকা প্রদর্শিত হবে।</p>
                        </td>
                      </tr>
                    ) : (
                      filteredMesses.map((mess) => (
                        <tr key={mess.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-white text-xs">{mess.name}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <span>{mess.location}</span>
                              <span>•</span>
                              <span className="text-slate-500">{mess.subtitle}</span>
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-300 font-bold text-[11px]">
                              {mess.invite_code}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-200">{mess.manager_name}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span>{mess.manager_phone}</span>
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-xs">
                              <Users className="w-3 h-3" />
                              <span>{mess.members_count} জন</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{mess.created_at}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              সর্বশেষ সক্রিয়: {mess.last_active}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-xs font-mono font-bold text-white">
                              {mess.total_meals} মিল
                            </p>
                            <p className="text-[11px] font-mono text-emerald-400">
                              {formatBDT(mess.total_expenses)}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              {mess.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ALL USERS DIRECTORY
           ========================================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">অ্যাপ ব্যবহারকারী সকল মেম্বার</h2>
                <p className="text-xs text-slate-400">
                  সকল মেসের ম্যানেজার ও মেম্বারদের সেন্ট্রাল রোল ও কন্টাক্ট ডিরেক্টরি।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">সকল রোল ({users.length})</option>
                  <option value="manager">শুধুমাত্র ম্যানেজার ({stats.totalManagers})</option>
                  <option value="member">শুধুমাত্র মেম্বার ({stats.totalMembers})</option>
                </select>

                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ইউজার নাম, মেস, ফোন বা ইমেইল..."
                    value={searchUsers}
                    onChange={(e) => setSearchUsers(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">ইউজারের নাম</th>
                      <th className="py-3 px-4">মেসের নাম</th>
                      <th className="py-3 px-4">রোল (Role)</th>
                      <th className="py-3 px-4">ইমেইল</th>
                      <th className="py-3 px-4">মোবাইল নাম্বার</th>
                      <th className="py-3 px-4">যুক্ত হওয়ার তারিখ</th>
                      <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-500">
                          <Users className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-70" />
                          <p className="text-xs font-semibold text-slate-400">কোনো ইউজার পাওয়া যায়নি</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">নতুন কোনো মেম্বার বা ম্যানেজার সাইন আপ করলে এখানে তালিকা প্রদর্শিত হবে।</p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-xs shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <span>{u.name}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {u.mess_name}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                u.role === 'manager'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {u.role === 'manager' ? 'মেস ম্যানেজার' : 'মেম্বার'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {u.email}
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                            {u.phone}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {u.joined_at}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: STATISTICAL ANALYTICS & CHARTS
           ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">প্ল্যাটফর্ম পরিসংখ্যান ও প্রবৃদ্ধি</h2>
              <p className="text-xs text-slate-400">
                স্মার্ট মেস ম্যানেজার অ্যাপ ব্যবহারের মাসভিত্তিক গ্রোথ ও মিল হিসাবের রিয়েল-টাইম চার্ট।
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Messes and Users Growth */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">মাসভিত্তিক মেস ও ইউজার প্রবৃদ্ধি</h3>
                    <p className="text-[11px] text-slate-400">নতুন মেস ও মেম্বার যুক্ত হওয়ার ট্রেন্ড</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="h-64 w-full flex flex-col items-center justify-center text-slate-500 text-xs">
                  {stats.messesGrowth.length === 0 ? (
                    <div className="text-center">
                      <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
                      <span>কোনো সক্রিয় মেসের প্রবৃদ্ধি ডেটা পাওয়া যায়নি</span>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.messesGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Bar dataKey="messes" name="সক্রিয় মেস" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="users" name="মোট মেম্বার" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Chart 2: Total Meals Distribution */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">মাসিক মোট মিলের পরিসংখ্যান</h3>
                    <p className="text-[11px] text-slate-400">সকল মেস মিলিয়ে কনজিউম করা মোট মিল</p>
                  </div>
                  <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                </div>
                <div className="h-64 w-full flex flex-col items-center justify-center text-slate-500 text-xs">
                  {stats.messesGrowth.length === 0 ? (
                    <div className="text-center">
                      <UtensilsCrossed className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
                      <span>কোনো মিলের তথ্য পাওয়া যায়নি</span>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.messesGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Line
                          type="monotone"
                          dataKey="meals"
                          name="মোট মিল সংখ্যা"
                          stroke="#f59e0b"
                          strokeWidth={3}
                          dot={{ r: 5, fill: '#f59e0b' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Mess Comparison Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-white mb-3">মেসভিত্তিক আর্থিক তুলনা ও টার্নওভার</h3>
              {messes.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <span>কোনো মেসের তথ্য পাওয়া যায়নি</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {messes.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs truncate max-w-[180px]">{m.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400">{m.members_count} জন</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>মোট মিল:</span>
                        <span className="font-mono text-white font-bold">{m.total_meals}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>মোট খরচ:</span>
                        <span className="font-mono text-emerald-400 font-bold">{formatBDT(m.total_expenses)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MASTER DATABASE INSPECTOR
           ========================================================================= */}
        {activeTab === 'database' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">লাইভ ডাটাবেস টেবিল ব্রাউজার</h2>
                <p className="text-xs text-slate-400">
                  ব্রাউজার লোকাল স্টোরেজে সংরক্ষিত সকল কাঁচা ডাটাবেস টেবিল পরিদর্শন ও ব্যাকআপ।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setRefreshTrigger((prev) => prev + 1)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>রিফ্রেশ</span>
                </button>
                <button
                  onClick={handleDownloadFullBackup}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>সম্পূর্ণ ব্যাকআপ ডাউনলোড</span>
                </button>
              </div>
            </div>

            {/* Table Selector Pills */}
            <div className="flex flex-wrap gap-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
              {[
                { key: STORAGE_KEYS.MEMBERS, label: 'Members (মেম্বার)' },
                { key: STORAGE_KEYS.MEALS, label: 'Meals (মিল হিস্ট্রি)' },
                { key: STORAGE_KEYS.EXPENSES, label: 'Expenses (খরচ)' },
                { key: STORAGE_KEYS.DEPOSITS, label: 'Deposits (জমা)' },
                { key: STORAGE_KEYS.BAZAR_LIST, label: 'Bazar List (বাজার)' },
                { key: STORAGE_KEYS.MESS, label: 'Mess Config (মেস)' },
                { key: STORAGE_KEYS.SETTLEMENTS, label: 'Settlements (হিসাব)' }
              ].map((tbl) => (
                <button
                  key={tbl.key}
                  onClick={() => setActiveDbTable(tbl.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeDbTable === tbl.key
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {tbl.label}
                </button>
              ))}
            </div>

            {/* View Mode & Copy Button */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">
                সক্রিয় টেবিল: <strong className="text-white">{activeDbTable}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কপি JSON'}</span>
                </button>
              </div>
            </div>

            {/* Code / JSON block */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto max-h-[500px]">
              <pre className="text-xs font-mono text-emerald-400">
                {JSON.stringify(activeTableRawData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

