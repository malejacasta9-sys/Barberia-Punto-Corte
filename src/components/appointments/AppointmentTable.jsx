import React from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCOP } from '../../utils/currencyUtils';
import { formatFriendlyDate, formatTime12h } from '../../utils/dateUtils';
import { EmptyState } from '../common/EmptyState';

export function AppointmentTable({
  appointments = [],
  onUpdateStatus = null,
  showCustomer = true,
  showProfessional = true,
  showActions = true,
}) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No hay citas registradas"
        description="No se encontraron citas con los filtros o la fecha seleccionada."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-dark-900/60 shadow-xl">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-dark-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3.5 px-4">Fecha & Hora</th>
            <th className="py-3.5 px-4">Sede & Servicio</th>
            {showCustomer && <th className="py-3.5 px-4">Cliente</th>}
            {showProfessional && <th className="py-3.5 px-4">Profesional</th>}
            <th className="py-3.5 px-4">Estado</th>
            {showActions && <th className="py-3.5 px-4 text-right">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {appointments.map((cita) => {
            const servicioNombre = cita.servicios?.nombre || cita.servicio_nombre || 'Servicio';
            const servicioPrecio = cita.servicios?.precio || cita.precio || 0;
            const sedeNombre = cita.sedes?.nombre || cita.sede_nombre || 'Sede';
            const clienteNombre = cita.profiles?.nombre || cita.cliente_nombre || 'Cliente';
            const clienteTelefono = cita.profiles?.telefono || '';
            const profNombre = cita.profesionales?.profiles?.nombre || cita.profesional_nombre || 'Profesional';

            return (
              <tr key={cita.id} className="hover:bg-slate-800/30 transition-colors">
                {/* Fecha y Hora */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-200 capitalize">
                    {formatFriendlyDate(cita.fecha)}
                  </div>
                  <div className="text-brand-400 font-mono text-[11px] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-500" />
                    {formatTime12h(cita.hora_inicio)} - {formatTime12h(cita.hora_fin)}
                  </div>
                </td>

                {/* Sede y Servicio */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white">{servicioNombre}</div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    {sedeNombre}
                  </div>
                  <div className="text-brand-400/90 font-medium text-[11px] mt-0.5">
                    {formatCOP(servicioPrecio)}
                  </div>
                </td>

                {/* Cliente */}
                {showCustomer && (
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-200">{clienteNombre}</div>
                    {clienteTelefono && (
                      <div className="text-slate-500 text-[11px]">{clienteTelefono}</div>
                    )}
                  </td>
                )}

                {/* Profesional */}
                {showProfessional && (
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-200">{profNombre}</div>
                    <div className="text-slate-400 text-[11px]">
                      {cita.profesionales?.especialidad || 'Especialista'}
                    </div>
                  </td>
                )}

                {/* Estado */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge estado={cita.estado} />
                </td>

                {/* Acciones */}
                {showActions && onUpdateStatus && (
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {cita.estado !== 'cancelada' && cita.estado !== 'atendida' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onUpdateStatus(cita.id, 'atendida')}
                          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          title="Marcar como atendida"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Atendida
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onUpdateStatus(cita.id, 'cancelada')}
                          className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          title="Cancelar cita"
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Cancelar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Sin acciones pendientes</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
