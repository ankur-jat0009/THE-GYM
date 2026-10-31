import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Quote, Sparkles, MapPin } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gym-bg via-gym-surface/40 to-gym-bg border-t border-gym-border/60 relative overflow-hidden">
      {/* Background colorful ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-r from-amber-500/10 via-gym-lime/10 to-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-500/15 text-yellow-400 border border-yellow-500/30 text-xs font-bold uppercase tracking-wider mb-6 shadow-glow-lime-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Verified Customer Rating</span>
          </motion.div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase mb-8">
            5.0 OUT OF 5.0 STARS ON GOOGLE
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-950/30 via-gym-card to-emerald-950/20 border-2 border-amber-500/40 hover:border-yellow-400 shadow-[0_0_50px_rgba(245,158,11,0.18)] relative transition-all overflow-hidden"
          >
            {/* Top golden decorative quote */}
            <Quote className="absolute top-6 right-6 w-16 h-16 text-yellow-500/10 rotate-12 pointer-events-none" />

            {/* Glowing Golden Stars */}
            <div className="flex justify-center mb-5">
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/60 border border-yellow-500/30 shadow-inner">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]"
                  />
                ))}
              </div>
            </div>

            {/* Gradient Rating Text */}
            <div className="mb-2">
              <span className="font-heading font-black text-5xl sm:text-6xl bg-gradient-to-r from-yellow-300 via-amber-400 to-gym-lime bg-clip-text text-transparent drop-shadow-lg">
                5.0
              </span>
              <span className="font-heading font-black text-2xl sm:text-3xl text-slate-400 ml-2">
                / 5.0
              </span>
            </div>

            {/* Subtitle badge */}
            <div className="inline-block px-3.5 py-1 rounded-full bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase tracking-wider mb-5">
              Based on 9 Verified Google Reviews
            </div>

            {/* Review Quote text */}
            <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto leading-relaxed italic font-normal bg-black/30 p-4 rounded-2xl border border-white/5">
              "THE GYM is a modern fitness center focused on helping people achieve their fitness goals through quality gym equipment, a comfortable workout environment, and a supportive fitness atmosphere."
            </p>

            {/* Authentic Google Maps Listing Badge with colorful dots */}
            <div className="mt-8 pt-6 border-t border-amber-500/20 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                <span className="font-bold ml-1 text-white">Google Maps Verified</span>
              </div>
              <span className="text-slate-500">•</span>
              <div className="flex items-center gap-1.5 text-gym-lime font-medium">
                <MapPin className="w-3.5 h-3.5 text-gym-lime" />
                <span>Badshahpur, Sector 69 Gurugram</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
