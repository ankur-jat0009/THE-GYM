import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  FileText,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Payment, PendingFeeItem } from '../../types';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ReceiptModal } from '../../components/common/ReceiptModal';

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pendingFees, setPendingFees] = useState<PendingFeeItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ledger' | 'pending'>('ledger');
  const [loading, setLoading] = useState(true);

  // Filters
  const [methodFilter, setMethodFilter] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);

  // Active memberships for payment recording
  const [activeMemberships, setActiveMemberships] = useState<any[]>([]);

  const [paymentForm, setPaymentForm] = useState({
    membership_id: '',
    amount: 1000,
    payment_method: 'UPI',
    transaction_reference: '',
    remarks: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let query = `/admin/payments?limit=50`;
      if (methodFilter) query += `&payment_method=${methodFilter}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      const res = await api.get<{ items: Payment[] }>(query);
      setPayments(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingFees = async () => {
    try {
      const data = await api.get<PendingFeeItem[]>('/admin/payments/pending');
      setPendingFees(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActiveMemberships = async () => {
    try {
      const res = await api.get<{ items: any[] }>('/admin/users?limit=100');
      const list: any[] = [];
      res.items.forEach((u) => {
        if (u.membership && u.membership.id) {
          list.push({
            membership_id: u.membership.id,
            user_name: u.full_name,
            phone: u.phone,
            plan_name: u.membership.plan_name,
            pending_due: u.pending_due,
          });
        }
      });
      setActiveMemberships(list);
      if (list.length > 0 && !paymentForm.membership_id) {
        setPaymentForm((prev) => ({ ...prev, membership_id: list[0].membership_id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchPendingFees();
    fetchActiveMemberships();
  }, [methodFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.membership_id || paymentForm.amount <= 0) return;
    try {
      setSaving(true);
      setError(null);
      await api.post('/admin/payments', {
        membership_id: paymentForm.membership_id,
        amount: Number(paymentForm.amount),
        payment_method: paymentForm.payment_method,
        transaction_reference: paymentForm.transaction_reference || null,
        remarks: paymentForm.remarks || null,
      });
      setRecordModalOpen(false);
      setPaymentForm({ membership_id: '', amount: 1000, payment_method: 'UPI', transaction_reference: '', remarks: '' });
      fetchPayments();
      fetchPendingFees();
    } catch (err: any) {
      setError(err.message || 'Failed to record payment');
    } finally {
      setSaving(false);
    }
  };

  const openPaymentForPending = (item: PendingFeeItem) => {
    setPaymentForm({
      membership_id: item.membership_id,
      amount: item.pending_amount,
      payment_method: 'UPI',
      transaction_reference: '',
      remarks: `Cleared pending dues for ${item.plan_name}`,
    });
    setError(null);
    setRecordModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            FEE & PAYMENT MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manual fee ledger, cash/UPI transactions, pending dues, and computerized receipts.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            fetchActiveMemberships();
            setRecordModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime hover:bg-gym-limeHover flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gym-border pb-4">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'ledger'
              ? 'bg-gym-lime text-black shadow-glow-lime-sm font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-gym-card'
          }`}
        >
          Transactions Ledger ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-gym-orange text-black font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-gym-card'
          }`}
        >
          <span>Pending Dues</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
            {pendingFees.length}
          </span>
        </button>
      </div>

      {activeTab === 'ledger' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-gym-card border border-gym-border flex flex-col md:flex-row items-center gap-4 justify-between">
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by customer name, phone, or receipt number..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gym-surface border border-gym-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-gym-lime"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gym-surface hover:bg-gym-card text-white text-xs font-bold border border-gym-border"
              >
                Filter
              </button>
            </form>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gym-surface border border-gym-border text-white text-xs font-semibold focus:outline-none focus:border-gym-lime"
              >
                <option value="">All Methods</option>
                <option value="UPI">UPI (GPay / Paytm / PhonePe)</option>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Transactions Ledger Table */}
          <div className="rounded-2xl bg-gym-card border border-gym-border overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
                Loading payment records...
              </div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No payment entries match your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gym-surface text-slate-400 font-bold uppercase border-b border-gym-border">
                    <tr>
                      <th className="px-6 py-3.5 text-left">Receipt No.</th>
                      <th className="px-6 py-3.5 text-left">Customer</th>
                      <th className="px-6 py-3.5 text-left">Payment Date</th>
                      <th className="px-6 py-3.5 text-left">Method</th>
                      <th className="px-6 py-3.5 text-right">Amount Paid</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gym-border/40 text-slate-300">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-gym-surface/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-white">
                          {p.receipt_number}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-white block text-sm">{p.user_name}</span>
                          {p.remarks && <span className="text-[10px] text-slate-400 italic">{p.remarks}</span>}
                        </td>
                        <td className="px-6 py-4">{formatDate(p.payment_date)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded bg-gym-surface text-gym-lime border border-gym-border font-bold">
                            {p.payment_method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-white text-sm">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedReceiptId(p.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gym-surface hover:bg-gym-lime hover:text-black text-slate-200 border border-gym-border text-xs font-bold transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Pending Fees List */
        <div className="rounded-2xl bg-gym-card border border-gym-border overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gym-border bg-gym-card/60 flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider">
              Customers With Outstanding Fee Dues
            </h3>
            <span className="text-xs text-gym-orange font-bold">
              Total: {formatCurrency(pendingFees.reduce((acc, c) => acc + c.pending_amount, 0))}
            </span>
          </div>

          {pendingFees.length === 0 ? (
            <div className="p-12 text-center text-xs text-emerald-400">
              All active members have fully cleared their fees!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gym-surface text-slate-400 font-bold uppercase border-b border-gym-border">
                  <tr>
                    <th className="px-6 py-3.5 text-left">Member</th>
                    <th className="px-6 py-3.5 text-left">Plan</th>
                    <th className="px-6 py-3.5 text-right">Total Fee</th>
                    <th className="px-6 py-3.5 text-right">Paid</th>
                    <th className="px-6 py-3.5 text-right">Pending Due</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gym-border/40 text-slate-300">
                  {pendingFees.map((pf, idx) => (
                    <tr key={idx} className="hover:bg-gym-surface/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-white block text-sm">{pf.user_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{pf.user_phone}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">{pf.plan_name}</td>
                      <td className="px-6 py-4 text-right text-slate-300">{formatCurrency(pf.final_amount)}</td>
                      <td className="px-6 py-4 text-right text-emerald-400 font-semibold">{formatCurrency(pf.paid_amount)}</td>
                      <td className="px-6 py-4 text-right text-gym-orange font-black text-sm">
                        {formatCurrency(pf.pending_amount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openPaymentForPending(pf)}
                          className="px-3 py-1.5 rounded-lg bg-gym-lime text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-lime-sm"
                        >
                          Collect Due
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Record Payment Modal */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gym-surface border border-gym-border p-6 shadow-2xl">
            <h3 className="font-heading font-black text-xl text-white uppercase mb-4">
              Record Manual Customer Payment
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-400 text-xs border border-red-500/30">
                {error}
              </div>
            )}

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Customer & Active Membership *
                </label>
                <select
                  value={paymentForm.membership_id}
                  onChange={(e) => setPaymentForm({ ...paymentForm, membership_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                >
                  {activeMemberships.map((m) => (
                    <option key={m.membership_id} value={m.membership_id}>
                      {m.user_name} ({m.phone}) — {m.plan_name} [Due: ₹{m.pending_due}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Amount Collected (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  >
                    <option value="UPI">UPI (GPay/Paytm)</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Reference / Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  value={paymentForm.transaction_reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transaction_reference: e.target.value })}
                  placeholder="e.g. UPI/12838912/GPay"
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Remarks / Notes
                </label>
                <input
                  type="text"
                  value={paymentForm.remarks}
                  onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                  placeholder="e.g. Partial advance or monthly dues"
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gym-border/60">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gym-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gym-lime text-black font-extrabold uppercase shadow-glow-lime-sm"
                >
                  {saving ? 'Recording...' : 'Record Payment & Issue Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptId && (
        <ReceiptModal
          paymentId={selectedReceiptId}
          onClose={() => setSelectedReceiptId(null)}
        />
      )}
    </div>
  );
};
