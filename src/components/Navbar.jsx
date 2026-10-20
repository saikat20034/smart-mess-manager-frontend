import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  RotateCcw,
  Sparkles,
  LogOut,
  ChevronDown,
  Building2,
  LayoutGrid,
  Home,
  HelpCircle,
  RefreshCw,
  User,
  Languages,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMess } from '../context/MessContext';
import { useLanguage } from '../context/LanguageContext';
import { useLiveClock } from '../hooks/useLiveClock';
import { Badge } from './Badge';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isManager, switchRole, logout, isDemoMode } = useAuth();
  const { selectedMonth, setSelectedMonth, mess, refreshData, resetAllDemoData } = useMess();
  const { lang, toggleLanguage, t, isBn } = useLanguage();
  const { liveTimeStr, liveDateShort } = useLiveClock(isBn);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-xs font-bold text-lg">
              S
            </div>
            <span className="hidden sm:inline font-bold text-slate-900 text-sm tracking-tight">
              Smart Mess <span className="text-rose-500">Manager</span>
            </span>
          </Link>
        </div>

        {/* Center Icons Navigation (Matching screenshot) */}
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          <Link
            to="/dashboard"
            title="Dashboard"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              location.pathname === '/dashboard'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </Link>

          <Link
            to="/"
            title="Landing Page"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              location.pathname === '/'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Home className="w-4 h-4" />
          </Link>

          <a
            href="/#faqs"
            title="Help & FAQs"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </a>

          <button
            onClick={handleRefresh}
            title="Sync / Refresh Data"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <Link
            to="/my-summary"
            title="My Account"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              location.pathname === '/my-summary'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <User className="w-4 h-4" />
          </Link>
        </div>

        {/* Right side: Language Switcher, Role, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time Live Clock & Date Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/70 border border-slate-200/60 text-xs shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-slate-800 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{liveTimeStr}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium text-[11px]">{liveDateShort}</span>
          </div>

          {/* Day & Night Mode Toggle */}
          <ThemeToggle size="md" />

          {/* Language Toggle (বাংলা / EN) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors cursor-pointer"
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Languages className="w-3.5 h-3.5 text-rose-500" />
            <span>{isBn ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* User Profile matching screenshot ("Saikat" with photo) */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline text-xs font-bold text-slate-800">
                {user?.name || 'Saikat'}
              </span>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full border-2 border-rose-500 object-cover shadow-xs"
              />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Saikat'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'saikat@mess.ac.bd'}</p>
                  <div className="mt-1">
                    <Badge variant={isManager ? 'manager' : 'member'} size="sm">
                      {isManager ? 'Mess Manager' : 'Mess Resident'}
                    </Badge>
                  </div>
                </div>

                <div className="px-4 py-2 text-xs flex items-center justify-between border-b border-slate-100">
                  <span className="text-slate-600 font-medium">{isBn ? 'দিন / রাত মোড' : 'Day / Night Mode'}</span>
                  <ThemeToggle size="sm" showLabel={true} />
                </div>

                <button
                  onClick={() => switchRole(isManager ? 'member' : 'manager')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <span>রোল পরিবর্তন করুন</span>
                  <span className="text-[10px] font-bold text-rose-500">
                    {isManager ? 'Member View' : 'Manager View'}
                  </span>
                </button>

                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <span>{t('settings')}</span>
                </Link>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
