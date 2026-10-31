import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { MembershipGrid } from '../../components/website/MembershipGrid';
import { CreditCard, ShieldCheck, CheckCircle2, QrCode, PhoneCall, Sparkles, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MembershipPlansPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gym-bg text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Cinematic Header with Visible Membership Photography */}
        <section className="relative py-24 sm:py-28 bg-gym-surface/40 border-b border-gym-border/80 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/plans-banner.jpg"
              alt="THE GYM Membership Plans"
              className="w-full h-full object-cover object-center opacity-65 scale-105"
              loading="eager"
            />
            {/* Cinematic dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-gym-bg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-cyan-400/50 text-xs font-bold text-white uppercase tracking-wider mb-5 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Transparent Pricing • Zero Hidden Fees</span>
            </div>
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              MEMBERSHIP PLANS & PRICING
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 mt-4 leading-relaxed font-normal drop-shadow-md">
              Straightforward fitness plans with zero registration surprises. Includes full gym equipment access, digital attendance pass, and structured routine guidance.
            </p>
          </div>
        </section>

        {/* Dynamic Membership Grid from API */}
        <MembershipGrid />

        {/* Membership Inclusions & Photo Showcase */}
        <section className="py-20 bg-gym-surface/20 border-t border-gym-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Visual Floor Photo Frame */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden border-2 border-gym-lime/40 shadow-2xl group bg-gym-card">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src="/images/gallery-gym-floor.jpg"
                      alt="THE GYM Modern Equipment Floor"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-gym-lime/40 text-xs font-bold text-white shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-gym-lime animate-pulse" />
                      <span>FULL FLOOR ACCESS INCLUDED</span>
                    </div>

                    <div className="absolute bottom-4 inset-x-4 z-10 p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-gym-border/80">
                      <p className="text-white font-heading font-black text-base">All Machines & Free Weights</p>
                      <p className="text-xs text-slate-400 mt-0.5">Badshahpur, Sector 69 Near Ekta Hospital</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Inclusions List */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    Member Benefits
                  </div>
                  <h3 className="font-heading font-black text-3xl text-white uppercase">
                    EVERY MEMBERSHIP INCLUDES
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    Transparent, modern operations with digital tools and clean training infrastructure.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gym-card border border-gym-border hover:border-gym-lime/40 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-gym-lime/10 text-gym-lime flex items-center justify-center shrink-0 border border-gym-lime/30 mb-3">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-white text-sm">Smart QR Attendance</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Instant mobile QR check-ins and monthly attendance logging right on your phone.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gym-card border border-gym-border hover:border-cyan-400/40 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30 mb-3">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-white text-sm">Official Digital Receipts</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Download official payment receipts with receipt number directly from your dashboard.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gym-card border border-gym-border hover:border-purple-400/40 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30 mb-3">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-white text-sm">Free Weights & Machines</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Complete access to low-bar squat racks, benches, dumbbells, cables, and cardio.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gym-card border border-gym-border hover:border-amber-400/40 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 mb-3">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-white text-sm">Supportive Culture</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Encouraging workout space for everyday people, beginners, and serious lifters alike.
                    </p>
                  </div>
                </div>

                {/* Call Front Desk */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href="tel:+919992963807"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gym-limeHover transition-all shadow-glow-lime-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Gym Counter (+91 99929 63807)</span>
                  </a>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gym-surface hover:bg-gym-card text-white border border-gym-border text-xs font-bold uppercase tracking-wider text-center transition-all"
                  >
                    Join Online Now
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
