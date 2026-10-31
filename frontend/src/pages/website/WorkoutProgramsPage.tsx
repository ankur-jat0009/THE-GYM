import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { WorkoutPrograms } from '../../components/website/WorkoutPrograms';
import { Activity, Dumbbell, Flame, Zap, Heart, Sparkles, ArrowRight, Target, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkoutProgramsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gym-bg text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Cinematic Header with Visible Athletic Training Photography */}
        <section className="relative py-24 sm:py-28 bg-gym-surface/40 border-b border-gym-border/80 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/workout-hero.jpg"
              alt="THE GYM Workout Programs"
              className="w-full h-full object-cover object-center opacity-65 scale-105"
              loading="eager"
            />
            {/* Cinematic dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-gym-bg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-purple-400/50 text-xs font-bold text-white uppercase tracking-wider mb-5 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Evidence-Based Routines • 5 Dedicated Categories</span>
            </div>
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              WORKOUT PROGRAMS & SPLITS
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 mt-4 leading-relaxed font-normal drop-shadow-md">
              Curated training splits for fat loss, muscle building, raw power, functional conditioning, and foundational lifting.
            </p>
          </div>
        </section>

        {/* 5-Category Interactive Workout Programs */}
        <WorkoutPrograms />

        {/* Visual Category Training Highlights */}
        <section className="py-20 bg-gym-surface/20 border-t border-gym-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase tracking-wider mb-3">
                <Target className="w-3.5 h-3.5" />
                Targeted Methodologies
              </div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase">
                TRAIN WITH PURPOSE & SCIENCE
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Every category is designed with proper volume, set-and-rep periodization, and recovery intervals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group rounded-2xl overflow-hidden bg-gym-card border border-gym-border hover:border-amber-400/40 transition-all shadow-xl">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src="/images/gallery-cardio.jpg"
                    alt="Fat Loss Conditioning"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-amber-400 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-amber-400/30">
                    Fat Loss & HIIT
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-heading font-bold text-white text-sm">Metabolic Conditioning</h4>
                  <p className="text-xs text-slate-400 mt-1">High-EPOC circuit intervals and cardio to maximize calorie burn.</p>
                </div>
              </div>

              <div className="group rounded-2xl overflow-hidden bg-gym-card border border-gym-border hover:border-gym-lime/40 transition-all shadow-xl">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src="/images/gallery-dumbbells.jpg"
                    alt="Muscle Gain Split"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-gym-lime px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-gym-lime/30">
                    Muscle Gain (PPL)
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-heading font-bold text-white text-sm">Hypertrophy Splits</h4>
                  <p className="text-xs text-slate-400 mt-1">Progressive overload across push, pull, and leg movement patterns.</p>
                </div>
              </div>

              <div className="group rounded-2xl overflow-hidden bg-gym-card border border-gym-border hover:border-cyan-400/40 transition-all shadow-xl">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src="/images/gallery-strength.jpg"
                    alt="Strength Training 5x5"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-cyan-400 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-400/30">
                    5x5 Power Strength
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-heading font-bold text-white text-sm">Compound Barbell Lifts</h4>
                  <p className="text-xs text-slate-400 mt-1">Squats, bench press, deadlifts, and overhead presses for raw power.</p>
                </div>
              </div>

              <div className="group rounded-2xl overflow-hidden bg-gym-card border border-gym-border hover:border-purple-400/40 transition-all shadow-xl">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src="/images/gallery-functional.jpg"
                    alt="Functional & Beginners"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-purple-400 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-purple-400/30">
                    Functional & Beginner
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-heading font-bold text-white text-sm">Foundation Mechanics</h4>
                  <p className="text-xs text-slate-400 mt-1">Safe machine setups, postural correction, and functional agility.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training Principles Banner */}
        <section className="py-16 bg-gym-bg border-t border-gym-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-gym-surface via-gym-card to-gym-surface border border-gym-border p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gym-lime/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase mb-4">
                READY TO FOLLOW A STRUCTURED SPLIT?
              </h3>
              <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 mb-8 leading-relaxed">
                Create your member account to access assigned routines, log your workouts, and track consistency with our smart attendance pass.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime hover:bg-gym-limeHover transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                  <span>Join THE GYM</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link
                  to="/plans"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gym-surface hover:bg-gym-card text-white border border-gym-border text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Explore Memberships
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
