import React from 'react';
import { Dumbbell, Phone, MapPin, Clock, ShieldCheck, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const address = "Neelkanth Enclave, Plot No. 9, Gali No. 1, Near Ekta Hospital, Badshahpur, Sector 69, Gurugram – 122101";
  const phone = "+91 99929 63807";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("THE GYM Near Ekta Hospital Badshahpur Sector 69 Gurugram")}`;

  return (
    <footer className="relative bg-black border-t border-neutral-900 text-slate-400 pt-10 pb-6 overflow-hidden">
      {/* Subtle top lime hairline glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gym-lime/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-8">
          
          {/* Col 1: Brand & Schedule (Col span 5) */}
          <div className="lg:col-span-5 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gym-lime flex items-center justify-center text-black font-black shadow-glow-lime-sm">
                <Dumbbell className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-heading font-black text-xl tracking-wider text-white">THE GYM</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gym-lime px-2 py-0.5 rounded bg-gym-lime/10 border border-gym-lime/30">
                Gurugram
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Modern fitness center equipped with premium strength and cardio machinery in Badshahpur, Sector 69.
            </p>

            {/* Compact Timings Badge */}
            <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 p-2 rounded-xl bg-neutral-950 border border-neutral-800/80 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-gym-lime shrink-0" />
                <span>Mon – Sat:</span>
              </div>
              <span className="text-gym-lime font-bold">5:00 AM – 10:00 AM</span>
              <span className="text-neutral-600">•</span>
              <span className="text-gym-lime font-bold">5:00 PM – 10:00 PM</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (Col span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-gym-lime rounded-full" />
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-gym-lime transition-colors">About THE GYM</Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-gym-lime transition-colors">Membership Pricing</Link>
              </li>
              <li>
                <Link to="/workouts" className="hover:text-gym-lime transition-colors">Workout Programs</Link>
              </li>
              <li>
                <Link to="/why-us" className="hover:text-gym-lime transition-colors">Why Choose Us</Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-gym-lime transition-colors">Location & Directions</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details & Member Link (Col span 4) */}
          <div className="lg:col-span-4 space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-gym-lime rounded-full" />
              Contact & Location
            </h4>
            
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-gym-lime shrink-0 mt-0.5" />
              <p className="leading-snug text-[11px] text-slate-300">
                {address}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 text-xs text-white hover:text-gym-lime font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gym-lime" />
                <span>{phone}</span>
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                <span>Google Maps</span>
                <ArrowUpRight className="w-3 h-3 text-gym-lime" />
              </a>
            </div>

            <div className="pt-1">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg bg-neutral-900 hover:bg-gym-lime hover:text-black text-white border border-neutral-800 text-[11px] font-bold transition-all shadow-sm group"
              >
                <span>Customer Dashboard</span>
                <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-neutral-900 pt-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>
            © {currentYear} THE GYM. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-gym-lime" />
            <span>PWA Enabled • Installable on Android & iOS</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
