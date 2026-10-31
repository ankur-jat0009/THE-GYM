import React, { useEffect, useState } from 'react';
import {
  Bell,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import { api } from '../../services/api';
import { formatDateTime } from '../../utils/formatters';

export const AdminNotifications: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    user_id: '', // Empty means broadcast to all
    title: '',
    message: '',
    type: 'ANNOUNCEMENT',
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, nRes] = await Promise.all([
        api.get<{ items: any[] }>('/admin/users?limit=100'),
        api.get<{ items: any[] }>('/notifications'),
      ]);
      setCustomers(uRes.items || []);
      setNotifications(nRes.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    try {
      setSending(true);
      setError(null);
      setSuccess(null);
      await api.post('/admin/notifications', {
        user_id: form.user_id || null,
        title: form.title,
        message: form.message,
        type: form.type,
      });
      setSuccess('Notification dispatched successfully!');
      setForm({ user_id: '', title: '', message: '', type: 'ANNOUNCEMENT' });
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
          GYM NOTIFICATIONS & ANNOUNCEMENTS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Broadcast gym equipment updates or dispatch direct payment and renewal alerts to member dashboards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Create Notification Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gym-card border border-gym-border shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gym-border">
            <Megaphone className="w-5 h-5 text-gym-lime" />
            <h3 className="font-heading font-bold text-lg text-white">
              Dispatch In-App Notification
            </h3>
          </div>

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-gym-lime/10 border border-gym-lime/30 text-gym-lime text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">
                Recipient Target
              </label>
              <select
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
              >
                <option value="">📢 Broadcast to All Members</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    👤 {c.full_name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">
                Notification Category
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
              >
                <option value="ANNOUNCEMENT">Gym Announcement</option>
                <option value="PAYMENT_REMINDER">Payment Due Reminder</option>
                <option value="EXPIRY_REMINDER">Membership Expiry Alert</option>
                <option value="WORKOUT_ASSIGNED">Workout Plan Update</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">
                Notification Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. New Olympic Dumbbells in Strength Zone"
                className="w-full px-3 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1">
                Message Body *
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Details of the announcement or reminder..."
                className="w-full px-3 py-2.5 rounded-xl bg-gym-surface border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gym-limeHover transition-all shadow-glow-lime-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Sending...' : 'Send Notification'}</span>
            </button>
          </form>
        </div>

        {/* Recent Announcements Feed */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gym-card border border-gym-border shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gym-border">
            <Bell className="w-5 h-5 text-gym-lime" />
            <h3 className="font-heading font-bold text-lg text-white">
              Recent Sent Announcements
            </h3>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">Loading feed...</p>
          ) : notifications.length === 0 ? (
            <p className="text-xs text-slate-400">No announcements dispatched yet.</p>
          ) : (
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl bg-gym-surface border border-gym-border text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{n.title}</span>
                    <span className="px-2 py-0.5 rounded bg-gym-card text-gym-lime text-[10px] font-mono">
                      {n.type}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{n.message}</p>
                  <p className="text-[10px] text-slate-500 pt-1">
                    Sent {formatDateTime(n.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
