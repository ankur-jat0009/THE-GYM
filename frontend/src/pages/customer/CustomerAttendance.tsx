import React, { useEffect, useState } from 'react';
import {
  Camera,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  Clock,
  Dumbbell,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { CustomerAttendanceOverview } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { AnimatedKpiCard } from '../../components/common/AnimatedKpiCard';
import { MemberScannerModal } from '../../components/customer/MemberScannerModal';

export const CustomerAttendance: React.FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<CustomerAttendanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);

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
    fetchAttendance();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = attendance?.recent_logs?.find((l) => l.attendance_date === todayStr);

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            MY WORKOUT ATTENDANCE
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Scan THE GYM QR code at the entrance or reception desk to check in.
          </p>
        </div>

        <button
          onClick={() => setScannerOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gym-lime hover:bg-gym-limeHover text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime hover:scale-105 transition-all"
        >
          <Camera className="w-4 h-4 stroke-[2.5]" />
          <span>Open Camera & Scan Gym QR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Check-in Action Station */}
        <div className="lg:col-span-5 rounded-3xl bg-gym-card border border-gym-border p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gym-lime/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gym-surface text-gym-lime border border-gym-lime/30 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Daily Entrance Check-In
          </div>

          <h2 className="font-heading font-black text-2xl text-white">
            {user?.full_name}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5 mb-6">
            ID: {user?.phone}
          </p>

          {/* Today Check-in Status Card */}
          {todayLog ? (
            <div className="w-full p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 mb-6 shadow-inner">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                  Checked In For Today
                </span>
                <p className="text-lg font-heading font-black text-white mt-1">
                  Ready to Train! 💪
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-emerald-500/30 text-xs text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Checked in at {formatDateTime(todayLog.check_in_time).split(',')[1]}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full p-6 rounded-2xl bg-neutral-950/70 border border-gym-border text-center space-y-4 mb-6 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-gym-lime/10 text-gym-lime flex items-center justify-center mx-auto border border-gym-lime/30 shadow-glow-lime-sm animate-pulse">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-white">
                  Not Checked In Today
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Point your phone camera at THE GYM QR code on the reception desk or entrance wall.
                </p>
              </div>

              <button
                onClick={() => setScannerOpen(true)}
                className="w-full py-3.5 px-5 rounded-xl bg-gym-lime hover:bg-gym-limeHover text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-glow-lime transition-all hover:scale-[1.02]"
              >
                <Camera className="w-4 h-4 stroke-[2.5]" />
                <span>Open Camera to Scan Gym QR</span>
              </button>
            </div>
          )}

          {/* How to Check In Guide */}
          <div className="w-full p-4 rounded-xl bg-gym-surface border border-gym-border/60 text-left flex items-start gap-3">
            <Info className="w-4 h-4 text-gym-lime shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-400 leading-relaxed space-y-1">
              <p className="font-bold text-slate-200">How to mark your attendance:</p>
              <p>1. Open this page upon arriving at THE GYM.</p>
              <p>2. Tap "Open Camera to Scan Gym QR".</p>
              <p>3. Scan the official QR poster at the counter to record your workout.</p>
            </div>
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

      {/* Member Camera Scanner Modal */}
      {scannerOpen && (
        <MemberScannerModal
          onClose={() => setScannerOpen(false)}
          onSuccessCheckin={() => {
            fetchAttendance();
          }}
        />
      )}

    </div>
  );
};
