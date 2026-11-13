import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { authService } from '../services/authService';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializar sesión
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // Si Supabase no está configurado, chequear si hay un usuario mock en localStorage
      if (!isSupabaseConfigured) {
        const localMock = localStorage.getItem('punto_corte_mock_user');
        if (localMock && mounted) {
          try {
            const parsed = JSON.parse(localMock);
            setUser(parsed.user);
            setProfile(parsed.profile);
          } catch (e) {
            console.error('Error restaurando mock session:', e);
          }
        }
        if (mounted) setLoading(false);
        return;
      }

      try {
        const session = await authService.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          const prof = await authService.getProfile(session.user.id);
          setProfile(prof);
        }
      } catch (err) {
        console.error('Error inicializando autenticación:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Listener de cambios de auth en Supabase
    let subscription = null;
    if (isSupabaseConfigured) {
      const { data } = authService.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const prof = await authService.getProfile(session.user.id);
          setProfile(prof);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Iniciar sesión
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Mock Login para pruebas locales inmediatas
        let mockRole = ROLES.CLIENTE;
        let mockName = 'Cliente Demo';
        if (email.includes('admin')) {
          mockRole = ROLES.ADMIN;
          mockName = 'Administradora Punto Corte';
        } else if (email.includes('cajera')) {
          mockRole = ROLES.CAJERA;
          mockName = 'Cajera Cañaveral';
        } else if (email.includes('barbero') || email.includes('pro')) {
          mockRole = ROLES.PROFESIONAL;
          mockName = 'Carlos Mendoza (Barbero)';
        }

        const mockUser = { id: 'mock-user-' + mockRole, email };
        const mockProfile = {
          id: mockUser.id,
          nombre: mockName,
          telefono: '3180000000',
          rol: mockRole,
        };

        localStorage.setItem('punto_corte_mock_user', JSON.stringify({ user: mockUser, profile: mockProfile }));
        setUser(mockUser);
        setProfile(mockProfile);
        return { user: mockUser, profile: mockProfile };
      }

      const data = await authService.signIn({ email, password });
      const prof = await authService.getProfile(data.user.id);
      setUser(data.user);
      setProfile(prof);
      return { user: data.user, profile: prof };
    } finally {
      setLoading(false);
    }
  };

  // Registro
  const register = async ({ email, password, nombre, telefono, habeasDataAceptado }) => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        const mockUser = { id: 'mock-client-' + Date.now(), email };
        const mockProfile = {
          id: mockUser.id,
          nombre,
          telefono,
          rol: ROLES.CLIENTE,
        };
        localStorage.setItem('punto_corte_mock_user', JSON.stringify({ user: mockUser, profile: mockProfile }));
        setUser(mockUser);
        setProfile(mockProfile);
        return { user: mockUser, profile: mockProfile };
      }

      const data = await authService.signUp({ email, password, nombre, telefono, habeasDataAceptado });
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Switch rápido de rol en modo Demo para pruebas del usuario
  const switchDemoRole = (role) => {
    const names = {
      cliente: 'Mariana Silva (Cliente)',
      profesional: 'Carlos Mendoza (Barbero Master)',
      cajera: 'Yuliana Gómez (Cajera Sede Principal)',
      admin: 'Dra. María & Socias (Administración)',
    };
    const mockUser = { id: 'demo-' + role, email: `${role}@puntocorte.com` };
    const mockProfile = {
      id: mockUser.id,
      nombre: names[role] || 'Usuario Demo',
      telefono: '3187654321',
      rol: role,
    };
    localStorage.setItem('punto_corte_mock_user', JSON.stringify({ user: mockUser, profile: mockProfile }));
    setUser(mockUser);
    setProfile(mockProfile);
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await authService.signOut();
      }
    } finally {
      localStorage.removeItem('punto_corte_mock_user');
      setUser(null);
      setProfile(null);
    }
  };

  const rol = profile?.rol || (user ? ROLES.CLIENTE : null);

  const value = {
    user,
    profile,
    rol,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    switchDemoRole,
    isSupabaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
