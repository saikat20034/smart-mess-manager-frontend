import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  }[size] || 'px-2.5 py-1 text-xs font-medium';

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    manager: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    member: 'bg-slate-100 text-slate-700 border border-slate-200',
    credit: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
    due: 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    inactive: 'bg-slate-100 text-slate-500 border border-slate-200',
    bkash: 'bg-pink-50 text-pink-700 border border-pink-200 font-medium',
    nagad: 'bg-orange-50 text-orange-700 border border-orange-200 font-medium',
    cash: 'bg-teal-50 text-teal-700 border border-teal-200 font-medium'
  }[variant] || 'bg-slate-100 text-slate-700 border border-slate-200';

  return (
    <span className={`inline-flex items-center rounded-full ${sizeClasses} ${variantClasses}`}>
      {children}
    </span>
  );
};
