import api from '../api/cliente';
import { getClientPathname } from '../utils/appPath';

export const useAnalytics = () => {
  const trackClick = async (elemento, sector, options = {}) => {
    try {
      const path = typeof window !== 'undefined' ? getClientPathname() : null;
      await api.post('/analytics/track', {
        eventType: 'CLICK',
        targetName: elemento,
        sector: sector ?? null,
        url: options.url ?? path,
        deviceType:
          options.deviceType ??
          (typeof window !== 'undefined' && window.innerWidth < 768 ? 'Móvil' : 'Escritorio'),
      });
    } catch (error) {
      console.error('Error en analytics:', error);
    }
  };

  return { trackClick };
};
