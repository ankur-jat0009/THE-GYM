import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Target, HeartHandshake, CheckCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-gym-surface/50 border-t border-gym-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Brand Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase tracking-wider">
              About THE GYM
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              A MODERN FITNESS CENTER COMMITTED TO YOUR GOALS
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              THE GYM is a modern fitness center located in Badshahpur, Sector 69, Gurugram. We are focused on helping everyday people, beginners, and fitness enthusiasts achieve their personal health and strength objectives.
            </p>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              We believe great fitness comes from consistency in a supportive space. Whether your focus is fat loss, lean muscle development, raw strength, or everyday wellness, our center is built to give you the ideal workout environment without unnecessary fluff.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-gym-card border border-gym-border">
                <Dumbbell className="w-6 h-6 text-gym-lime mb-2" />
                <h4 className="font-bold text-white text-sm">Quality Equipment</h4>
                <p className="text-xs text-slate-400 mt-1">Free weights, benches, cables & cardio machines.</p>
              </div>

              <div className="p-4 rounded-xl bg-gym-card border border-gym-border">
                <Target className="w-6 h-6 text-gym-lime mb-2" />
                <h4 className="font-bold text-white text-sm">Comfortable Space</h4>
                <p className="text-xs text-slate-400 mt-1">Clean, well-ventilated workout environment.</p>
              </div>

              <div className="p-4 rounded-xl bg-gym-card border border-gym-border">
                <HeartHandshake className="w-6 h-6 text-gym-lime mb-2" />
                <h4 className="font-bold text-white text-sm">Supportive Culture</h4>
                <p className="text-xs text-slate-400 mt-1">Encouraging atmosphere for all fitness levels.</p>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Visual Gym Photo & Brand Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative space-y-6"
          >
            {/* Primary Gym Photo Frame */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-gym-lime/30 shadow-2xl group bg-gym-card">
              <div className="aspect-[16/11] sm:aspect-[16/10] overflow-hidden relative">
                <img
                  src="/images/about-gym.jpg"
                  alt="THE GYM Badshahpur Workout Floor"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                {/* Top badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-gym-lime/40 text-xs font-bold text-white shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-gym-lime animate-pulse" />
                  <span>PREMIUM TRAINING ATMOSPHERE</span>
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-gym-lime text-black font-extrabold text-xs shadow-lg">
                  5.0 ★ Rated
                </div>

                {/* Bottom Photo Overlay Info */}
                <div className="absolute bottom-4 inset-x-4 z-10 p-3.5 rounded-2xl bg-black/80 backdrop-blur-md border border-gym-border/80 flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-black text-white text-base">THE GYM • Gurugram</h4>
                    <p className="text-[11px] text-slate-300">Badshahpur, Sector 69 Near Ekta Hospital</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-gym-lime/20 text-gym-lime text-[11px] font-black uppercase border border-gym-lime/30">
                    5.0 / 5.0
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Feature Pillars */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-gym-card border border-gym-border hover:border-gym-lime/30 transition-colors">
                <CheckCircle className="w-4 h-4 text-gym-lime mb-1.5" />
                <h5 className="text-xs font-bold text-white">Modern Strength Racks</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Heavy barbells, dumbbells & isolation machines.</p>
              </div>
              <div className="p-4 rounded-xl bg-gym-card border border-gym-border hover:border-gym-lime/30 transition-colors">
                <CheckCircle className="w-4 h-4 text-gym-lime mb-1.5" />
                <h5 className="text-xs font-bold text-white">Smart QR System</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Contactless attendance & official digital receipts.</p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
