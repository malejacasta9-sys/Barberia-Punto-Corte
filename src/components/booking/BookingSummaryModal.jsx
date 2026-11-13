import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Scissors, DollarSign, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCOP } from '../../utils/currencyUtils';
import { formatFriendlyDate, formatTime12h, addMinutesToTime } from '../../utils/dateUtils';

export function BookingSummaryModal({
  isOpen,
  onClose,
  bookingData,
  onConfirm,
  loading,
}) {
  const [notas, setNotas] = useState('');

  if (!bookingData) return null;

  const {
    sede,
    servicio,
    profesional,
    fecha,
    horaInicio,
    clienteNombre,
  } = bookingData;

  const horaFin = horaInicio && servicio?.duracion_minutos
    ? addMinutesToTime(horaInicio, servicio.duracion_minutos)
    : null;

  const handleConfirm = () => {
    onConfirm({ ...bookingData, notas });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Agendamiento de Cita">
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-dark-950/70 border border-slate-800 space-y-3 text-sm">
          {/* Sede */}
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-200">{sede?.nombre}</p>
              <p className="text-xs text-slate-400">{sede?.direccion}</p>
            </div>
          </div>

          {/* Servicio */}
          <div className="flex items-start gap-2.5">
            <Scissors className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-200">{servicio?.nombre}</p>
                <span className="font-bold text-brand-400">{formatCOP(servicio?.precio)}</span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> Duración estimada: {servicio?.duracion_minutos} minutos
              </p>
            </div>
          </div>

          {/* Profesional */}
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-brand-400 shrink-0" />
            <div>
              <p className="font-semibold text-gray-200">{profesional?.nombre}</p>
              <p className="text-xs text-brand-400/80">{profesional?.especialidad}</p>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800/80">
            <Calendar className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-200 capitalize">{formatFriendlyDate(fecha)}</p>
              <p className="text-xs text-emerald-400 font-medium">
                {formatTime12h(horaInicio)} a {formatTime12h(horaFin)}
              </p>
            </div>
          </div>
        </div>

        {/* Notas u observaciones */}
        <div>
          <label htmlFor="notas-cita" className="block text-xs font-semibold text-slate-400 mb-1">
            Notas u observaciones adicionales (opcional):
          </label>
          <textarea
            id="notas-cita"
            rows="2"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Ej: Prefiero degradado medio / Tengo las uñas sensibles..."
            className="w-full bg-dark-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Volver a Editar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            loading={loading}
            icon={CheckCircle2}
          >
            Confirmar Reserva
          </Button>
        </div>
      </div>
    </Modal>
  );
}
