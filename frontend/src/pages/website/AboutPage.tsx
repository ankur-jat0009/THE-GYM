import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { AboutSection } from '../../components/website/AboutSection';
import { Dumbbell, MapPin, Phone, Star, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gym-bg text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Cinematic Header with Visible Gym Floor Photography */}
        <section className="relative py-24 sm:py-28 bg-gym-surface/40 border-b border-gym-border/80 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/gallery-gym-floor.jpg"
              alt="About THE GYM Floor"
              className="w-full h-full object-cover object-center opacity-65 scale-105"
              loading="eager"
            />
            {/* Cinematic dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-gym-bg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gym-lime/10 rounded-full blur-[120px] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-gym-lime/50 text-xs font-bold text-white uppercase tracking-wider mb-5 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-gym-lime animate-pulse" />
              <Dumbbell className="w-3.5 h-3.5 text-gym-lime" />
              <span>Our Story & Philosophy • Sector 69 Gurugram</span>
            </div>
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              ABOUT THE GYM
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 mt-4 leading-relaxed font-normal drop-shadow-md">
              Neelkanth Enclave, Badshahpur, Sector 69, Gurugram. Built around authentic training principles, quality gear, and an encouraging community.
            </p>
          </div>
        </section>

        {/* Core About Content with Photo Showcase */}
        <AboutSection />

        {/* Facility Photos Snapshot */}
        <section className="py-16 bg-gym-surface/30 border-y border-gym-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase">
                BUILT FOR SERIOUS LIFTING & RECOVERY
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                A modern workout floor designed to give every member safe lifting space and quality biomechanics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group rounded-2xl overflow-hidden bg-gym-card border border-gym-border hover:border-gym-lime/40 transition-all shadow-xl">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src="/images/gallery-dumbbells.jpg"
                    alt="Free Weights Zone"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-white px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-gym-lime/30">
                    Free Weights & Dumbbells
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-heading font-bold text-white text-sm">Heavy Dumbbells & Incline Benches</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Multi-tier dumbbell weights supporting upper and lower body hypertrophy.</p>
                </div>
              </div>

              <div className="group rounded-2xl overflow-hidden bg-gym-card border border-gym-border hover:border-cyan-400/40 transition-all shadow-xl">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src="/images/gallery-strength.jpg"
                    alt="Strength & Squat Racks"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-white px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-cyan-400/30">
                    Strength & Barbell Stations
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-heading font-bold text-white text-sm">Olympic Barbells & Power Racks</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Sturdy squat cages and deadlift platforms for safe heavy compound lifting.</p>
                </div>
              </div>

              <div className="group rounded-2xl overflow-hidden bg-gym-card border border-gym-border hover:border-purple-400/40 transition-all shadow-xl">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src="/images/gallery-cardio.jpg"
                    alt="Cardio Conditioning Floor"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-white px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-purple-400/30">
                    Cardio & Conditioning
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-heading font-bold text-white text-sm">Treadmills & Interval Bikes</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">High-incline cardio machines to support fat loss and aerobic endurance.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Credentials & Trust Badges */}
        <section className="py-16 bg-gym-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gym-card border border-gym-border">
                <div className="flex items-center gap-2 text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" />
                  ))}
                  <span className="text-white font-extrabold text-sm ml-1">5.0 / 5.0</span>
                </div>
                <h3 className="font-heading font-black text-lg text-white mb-2">Verified Google Rating</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consistently rated 5.0 stars with 9 reviews from verified active lifters in Badshahpur.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gym-card border border-gym-border">
                <MapPin className="w-6 h-6 text-gym-lime mb-3" />
                <h3 className="font-heading font-black text-lg text-white mb-2">Gurugram Location</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Plot No. 9, Gali No. 1, Near Ekta Hospital, Badshahpur, Sector 69, Gurugram, Haryana – 122101.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gym-card border border-gym-border">
                <Phone className="w-6 h-6 text-gym-lime mb-3" />
                <h3 className="font-heading font-black text-lg text-white mb-2">Direct Front Desk</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Call or visit us directly at <span className="text-white font-bold">+91 99929 63807</span> for member enrollments and consultations.
                </p>
              </div>
            </div>

            {/* Quick Next Step Action */}
            <div className="mt-12 text-center">
              <Link
                to="/plans"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gym-lime text-black font-heading font-black text-sm uppercase tracking-wider shadow-glow-lime hover:bg-gym-limeHover transition-all hover:scale-105"
              >
                <span>View Membership Pricing</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
