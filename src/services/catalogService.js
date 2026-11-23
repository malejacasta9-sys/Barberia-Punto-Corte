import { supabase, isSupabaseConfigured } from './supabaseClient';

// Datos semilla de respaldo para desarrollo local inmediato o si la BD aún no ha sido poblada
export const FALLBACK_SEDES = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    nombre: 'Sede Principal Cañaveral',
    direccion: 'Calle 30 # 25-14, Cañaveral, Floridablanca',
    telefono: '+57 318 000 0001',
    hora_apertura: '09:00:00',
    hora_cierre: '20:00:00',
    activa: true,
    descripcion: 'Especializada en Barbería clásica y contemporánea (4 Barberos)'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    nombre: 'Sede 2 Cañaveral (Uñas & Barbería)',
    direccion: 'Carrera 26 # 29-45, Cañaveral, Floridablanca',
    telefono: '+57 318 000 0002',
    hora_apertura: '09:00:00',
    hora_cierre: '20:00:00',
    activa: true,
    descripcion: 'Espacio integral: Cuidado de uñas Spa y Barbería (1 Barbero + 3 Profesionales de Uñas)'
  }
];

export const FALLBACK_SERVICIOS = [
  {
    id: 's1',
    nombre: 'Corte Clásico / Fade',
    descripcion: 'Corte de cabello personalizado con perfilado de cuello y lavado.',
    duracion_minutos: 45,
    precio: 25000,
    categoria: 'Barbería',
    activo: true,
  },
  {
    id: 's2',
    nombre: 'Arreglo de Barba Tradicional',
    descripcion: 'Diseño y afeitado de barba con toalla caliente y aceites hidratantes.',
    duracion_minutos: 30,
    precio: 18000,
    categoria: 'Barbería',
    activo: true,
  },
  {
    id: 's3',
    nombre: 'Combo Corte + Barba',
    descripcion: 'Servicio completo: corte de cabello de diseño y ritual de barba con toalla caliente.',
    duracion_minutos: 60,
    precio: 38000,
    categoria: 'Barbería',
    activo: true,
  },
  {
    id: 's4',
    nombre: 'Corte Infantil',
    descripcion: 'Corte amigable y paciente para niños menores de 10 años.',
    duracion_minutos: 30,
    precio: 20000,
    categoria: 'Barbería',
    activo: true,
  },
  {
    id: 's5',
    nombre: 'Manicura Tradicional',
    descripcion: 'Limpieza profunda de cutículas, limado, exfoliación y esmaltado tradicional.',
    duracion_minutos: 45,
    precio: 22000,
    categoria: 'Uñas',
    activo: true,
  },
  {
    id: 's6',
    nombre: 'Manicura Semipermanente',
    descripcion: 'Esmaltado de larga duración secado en lámpara UV/LED con diseño básico.',
    duracion_minutos: 60,
    precio: 42000,
    categoria: 'Uñas',
    activo: true,
  },
  {
    id: 's7',
    nombre: 'Pedicura Spa',
    descripcion: 'Exfoliación con sales, remoción de asperezas, masaje relajante y esmaltado.',
    duracion_minutos: 50,
    precio: 30000,
    categoria: 'Uñas',
    activo: true,
  },
  {
    id: 's8',
    nombre: 'Combo Manos y Pies Semipermanente',
    descripcion: 'Servicio completo de manicura y pedicura con esmaltado semipermanente de alta duración.',
    duracion_minutos: 105,
    precio: 75000,
    categoria: 'Uñas',
    activo: true,
  },
];

export const FALLBACK_PROFESIONALES = [
  // Sede Principal: 4 Barberos
  {
    id: 'p1',
    nombre: 'Carlos Mendoza',
    especialidad: 'Barbería & Fade Master',
    sede_id: '11111111-1111-1111-1111-111111111111',
    activo: true,
  },
  {
    id: 'p2',
    nombre: 'Mateo Rodríguez',
    especialidad: 'Barbería Tradicional & Barba',
    sede_id: '11111111-1111-1111-1111-111111111111',
    activo: true,
  },
  {
    id: 'p3',
    nombre: 'Andrés Suárez',
    especialidad: 'Cortes Modernos & Diseños',
    sede_id: '11111111-1111-1111-1111-111111111111',
    activo: true,
  },
  {
    id: 'p4',
    nombre: 'Sebastián Gómez',
    especialidad: 'Estilismo & Cuidado Capilar',
    sede_id: '11111111-1111-1111-1111-111111111111',
    activo: true,
  },
  // Sede 2: 1 Barbero + 3 Profesionales de Uñas
  {
    id: 'p5',
    nombre: 'Diego Rueda',
    especialidad: 'Barbería Integral',
    sede_id: '22222222-2222-2222-2222-222222222222',
    activo: true,
  },
  {
    id: 'p6',
    nombre: 'Camila Duarte',
    especialidad: 'Manicura Semipermanente & Nail Art',
    sede_id: '22222222-2222-2222-2222-222222222222',
    activo: true,
  },
  {
    id: 'p7',
    nombre: 'Valentina Peña',
    especialidad: 'Estructuras en Acrílico y Polygel',
    sede_id: '22222222-2222-2222-2222-222222222222',
    activo: true,
  },
  {
    id: 'p8',
    nombre: 'Tatiana Silva',
    especialidad: 'Pedicura Spa & Cuidado Terapéutico',
    sede_id: '22222222-2222-2222-2222-222222222222',
    activo: true,
  },
];

