import React from 'react';
import { MapPin, Users, Clock, CheckCircle } from 'lucide-react';

export function SedeSelector({ sedes, selectedSedeId, onSelectSede }) {
  return (
    <div className="space-y-4">
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-bold">1</span>
          Selecciona la Sede de tu Preferencia
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Punto Corte cuenta con dos sedes ubicadas estratégicamente en el sector de Cañaveral.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sedes.map((sede) => {
          const isSelected = selectedSedeId === sede.id;
          return (
            <div
              key={sede.id}
              onClick={() => onSelectSede(sede)}
              className={`cursor-pointer relative p-5 rounded-2xl border transition-all duration-200 text-left ${
                isSelected
                  ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500'
                  : 'border-slate-800 bg-dark-900/60 hover:border-slate-700 hover:bg-dark-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-100 text-base flex items-center gap-2">
                    {sede.nombre}
                    {isSelected && <CheckCircle className="w-5 h-5 text-brand-400" />}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    {sede.direccion}
                  </p>
                </div>
              </div>

              {sede.descripcion && (
                <p className="text-xs text-brand-300/90 bg-dark-950/40 p-2.5 rounded-xl border border-slate-800/80 mt-3.5 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>{sede.descripcion}</span>
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> 9:00 a.m. - 8:00 p.m.
                </span>
                <span className={`font-semibold ${isSelected ? 'text-brand-400' : 'text-slate-500'}`}>
                  {isSelected ? 'Seleccionada' : 'Elegir esta sede →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
