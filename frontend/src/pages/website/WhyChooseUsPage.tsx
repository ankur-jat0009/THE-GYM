import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { WhyChooseUs } from '../../components/website/WhyChooseUs';
import { TestimonialsSection } from '../../components/website/TestimonialsSection';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Dumbbell, Star, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WhyChooseUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gym-bg text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Cinematic Header with Visible Community Gym Photography */}
        <section className="relative py-24 sm:py-28 bg-gym-surface/40 border-b border-gym-border/80 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/why-us-hero.jpg"
              alt="THE GYM Fitness Community"
              className="w-full h-full object-cover object-center opacity-65 scale-105"
              loading="eager"
            />
            {/* Cinematic dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-gym-bg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/50 text-xs font-bold text-white uppercase tracking-wider mb-5 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>The Gym Difference • Verified 5.0 Google Rating</span>
            </div>
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              WHY CHOOSE THE GYM
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 mt-4 leading-relaxed font-normal drop-shadow-md">
              Explore why everyday lifters, beginners, and fitness enthusiasts in Badshahpur choose THE GYM for their physical strength, health, and athletic progress.
            </p>
          </div>
        </section>

        {/* 6 Colorful Advantage Cards */}
        <WhyChooseUs />

        {/* Floor Standards & Community Visual Feature */}
        <section className="py-20 bg-gym-surface/20 border-t border-gym-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Photo Showcase Frame */}
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden border-2 border-gym-lime/40 shadow-2xl group bg-gym-card">
                  <div className="aspect-[16/11] overflow-hidden relative">
                    <img
                      src="/images/about-gym.jpg"
                      alt="THE GYM Badshahpur Training Atmosphere"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-gym-lime/40 text-xs font-bold text-white shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-gym-lime animate-pulse" />
                      <span>NO-INTIMIDATION ZONE</span>
                    </div>

                    <div className="absolute bottom-4 inset-x-4 z-10 p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-gym-border/80 flex items-center justify-between">
                      <div>
                        <h4 className="font-heading font-black text-white text-base">Supportive Atmosphere</h4>
                        <p className="text-xs text-slate-300">Clean, safe, and focused on your goals</p>
                      </div>
                      <span className="px-3 py-1 rounded bg-gym-lime text-black text-xs font-black uppercase">
                        Sector 69
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Pillars */}
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase tracking-wider mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Built Different
                  </div>
                  <h3 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase leading-tight">
                    AUTHENTIC TRAINING STANDARDS FOR EVERY LIFTER
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                    We designed THE GYM around what truly matters: heavy weights, sturdy racks, proper ventilation, and respectful members who support each other.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="p-4 rounded-xl bg-gym-card border border-gym-border flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-gym-lime shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-sm">Comfortable & Air-Cooled Space</h4>
                      <p className="text-xs text-slate-400 mt-0.5">High ceilings, great airflow, and regular hygiene maintenance throughout the floor.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gym-card border border-gym-border flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-gym-lime shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-sm">Smart Mobile PWA Integration</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Contactless QR attendance and downloadable fee payment receipts at your fingertips.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gym-card border border-gym-border flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-gym-lime shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-sm">Transparent Pricing Policy</h4>
                      <p className="text-xs text-slate-400 mt-0.5">No pushy sales tactics or hidden fees. What you see is what you pay.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/plans"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime hover:bg-gym-limeHover transition-all hover:scale-105"
                  >
                    <span>View Membership Options</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Verified Google Member Reviews */}
        <TestimonialsSection />

        {/* Bottom CTA */}
        <section className="py-16 bg-gym-bg border-t border-gym-border/60 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-heading font-black text-3xl text-white uppercase mb-4">
              START YOUR TRANSFORMATION TODAY
            </h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
              Join THE GYM and experience our modern equipment and supportive community in Badshahpur, Sector 69.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime hover:bg-gym-limeHover transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/location"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gym-surface hover:bg-gym-card text-white border border-gym-border text-xs font-bold uppercase tracking-wider transition-all"
              >
                Find Us on Map
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
