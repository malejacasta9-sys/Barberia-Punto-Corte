import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Scissors } from 'lucide-react';
import { useCatalog } from '../../hooks/useCatalog';
import { useAvailableSlots } from '../../hooks/useAvailableSlots';
import { useAppointments } from '../../hooks/useAppointments';
import { useAuth } from '../../hooks/useAuth';
import { SedeSelector } from '../../components/booking/SedeSelector';
import { ServiceCard } from '../../components/booking/ServiceCard';
import { ProfessionalSelector } from '../../components/booking/ProfessionalSelector';
import { TimeSlotPicker } from '../../components/booking/TimeSlotPicker';
import { BookingSummaryModal } from '../../components/booking/BookingSummaryModal';
import { Button } from '../../components/common/Button';
import { formatDateToISO } from '../../utils/dateUtils';
import { Spinner } from '../../components/common/Spinner';

export function BookingWizardPage() {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated } = useAuth();
  const { bookAppointment, loading: bookingLoading } = useAppointments();

  // Wizard State
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [selectedDate, setSelectedDate] = useState(formatDateToISO(new Date()));
  const [selectedTime, setSelectedTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Cargar catálogo filtrado por Sede seleccionada
  const { sedes, servicios, profesionales, loading: catalogLoading } = useCatalog(
    selectedSede?.id || null,
    selectedCategory
  );

  // Calcular slots disponibles en tiempo real (Anti-Traslape)
  const { slots, loading: slotsLoading } = useAvailableSlots(
    selectedProfessional?.id || null,
    selectedDate,
    selectedService?.duracion_minutos || 30
  );

  const handleSelectSede = (sede) => {
    setSelectedSede(sede);
    // Reiniciar selecciones dependientes
    setSelectedProfessional(null);
    setSelectedTime(null);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setSelectedTime(null);
  };

  const handleSelectProfessional = (prof) => {
    setSelectedProfessional(prof);
    setSelectedTime(null);
  };

  const handleOpenSummary = () => {
    if (!selectedSede || !selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async ({ notas }) => {
    try {
      const created = await bookAppointment({
        clienteId: user?.id || 'guest_client',
        clienteNombre: profile?.nombre || 'Cliente Punto Corte',
        profesionalId: selectedProfessional.id,
        profesionalNombre: selectedProfessional.nombre,
        servicioId: selectedService.id,
        servicioNombre: selectedService.nombre,
        duracionMinutos: selectedService.duracion_minutos,
        precio: selectedService.precio,
        sedeId: selectedSede.id,
        sedeNombre: selectedSede.nombre,
        fecha: selectedDate,
        horaInicio: selectedTime,
        notas,
      });

      setIsModalOpen(false);
      setBookingSuccess(created);
    } catch {
      // El error ya es mostrado por el hook via Toast
    }
  };

  if (catalogLoading) {
    return <Spinner text="Cargando sedes y catálogo de Punto Corte..." />;
  }

  // Pantalla de Éxito al completar el agendamiento
  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-3xl border border-brand-500/40 bg-dark-900 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-extrabold text-white">¡Cita Agendada Exitosamente!</h2>
          <p className="text-sm text-slate-300 mt-2">
            Te esperamos en <strong className="text-brand-400">{bookingSuccess.sede_nombre || selectedSede?.nombre}</strong> el día{' '}
            <strong className="text-white">{bookingSuccess.fecha}</strong> a las{' '}
            <strong className="text-brand-400">{bookingSuccess.hora_inicio}</strong>.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-dark-950 border border-slate-800 text-left text-xs space-y-2 text-slate-300">
            <p><strong>Servicio:</strong> {bookingSuccess.servicio_nombre || selectedService?.nombre}</p>
            <p><strong>Profesional:</strong> {bookingSuccess.profesional_nombre || selectedProfessional?.nombre}</p>
            <p><strong>Sede:</strong> {bookingSuccess.sede_nombre || selectedSede?.nombre}</p>
            <p><strong>Estado:</strong> <span className="text-emerald-400 font-semibold uppercase">Confirmada</span></p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => {
                setBookingSuccess(null);
                setSelectedTime(null);
              }}
            >
              Agendar Otra Cita
            </Button>
            {isAuthenticated ? (
              <Button variant="secondary" onClick={() => navigate('/mis-citas')}>
                Ir a Mis Citas
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Iniciar Sesión para Administrar Citas
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Encabezado */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2.5">
          <Calendar className="w-8 h-8 text-brand-400" />
          Agendamiento de Citas en Línea
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Completa los 4 pasos para reservar tu espacio con confirmación inmediata y validación anti-traslapes.
        </p>
      </div>

      {/* PASO 1: SELECCIONAR SEDE */}
      <section className="p-6 rounded-3xl border border-slate-800 bg-dark-900/40">
        <SedeSelector
          sedes={sedes}
          selectedSedeId={selectedSede?.id}
          onSelectSede={handleSelectSede}
        />
      </section>

      {/* PASO 2: SELECCIONAR SERVICIO */}
      {selectedSede && (
        <section className="p-6 rounded-3xl border border-slate-800 bg-dark-900/40 space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-bold">2</span>
                Selecciona el Servicio
              </h3>
              <p className="text-sm text-slate-400 mt-1">Elige el procedimiento que deseas realizarte.</p>
            </div>

            {/* Filtros de categoría */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === null
                    ? 'bg-brand-500 text-dark-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('Barbería')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === 'Barbería'
                    ? 'bg-brand-500 text-dark-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Barbería
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('Uñas')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === 'Uñas'
                    ? 'bg-brand-500 text-dark-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Uñas & Spa
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicios.map((srv) => (
              <ServiceCard
                key={srv.id}
                service={srv}
                isSelected={selectedService?.id === srv.id}
                onSelect={handleSelectService}
              />
            ))}
          </div>
        </section>
      )}

      {/* PASO 3: SELECCIONAR PROFESIONAL */}
      {selectedSede && selectedService && (
        <section className="p-6 rounded-3xl border border-slate-800 bg-dark-900/40 animate-fade-in">
          <ProfessionalSelector
            profesionales={profesionales}
            selectedProfId={selectedProfessional?.id}
            onSelectProfessional={handleSelectProfessional}
            sedeNombre={selectedSede.nombre}
          />
        </section>
      )}

      {/* PASO 4: SELECCIONAR HORARIO */}
      {selectedSede && selectedService && selectedProfessional && (
        <section className="p-6 rounded-3xl border border-slate-800 bg-dark-900/40 animate-fade-in">
          <TimeSlotPicker
            fecha={selectedDate}
            onFechaChange={setSelectedDate}
            slots={slots}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            loading={slotsLoading}
            profesionalNombre={selectedProfessional.nombre}
          />
        </section>
      )}

      {/* BOTÓN FLOTANTE O INFERIOR DE CONTINUAR */}
      {selectedTime && (
        <div className="sticky bottom-6 z-30 p-4 rounded-2xl bg-dark-900/95 border border-brand-500/50 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-once">
          <div>
            <h4 className="font-bold text-white text-sm">Resumen Preliminar de Selección</h4>
            <p className="text-xs text-brand-300">
              {selectedSede.nombre} • {selectedService.nombre} • {selectedProfessional.nombre} • {selectedDate} ({selectedTime})
            </p>
          </div>
          <Button
            size="lg"
            variant="primary"
            onClick={handleOpenSummary}
            icon={ChevronRight}
          >
            Revisar y Confirmar Cita
          </Button>
        </div>
      )}

      {/* Modal de confirmación */}
      <BookingSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookingData={{
          sede: selectedSede,
          servicio: selectedService,
          profesional: selectedProfessional,
          fecha: selectedDate,
          horaInicio: selectedTime,
          clienteNombre: profile?.nombre || 'Cliente',
        }}
        onConfirm={handleConfirmBooking}
        loading={bookingLoading}
      />
    </div>
  );
}
