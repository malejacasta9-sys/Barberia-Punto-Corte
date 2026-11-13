import React from 'react';
import { UserCheck, Sparkles, Check } from 'lucide-react';

export function ProfessionalSelector({
  profesionales,
  selectedProfId,
  onSelectProfessional,
  sedeNombre,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-bold">3</span>
          Elige a tu Profesional
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Profesionales asignados y activos en <strong className="text-slate-200">{sedeNombre || 'la sede elegida'}</strong>:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {profesionales.map((prof) => {
          const isSelected = selectedProfId === prof.id;
          return (
            <div
              key={prof.id}
              onClick={() => onSelectProfessional(prof)}
              className={`cursor-pointer p-4 rounded-xl border text-center transition-all duration-200 flex flex-col items-center ${
                isSelected
                  ? 'border-brand-500 bg-brand-500/10 ring-1 ring-brand-500 shadow-md shadow-brand-500/10'
                  : 'border-slate-800 bg-dark-900/60 hover:border-slate-700 hover:bg-dark-900'
              }`}
            >
              <div className="relative mb-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-base ${
                  isSelected ? 'bg-brand-500 text-dark-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  {prof.nombre ? prof.nombre.substring(0, 2).toUpperCase() : 'PC'}
                </div>
                {isSelected && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <h4 className="font-semibold text-gray-100 text-sm">{prof.nombre}</h4>
              <p className="text-[11px] text-brand-400/90 flex items-center gap-1 mt-1 justify-center">
                <Sparkles className="w-3 h-3 shrink-0" />
                {prof.especialidad}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
