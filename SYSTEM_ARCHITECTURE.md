# SYSTEM_ARCHITECTURE.md
## Arquitectura de Software - Plataforma Web "Punto Corte"

Este documento describe la arquitectura global del sistema, el flujo de datos, el modelo de autenticación y autorización basado en roles (RBAC) y la estrategia de infraestructura a costo cero ($0 USD).

---

### 1. Diagrama de Arquitectura Global

```mermaid
flowchart TD
    subgraph Cliente ["Frontend: React (Vite SPA) - Vercel ($0 USD)"]
        UI["UI / Tailwind CSS (Mobile-First)"]
        Router["React Router (Rutas Públicas & Protegidas)"]
        AuthCtx["AuthContext (Manejo de Sesión)"]
        BookingCtx["BookingContext / Custom Hooks"]
        SupaClient["Supabase JS Client (Singleton)"]
        
        UI --> Router
        Router --> AuthCtx
        Router --> BookingCtx
        AuthCtx --> SupaClient
        BookingCtx --> SupaClient
    end

    subgraph Supabase ["Backend Serverless: Supabase ($0 USD)"]
        AuthSvc["Supabase Auth (JWT & Refresh Token)"]
        Postgres["PostgreSQL Database (Engine)"]
        RLS["Row Level Security (RLS Engine)"]
        Triggers["Triggers & Funciones Anti-Traslape"]
        
        SupaClient -- "HTTPS / WSS (REST / Realtime)" --> AuthSvc
        SupaClient -- "HTTPS (PostgREST)" --> RLS
        RLS --> Postgres
        Triggers --> Postgres
    end

    subgraph Usuarios ["Actores del Negocio"]
        ClienteUser["Cliente (Web/Móvil)"]
        ProfUser["Barbero / Manicurista"]
        CajeraUser["Cajera (Presencial/Teléfono)"]
        AdminUser["Propietarias (Admin)"]
    end

    ClienteUser --> UI
    ProfUser --> UI
    CajeraUser --> UI
    AdminUser --> UI
```

---

### 2. Flujo de Autenticación y Autorización (RBAC)

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant React as React Frontend
    participant AuthContext as AuthContext
    participant SupaAuth as Supabase Auth
    participant Profiles as Tabla public.profiles

    Usuario->>React: Ingresa credenciales (email + contraseña)
    React->>SupaAuth: signInWithPassword(email, password)
    SupaAuth-->>React: Sesión válida (JWT + user.id)
    React->>Profiles: SELECT rol, nombre, telefono WHERE id = user.id
    Profiles-->>React: Datos de perfil + rol ('cliente' | 'profesional' | 'cajera' | 'admin')
    React->>AuthContext: Guarda estado global { user, profile, rol, isAuthenticated }
    AuthContext->>React: Redirige según Rol a la vista autorizada
```

---

### 3. Flujo de Agendamiento y Prevención de Traslapes

```mermaid
sequenceDiagram
    autonumber
    actor Cliente
    participant SPA as Frontend (React)
    participant PostgREST as Supabase API
    participant Trigger as Trigger PostgreSQL (fn_check_cita_overlap)
    participant DB as Tabla public.citas

    Cliente->>SPA: Selecciona Sede, Servicio y Profesional
    SPA->>PostgREST: Consulta citas existentes para la fecha seleccionada
    PostgREST-->>SPA: Franjas ocupadas
    SPA->>SPA: Filtra TimeSlots disponibles en UI (UX Anticipativa)
    Cliente->>SPA: Elige hora y confirma cita
    SPA->>PostgREST: INSERT INTO public.citas (cliente, prof, servicio, sede, fecha, hora_inicio, hora_fin)
    PostgREST->>Trigger: Ejecuta fn_check_cita_overlap()
    alt Existe traslape en base de datos (concurrencia)
        Trigger-->>SPA: Error 23P01 (Horario ocupado)
        SPA-->>Cliente: Notificación Toast: "El horario acaba de ser ocupado, por favor elija otro."
    else Franja Horaria Libre
        Trigger->>DB: INSERT EXITOSO
        DB-->>SPA: Cita confirmada (ID, datos)
        SPA-->>Cliente: Pantalla de éxito con resumen de cita
    end
```

---

### 4. Estrategia de Infraestructura y Costo Cero ($0 USD)

1. **Vercel Hobby Tier:**
   - Despliegue estático continuo conectado a la rama `main` de GitHub.
   - SSL automático gratis con HTTPS forzado.
   - Redirección `/*` a `/index.html` mediante archivo `vercel.json` para enrutamiento SPA.
2. **Supabase Free Tier:**
   - 500 MB de base de datos PostgreSQL dedicada.
   - 50,000 usuarios activos mensuales en Auth.
   - Backups automáticos y alta disponibilidad sin costo.
   - Seguridad integral gobernada por Row Level Security (RLS).
