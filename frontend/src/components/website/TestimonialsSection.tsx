import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gym-surface/60 border-t border-gym-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-bold uppercase tracking-wider mb-6">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            Verified Customer Rating
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight uppercase mb-6">
            5.0 OUT OF 5.0 STARS ON GOOGLE
          </h2>

          <div className="p-8 rounded-2xl bg-gym-card border border-gym-border shadow-2xl relative">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-1.5 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <p className="font-heading font-black text-4xl sm:text-5xl text-white mb-2">
              5.0 <span className="text-xl text-slate-400 font-normal">/ 5.0</span>
            </p>

            <p className="text-sm font-semibold text-gym-lime mb-4">
              Based on 9 Verified Google Reviews
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed italic">
              "THE GYM is a modern fitness center focused on helping people achieve their fitness goals through quality gym equipment, a comfortable workout environment, and a supportive fitness atmosphere."
            </p>

            <div className="mt-6 pt-6 border-t border-gym-border/60 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-gym-lime" />
              <span>Authentic Google Maps Listing • Badshahpur, Sector 69 Gurugram</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
