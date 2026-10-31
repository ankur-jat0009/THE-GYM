import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requireStaff?: boolean;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireStaff = false,
  requireAdmin = false,
}) => {
  const { user, token, loading, isStaff, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gym-lime border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Loading THE GYM Portal...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to /login
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Requires staff / admin role
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gym-bg flex items-center justify-center p-4">
        <div className="max-w-md p-8 rounded-2xl bg-gym-card border border-gym-border text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="font-heading font-black text-2xl text-white mb-2">Admin Access Required</h2>
          <p className="text-xs text-slate-400 mb-6">
            This module requires Super Admin privileges.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  if (requireStaff && !isStaff) {
    return (
      <div className="min-h-screen bg-gym-bg flex items-center justify-center p-4">
        <div className="max-w-md p-8 rounded-2xl bg-gym-card border border-gym-border text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="font-heading font-black text-2xl text-white mb-2">Staff Access Only</h2>
          <p className="text-xs text-slate-400 mb-6">
            You are logged in as a Customer. The Admin Operations portal requires Gym Staff or Admin privileges.
          </p>
          <a
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl bg-gym-lime text-black font-bold text-xs uppercase"
          >
            Go to Customer Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};
