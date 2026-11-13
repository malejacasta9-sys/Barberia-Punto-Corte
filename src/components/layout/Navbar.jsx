import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Calendar, User, LogOut, ShieldCheck, ChevronDown, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

export function Navbar() {
  const { user, profile, rol, isAuthenticated, logout, switchDemoRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Marca */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 flex items-center justify-center text-dark-950 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 text-dark-950" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                PUNTO CORTE
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
              </span>
              <span className="text-[10px] text-brand-400 uppercase tracking-widest block font-medium">
                Cañaveral • Bucaramanga
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/agendar"
              className="text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-brand-500" />
              Agendar Cita
            </Link>

            {/* Enlaces según Rol */}
            {isAuthenticated && (
              <>
                {rol === ROLES.CLIENTE && (
                  <Link
                    to="/mis-citas"
                    className="text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors"
                  >
                    Mis Citas
                  </Link>
                )}

                {rol === ROLES.PROFESIONAL && (
                  <Link
                    to="/agenda-profesional"
                    className="text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors"
                  >
                    Mi Agenda
                  </Link>
                )}

                {rol === ROLES.CAJERA && (
                  <Link
                    to="/caja"
                    className="text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors"
                  >
                    Control de Caja & Citas
                  </Link>
                )}

                {rol === ROLES.ADMIN && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-gray-300 hover:text-brand-400 transition-colors flex items-center gap-1"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-400" />
                    Panel Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Controles de Usuario & Switcher Demo */}
          <div className="hidden md:flex items-center gap-3">
            {/* Selector Rápido de Roles Demo */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-brand-300 bg-brand-500/10 border border-brand-500/30 rounded-lg hover:bg-brand-500/20 transition-all"
                title="Cambiar rol en modo Demo para probar todas las vistas"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Rol: <strong className="capitalize">{rol || 'Público'}</strong></span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] text-slate-400 uppercase font-semibold border-b border-slate-800">
                    Cambiar Rol Demo
                  </div>
                  <button
                    onClick={() => { switchDemoRole(ROLES.CLIENTE); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-gray-200 hover:bg-slate-800/80 hover:text-brand-400 flex items-center justify-between"
                  >
                    Cliente {rol === ROLES.CLIENTE && '✓'}
                  </button>
                  <button
                    onClick={() => { switchDemoRole(ROLES.PROFESIONAL); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-gray-200 hover:bg-slate-800/80 hover:text-brand-400 flex items-center justify-between"
                  >
                    Profesional {rol === ROLES.PROFESIONAL && '✓'}
                  </button>
                  <button
                    onClick={() => { switchDemoRole(ROLES.CAJERA); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-gray-200 hover:bg-slate-800/80 hover:text-brand-400 flex items-center justify-between"
                  >
                    Cajera {rol === ROLES.CAJERA && '✓'}
                  </button>
                  <button
                    onClick={() => { switchDemoRole(ROLES.ADMIN); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-gray-200 hover:bg-slate-800/80 hover:text-brand-400 flex items-center justify-between"
                  >
                    Administrador {rol === ROLES.ADMIN && '✓'}
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-200 leading-tight">
                    {profile?.nombre || user?.email?.split('@')[0]}
                  </p>
                  <span className="text-[10px] text-slate-400 capitalize">{rol}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  className="px-3.5 py-1.5 text-xs font-semibold text-dark-950 bg-gradient-to-r from-brand-400 to-brand-500 hover:from-brand-300 hover:to-brand-400 rounded-lg transition-all shadow-md shadow-brand-500/20"
                >
                  Crear Cuenta
                </Link>
              </div>
            )}
          </div>

          {/* Botón Menú Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Mobile desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-dark-900 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/agendar"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-brand-400 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Agendar Cita
          </Link>

          {isAuthenticated ? (
            <>
              {rol === ROLES.CLIENTE && (
                <Link
                  to="/mis-citas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-gray-200"
                >
                  Mis Citas
                </Link>
              )}
              {rol === ROLES.PROFESIONAL && (
                <Link
                  to="/agenda-profesional"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-gray-200"
                >
                  Mi Agenda
                </Link>
              )}
              {rol === ROLES.CAJERA && (
                <Link
                  to="/caja"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-gray-200"
                >
                  Control de Caja & Citas
                </Link>
              )}
              {rol === ROLES.ADMIN && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-gray-200"
                >
                  Panel Administrador
                </Link>
              )}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{profile?.nombre}</p>
                  <span className="text-xs text-brand-400 capitalize">{rol}</span>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="text-xs text-rose-400 font-medium py-1 px-3 border border-rose-500/30 rounded-lg hover:bg-rose-500/10"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-gray-200 border border-slate-700 rounded-xl"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-dark-950 bg-brand-500 rounded-xl"
              >
                Crear Cuenta
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
