import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Calendar, MapPin, Plus, DollarSign, Filter, RefreshCw } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { useCatalog } from '../../hooks/useCatalog';
import { AppointmentTable } from '../../components/appointments/AppointmentTable';
import { Button } from '../../components/common/Button';
import { formatDateToISO } from '../../utils/dateUtils';
import { formatCOP } from '../../utils/currencyUtils';
import { Spinner } from '../../components/common/Spinner';

export function CashierDeskPage() {
  const [selectedDate, setSelectedDate] = useState(formatDateToISO(new Date()));
  const [selectedSedeId, setSelectedSedeId] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');

  const { sedes } = useCatalog();
  const { appointments, loading, fetchAllAppointments, updateStatus } = useAppointments();

  const loadAppointments = () => {
    fetchAllAppointments({
      fecha: selectedDate || null,
      sedeId: selectedSedeId || null,
      estado: selectedEstado || null,
    });
  };

  useEffect(() => {
    loadAppointments();
  }, [selectedDate, selectedSedeId, selectedEstado]);

  const handleUpdateStatus = async (citaId, nuevoEstado) => {
    await updateStatus(citaId, nuevoEstado);
  };

  // Calcular ingresos proyectados o cobrados
  const totalIngresos = appointments
    .filter((c) => c.estado !== 'cancelada')
    .reduce((sum, c) => sum + (Number(c.servicios?.precio || c.precio) || 0), 0);

  const atendidasCount = appointments.filter((c) => c.estado === 'atendida').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded">
            Mesa de Control Operativa
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Receipt className="w-7 h-7 text-brand-400" />
            Control de Caja y Citas del Día
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión en tiempo real de turnos presenciales y telefónicos para ambas sedes en Cañaveral.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={loadAppointments}>
            Actualizar
          </Button>
          <Link to="/agendar">
            <Button variant="primary" size="sm" icon={Plus}>
              Agendar Walk-in / Teléfono
            </Button>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas de Caja */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <p className="text-xs text-slate-400">Total Citas Programadas</p>
          <p className="text-3xl font-extrabold text-white mt-1">{appointments.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <p className="text-xs text-slate-400">Citas Atendidas / Cobradas</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{atendidasCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <p className="text-xs text-slate-400">Ingresos Totales Proyectados</p>
          <p className="text-3xl font-extrabold text-brand-400 mt-1">{formatCOP(totalIngresos)}</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 rounded-2xl bg-dark-900/60 border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
        {/* Filtro Sede */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-400" />
          <select
            value={selectedSedeId}
            onChange={(e) => setSelectedSedeId(e.target.value)}
            className="bg-dark-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none"
          >
            <option value="">Todas las Sedes</option>
            {sedes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Fecha */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-dark-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none"
          />
        </div>

        {/* Filtro Estado */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-400" />
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="bg-dark-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none"
          >
            <option value="">Todos los Estados</option>
            <option value="confirmada">Confirmada</option>
            <option value="atendida">Atendida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Tabla Principal */}
      {loading ? (
        <Spinner text="Actualizando registros de caja..." />
      ) : (
        <AppointmentTable
          appointments={appointments}
          onUpdateStatus={handleUpdateStatus}
          showCustomer={true}
          showProfessional={true}
          showActions={true}
        />
      )}
    </div>
  );
}
