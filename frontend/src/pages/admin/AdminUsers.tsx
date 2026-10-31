import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  CreditCard,
  Layers,
  ChevronRight,
  Filter,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { MembershipPlan } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Add user form
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: 'MemberPassword@123',
    gender: 'Male',
    date_of_birth: '',
  });

  // Assign plan form
  const [assignData, setAssignData] = useState({
    plan_id: '',
    start_date: new Date().toISOString().split('T')[0],
    discount_amount: 0,
    notes: '',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = `/admin/users?limit=50`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (statusFilter === 'active') query += `&is_active=true`;
      if (statusFilter === 'inactive') query += `&is_active=false`;

      const res = await api.get<{ items: any[] }>(query);
      setUsers(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const data = await api.get<MembershipPlan[]>('/admin/membership-plans');
      setPlans(data);
      if (data.length > 0 && !assignData.plan_id) {
        setAssignData((prev) => ({ ...prev, plan_id: data[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user: any) => {
    try {
      await api.patch(`/admin/users/${user.id}/status`, { is_active: !user.is_active });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: !u.is_active } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setActionError(null);
      await api.post('/admin/users', {
        ...newUser,
        date_of_birth: newUser.date_of_birth || null,
        role: 'customer',
        is_active: true,
      });
      setAddModalOpen(false);
      setNewUser({ full_name: '', email: '', phone: '', password: 'MemberPassword@123', gender: 'Male', date_of_birth: '' });
      fetchUsers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to create customer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !assignData.plan_id) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await api.post('/admin/memberships/assign', {
        user_id: selectedUser.id,
        plan_id: assignData.plan_id,
        start_date: assignData.start_date,
        discount_amount: Number(assignData.discount_amount),
        notes: assignData.notes,
      });
      setAssignModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to assign membership');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            CUSTOMER MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Directory of all registered gym members, active plans, and accounts.
          </p>
        </div>
        <button
          onClick={() => {
            setActionError(null);
            setAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime-sm hover:bg-gym-limeHover flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-gym-card border border-gym-border flex flex-col md:flex-row items-center gap-4 justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gym-surface border border-gym-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-gym-lime"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gym-surface hover:bg-gym-card text-white text-xs font-bold border border-gym-border"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gym-surface border border-gym-border text-white text-xs font-semibold focus:outline-none focus:border-gym-lime"
          >
            <option value="all">All Members</option>
            <option value="active">Active Only</option>
            <option value="inactive">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="rounded-2xl bg-gym-card border border-gym-border overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
            Loading customer records...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No customers match your search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gym-surface text-slate-400 font-bold uppercase border-b border-gym-border">
                <tr>
                  <th className="px-6 py-3.5 text-left">Member</th>
                  <th className="px-6 py-3.5 text-left">Contact</th>
                  <th className="px-6 py-3.5 text-left">Membership</th>
                  <th className="px-6 py-3.5 text-center">Month Check-ins</th>
                  <th className="px-6 py-3.5 text-right">Fee Status</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border/40 text-slate-300">
                {users.map((u) => {
                  const hasPlan = !!u.membership;
                  const isExpired = hasPlan && u.membership.remaining_days === 0;

                  return (
                    <tr key={u.id} className="hover:bg-gym-surface/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gym-surface text-gym-lime border border-gym-border flex items-center justify-center font-bold text-xs">
                            {u.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-white block text-sm">{u.full_name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Joined {formatDate(u.created_at)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-mono text-white">{u.phone}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </td>

                      <td className="px-6 py-4">
                        {hasPlan ? (
                          <div>
                            <span className="font-bold text-white block">{u.membership.plan_name}</span>
                            <span className={`text-[10px] font-semibold ${isExpired ? 'text-red-400' : 'text-gym-lime'}`}>
                              {isExpired ? 'Expired' : `${u.membership.remaining_days} days left`} (till {formatDate(u.membership.end_date)})
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No Active Plan</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 rounded bg-gym-surface text-white font-mono font-bold border border-gym-border">
                          {u.month_attendance} days
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {u.pending_due > 0 ? (
                          <div>
                            <span className="font-black text-gym-orange block">
                              {formatCurrency(u.pending_due)} Due
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Paid {formatCurrency(u.total_paid)}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-emerald-400 block">Cleared</span>
                            <span className="text-[10px] text-slate-400">
                              Paid {formatCurrency(u.total_paid)}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          title="Click to toggle active status"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                            u.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {u.is_active ? 'Active' : 'Deactivated'}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setActionError(null);
                            setAssignModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gym-surface hover:bg-gym-lime hover:text-black text-slate-200 border border-gym-border text-xs font-bold transition-all"
                        >
                          Assign Plan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Customer Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gym-surface border border-gym-border p-6 shadow-2xl">
            <h3 className="font-heading font-black text-xl text-white uppercase mb-4">
              Add New Gym Customer
            </h3>

            {actionError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-400 text-xs border border-red-500/30">
                {actionError}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="10-digit phone"
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Default Password *</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Gender</label>
                  <select
                    value={newUser.gender}
                    onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newUser.date_of_birth}
                    onChange={(e) => setNewUser({ ...newUser, date_of_birth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gym-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-gym-lime text-black font-extrabold uppercase shadow-glow-lime-sm"
                >
                  {actionLoading ? 'Creating...' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Membership Plan Modal */}
      {assignModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gym-surface border border-gym-border p-6 shadow-2xl">
            <h3 className="font-heading font-black text-xl text-white uppercase mb-1">
              Assign Plan to {selectedUser.full_name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{selectedUser.phone}</p>

            {actionError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-400 text-xs border border-red-500/30">
                {actionError}
              </div>
            )}

            <form onSubmit={handleAssignPlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Select Membership Plan *</label>
                <select
                  value={assignData.plan_id}
                  onChange={(e) => setAssignData({ ...assignData, plan_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatCurrency(p.price)} ({p.duration_months} mo / {p.duration_days} days)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={assignData.start_date}
                    onChange={(e) => setAssignData({ ...assignData, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={assignData.discount_amount}
                    onChange={(e) => setAssignData({ ...assignData, discount_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Notes / Remarks</label>
                <input
                  type="text"
                  value={assignData.notes}
                  onChange={(e) => setAssignData({ ...assignData, notes: e.target.value })}
                  placeholder="e.g. Student concession or renewal"
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gym-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-gym-lime text-black font-extrabold uppercase shadow-glow-lime-sm"
                >
                  {actionLoading ? 'Assigning...' : 'Assign & Activate Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
