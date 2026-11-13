import { supabase, isSupabaseConfigured } from './supabaseClient';
import { addMinutesToTime, isOverlapping } from '../utils/dateUtils';

// Almacén en memoria de citas simuladas cuando Supabase no está conectado
const LOCAL_CITAS_STORAGE_KEY = 'punto_corte_local_citas';

function getLocalCitas() {
  try {
    const raw = localStorage.getItem(LOCAL_CITAS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCitas(citas) {
  try {
    localStorage.setItem(LOCAL_CITAS_STORAGE_KEY, JSON.stringify(citas));
  } catch (err) {
    console.error('Error al guardar citas locales:', err);
  }
}

export const appointmentService = {
  /**
   * Obtiene las citas ocupadas de un profesional en una fecha para evitar traslapes en el frontend
   */
  async getOccupiedSlots(profesionalId, fecha) {
    if (!isSupabaseConfigured) {
      const local = getLocalCitas();
      return local
        .filter(
          (c) =>
            c.profesional_id === profesionalId &&
            c.fecha === fecha &&
            c.estado !== 'cancelada'
        )
        .map((c) => ({
          hora_inicio: c.hora_inicio,
          hora_fin: c.hora_fin,
        }));
    }

    try {
      const { data, error } = await supabase
        .from('citas')
        .select('hora_inicio, hora_fin')
        .eq('profesional_id', profesionalId)
        .eq('fecha', fecha)
        .neq('estado', 'cancelada');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error al obtener horarios ocupados:', err);
      return [];
    }
  },

  /**
   * Agenda una nueva cita utilizando la función RPC atómica o fallback local
   */
  async createAppointment({
    clienteId,
    clienteNombre,
    profesionalId,
    profesionalNombre,
    servicioId,
    servicioNombre,
    duracionMinutos,
    precio,
    sedeId,
    sedeNombre,
    fecha,
    horaInicio,
    notas = '',
  }) {
    const horaFin = addMinutesToTime(horaInicio, duracionMinutos);

    if (!isSupabaseConfigured) {
      // Validación anti-traslape en almacenamiento local
      const currentCitas = getLocalCitas();
      const hasOverlap = currentCitas.some(
        (c) =>
          c.profesional_id === profesionalId &&
          c.fecha === fecha &&
          c.estado !== 'cancelada' &&
          isOverlapping(horaInicio, horaFin, c.hora_inicio, c.hora_fin)
      );

      if (hasOverlap) {
        throw new Error('El profesional ya tiene una cita agendada en ese horario. Por favor selecciona otra franja.');
      }

      const newCita = {
        id: 'local_' + Date.now(),
        cliente_id: clienteId || 'guest_client',
        cliente_nombre: clienteNombre || 'Cliente Registrado',
        profesional_id: profesionalId,
        profesional_nombre: profesionalNombre,
        servicio_id: servicioId,
        servicio_nombre: servicioNombre,
        duracion_minutos: duracionMinutos,
        precio: precio,
        sede_id: sedeId,
        sede_nombre: sedeNombre,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        estado: 'confirmada',
        notas,
        created_at: new Date().toISOString(),
      };

      currentCitas.push(newCita);
      saveLocalCitas(currentCitas);
      return newCita;
    }

    // Inserción en Supabase (validado por el Trigger SQL tr_check_cita_overlap)
    const { data, error } = await supabase
      .from('citas')
      .insert([
        {
          cliente_id: clienteId,
          profesional_id: profesionalId,
          servicio_id: servicioId,
          sede_id: sedeId,
          fecha,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          estado: 'confirmada',
          notas,
        },
      ])
      .select(`
        *,
        sedes (nombre, direccion),
        servicios (nombre, precio, duracion_minutos),
        profesionales (profile_id, especialidad, profiles(nombre))
      `)
      .single();

    if (error) {
      if (error.code === '23P01' || error.message?.includes('traslape') || error.message?.includes('horario')) {
        throw new Error('Lo sentimos, este horario acaba de ser ocupado. Por favor selecciona otro.');
      }
      throw error;
    }

    return data;
  },

  /**
   * Obtiene las citas del cliente autenticado
   */
  async getClientAppointments(clienteId) {
    if (!isSupabaseConfigured) {
      const local = getLocalCitas();
      return local.filter((c) => c.cliente_id === clienteId || clienteId === 'guest_client');
    }

    const { data, error } = await supabase
      .from('citas')
      .select(`
        *,
        sedes (nombre, direccion),
        servicios (nombre, precio, duracion_minutos),
        profesionales (especialidad, profiles(nombre))
      `)
      .eq('cliente_id', clienteId)
      .order('fecha', { ascending: false })
      .order('hora_inicio', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Obtiene la agenda de un profesional
   */
  async getProfessionalAppointments(profesionalId, fecha = null) {
    if (!isSupabaseConfigured) {
      const local = getLocalCitas();
      return local.filter((c) => {
        const matchesProf = c.profesional_id === profesionalId;
        return fecha ? matchesProf && c.fecha === fecha : matchesProf;
      });
    }

    let query = supabase
      .from('citas')
      .select(`
        *,
        profiles!cliente_id (nombre, telefono),
        sedes (nombre),
        servicios (nombre, duracion_minutos, precio)
      `)
      .eq('profesional_id', profesionalId);

    if (fecha) {
      query = query.eq('fecha', fecha);
    }

    query = query.order('hora_inicio', { ascending: true });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Vista consolidada para Cajera y Administradora
   */
  async getAllAppointments({ sedeId = null, fecha = null, estado = null } = {}) {
    if (!isSupabaseConfigured) {
      let local = getLocalCitas();
      if (sedeId) local = local.filter((c) => c.sede_id === sedeId);
      if (fecha) local = local.filter((c) => c.fecha === fecha);
      if (estado) local = local.filter((c) => c.estado === estado);
      return local;
    }

    let query = supabase
      .from('citas')
      .select(`
        *,
        profiles!cliente_id (nombre, telefono),
        sedes (nombre),
        servicios (nombre, precio, duracion_minutos),
        profesionales (especialidad, profiles(nombre))
      `);

    if (sedeId) query = query.eq('sede_id', sedeId);
    if (fecha) query = query.eq('fecha', fecha);
    if (estado) query = query.eq('estado', estado);

    query = query.order('fecha', { ascending: false }).order('hora_inicio', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Cambiar estado de la cita (confirmada, atendida, cancelada)
   */
  async updateStatus(citaId, nuevoEstado) {
    if (!isSupabaseConfigured) {
      const local = getLocalCitas();
      const index = local.findIndex((c) => c.id === citaId);
      if (index !== -1) {
        local[index].estado = nuevoEstado;
        saveLocalCitas(local);
        return local[index];
      }
      throw new Error('Cita no encontrada.');
    }

    const { data, error } = await supabase
      .from('citas')
      .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
      .eq('id', citaId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
