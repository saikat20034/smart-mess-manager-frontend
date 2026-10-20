import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Calendar,
  Save,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  ShieldAlert,
  Lock,
  Plus,
  Minus
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { calculateMealUnits } from '../utils/calculations';

/**
 * Plus / Minus Stepper Component for Meals with 0.25 increment/decrement
 */
const MealUnitStepper = ({ value, onChange, disabled }) => {
  const currentVal = Number(value) || 0;

  const handleMinus = () => {
    if (disabled || currentVal <= 0) return;
    const next = Math.max(0, Math.round((currentVal - 0.25) * 100) / 100);
    onChange(next);
  };

  const handlePlus = () => {
    if (disabled) return;
    const next = Math.round((currentVal + 0.25) * 100) / 100;
    onChange(next);
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(0);
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(Math.round(parsed * 100) / 100);
    }
  };

  const displayVal = Number(currentVal.toFixed(2));

  return (
    <div className="inline-flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 shadow-2xs">
      <button
        type="button"
        disabled={disabled || currentVal <= 0}
        onClick={handleMinus}
        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-700 disabled:hover:text-slate-400 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center border border-slate-200/80 dark:border-slate-600 shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed select-none"
        title="0.25 কমান (-0.25)"
      >
        <Minus className="w-3 h-3 stroke-[2.5]" />
      </button>

      <input
        type="number"
        step="0.25"
        min="0"
        disabled={disabled}
        value={displayVal}
        onChange={handleInputChange}
        className="w-12 text-center font-mono font-bold text-xs text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none disabled:text-slate-500 py-1"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={handlePlus}
        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-700 disabled:hover:text-slate-400 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center border border-slate-200/80 dark:border-slate-600 shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed select-none"
        title="0.25 বাড়ান (+0.25)"
      >
        <Plus className="w-3 h-3 stroke-[2.5]" />
      </button>
    </div>
  );
};

