import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export const ThemeToggle = ({
  showLabel = false,
  className = '',
  size = 'md' // 'sm' | 'md' | 'lg'
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { isBn } = useLanguage();

  const label = isDark
    ? (isBn ? 'দিন মোড' : 'Day Mode')
    : (isBn ? 'রাত মোড' : 'Night Mode');

  const tooltip = isDark
    ? (isBn ? 'দিন মোডে পরিবর্তন করুন' : 'Switch to Day Mode')
    : (isBn ? 'রাত মোডে পরিবর্তন করুন' : 'Switch to Night Mode');

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={tooltip}
      aria-label={tooltip}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer select-none text-xs font-semibold ${
        isDark
          ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700/80 hover:text-amber-200 shadow-2xs'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 shadow-2xs'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun className={`${iconSizes[size]} text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45`} />
        ) : (
          <Moon className={`${iconSizes[size]} text-indigo-500 transition-transform duration-300 -rotate-12 hover:rotate-0`} />
        )}
      </div>

      {showLabel && (
        <span className="text-[11px] font-semibold whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
};
