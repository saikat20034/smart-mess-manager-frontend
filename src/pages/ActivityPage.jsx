import React, { useState } from 'react';
import {
  History,
  ShoppingCart,
  UtensilsCrossed,
  CreditCard,
  Lock,
  UserCheck,
  Settings,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { Badge } from '../components/Badge';

export const ActivityPage = () => {
  const { activities } = useMess();
  const [searchTerm, setSearchTerm] = useState('');

  const getActionIcon = (action) => {
    switch (action) {
      case 'RECORD_EXPENSE':
        return <ShoppingCart className="w-4 h-4 text-emerald-600" />;
      case 'RECORD_MEALS':
      case 'RECORD_MEAL':
        return <UtensilsCrossed className="w-4 h-4 text-amber-600" />;
      case 'RECORD_DEPOSIT':
        return <CreditCard className="w-4 h-4 text-indigo-600" />;
      case 'FINALIZE_SETTLEMENT':
        return <Lock className="w-4 h-4 text-rose-600" />;
      case 'ADD_MEMBER':
      case 'UPDATE_MEMBER':
        return <UserCheck className="w-4 h-4 text-teal-600" />;
      default:
        return <Settings className="w-4 h-4 text-slate-600" />;
    }
  };

  const filteredLogs = activities.filter((act) => {
    return (
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Activity & Financial Audit Log
          </h1>
          <p className="text-xs text-slate-500">
            Immutable tracking of expenses, meal modifications, deposits, and settlement events.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="space-y-4">
          {filteredLogs.map((item, index) => (
            <div key={item.id || index} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                {getActionIcon(item.action)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{item.details}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {item.action}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No activity logs match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
