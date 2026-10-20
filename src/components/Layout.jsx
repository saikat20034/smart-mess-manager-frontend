import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useMess } from '../context/MessContext';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, ArrowRight } from 'lucide-react';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedMonth, isCurrentMonth, switchToCurrentMonth, formatMonthName } = useMess();
  const { t, isBn } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex w-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {!isCurrentMonth && (
            <div className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3 sm:px-4 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <span className="font-bold text-amber-900">
                    {isBn ? 'বিগত মাসের হিসাব সক্রিয়' : 'Past Month Active'}:
                  </span>{' '}
                  <span className="text-amber-800">
                    {formatMonthName(selectedMonth, isBn)} ({isBn ? 'পূর্ববর্তী মাস' : 'Past Record'})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={switchToCurrentMonth}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <span>{t('returnToCurrentMonth')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
