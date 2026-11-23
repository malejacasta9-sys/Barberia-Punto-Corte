import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Scissors,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Building2,
  Clock,
  Phone,
  AlertTriangle,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { catalogService } from '../../services/catalogService';
import { AppointmentTable } from '../../components/appointments/AppointmentTable';
import { formatCOP } from '../../utils/currencyUtils';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('citas'); // 'citas' | 'servicios' | 'profesionales' | 'sedes'

  // Datos del catálogo
  const [sedes, setSedes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  // Hook de citas
  const { appointments, loading: appointmentsLoading, fetchAllAppointments, updateStatus } = useAppointments();
  const { success, error: toastError } = useToast();

  // Estados de modales
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'Barbería',
    precio: '',
    duracion_minutos: 45,
    activo: true,
  });

  const [sedeModalOpen, setSedeModalOpen] = useState(false);
  const [editingSede, setEditingSede] = useState(null);
  const [sedeForm, setSedeForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    hora_apertura: '09:00:00',
    hora_cierre: '20:00:00',
    activa: true,
  });

  const [profModalOpen, setProfModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState(null);
  const [profForm, setProfForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    especialidad: '',
    sede_id: '',
    password: 'Barbero123456*',
    activo: true,
  });

  const [formLoading, setFormLoading] = useState(false);

  // Filtros de servicios
  const [servicioSearch, setServicioSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');

  // Cargar catálogo completo
  const loadFullCatalog = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const [sedesData, serviciosData, profsData] = await Promise.all([
        catalogService.getSedes(true),
        catalogService.getServicios(null, true),
        catalogService.getProfesionales(null, true),
      ]);
      setSedes(sedesData || []);
      setServicios(serviciosData || []);
      setProfesionales(profsData || []);
    } catch (err) {
      console.error('Error al cargar datos de administración:', err);
      toastError('No se pudieron recargar algunos datos del catálogo.');
    } finally {
      setCatalogLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchAllAppointments();
    loadFullCatalog();
  }, [fetchAllAppointments, loadFullCatalog]);

  // Métricas
  const totalCitas = appointments.length;
  const atendidas = appointments.filter((c) => c.estado === 'atendida').length;
  const canceladas = appointments.filter((c) => c.estado === 'cancelada').length;
  const totalFacturado = appointments
    .filter((c) => c.estado === 'atendida')
    .reduce((acc, c) => acc + (Number(c.servicios?.precio || c.precio) || 0), 0);
  const tasaCumplimiento = totalCitas > 0 ? Math.round((atendidas / (totalCitas - canceladas || 1)) * 100) : 100;

  // =========================================================================
  // HANDLERS: SERVICIOS
  // =========================================================================
  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceForm({
      nombre: '',
      descripcion: '',
      categoria: 'Barbería',
      precio: '',
      duracion_minutos: 45,
      activo: true,
    });
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (serv) => {
    setEditingService(serv);
    setServiceForm({
      nombre: serv.nombre,
      descripcion: serv.descripcion || '',
      categoria: serv.categoria || 'Barbería',
      precio: serv.precio,
      duracion_minutos: serv.duracion_minutos || 45,
      activo: serv.activo ?? true,
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        nombre: serviceForm.nombre.trim(),
        descripcion: serviceForm.descripcion.trim(),
        categoria: serviceForm.categoria.trim(),
        precio: Number(serviceForm.precio),
        duracion_minutos: Number(serviceForm.duracion_minutos),
        activo: Boolean(serviceForm.activo),
      };

      if (editingService) {
        await catalogService.updateServicio(editingService.id, payload);
        success(`Servicio "${payload.nombre}" actualizado correctamente.`);
      } else {
        await catalogService.createServicio(payload);
        success(`Servicio "${payload.nombre}" creado exitosamente.`);
      }
      setServiceModalOpen(false);
      await loadFullCatalog();
    } catch (err) {
      toastError(err.message || 'Error al guardar el servicio');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el servicio "${nombre}"?`)) return;
    try {
      await catalogService.deleteServicio(id);
      success(`Servicio "${nombre}" eliminado.`);
      await loadFullCatalog();
    } catch (err) {
      toastError(err.message || 'Error al eliminar servicio');
    }
  };

  // =========================================================================
  // HANDLERS: SEDES
  // =========================================================================
  const handleOpenCreateSede = () => {
    setEditingSede(null);
    setSedeForm({
      nombre: '',
      direccion: '',
      telefono: '',
      hora_apertura: '09:00:00',
      hora_cierre: '20:00:00',
      activa: true,
    });
    setSedeModalOpen(true);
  };

  const handleOpenEditSede = (sede) => {
    setEditingSede(sede);
    setSedeForm({
      nombre: sede.nombre,
      direccion: sede.direccion,
      telefono: sede.telefono || '',
      hora_apertura: sede.hora_apertura || '09:00:00',
      hora_cierre: sede.hora_cierre || '20:00:00',
      activa: sede.activa ?? true,
    });
    setSedeModalOpen(true);
  };

  const handleSaveSede = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        nombre: sedeForm.nombre.trim(),
        direccion: sedeForm.direccion.trim(),
        telefono: sedeForm.telefono.trim(),
        hora_apertura: sedeForm.hora_apertura,
        hora_cierre: sedeForm.hora_cierre,
        activa: Boolean(sedeForm.activa),
      };

      if (editingSede) {
        await catalogService.updateSede(editingSede.id, payload);
        success(`Sede "${payload.nombre}" actualizada.`);
      } else {
        await catalogService.createSede(payload);
        success(`Sede "${payload.nombre}" creada.`);
      }
      setSedeModalOpen(false);
      await loadFullCatalog();
    } catch (err) {
      toastError(err.message || 'Error al guardar sede');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSede = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la sede "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await catalogService.deleteSede(id);
      success(`Sede "${nombre}" eliminada.`);
      await loadFullCatalog();
    } catch (err) {
      toastError(err.message || 'Error al eliminar sede');
    }
  };

  // =========================================================================
  // HANDLERS: PROFESIONALES
  // =========================================================================
  const handleOpenCreateProf = () => {
    setEditingProf(null);
    setProfForm({
      nombre: '',
      email: '',
      telefono: '',
      especialidad: '',
      sede_id: sedes[0]?.id || '',
      password: 'Barbero123456*',
      activo: true,
    });
    setProfModalOpen(true);
  };

  const handleOpenEditProf = (prof) => {
    setEditingProf(prof);
    setProfForm({
      nombre: prof.nombre,
      email: '',
      telefono: prof.telefono || '',
      especialidad: prof.especialidad,
      sede_id: prof.sede_id,
      password: '',
      activo: prof.activo ?? true,
    });
    setProfModalOpen(true);
  };

  const handleSaveProf = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingProf) {
        await catalogService.updateProfesional(editingProf.id, {
          especialidad: profForm.especialidad.trim(),
          sede_id: profForm.sede_id,
          activo: Boolean(profForm.activo),
          nombre: profForm.nombre.trim(),
          telefono: profForm.telefono.trim(),
          profile_id: editingProf.profile_id,
        });
        success(`Profesional "${profForm.nombre}" actualizado.`);
      } else {
        if (!profForm.sede_id) {
          throw new Error('Debes seleccionar una sede para el profesional.');
        }
        await catalogService.createProfesional(profForm);
        success(`Profesional "${profForm.nombre}" registrado exitosamente.`);
      }
      setProfModalOpen(false);
      await loadFullCatalog();
    } catch (err) {
      toastError(err.message || 'Error al guardar profesional');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProf = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar al profesional "${nombre}"?`)) return;
    try {
      await catalogService.deleteProfesional(id);
      success(`Profesional "${nombre}" retirado.`);
      await loadFullCatalog();
    } catch (err) {
      toastError(err.message || 'Error al retirar profesional');
    }
  };

  // Filtrado de servicios
  const filteredServicios = servicios.filter((s) => {
    const matchesSearch = s.nombre.toLowerCase().includes(servicioSearch.toLowerCase()) ||
      (s.descripcion && s.descripcion.toLowerCase().includes(servicioSearch.toLowerCase()));
    const matchesCat = categoriaFilter === 'Todas' || s.categoria === categoriaFilter;
    return matchesSearch && matchesCat;
  });

  const categoriasDisponibles = ['Todas', ...new Set(servicios.map((s) => s.categoria).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded">
            Panel de Control Central
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-brand-400" />
            Punto Corte • Administración
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión completa de citas, catálogo de servicios, equipo de profesionales y sedes.
          </p>
        </div>

        {/* Pestañas de Navegación del Admin */}
        <div className="flex items-center gap-1.5 p-1 bg-dark-900 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('citas')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'citas'
                ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Citas & Métricas
          </button>
          <button
            onClick={() => setActiveTab('servicios')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'servicios'
                ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Scissors className="w-4 h-4" />
            Servicios ({servicios.length})
          </button>
          <button
            onClick={() => setActiveTab('profesionales')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'profesionales'
                ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            Profesionales ({profesionales.length})
          </button>
          <button
            onClick={() => setActiveTab('sedes')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'sedes'
                ? 'bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Sedes ({sedes.length})
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Clave (Siempre visibles o en pestaña Citas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Citas Registradas</span>
            <Calendar className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{totalCitas}</p>
          <p className="text-[11px] text-slate-500 mt-1">{canceladas} canceladas</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Citas Atendidas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{atendidas}</p>
          <p className="text-[11px] text-emerald-500/80 mt-1">{tasaCumplimiento}% efectividad</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Facturación Atendida</span>
            <DollarSign className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-3xl font-extrabold text-brand-400 mt-2">{formatCOP(totalFacturado)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Total acumulado en caja</p>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Personal Registrado</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{profesionales.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{sedes.length} Sedes operativas</p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* PESTAÑA 1: CITAS Y REGISTRO GLOBAL                                  */}
      {/* =================================================================== */}
      {activeTab === 'citas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-400" />
                Registro Global de Citas en Ambas Sedes
              </h3>
              <p className="text-xs text-slate-400">Control de estado y auditoría de agendamientos en tiempo real.</p>
            </div>
            <span className="text-xs text-slate-400">{appointments.length} registros</span>
          </div>

          {appointmentsLoading ? (
            <Spinner text="Cargando base de datos consolidada..." />
          ) : (
            <AppointmentTable
              appointments={appointments}
              onUpdateStatus={updateStatus}
              showCustomer={true}
              showProfessional={true}
              showActions={true}
            />
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* PESTAÑA 2: CATÁLOGO DE SERVICIOS                                    */}
      {/* =================================================================== */}
      {activeTab === 'servicios' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-xl flex items-center gap-2">
                <Scissors className="w-5 h-5 text-brand-400" />
                Gestión del Catálogo de Servicios
              </h3>
              <p className="text-xs text-slate-400">
                Agrega, edita precios en COP, duración en minutos o desactiva servicios del agendamiento público.
              </p>
            </div>

            <Button onClick={handleOpenCreateService} icon={Plus} variant="primary">
              Nuevo Servicio
            </Button>
          </div>

          {/* Barra de Filtros y Búsqueda */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar servicio por nombre o descripción..."
                value={servicioSearch}
                onChange={(e) => setServicioSearch(e.target.value)}
                className="w-full bg-dark-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {categoriasDisponibles.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    categoriaFilter === cat
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                      : 'bg-dark-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla / Grid de Servicios */}
          {catalogLoading ? (
            <Spinner text="Cargando servicios..." />
          ) : filteredServicios.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-dark-900/40 border border-slate-800">
              <Scissors className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">No se encontraron servicios</p>
              <p className="text-xs text-slate-500 mt-1">Haz clic en "Nuevo Servicio" para agregar uno al catálogo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServicios.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-2 py-0.5 rounded">
                        {s.categoria || 'General'}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          s.activo
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                            : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                        }`}
                      >
                        {s.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base leading-snug">{s.nombre}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.descripcion || 'Sin descripción'}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-black text-brand-400">{formatCOP(s.precio)}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {s.duracion_minutos} minutos
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditService(s)}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Editar servicio"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(s.id, s.nombre)}
                        className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Eliminar servicio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* PESTAÑA 3: EQUIPO DE PROFESIONALES                                  */}
      {/* =================================================================== */}
      {activeTab === 'profesionales' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-xl flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-400" />
                Equipo de Barberos y Estilistas
              </h3>
              <p className="text-xs text-slate-400">
                Registra a tu personal, asígnalo a una sede y asígnales su cuenta de acceso para ver su agenda.
              </p>
            </div>

            <Button onClick={handleOpenCreateProf} icon={Plus} variant="primary">
              Agregar Profesional
            </Button>
          </div>

          {catalogLoading ? (
            <Spinner text="Cargando equipo..." />
          ) : profesionales.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-dark-900/40 border border-slate-800">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">Aún no hay profesionales registrados en la base de datos</p>
              <p className="text-xs text-slate-500 mt-1">Haz clic en "Agregar Profesional" para registrar al primer integrante de tu equipo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profesionales.map((p) => {
                const sedeAsignada = sedes.find((s) => s.id === p.sede_id);
                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            p.activo
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                              : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                          }`}
                        >
                          {p.activo ? 'En Turno / Activo' : 'Inactivo'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProf(p)}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Editar profesional"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProf(p.id, p.nombre)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Eliminar profesional"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-white text-base">{p.nombre}</h4>
                      <p className="text-xs text-brand-400 font-medium mt-0.5">{p.especialidad}</p>

                      <div className="mt-3 space-y-1 text-xs text-slate-400">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {sedeAsignada?.nombre || 'Sin sede asignada'}
                        </p>
                        {p.telefono && (
                          <p className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            {p.telefono}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* PESTAÑA 4: GESTIÓN DE SEDES                                         */}
      {/* =================================================================== */}
      {activeTab === 'sedes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-xl flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-400" />
                Infraestructura y Sedes
              </h3>
              <p className="text-xs text-slate-400">
                Administra tus locales en Cañaveral, horarios de atención y datos de contacto.
              </p>
            </div>

            <Button onClick={handleOpenCreateSede} icon={Plus} variant="primary">
              Nueva Sede
            </Button>
          </div>

          {catalogLoading ? (
            <Spinner text="Cargando sedes..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sedes.map((s) => (
                <div
                  key={s.id}
                  className="p-6 rounded-2xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-2.5 py-1 rounded-md">
                        Sede Registrada
                      </span>
                      <h4 className="font-bold text-white text-lg mt-2">{s.nombre}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        s.activa
                          ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                          : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                      }`}
                    >
                      {s.activa ? 'Operativa' : 'Cerrada'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-400">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>{s.direccion}</span>
                    </p>
                    {s.telefono && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                        <span>{s.telefono}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>
                        Horario: {s.hora_apertura?.slice(0, 5)} a {s.hora_cierre?.slice(0, 5)}
                      </span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                    <Button onClick={() => handleOpenEditSede(s)} variant="secondary" size="sm" icon={Pencil}>
                      Editar
                    </Button>
                    <button
                      onClick={() => handleDeleteSede(s.id, s.nombre)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Eliminar sede"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: SERVICIO (CREAR / EDITAR)                                    */}
      {/* =================================================================== */}
      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title={editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
      >
        <form onSubmit={handleSaveService} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Servicio *</label>
            <input
              type="text"
              required
              placeholder="Ej: Corte Clásico / Fade Degradado"
              value={serviceForm.nombre}
              onChange={(e) => setServiceForm({ ...serviceForm, nombre: e.target.value })}
              className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría *</label>
              <select
                value={serviceForm.categoria}
                onChange={(e) => setServiceForm({ ...serviceForm, categoria: e.target.value })}
                className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Barbería">Barbería</option>
                <option value="Uñas">Uñas</option>
                <option value="Combos">Combos</option>
                <option value="Tratamientos">Tratamientos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Precio (COP) *</label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                placeholder="Ej: 25000"
                value={serviceForm.precio}
                onChange={(e) => setServiceForm({ ...serviceForm, precio: e.target.value })}
                className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duración (minutos) *</label>
              <input
                type="number"
                required
                min="10"
                max="240"
                step="5"
                value={serviceForm.duracion_minutos}
                onChange={(e) => setServiceForm({ ...serviceForm, duracion_minutos: e.target.value })}
                className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={serviceForm.activo}
                  onChange={(e) => setServiceForm({ ...serviceForm, activo: e.target.checked })}
                  className="rounded border-slate-700 text-brand-500 focus:ring-brand-500 w-4 h-4"
                />
                <span>Servicio Activo para Citas</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
            <textarea
              rows="2"
              placeholder="Detalles sobre lo que incluye el servicio..."
              value={serviceForm.descripcion}
              onChange={(e) => setServiceForm({ ...serviceForm, descripcion: e.target.value })}
              className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setServiceModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {editingService ? 'Actualizar' : 'Guardar Servicio'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* =================================================================== */}
      {/* MODAL: SEDE (CREAR / EDITAR)                                        */}
      {/* =================================================================== */}
      <Modal
        isOpen={sedeModalOpen}
        onClose={() => setSedeModalOpen(false)}
        title={editingSede ? 'Editar Sede' : 'Nueva Sede'}
      >
        <form onSubmit={handleSaveSede} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Sede *</label>
            <input
              type="text"
              required
              placeholder="Ej: Sede Cañaveral Principal"
              value={sedeForm.nombre}
              onChange={(e) => setSedeForm({ ...sedeForm, nombre: e.target.value })}
              className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección *</label>
            <input
              type="text"
              required
              placeholder="Ej: Calle 30 # 25-14, Cañaveral, Floridablanca"
              value={sedeForm.direccion}
              onChange={(e) => setSedeForm({ ...sedeForm, direccion: e.target.value })}
              className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono de Contacto</label>
            <input
              type="text"
              placeholder="Ej: +57 318 123 4567"
              value={sedeForm.telefono}
              onChange={(e) => setSedeForm({ ...sedeForm, telefono: e.target.value })}
              className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hora Apertura</label>
              <input
                type="time"
                required
                value={sedeForm.hora_apertura.slice(0, 5)}
                onChange={(e) => setSedeForm({ ...sedeForm, hora_apertura: e.target.value + ':00' })}
                className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hora Cierre</label>
              <input
                type="time"
                required
                value={sedeForm.hora_cierre.slice(0, 5)}
                onChange={(e) => setSedeForm({ ...sedeForm, hora_cierre: e.target.value + ':00' })}
                className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={sedeForm.activa}
                onChange={(e) => setSedeForm({ ...sedeForm, activa: e.target.checked })}
                className="rounded border-slate-700 text-brand-500 focus:ring-brand-500 w-4 h-4"
              />
              <span>Sede Operativa (Visible para agendamiento)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setSedeModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {editingSede ? 'Actualizar Sede' : 'Guardar Sede'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* =================================================================== */}
      {/* MODAL: PROFESIONAL (CREAR / EDITAR)                                 */}
      {/* =================================================================== */}
      <Modal
        isOpen={profModalOpen}
        onClose={() => setProfModalOpen(false)}
        title={editingProf ? 'Editar Profesional' : 'Registrar Nuevo Profesional'}
      >
        <form onSubmit={handleSaveProf} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              placeholder="Ej: Andrés Suárez"
              value={profForm.nombre}
              onChange={(e) => setProfForm({ ...profForm, nombre: e.target.value })}
              className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Especialidad Principal *</label>
            <input
              type="text"
              required
              placeholder="Ej: Barbero Master / Fade & Barba"
              value={profForm.especialidad}
              onChange={(e) => setProfForm({ ...profForm, especialidad: e.target.value })}
              className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sede Asignada *</label>
              <select
                required
                value={profForm.sede_id}
                onChange={(e) => setProfForm({ ...profForm, sede_id: e.target.value })}
                className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Selecciona una sede...</option>
                {sedes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono (WhatsApp)</label>
              <input
                type="text"
                placeholder="Ej: 318 123 4567"
                value={profForm.telefono}
                onChange={(e) => setProfForm({ ...profForm, telefono: e.target.value })}
                className="w-full bg-dark-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {!editingProf && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-dark-950 border border-slate-800 rounded-xl">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Correo de Acceso *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@puntocorte.com"
                  value={profForm.email}
                  onChange={(e) => setProfForm({ ...profForm, email: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Contraseña Inicial</label>
                <input
                  type="text"
                  value={profForm.password}
                  onChange={(e) => setProfForm({ ...profForm, password: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={profForm.activo}
                onChange={(e) => setProfForm({ ...profForm, activo: e.target.checked })}
                className="rounded border-slate-700 text-brand-500 focus:ring-brand-500 w-4 h-4"
              />
              <span>Profesional Activo (Disponible para agendamiento)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setProfModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {editingProf ? 'Actualizar Profesional' : 'Registrar Profesional'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
