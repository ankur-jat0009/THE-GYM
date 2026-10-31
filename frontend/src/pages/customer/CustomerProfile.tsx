import React, { useState } from 'react';
import { User, Lock, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatDate } from '../../utils/formatters';

export const CustomerProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Male',
    date_of_birth: user?.date_of_birth || '',
  });

  const [passData, setPassData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      setProfileSuccess(null);
      setProfileError(null);
      await api.patch('/users/me', formData);
      await refreshUser();
      setProfileSuccess('Profile details updated successfully!');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new_password !== passData.confirm_password) {
      setPassError('New passwords do not match');
      return;
    }
    try {
      setPassLoading(true);
      setPassSuccess(null);
      setPassError(null);
      await api.post('/users/me/change-password', {
        old_password: passData.old_password,
        new_password: passData.new_password,
      });
      setPassSuccess('Password changed successfully!');
      setPassData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      setPassError(err.message || 'Failed to change password.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
          MY ACCOUNT PROFILE
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal gym details and update security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Personal Details Form */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gym-card border border-gym-border shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gym-border">
            <User className="w-5 h-5 text-gym-lime" />
            <h3 className="font-heading font-bold text-lg text-white">
              Personal Information
            </h3>
          </div>

          {profileSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-gym-lime/10 border border-gym-lime/20 text-gym-lime text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-sm focus:outline-none focus:border-gym-lime"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl bg-gym-surface/50 border border-gym-border/60 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-sm focus:outline-none focus:border-gym-lime"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Gender
                </label>
                <select
                  value={formData.gender || 'Male'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-sm focus:outline-none focus:border-gym-lime"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-sm focus:outline-none focus:border-gym-lime"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="w-full py-3 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gym-limeHover transition-all shadow-glow-lime-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gym-card border border-gym-border shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gym-border">
            <Lock className="w-5 h-5 text-gym-lime" />
            <h3 className="font-heading font-bold text-lg text-white">
              Security & Password
            </h3>
          </div>

          {passSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-gym-lime/10 border border-gym-lime/20 text-gym-lime text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{passSuccess}</span>
            </div>
          )}

          {passError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passData.old_password}
                onChange={(e) => setPassData({ ...passData, old_password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-sm focus:outline-none focus:border-gym-lime"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={passData.new_password}
                onChange={(e) => setPassData({ ...passData, new_password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-sm focus:outline-none focus:border-gym-lime"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={passData.confirm_password}
                onChange={(e) => setPassData({ ...passData, confirm_password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-sm focus:outline-none focus:border-gym-lime"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passLoading}
                className="w-full py-3 rounded-xl bg-gym-surface hover:bg-gym-card text-white border border-gym-border hover:border-gym-lime/40 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-gym-lime" />
                <span>{passLoading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gym-border/60 text-xs text-slate-400">
            <strong>Member since:</strong> {formatDate(user?.created_at)}
          </div>
        </div>

      </div>
    </div>
  );
};
