import React from 'react';
import { Scissors, MapPin, Clock, Phone, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-dark-900 border-t border-slate-800 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Columna Marca */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Scissors className="w-4 h-4 text-brand-400" />
              <span>PUNTO CORTE</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Experiencia superior en barbería clásica y spa de uñas. Dos sedes en Cañaveral equipadas con profesionales de élite.
            </p>
          </div>

          {/* Sede Principal */}
          <div className="space-y-2">
            <h5 className="text-white font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              Sede Principal Cañaveral
            </h5>
            <p className="text-slate-400">Calle 30 # 25-14, Cañaveral</p>
            <p className="text-slate-500">4 Barberos Máster</p>
            <p className="text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-500" /> +57 318 000 0001
            </p>
          </div>

          {/* Sede 2 */}
          <div className="space-y-2">
            <h5 className="text-white font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              Sede 2 (Uñas & Barbería)
            </h5>
            <p className="text-slate-400">Carrera 26 # 29-45, Cañaveral</p>
            <p className="text-slate-500">1 Barbero + 3 Profesionales de Uñas</p>
            <p className="text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-500" /> +57 318 000 0002
            </p>
          </div>

          {/* Horario y Legal */}
          <div className="space-y-2">
            <h5 className="text-white font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              Horario de Atención
            </h5>
            <p className="text-slate-300 font-medium">Lunes a Sábado</p>
            <p className="text-slate-400">9:00 a.m. a 8:00 p.m.</p>
            <div className="pt-2 flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-brand-500" />
              <span>Habeas Data (Ley 1581 de 2012)</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} Punto Corte Bucaramanga. Todos los derechos reservados.</p>
          <p className="text-slate-600 text-[11px]">Diseñado con arquitectura Serverless Supabase + React SPA ($0 USD Cost)</p>
        </div>
      </div>
    </footer>
  );
}
