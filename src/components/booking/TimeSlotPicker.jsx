import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatDateToISO, formatFriendlyDate } from '../../utils/dateUtils';
import { Spinner } from '../common/Spinner';

export function TimeSlotPicker({
  fecha,
  onFechaChange,
  slots,
  selectedTime,
  onSelectTime,
  loading,
  profesionalNombre,
}) {
  const todayIso = formatDateToISO(new Date());

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-bold">4</span>
          Selecciona Fecha y Horario
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Horarios de atención de 9:00 a.m. a 8:00 p.m. con cálculo en tiempo real anti-traslapes.
        </p>
      </div>

      {/* Selector de Fecha */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-800 bg-dark-900/60">
        <label htmlFor="fecha-cita" className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-400" />
          Fecha de la cita:
        </label>
        <input
          id="fecha-cita"
          type="date"
          min={todayIso}
          value={fecha}
          onChange={(e) => onFechaChange(e.target.value)}
          className="bg-dark-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {fecha && (
          <span className="text-xs text-brand-400 font-medium capitalize">
            {formatFriendlyDate(fecha)}
          </span>
        )}
      </div>

      {/* Grid de Franjas Horarias */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            Horarios Disponibles para {profesionalNombre || 'el profesional'}
          </h4>
          <span className="text-[11px] text-slate-500">
            Verde: Libre • Deshabilitado: Ocupado/No disponible
          </span>
        </div>

        {loading ? (
          <Spinner size="sm" text="Verificando disponibilidad en tiempo real..." />
        ) : slots.length === 0 ? (
          <div className="p-6 text-center border border-slate-800 rounded-xl bg-dark-900/40 text-sm text-slate-400">
            Selecciona una fecha válida para cargar los turnos disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {slots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => onSelectTime(slot.time)}
                  title={slot.reason || 'Disponible'}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-150 border text-center ${
                    isSelected
                      ? 'bg-brand-500 text-dark-950 border-brand-400 shadow-md shadow-brand-500/20 scale-105 ring-2 ring-brand-300'
                      : slot.available
                      ? 'bg-slate-900/90 text-emerald-300 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/40'
                      : 'bg-dark-950/50 text-slate-600 border-slate-800/60 cursor-not-allowed line-through opacity-60'
                  }`}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