export const MealsPage = () => {
  const { isManager } = useAuth();
  const {
    members,
    meals,
    selectedMonth,
    mess,
    recordDailyMealsBulk
  } = useMess();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [matrixEntries, setMatrixEntries] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active members only
  const activeMembers = members.filter((m) => m.status === 'active' || !m.status);

  // Load existing entries for selected date or initialize defaults
  useEffect(() => {
    const existingForDate = meals.filter((m) => m.date === selectedDate);
    const initialMap = {};

    activeMembers.forEach((member) => {
      const found = existingForDate.find((m) => m.member_id === member.id);
      if (found) {
        initialMap[member.id] = {
          breakfast: Number(found.breakfast) || 0,
          lunch: Number(found.lunch) || 0,
          dinner: Number(found.dinner) || 0,
          notes: found.notes || ''
        };
      } else {
        // default: breakfast: 1, lunch: 1, dinner: 1
        initialMap[member.id] = {
          breakfast: 1,
          lunch: 1,
          dinner: 1,
          notes: ''
        };
      }
    });

    setMatrixEntries(initialMap);
  }, [selectedDate, meals, activeMembers.length]);

  const handleUnitChange = (memberId, mealType, val) => {
    const num = Number(val);
    setMatrixEntries((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [mealType]: isNaN(num) ? 0 : Math.max(0, Math.round(num * 100) / 100)
      }
    }));
  };

  // Quick preset actions
  const applyPresetToAll = (b, l, d) => {
    const updated = {};
    activeMembers.forEach((member) => {
      updated[member.id] = {
        breakfast: b,
        lunch: l,
        dinner: d,
        notes: matrixEntries[member.id]?.notes || ''
      };
    });
    setMatrixEntries(updated);
  };

  const handleSaveBulk = async () => {
    setIsSubmitting(true);
    const entriesArray = activeMembers.map((member) => ({
      member_id: member.id,
      breakfast: matrixEntries[member.id]?.breakfast || 0,
      lunch: matrixEntries[member.id]?.lunch || 0,
      dinner: matrixEntries[member.id]?.dinner || 0,
      notes: matrixEntries[member.id]?.notes || ''
    }));

    await recordDailyMealsBulk(selectedDate, entriesArray);
    setIsSubmitting(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Compute daily totals for the matrix
  const daySummary = React.useMemo(() => {
    let bTotal = 0;
    let lTotal = 0;
    let dTotal = 0;
    let unitTotal = 0;

    activeMembers.forEach((m) => {
      const entry = matrixEntries[m.id] || { breakfast: 0, lunch: 0, dinner: 0 };
      bTotal += entry.breakfast;
      lTotal += entry.lunch;
      dTotal += entry.dinner;
      unitTotal += calculateMealUnits(entry, mess || {});
    });

    return {
      bTotal: Number(bTotal.toFixed(2)),
      lTotal: Number(lTotal.toFixed(2)),
      dTotal: Number(dTotal.toFixed(2)),
      unitTotal: Number(unitTotal.toFixed(2))
    };
  }, [matrixEntries, activeMembers, mess]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Daily Meal Tracking & Bulk Matrix
          </h1>
          <p className="text-xs text-slate-500">
            Record and update Breakfast (0.5), Lunch (1.0), and Dinner (1.0) for mess members.
          </p>
        </div>

        {/* Date Selector & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          {isManager && (
            <button
              onClick={handleSaveBulk}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save All Meals'}</span>
            </button>
          )}
        </div>
      </div>

      {!isManager && (
        <div className="p-4 bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">শুধুমাত্র মেস ম্যানেজার মিল যুক্ত করতে পারেন</p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                সদস্য হিসেবে আপনি এখানে মেসের দৈনিক মিল তালিকা দেখতে পারবেন। নিজের মিলের জন্য ড্যাশবোর্ড থেকে মিল রিকুয়েস্ট দিন।
              </p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>মিল রিকুয়েস্ট দিন</span>
          </Link>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">
            Meals for {selectedDate} have been saved successfully and balances updated!
          </span>
        </div>
      )}

      {/* Preset Buttons for Quick Multi-Member Entry */}
      {isManager && (
        <div className="bg-slate-100/80 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Quick Fill for All:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPresetToAll(1, 1, 1)}
              className="px-2.5 py-1 text-xs bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
            >
              All Full Day (1 - 1 - 1)
            </button>
            <button
              type="button"
              onClick={() => applyPresetToAll(0, 1, 1)}
              className="px-2.5 py-1 text-xs bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
            >
              Lunch & Dinner Only (0 - 1 - 1)
            </button>
            <button
              type="button"
              onClick={() => applyPresetToAll(0, 0, 1)}
              className="px-2.5 py-1 text-xs bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
            >
              Dinner Only (0 - 0 - 1)
            </button>
            <button
              type="button"
              onClick={() => applyPresetToAll(0, 0, 0)}
              className="px-2.5 py-1 text-xs bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
            >
              Clear All (0 - 0 - 0)
            </button>
          </div>
        </div>
      )}

      {/* Bulk Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Meal Roster for {selectedDate}
            </h3>
            <p className="text-[11px] text-slate-500">
              Weights: Breakfast = {Number(mess?.breakfast_unit ?? 1.0)} unit, Lunch = {Number(mess?.lunch_unit ?? 1.0)} unit, Dinner = {Number(mess?.dinner_unit ?? 1.0)} unit
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700">
              Total Day Units: <strong className="text-emerald-700 font-mono text-sm">{daySummary.unitTotal.toFixed(2)}</strong>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-100">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-3 text-center">Room</th>
                <th className="py-3 px-3 text-center">Breakfast</th>
                <th className="py-3 px-3 text-center">Lunch</th>
                <th className="py-3 px-3 text-center">Dinner</th>
                <th className="py-3 px-4 text-center">Total Units</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {activeMembers.map((member) => {
                const entry = matrixEntries[member.id] || { breakfast: 0, lunch: 0, dinner: 0, notes: '' };
                const units = calculateMealUnits(entry, mess || {});

                return (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {member.name}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500 font-mono">
                      {member.room_number || '-'}
                    </td>

                    {/* Breakfast Stepper */}
                    <td className="py-3 px-3 text-center">
                      <MealUnitStepper
                        disabled={!isManager}
                        value={entry.breakfast}
                        onChange={(val) => handleUnitChange(member.id, 'breakfast', val)}
                      />
                    </td>

                    {/* Lunch Stepper */}
                    <td className="py-3 px-3 text-center">
                      <MealUnitStepper
                        disabled={!isManager}
                        value={entry.lunch}
                        onChange={(val) => handleUnitChange(member.id, 'lunch', val)}
                      />
                    </td>

                    {/* Dinner Stepper */}
                    <td className="py-3 px-3 text-center">
                      <MealUnitStepper
                        disabled={!isManager}
                        value={entry.dinner}
                        onChange={(val) => handleUnitChange(member.id, 'dinner', val)}
                      />
                    </td>

                    {/* Total units for this member today */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">
                      {units.toFixed(2)}
                    </td>

                    {/* Notes input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        disabled={!isManager}
                        placeholder="Guest / note..."
                        value={entry.notes || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMatrixEntries((prev) => ({
                            ...prev,
                            [member.id]: {
                              ...prev[member.id],
                              notes: val
                            }
                          }));
                        }}
                        className="w-full text-[11px] border border-slate-200 rounded-md p-1 px-2 focus:border-emerald-500 focus:outline-none disabled:bg-slate-50"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/80 font-bold text-xs text-slate-800 border-t border-slate-200">
                <td colSpan="2" className="py-3 px-4">
                  Day Total:
                </td>
                <td className="py-3 px-3 text-center font-mono">{daySummary.bTotal}</td>
                <td className="py-3 px-3 text-center font-mono">{daySummary.lTotal}</td>
                <td className="py-3 px-3 text-center font-mono">{daySummary.dTotal}</td>
                <td className="py-3 px-4 text-center font-mono text-emerald-700 text-sm">
                  {daySummary.unitTotal.toFixed(2)} units
                </td>
                <td className="py-3 px-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
