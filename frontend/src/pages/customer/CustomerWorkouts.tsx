import React, { useEffect, useState } from 'react';
import { Dumbbell, Clock, Layers, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { CustomerAssignedWorkout } from '../../types';
import { api } from '../../services/api';
import { formatDate } from '../../utils/formatters';

export const CustomerWorkouts: React.FC = () => {
  const [workoutData, setWorkoutData] = useState<CustomerAssignedWorkout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        const data = await api.get<CustomerAssignedWorkout>('/users/me/workouts');
        setWorkoutData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
          <div className="h-64 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
        </div>
      </div>
    );
  }

  const plan = workoutData?.plan;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
          MY ASSIGNED WORKOUT PLAN
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Follow your customized exercise splits, set targets, and repetition benchmarks.
        </p>
      </div>

      {!workoutData?.has_assignment || !plan ? (
        <div className="p-12 text-center rounded-2xl bg-gym-card border border-gym-border shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-gym-surface text-gym-lime flex items-center justify-center mx-auto mb-4 border border-gym-border">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-black text-xl text-white mb-2">
            No Workout Plan Assigned Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            Please ask our gym trainers or counter staff to assign a custom split based on your target category (Fat Loss, Muscle Gain, Strength, or General Fitness).
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Plan Header Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gym-card border border-gym-border relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase">
                    {plan.category_name || 'Fitness Plan'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-gym-surface text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase">
                    {plan.difficulty_level}
                  </span>
                </div>
                <h2 className="font-heading font-black text-3xl text-white tracking-wide">
                  {plan.title}
                </h2>
                {plan.description && (
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                    {plan.description}
                  </p>
                )}
                {workoutData.notes && (
                  <p className="text-xs text-yellow-300/90 mt-2 italic bg-yellow-500/10 p-2.5 rounded-lg border border-yellow-500/20 max-w-xl">
                    <strong>Coach Note:</strong> {workoutData.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 shrink-0">
                <div className="p-3 rounded-xl bg-gym-surface border border-gym-border text-center">
                  <span className="block text-[10px] text-slate-400 uppercase">Duration</span>
                  <span className="font-bold text-white text-sm">{plan.duration_weeks} Weeks</span>
                </div>
                <div className="p-3 rounded-xl bg-gym-surface border border-gym-border text-center">
                  <span className="block text-[10px] text-slate-400 uppercase">Exercises</span>
                  <span className="font-bold text-gym-lime text-sm">{plan.exercises.length} Drills</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exercise Split Grid */}
          <div>
            <h3 className="font-heading font-bold text-lg text-white mb-4 uppercase tracking-wider">
              Workout Routine Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.exercises.map((ex, idx) => (
                <div
                  key={ex.id || idx}
                  className="p-6 rounded-2xl bg-gym-card border border-gym-border hover:border-gym-lime/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-gym-lime uppercase tracking-wider">
                        {ex.day_name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        #{idx + 1}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-base text-white mb-3">
                      {ex.exercise_name}
                    </h4>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="p-2 rounded-lg bg-gym-surface border border-gym-border">
                        <span className="text-[10px] text-slate-400 block">Sets</span>
                        <span className="font-bold text-white text-xs">{ex.sets}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-gym-surface border border-gym-border">
                        <span className="text-[10px] text-slate-400 block">Target Reps</span>
                        <span className="font-bold text-gym-lime text-xs">{ex.reps}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-gym-surface border border-gym-border">
                        <span className="text-[10px] text-slate-400 block">Rest</span>
                        <span className="font-bold text-white text-xs">{ex.rest_seconds}s</span>
                      </div>
                    </div>

                    {ex.instructions && (
                      <p className="text-xs text-slate-400 leading-relaxed bg-gym-surface/40 p-3 rounded-xl border border-gym-border/40">
                        {ex.instructions}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
