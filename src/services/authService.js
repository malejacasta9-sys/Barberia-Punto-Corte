import { supabase } from './supabaseClient';
import { HABEAS_DATA_POLICY_VERSION } from '../utils/constants';

export const authService = {
  /**
   * Registro de nuevo cliente con consentimiento de Habeas Data
   */
  async signUp({ email, password, nombre, telefono, habeasDataAceptado }) {
    if (!habeasDataAceptado) {
      throw new Error('Debe aceptar la política de tratamiento de datos personales (Habeas Data).');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          telefono,
          rol: 'cliente',
          habeas_data_aceptado: true,
          habeas_data_version: HABEAS_DATA_POLICY_VERSION,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Iniciar sesión con email y contraseña
   */
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Cerrar sesión
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Obtiene la sesión actual
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Obtiene el perfil de la tabla profiles por su UUID
   */
  async getProfile(userId) {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error al obtener perfil:', error);
      return null;
    }
    return data;
  },

  /**
   * Actualiza datos del perfil del usuario
   */
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Escucha cambios en el estado de autenticación
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
