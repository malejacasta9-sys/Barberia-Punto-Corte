import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Scissors, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { ROLES } from '../../utils/constants';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, switchDemoRole } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      success('Bienvenido de nuevo a Punto Corte.');
      navigate(from, { replace: true });
    } catch (err) {
      toastError(err.message || 'Error al iniciar sesión', 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    switchDemoRole(role);
    success(`Iniciaste sesión en modo demo como ${role.toUpperCase()}`);
    if (role === ROLES.CLIENTE) navigate('/mis-citas');
    else if (role === ROLES.PROFESIONAL) navigate('/agenda-profesional');
    else if (role === ROLES.CAJERA) navigate('/caja');
    else if (role === ROLES.ADMIN) navigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto mb-3">
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Iniciar Sesión</h2>
          <p className="text-xs text-slate-400 mt-1">
            Accede a tu cuenta de Punto Corte para gestionar tus reservas
          </p>
        </div>

        {/* Card Formulario */}
        <div className="p-7 rounded-3xl border border-slate-800 bg-dark-900 shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="login-email">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@puntocorte.com"
                  className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="login-password">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full">
              Entrar a Mi Cuenta
            </Button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registro" className="text-brand-400 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </div>

          {/* Accesos rápidos de prueba (Demo Roles) */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-400 mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceso Rápido de Evaluación (Roles Demo):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoLogin(ROLES.CLIENTE)}
                className="p-2 rounded-lg bg-dark-950 border border-slate-800 hover:border-brand-500/50 text-slate-300 hover:text-brand-300 transition-colors"
              >
                👤 Cliente Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin(ROLES.PROFESIONAL)}
                className="p-2 rounded-lg bg-dark-950 border border-slate-800 hover:border-brand-500/50 text-slate-300 hover:text-brand-300 transition-colors"
              >
                💈 Barbero / Pro
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin(ROLES.CAJERA)}
                className="p-2 rounded-lg bg-dark-950 border border-slate-800 hover:border-brand-500/50 text-slate-300 hover:text-brand-300 transition-colors"
              >
                🧾 Cajera Sede
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin(ROLES.ADMIN)}
                className="p-2 rounded-lg bg-dark-950 border border-slate-800 hover:border-brand-500/50 text-slate-300 hover:text-brand-300 transition-colors"
              >
                👑 Propietaria Admin
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