export const catalogService = {
  /**
   * Obtiene la lista de sedes (activas o todas)
   */
  async getSedes(includeInactive = false) {
    if (!isSupabaseConfigured) return FALLBACK_SEDES;

    try {
      let query = supabase.from('sedes').select('*');
      if (!includeInactive) {
        query = query.eq('activa', true);
      }
      query = query.order('nombre');

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching sedes:', error);
        return FALLBACK_SEDES;
      }
      return data || [];
    } catch {
      return FALLBACK_SEDES;
    }
  },

  /**
   * Obtiene la lista de servicios, opcionalmente filtrados por categoría
   */
  async getServicios(categoria = null, includeInactive = false) {
    if (!isSupabaseConfigured) {
      if (categoria) {
        return FALLBACK_SERVICIOS.filter((s) => s.categoria.toLowerCase() === categoria.toLowerCase());
      }
      return FALLBACK_SERVICIOS;
    }

    try {
      let query = supabase.from('servicios').select('*');
      if (!includeInactive) {
        query = query.eq('activo', true);
      }
      if (categoria) {
        query = query.eq('categoria', categoria);
      }
      query = query.order('categoria').order('nombre');

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching servicios:', error);
        return FALLBACK_SERVICIOS;
      }

      // Filtrar servicios únicos por nombre
      const unique = [];
      const seenNames = new Set();
      for (const item of (data || [])) {
        if (!seenNames.has(item.nombre)) {
          seenNames.add(item.nombre);
          unique.push(item);
        }
      }
      return unique;
    } catch {
      return FALLBACK_SERVICIOS;
    }
  },

  /**
   * Obtiene profesionales, opcionalmente filtrados por sede
   */
  async getProfesionales(sedeId = null, includeInactive = false) {
    if (!isSupabaseConfigured) {
      if (sedeId) {
        return FALLBACK_PROFESIONALES.filter((p) => p.sede_id === sedeId);
      }
      return FALLBACK_PROFESIONALES;
    }

    try {
      let query = supabase
        .from('profesionales')
        .select(`
          id,
          profile_id,
          especialidad,
          sede_id,
          activo,
          profiles (
            id,
            nombre,
            telefono
          )
        `);

      if (!includeInactive) {
        query = query.eq('activo', true);
      }
      if (sedeId) {
        query = query.eq('sede_id', sedeId);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        if (sedeId) {
          return FALLBACK_PROFESIONALES.filter((p) => p.sede_id === sedeId);
        }
        return FALLBACK_PROFESIONALES;
      }

      return data.map((item) => ({
        id: item.id,
        profile_id: item.profile_id || item.profiles?.id,
        nombre: item.profiles?.nombre || 'Profesional',
        telefono: item.profiles?.telefono || '',
        especialidad: item.especialidad,
        sede_id: item.sede_id,
        activo: item.activo,
      }));
    } catch {
      if (sedeId) {
        return FALLBACK_PROFESIONALES.filter((p) => p.sede_id === sedeId);
      }
      return FALLBACK_PROFESIONALES;
    }
  },

  // =========================================================================
  // OPERACIONES CRUD DE ADMINISTRACIÓN (SOLO ADMIN)
  // =========================================================================

  // --- SERVICIOS ---
  async createServicio(servicioData) {
    const { data, error } = await supabase
      .from('servicios')
      .insert([servicioData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateServicio(id, updates) {
    const { data, error } = await supabase
      .from('servicios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteServicio(id) {
    const { error } = await supabase
      .from('servicios')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // --- SEDES ---
  async createSede(sedeData) {
    const { data, error } = await supabase
      .from('sedes')
      .insert([sedeData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateSede(id, updates) {
    const { data, error } = await supabase
      .from('sedes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteSede(id) {
    const { error } = await supabase
      .from('sedes')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // --- PROFESIONALES ---
  async createProfesional(profData) {
    const { data, error } = await supabase.rpc('admin_create_profesional', {
      p_nombre: profData.nombre,
      p_email: profData.email,
      p_telefono: profData.telefono || '',
      p_sede_id: profData.sede_id,
      p_especialidad: profData.especialidad,
      p_password: profData.password || 'Barbero123456*'
    });
    if (error) throw error;
    return data;
  },

  async updateProfesional(id, { especialidad, sede_id, activo, nombre, telefono, profile_id }) {
    const { data: prof, error: profError } = await supabase
      .from('profesionales')
      .update({ especialidad, sede_id, activo })
      .eq('id', id)
      .select()
      .single();
    if (profError) throw profError;

    if (profile_id && (nombre || telefono)) {
      await supabase
        .from('profiles')
        .update({ nombre, telefono })
        .eq('id', profile_id);
    }
    return prof;
  },

  async deleteProfesional(id) {
    const { error } = await supabase
      .from('profesionales')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
};
