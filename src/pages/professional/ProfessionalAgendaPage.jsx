import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, CheckCircle, Scissors, Filter } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments } from '../../hooks/useAppointments';
import { AppointmentTable } from '../../components/appointments/AppointmentTable';
import { formatDateToISO, formatFriendlyDate } from '../../utils/dateUtils';
import { Spinner } from '../../components/common/Spinner';

export function ProfessionalAgendaPage() {
  const { user, profile } = useAuth();
  const [selectedDate, setSelectedDate] = useState(formatDateToISO(new Date()));
  const { appointments, loading, fetchProfessionalAgenda, updateStatus } = useAppointments();

  useEffect(() => {
    // Si es demo o profesional real, buscamos por su id o fallback 'p1' (Carlos Mendoza)
    const profId = profile?.id === 'demo-profesional' || profile?.id === 'mock-user-profesional' ? 'p1' : profile?.id || 'p1';
    fetchProfessionalAgenda(profId, selectedDate);
  }, [fetchProfessionalAgenda, profile, selectedDate]);

  const handleUpdateStatus = async (citaId, nuevoEstado) => {
    await updateStatus(citaId, nuevoEstado);
  };

  const totalCitas = appointments.length;
  const atendidas = appointments.filter((c) => c.estado === 'atendida').length;
  const pendientes = appointments.filter((c) => c.estado === 'confirmada' || c.estado === 'pendiente').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded">
            Panel de Profesional
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Scissors className="w-7 h-7 text-brand-400" />
            Agenda de Turnos: {profile?.nombre || 'Especialista'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revisa los clientes agendados en tu turno y marca los servicios completados.
          </p>
        </div>

        {/* Selector de Fecha */}
        <div className="flex items-center gap-2 bg-dark-900 border border-slate-800 p-2 rounded-xl">
          <Calendar className="w-4 h-4 text-brand-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Métricas rápidas del día */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800">
          <p className="text-xs text-slate-400">Total Citas del Día</p>
          <p className="text-2xl font-bold text-white mt-1">{totalCitas}</p>
        </div>
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800">
          <p className="text-xs text-slate-400">Por Atender</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{pendientes}</p>
        </div>
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800">
          <p className="text-xs text-slate-400">Completadas con Éxito</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{atendidas}</p>
        </div>
      </div>

      {/* Tabla de Citas */}
      {loading ? (
        <Spinner text="Cargando agenda de turnos..." />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="capitalize font-semibold text-gray-200">
              Turnos para: {formatFriendlyDate(selectedDate)}
            </span>
            <span>{appointments.length} citas programadas</span>
          </div>

          <AppointmentTable
            appointments={appointments}
            onUpdateStatus={handleUpdateStatus}
            showCustomer={true}
            showProfessional={false}
            showActions={true}
          />
        </div>
      )}
    </div>
  );
}
