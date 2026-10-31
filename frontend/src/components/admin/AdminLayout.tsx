import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  QrCode,
  CreditCard,
  Layers,
  Dumbbell,
  Bell,
  LogOut,
  Home,
  Menu,
  X,
  Shield,
  Scan,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { QRScannerModal } from './QRScannerModal';

export const AdminLayout: React.FC = () => {
  const { user, loading, logout, isStaff } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gym-lime border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Loading Admin Portal...
          </p>
        </div>
      </div>
    );
  }

  // If not logged in -> redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Protected route check for staff/admin role
  if (!isStaff) {
    return (
      <div className="min-h-screen bg-gym-bg flex items-center justify-center p-4">
        <div className="max-w-md p-8 rounded-2xl bg-gym-card border border-gym-border text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="font-heading font-black text-2xl text-white mb-2">Access Restricted</h2>
          <p className="text-xs text-slate-400 mb-6">
            You are signed in as a Customer. The Admin Operations portal requires Gym Staff or Admin privileges.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-gym-lime text-black font-bold text-xs uppercase"
            >
              Go to Customer Dashboard
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-6 py-2 rounded-xl bg-gym-surface text-slate-400 hover:text-white text-xs font-semibold"
            >
              Sign In with Staff Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Customer Management', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { label: 'QR Attendance Desk', path: '/admin/attendance', icon: <QrCode className="w-5 h-5" /> },
    { label: 'Plans & Pricing', path: '/admin/plans', icon: <Layers className="w-5 h-5" /> },
    { label: 'Fee & Payment Ledger', path: '/admin/payments', icon: <CreditCard className="w-5 h-5" /> },
    { label: 'Workout Routines', path: '/admin/workouts', icon: <Dumbbell className="w-5 h-5" /> },
    { label: 'Announcements', path: '/admin/notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gym-bg text-slate-100 flex flex-col md:flex-row">
      
      {/* Desktop Left Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gym-surface border-r border-gym-border p-5 shrink-0 justify-between">
        <div>
          {/* Header */}
          <Link to="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-gym-lime flex items-center justify-center text-black font-black shadow-glow-lime-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-black text-xl text-white tracking-wide block">THE GYM</span>
              <span className="text-[11px] font-bold text-gym-lime uppercase tracking-wider">Admin Office</span>
            </div>
          </Link>

          {/* Quick Scanner Action Button */}
          <button
            onClick={() => setScannerOpen(true)}
            className="w-full mb-6 py-3 px-4 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-lime-sm hover:bg-gym-limeHover transition-all hover:scale-[1.02]"
          >
            <Scan className="w-4 h-4 stroke-[2.5]" />
            <span>Launch QR Scanner</span>
          </button>

          {/* Nav links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-gym-lime text-black shadow-glow-lime-sm font-extrabold'
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

        {/* Bottom Staff Info & Logout */}
        <div className="pt-6 border-t border-gym-border/60 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-gym-card text-gym-lime border border-gym-border flex items-center justify-center text-xs font-bold">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
              <span className="text-[10px] text-gym-lime uppercase font-semibold">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Section */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Topbar */}
        <header className="h-16 px-4 md:px-8 border-b border-gym-border bg-gym-surface/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white md:hidden"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg text-white">THE GYM</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gym-lime/10 text-gym-lime font-bold border border-gym-lime/30">
                Staff Ops
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-gym-lime text-black font-heading font-black text-xs uppercase flex items-center gap-1.5 shadow-glow-lime-sm"
            >
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">Scan Customer QR</span>
              <span className="sm:hidden">Scan</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-gym-surface border-b border-gym-border p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold ${
                  location.pathname === item.path ? 'bg-gym-lime text-black' : 'text-slate-300'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Dynamic Admin Module View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

      </div>

      {/* Reusable QR Scanner Camera Modal */}
      {scannerOpen && (
        <QRScannerModal onClose={() => setScannerOpen(false)} />
      )}

    </div>
  );
};
