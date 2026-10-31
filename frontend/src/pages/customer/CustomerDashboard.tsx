import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CreditCard,
  QrCode,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Dumbbell,
  ShieldAlert,
  Bell,
  Info,
  Camera,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  CustomerMembershipOverview,
  CustomerFeeOverview,
  CustomerAttendanceOverview,
  CustomerAssignedWorkout,
  NotificationItem,
} from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { AnimatedKpiCard } from '../../components/common/AnimatedKpiCard';
import { MemberScannerModal } from '../../components/customer/MemberScannerModal';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [membershipData, setMembershipData] = useState<CustomerMembershipOverview | null>(null);
  const [feeData, setFeeData] = useState<CustomerFeeOverview | null>(null);
  const [attendanceData, setAttendanceData] = useState<CustomerAttendanceOverview | null>(null);
  const [workoutData, setWorkoutData] = useState<CustomerAssignedWorkout | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [mRes, fRes, aRes, wRes, nRes] = await Promise.all([
        api.get<CustomerMembershipOverview>('/users/me/membership'),
        api.get<CustomerFeeOverview>('/users/me/payments'),
        api.get<CustomerAttendanceOverview>('/users/me/attendance'),
        api.get<CustomerAssignedWorkout>('/users/me/workouts'),
        api.get<{ unread_count: number; items: NotificationItem[] }>('/notifications'),
      ]);
      setMembershipData(mRes);
      setFeeData(fRes);
      setAttendanceData(aRes);
      setWorkoutData(wRes);
      setNotifications(nRes.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-36 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
          <div className="h-36 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
          <div className="h-36 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
        </div>
      </div>
    );
  }

  const membership = membershipData?.membership;

  return (
    <div className="space-y-8">
      
      {/* Hero Welcome Card */}
      <div className="relative rounded-2xl bg-gradient-to-r from-gym-surface via-gym-card to-gym-surface border border-gym-border p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gym-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gym-lime flex items-center justify-center text-black font-black text-2xl shadow-glow-lime-sm">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gym-lime/10 text-gym-lime text-[11px] font-bold border border-gym-lime/30 mb-1">
                <Sparkles className="w-3 h-3" />
                Active Member
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
                {user?.full_name}
              </h1>
              <p className="text-xs text-slate-400">
                {user?.email} • {user?.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="px-6 py-3 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-lime hover:bg-gym-limeHover transition-all hover:scale-105"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>Scan Gym QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Colorful Animated KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Current Membership Plan (Electric Lime) */}
        <AnimatedKpiCard
          title="Membership Plan"
          value={membership?.plan_name || 'No Active Plan'}
          subtitle={
            membership ? (
              <span>Valid till {formatDate(membership.end_date)}</span>
            ) : (
              <span>Visit gym desk to enroll</span>
            )
          }
          icon={<Calendar className="w-5 h-5 text-gym-lime" />}
          color="lime"
          badge={
            membership
              ? { text: `${membership.remaining_days}d left`, variant: 'lime' }
              : { text: 'Inactive', variant: 'rose' }
          }
          delay={0.05}
        />

        {/* Stat 2: Attendance This Month (Electric Purple) */}
        <AnimatedKpiCard
          title="Attendance Month"
          value={`${attendanceData?.present_days_count || 0} / ${attendanceData?.total_days_in_month || 30}d`}
          subtitle={
            <span className="flex items-center gap-1 text-gym-lime font-bold">
              <Flame className="w-3.5 h-3.5 fill-gym-lime" />
              {attendanceData?.streak_days || 0} Day Streak
            </span>
          }
          icon={<QrCode className="w-5 h-5 text-purple-400" />}
          color="purple"
          badge={{ text: `${attendanceData?.attendance_percentage || 0}% Rate`, variant: 'purple' }}
          delay={0.1}
        />

        {/* Stat 3: Fee Payment Status (Sunset Amber / Emerald) */}
        <AnimatedKpiCard
          title="Pending Dues"
          value={formatCurrency(feeData?.outstanding_amount || 0)}
          subtitle={
            feeData?.outstanding_amount && feeData.outstanding_amount > 0
              ? `Due by ${formatDate(feeData.payment_due_date)}`
              : 'All fees cleared'
          }
          icon={<CreditCard className="w-5 h-5 text-amber-400" />}
          color={feeData?.outstanding_amount && feeData.outstanding_amount > 0 ? 'amber' : 'emerald'}
          badge={
            feeData?.outstanding_amount && feeData.outstanding_amount > 0
              ? { text: 'Balance Due', variant: 'amber' }
              : { text: 'Cleared', variant: 'emerald' }
          }
          delay={0.15}
        />

        {/* Stat 4: Workout Routine (Electric Cyan) */}
        <AnimatedKpiCard
          title="Workout Routine"
          value={workoutData?.has_assignment && workoutData.plan ? workoutData.plan.title : 'Routine Pending'}
          subtitle={
            workoutData?.has_assignment && workoutData.plan
              ? `${workoutData.plan.exercises.length} Exercises Included`
              : 'Ask trainer to assign split'
          }
          icon={<Dumbbell className="w-5 h-5 text-cyan-400" />}
          color="cyan"
          badge={
            workoutData?.has_assignment && workoutData.plan
              ? { text: workoutData.plan.difficulty_level, variant: 'cyan' }
              : undefined
          }
          delay={0.2}
        />

      </div>

      {/* Quick Access Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Quick QR Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gym-card border border-gym-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-white">
                Contactless Attendance Pass
              </h3>
              <span className="px-2 py-0.5 rounded bg-gym-lime/20 text-gym-lime text-[11px] font-bold">
                Smart QR
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              When entering THE GYM, present your personal QR pass to the front desk scanner. It records your entry time and updates your monthly fitness calendar instantly.
            </p>
          </div>

          <Link
            to="/dashboard/attendance"
            className="w-full py-3 rounded-xl bg-gym-surface hover:bg-gym-card text-white border border-gym-border hover:border-gym-lime/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4 text-gym-lime" />
            <span>Open Attendance Scanner Pass</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Right: Membership Details */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gym-card border border-gym-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-white">
                Membership Details & Fees
              </h3>
              <span className="px-2 py-0.5 rounded bg-gym-surface text-slate-300 text-[11px] font-mono border border-gym-border">
                {membership?.status || 'No Plan'}
              </span>
            </div>

            {membership ? (
              <div className="space-y-3 text-xs text-slate-300 mb-6">
                <div className="flex justify-between py-1.5 border-b border-gym-border/40">
                  <span className="text-slate-400">Enrolled Plan:</span>
                  <span className="font-bold text-white">{membership.plan_name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gym-border/40">
                  <span className="text-slate-400">Total Plan Fee:</span>
                  <span className="font-bold text-white">{formatCurrency(membership.final_amount)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gym-border/40">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-bold text-gym-lime">{formatCurrency(feeData?.amount_paid || 0)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Expiry Date:</span>
                  <span className="font-bold text-white">{formatDate(membership.end_date)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mb-6">
                You do not have an active membership plan yet. Visit the front desk to enroll.
              </p>
            )}
          </div>

          <Link
            to="/dashboard/fees"
            className="w-full py-3 rounded-xl bg-gym-surface hover:bg-gym-card text-white border border-gym-border hover:border-gym-lime/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <CreditCard className="w-4 h-4 text-gym-lime" />
            <span>View Payments & Fee Ledger</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

      </div>

      {/* Dedicated Member Notifications & Announcements Section */}
      <div className="rounded-2xl bg-gym-card border border-gym-border p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between pb-5 border-b border-gym-border/70 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gym-lime/10 border border-gym-lime/30 flex items-center justify-center text-gym-lime">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Gym Notices & Announcements
              </h3>
              <p className="text-xs text-slate-400">
                Official updates from THE GYM front desk and training staff
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-gym-surface border border-gym-border text-xs font-bold text-slate-300">
            {notifications.filter((n) => !n.is_read).length} Unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-gym-lime/50" />
            <p className="font-semibold text-slate-300">All Caught Up!</p>
            <p className="text-slate-500 max-w-sm">
              You have no active alerts or unread announcements from the gym management.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markAsRead(n.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                  n.is_read
                    ? 'bg-gym-surface/40 border-gym-border/50 text-slate-400 hover:border-gym-border'
                    : 'bg-gym-surface border-gym-lime/30 text-white shadow-sm hover:border-gym-lime'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {n.type === 'PAYMENT_RECEIVED' ? (
                    <CheckCircle2 className="w-5 h-5 text-gym-lime" />
                  ) : n.type === 'WORKOUT_ASSIGNED' ? (
                    <Dumbbell className="w-5 h-5 text-cyan-400" />
                  ) : n.type === 'PAYMENT_REMINDER' || n.type === 'EXPIRY_REMINDER' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h4 className={`text-sm font-bold truncate ${n.is_read ? 'text-slate-300' : 'text-white'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                      {formatDateTime(n.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {!n.is_read && (
                  <span className="px-2 py-0.5 rounded bg-gym-lime/20 text-gym-lime text-[10px] font-extrabold uppercase shrink-0 border border-gym-lime/30">
                    New
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Camera QR Scanner Modal */}
      {scannerOpen && (
        <MemberScannerModal
          onClose={() => setScannerOpen(false)}
          onSuccessCheckin={() => {
            fetchDashboard();
          }}
        />
      )}

    </div>
  );
};
