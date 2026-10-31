import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Dumbbell, ShieldCheck, MapPin, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Dynamic Background Gradients & Mesh */}
      <div className="absolute inset-0 bg-gym-bg">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gym-lime/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Brand Headline, Subtitle, CTAs & Features */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Top verified badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gym-surface border border-gym-border text-xs font-semibold text-slate-300 mb-6 shadow-md"
            >
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                ))}
              </div>
              <span className="text-white font-bold">5.0 Star Rated</span>
              <span className="text-gym-textMuted">• Badshahpur, Sector 69 Gurugram</span>
            </motion.div>

            {/* Main Brand Title & Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white mb-6 uppercase leading-[1.08]"
            >
              BUILD YOUR STRENGTH AT <br />
              <span className="text-gradient-lime">THE GYM</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg lg:text-xl text-slate-300 mb-8 font-normal leading-relaxed"
            >
              A modern fitness center focused on helping people achieve their fitness goals through quality gym equipment, a comfortable workout environment, and a supportive fitness atmosphere.
            </motion.p>

            {/* MOBILE-ONLY ANIMATED PICTURE (Visible on < lg, hidden on lg+) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="block lg:hidden my-8"
            >
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative rounded-2xl overflow-hidden border-2 border-gym-lime/40 shadow-[0_10px_35px_-5px_rgba(204,255,0,0.25)] group"
              >
                {/* Background glow behind mobile picture */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gym-lime/30 to-emerald-500/20 rounded-2xl blur-lg pointer-events-none opacity-75" />
                
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gym-surface">
                  <img
                    src="/images/gym-hero-mobile.jpg"
                    alt="THE GYM Modern Fitness Workout"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  {/* Subtle dark vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />
                  
                  {/* Top-left animated live indicator */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gym-lime/50 text-[11px] font-black text-white shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gym-lime opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gym-lime" />
                    </span>
                    <span>THE GYM • GURUGRAM</span>
                  </div>

                  {/* Bottom info banner */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-gym-border/80">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gym-lime flex items-center justify-center text-black font-black">
                        <Dumbbell className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">Quality Equipment</p>
                        <p className="text-[10px] text-slate-400">Sector 69 Floor</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-yellow-400 gap-0.5 justify-end">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <span className="text-white font-black text-xs">5.0</span>
                      </div>
                      <p className="text-[9px] text-gym-lime font-semibold">9 Reviews</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Call-to-Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gym-lime text-black font-heading font-black text-base uppercase tracking-wider shadow-glow-lime hover:bg-gym-limeHover transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Join Now</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>
              <Link
                to="/plans"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gym-surface hover:bg-gym-card text-white font-heading font-bold text-base tracking-wider border border-gym-border hover:border-gym-lime/50 transition-all flex items-center justify-center gap-2"
              >
                Explore Memberships
              </Link>
            </motion.div>

            {/* Highlight Feature Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <div className="glass-panel p-3.5 rounded-xl text-left border border-gym-border/60">
                <div className="flex items-center gap-1.5 text-gym-lime mb-1">
                  <Dumbbell className="w-4 h-4" />
                  <span className="font-bold text-[11px] uppercase text-slate-300">Equipment</span>
                </div>
                <p className="text-white font-extrabold text-xs sm:text-sm">Quality Gear</p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl text-left border border-gym-border/60">
                <div className="flex items-center gap-1.5 text-gym-lime mb-1">
                  <Star className="w-4 h-4 fill-gym-lime" />
                  <span className="font-bold text-[11px] uppercase text-slate-300">Reputation</span>
                </div>
                <p className="text-white font-extrabold text-xs sm:text-sm">5.0 / 5.0 Rating</p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl text-left border border-gym-border/60">
                <div className="flex items-center gap-1.5 text-gym-lime mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-bold text-[11px] uppercase text-slate-300">Environment</span>
                </div>
                <p className="text-white font-extrabold text-xs sm:text-sm">Comfortable & Clean</p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl text-left border border-gym-border/60">
                <div className="flex items-center gap-1.5 text-gym-lime mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="font-bold text-[11px] uppercase text-slate-300">Location</span>
                </div>
                <p className="text-white font-extrabold text-xs sm:text-sm">Sector 69, Gurugram</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: DESKTOP-ONLY ANIMATED PICTURE SHOWCASE (Hidden on mobile, visible on lg+) */}
          <div className="hidden lg:block lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Outer floating physics container */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative"
              >
                {/* Multi-layered Glowing Aura */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-gym-lime/30 via-gym-lime/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

                {/* Main Image Frame */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-gym-lime/40 bg-gym-card shadow-[0_20px_50px_rgba(204,255,0,0.18)] group">
                  <div className="aspect-[4/5] xl:aspect-[3/4] w-full overflow-hidden bg-gym-surface relative">
                    <img
                      src="/images/gym-hero-desktop.jpg"
                      alt="THE GYM Modern Fitness Center Interior"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      loading="eager"
                    />

                    {/* Gradient overlays for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gym-bg via-transparent to-black/30 pointer-events-none" />
                    
                    {/* Top live pulse tag */}
                    <div className="absolute top-5 left-5 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-gym-lime/50 text-xs font-black text-white shadow-xl">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gym-lime opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gym-lime" />
                      </span>
                      <span className="tracking-wider">THE GYM • LIVE FLOOR</span>
                    </div>

                    {/* Overlay Center Accent */}
                    <div className="absolute top-5 right-5 z-10 p-2.5 rounded-xl bg-gym-lime/90 backdrop-blur-md text-black font-black shadow-lg">
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    </div>

                    {/* Bottom floating details card inside image */}
                    <div className="absolute bottom-5 inset-x-5 z-10 p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-gym-border/80 shadow-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-gym-lime flex items-center justify-center text-black font-black">
                            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div>
                            <h4 className="font-heading font-black text-white text-sm">Quality Gym Equipment</h4>
                            <p className="text-[11px] text-slate-400">Comfortable workout atmosphere</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-gym-lime/20 text-gym-lime border border-gym-lime/30 text-[10px] font-black uppercase">
                          Sector 69
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gym-border/50 text-center">
                        <div className="p-1.5 rounded-lg bg-gym-surface/80">
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Google Rating</p>
                          <p className="text-xs font-black text-gym-lime">5.0 ★ (9 Reviews)</p>
                        </div>
                        <div className="p-1.5 rounded-lg bg-gym-surface/80">
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Environment</p>
                          <p className="text-xs font-black text-white">Clean & Supportive</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Floating animated side pill badge (Offset) */}
                <motion.div
                  animate={{ y: [6, -6, 6] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-6 z-20 hidden xl:flex items-center gap-2.5 p-3 rounded-xl bg-gym-surface/95 backdrop-blur-md border border-gym-lime/40 shadow-glow-lime-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-gym-lime/20 text-gym-lime flex items-center justify-center font-bold">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-white">Modern Fitness Center</p>
                    <p className="text-[10px] text-gym-textMuted">Badshahpur, Gurugram</p>
                  </div>
                </motion.div>

              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
