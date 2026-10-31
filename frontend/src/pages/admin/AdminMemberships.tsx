import React, { useEffect, useState } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Check,
  Flame,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { MembershipPlan } from '../../types';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const AdminMemberships: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    duration_months: 1,
    duration_days: 30,
    price: 1500,
    description: '',
    features_input: '',
    is_popular: false,
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await api.get<MembershipPlan[]>('/admin/membership-plans');
      setPlans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      duration_months: 1,
      duration_days: 30,
      price: 1500,
      description: '',
      features_input: 'Complete Gym Floor Access\nLocker & Shower Access\nCardio & Strength Zone',
      is_popular: false,
      is_active: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      duration_months: plan.duration_months,
      duration_days: plan.duration_days,
      price: plan.price,
      description: plan.description || '',
      features_input: plan.features.join('\n'),
      is_popular: plan.is_popular,
      is_active: plan.is_active,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const features = formData.features_input
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload = {
        name: formData.name,
        duration_months: Number(formData.duration_months),
        duration_days: Number(formData.duration_days),
        price: Number(formData.price),
        description: formData.description,
        features,
        is_popular: formData.is_popular,
        is_active: formData.is_active,
      };

      if (editingPlan) {
        await api.patch(`/admin/membership-plans/${editingPlan.id}`, payload);
      } else {
        await api.post('/admin/membership-plans', payload);
      }

      setModalOpen(false);
      fetchPlans();
    } catch (err: any) {
      setError(err.message || 'Failed to save membership plan');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (plan: MembershipPlan) => {
    try {
      await api.patch(`/admin/membership-plans/${plan.id}`, { is_active: !plan.is_active });
      setPlans((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, is_active: !p.is_active } : p))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            MEMBERSHIP PLANS & PRICING
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure public website plans, adjust prices, edit features, and control plan visibility.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime hover:bg-gym-limeHover flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl p-6 flex flex-col justify-between border relative transition-all ${
                p.is_active
                  ? p.is_popular
                    ? 'bg-gym-card border-gym-lime shadow-glow-lime'
                    : 'bg-gym-card border-gym-border hover:border-gym-lime/40'
                  : 'bg-gym-surface/40 border-gym-border/40 opacity-60'
              }`}
            >
              {p.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gym-lime text-black text-[10px] font-black uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-black" />
                  Popular Badge
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-black text-lg text-white">
                    {p.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {p.is_active ? 'Visible on Site' : 'Hidden'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 min-h-[36px] line-clamp-2">
                  {p.description || 'Standard membership plan'}
                </p>

                <div className="my-5 pb-5 border-b border-gym-border/60">
                  <span className="font-heading font-black text-3xl text-white">
                    {formatCurrency(p.price)}
                  </span>
                  <span className="text-xs text-gym-lime font-bold block mt-0.5">
                    {p.duration_months} Month ({p.duration_days} Days)
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-gym-lime shrink-0 mt-0.5" />
                      <span className="leading-tight">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gym-border/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="flex-1 py-2 rounded-lg bg-gym-surface hover:bg-gym-card text-white border border-gym-border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 text-gym-lime" />
                  <span>Edit Plan</span>
                </button>

                <button
                  onClick={() => handleToggleActive(p)}
                  title={p.is_active ? 'Hide from public site' : 'Show on public site'}
                  className="p-2 rounded-lg bg-gym-surface text-slate-300 hover:text-white border border-gym-border"
                >
                  {p.is_active ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Plan Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-gym-surface border border-gym-border p-6 shadow-2xl">
            <h3 className="font-heading font-black text-xl text-white uppercase mb-4">
              {editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create New Membership Plan'}
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-400 text-xs border border-red-500/30">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Quarterly Pro"
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Months</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_months}
                    onChange={(e) => setFormData({ ...formData, duration_months: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Days</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Plan Summary / Bio</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short marketing headline for this membership"
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Included Features / Perks (One feature per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.features_input}
                  onChange={(e) => setFormData({ ...formData, features_input: e.target.value })}
                  placeholder="Full gym access&#10;Locker room access&#10;Cardio zone&#10;1 Free consultation"
                  className="w-full px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="rounded text-gym-lime focus:ring-0"
                  />
                  <span className="font-bold text-white">Highlight as "Popular" Plan</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-gym-lime focus:ring-0"
                  />
                  <span className="font-bold text-white">Publish on Public Site</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gym-border/60">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gym-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gym-lime text-black font-extrabold uppercase shadow-glow-lime-sm"
                >
                  {saving ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
