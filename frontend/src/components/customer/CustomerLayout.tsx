import React from 'react';
import { Link, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  QrCode,
  CreditCard,
  Dumbbell,
  User,
  LogOut,
  Shield,
  Home,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../common/NotificationBell';

export const CustomerLayout: React.FC = () => {
  const { user, loading, logout, isStaff } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gym-lime border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Loading Customer Portal...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'My Attendance', path: '/dashboard/attendance', icon: <QrCode className="w-5 h-5" /> },
    { label: 'My Fees', path: '/dashboard/fees', icon: <CreditCard className="w-5 h-5" /> },
    { label: 'My Workout', path: '/dashboard/workouts', icon: <Dumbbell className="w-5 h-5" /> },
    { label: 'My Profile', path: '/dashboard/profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gym-bg text-slate-100 flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gym-surface border-r border-gym-border/80 p-5 shrink-0 justify-between">
        <div>
          {/* Brand header */}
          <Link to="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-gym-lime flex items-center justify-center text-black shadow-glow-lime-sm group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-heading font-black text-xl text-white tracking-wide block">THE GYM</span>
              <span className="text-[11px] font-bold text-gym-lime">Member Portal</span>
            </div>
          </Link>

          {/* Member Card preview */}
          <div className="p-3.5 rounded-xl bg-gym-card border border-gym-border mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gym-lime/20 text-gym-lime border border-gym-lime/40 flex items-center justify-center font-black text-sm">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.full_name}</p>
                <p className="text-[11px] text-gym-textMuted font-mono truncate">{user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    active
                      ? 'bg-gym-lime text-black shadow-glow-lime-sm'
                      : 'text-slate-400 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-gym-border/60 space-y-2">
          {isStaff && (
            <Link
              to="/admin"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gym-card text-gym-lime border border-gym-lime/30 text-xs font-bold hover:bg-gym-lime/10 transition-colors w-full"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Office</span>
            </Link>
          )}

          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Public Website</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-8 border-b border-gym-border/80 bg-gym-surface/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gym-lime flex items-center justify-center text-black font-black">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="font-heading font-black text-lg text-white">THE GYM</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <h2 className="text-sm font-bold text-slate-300">
              Welcome back, <span className="text-white font-black">{user?.full_name}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <Link
              to="/dashboard/attendance"
              className="px-3.5 py-1.5 rounded-lg bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-lime-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Pass</span>
            </Link>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gym-surface border-t border-gym-border px-2 py-1 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1.5 px-3 rounded-lg text-[10px] font-bold transition-colors ${
                active ? 'text-gym-lime' : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-lg ${active ? 'bg-gym-lime/10' : ''}`}>
                {item.icon}
              </div>
              <span className="mt-0.5">{item.label.replace('My ', '')}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};
