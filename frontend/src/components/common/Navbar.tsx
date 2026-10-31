import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Membership Plans', path: '/plans' },
    { name: 'Workout Programs', path: '/workouts' },
    { name: 'Why Choose Us', path: '/why-us' },
    { name: 'Location', path: '/location' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-gym-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gym-lime flex items-center justify-center text-black shadow-glow-lime-sm transition-transform group-hover:scale-105">
              <Dumbbell className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-heading font-black text-2xl tracking-wider text-white">
                THE GYM
              </div>
              <p className="text-[10px] text-gym-textMuted tracking-widest uppercase font-medium">Sector 69 • Gurugram</p>
            </div>
          </Link>

          {/* Desktop Navigation Links to Dedicated Pages */}
          <div className="hidden md:flex items-center space-x-7 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-gym-lime font-bold border-b-2 border-gym-lime'
                      : 'text-slate-300 hover:text-gym-lime'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User CTA Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gym-surface hover:bg-gym-card text-white border border-gym-border text-sm font-semibold transition-all"
                >
                  <UserIcon className="w-4 h-4 text-gym-lime" />
                  <span>{user.full_name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-200 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-lg bg-gym-lime hover:bg-gym-limeHover text-black text-sm font-extrabold tracking-wide transition-all shadow-glow-lime-sm hover:scale-[1.02]"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-gym-surface focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gym-surface border-b border-gym-border px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-3 text-base font-semibold border-b border-gym-border/50 pb-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`transition-colors ${
                    isActive ? 'text-gym-lime font-bold' : 'text-slate-300 hover:text-gym-lime'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-gym-card text-white font-bold border border-gym-border flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-gym-lime" />
                  My Dashboard ({user.full_name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-2 text-center text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-gym-card text-white font-bold border border-gym-border text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 rounded-lg bg-gym-lime text-black font-extrabold text-sm shadow-glow-lime-sm"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
