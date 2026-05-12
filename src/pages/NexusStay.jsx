import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bed,
  ChevronRight,
  Building2,
  Home,
  Trees,
  Package,
  ConciergeBell,
  Sparkles,
  CalendarCheck,
  CreditCard,
  ClipboardList,
  Users,
  Brush,
  QrCode,
} from 'lucide-react';
import LeadModal from '../components/LeadModal';
import AnonymousRecommendationsBox from '../components/AnonymousRecommendationsBox';
import api from '../api/cliente';
import { getClientPathname } from '../utils/appPath';

async function trackStay(targetName) {
  try {
    await api.post('/analytics/track', {
      eventType: 'CLICK',
      targetName: `NexusStay|${targetName}`,
      sector: 'Stay',
      url: typeof window !== 'undefined' ? getClientPathname('/nexusstay') : '/nexusstay',
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Móvil' : 'Escritorio',
    });
  } catch {
    /* silencioso */
  }
}

const SEGMENTS = [
  {
    title: 'Hoteles y hostales tradicionales',
    icon: Building2,
    text: 'Muchas habitaciones iguales o por categorías, recepción física y rotación alta de personal de limpieza. El sistema prioriza inventario por tipo, turnos y estados de habitación.',
  },
  {
    title: 'Anfitriones en Airbnb, Booking u otras plataformas',
    icon: Home,
    text: 'Departamentos o casas por noches, publicadas en Airbnb, Booking o similares. Pocas unidades, a veces lejos unas de otras. Sin recepción física: confirmación, mensajes y acceso (código o llave) son el centro del proceso.',
  },
  {
    title: 'Casa de campo, cabañas o lodge rural',
    icon: Trees,
    text: 'Aquí “lodge” se refiere a un alojamiento tipo hotel pequeño en zona natural o campo (no es lo mismo que un Airbnb urbano): suele ofrecer propiedad completa o cabañas, más servicios como comidas, tours o fogatas. El sistema contempla paquetes y actividades además de la noche de hospedaje.',
  },
];

const JOURNEY = [
  { title: 'Reserva', desc: 'Fotos reales, precios por temporada y disponibilidad en tiempo real.', icon: CalendarCheck },
  { title: 'Confirmación', desc: 'Pago de garantía o total: esa fecha se bloquea en el calendario para que no se venda dos veces.', icon: CreditCard },
  { title: 'Pre-llegada', desc: 'Correo o WhatsApp con ubicación y check-in digital con código QR.', icon: QrCode },
  {
    title: 'Estancia',
    desc: 'Si vendes como en Airbnb (sin recepción): autogestión con cerradura o caja de llaves. Si eres hotel: recepción, llave física y consumos adicionales.',
    icon: Users,
  },
  { title: 'Limpieza y rotación', desc: 'Al irse el huésped, la habitación queda pendiente de limpieza; al terminar, queda lista para el siguiente ingreso.', icon: Brush },
  { title: 'Cierre', desc: 'Facturación, checkout y solicitud de reseña.', icon: ClipboardList },
];

const CHECKLIST = [
  {
    letter: 'A',
    title: 'Inventario y tarifas',
    items: [
      'Gestor de unidades: crear, editar, categorizar (fotos, descripción, servicios).',
      'Calendario dinámico: vista mensual o semanal de ocupación.',
      'Tarifario inteligente: fines de semana, feriados y temporadas altas.',
    ],
  },
  {
    letter: 'B',
    title: 'Reservas y huéspedes',
    items: [
      'Tomar reservas por teléfono, recepción o formulario web, con las mismas reglas.',
      'Historial por huésped: visitas anteriores, notas y si dejó algo pendiente de cobrar.',
      'Saber en un vistazo si está pendiente, confirmada, en casa o ya salió.',
    ],
  },
  {
    letter: 'C',
    title: 'Limpieza y operación diaria',
    items: [
      'Lista del día: qué habitaciones necesitan limpieza o revisión.',
      'Pantalla sencilla para el personal: marcar cuando terminó cada habitación.',
    ],
  },
  {
    letter: 'D',
    title: 'Pagos y finanzas',
    items: [
      'Caja chica: ingresos por reserva y gastos de mantenimiento.',
      'Pasarela o registro manual de transferencias (según tu despliegue).',
    ],
  },
  {
    letter: 'E',
    title: 'Automatización',
    items: [
      'WhatsApp o correo: confirmación y códigos de acceso.',
      'Generador de QR para check-in rápido.',
    ],
  },
];

