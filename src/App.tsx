import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

// Role-Specific Dashboards
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { CommanderDashboard } from './pages/dashboards/CommanderDashboard';
import { AnalystDashboard } from './pages/dashboards/AnalystDashboard';
import { ResponderDashboard } from './pages/dashboards/ResponderDashboard';
import { AuditorDashboard } from './pages/dashboards/AuditorDashboard';
import { ViewerDashboard } from './pages/dashboards/ViewerDashboard';

// Audit event listener connector to synchronize AuthContext events to AppContext audit log
const AuditEventSync: React.FC = () => {
  const { recordAuditEntry } = useApp();

  useEffect(() => {
    const handleCustomAuditEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && recordAuditEntry) {
        recordAuditEntry(detail.action, detail.resource, detail.details);
      }
    };

    window.addEventListener('secops_audit_event', handleCustomAuditEvent);
    return () => window.removeEventListener('secops_audit_event', handleCustomAuditEvent);
  }, [recordAuditEntry]);

  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AuditEventSync />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/403" element={<UnauthorizedPage />} />

            {/* Protected Role-Specific Dashboards */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/incident-commander/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Incident Commander']}>
                  <CommanderDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analyst/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Security Analyst']}>
                  <AnalystDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/responder/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Responder']}>
                  <ResponderDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/auditor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Auditor']}>
                  <AuditorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/viewer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['Viewer']}>
                  <ViewerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback to Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
