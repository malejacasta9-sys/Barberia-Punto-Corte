import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Sparkles, MapPin, Calendar, Clock, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { formatCOP } from '../../utils/currencyUtils';
import { FALLBACK_SERVICIOS, FALLBACK_SEDES } from '../../services/catalogService';

export function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80 bg-gradient-to-b from-dark-900/60 to-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Sistema Centralizado de Citas • Cañaveral, Floridablanca</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            El arte del buen corte y el cuidado exclusivo en <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-300 bg-clip-text text-transparent">Punto Corte</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Reserva tu turno en línea en cualquiera de nuestras dos sedes en tiempo real. Adiós a las esperas y traslapes por WhatsApp.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/agendar">
              <Button size="lg" icon={Calendar} className="w-full sm:w-auto shadow-xl shadow-brand-500/20">
                Agendar Mi Cita Ahora
              </Button>
            </Link>
            <Link to="/registro">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Crear Cuenta de Cliente
              </Button>
            </Link>
          </div>

          {/* Badges de confianza */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3 rounded-xl bg-dark-900/40 border border-slate-800/80">
              <p className="text-xl font-bold text-brand-400">2 Sedes</p>
              <p className="text-xs text-slate-400">Cañaveral - Bucaramanga</p>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/40 border border-slate-800/80">
              <p className="text-xl font-bold text-brand-400">8 Especialistas</p>
              <p className="text-xs text-slate-400">5 Barberos + 3 Manicuristas</p>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/40 border border-slate-800/80">
              <p className="text-xl font-bold text-brand-400">9am a 8pm</p>
              <p className="text-xs text-slate-400">Lunes a Sábado</p>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/40 border border-slate-800/80">
              <p className="text-xl font-bold text-brand-400">0 Traslapes</p>
              <p className="text-xs text-slate-400">Garantía PostgreSQL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sedes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Nuestras 2 Sedes en Cañaveral</h2>
          <p className="text-sm text-slate-400 mt-2">Equipadas con el mejor mobiliario y protocolo de bioseguridad.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FALLBACK_SEDES.map((sede) => (
            <div key={sede.id} className="p-6 rounded-2xl border border-slate-800 bg-dark-900/60 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-2.5 py-1 rounded-md">
                  Sede Operativa
                </span>
                <h3 className="text-xl font-bold text-white mt-3">{sede.nombre}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  {sede.direccion}
                </p>
                <p className="text-xs text-slate-300 mt-4 leading-relaxed bg-dark-950/60 p-3 rounded-xl border border-slate-800">
                  {sede.descripcion}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> 9:00 a.m. - 8:00 p.m.
                </span>
                <Link to="/agendar">
                  <Button size="sm" variant="outline">
                    Reservar en esta sede
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catálogo de Servicios Destacados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Servicios & Tarifas</h2>
            <p className="text-sm text-slate-400 mt-1">Precios transparentes y duración exacta para planear tu tiempo.</p>
          </div>
          <Link to="/agendar">
            <Button variant="ghost" className="text-brand-400 hover:text-brand-300">
              Ver todos los turnos disponibles →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FALLBACK_SERVICIOS.map((srv) => (
            <div key={srv.id} className="p-5 rounded-2xl border border-slate-800 bg-dark-900/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                  {srv.categoria}
                </span>
                <h4 className="font-bold text-white text-base mt-2">{srv.nombre}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {srv.descripcion}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {srv.duracion_minutos} min
                </span>
                <span className="text-sm font-bold text-brand-400">
                  {formatCOP(srv.precio)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner de Garantía y Ley 1581 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl border border-brand-500/30 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <ShieldCheck className="w-10 h-10 text-brand-400 mx-auto" />
            <h3 className="text-2xl font-bold text-white">Seguridad, Puntualidad y Privacidad</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cumplimos estrictamente con la Ley Estatutaria 1581 de 2012 de Protección de Datos Personales en Colombia. Tus datos son confidenciales y tu reserva cuenta con validación matemática contra traslapes en nuestra base de datos.
            </p>
            <div className="pt-2">
              <Link to="/agendar">
                <Button size="md" variant="primary">
                  Comenzar Agendamiento
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
