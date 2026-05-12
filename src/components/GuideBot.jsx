import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  X,
  ChevronRight,
  Sparkles,
  Bed,
  Trophy,
  HeartPulse,
  Tractor,
  MessageCircle,
} from 'lucide-react';
import LeadModal from './LeadModal';
import api from '../api/cliente';
import { getClientPathname } from '../utils/appPath';

const NEED_OPTIONS = [
  { id: 'stay_hotel', label: 'Hotel u hostal tradicional', sector: 'Stay', hint: 'Muchas habitaciones y recepción' },
  { id: 'stay_airbnb', label: 'Airbnb o departamentos en renta corta', sector: 'Stay', hint: 'Pocas unidades, flujo digital' },
  { id: 'stay_lodge', label: 'Casa de campo, cabañas o lodge rural', sector: 'Stay', hint: 'Lodge = hotel pequeño en naturaleza; suele incluir tours o comidas' },
  { id: 'sport', label: 'Complejo o espacios deportivos', sector: 'Sport', hint: 'Canchas, bar, agenda' },
  { id: 'care', label: 'Clínica, spa o agenda de citas', sector: 'Care', hint: 'Citas y recordatorios' },
  { id: 'gear', label: 'Alquiler de maquinaria o flota', sector: 'Gear', hint: 'Activos y contratos' },
];

const BENEFITS_BY_SECTOR = {
  Stay: [
    'Un solo calendario: al confirmar pago o garantía, esa fecha queda bloqueada y no se vende dos veces.',
    'Sabes si cada habitación está ocupada, pendiente de limpieza o lista para el siguiente huésped.',
    'Recepción con llave física o check-in digital con código, según tu tipo de negocio.',
  ],
  Sport: [
    'Vista de ocupación por espacio y registro de interés en reservas.',
    'Separación clara entre uso recreativo y bloques largos tipo evento.',
    'Base para bar, tienda y reportes sin mezclar con módulos de hospedaje.',
  ],
  Care: [
    'Agenda centralizada y historial por cliente.',
    'Menos ausencias con confirmaciones por el canal preferido.',
  ],
  Gear: [
    'Disponibilidad y mantenimiento alineados al contrato de alquiler.',
    'Visibilidad de rentabilidad por activo.',
  ],
};

async function trackBot(targetName) {
  try {
    await api.post('/analytics/track', {
      eventType: 'CLICK',
      targetName: `GuideBot|${targetName}`,
      sector: null,
      url: typeof window !== 'undefined' ? getClientPathname('/') : '/',
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Móvil' : 'Escritorio',
    });
  } catch {
    /* silencioso */
  }
}

export default function GuideBot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadSector, setLeadSector] = useState('Stay');

  const reset = useCallback(() => {
    setStep(0);
    setChoice(null);
  }, []);

  const closePanel = () => {
    setOpen(false);
    reset();
  };

  const pickNeed = (opt) => {
    setChoice(opt);
    setStep(1);
    void trackBot(`necesidad|${opt.id}`);
  };

  const openLead = (sector) => {
    setLeadSector(sector);
    setLeadOpen(true);
    void trackBot(`preinscripcion|${sector}`);
  };

  const benefits = choice ? BENEFITS_BY_SECTOR[choice.sector] ?? BENEFITS_BY_SECTOR.Stay : [];

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) void trackBot('panel_abrir');
        }}
        className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/30 ring-4 ring-white/90 transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-400"
        aria-label="Abrir asistente KallpaNexus"
      >
        <Bot className="h-7 w-7" aria-hidden />
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-5 z-[85] w-[min(100vw-2.5rem,22rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guidebot-title"
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p id="guidebot-title" className="text-sm font-bold text-slate-900">
                  Asistente KallpaNexus
                </p>
                <p className="text-[11px] text-slate-500">Pretotipo — sin pagos en línea</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closePanel}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-white/80 hover:text-slate-800"
              aria-label="Cerrar asistente"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[min(70vh,26rem)] space-y-4 overflow-y-auto p-4 text-sm text-slate-700">
            {step === 0 && (
              <>
                <p>Hola. Soy un asistente guiado (no un chat con IA). En dos pasos te oriento según tu tipo de operación.</p>
                <p className="font-semibold text-slate-900">¿Qué necesidad cubres hoy?</p>
                <ul className="space-y-2">
                  {NEED_OPTIONS.map((opt) => (
                    <li key={opt.id}>
                      <button
                        type="button"
                        onClick={() => pickNeed(opt)}
                        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-medium text-slate-800 transition hover:border-violet-200 hover:bg-violet-50/60"
                      >
                        <span>
                          {opt.label}
                          <span className="mt-0.5 block text-[11px] font-normal text-slate-500">{opt.hint}</span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-violet-500" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {step === 1 && choice && (
              <>
                <p className="text-slate-600">
                  Para <span className="font-semibold text-slate-900">{choice.label}</span>, KallpaNexus encaja como
                  capa operativa y de medición:
                </p>
                <ul className="space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-[13px] text-emerald-950">
                  {benefits.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {choice.sector === 'Stay' && (
                  <p className="text-xs text-slate-500">
                    Puedes revisar el prototipo de flujo y checklist en{' '}
                    <Link to="/nexusstay" className="font-semibold text-violet-700 underline-offset-2 hover:underline">
                      Nexus Stay
                    </Link>
                    .
                  </p>
                )}
                {choice.sector === 'Sport' && (
                  <p className="text-xs text-slate-500">
                    Demo operativa en{' '}
                    <Link to="/nexussport" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">
                      Nexus Sport
                    </Link>
                    .
                  </p>
                )}
                {choice.sector === 'Care' && (
                  <p className="text-xs text-slate-500">
                    Vista clínica / agenda en{' '}
                    <Link to="/nexuscare" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
                      Nexus Care
                    </Link>
                    .
                  </p>
                )}

                <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
                  <p className="font-semibold text-slate-900">Siguiente paso</p>
                  <button
                    type="button"
                    onClick={() => openLead(choice.sector)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-sm font-bold text-white shadow-md hover:from-violet-700 hover:to-fuchsia-700"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Pre inscribirme — {choice.sector}
                  </button>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <Link
                      to="/nexusstay"
                      onClick={() => void trackBot('link_nexusstay')}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 font-medium text-sky-800 hover:bg-sky-50"
                    >
                      <Bed className="h-3 w-3" aria-hidden />
                      Stay
                    </Link>
                    <Link
                      to="/nexussport"
                      onClick={() => void trackBot('link_nexussport')}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 font-medium text-emerald-800 hover:bg-emerald-50"
                    >
                      <Trophy className="h-3 w-3" aria-hidden />
                      Sport
                    </Link>
                    <Link
                      to="/nexuscare"
                      onClick={() => void trackBot('link_nexuscare')}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 font-medium text-teal-900 hover:bg-teal-50"
                    >
                      <HeartPulse className="h-3 w-3" aria-hidden />
                      Care
                    </Link>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 px-2 py-1 text-slate-400">
                      <Tractor className="h-3 w-3" aria-hidden />
                      Gear (pronto)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      void trackBot('reiniciar');
                    }}
                    className="text-xs font-medium text-violet-700 underline-offset-2 hover:underline"
                  >
                    Volver al inicio del asistente
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <LeadModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} selectedSector={leadSector} />
    </>
  );
}
