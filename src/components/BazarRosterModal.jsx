import React, { useState } from 'react';
import { ShoppingCart, Calendar, UserCheck, Plus, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMess } from '../context/MessContext';
import { Modal } from './Modal';
import { Badge } from './Badge';

export const BazarRosterModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { members, bazarSchedule, addBazarScheduleEntry } = useMess();

  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mem = members.find((m) => m.id === selectedMemberId);
    if (!mem) return;

    await addBazarScheduleEntry({
      date,
      member_id: mem.id,
      member_name: mem.name
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="বাজারের তারিখ নির্ধারণ করুন (Bazar Duty Roster)">
      <div className="space-y-4">
        {/* Existing Roster */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-2">আসন্ন বাজার দায়িত্ব সূচি</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {bazarSchedule.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">{item.member_name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-500">{item.date}</span>
                  <Badge variant={item.status === 'Completed' ? 'primary' : 'warning'} size="sm">
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Duty Form */}
        <form onSubmit={handleSubmit} className="border-t border-slate-100 pt-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-900">নতুন দায়িত্ব যুক্ত করুন</h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">তারিখ</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">মেম্বার</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white focus:border-emerald-500 focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {success && (
            <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>বাজার ডেট সফলভাবে সেট হয়েছে!</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              বন্ধ করুন
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
            >
              নিশ্চিত করুন
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
