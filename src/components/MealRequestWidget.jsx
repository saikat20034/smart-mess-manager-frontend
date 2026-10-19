import React, { useState, useEffect } from 'react';
import {
  Clock,
  Eye,
  Edit2,
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Plus,
  Minus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';

export const MealRequestWidget = () => {
  const { t, isBn } = useLanguage();
  const { user } = useAuth();
  const { mealRequests, saveMealRequest, recordDailyMealsBulk } = useMess();

  const [autoRequest, setAutoRequest] = useState(mealRequests.auto || false);
  const [morning, setMorning] = useState(mealRequests.morning || 0);
  const [lunch, setLunch] = useState(mealRequests.lunch || 0);
  const [dinner, setDinner] = useState(mealRequests.dinner || 0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setAutoRequest(mealRequests.auto || false);
    setMorning(mealRequests.morning || 0);
    setLunch(mealRequests.lunch || 0);
    setDinner(mealRequests.dinner || 0);
  }, [mealRequests]);

  const totalUnits = (morning * 0.5) + lunch + dinner;

  const handleSave = async () => {
    await saveMealRequest({
      auto: autoRequest,
      morning,
      lunch,
      dinner
    });

    // Also automatically log to today's meals for this user
    if (user?.id) {
      const todayStr = new Date().toISOString().split('T')[0];
      await recordDailyMealsBulk(todayStr, [
        {
          member_id: user.id,
          breakfast: morning,
          lunch: lunch,
          dinner: dinner,
          notes: 'User Meal Request'
        }
      ]);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <h3 className="text-sm font-bold text-rose-500">
          {t('mealRequestTitle')}
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRequest(!autoRequest)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 cursor-pointer"
          >
            {autoRequest ? (
              <ToggleRight className="w-4 h-4 text-emerald-600" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-slate-400" />
            )}
            <span>{autoRequest ? t('autoRequestOn') : t('autoRequestOff')}</span>
          </button>

          <button
            onClick={handleSave}
            title="সেভ করুন"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('requestSaved')}</span>
        </div>
      )}

      {/* 3 Meal Inputs (সকাল, দুপুর, রাত) */}
      <div className="grid grid-cols-3 gap-3">
        {/* Morning / সকাল */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-center">
          <span className="text-[10px] text-slate-400 font-medium block">
            {t('morning')} (0.5)
          </span>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <button
              onClick={() => setMorning(Math.max(0, morning - 0.5))}
              className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              -
            </button>
            <span className="text-sm font-bold font-mono text-slate-800">
              {morning.toFixed(1)}
            </span>
            <button
              onClick={() => setMorning(morning + 0.5)}
              className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Lunch / দুপুর */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-center">
          <span className="text-[10px] text-slate-400 font-medium block">
            {t('lunch')} (1.0)
          </span>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <button
              onClick={() => setLunch(Math.max(0, lunch - 1))}
              className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              -
            </button>
            <span className="text-sm font-bold font-mono text-slate-800">
              {lunch.toFixed(1)}
            </span>
            <button
              onClick={() => setLunch(lunch + 1)}
              className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Dinner / রাত */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-center">
          <span className="text-[10px] text-slate-400 font-medium block">
            {t('dinner')} (1.0)
          </span>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <button
              onClick={() => setDinner(Math.max(0, dinner - 1))}
              className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              -
            </button>
            <span className="text-sm font-bold font-mono text-slate-800">
              {dinner.toFixed(1)}
            </span>
            <button
              onClick={() => setDinner(dinner + 1)}
              className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Footer Deadline Notice & Total */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-rose-500 font-medium text-[11px]">
          <Clock className="w-3.5 h-3.5" />
          <span>{t('requestDeadline')} <strong>08:30 AM</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium text-[11px]">
            {t('total')} <strong className="text-slate-900 font-mono text-xs">{totalUnits.toFixed(2)}</strong>
          </span>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            জমা দিন
          </button>
        </div>
      </div>
    </div>
  );
};
