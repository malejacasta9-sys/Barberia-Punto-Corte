import React, { useEffect, useState } from 'react';
import { ShieldCheck, TrendingUp, Users, Scissors, MapPin, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { useCatalog } from '../../hooks/useCatalog';
import { AppointmentTable } from '../../components/appointments/AppointmentTable';
import { formatCOP } from '../../utils/currencyUtils';
import { Spinner } from '../../components/common/Spinner';

export function AdminDashboardPage() {
  const { sedes, servicios, profesionales } = useCatalog();
  const { appointments, loading, fetchAllAppointments, updateStatus } = useAppointments();

  useEffect(() => {
    fetchAllAppointments();
  }, [fetchAllAppointments]);

  const totalCitas = appointments.length;
  const atendidas = appointments.filter((c) => c.estado === 'atendida').length;
  const canceladas = appointments.filter((c) => c.estado === 'cancelada').length;
  const totalFacturado = appointments
    .filter((c) => c.estado === 'atendida')
    .reduce((acc, c) => acc + (Number(c.servicios?.precio || c.precio) || 0), 0);

  const tasaCumplimiento = totalCitas > 0 ? Math.round((atendidas / (totalCitas - canceladas || 1)) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded">
          Administración General & Métricas
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-brand-400" />
          Panel Consolidado Punto Corte (2 Sedes)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervisión global de operaciones, métricas de agendamiento y personal en Cañaveral.
        </p>
      </div>

      {/* Tarjetas de Métricas Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Citas Totales</span>
            <Calendar className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{totalCitas}</p>
          <p className="text-[11px] text-slate-500 mt-1">{canceladas} canceladas</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Citas Atendidas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{atendidas}</p>
          <p className="text-[11px] text-emerald-500/80 mt-1">{tasaCumplimiento}% tasa de efectividad</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Ingresos Atendidos</span>
            <DollarSign className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-3xl font-extrabold text-brand-400 mt-2">{formatCOP(totalFacturado)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Total recaudado en caja</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Personal Activo</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{profesionales.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">5 Barberos + 3 Uñas en 2 Sedes</p>
        </div>
      </div>

      {/* Sedes y Distribución Operativa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-400" />
            Infraestructura y Sedes
          </h3>
          <div className="space-y-3">
            {sedes.map((s) => (
              <div key={s.id} className="p-3.5 rounded-xl bg-dark-950 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>{s.nombre}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Operativa</span>
                </div>
                <p className="text-slate-400 mt-1">{s.direccion}</p>
                <p className="text-slate-500 mt-1 text-[11px]">{s.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            Equipo de Profesionales Asignados
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
            {profesionales.map((p) => (
              <div key={p.id} className="p-2.5 rounded-xl bg-dark-950 border border-slate-800/80 text-xs">
                <p className="font-semibold text-gray-200">{p.nombre}</p>
                <p className="text-[11px] text-brand-400/90">{p.especialidad}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla Global de Citas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-400" />
            Registro Global de Citas en Ambas Sedes
          </h3>
          <span className="text-xs text-slate-400">{appointments.length} registros cargados</span>
        </div>

        {loading ? (
          <Spinner text="Cargando base de datos consolidada..." />
        ) : (
          <AppointmentTable
            appointments={appointments}
            onUpdateStatus={updateStatus}
            showCustomer={true}
            showProfessional={true}
            showActions={true}
          />
        )}
      </div>
    </div>
  );
}
