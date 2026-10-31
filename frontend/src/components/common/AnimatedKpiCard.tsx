import React from 'react';
import { motion } from 'framer-motion';

export type KpiColor =
  | 'lime'
  | 'cyan'
  | 'rose'
  | 'purple'
  | 'emerald'
  | 'amber'
  | 'yellow'
  | 'indigo';

interface AnimatedKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: React.ReactNode;
  icon: React.ReactNode;
  color?: KpiColor;
  badge?: {
    text: string;
    variant?: 'lime' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
  };
  delay?: number;
  onClick?: () => void;
}

const colorStyles: Record<
  KpiColor,
  {
    bgGradient: string;
    border: string;
    glow: string;
    iconBg: string;
    accentText: string;
    glowBlob: string;
    topBar: string;
    indicator: string;
  }
> = {
  lime: {
    bgGradient: 'bg-gradient-to-br from-lime-500/15 via-gym-card to-gym-surface',
    border: 'border-lime-500/30 hover:border-lime-400/80',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(204,255,0,0.3)]',
    iconBg: 'bg-lime-500/20 text-gym-lime border-lime-500/40 shadow-[0_0_15px_rgba(204,255,0,0.3)]',
    accentText: 'text-gym-lime',
    glowBlob: 'bg-gym-lime/25',
    topBar: 'from-gym-lime to-emerald-400',
    indicator: 'bg-gym-lime',
  },
  cyan: {
    bgGradient: 'bg-gradient-to-br from-cyan-500/15 via-gym-card to-gym-surface',
    border: 'border-cyan-500/30 hover:border-cyan-400/80',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    accentText: 'text-cyan-400',
    glowBlob: 'bg-cyan-500/25',
    topBar: 'from-cyan-400 to-blue-500',
    indicator: 'bg-cyan-400',
  },
  rose: {
    bgGradient: 'bg-gradient-to-br from-rose-500/15 via-gym-card to-gym-surface',
    border: 'border-rose-500/30 hover:border-rose-400/80',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]',
    iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
    accentText: 'text-rose-400',
    glowBlob: 'bg-rose-500/25',
    topBar: 'from-rose-500 to-pink-500',
    indicator: 'bg-rose-400',
  },
  purple: {
    bgGradient: 'bg-gradient-to-br from-purple-500/15 via-gym-card to-gym-surface',
    border: 'border-purple-500/30 hover:border-purple-400/80',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]',
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    accentText: 'text-purple-400',
    glowBlob: 'bg-purple-500/25',
    topBar: 'from-purple-500 to-indigo-500',
    indicator: 'bg-purple-400',
  },
  emerald: {
    bgGradient: 'bg-gradient-to-br from-emerald-500/15 via-gym-card to-gym-surface',
    border: 'border-emerald-500/30 hover:border-emerald-400/80',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    accentText: 'text-emerald-400',
    glowBlob: 'bg-emerald-500/25',
    topBar: 'from-emerald-400 to-teal-500',
    indicator: 'bg-emerald-400',
  },
  amber: {
    bgGradient: 'bg-gradient-to-br from-amber-500/15 via-gym-card to-gym-surface',
    border: 'border-amber-500/30 hover:border-amber-400/80',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    accentText: 'text-amber-400',
    glowBlob: 'bg-amber-500/25',
    topBar: 'from-amber-500 to-orange-500',
    indicator: 'bg-amber-400',
  },
  yellow: {
    bgGradient: 'bg-gradient-to-br from-yellow-500/15 via-gym-card to-gym-surface',
    border: 'border-yellow-500/30 hover:border-yellow-400/80',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)]',
    iconBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
    accentText: 'text-yellow-400',
    glowBlob: 'bg-yellow-500/25',
    topBar: 'from-yellow-400 to-amber-500',
    indicator: 'bg-yellow-400',
  },
  indigo: {
    bgGradient: 'bg-gradient-to-br from-indigo-500/15 via-gym-card to-gym-surface',
    border: 'border-indigo-500/30 hover:border-indigo-400/80',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]',
    iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
    accentText: 'text-indigo-400',
    glowBlob: 'bg-indigo-500/25',
    topBar: 'from-indigo-500 to-blue-600',
    indicator: 'bg-indigo-400',
  },
};

export const AnimatedKpiCard: React.FC<AnimatedKpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'lime',
  badge,
  delay = 0,
  onClick,
}) => {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className={`group relative p-5 sm:p-6 rounded-2xl ${styles.bgGradient} border ${styles.border} ${styles.glow} transition-all duration-300 overflow-hidden cursor-default shadow-xl`}
    >
      {/* Top Animated Accent Gradient Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.topBar} opacity-80 group-hover:opacity-100 group-hover:h-1.5 transition-all duration-300`}
      />

      {/* Dynamic Ambient Background Glow Blob */}
      <div
        className={`absolute -top-12 -right-12 w-36 h-36 ${styles.glowBlob} rounded-full blur-3xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Card Header: Title & Animated Icon */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${styles.indicator} animate-pulse`} />
          {title}
        </span>

        {/* Animated Icon Container */}
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
          transition={{ duration: 0.3 }}
          className={`w-10 h-10 rounded-xl ${styles.iconBg} border flex items-center justify-center shrink-0 transition-transform`}
        >
          {icon}
        </motion.div>
      </div>

      {/* Main KPI Value */}
      <div className="relative z-10 my-1">
        <motion.p
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.1 }}
          className={`font-heading font-black text-2xl sm:text-3xl lg:text-4xl ${styles.accentText} tracking-tight drop-shadow-md truncate`}
        >
          {value}
        </motion.p>
      </div>

      {/* Footer Subtitle / Status Pill Badge */}
      <div className="relative z-10 mt-3 pt-2 border-t border-gym-border/40 flex items-center justify-between text-[11px] text-slate-400">
        <div className="truncate pr-2">{subtitle}</div>

        {badge && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 border bg-white/5 ${
              badge.variant === 'rose'
                ? 'text-rose-400 border-rose-500/30'
                : badge.variant === 'emerald'
                ? 'text-emerald-400 border-emerald-500/30'
                : badge.variant === 'amber'
                ? 'text-amber-400 border-amber-500/30'
                : badge.variant === 'cyan'
                ? 'text-cyan-400 border-cyan-500/30'
                : badge.variant === 'purple'
                ? 'text-purple-400 border-purple-500/30'
                : 'text-gym-lime border-gym-lime/30'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
    </motion.div>
  );
};
