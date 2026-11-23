/**
 * Utilidades de fecha y franjas horarias para Punto Corte (9:00 AM - 8:00 PM)
 */

/**
 * Convierte un objeto Date a formato ISO YYYY-MM-DD
 */
export function formatDateToISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a formato legible en español
 * Ej: "Sábado, 15 de Febrero"
 */
export function formatFriendlyDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formatea una hora en formato HH:mm (24h) a formato de 12 horas con am/pm
 * Ej: "14:30:00" -> "2:30 p.m."
 */
export function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1] || '00';
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
  const h12 = hours % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

/**
 * Suma minutos a una hora en formato HH:mm:ss y retorna HH:mm:ss
 */
export function addMinutesToTime(timeStr, minutesToAdd) {
  const parts = timeStr.split(':');
  const totalMinutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:00`;
}

/**
 * Genera todos los slots posibles entre las 09:00 y las 20:00 con intervalos dados
 * @param {number} intervalMinutes intervalo entre slots (ej: 30)
 * @returns {Array<{ time: string, label: string }>}
 */
export function generateDaySlots(intervalMinutes = 30) {
  const slots = [];
  const startMinutes = 9 * 60;   // 09:00 a.m.
  const endMinutes = 20 * 60;    // 08:00 p.m.

  for (let m = startMinutes; m < endMinutes; m += intervalMinutes) {
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    const time = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
    slots.push({
      time,
      label: formatTime12h(time),
    });
  }
  return slots;
}

/**
 * Verifica si dos intervalos [start1, end1) y [start2, end2) se solapan
 */
export function isOverlapping(start1, end1, start2, end2) {
  return (start1 < end2 && end1 > start2);
}
