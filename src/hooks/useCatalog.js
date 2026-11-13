import { useState, useEffect } from 'react';
import { catalogService } from '../services/catalogService';

export function useCatalog(selectedSedeId = null, selectedCategoria = null) {
  const [sedes, setSedes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      setLoading(true);
      setError(null);
      try {
        const [sedesData, serviciosData, profsData] = await Promise.all([
          catalogService.getSedes(),
          catalogService.getServicios(selectedCategoria),
          catalogService.getProfesionales(selectedSedeId),
        ]);

        if (isMounted) {
          setSedes(sedesData);
          setServicios(serviciosData);
          setProfesionales(profsData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error cargando catálogo:', err);
          setError(err.message || 'Error al cargar catálogo');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, [selectedSedeId, selectedCategoria]);

  return {
    sedes,
    servicios,
    profesionales,
    loading,
    error,
  };
}
