import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Flame,
  CheckCircle2,
  Calendar,
  RefreshCw,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { CustomerAttendanceOverview, QRTokenResponse } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { AnimatedKpiCard } from '../../components/common/AnimatedKpiCard';

export const CustomerAttendance: React.FC = () => {
  const { user } = useAuth();
  const [qrToken, setQrToken] = useState<QRTokenResponse | null>(null);
  const [attendance, setAttendance] = useState<CustomerAttendanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);

  const fetchQR = async () => {
    try {
      setQrLoading(true);
      const res = await api.get<QRTokenResponse>('/attendance/qr');
      setQrToken(res);
    } catch (e) {
      console.error(e);
    } finally {
      setQrLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get<CustomerAttendanceOverview>('/users/me/attendance');
      setAttendance(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQR();
    fetchAttendance();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
          MY ATTENDANCE & QR PASS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Scan your personal digital pass at the front counter every time you train.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: QR Pass Card */}
        <div className="lg:col-span-5 rounded-2xl bg-gym-card border border-gym-border p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gym-lime/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gym-surface text-gym-lime border border-gym-lime/30 text-xs font-bold mb-4">
            <QrCode className="w-3.5 h-3.5" />
            Official Member Pass
          </div>

          <h2 className="font-heading font-black text-2xl text-white">
            {user?.full_name}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5 mb-6">
            ID: {user?.phone}
          </p>

          {/* QR Code Graphic Frame */}
          <div className="p-4 rounded-2xl bg-white shadow-glow-lime-sm mb-6 relative">
            {qrLoading ? (
              <div className="w-56 h-56 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-black animate-spin" />
              </div>
            ) : qrToken ? (
              <QRCodeSVG
                value={qrToken.token_payload}
                size={224}
                level="H"
                includeMargin={false}
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-black">
                Failed to load QR code.
              </div>
            )}
          </div>

          <button
            onClick={fetchQR}
            disabled={qrLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gym-surface hover:bg-gym-card text-slate-300 hover:text-white border border-gym-border text-xs font-bold transition-all mb-6"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gym-lime ${qrLoading ? 'animate-spin' : ''}`} />
            <span>Refresh QR Security Signature</span>
          </button>

          {/* Important Security Rule */}
          <div className="w-full p-3.5 rounded-xl bg-gym-surface border border-gym-border/60 text-left flex items-start gap-2.5">
            <Info className="w-4 h-4 text-gym-lime shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Notice:</strong> Please display this QR code to the gym staff at entry. Only authorized staff devices can mark your attendance. Self-checkins are restricted.
            </p>
          </div>
        </div>

        {/* Right Column: Attendance Calendar & Monthly Stats */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Colorful Animated Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AnimatedKpiCard
              title="Days Present"
              value={attendance?.present_days_count || 0}
              subtitle="Sessions this month"
              icon={<Calendar className="w-5 h-5 text-cyan-400" />}
              color="cyan"
              badge={{ text: "Logged", variant: "cyan" }}
              delay={0.05}
            />

            <AnimatedKpiCard
              title="Attendance Rate"
              value={`${attendance?.attendance_percentage || 0}%`}
              subtitle="Monthly consistency"
              icon={<CheckCircle2 className="w-5 h-5 text-gym-lime" />}
              color="lime"
              badge={{ text: "Target", variant: "lime" }}
              delay={0.1}
            />

            <AnimatedKpiCard
              title="Active Streak"
              value={`${attendance?.streak_days || 0}d`}
              subtitle="Consecutive workouts"
              icon={<Flame className="w-5 h-5 text-amber-400 fill-amber-400" />}
              color="amber"
              badge={{ text: "Streak", variant: "amber" }}
              delay={0.15}
            />
          </div>

          {/* Interactive Attendance Calendar Matrix */}
          <div className="p-6 rounded-2xl bg-gym-card border border-gym-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gym-lime" />
                <h3 className="font-heading font-bold text-lg text-white">
                  {attendance?.current_month || 'Attendance Calendar'}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-gym-lime" />
                  <span className="text-slate-300">Present</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-gym-surface border border-gym-border" />
                  <span className="text-slate-400">Absent / Rest</span>
                </div>
              </div>
            </div>

            {/* Days Matrix */}
            <div className="grid grid-cols-7 gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center text-[10px] font-bold text-slate-500 py-1">
                  {day}
                </div>
              ))}

              {attendance?.calendar_matrix.map((d) => (
                <div
                  key={d.date_str}
                  title={d.is_present ? `Present at ${d.check_in_time}` : `Date: ${d.date_str}`}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-transform hover:scale-105 cursor-default ${
                    d.is_present
                      ? 'bg-gym-lime text-black shadow-glow-lime-sm font-extrabold'
                      : 'bg-gym-surface text-slate-400 border border-gym-border/50'
                  }`}
                >
                  <span>{d.day_of_month}</span>
                  {d.is_present && (
                    <span className="text-[9px] font-mono leading-none mt-0.5">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Attendance Logs */}
          <div className="p-6 rounded-2xl bg-gym-card border border-gym-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Recent Check-in Timestamps:
            </h4>
            {attendance?.recent_logs && attendance.recent_logs.length > 0 ? (
              <div className="divide-y divide-gym-border/40">
                {attendance.recent_logs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gym-lime" />
                      <span className="text-white font-medium">{log.attendance_date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-gym-lime font-bold">
                        {formatDateTime(log.check_in_time).split(',')[1]}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-gym-surface text-slate-400 text-[10px]">
                        {log.method}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No attendance entries recorded yet.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
