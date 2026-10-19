import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Trash2,
  Edit3,
  FileText,
  Info,
  CheckCircle,
  Smartphone
} from 'lucide-react';
import { useMess } from '../context/MessContext';
import { useAuth } from '../context/AuthContext';
import { formatBDT } from '../utils/calculations';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const DepositsPage = () => {
  const { isManager } = useAuth();
  const {
    deposits,
    members,
    selectedMonth,
    addDeposit,
    updateDeposit,
    deleteDeposit
  } = useMess();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  // Delete confirm
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form state
  const [form, setForm] = useState({
    member_id: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'bKash',
    transaction_ref: '',
    notes: ''
  });

  const totalDepositsMonth = React.useMemo(() => {
    return deposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [deposits]);

  const filteredDeposits = deposits.filter((d) => {
    const matchesSearch =
      (d.member_name && d.member_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.transaction_ref && d.transaction_ref.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.notes && d.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMethod =
      methodFilter === 'all' || d.payment_method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!form.member_id || !form.amount) return;

    const member = members.find((m) => m.id === form.member_id);

    await addDeposit({
      ...form,
      amount: Number(form.amount),
      member_name: member?.name || 'Member'
    });

    setAddModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDeposit || !form.member_id || !form.amount) return;

    const member = members.find((m) => m.id === form.member_id);

    await updateDeposit(selectedDeposit.id, {
      ...form,
      amount: Number(form.amount),
      member_name: member?.name || selectedDeposit.member_name
    });

    setEditModalOpen(false);
    setSelectedDeposit(null);
  };

  const openEditModal = (deposit) => {
    setSelectedDeposit(deposit);
    setForm({
      member_id: deposit.member_id,
      amount: deposit.amount,
      date: deposit.date,
      payment_method: deposit.payment_method || 'bKash',
      transaction_ref: deposit.transaction_ref || '',
      notes: deposit.notes || ''
    });
    setEditModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      member_id: members[0]?.id || '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      payment_method: 'bKash',
      transaction_ref: '',
      notes: ''
    });
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteDeposit(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const getMethodBadgeVariant = (method) => {
    switch (method?.toLowerCase()) {
      case 'bkash':
        return 'bkash';
      case 'nagad':
        return 'nagad';
      case 'cash':
        return 'cash';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Member Deposits & Payments
          </h1>
          <p className="text-xs text-slate-500">
            Record advances and contributions collected via bKash, Nagad, Cash, and Bank.
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => {
              resetForm();
              setAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Deposit</span>
          </button>
        )}
      </div>

      {/* Notice & KPI Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-xs md:col-span-1">
          <span className="text-xs font-medium text-slate-500">Total Deposits Collected</span>
          <h4 className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
            {formatBDT(totalDepositsMonth)}
          </h4>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {deposits.length} deposits for {selectedMonth}
          </span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 md:col-span-2 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">Financial Transparency Notice:</span>
            Deposits are recorded manually by the mess manager for monthly accounting. They are not direct bank integrations. Always keep payment SMS or TrxID receipts for reference.
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by member name, TrxID, or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:border-emerald-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Payment Methods</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
          </select>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-100">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Payment Method</th>
                <th className="py-3 px-3">TrxID / Reference</th>
                <th className="py-3 px-3">Notes</th>
                <th className="py-3 px-4 text-right">Amount (BDT)</th>
                {isManager && <th className="py-3 px-4 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDeposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {deposit.member_name}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">
                    {deposit.date}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={getMethodBadgeVariant(deposit.payment_method)} size="sm">
                      {deposit.payment_method}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {deposit.transaction_ref || '-'}
                  </td>
                  <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                    {deposit.notes || '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    +{formatBDT(deposit.amount)}
                  </td>
                  {isManager && (
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(deposit)}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget(deposit);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredDeposits.length === 0 && (
                <tr>
                  <td colSpan={isManager ? 7 : 6} className="py-8 text-center text-slate-400 text-xs">
                    No deposits recorded for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Deposit Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Record Member Deposit">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Select Member *</label>
            <select
              required
              value={form.member_id}
              onChange={(e) => setForm({ ...form, member_id: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">-- Choose Member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.room_number ? `Room ${m.room_number}` : 'No room'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Deposit Amount (BDT ৳) *</label>
              <input
                type="number"
                required
                min="1"
                step="any"
                placeholder="e.g. 3000"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Payment Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
              <select
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Cash">Cash (Hand to hand)</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Transaction Ref / TrxID</label>
              <input
                type="text"
                placeholder="e.g. BKASH8X9102"
                value={form.transaction_ref}
                onChange={(e) => setForm({ ...form, transaction_ref: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
            <input
              type="text"
              placeholder="e.g. advance for October meals"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
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
              Save Deposit
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Deposit Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Deposit Record">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Deposit Amount (BDT ৳) *</label>
            <input
              type="number"
              required
              min="1"
              step="any"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
              <select
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Transaction Ref / TrxID</label>
            <input
              type="text"
              value={form.transaction_ref}
              onChange={(e) => setForm({ ...form, transaction_ref: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:border-emerald-500 focus:outline-none"
            />
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
              Update Deposit
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Deposit Record?"
        message={`Are you sure you want to delete the deposit of ৳ ${deleteTarget?.amount} from ${deleteTarget?.member_name}? This will affect their net balance immediately.`}
        confirmText="Delete Deposit"
        isDestructive={true}
      />
    </div>
  );
};
