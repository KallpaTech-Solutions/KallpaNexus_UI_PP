import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wine } from 'lucide-react';
import api from '../api/cliente';
import { getClientPathname } from '../utils/appPath';

const LOGO = '/tacones/logo.png';

async function trackPortal(targetName) {
  try {
    await api.post('/analytics/track', {
      eventType: 'CLICK',
      targetName: `PrivateClubPortal|${targetName}`,
      sector: null,
      url: typeof window !== 'undefined' ? getClientPathname('/') : '/',
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Móvil' : 'Escritorio',
    });
  } catch {
    /* silencioso */
  }
}

function LogoMark({
  sizeClass = 'h-12 w-12',
  ringClass = 'ring-2 ring-rose-100/90',
  bleed = false,
}) {
  const [logoOk, setLogoOk] = useState(true);
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-full bg-white ${sizeClass} ${
        bleed ? '' : `border border-rose-200/60 ${ringClass} shadow-sm`
      }`}
    >
      {logoOk ? (
        <img
          src={LOGO}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setLogoOk(false)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-950 to-zinc-900">
          <Wine className="h-1/2 w-1/2 text-rose-100/90" aria-hidden />
        </span>
      )}
    </span>
  );
}

/**
 * @param {'hero' | 'corner'} variant — hero: botón visible con logo en la fila de CTAs; corner: acceso extra fijo abajo a la izquierda.
 */
export default function DiscreetTaconesPortal({ variant = 'corner' }) {
  const onNavigate = () => void trackPortal(variant === 'hero' ? 'click_logo_hero' : 'click_logo_esquina');

  if (variant === 'hero') {
    return (
      <Link
        to="/acceso-reservado"
        onClick={onNavigate}
        className="inline-flex items-center gap-3 rounded-xl border-2 border-rose-200/90 bg-gradient-to-b from-white to-rose-50/40 px-4 py-3 shadow-md shadow-rose-900/5 transition hover:border-rose-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50"
        aria-label="Tacones — acceso reservado"
      >
        <LogoMark sizeClass="h-12 w-12" />
        <span className="min-w-0 text-left">
          <span className="block text-sm font-bold tracking-tight text-rose-950">Tacones</span>
          <span className="block text-xs font-medium text-slate-600">Acceso reservado · entrar</span>
        </span>
      </Link>
    );
  }

  return (
    <div className="pointer-events-auto fixed bottom-6 left-6 z-[75]">
      <Link
        to="/acceso-reservado"
        onClick={onNavigate}
        className="group flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-rose-200/80 bg-white shadow-lg shadow-rose-900/10 transition hover:scale-105 hover:border-rose-400 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
        aria-label="Tacones — acceso reservado"
        title="Tacones — acceso reservado"
      >
        <LogoMark sizeClass="h-full w-full" bleed />
      </Link>
    </div>
  );
}
