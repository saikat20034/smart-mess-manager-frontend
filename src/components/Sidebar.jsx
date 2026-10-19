import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  ShoppingCart,
  CreditCard,
  Calculator,
  FileText,
  History,
  Settings,
  UserCheck,
  Copy,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMess } from '../context/MessContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/members', label: 'Members', icon: Users },
  { path: '/meals', label: 'Meal Management', icon: UtensilsCrossed },
  { path: '/expenses', label: 'Expenses & Bazar', icon: ShoppingCart },
  { path: '/deposits', label: 'Deposits', icon: CreditCard },
  { path: '/settlement', label: 'Monthly Settlement', icon: Calculator },
  { path: '/reports', label: 'Reports & Exports', icon: FileText },
  { path: '/my-summary', label: 'My Personal Summary', icon: UserCheck },
  { path: '/activity', label: 'Activity Logs', icon: History },
  { path: '/settings', label: 'Mess Settings', icon: Settings }
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { isManager } = useAuth();
  const { mess } = useMess();
  const [copied, setCopied] = useState(false);

  const copyInviteCode = () => {
    if (mess?.invite_code) {
      navigator.clipboard.writeText(mess.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      {/* Mobile Header with Close */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
        <span className="font-semibold text-white text-sm">Navigation</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-900/20 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Invite Code Widget */}
      <div className="p-3 border-t border-slate-800">
        <div className="rounded-xl bg-slate-800/90 p-3 border border-slate-700/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">Mess Invite Code</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between bg-slate-950/80 rounded-lg px-2.5 py-1.5 border border-slate-700/50">
            <code className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
              {mess?.invite_code || 'PADMA2026'}
            </code>
            <button
              onClick={copyInviteCode}
              title="Copy invite code"
              className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="mt-1.5 text-[10px] text-slate-400">
            Share with room-mates to join this mess.
          </p>
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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10">{navContent}</div>
        </div>
      )}
    </>
  );
};
