import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { LocationContact } from '../../components/website/LocationContact';
import { MapPin, Phone, Clock, Star, Navigation, PhoneCall, Building2, Car, Sparkles, CheckCircle2 } from 'lucide-react';

export const LocationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gym-bg text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Cinematic Header with Highly Visible Gym Location Photography */}
        <section className="relative py-24 sm:py-28 bg-gym-surface/40 border-b border-gym-border/80 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/location-gym.jpg"
              alt="THE GYM Gurugram Location"
              className="w-full h-full object-cover object-center opacity-65 scale-105"
              loading="eager"
            />
            {/* Cinematic balanced dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-gym-bg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gym-lime/10 rounded-full blur-[120px] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-gym-lime/50 text-xs font-bold text-white uppercase tracking-wider mb-5 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-gym-lime animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-gym-lime" />
              <span>Visit Our Center • Badshahpur, Sector 69</span>
            </div>
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              LOCATION & CONTACT
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 mt-4 leading-relaxed font-normal drop-shadow-md">
              Find us in Badshahpur, Sector 69, Gurugram. Drop in for a facility walk-through and discover our workout floor.
            </p>
          </div>
        </section>

        {/* Location & Map Section */}
        <LocationContact />

        {/* Visiting & Arrival Highlights - Colorful Animated Cards */}
        <section className="py-16 bg-gym-surface/20 border-t border-gym-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Key Landmarks (Lime / Emerald Theme) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-3xl p-6 bg-gradient-to-br from-emerald-950/40 via-gym-card to-neutral-950 border border-emerald-500/40 hover:border-gym-lime shadow-xl hover:shadow-[0_0_30px_rgba(204,255,0,0.25)] transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gym-lime/10 rounded-full blur-2xl pointer-events-none group-hover:bg-gym-lime/20 transition-colors" />
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gym-lime/15 text-gym-lime flex items-center justify-center shrink-0 border border-gym-lime/40 shadow-glow-lime-sm group-hover:scale-110 transition-transform">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-gym-lime/10 text-gym-lime text-[10px] font-extrabold uppercase tracking-wider border border-gym-lime/30 mb-1.5">
                      Landmark
                    </span>
                    <h4 className="font-heading font-black text-white text-lg">Key Landmarks</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Neelkanth Enclave, Plot No. 9, Gali No. 1, right near Ekta Hospital, Badshahpur.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Convenient Access (Electric Cyan Theme) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative rounded-3xl p-6 bg-gradient-to-br from-cyan-950/40 via-gym-card to-neutral-950 border border-cyan-500/40 hover:border-cyan-400 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform">
                    <Car className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-extrabold uppercase tracking-wider border border-cyan-500/30 mb-1.5">
                      Easy Parking
                    </span>
                    <h4 className="font-heading font-black text-white text-lg">Convenient Access</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Easy two-wheeler and vehicle parking available directly outside the gym premises.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Front Desk Assistance (Amber / Gold Theme) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="relative rounded-3xl p-6 bg-gradient-to-br from-amber-950/40 via-gym-card to-neutral-950 border border-amber-500/40 hover:border-amber-400 shadow-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-colors" />
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform">
                    <PhoneCall className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30 mb-1.5">
                      Direct Call
                    </span>
                    <h4 className="font-heading font-black text-white text-lg">Front Desk Assistance</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Call <a href="tel:+919992963807" className="text-amber-400 font-bold hover:underline">+91 99929 63807</a> if you need directions or live navigation help.
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
