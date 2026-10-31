import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public pages
import { HomePage } from './pages/website/HomePage';
import { AboutPage } from './pages/website/AboutPage';
import { MembershipPlansPage } from './pages/website/MembershipPlansPage';
import { WorkoutProgramsPage } from './pages/website/WorkoutProgramsPage';
import { WhyChooseUsPage } from './pages/website/WhyChooseUsPage';
import { LocationPage } from './pages/website/LocationPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ScrollToTop } from './components/common/ScrollToTop';

// Customer pages
import { CustomerLayout } from './components/customer/CustomerLayout';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerAttendance } from './pages/customer/CustomerAttendance';
import { CustomerFees } from './pages/customer/CustomerFees';
import { CustomerWorkouts } from './pages/customer/CustomerWorkouts';
import { CustomerProfile } from './pages/customer/CustomerProfile';

// Admin pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminMemberships } from './pages/admin/AdminMemberships';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminWorkouts } from './pages/admin/AdminWorkouts';
import { AdminNotifications } from './pages/admin/AdminNotifications';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          {/* Dedicated Public Website Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/plans" element={<MembershipPlansPage />} />
          <Route path="/workouts" element={<WorkoutProgramsPage />} />
          <Route path="/why-us" element={<WhyChooseUsPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Customer Portal Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerDashboard />} />
            <Route path="attendance" element={<CustomerAttendance />} />
            <Route path="fees" element={<CustomerFees />} />
            <Route path="workouts" element={<CustomerWorkouts />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>

          {/* Protected Admin Operations Portal Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireStaff>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="plans" element={<AdminMemberships />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="workouts" element={<AdminWorkouts />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
