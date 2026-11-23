import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
  !supabaseAnonKey.includes('ejemplo')
);

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ [Punto Corte] Supabase no está configurado aún o usa credenciales de ejemplo. ' +
    'Por favor configura las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env'
  );
}

// Instancia Singleton del cliente Supabase
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
