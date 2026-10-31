import React, { useEffect, useState } from 'react';
import {
  QrCode,
  Calendar,
  CheckCircle2,
  Search,
  Filter,
  Camera,
  Flame,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { api } from '../../services/api';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { QRScannerModal } from '../../components/admin/QRScannerModal';
import { GymQRModal } from '../../components/admin/GymQRModal';

export const AdminAttendance: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [gymQrOpen, setGymQrOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Manual check-in search
  const [searchTerm, setSearchTerm] = useState('');
  const [userResults, setUserResults] = useState<any[]>([]);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualMsg, setManualMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Monthly summary
  const [monthlySummary, setMonthlySummary] = useState<any | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      let query = `/attendance/history?limit=50`;
      if (selectedDate) query += `&date_filter=${selectedDate}`;
      const res = await api.get<{ items: any[] }>(query);
      setHistory(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlySummary = async () => {
    try {
      const summary = await api.get<any>('/attendance/monthly-summary');
      setMonthlySummary(summary);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchMonthlySummary();
  }, [selectedDate]);

  const handleSearchUsers = async (val: string) => {
    setSearchTerm(val);
    if (val.trim().length < 2) {
      setUserResults([]);
      return;
    }
    try {
      const res = await api.get<{ items: any[] }>(`/admin/users?search=${encodeURIComponent(val)}&limit=5`);
      setUserResults(res.items || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleManualCheckin = async (user: any) => {
    try {
      setManualLoading(true);
      setManualMsg(null);
      await api.post('/attendance/manual', {
        user_id: user.id,
        attendance_date: selectedDate,
        notes: 'Manual entry from attendance desk',
      });
      setManualMsg({ type: 'success', text: `Marked ${user.full_name} present for ${selectedDate}!` });
      setUserResults([]);
      setSearchTerm('');
      fetchHistory();
      fetchMonthlySummary();
    } catch (err: any) {
      setManualMsg({ type: 'error', text: err.message || 'Check-in failed.' });
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            ATTENDANCE MANAGEMENT DESK
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time camera barcode scanner, manual check-ins, and daily logbook.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setGymQrOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gym-card text-white hover:text-gym-lime border border-gym-border hover:border-gym-lime font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all shadow-md"
          >
            <QrCode className="w-4 h-4 text-gym-lime" />
            <span>Display / Print Gym QR</span>
          </button>

          <button
            onClick={() => setScannerOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime hover:bg-gym-limeHover flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
            <span>Staff Camera Scanner</span>
          </button>
        </div>
      </div>

      {/* Manual Check-in & Search Card */}
      <div className="p-6 rounded-2xl bg-gym-card border border-gym-border shadow-xl">
        <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-2">
          Manual Customer Attendance Check-in
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          If a member forgot their phone, search their name or phone number below to record attendance.
        </p>

        {manualMsg && (
          <div
            className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
              manualMsg.type === 'success'
                ? 'bg-gym-lime/10 text-gym-lime border-gym-lime/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}
          >
            {manualMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{manualMsg.text}</span>
          </div>
        )}

        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchUsers(e.target.value)}
            placeholder="Type customer name or phone to mark present..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-gym-lime"
          />

          {userResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-gym-surface border border-gym-border shadow-2xl z-20 overflow-hidden divide-y divide-gym-border/40">
              {userResults.map((u) => (
                <div
                  key={u.id}
                  className="p-3 flex items-center justify-between hover:bg-gym-card transition-colors text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{u.full_name}</span>
                    <span className="text-[10px] text-slate-400">{u.phone} • {u.membership?.plan_name || 'No Plan'}</span>
                  </div>
                  <button
                    onClick={() => handleManualCheckin(u)}
                    disabled={manualLoading}
                    className="px-3 py-1.5 rounded-lg bg-gym-lime text-black font-bold text-xs uppercase disabled:opacity-50"
                  >
                    Mark Present
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date Filter & Table Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gym-lime" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Filter by Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gym-card border border-gym-border text-white text-xs font-semibold focus:outline-none focus:border-gym-lime"
          />
        </div>

        {monthlySummary && (
          <div className="text-xs text-slate-400 font-semibold">
            Month Total: <strong className="text-gym-lime font-mono text-sm">{monthlySummary.total_check_ins}</strong> check-ins
          </div>
        )}
      </div>

      {/* Daily Attendance Table */}
      <div className="rounded-2xl bg-gym-card border border-gym-border overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
            Loading attendance records...
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No attendance entries logged for {selectedDate}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gym-surface text-slate-400 font-bold uppercase border-b border-gym-border">
                <tr>
                  <th className="px-6 py-3.5 text-left">Member Name</th>
                  <th className="px-6 py-3.5 text-left">Phone</th>
                  <th className="px-6 py-3.5 text-left">Check-in Time</th>
                  <th className="px-6 py-3.5 text-left">Method</th>
                  <th className="px-6 py-3.5 text-left">Verified By</th>
                  <th className="px-6 py-3.5 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border/40 text-slate-300">
                {history.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gym-surface/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white text-sm">
                      {rec.user_name}
                    </td>
                    <td className="px-6 py-4 font-mono">{rec.user_phone}</td>
                    <td className="px-6 py-4 font-mono font-bold text-gym-lime">
                      {rec.check_in_time}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded bg-gym-surface text-white border border-gym-border font-mono text-[10px] font-bold">
                        {rec.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{rec.marked_by}</td>
                    <td className="px-6 py-4 text-right text-slate-400 italic">
                      {rec.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Camera Scanner Modal Component */}
      {scannerOpen && (
        <QRScannerModal
          onClose={() => setScannerOpen(false)}
          onSuccessCheckin={() => {
            fetchHistory();
            fetchMonthlySummary();
          }}
        />
      )}

      {/* Official Gym Desk QR Modal Component */}
      {gymQrOpen && (
        <GymQRModal
          onClose={() => setGymQrOpen(false)}
        />
      )}
    </div>
  );
};
