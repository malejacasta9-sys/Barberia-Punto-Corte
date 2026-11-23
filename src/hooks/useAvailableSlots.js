import { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { generateDaySlots, addMinutesToTime, isOverlapping } from '../utils/dateUtils';

export function useAvailableSlots(profesionalId, fecha, duracionMinutos = 30) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profesionalId || !fecha) {
      setSlots([]);
      return;
    }

    let isMounted = true;

    async function calculateSlots() {
      setLoading(true);
      setError(null);
      try {
        const occupied = await appointmentService.getOccupiedSlots(profesionalId, fecha);
        
        // Generar slots de 9:00 a 20:00 cada 30 minutos
        const allBaseSlots = generateDaySlots(30);

        const calculatedSlots = allBaseSlots.map((slot) => {
          const slotHoraFin = addMinutesToTime(slot.time, duracionMinutos);
          
          // Verificar si excede las 8:00 p.m. (20:00:00)
          const exceedsClosing = slotHoraFin > '20:00:00';

          // Verificar si solapa con alguna cita ya existente
          const hasConflict = occupied.some((occ) =>
            isOverlapping(slot.time, slotHoraFin, occ.hora_inicio, occ.hora_fin)
          );

          // Verificar si es en el pasado para el día de hoy
          const todayIso = new Date().toISOString().split('T')[0];
          let isPastTime = false;
          if (fecha === todayIso) {
            const now = new Date();
            const currentH = now.getHours();
            const currentM = now.getMinutes();
            const currentTimeStr = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}:00`;
            if (slot.time <= currentTimeStr) {
              isPastTime = true;
            }
          }

          const available = !exceedsClosing && !hasConflict && !isPastTime;

          return {
            time: slot.time,
            label: slot.label,
            available,
            reason: exceedsClosing
              ? 'Excede hora de cierre'
              : hasConflict
              ? 'Horario ya ocupado'
              : isPastTime
              ? 'Horario pasado'
              : null,
          };
        });

        if (isMounted) {
          setSlots(calculatedSlots);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error calculando slots libres:', err);
          setError(err.message || 'Error al obtener disponibilidad');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    calculateSlots();

    return () => {
      isMounted = false;
    };
  }, [profesionalId, fecha, duracionMinutos]);

  return { slots, loading, error };
}
