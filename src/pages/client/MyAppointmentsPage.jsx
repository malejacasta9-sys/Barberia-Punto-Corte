import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Clock, Scissors, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments } from '../../hooks/useAppointments';
import { AppointmentTable } from '../../components/appointments/AppointmentTable';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';

export function MyAppointmentsPage() {
  const { user, profile } = useAuth();
  const { appointments, loading, fetchClientAppointments, updateStatus } = useAppointments();

  useEffect(() => {
    fetchClientAppointments(user?.id || 'guest_client');
  }, [fetchClientAppointments, user]);

  const handleCancelAppointment = async (citaId) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      await updateStatus(citaId, 'cancelada');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-brand-400" />
            Mis Citas en Punto Corte
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historial y citas activas agendadas para <strong className="text-slate-200">{profile?.nombre || 'tu cuenta'}</strong>.
          </p>
        </div>

        <Link to="/agendar">
          <Button variant="primary" icon={Plus}>
            Agendar Nueva Cita
          </Button>
        </Link>
      </div>

      {/* Contenido */}
      {loading ? (
        <Spinner text="Cargando tu historial de citas..." />
      ) : (
        <AppointmentTable
          appointments={appointments}
          onUpdateStatus={handleCancelAppointment}
          showCustomer={false}
          showProfessional={true}
          showActions={true}
        />
      )}
    </div>
  );
}
