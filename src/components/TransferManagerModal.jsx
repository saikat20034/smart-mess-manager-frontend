import React, { useState, useEffect } from 'react';
import { Crown, AlertTriangle, ArrowRight, ShieldCheck, UserCheck, Check } from 'lucide-react';
import { Modal } from './Modal';
import { Avatar } from './Avatar';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const TransferManagerModal = ({ isOpen, onClose, preselectedMemberId = null }) => {
  const { members, currentManager, transferManagerRole } = useMess();
  const { user, demoteToMember, loginAsMemberUser } = useAuth();
  const { isBn } = useLanguage();

  // Eligible members to receive manager role (active members who are not currently the manager)
  const eligibleMembers = (members || []).filter(
    (m) => m.status !== 'inactive' && m.role !== 'manager'
  );

  const [selectedMemberId, setSelectedMemberId] = useState(
    preselectedMemberId || eligibleMembers[0]?.id || ''
  );
  const [switchSessionToNewManager, setSwitchSessionToNewManager] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (preselectedMemberId) {
      setSelectedMemberId(preselectedMemberId);
    } else if (eligibleMembers.length > 0 && !eligibleMembers.some((m) => m.id === selectedMemberId)) {
      setSelectedMemberId(eligibleMembers[0]?.id || '');
    }
  }, [preselectedMemberId, members]);

  const targetMember = (members || []).find((m) => m.id === selectedMemberId);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selectedMemberId || !targetMember) return;

    setIsSubmitting(true);
    try {
      const result = await transferManagerRole(selectedMemberId, user?.name || currentManager?.name);

      if (switchSessionToNewManager) {
        // Switch logged in session to the new manager
        loginAsMemberUser({
          ...targetMember,
          role: 'manager'
        });
      } else {
        // Demote active user to member
        demoteToMember();
      }

      setSuccessMessage(
        isBn
          ? `সফলভাবে ${targetMember.name}-এর কাছে মেস ম্যানেজারের দায়িত্ব হস্তান্তর করা হয়েছে!`
          : `Manager role successfully transferred to ${targetMember.name}!`
      );

      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMessage('');
        onClose();
      }, 1400);
    } catch (err) {
      console.error('Failed to transfer manager role:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isBn ? 'মেস ম্যানেজার দায়িত্ব হস্তান্তর' : 'Transfer Mess Manager Leadership'}
    >
      <form onSubmit={handleTransfer} className="space-y-4">
        {/* Caution Banner */}
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              {isBn ? 'এক সময়ে কেবল একজনই ম্যানেজার থাকতে পারেন' : 'Single Manager Rule Strictly Enforced'}
            </p>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              {isBn
                ? 'নতুন কাউকে ম্যানেজার বানালে বর্তমান ম্যানেজারের ভূমিকা সাধারণ মেম্বার হিসেবে পরিবর্তিত হবে। মেসের সকল হিসাব, মিল ও সেটিংস সম্পাদনার ক্ষমতা শুধুমাত্র নতুন ম্যানেজারের থাকবে।'
                : 'Promoting a new member to manager will automatically step down the current manager to a regular member. Only the designated manager has permission to edit mess data and settings.'}
            </p>
          </div>
        </div>

        {/* Current Manager vs New Manager Visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          {/* Current Manager */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              {isBn ? 'বর্তমান ম্যানেজার' : 'Current Manager'}
            </span>
            <div className="flex items-center gap-2.5">
              <Avatar
                src={currentManager?.avatar}
                name={currentManager?.name || 'Saikat'}
                size="md"
                border={false}
                className="border border-amber-400 shadow-2xs"
              />
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {currentManager?.name || 'Saikat'}
                </h5>
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                  <Crown className="w-3 h-3 text-amber-500" />
                  <span>{isBn ? 'বিদায়ী ম্যানেজার' : 'Outgoing Leader'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* New Manager Target */}
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mb-1">
              {isBn ? 'নতুন দায়িত্বপ্রাপ্ত ম্যানেজার' : 'Incoming New Manager'}
            </span>
            <div className="flex items-center gap-2.5">
              <Avatar
                src={targetMember?.avatar}
                name={targetMember?.name || '?'}
                size="md"
                border={false}
                className="border border-emerald-500 shadow-2xs"
              />
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {targetMember?.name || (isBn ? 'মেম্বার বাছাই করুন' : 'Select member')}
                </h5>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>{isBn ? 'একক দায়িত্ব পাবেন' : 'Sole Full Authority'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Member Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {isBn ? 'নতুন ম্যানেজার নির্বাচন করুন *' : 'Select New Manager *'}
          </label>
          {eligibleMembers.length === 0 ? (
            <p className="text-xs text-rose-500 p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800">
              {isBn
                ? 'মেসে দায়িত্ব দেওয়ার মতো কোনো অতিরিক্ত সক্রিয় মেম্বার নেই। প্রথমে ইনভাইট কোড দিয়ে মেম্বার যুক্ত করুন।'
                : 'No other active members available in this mess. Invite roommates first.'}
            </p>
          ) : (
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none cursor-pointer"
            >
              {eligibleMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.phone ? `(${m.phone})` : ''} {m.room_number ? `- Room: ${m.room_number}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Session Switch Option */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={switchSessionToNewManager}
              onChange={(e) => setSwitchSessionToNewManager(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 accent-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
            <span>
              {isBn
                ? 'হস্তান্তরের সাথে সাথে ব্রাউজারে নতুন ম্যানেজার হিসেবে লগইন করুন'
                : 'Switch active session to the new manager immediately'}
            </span>
          </label>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            {isBn ? 'বাতিল করুন' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || eligibleMembers.length === 0}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>
              {isSubmitting
                ? (isBn ? 'হস্তান্তর হচ্ছে...' : 'Transferring...')
                : (isBn ? 'ম্যানেজার হিসেবে নিয়োগ দিন' : 'Transfer Leadership')}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
