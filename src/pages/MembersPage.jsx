import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  Home,
  Shield,
  Edit2,
  UserX,
  CheckCircle,
  AlertCircle,
  Crown,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatBDT } from '../utils/calculations';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { TransferManagerModal } from '../components/TransferManagerModal';

export const MembersPage = () => {
  const { isManager } = useAuth();
  const { memberBalances, addMember, updateMember, deactivateMember } = useMess();
  const { isBn } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Transfer Manager Modal state
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferTargetId, setTransferTargetId] = useState(null);

  // Deactivate confirm state
  const [confirmDeactivateOpen, setConfirmDeactivateOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    room_number: '',
    role: 'member'
  });

  // Filtered members
  const filteredMembers = memberBalances.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.roomNumber && m.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.phone && m.phone.includes(searchTerm));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? m.status === 'active'
        : m.status === 'inactive';

    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    // All new members added to existing mess are members (single manager rule)
    await addMember({ ...formData, role: 'member' });
    setAddModalOpen(false);
    setFormData({ name: '', phone: '', email: '', room_number: '', role: 'member' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember || !formData.name) return;

    // Keep the existing role during general edit; role transfer is done via TransferManagerModal
    await updateMember(selectedMember.memberId, {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      room_number: formData.room_number
    });
    setEditModalOpen(false);
    setSelectedMember(null);
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      phone: member.phone || '',
      email: member.email || '',
      room_number: member.roomNumber || '',
      role: member.role || 'member'
    });
    setEditModalOpen(true);
  };

  const openTransferModal = (targetMemberId) => {
    setTransferTargetId(targetMemberId);
    setTransferModalOpen(true);
  };

  const openDeactivateModal = (member) => {
    setDeactivateTarget(member);
    setConfirmDeactivateOpen(true);
  };

  const handleDeactivate = async () => {
    if (deactivateTarget) {
      await deactivateMember(deactivateTarget.memberId);
      setDeactivateTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isBn ? 'মেস সদস্য ও প্রশাসন ব্যবস্থাপনা' : 'Mess Members & Administration'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBn
              ? 'মেম্বার তালিকা, রুম নম্বর, একক ম্যানেজার নির্ধারণ এবং ব্যক্তিগত ব্যালেন্স পরিচালনা করুন।'
              : 'Manage student profiles, room allocations, sole manager designation, and meal balances.'}
          </p>
        </div>

        {isManager && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openTransferModal(null)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              title={isBn ? 'অন্য কাউকে ম্যানেজার বানান' : 'Transfer Manager Leadership'}
            >
              <Crown className="w-4 h-4" />
              <span>{isBn ? 'ম্যানেজার পরিবর্তন' : 'Transfer Leadership'}</span>
            </button>

            <button
              onClick={() => {
                setFormData({ name: '', phone: '', email: '', room_number: '', role: 'member' });
                setAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isBn ? 'নতুন মেম্বার যুক্ত করুন' : 'Add New Member'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Non-Manager Notice Banner */}
      {!isManager && (
        <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <span className="font-bold block text-slate-900 dark:text-white">
              {isBn ? 'একক ম্যানেজার নীতি সক্রিয়' : 'Single Manager Rule Active'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isBn
                ? 'মেসের সকল তথ্য, হিসাব এবং মেম্বার পরিচালনার একক ক্ষমতা শুধুমাত্র বর্তমান ম্যানেজারের হাতে। সদস্যরা স্বচ্ছতার সাথে হিসাব পর্যবেক্ষণ করতে পারবেন।'
                : 'All editing rights belong exclusively to the active mess manager. Residents have full real-time transparency.'}
            </span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isBn ? 'নাম, রুম অথবা ফোন দিয়ে খুঁজুন...' : 'Search by name, room, or phone...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none cursor-pointer"
          >
            <option value="all">{isBn ? 'সকল সদস্য' : 'All Members'}</option>
            <option value="active">{isBn ? 'সক্রিয় সদস্যবৃন্দ' : 'Active Residents Only'}</option>
            <option value="inactive">{isBn ? 'নিষ্ক্রিয় / সাবেক' : 'Inactive / Archived'}</option>
          </select>
        </div>
      </div>

      {/* Members Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const isCurrentLead = member.role === 'manager';

          return (
            <div
              key={member.memberId}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md relative ${
                isCurrentLead
                  ? 'border-amber-400 dark:border-amber-600/80 ring-1 ring-amber-400/30'
                  : member.status === 'inactive'
                  ? 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50 dark:bg-slate-950/40'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className={`w-10 h-10 rounded-full object-cover shadow-2xs shrink-0 ${
                        isCurrentLead
                          ? 'border-2 border-amber-500 ring-2 ring-amber-400/20'
                          : 'border border-slate-200 dark:border-slate-700'
                      }`}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                      <span>{member.name}</span>
                      {isCurrentLead && (
                        <Crown className="w-4 h-4 text-amber-500 shrink-0" title="মেস ম্যানেজার (একক দায়িত্বপ্রাপ্ত)" />
                      )}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{member.roomNumber ? `Room: ${member.roomNumber}` : 'রুম নম্বর নাই'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {isCurrentLead ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-2xs">
                      <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>{isBn ? 'মেস ম্যানেজার' : 'Manager'}</span>
                    </span>
                  ) : (
                    <Badge variant="member" size="sm">
                      {isBn ? 'মেম্বার' : 'Member'}
                    </Badge>
                  )}
                  {member.status === 'inactive' && (
                    <Badge variant="inactive" size="sm">
                      {isBn ? 'নিষ্ক্রিয়' : 'Inactive'}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{isBn ? 'ফোন / বিকাশ:' : 'Phone:'}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{member.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{isBn ? 'চলতি মাসে মিল:' : 'Meals this month:'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono">
                    {member.mealUnits.toFixed(2)} units
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{isBn ? 'মোট জমা:' : 'Deposits:'}</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">{formatBDT(member.totalDeposits)}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 dark:text-slate-500">{isBn ? 'বর্তমান ব্যালেন্স:' : 'Net Balance:'}</span>
                  <span
                    className={`font-mono font-bold ${
                      member.netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {formatBDT(member.netBalance)} ({member.netBalance >= 0 ? (isBn ? 'পায়' : 'Credit') : (isBn ? 'দিতে' : 'Due')})
                  </span>
                </div>
              </div>

              {/* Actions for Manager */}
              {isManager && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    {!isCurrentLead && member.status === 'active' && (
                      <button
                        onClick={() => openTransferModal(member.memberId || member.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-[11px] font-bold cursor-pointer transition-colors"
                        title={isBn ? 'এই মেম্বারকে মেস ম্যানেজার হিসেবে নিযুক্ত করুন' : 'Make this member the Mess Manager'}
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isBn ? 'ম্যানেজার বানান' : 'Make Manager'}</span>
                      </button>
                    )}
                    {isCurrentLead && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                        ★ {isBn ? 'একক প্রশাসনিক ক্ষমতাপ্রাপ্ত' : 'Sole Mess Administrator'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title={isBn ? 'মেম্বার তথ্য সম্পাদনা' : 'Edit member details'}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!isCurrentLead && member.status === 'active' && (
                      <button
                        onClick={() => openDeactivateModal(member)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title={isBn ? 'মেম্বার নিষ্ক্রিয় করুন' : 'Deactivate member'}
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Member Modal (Always adds as 'member' to preserve single manager rule) */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={isBn ? 'নতুন মেম্বার যুক্ত করুন' : 'Add New Mess Member'}
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'পূর্ণ নাম *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              placeholder={isBn ? 'যেমন: মাহফুজুর রহমান' : 'e.g. Mahfuzur Rahman'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'ফোন / বিকাশ' : 'Phone / bKash'}
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'রুম নম্বর' : 'Room Number'}
              </label>
              <input
                type="text"
                placeholder="e.g. 402-C"
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'ইমেইল এড্রেস' : 'Email Address'}
            </label>
            <input
              type="email"
              placeholder="student@univ.edu.bd"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold block text-slate-800 dark:text-slate-200">
              {isBn ? 'ভূমিকা (Role): সাধারণ মেম্বার' : 'Role: Mess Resident (Member)'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {isBn
                ? 'একক ম্যানেজার নীতি অনুযায়ী নতুন সদস্য সাধারণ মেম্বার হিসেবে যুক্ত হবেন। প্রয়োজন হলে পরবর্তীতে তাকে ম্যানেজার বানানো যাবে।'
                : 'All new entrants join as members. Management leadership can be transferred at any time.'}
            </span>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
            >
              {isBn ? 'মেম্বার সংরক্ষণ করুন' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={isBn ? 'মেম্বার তথ্য সংশোধন' : 'Edit Member Details'}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'পূর্ণ নাম *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'ফোন / বিকাশ' : 'Phone / bKash'}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'রুম নম্বর' : 'Room Number'}
              </label>
              <input
                type="text"
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'ইমেইল এড্রেস' : 'Email Address'}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {isBn ? 'বর্তমান ভূমিকা:' : 'Current Role:'}{' '}
                <strong className={selectedMember?.role === 'manager' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}>
                  {selectedMember?.role === 'manager' ? (isBn ? 'মেস ম্যানেজার (একক)' : 'Sole Manager') : (isBn ? 'সাধারণ মেম্বার' : 'Member')}
                </strong>
              </span>
              <span className="text-[11px] text-slate-400">
                {isBn ? 'ম্যানেজার পরিবর্তন করতে ডেডিকেটেড বাটন ব্যবহার করুন।' : 'Use Transfer Manager to appoint new leader.'}
              </span>
            </div>
            {selectedMember?.role !== 'manager' && (
              <button
                type="button"
                onClick={() => {
                  setEditModalOpen(false);
                  openTransferModal(selectedMember?.memberId);
                }}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{isBn ? 'ম্যানেজার বানান' : 'Make Manager'}</span>
              </button>
            )}
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
            >
              {isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Transfer Manager Modal */}
      <TransferManagerModal
        isOpen={transferModalOpen}
        onClose={() => {
          setTransferModalOpen(false);
          setTransferTargetId(null);
        }}
        preselectedMemberId={transferTargetId}
      />

      {/* Confirm Deactivation Dialog */}
      <ConfirmDialog
        isOpen={confirmDeactivateOpen}
        onClose={() => setConfirmDeactivateOpen(false)}
        onConfirm={handleDeactivate}
        title={isBn ? 'সদস্য নিষ্ক্রিয় করবেন?' : 'Deactivate Mess Member?'}
        message={
          isBn
            ? `আপনি কি নিশ্চিতভাবে ${deactivateTarget?.name}-কে নিষ্ক্রিয় করতে চান? তার পূর্ববর্তী মিল, খরচ ও জমার হিসাব অডিটের জন্য নিরাপদে সংরক্ষিত থাকবে।`
            : `Are you sure you want to deactivate ${deactivateTarget?.name}? Their previous records will be safely preserved for audits.`
        }
        confirmText={isBn ? 'নিষ্ক্রিয় করুন' : 'Deactivate Member'}
        isDestructive={true}
      />
    </div>
  );
};
