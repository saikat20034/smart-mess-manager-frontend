import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Calendar,
  Shield,
  User,
  RotateCcw,
  Sparkles,
  LogOut,
  ChevronDown,
  Building2,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMess } from '../context/MessContext';
import { Badge } from './Badge';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isManager, switchRole, logout, isDemoMode } = useAuth();
  const { selectedMonth, setSelectedMonth, mess, resetAllDemoData } = useMess();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Generate available month options (last 6 months)
  const monthOptions = React.useMemo(() => {
    const list = [];
    const date = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      list.push({ val, label });
    }
    return list;
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left side: Mobile Toggle & Brand / Mess Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base leading-tight tracking-tight block">
                Smart Mess <span className="text-emerald-600">Manager</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium truncate max-w-[180px] sm:max-w-xs block">
                {mess?.name || 'Padma Hall Mess, DU'}
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {monthOptions.map((opt) => (
                <option key={opt.val} value={opt.val}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Demo Mode Badge with Reset */}
          {isDemoMode && (
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-2.5 py-1 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="font-medium">Demo Mode</span>
              <button
                onClick={resetAllDemoData}
                title="Reset sample data"
                className="hover:text-emerald-950 p-0.5 rounded cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Role Switcher Button */}
          <button
            onClick={() => switchRole(isManager ? 'member' : 'manager')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isManager
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Toggle between Manager and Member view"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isManager ? 'Manager View' : 'Member View'}</span>
          </button>

          {/* Profile & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
              <span className="hidden sm:block text-xs font-medium text-slate-700 max-w-[100px] truncate">
                {user?.name || 'Tanvir'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <div className="mt-1">
                    <Badge variant={isManager ? 'manager' : 'member'} size="sm">
                      {isManager ? 'Mess Manager' : 'Mess Member'}
                    </Badge>
                  </div>
                </div>

                <Link
                  to="/my-summary"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Personal Summary</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Mess Settings</span>
                </Link>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
