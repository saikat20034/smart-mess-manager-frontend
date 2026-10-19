import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  UtensilsCrossed,
  ShoppingCart,
  CheckSquare,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isManager, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: t('homePage'), icon: LayoutDashboard },
    { path: '/settlement', label: t('calcRoom'), icon: Calculator },
    { path: '/meals', label: t('addMeal'), icon: UtensilsCrossed },
    { path: '/expenses', label: t('addExpense'), icon: ShoppingCart },
    { path: '/bazar-planner', label: t('bazarRoster'), icon: CheckSquare }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white text-slate-700 w-56 border-r border-slate-200">
      {/* Mobile Header with Close */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
        <span className="font-bold text-slate-900 text-xs">মেনু</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Links (Matching screenshot labels: হোম পেজ, হিসাব রুম, মিল যুক্ত, খরচ যুক্ত) */}
      <nav className="flex-1 px-3 py-4 space-y-1">
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
                    ? 'bg-slate-100 text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Profile Section (Matching screenshot: Avatar, "Manager", Logout icon) */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {isManager ? 'Manager' : 'Member'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title={t('logout')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
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
