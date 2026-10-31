import React, { useEffect, useState } from 'react';
import {
  Dumbbell,
  Plus,
  Layers,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
} from 'lucide-react';
import { WorkoutCategory, WorkoutPlan } from '../../types';
import { api } from '../../services/api';

export const AdminWorkouts: React.FC = () => {
  const [categories, setCategories] = useState<WorkoutCategory[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

  // Customers for assignment
  const [customers, setCustomers] = useState<any[]>([]);
  const [assignedUserId, setAssignedUserId] = useState('');
  const [assignNotes, setAssignNotes] = useState('');

  // Create form
  const [planForm, setPlanForm] = useState({
    category_id: '',
    title: '',
    description: '',
    difficulty_level: 'Beginner',
    duration_weeks: 4,
  });

  const [exercises, setExercises] = useState<
    { day_name: string; exercise_name: string; sets: number; reps: string; rest_seconds: number; instructions: string }[]
  >([
    { day_name: 'Day 1: Upper Body', exercise_name: 'Dumbbell Bench Press', sets: 3, reps: '10-12 reps', rest_seconds: 60, instructions: 'Keep elbows at 45 degrees' },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchWorkoutData = async () => {
    try {
      setLoading(true);
      const [cats, plns, usrs] = await Promise.all([
        api.get<WorkoutCategory[]>('/workouts/categories'),
        api.get<WorkoutPlan[]>('/workouts/plans'),
        api.get<{ items: any[] }>('/admin/users?limit=100'),
      ]);
      setCategories(cats);
      setPlans(plns);
      setCustomers(usrs.items || []);
      if (cats.length > 0 && !planForm.category_id) {
        setPlanForm((prev) => ({ ...prev, category_id: cats[0].id }));
      }
      if (usrs.items.length > 0 && !assignedUserId) {
        setAssignedUserId(usrs.items[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutData();
  }, []);

  const addExerciseRow = () => {
    setExercises([
      ...exercises,
      { day_name: 'Day 2: Lower Body', exercise_name: '', sets: 3, reps: '10-12 reps', rest_seconds: 60, instructions: '' },
    ]);
  };

  const removeExerciseRow = (idx: number) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.title || !planForm.category_id) return;
    try {
      setSaving(true);
      setError(null);
      await api.post('/admin/workouts/plans', {
        ...planForm,
        exercises,
        is_active: true,
      });
      setCreateModalOpen(false);
      setSuccessMsg(`Workout routine '${planForm.title}' created successfully!`);
      fetchWorkoutData();
    } catch (err: any) {
      setError(err.message || 'Failed to create plan');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !assignedUserId) return;
    try {
      setSaving(true);
      setError(null);
      await api.post('/admin/workouts/assign', {
        user_id: assignedUserId,
        plan_id: selectedPlan.id,
        notes: assignNotes || null,
      });
      setAssignModalOpen(false);
      setSuccessMsg(`Assigned '${selectedPlan.title}' to member successfully!`);
    } catch (err: any) {
      setError(err.message || 'Failed to assign plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            WORKOUT PLANS & ROUTINES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build exercise splits, assign routines to gym members, and structure sets and repetitions.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setCreateModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime hover:bg-gym-limeHover flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Workout Plan</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-gym-lime/10 border border-gym-lime/30 text-gym-lime text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Plans List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className="p-6 sm:p-8 rounded-2xl bg-gym-card border border-gym-border shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gym-border">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase">
                      {p.category_name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-gym-surface text-gym-lime border border-gym-lime/30 text-[10px] font-bold uppercase">
                      {p.difficulty_level}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-xl text-white">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">{p.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-gym-surface text-xs font-mono font-bold text-slate-300 border border-gym-border">
                    {p.duration_weeks} Weeks • {p.exercises.length} Exercises
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlan(p);
                      setError(null);
                      setAssignModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-gym-lime text-black font-extrabold text-xs uppercase tracking-wider shadow-glow-lime-sm hover:bg-gym-limeHover transition-all flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assign to Member</span>
                  </button>
                </div>
              </div>

              {/* Exercises Preview */}
              <div className="mt-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Exercises Included:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {p.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-gym-surface border border-gym-border text-xs"
                    >
                      <span className="text-[10px] font-bold text-gym-lime block mb-0.5">
                        {ex.day_name}
                      </span>
                      <strong className="text-white block">{ex.exercise_name}</strong>
                      <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                        {ex.sets} Sets × {ex.reps} ({ex.rest_seconds}s rest)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Workout Plan Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-gym-surface border border-gym-border p-6 sm:p-8 shadow-2xl my-8">
            <h3 className="font-heading font-black text-xl text-white uppercase mb-4">
              Build New Workout Routine
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-400 text-xs border border-red-500/30">
                {error}
              </div>
            )}

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Fitness Category *
                  </label>
                  <select
                    value={planForm.category_id}
                    onChange={(e) => setPlanForm({ ...planForm, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Routine Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.title}
                    onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                    placeholder="e.g. 5-Day Powerbuilding Hypertrophy Split"
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={planForm.difficulty_level}
                    onChange={(e) => setPlanForm({ ...planForm, difficulty_level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={planForm.duration_weeks}
                    onChange={(e) => setPlanForm({ ...planForm, duration_weeks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Routine Description
                </label>
                <input
                  type="text"
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  placeholder="Target goals, volume recommendations and split structure"
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              {/* Dynamic Exercise Rows */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-white uppercase text-xs">
                    Exercise Routine Builder
                  </label>
                  <button
                    type="button"
                    onClick={addExerciseRow}
                    className="px-2.5 py-1 rounded bg-gym-card text-gym-lime text-[11px] font-bold border border-gym-border hover:bg-gym-surface"
                  >
                    + Add Exercise
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-gym-card border border-gym-border/80 grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-3">
                        <input
                          type="text"
                          required
                          value={ex.day_name}
                          onChange={(e) => {
                            const updated = [...exercises];
                            updated[i].day_name = e.target.value;
                            setExercises(updated);
                          }}
                          placeholder="Day 1: Chest"
                          className="w-full px-2 py-1.5 rounded-lg bg-gym-surface border border-gym-border text-white text-[11px]"
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="text"
                          required
                          value={ex.exercise_name}
                          onChange={(e) => {
                            const updated = [...exercises];
                            updated[i].exercise_name = e.target.value;
                            setExercises(updated);
                          }}
                          placeholder="Bench Press"
                          className="w-full px-2 py-1.5 rounded-lg bg-gym-surface border border-gym-border text-white text-[11px]"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => {
                            const updated = [...exercises];
                            updated[i].sets = Number(e.target.value);
                            setExercises(updated);
                          }}
                          placeholder="Sets"
                          className="w-full px-2 py-1.5 rounded-lg bg-gym-surface border border-gym-border text-white text-[11px]"
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="text"
                          value={ex.reps}
                          onChange={(e) => {
                            const updated = [...exercises];
                            updated[i].reps = e.target.value;
                            setExercises(updated);
                          }}
                          placeholder="10-12 reps"
                          className="w-full px-2 py-1.5 rounded-lg bg-gym-surface border border-gym-border text-white text-[11px]"
                        />
                      </div>

                      <div className="col-span-1 text-right">
                        {exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExerciseRow(i)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gym-border/60">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gym-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gym-lime text-black font-extrabold uppercase shadow-glow-lime-sm"
                >
                  {saving ? 'Creating...' : 'Create Routine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Routine Modal */}
      {assignModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gym-surface border border-gym-border p-6 shadow-2xl">
            <h3 className="font-heading font-black text-xl text-white uppercase mb-1">
              Assign Routine to Member
            </h3>
            <p className="text-xs text-gym-lime font-bold mb-4">{selectedPlan.title}</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-400 text-xs border border-red-500/30">
                {error}
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Select Customer *
                </label>
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Coach Guidance Notes
                </label>
                <input
                  type="text"
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="e.g. Focus on progressive overload and bench pause"
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gym-border/60">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gym-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gym-lime text-black font-extrabold uppercase shadow-glow-lime-sm"
                >
                  {saving ? 'Assigning...' : 'Assign Routine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
