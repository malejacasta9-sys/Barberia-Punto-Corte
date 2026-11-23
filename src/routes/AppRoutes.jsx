import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/public/HomePage';
import { BookingWizardPage } from '../pages/public/BookingWizardPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { MyAppointmentsPage } from '../pages/client/MyAppointmentsPage';
import { ProfessionalAgendaPage } from '../pages/professional/ProfessionalAgendaPage';
import { CashierDeskPage } from '../pages/cashier/CashierDeskPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ProtectedRoute } from './ProtectedRoute';
import { ROLES } from '../utils/constants';

export function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/agendar" element={<BookingWizardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Rutas Protegidas - Cliente */}
      <Route
        path="/mis-citas"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENTE, ROLES.ADMIN, ROLES.CAJERA]}>
            <MyAppointmentsPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas Protegidas - Profesional */}
      <Route
        path="/agenda-profesional"
        element={
          <ProtectedRoute allowedRoles={[ROLES.PROFESIONAL, ROLES.ADMIN]}>
            <ProfessionalAgendaPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas Protegidas - Cajera */}
      <Route
        path="/caja"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CAJERA, ROLES.ADMIN]}>
            <CashierDeskPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas Protegidas - Administradora */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
