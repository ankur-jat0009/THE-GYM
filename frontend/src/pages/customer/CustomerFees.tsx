import React, { useEffect, useState } from 'react';
import { CreditCard, FileText, CheckCircle2, Clock, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';
import { CustomerFeeOverview } from '../../types';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ReceiptModal } from '../../components/common/ReceiptModal';
import { AnimatedKpiCard } from '../../components/common/AnimatedKpiCard';

export const CustomerFees: React.FC = () => {
  const [feeData, setFeeData] = useState<CustomerFeeOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const data = await api.get<CustomerFeeOverview>('/users/me/payments');
        setFeeData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
          MY FEES & PAYMENT RECORDS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review your enrolled membership fees, cleared balances, and download official receipts.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="h-40 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
          <div className="h-64 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
        </div>
      ) : (
        <>
          {/* 4 Colorful Animated Fee Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedKpiCard
              title="Enrolled Plan"
              value={feeData?.membership_plan_name || 'No Plan Active'}
              subtitle={feeData?.membership_plan_name ? 'Official Gym Plan' : 'Visit front desk to enroll'}
              icon={<FileText className="w-5 h-5 text-purple-400" />}
              color="purple"
              badge={
                feeData?.membership_plan_name
                  ? { text: 'Enrolled', variant: 'purple' }
                  : { text: 'Inactive', variant: 'rose' }
              }
              delay={0.05}
            />

            <AnimatedKpiCard
              title="Total Membership Fee"
              value={formatCurrency(feeData?.total_fee || 0)}
              subtitle="Full package membership charge"
              icon={<CreditCard className="w-5 h-5 text-cyan-400" />}
              color="cyan"
              badge={{ text: 'Package Fee', variant: 'cyan' }}
              delay={0.1}
            />

            <AnimatedKpiCard
              title="Amount Cleared"
              value={formatCurrency(feeData?.amount_paid || 0)}
              subtitle="Confirmed payment transactions"
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              color="emerald"
              badge={{ text: 'Verified', variant: 'emerald' }}
              delay={0.15}
            />

            <AnimatedKpiCard
              title="Pending Balance"
              value={formatCurrency(feeData?.outstanding_amount || 0)}
              subtitle={
                feeData?.payment_due_date && feeData.outstanding_amount > 0
                  ? `Due by ${formatDate(feeData.payment_due_date)}`
                  : 'Zero pending balance'
              }
              icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
              color={feeData?.outstanding_amount && feeData.outstanding_amount > 0 ? 'amber' : 'lime'}
              badge={
                feeData?.outstanding_amount && feeData.outstanding_amount > 0
                  ? { text: 'Balance Due', variant: 'amber' }
                  : { text: 'All Cleared', variant: 'lime' }
              }
              delay={0.2}
            />
          </div>

          {/* Payment History Table */}
          <div className="rounded-2xl bg-gym-card border border-gym-border overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gym-border bg-gym-card/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gym-lime" />
                <h3 className="font-heading font-bold text-lg text-white">
                  Payment History & Receipts
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {feeData?.history.length || 0} Records
              </span>
            </div>

            {!feeData?.history || feeData.history.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No payment transactions recorded for this account yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gym-surface text-slate-400 font-bold uppercase border-b border-gym-border/80">
                    <tr>
                      <th className="px-6 py-3.5 text-left">Receipt No.</th>
                      <th className="px-6 py-3.5 text-left">Payment Date</th>
                      <th className="px-6 py-3.5 text-left">Method</th>
                      <th className="px-6 py-3.5 text-right">Amount Paid</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gym-border/40 text-slate-300">
                    {feeData.history.map((pay) => (
                      <tr key={pay.id} className="hover:bg-gym-surface/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-white">
                          {pay.receipt_number}
                        </td>
                        <td className="px-6 py-4">{formatDate(pay.payment_date)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded bg-gym-surface text-gym-lime border border-gym-border font-bold">
                            {pay.payment_method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-white text-sm">
                          {formatCurrency(pay.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedPaymentId(pay.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold hover:bg-gym-lime hover:text-black transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Receipt</span>
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
      )}

      {/* Printable Receipt Modal */}
      {selectedPaymentId && (
        <ReceiptModal
          paymentId={selectedPaymentId}
          onClose={() => setSelectedPaymentId(null)}
        />
      )}
    </div>
  );
};
