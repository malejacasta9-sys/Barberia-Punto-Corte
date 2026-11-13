import React from 'react';
import { CalendarX } from 'lucide-react';

export function EmptyState({
  icon: Icon = CalendarX,
  title = 'No hay registros',
  description = 'No se encontraron elementos disponibles en este momento.',
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-dark-900/40">
      <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-gray-200">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-5">{description}</p>
      {action}
    </div>
  );
}
