import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MessProvider } from './context/MessContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';

// Immediate load for entry pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Lazy load interior & heavy pages for fast initial page load
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MembersPage = lazy(() => import('./pages/MembersPage').then(m => ({ default: m.MembersPage })));
const MealsPage = lazy(() => import('./pages/MealsPage').then(m => ({ default: m.MealsPage })));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const DepositsPage = lazy(() => import('./pages/DepositsPage').then(m => ({ default: m.DepositsPage })));
const SettlementPage = lazy(() => import('./pages/SettlementPage').then(m => ({ default: m.SettlementPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const MySummaryPage = lazy(() => import('./pages/MySummaryPage').then(m => ({ default: m.MySummaryPage })));
const ActivityPage = lazy(() => import('./pages/ActivityPage').then(m => ({ default: m.ActivityPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const BazarPlannerPage = lazy(() => import('./pages/BazarPlannerPage').then(m => ({ default: m.BazarPlannerPage })));
const PreviousMonthPage = lazy(() => import('./pages/PreviousMonthPage').then(m => ({ default: m.PreviousMonthPage })));
const AllMonthsPage = lazy(() => import('./pages/AllMonthsPage').then(m => ({ default: m.AllMonthsPage })));
const DatabaseViewerPage = lazy(() => import('./pages/DatabaseViewerPage').then(m => ({ default: m.DatabaseViewerPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const UnauthorizedPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.UnauthorizedPage })));

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const isMessDeleted = typeof localStorage !== 'undefined' && localStorage.getItem('smm_active_mess_deleted') === 'true';
  const hasMess = typeof localStorage !== 'undefined' && Boolean(localStorage.getItem('smm_mess_data_v2'));

  if (!user || isMessDeleted || !hasMess) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Super Admin Route Guard
const AdminProtectedRoute = ({ children }) => {
  const { isSuperAdminAuthenticated } = useAuth();
  if (!isSuperAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Direct /admin Route: Shows AdminLoginPage if not logged in, or AdminDashboardPage if logged in
const AdminIndexRoute = () => {
  const { isSuperAdminAuthenticated } = useAuth();
  return isSuperAdminAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLoginPage />;
};

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <MessProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Authenticated Operations */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/meals" element={<MealsPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/deposits" element={<DepositsPage />} />
                <Route path="/settlement" element={<SettlementPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/my-summary" element={<MySummaryPage />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/bazar-planner" element={<BazarPlannerPage />} />
                <Route path="/previous-month" element={<PreviousMonthPage />} />
                <Route path="/all-months" element={<AllMonthsPage />} />
                <Route path="/database" element={<DatabaseViewerPage />} />
              </Route>

              {/* Super Admin Routes */}
              <Route path="/admin" element={<AdminIndexRoute />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardPage />
                  </AdminProtectedRoute>
                }
              />

              {/* Error Pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </MessProvider>
        </AuthProvider>
      </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
