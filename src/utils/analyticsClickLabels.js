/**
 * Convierte targetName de analíticas (CLICK) en texto legible para el panel admin.
 * Los valores crudos se guardan igual en la API; solo cambia la presentación.
 */

const EXACT = {
  'PrivateClub|vista_landing': 'Acceso reservado · Primera carga de la landing',
  'PrivateClub|encuesta_enviada': 'Acceso reservado · Encuesta de interés enviada',
  'PrivateClub|salir_inicio': 'Acceso reservado · Volver al inicio',
  'PrivateClubPortal|click_logo_hero': 'Portal Tacones (hero) · Clic en el logo',
  'PrivateClubPortal|click_logo_esquina': 'Portal Tacones (esquina) · Clic en el logo',
  'GuideBot|panel_abrir': 'Guía Kallpa · Abrir panel del asistente',
  'GuideBot|link_nexusstay': 'Guía Kallpa · Enlace a Nexus Stay',
  'GuideBot|link_nexussport': 'Guía Kallpa · Enlace a Nexus Sport',
  'GuideBot|link_nexuscare': 'Guía Kallpa · Enlace a Nexus Care',
  'GuideBot|reiniciar': 'Guía Kallpa · Reiniciar conversación',
  'NexusStay|boton_preinscripcion': 'Nexus Stay · Botón de preinscripción / lead',
  'NexusSport|boton_preinscripcion': 'Nexus Sport · Botón de preinscripción / lead',
  'NexusSport|reserva_mock_cerrar_sin_enviar': 'Nexus Sport · Cerrar reserva demo sin enviar',
  'NexusSport|reserva_mock_cancelar': 'Nexus Sport · Cancelar reserva demo',
  'NexusCare|boton_preinscripcion': 'Nexus Care · Preinscripción / lead',
  'NexusCare|agenda_ver_detalle': 'Nexus Care · Ver detalle de agenda (demo)',
  'NexusCare|servicios_ver_politicas': 'Nexus Care · Políticas cancelación / no presentado',
  'NexusCare|panel_recepcion_mock': 'Nexus Care · Vista recepción (mock)',
  'NexusCare|link_nexusstay': 'Nexus Care · Enlace a Nexus Stay',
  'NexusCare|link_nexussport': 'Nexus Care · Enlace a Nexus Sport',
};

const NEED_LABELS = {
  stay_hotel: 'Hotel u hostal tradicional',
  stay_airbnb: 'Airbnb / renta corta',
  stay_lodge: 'Casa de campo / lodge',
  sport: 'Complejo deportivo',
  care: 'Clínica / spa / citas',
  gear: 'Alquiler de maquinaria / flota',
};

function guideNeedLabel(id) {
  return NEED_LABELS[id] ?? id?.replace(/_/g, ' ') ?? '';
}

/**
 * @param {string} raw
 * @returns {{ label: string; title: string }}
 */
export function describeAnalyticsClick(raw) {
  const title = typeof raw === 'string' ? raw : '';
  if (!title) return { label: '—', title: '' };

  if (EXACT[title]) return { label: EXACT[title], title };

  if (title.startsWith('PrivateClub|carousel_manual|')) {
    const n = title.split('|')[2];
    return { label: `Acceso reservado · Cambio manual del carrusel (slide ${n})`, title };
  }

  if (title.startsWith('GuideBot|necesidad|')) {
    const id = title.split('|')[2];
    return { label: `Guía Kallpa · Tipo de negocio elegido: ${guideNeedLabel(id)}`, title };
  }

  if (title.startsWith('GuideBot|preinscripcion|')) {
    const sector = title.split('|')[2];
    return { label: `Guía Kallpa · Preinscripción (${sector})`, title };
  }

  if (title.startsWith('NexusCare|checklist|')) {
    const key = title.split('|').slice(2).join(' · ');
    return { label: `Nexus Care · Requisito marcado: ${key.replace(/_/g, ' ')}`, title };
  }

  if (title.startsWith('NexusStay|checklist|')) {
    const key = title.split('|').slice(2).join(' · ');
    return { label: `Nexus Stay · Casilla de checklist: ${key.replace(/_/g, ' ')}`, title };
  }

  if (title.startsWith('NexusSport|calendario_pestana|')) {
    const name = title.split('|')[2];
    return { label: `Nexus Sport · Pestaña del calendario: ${name}`, title };
  }

  if (title.startsWith('NexusSport|calendario_celda_libre|')) {
    const parts = title.split('|');
    const court = parts[2] ?? '';
    const day = parts[3] ?? '';
    const hour = parts[4] ?? '';
    return {
      label: `Nexus Sport · Celda libre (abrir formulario): ${court}, ${day}, ${hour}`,
      title,
    };
  }

  if (title.startsWith('NexusSport|reserva_mock_enviar|')) {
    const parts = title.split('|');
    return {
      label: `Nexus Sport · Envío formulario reserva demo: ${parts.slice(2, 6).join(', ')}`,
      title,
    };
  }

  if (title.startsWith('NexusSport|reserva_mock_confirmada|')) {
    const parts = title.split('|');
    return {
      label: `Nexus Sport · Reserva demo confirmada: ${parts.slice(2, 5).join(', ')}`,
      title,
    };
  }

  const pretty = title
    .replace(/\|/g, ' → ')
    .replace(/_/g, ' ')
    .replace(/\bNexusCare\b/gi, 'Nexus Care')
    .replace(/\bNexusSport\b/gi, 'Nexus Sport')
    .replace(/\bNexusStay\b/gi, 'Nexus Stay')
    .replace(/\bPrivateClubPortal\b/gi, 'Portal Tacones')
    .replace(/\bPrivateClub\b/gi, 'Acceso reservado')
    .replace(/\bGuideBot\b/gi, 'Guía Kallpa');

  return { label: pretty, title };
}
