import React, { useEffect, useState } from 'react';
import { X, Printer, Dumbbell, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ReceiptDetail } from '../../types';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ReceiptModalProps {
  paymentId: string;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ paymentId, onClose }) => {
  const [receipt, setReceipt] = useState<ReceiptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        const data = await api.get<ReceiptDetail>(`/payments/${paymentId}/receipt`);
        setReceipt(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load receipt details');
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [paymentId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-gym-surface border border-gym-border shadow-2xl overflow-hidden print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Toolbar (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gym-border bg-gym-card/60 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-gym-lime" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Fee Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gym-lime text-black text-xs font-bold hover:bg-gym-limeHover transition-colors shadow-glow-lime-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content Body */}
        <div className="p-6 md:p-8 space-y-6 text-slate-200 print:text-black" id="printable-receipt">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">Loading receipt details...</div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-red-400">{error}</div>
          ) : receipt ? (
            <>
              {/* Gym Header */}
              <div className="text-center border-b border-gym-border/70 pb-5 print:border-black/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gym-lime flex items-center justify-center text-black font-black">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <h1 className="font-heading font-black text-2xl text-white print:text-black tracking-wide">
                    {receipt.gym_name}
                  </h1>
                </div>
                <p className="text-xs text-slate-400 print:text-gray-600 max-w-sm mx-auto leading-relaxed">
                  {receipt.gym_address}
                </p>
                <p className="text-xs text-slate-300 print:text-black font-semibold mt-1">
                  Phone: {receipt.gym_phone}
                </p>
              </div>

              {/* Receipt Meta Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-gym-card/50 print:bg-gray-100 p-4 rounded-xl border border-gym-border/40 print:border-gray-300">
                <div>
                  <span className="text-slate-400 print:text-gray-500 block">Receipt No.</span>
                  <span className="font-mono font-bold text-white print:text-black text-sm">{receipt.receipt_number}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 print:text-gray-500 block">Payment Date</span>
                  <span className="font-semibold text-white print:text-black">{formatDate(receipt.payment_date)}</span>
                </div>
                <div>
                  <span className="text-slate-400 print:text-gray-500 block">Member Name</span>
                  <span className="font-bold text-white print:text-black">{receipt.customer_name}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 print:text-gray-500 block">Contact Phone</span>
                  <span className="font-medium text-white print:text-black">{receipt.customer_phone}</span>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="border border-gym-border/60 print:border-gray-300 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gym-card print:bg-gray-200 text-slate-300 print:text-black font-bold uppercase">
                    <tr>
                      <th className="px-4 py-2.5 text-left">Description</th>
                      <th className="px-4 py-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gym-border/40 print:divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-semibold">
                        {receipt.membership_plan} Membership
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(receipt.total_membership_fee)}
                      </td>
                    </tr>
                    <tr className="bg-gym-lime/5 print:bg-gray-50">
                      <td className="px-4 py-3 font-bold text-gym-lime print:text-black">
                        Amount Paid ({receipt.payment_method})
                        {receipt.transaction_reference && (
                          <span className="block text-[10px] font-normal text-slate-400 print:text-gray-600">
                            Ref: {receipt.transaction_reference}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-extrabold text-gym-lime print:text-black text-sm">
                        {formatCurrency(receipt.amount_paid)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-slate-400 print:text-gray-600">
                        Remaining Balance Due
                      </td>
                      <td className={`px-4 py-2.5 text-right font-bold ${receipt.remaining_balance > 0 ? 'text-gym-orange' : 'text-slate-400 print:text-gray-600'}`}>
                        {formatCurrency(receipt.remaining_balance)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Remarks & Stamp */}
              {receipt.remarks && (
                <div className="text-[11px] text-slate-400 print:text-gray-600 italic">
                  <strong>Remarks:</strong> {receipt.remarks}
                </div>
              )}

              {/* Footer validation */}
              <div className="pt-4 border-t border-gym-border/60 print:border-black/20 flex items-center justify-between text-[11px] text-slate-500 print:text-gray-500">
                <div className="flex items-center gap-1.5 text-gym-lime print:text-black font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorized Official Computerized Receipt</span>
                </div>
                <span>Thank you for training with THE GYM!</span>
              </div>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};
