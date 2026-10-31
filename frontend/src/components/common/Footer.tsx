import React from 'react';
import { Dumbbell, Phone, MapPin, Clock, ShieldCheck, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const address = "Neelkanth Enclave, Plot No. 9, Gali No. 1, Near Ekta Hospital, Badshahpur, Sector 69, Gurugram, Haryana – 122101";
  const phone = "+91 99929 63807";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("THE GYM Badshahpur Sector 69 Gurugram")}`;

  return (
    <footer className="relative bg-black border-t border-neutral-900 text-slate-400 pt-16 pb-10 overflow-hidden">
      {/* Subtle top lime hairline glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gym-lime/40 to-transparent" />
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gym-lime/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gym-lime/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
          
          {/* Col 1: Brand & Overview (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gym-lime flex items-center justify-center text-black font-black shadow-glow-lime-sm transition-transform group-hover:scale-105">
                <Dumbbell className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-heading font-black text-2xl tracking-wider text-white">THE GYM</span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-gym-lime -mt-1">Gurugram</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 pr-4">
              THE GYM is a modern fitness center focused on helping people achieve their fitness goals through quality gym equipment, a comfortable workout environment, and a supportive fitness atmosphere.
            </p>

            <div className="pt-1 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-slate-300 w-fit">
                <span className="w-2 h-2 rounded-full bg-gym-lime animate-pulse" />
                <span className="font-medium">Badshahpur, Sector 69 • Gurugram</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/50 border border-neutral-800/80 text-xs text-slate-400 w-fit">
                <Clock className="w-3.5 h-3.5 text-gym-lime shrink-0" />
                <span>Mon – Sat: 5:30 AM – 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (Col span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-0.5 bg-gym-lime rounded-full" />
              Quick Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-gym-lime transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gym-lime opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  <span>About THE GYM</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/plans"
                  className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-gym-lime transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gym-lime opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  <span>Membership Pricing</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/workouts"
                  className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-gym-lime transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gym-lime opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  <span>Workout Programs</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/why-us"
                  className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-gym-lime transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gym-lime opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  <span>Why Choose Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/location"
                  className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-gym-lime transition-all duration-200"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gym-lime opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                  <span>Location & Directions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details (Col span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-0.5 bg-gym-lime rounded-full" />
              Contact Information
            </h4>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gym-lime shrink-0 mt-1" />
                <p className="text-xs leading-relaxed text-slate-300">
                  {address}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gym-lime shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="hover:text-gym-lime font-semibold text-white transition-colors"
                >
                  {phone}
                </a>
              </div>

              <div className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-xs font-medium text-slate-200 border border-neutral-800 hover:border-neutral-700 transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gym-lime" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Member Portal Access (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-0.5 bg-gym-lime rounded-full" />
              Member Portals
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access your digital QR code attendance pass, fee receipts, and tailored workout routines.
            </p>
            <div className="space-y-2 pt-1">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-gym-lime hover:text-black text-white border border-neutral-800 hover:border-gym-lime text-xs font-bold transition-all shadow-md group"
              >
                <span>Customer Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {currentYear} THE GYM. All rights reserved.
          </div>
          <div className="flex items-center gap-2.5 text-slate-400 bg-neutral-950 px-3 py-1.5 rounded-full border border-neutral-900">
            <ShieldCheck className="w-4 h-4 text-gym-lime" />
            <span className="text-[11px] font-medium">PWA Enabled • Installable on Android & iOS</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
