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
  AlertCircle
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { formatBDT } from '../utils/calculations';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const MembersPage = () => {
  const { isManager } = useAuth();
  const { memberBalances, addMember, updateMember, deactivateMember } = useMess();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

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

    await addMember(formData);
    setAddModalOpen(false);
    setFormData({ name: '', phone: '', email: '', room_number: '', role: 'member' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember || !formData.name) return;

    await updateMember(selectedMember.memberId, formData);
    setEditModalOpen(false);
    setSelectedMember(null);
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      phone: member.phone,
      email: member.email,
      room_number: member.roomNumber,
      role: member.role
    });
    setEditModalOpen(true);
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
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Mess Members Management
          </h1>
          <p className="text-xs text-slate-500">
            Manage student profiles, room allocations, roles, and view individual meal balances.
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => {
              setFormData({ name: '', phone: '', email: '', room_number: '', role: 'member' });
              setAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Member</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, room, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:border-emerald-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Members</option>
            <option value="active">Active Residents Only</option>
            <option value="inactive">Inactive / Archived</option>
          </select>
        </div>
      </div>

      {/* Members Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.memberId}
            className={`bg-white rounded-xl border p-5 shadow-xs transition-all hover:shadow-md ${
              member.status === 'inactive'
                ? 'border-slate-200 opacity-60 bg-slate-50'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {member.name}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Room: {member.roomNumber || 'Not assigned'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Badge variant={member.role === 'manager' ? 'manager' : 'member'} size="sm">
                  {member.role === 'manager' ? 'Manager' : 'Member'}
                </Badge>
                {member.status === 'inactive' && (
                  <Badge variant="inactive" size="sm">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-medium text-slate-700">{member.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Meals this month:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {member.mealUnits.toFixed(1)} units
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Deposits:</span>
                <span className="font-mono text-slate-700">{formatBDT(member.totalDeposits)}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Current Net Balance:</span>
                <span
                  className={`font-mono font-bold ${
                    member.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {formatBDT(member.netBalance)} ({member.netBalance >= 0 ? 'Credit' : 'Due'})
                </span>
              </div>
            </div>

            {/* Actions for Manager */}
            {isManager && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(member)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="Edit member details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {member.status === 'active' && (
                  <button
                    onClick={() => openDeactivateModal(member)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                    title="Deactivate member (Preserves financial history)"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Mess Member">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mahfuzur Rahman"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone / bKash</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Room Number</label>
              <input
                type="text"
                placeholder="e.g. 402-C"
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="student@univ.edu.bd"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="member">Mess Member</option>
              <option value="manager">Mess Manager</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
            >
              Add Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Member Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Member Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone / bKash</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Room Number</label>
              <input
                type="text"
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="member">Mess Member</option>
              <option value="manager">Mess Manager</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deactivation Dialog */}
      <ConfirmDialog
        isOpen={confirmDeactivateOpen}
        onClose={() => setConfirmDeactivateOpen(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Mess Member?"
        message={`Are you sure you want to deactivate ${deactivateTarget?.name}? Their previous meal records, expenses, and deposit ledger will be preserved safely for monthly audits.`}
        confirmText="Deactivate Member"
        isDestructive={true}
      />
    </div>
  );
};
