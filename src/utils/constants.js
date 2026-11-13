export const ROLES = {
  CLIENTE: 'cliente',
  PROFESIONAL: 'profesional',
  CAJERA: 'cajera',
  ADMIN: 'admin',
};

export const ESTADOS_CITA = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  ATENDIDA: 'atendida',
  CANCELADA: 'cancelada',
};

export const ESTADO_COLORS = {
  pendiente: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  confirmada: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  atendida: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  cancelada: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export const HORARIO_NEGOCIO = {
  APERTURA_HORA: 9, // 9:00 a.m.
  CIERRE_HORA: 20,  // 8:00 p.m.
  INTERVALO_MINUTOS: 15,
};

export const HABEAS_DATA_POLICY_VERSION = 'v1.0-2025';
export const HABEAS_DATA_TEXT = `En cumplimiento de la Ley Estatutaria 1581 de 2012 y sus decretos reglamentarios, autorizo de manera libre, previa, expresa e informada a "Punto Corte" para recolectar, almacenar y tratar mis datos personales para fines de gestión de citas, confirmaciones de servicio y atención al cliente.`;
