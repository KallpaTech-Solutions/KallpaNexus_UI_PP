import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/cliente';

/** Registra una visita por ruta (mapa de calor / páginas más vistas). */
export default function PageVisitTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname || '/';
    const deviceType =
      typeof window !== 'undefined' && window.innerWidth < 768 ? 'Móvil' : 'Escritorio';
    void api
      .post('/analytics/track', {
        eventType: 'VISIT',
        targetName: path,
        sector: null,
        url: path,
        deviceType,
      })
      .catch(() => {});
  }, [location.pathname]);

  return null;
}
