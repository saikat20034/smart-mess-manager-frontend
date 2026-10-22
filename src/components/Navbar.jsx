import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  RotateCcw,
  Sparkles,
  LogOut,
  ChevronDown,
  Building2,
  Home,
  RefreshCw,
  User,
  Languages,
  Calendar,
  Clock,
  Camera,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMess } from '../context/MessContext';
import { useLanguage } from '../context/LanguageContext';
import { useLiveClock } from '../hooks/useLiveClock';
import { Badge } from './Badge';
import { ThemeToggle } from './ThemeToggle';
import { ProfilePictureModal } from './ProfilePictureModal';
import { MessProfilePictureModal } from './MessProfilePictureModal';
import { Avatar } from './Avatar';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isManager, logout } = useAuth();
  const { selectedMonth, setSelectedMonth, mess, members, currentManager, refreshData, resetAllDemoData } = useMess();
  const { lang, toggleLanguage, t, isBn } = useLanguage();
  const { liveTimeStr, liveDateShort } = useLiveClock(isBn);
  const [profileOpen, setProfileOpen] = useState(false);
  const [messPhotoModalOpen, setMessPhotoModalOpen] = useState(false);
  const [userPhotoModalOpen, setUserPhotoModalOpen] = useState(false);
  const [messPhotoToast, setMessPhotoToast] = useState(false);
  const [userPhotoToast, setUserPhotoToast] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve active profile accurately, prioritizing actual mess members over stale demo defaults
  const activeUser = React.useMemo(() => {
    // If user has a real custom email (not placeholder saikat@mess.ac.bd)
    if (user && user.email && user.email !== 'saikat@mess.ac.bd') return user;

    // If user has saikat@mess.ac.bd or is missing, check if mess has real members
    if (members && members.length > 0) {
      const realMember = members.find(
        (m) => m.id === user?.id || (m.email && m.email.toLowerCase() === user?.email?.toLowerCase())
      );
      if (realMember) return realMember;
      if (currentManager && currentManager.email !== 'saikat@mess.ac.bd') {
        return currentManager;
      }
      return members[0];
    }
    return user;
  }, [user, members, currentManager]);

  const displayName = activeUser?.name || 'User';
  const displayEmail = activeUser?.email || activeUser?.phone || '';
  const displayInitial = displayName.trim().charAt(0).toUpperCase() || 'U';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const messInitial = mess?.name ? mess.name.trim().charAt(0).toUpperCase() : 'M';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Brand: Mess Profile Picture / Logo & Mess Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            {/* Clickable Mess Profile Picture / Logo Button */}
            <button
              type="button"
              onClick={() => setMessPhotoModalOpen(true)}
              className="relative group cursor-pointer focus:outline-none shrink-0"
              title={isBn ? "মেস প্রোফাইল ছবি / লোগো পরিবর্তন করতে ক্লিক করুন" : "Click to change Mess Profile Picture / Logo"}
              aria-label="Change mess profile picture"
            >
              {mess?.logo ? (
                <img
                  src={mess.logo}
                  alt={mess?.name || "Mess Logo"}
                  className="w-9 h-9 rounded-full border-2 border-rose-500 object-cover shadow-xs group-hover:ring-2 group-hover:ring-rose-400 group-hover:scale-105 transition-all"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-xs font-bold text-lg group-hover:scale-105 transition-all">
                  {messInitial}
                </div>
              )}
              {/* Building badge indicating Mess identity */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-white dark:border-slate-800 text-white flex items-center justify-center shadow-xs group-hover:bg-rose-500 transition-colors">
                <Building2 className="w-2.5 h-2.5 text-rose-300 group-hover:text-white" />
              </div>
            </button>

            <Link
              to="/dashboard"
              className="hidden sm:inline font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight hover:text-rose-500 transition-colors max-w-[170px] md:max-w-[220px] truncate"
              title={mess?.name || "Smart Mess Manager"}
            >
              {mess?.name || 'Smart Mess Manager'}
            </Link>
          </div>
        </div>

        {/* Center Icons Navigation: Only Home and Sync */}
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <Link
            to="/dashboard"
            title={isBn ? "হোম পেজ" : "Home"}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              location.pathname === '/dashboard'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Home className="w-4 h-4" />
          </Link>

          <button
            onClick={handleRefresh}
            title={isBn ? "ডাটা সিঙ্ক / রিফ্রেশ" : "Sync / Refresh Data"}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>

        {/* Right side: Language Switcher, Role, Personal Member/Manager Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time Live Clock & Date Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{liveTimeStr}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">{liveDateShort}</span>
          </div>

          {/* Day & Night Mode Toggle */}
          <ThemeToggle size="md" />

          {/* Language Toggle (বাংলা / EN) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition-colors cursor-pointer"
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Languages className="w-3.5 h-3.5 text-rose-500" />
            <span>{isBn ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* Personal Member / Manager Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isBn ? "ব্যক্তিগত প্রোফাইল মেনু" : "Personal Profile Menu"}
            >
              <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200">
                {displayName}
              </span>
              <Avatar
                src={activeUser?.avatar}
                name={displayName}
                size="sm"
                border={true}
              />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>
                  <div className="mt-1">
                    <Badge variant={activeUser?.role === 'manager' ? 'manager' : 'member'} size="sm">
                      {activeUser?.role === 'manager' ? (isBn ? 'মেস ম্যানেজার' : 'Mess Manager') : (isBn ? 'মেস মেম্বার' : 'Mess Resident')}
                    </Badge>
                  </div>
                </div>

                <div className="px-4 py-2 text-xs flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{isBn ? 'দিন / রাত মোড' : 'Day / Night Mode'}</span>
                  <ThemeToggle size="sm" showLabel={true} />
                </div>

                {/* Change Personal Profile Picture */}
                <button
                  type="button"
                  onClick={() => setUserPhotoModalOpen(true)}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isBn ? 'ব্যক্তিগত ছবি পরিবর্তন' : 'Change Your Photo'}</span>
                </button>

                {/* Change Mess Profile Picture / Logo (Available to Manager) */}
                {isManager && (
                  <button
                    type="button"
                    onClick={() => setMessPhotoModalOpen(true)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isBn ? 'মেস লোগো পরিবর্তন' : 'Change Mess Logo'}</span>
                  </button>
                )}

                <Link
                  to="/my-summary"
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <User className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isBn ? 'আমার হিসাব (Personal Summary)' : 'My Summary & Ledger'}</span>
                </Link>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. Mess Profile Picture / Logo Modal */}
      <MessProfilePictureModal
        isOpen={messPhotoModalOpen}
        onClose={() => setMessPhotoModalOpen(false)}
        onPhotoSaved={() => {
          setMessPhotoToast(true);
          setTimeout(() => setMessPhotoToast(false), 3000);
        }}
      />

      {/* 2. Personal Member/Manager Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={userPhotoModalOpen}
        onClose={() => setUserPhotoModalOpen(false)}
        onPhotoSaved={() => {
          setUserPhotoToast(true);
          setTimeout(() => setUserPhotoToast(false), 3000);
        }}
      />

      {/* Mess Photo Toast */}
      {messPhotoToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <Building2 className="w-4 h-4 text-emerald-200" />
          <span>{isBn ? 'মেস প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!' : 'Mess profile picture updated successfully!'}</span>
        </div>
      )}

      {/* Personal Photo Toast */}
      {userPhotoToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{isBn ? 'আপনার প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!' : 'Personal profile picture updated successfully!'}</span>
        </div>
      )}
    </header>
  );
};
