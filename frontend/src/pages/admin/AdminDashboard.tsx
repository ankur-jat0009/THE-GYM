import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  QrCode,
  Calendar,
  CreditCard,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Flame,
  Star,
} from 'lucide-react';
import { AdminDashboardSummary } from '../../types';
import { api } from '../../services/api';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { AnimatedKpiCard } from '../../components/common/AnimatedKpiCard';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get<AdminDashboardSummary>('/admin/dashboard/summary');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = data?.kpis;

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            OPERATIONS DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time gym performance, active subscriptions, and daily door metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/attendance"
            className="px-4 py-2 rounded-xl bg-gym-lime text-black font-bold text-xs uppercase tracking-wider shadow-glow-lime-sm flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Attendance Desk</span>
          </Link>
        </div>
      </div>

      {/* 8 Colorful Animated KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Total Customers (Electric Cyan) */}
        <AnimatedKpiCard
          title="Total Customers"
          value={kpis?.total_customers || 0}
          subtitle="Registered in system"
          icon={<Users className="w-5 h-5 text-cyan-400" />}
          color="cyan"
          badge={{ text: "Database", variant: "cyan" }}
          delay={0.05}
        />

        {/* KPI 2: Active Members (Electric Lime) */}
        <AnimatedKpiCard
          title="Active Members"
          value={kpis?.active_members || 0}
          subtitle="Valid membership pass"
          icon={<UserCheck className="w-5 h-5 text-gym-lime" />}
          color="lime"
          badge={{ text: "Live Passes", variant: "lime" }}
          delay={0.1}
        />

        {/* KPI 3: Expired Passes (Ruby Rose) */}
        <AnimatedKpiCard
          title="Expired Passes"
          value={kpis?.expired_members || 0}
          subtitle="Needs renewal outreach"
          icon={<UserX className="w-5 h-5 text-rose-400" />}
          color="rose"
          badge={{ text: "Renewal Due", variant: "rose" }}
          delay={0.15}
        />

        {/* KPI 4: Today's Check-ins (Electric Purple) */}
        <AnimatedKpiCard
          title="Today's Check-ins"
          value={kpis?.today_attendance || 0}
          subtitle={`${kpis?.month_attendance || 0} logged this month`}
          icon={<QrCode className="w-5 h-5 text-purple-400" />}
          color="purple"
          badge={{ text: "Smart QR", variant: "purple" }}
          delay={0.2}
        />

        {/* KPI 5: Today's Collections (Emerald Green) */}
        <AnimatedKpiCard
          title="Today's Collections"
          value={formatCurrency(kpis?.today_collections || 0)}
          subtitle="Received via Cash/UPI"
          icon={<CreditCard className="w-5 h-5 text-emerald-400" />}
          color="emerald"
          badge={{ text: "Settled", variant: "emerald" }}
          delay={0.25}
        />

        {/* KPI 6: Total Pending Dues (Sunset Amber) */}
        <AnimatedKpiCard
          title="Total Pending Dues"
          value={formatCurrency(kpis?.total_pending_fees || 0)}
          subtitle="Uncollected active fees"
          icon={<AlertCircle className="w-5 h-5 text-amber-400" />}
          color="amber"
          badge={{ text: "Pending", variant: "amber" }}
          delay={0.3}
        />

        {/* KPI 7: Expiring in 7 Days (Electric Yellow) */}
        <AnimatedKpiCard
          title="Expiring (7 Days)"
          value={kpis?.expiring_soon_count || 0}
          subtitle="Upcoming expirations"
          icon={<Clock className="w-5 h-5 text-yellow-400" />}
          color="yellow"
          badge={{ text: "Upcoming", variant: "amber" }}
          delay={0.35}
        />

        {/* KPI 8: Google Rating (Royal Indigo) */}
        <AnimatedKpiCard
          title="Google Rating"
          value="5.0 ★"
          subtitle="9 verified Google reviews"
          icon={<Star className="w-5 h-5 text-indigo-400 fill-amber-400" />}
          color="indigo"
          badge={{ text: "Top Rated", variant: "lime" }}
          delay={0.4}
        />

      </div>

      {/* 3 Detail Columns (Recent Check-ins, Recent Payments, Expiring Members) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Recent Check-ins */}
        <div className="rounded-2xl bg-gym-card border border-gym-border p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gym-border">
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Recent Attendance Check-ins
              </h3>
              <Link to="/admin/attendance" className="text-xs text-gym-lime hover:underline font-bold">
                View All
              </Link>
            </div>

            {!data?.recent_check_ins || data.recent_check_ins.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No attendance scans recorded today.</p>
            ) : (
              <div className="space-y-3">
                {data.recent_check_ins.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-gym-border/30 last:border-none">
                    <div>
                      <p className="font-bold text-white">{item.user_name}</p>
                      <span className="text-[10px] text-slate-400">{item.method}</span>
                    </div>
                    <span className="font-mono text-gym-lime font-bold">
                      {formatDateTime(item.check_in_time).split(',')[1]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Recent Payments */}
        <div className="rounded-2xl bg-gym-card border border-gym-border p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gym-border">
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Recent Fee Payments
              </h3>
              <Link to="/admin/payments" className="text-xs text-gym-lime hover:underline font-bold">
                View Ledger
              </Link>
            </div>

            {!data?.recent_payments || data.recent_payments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No recent payments logged.</p>
            ) : (
              <div className="space-y-3">
                {data.recent_payments.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-gym-border/30 last:border-none">
                    <div>
                      <p className="font-bold text-white">{p.user_name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{p.receipt_number} • {p.payment_method}</span>
                    </div>
                    <span className="font-heading font-black text-white text-sm">
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Expiring Memberships */}
        <div className="rounded-2xl bg-gym-card border border-gym-border p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gym-border">
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Upcoming Expirations (7d)
              </h3>
              <Link to="/admin/users" className="text-xs text-gym-lime hover:underline font-bold">
                Members
              </Link>
            </div>

            {!data?.expiring_members || data.expiring_members.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No memberships expiring within the next 7 days.</p>
            ) : (
              <div className="space-y-3">
                {data.expiring_members.map((em, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-gym-border/30 last:border-none">
                    <div>
                      <p className="font-bold text-white">{em.user_name}</p>
                      <span className="text-[10px] text-slate-400">{em.plan_name} • {em.phone}</span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-bold text-[10px]">
                        {em.days_left}d left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
