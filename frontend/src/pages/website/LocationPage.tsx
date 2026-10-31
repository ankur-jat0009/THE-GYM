import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { LocationContact } from '../../components/website/LocationContact';
import { MapPin, Phone, Clock, Star, Navigation, PhoneCall, Building2, Car } from 'lucide-react';

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

        {/* Visiting & Arrival Highlights */}
        <section className="py-16 bg-gym-surface/20 border-t border-gym-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-gym-card border border-gym-border flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gym-lime/10 text-gym-lime flex items-center justify-center shrink-0 border border-gym-lime/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Key Landmarks</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Neelkanth Enclave, Plot No. 9, Gali No. 1, right near Ekta Hospital, Badshahpur.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gym-card border border-gym-border flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Convenient Access</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Easy two-wheeler and vehicle parking available directly outside the gym premises.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gym-card border border-gym-border flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Front Desk Assistance</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Call <a href="tel:+919992963807" className="text-white font-bold hover:text-gym-lime">+91 99929 63807</a> if you need directions or live navigation help.
                  </p>
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
