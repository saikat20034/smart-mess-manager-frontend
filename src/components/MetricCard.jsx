import React from 'react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'emerald'
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      hover: 'hover:border-emerald-300'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      hover: 'hover:border-indigo-300'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      hover: 'hover:border-amber-300'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      hover: 'hover:border-rose-300'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      hover: 'hover:border-blue-300'
    },
    slate: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      hover: 'hover:border-slate-300'
    }
  }[color] || {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    hover: 'hover:border-emerald-300'
  };

  return (
    <div className={`bg-white rounded-xl p-5 border ${colorMap.border} ${colorMap.hover} shadow-xs transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${colorMap.bg} ${colorMap.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <h4 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h4>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            {trend && <span className="font-semibold">{trend}</span>}
            <span>{subtitle}</span>
          </p>
        )}
      </div>
    </div>
  );
};
