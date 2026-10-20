import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MessProvider } from './context/MessContext';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { MembersPage } from './pages/MembersPage';
import { MealsPage } from './pages/MealsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { DepositsPage } from './pages/DepositsPage';
import { SettlementPage } from './pages/SettlementPage';
import { ReportsPage } from './pages/ReportsPage';
import { MySummaryPage } from './pages/MySummaryPage';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';
import { BazarPlannerPage } from './pages/BazarPlannerPage';
import { PreviousMonthPage } from './pages/PreviousMonthPage';
import { AllMonthsPage } from './pages/AllMonthsPage';
import { NotFoundPage, UnauthorizedPage } from './pages/NotFoundPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <MessProvider>
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
              </Route>

              {/* Error Pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MessProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
