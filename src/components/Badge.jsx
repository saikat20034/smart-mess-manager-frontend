import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  }[size] || 'px-2.5 py-1 text-xs font-medium';

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    primary: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    manager: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
    member: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    credit: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    due: 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    inactive: 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700',
    bkash: 'bg-pink-50 text-pink-700 border border-pink-200 font-medium dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/60',
    nagad: 'bg-orange-50 text-orange-700 border border-orange-200 font-medium dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60',
    cash: 'bg-teal-50 text-teal-700 border border-teal-200 font-medium dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60'
  }[variant] || 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700';

  return (
    <span className={`inline-flex items-center rounded-full ${sizeClasses} ${variantClasses}`}>
      {children}
    </span>
  );
};
