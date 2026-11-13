import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, Scissors, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { HABEAS_DATA_TEXT } from '../../utils/constants';

export function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [habeasData, setHabeasData] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!habeasData) {
      toastError('Debes aceptar la autorización de tratamiento de datos personales (Habeas Data).', 'Consentimiento requerido');
      return;
    }

    setLoading(true);
    try {
      await register({
        nombre,
        telefono,
        email,
        password,
        habeasDataAceptado: true,
      });

      success('¡Tu cuenta ha sido creada con éxito en Punto Corte!');
      navigate('/mis-citas');
    } catch (err) {
      toastError(err.message || 'Error al crear la cuenta', 'Error de Registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto mb-3">
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Registro de Cliente</h2>
          <p className="text-xs text-slate-400 mt-1">
            Crea tu perfil para agendar en segundos y consultar tu historial
          </p>
        </div>

        {/* Formulario */}
        <div className="p-7 rounded-3xl border border-slate-800 bg-dark-900 shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="reg-nombre">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="reg-nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="reg-tel">
                Teléfono Celular (WhatsApp para notificaciones)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="reg-tel"
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: 318 123 4567"
                  className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="reg-email">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu-correo@ejemplo.com"
                  className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="reg-pass">
                Contraseña (mínimo 6 caracteres)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="reg-pass"
                  type="password"
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Checkbox Obligatorio Habeas Data (Ley 1581 de 2012) */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-dark-950/70">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={habeasData}
                  onChange={(e) => setHabeasData(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-brand-500 bg-dark-900 border-slate-700 rounded focus:ring-brand-500 focus:ring-offset-dark-950"
                  required
                />
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  <span className="font-semibold text-gray-200 block mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                    Autorización de Tratamiento de Datos (Habeas Data) *
                  </span>
                  {HABEAS_DATA_TEXT}
                </div>
              </label>
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full">
              Crear Mi Cuenta
            </Button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            ¿Ya tienes una cuenta creada?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
