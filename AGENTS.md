# AGENTS.md / PROJECT_RULES.md
## Sistema de Gestión Web de Citas "Punto Corte" - Bucaramanga (Cañaveral)

Este documento establece las convenciones de arquitectura, desarrollo, seguridad y flujo de trabajo para el proyecto. Todos los agentes y desarrolladores deben regirse por estas pautas.

---

### 1. Convenciones de Código Frontend (React + Vite + Tailwind CSS)

1. **Estructura de Componentes:**
   - Un componente por archivo, nombrado en `PascalCase` (ej. `AppointmentCard.jsx`).
   - Principio de Responsabilidad Única: Separar la lógica de negocio (Custom Hooks) de la presentación visual (Componentes puros).
   - Componentes funcionales con hooks nativos de React (`useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`).
   - Evitar "prop drilling": Usar Context API (`AuthContext`, `BookingContext`) para estados globales.

2. **Custom Hooks:**
   - Nombrados con el prefijo `use` en `camelCase` (ej. `useAppointments.js`, `useAvailableSlots.js`).
   - Encapsular llamadas a Supabase, manejo de loading, error y mutaciones de estado dentro del hook.

3. **Manejo de Estilos con Tailwind CSS:**
   - Estrategia Mobile-First obligatoria (`w-full md:w-1/2 lg:w-1/3`).
   - Paleta de colores coherente con la identidad de marca de "Punto Corte" (tonos sobrios, elegante barbería/nail spa: oscuros premium, dorados/ámbar o neutros cálidos).
   - Componentes accesibles (ARIA labels, contraste de color WCAG AA, focus visible).

4. **Cliente Supabase:**
   - Instancia Singleton en `src/services/supabaseClient.js`.
   - No instanciar `createClient` dentro de componentes React.
   - Las llamadas a base de datos deben estar centralizadas en la capa de servicios (`src/services/`).

5. **Manejo de Errores y Feedback:**
   - Notificaciones toast no bloqueantes para éxito o error.
   - Manejo explícito de estados vacíos (empty states) y estados de carga (skeletons / spinners).
   - Tratamiento de errores amigable al usuario (sin exponer detalles técnicos del backend).

---

### 2. Convenciones de Base de Datos y Supabase (PostgreSQL)

1. **Nomenclatura SQL:**
   - Tablas y columnas en minúsculas y `snake_case` (ej. `hora_inicio`, `cliente_id`, `duracion_minutos`).
   - Claves primarias: `id UUID DEFAULT gen_random_uuid() PRIMARY KEY`.
   - Claves foráneas nombradas como `<entidad_singular>_id` con restricciones `ON DELETE` explícitas.

2. **Seguridad con Row Level Security (RLS):**
   - RLS obligatorio y habilitado en el 100% de las tablas públicas.
   - Las políticas RLS deben seguir el principio de mínimo privilegio.
   - El rol de usuario se determina leyendo la tabla `profiles` mediante una función SQL con `SECURITY DEFINER` para evitar recursión en RLS (`public.get_user_role()`).

3. **Regla de Oro Anti-Traslapes:**
   - La verdad absoluta de disponibilidad reside en PostgreSQL mediante triggers/funciones SQL. El frontend solo anticipa y mejora la experiencia de usuario (UX); la base de datos es quien garantiza la integridad transaccional.

---

### 3. Modelo de Roles (RBAC)

| Rol | Alcance y Permisos |
|---|---|
| **cliente** | Crear cuenta con aceptación Habeas Data; ver catálogo de servicios, sedes y profesionales; agendar citas propias; consultar y cancelar sus citas vigentes. |
| **profesional** | Consultar su agenda diaria/semanal por sede; bloquear horarios o marcar indisponibilidad; visualizar detalles de clientes asignados a su turno. |
| **cajera** | Agendamiento presencial/telefónico para cualquier cliente; control total de la agenda del día por sede; cambiar estados de cita (Confirmada, Atendida, Cancelada). |
| **admin** | Vista global consolidada de ambas sedes; gestión CRUD de sedes, servicios, precios, personal y horarios; métricas operativas. |

---

### 4. Cumplimiento Legal y Normativo

- **Ley 1581 de 2012 (Habeas Data Colombia):**
  - Registro de usuarios requiere consentimiento expreso mediante checkbox obligatorio para tratamiento de datos personales.
  - Registro de auditoría en tabla `habeas_data_logs` con ID de usuario, fecha y versión de términos.

---

### 5. Control de Calidad y Git Workflow

- Ramas descriptivas: `feature/modulo-agendamiento`, `fix/validacion-traslape`.
- Commits semánticos en español o inglés: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`.
- Regla de $0 USD de Presupuesto: No agregar librerías de pago, ni servicios que requieran ingresar tarjetas de crédito para su funcionamiento esencial.
