import api from '../api/cliente';

export const useAnalytics = () => {
  const trackClick = async (elemento, sector, options = {}) => {
    try {
      const path = typeof window !== 'undefined' ? window.location.pathname : null;
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
