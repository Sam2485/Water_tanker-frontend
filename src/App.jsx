// App.jsx (JavaScript + React Router v7)
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DemoSimulationProvider } from './context/DemoSimulationContext';

// Layouts
import { CitizenLayout } from './layouts/CitizenLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { RequestWaterPage } from './pages/citizen/RequestWaterPage';
import { RequestHistoryPage } from './pages/citizen/RequestHistoryPage';
import { TrackTankerPage } from './pages/citizen/TrackTankerPage';
import { DeliveryVerificationPage } from './pages/citizen/DeliveryVerificationPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminMapPage } from './pages/admin/AdminMapPage';
import { RequestManagementPage } from './pages/admin/RequestManagementPage';
import { TankerManagementPage } from './pages/admin/TankerManagementPage';
import { EmergencyControlPage } from './pages/admin/EmergencyControlPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { AuditLogPage } from './pages/admin/AuditLogPage';

// Authority Pages
import { AuthorityDashboard } from './pages/authority/AuthorityDashboard';

const AppRoutes = () => {
  const { role, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Root redirect */}
      <Route
        path="/"
        element={
          role === 'ADMIN' ? (
            <Navigate to="/admin/dashboard" replace />
          ) : role === 'AUTHORITY' ? (
            <Navigate to="/authority/dashboard" replace />
          ) : (
            <Navigate to="/citizen" replace />
          )
        }
      />

      {/* Citizen Portal */}
      <Route element={<CitizenLayout />}>
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/request" element={<RequestWaterPage />} />
        <Route path="/citizen/requests" element={<RequestHistoryPage />} />
        <Route path="/citizen/track/:assignmentId" element={<TrackTankerPage />} />
        <Route path="/citizen/delivery/:assignmentId" element={<DeliveryVerificationPage />} />
      </Route>

      {/* Admin Command Center */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/requests" element={<RequestManagementPage />} />
        <Route path="/admin/tankers" element={<TankerManagementPage />} />
        <Route path="/admin/map" element={<AdminMapPage />} />
        <Route path="/admin/emergencies" element={<EmergencyControlPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/audit" element={<AuditLogPage />} />
      </Route>

      {/* Water Authority Oversight */}
      <Route element={<AdminLayout />}>
        <Route path="/authority" element={<Navigate to="/authority/dashboard" replace />} />
        <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <DemoSimulationProvider>
            <AppRoutes />
          </DemoSimulationProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
