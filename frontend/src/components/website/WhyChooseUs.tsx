import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, ShieldCheck, HeartHandshake, Sparkles, Star, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  badge: string;
  description: string;
  colorTheme: {
    border: string;
    hoverBorder: string;
    bgGlow: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    gradientLine: string;
  };
}

export const WhyChooseUs: React.FC = () => {
  const cards: FeatureCard[] = [
    {
      icon: <Dumbbell className="w-7 h-7" />,
      title: "Quality Gym Equipment",
      badge: "Heavy Free Weights & Stations",
      description: "Equipped with reliable strength stations, heavy free weights, dumbbells, barbells, and cardio machines to support every muscle group.",
      colorTheme: {
        border: "border-gym-lime/30",
        hoverBorder: "hover:border-gym-lime",
        bgGlow: "group-hover:shadow-[0_10px_35px_-10px_rgba(204,255,0,0.25)]",
        iconBg: "bg-gym-lime/15 text-gym-lime border-gym-lime/30",
        iconColor: "text-gym-lime",
        badgeBg: "bg-gym-lime/15",
        badgeText: "text-gym-lime",
        badgeBorder: "border-gym-lime/30",
        gradientLine: "from-gym-lime/80 to-transparent",
      },
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Comfortable Workout Environment",
      badge: "Clean, Well-Ventilated & Safe",
      description: "Clean, spacious floor layout designed for optimal airflow, safe lifting distances, and hygienic locker amenities.",
      colorTheme: {
        border: "border-cyan-500/30",
        hoverBorder: "hover:border-cyan-400",
        bgGlow: "group-hover:shadow-[0_10px_35px_-10px_rgba(6,182,212,0.25)]",
        iconBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
        iconColor: "text-cyan-400",
        badgeBg: "bg-cyan-500/15",
        badgeText: "text-cyan-400",
        badgeBorder: "border-cyan-500/30",
        gradientLine: "from-cyan-400/80 to-transparent",
      },
    },
    {
      icon: <HeartHandshake className="w-7 h-7" />,
      title: "Supportive Fitness Atmosphere",
      badge: "Inclusive & Motivating Culture",
      description: "Zero intimidation. A welcoming community atmosphere where beginners and seasoned lifters push each other toward their goals.",
      colorTheme: {
        border: "border-purple-500/30",
        hoverBorder: "hover:border-purple-400",
        bgGlow: "group-hover:shadow-[0_10px_35px_-10px_rgba(168,85,247,0.25)]",
        iconBg: "bg-purple-500/15 text-purple-400 border-purple-500/30",
        iconColor: "text-purple-400",
        badgeBg: "bg-purple-500/15",
        badgeText: "text-purple-400",
        badgeBorder: "border-purple-500/30",
        gradientLine: "from-purple-400/80 to-transparent",
      },
    },
    {
      icon: <Star className="w-7 h-7 fill-amber-400" />,
      title: "5.0-Star Google Rating",
      badge: "9 Verified Member Reviews",
      description: "Ranked 5.0/5 stars based on 9 verified local gym members who trust our workout space and staff.",
      colorTheme: {
        border: "border-amber-500/30",
        hoverBorder: "hover:border-amber-400",
        bgGlow: "group-hover:shadow-[0_10px_35px_-10px_rgba(245,158,11,0.25)]",
        iconBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        iconColor: "text-amber-400",
        badgeBg: "bg-amber-500/15",
        badgeText: "text-amber-400",
        badgeBorder: "border-amber-500/30",
        gradientLine: "from-amber-400/80 to-transparent",
      },
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: "Smart QR Attendance & App",
      badge: "PWA Digital Member Pass",
      description: "Instant mobile QR check-ins, computerized fee receipts, and tailored digital workout plans right in your pocket.",
      colorTheme: {
        border: "border-emerald-500/30",
        hoverBorder: "hover:border-emerald-400",
        bgGlow: "group-hover:shadow-[0_10px_35px_-10px_rgba(16,185,129,0.25)]",
        iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        iconColor: "text-emerald-400",
        badgeBg: "bg-emerald-500/15",
        badgeText: "text-emerald-400",
        badgeBorder: "border-emerald-500/30",
        gradientLine: "from-emerald-400/80 to-transparent",
      },
    },
    {
      icon: <MapPin className="w-7 h-7" />,
      title: "Convenient Badshahpur Location",
      badge: "Sector 69, Near Ekta Hospital",
      description: "Conveniently situated near Ekta Hospital in Neelkanth Enclave, Badshahpur, Sector 69, Gurugram with easy access.",
      colorTheme: {
        border: "border-rose-500/30",
        hoverBorder: "hover:border-rose-400",
        bgGlow: "group-hover:shadow-[0_10px_35px_-10px_rgba(244,63,94,0.25)]",
        iconBg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        iconColor: "text-rose-400",
        badgeBg: "bg-rose-500/15",
        badgeText: "text-rose-400",
        badgeBorder: "border-rose-500/30",
        gradientLine: "from-rose-400/80 to-transparent",
      },
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-gym-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase tracking-wider mb-4">
            The Advantage
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
            WHY TRAIN AT THE GYM
          </h2>
          <p className="text-slate-400 mt-4 text-sm sm:text-base">
            Everything you need for serious fitness progress, built around real gym principles and a supportive community.
          </p>
        </div>

        {/* Colorful Animated Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className={`relative p-8 rounded-2xl bg-gym-card/90 border ${c.colorTheme.border} ${c.colorTheme.hoverBorder} ${c.colorTheme.bgGlow} transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden shadow-lg`}
            >
              {/* Top Accent Gradient Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.colorTheme.gradientLine}`} />

              <div className="flex items-center justify-between mb-6">
                {/* Colorful Icon Box */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${c.colorTheme.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                  {c.icon}
                </div>

                {/* Card Tag Badge */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${c.colorTheme.badgeBg} ${c.colorTheme.badgeText} ${c.colorTheme.badgeBorder}`}>
                  {c.badge}
                </span>
              </div>

              <h3 className="font-heading font-black text-xl text-white mb-3 group-hover:text-white transition-colors">
                {c.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {c.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
