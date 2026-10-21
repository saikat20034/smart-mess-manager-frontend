import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  UtensilsCrossed,
  ShoppingCart,
  CheckSquare,
  History,
  CalendarDays,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useMess } from '../context/MessContext';
import { ThemeToggle } from './ThemeToggle';
import { ProfilePictureModal } from './ProfilePictureModal';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isManager, logout } = useAuth();
  const { t, isBn } = useLanguage();
  const {
    selectedMonth,
    isCurrentMonth,
    switchToPreviousMonth,
    switchToCurrentMonth,
    formatMonthName,
    members,
    currentManager
  } = useMess();
  const navigate = useNavigate();
  const [profilePhotoModalOpen, setProfilePhotoModalOpen] = useState(false);

  // Resolve active profile accurately, prioritizing actual mess members over stale demo defaults
  const activeUser = React.useMemo(() => {
    if (user && user.email && user.email !== 'saikat@mess.ac.bd') return user;
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
  const displayInitial = displayName.trim().charAt(0).toUpperCase() || 'U';

  const navItems = [
    { path: '/dashboard', label: t('homePage'), icon: LayoutDashboard },
    { path: '/settlement', label: t('calcRoom'), icon: Calculator },
    { path: '/meals', label: isManager ? t('addMeal') : (isBn ? 'মিল তালিকা' : 'Meals List'), icon: UtensilsCrossed },
    { path: '/expenses', label: isManager ? t('addExpense') : (isBn ? 'খরচের তালিকা' : 'Expenses List'), icon: ShoppingCart },
    { path: '/bazar-planner', label: t('bazarRoster'), icon: CheckSquare },
    { path: '/previous-month', label: t('previousMonth'), icon: History },
    { path: '/all-months', label: t('allMonths'), icon: CalendarDays },
    { path: '/settings', label: isBn ? 'মেস সেটিংস' : 'Mess Settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 w-56 border-r border-slate-200 dark:border-slate-800">
      {/* Mobile Header with Close */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 lg:hidden">
        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{isBn ? 'মেনু' : 'Menu'}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Active Month Indicator & Quick Switcher */}
        <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800 my-1">
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">
              <span>{isBn ? 'সক্রিয় মাস' : 'Active Month'}</span>
              <span className={`px-1.5 py-0.5 rounded-full font-bold ${isCurrentMonth ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'}`}>
                {isCurrentMonth ? (isBn ? 'চলতি' : 'Current') : (isBn ? 'বিগত' : 'Past')}
              </span>
            </div>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
              {formatMonthName(selectedMonth, isBn)}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              {isCurrentMonth ? (
                <button
                  type="button"
                  onClick={() => {
                    switchToPreviousMonth();
                    navigate('/previous-month');
                    onClose && onClose();
                  }}
                  className="w-full text-center py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <History className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span>{t('previousMonth')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    switchToCurrentMonth();
                    navigate('/dashboard');
                    onClose && onClose();
                  }}
                  className="w-full text-center py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span>✓ {t('returnToCurrentMonth')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setProfilePhotoModalOpen(true)}
            className="flex items-center gap-2.5 text-left group cursor-pointer hover:opacity-90 transition-opacity"
            title={isBn ? "প্রোফাইল ছবি পরিবর্তন করতে ক্লিক করুন" : "Click to change profile picture"}
          >
            {activeUser?.avatar ? (
              <img
                src={activeUser.avatar}
                alt={displayName}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover group-hover:ring-2 group-hover:ring-rose-400 transition-all"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-xs group-hover:ring-2 group-hover:ring-rose-400 transition-all">
                {displayInitial}
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[85px]">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                {activeUser?.role === 'manager' ? (isBn ? 'ম্যানেজার' : 'Manager') : (isBn ? 'মেম্বার' : 'Member')}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1.5">
            <ThemeToggle size="sm" showLabel={false} />
            <button
              onClick={handleLogout}
              title={t('logout')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ProfilePictureModal
        isOpen={profilePhotoModalOpen}
        onClose={() => setProfilePhotoModalOpen(false)}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10">{navContent}</div>
        </div>
      )}
    </>
  );
};