const NexusStay = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState({});

  const toggle = useCallback((key) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!prev[key]) void trackStay(`checklist|${key}`);
      return next;
    });
  }, []);

  return (
    <>
      <div className="animate-in fade-in space-y-12 pb-16 duration-500">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1 font-medium text-sky-700 hover:text-sky-800">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
          <span className="font-medium text-slate-800">Nexus Stay</span>
        </div>

        <header className="flex flex-col gap-6 border-b border-sky-100 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-800">
              <Bed className="h-3.5 w-3.5" aria-hidden />
              Vertical Stay · alcance del producto (pretotipo)
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Una sola plataforma para hoteles, Airbnb y alojamiento en el campo
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Esta página define segmentación, unidades, servicios, journey y checklist de módulos para programar
              controladores y reglas de negocio. Es contenido de referencia para el equipo y para quienes evalúan el
              roadmap a ~6 meses.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void trackStay('boton_preinscripcion');
                setModalOpen(true);
              }}
              className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-700 hover:to-indigo-700"
            >
              Pre inscripción — Stay
            </button>
            <Link
              to="/nexussport"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/50"
            >
              Ver Nexus Sport
            </Link>
            <Link
              to="/nexuscare"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/80"
            >
              Ver Nexus Care
            </Link>
            <Link
              to="/nexusgear"
              onClick={() => void trackStay('link_nexusgear')}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50/70"
            >
              Ver Nexus Gear
            </Link>
          </div>
        </header>

        {/* 1. Segmentación */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">¿A quiénes damos el servicio?</h2>
          <p className="max-w-3xl text-slate-600">
            Incluye hoteles con recepción, anfitriones que publican en <strong className="font-semibold text-slate-800">Airbnb</strong>,{' '}
            <strong className="font-semibold text-slate-800">Booking</strong> u otras apps, y negocios en el campo (cabañas o lodges rurales). Cada uno con reglas distintas; el producto debe adaptarse.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {SEGMENTS.map(({ title, icon: Icon, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 2. Unidades y servicios */}
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Package className="h-6 w-6 text-sky-600" aria-hidden />
              Unidades de inventario
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <strong className="text-slate-900">Habitación:</strong> sencilla, doble, suite (u otras categorías).
              </li>
              <li>
                <strong className="text-slate-900">Propiedad completa:</strong> casa, departamento o cabaña.
              </li>
              <li>
                <strong className="text-slate-900">Espacio compartido:</strong> camas en dormitorios de hostal.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <ConciergeBell className="h-6 w-6 text-indigo-600" aria-hidden />
              Servicios incluidos y adicionales
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <strong className="text-slate-900">Básicos:</strong> cama, Wi-Fi, baño.
              </li>
              <li>
                <strong className="text-slate-900">A la habitación:</strong> room service, minibar, limpieza extra.
              </li>
              <li>
                <strong className="text-slate-900">Experiencias:</strong> desayuno, piscina, bicicletas, traslado al
                aeropuerto, tours.
              </li>
            </ul>
          </div>
        </section>

        {/* 3. Customer journey */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Flujo de trabajo (customer journey)</h2>
          <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {JOURNEY.map(({ title, desc, icon: Icon }, i) => (
              <li
                key={title}
                className="relative flex gap-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 p-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-800">
                  {i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-indigo-500" aria-hidden />
                    <h3 className="font-bold text-slate-900">{title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. Checklist */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Lista maestra de requerimientos</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Módulos internos previstos para Nexus Stay. Marca lo que ya validaste con stakeholders (solo en este
                navegador; sirve para demos en vivo).
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">
              <Sparkles className="h-3 w-3" aria-hidden />
              Pretotipo
            </span>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {CHECKLIST.map((block) => (
              <div key={block.letter} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-sm text-white">
                    {block.letter}
                  </span>
                  {block.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {block.items.map((label, idx) => {
                    const key = `${block.letter}${idx}`;
                    return (
                      <li key={key}>
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent px-2 py-2 hover:border-slate-100 hover:bg-slate-50/80">
                          <input
                            type="checkbox"
                            checked={!!checked[key]}
                            onChange={() => toggle(key)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                          />
                          <span className="text-sm text-slate-700">{label}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <AnonymousRecommendationsBox accentClass="from-sky-600 to-indigo-600" />

        <p className="text-center text-xs text-slate-400">
          Nexus Stay · contenido de producto · sin datos reales de huéspedes
        </p>
      </div>

      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedSector="Stay" />
    </>
  );
};

export default NexusStay;
