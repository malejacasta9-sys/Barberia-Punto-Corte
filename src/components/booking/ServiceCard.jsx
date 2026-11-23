import React from 'react';
import { Clock, Check } from 'lucide-react';
import { formatCOP } from '../../utils/currencyUtils';

export function ServiceCard({ service, isSelected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(service)}
      className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
        isSelected
          ? 'border-brand-500 bg-brand-500/10 ring-1 ring-brand-500 shadow-md shadow-brand-500/10'
          : 'border-slate-800 bg-dark-900/60 hover:border-slate-700 hover:bg-dark-900'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md">
            {service.categoria}
          </span>
          {isSelected && (
            <div className="w-5 h-5 rounded-full bg-brand-500 text-dark-950 flex items-center justify-center font-bold">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <h4 className="font-bold text-gray-100 text-sm mt-2">{service.nombre}</h4>
        {service.descripcion && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {service.descripcion}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {service.duracion_minutos} min
        </span>
        <span className="text-sm font-bold text-brand-400">
          {formatCOP(service.precio)}
        </span>
      </div>
    </div>
  );
}
