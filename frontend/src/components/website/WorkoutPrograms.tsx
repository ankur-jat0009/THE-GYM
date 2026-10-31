import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Clock, Flame, Activity, Layers, Zap, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { WorkoutCategory, WorkoutPlan } from '../../types';
import { api } from '../../services/api';

const DEFAULT_CATEGORIES: WorkoutCategory[] = [
  { id: '1', name: 'Fat Loss', slug: 'fat-loss', description: 'Metabolic circuit training & high calorie burn.', display_order: 1, plans_count: 2 },
  { id: '2', name: 'Muscle Gain', slug: 'muscle-gain', description: 'Hypertrophy bodybuilding splits & progressive overload.', display_order: 2, plans_count: 2 },
  { id: '3', name: 'Strength Training', slug: 'strength-training', description: 'Heavy compound lifts & power progression.', display_order: 3, plans_count: 1 },
  { id: '4', name: 'General Fitness', slug: 'general-fitness', description: 'Functional conditioning & cardiovascular longevity.', display_order: 4, plans_count: 1 },
  { id: '5', name: 'Beginner Workout', slug: 'beginner-workout', description: 'Safe introduction to equipment and core mechanics.', display_order: 5, plans_count: 2 },
];

export const WorkoutPrograms: React.FC = () => {
  const [categories, setCategories] = useState<WorkoutCategory[]>(DEFAULT_CATEGORIES);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('fat-loss');
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get<WorkoutCategory[]>('/workouts/categories');
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeCategorySlug) return;
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await api.get<WorkoutPlan[]>(`/workouts/plans?category_slug=${activeCategorySlug}`);
        setPlans(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [activeCategorySlug]);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'fat-loss':
        return <Flame className="w-4 h-4" />;
      case 'muscle-gain':
        return <Dumbbell className="w-4 h-4" />;
      case 'strength-training':
        return <Zap className="w-4 h-4" />;
      case 'general-fitness':
        return <Heart className="w-4 h-4" />;
      case 'beginner-workout':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <section id="workouts" className="py-24 bg-gym-surface/40 border-t border-gym-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase tracking-wider mb-4">
            <Activity className="w-3.5 h-3.5" />
            Curated Training Programs
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
            STRUCTURED WORKOUT REGIMENS
          </h2>
          <p className="text-slate-400 mt-4 text-sm sm:text-base">
            Evidence-based split routines designed for real athletic performance, strength, and transformation.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gym-lime text-black shadow-glow-lime-sm scale-105'
                    : 'bg-gym-card text-slate-300 hover:text-white border border-gym-border hover:border-gym-lime/30'
                }`}
              >
                {getCategoryIcon(cat.slug)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Category Routine Content */}
        {loading ? (
          <div className="h-64 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
        ) : plans.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-400 bg-gym-card rounded-2xl border border-gym-border">
            No routines posted for this category yet. Inquire at the front desk!
          </div>
        ) : (
          <div className="space-y-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl bg-gym-card border border-gym-border p-6 sm:p-8 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gym-border/70">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-heading font-black text-2xl text-white tracking-wide">
                        {plan.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-gym-surface text-gym-lime border border-gym-lime/30 text-[11px] font-bold uppercase">
                        {plan.difficulty_level}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gym-surface border border-gym-border">
                      <Clock className="w-4 h-4 text-gym-lime" />
                      <span>{plan.duration_weeks} Weeks Plan</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gym-surface border border-gym-border">
                      <Layers className="w-4 h-4 text-gym-lime" />
                      <span>{plan.exercises.length} Exercises</span>
                    </div>
                  </div>
                </div>

                {/* Exercises Table / Grid */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gym-lime" />
                    <span>Exercise Routine & Weekly Schedule:</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plan.exercises.map((ex, eIdx) => (
                      <div
                        key={ex.id || eIdx}
                        className="p-4 rounded-xl bg-gym-surface border border-gym-border/60 hover:border-gym-lime/30 transition-colors"
                      >
                        <div className="text-[10px] font-bold text-gym-lime uppercase tracking-wider mb-1">
                          {ex.day_name}
                        </div>
                        <h5 className="font-bold text-white text-sm mb-2">{ex.exercise_name}</h5>
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-gym-card text-white font-mono font-semibold">
                            {ex.sets} Sets
                          </span>
                          <span className="px-2 py-0.5 rounded bg-gym-card text-gym-lime font-mono font-semibold">
                            {ex.reps}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {ex.rest_seconds}s Rest
                          </span>
                        </div>
                        {ex.instructions && (
                          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                            {ex.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
