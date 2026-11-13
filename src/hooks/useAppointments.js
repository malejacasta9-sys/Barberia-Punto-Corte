import { useState, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';
import { useToast } from '../context/ToastContext';

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: toastError } = useToast();

  const fetchClientAppointments = useCallback(async (clienteId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getClientAppointments(clienteId);
      setAppointments(data);
      return data;
    } catch (err) {
      setError(err.message);
      toastError(err.message, 'Error al cargar citas');
      return [];
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  const fetchProfessionalAgenda = useCallback(async (profesionalId, fecha = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getProfessionalAppointments(profesionalId, fecha);
      setAppointments(data);
      return data;
    } catch (err) {
      setError(err.message);
      toastError(err.message, 'Error al cargar agenda');
      return [];
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  const fetchAllAppointments = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAllAppointments(filters);
      setAppointments(data);
      return data;
    } catch (err) {
      setError(err.message);
      toastError(err.message, 'Error al cargar citas');
      return [];
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  const bookAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    try {
      const created = await appointmentService.createAppointment(appointmentData);
      success('¡Tu cita ha sido agendada con éxito en Punto Corte!', 'Cita Confirmada');
      return created;
    } catch (err) {
      toastError(err.message, 'No se pudo agendar la cita');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, toastError]);

  const updateStatus = useCallback(async (citaId, nuevoEstado) => {
    try {
      await appointmentService.updateStatus(citaId, nuevoEstado);
      setAppointments((prev) =>
        prev.map((item) => (item.id === citaId ? { ...item, estado: nuevoEstado } : item))
      );
      success(`Cita marcada como "${nuevoEstado}".`);
      return true;
    } catch (err) {
      toastError(err.message, 'Error al actualizar cita');
      return false;
    }
  }, [success, toastError]);

  return {
    appointments,
    loading,
    error,
    fetchClientAppointments,
    fetchProfessionalAgenda,
    fetchAllAppointments,
    bookAppointment,
    updateStatus,
  };
}
