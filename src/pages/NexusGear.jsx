import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Tractor,
  Truck,
  Wrench,
  ClipboardList,
  PackageSearch,
  QrCode,
  Building2,
  Store,
  Forklift,
  X,
  MapPin,
  Gauge,
  ShieldCheck,
  FileText,
  Sparkles,
} from 'lucide-react';
import LeadModal from '../components/LeadModal';
import AnonymousRecommendationsBox from '../components/AnonymousRecommendationsBox';
import api from '../api/cliente';
import { getClientPathname } from '../utils/appPath';

async function trackGear(targetName) {
  try {
    await api.post('/analytics/track', {
      eventType: 'CLICK',
      targetName: `NexusGear|${targetName}`,
      sector: 'Gear',
      url: typeof window !== 'undefined' ? getClientPathname('/nexusgear') : '/nexusgear',
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Móvil' : 'Escritorio',
    });
  } catch {
    /* silencioso */
  }
}

/** Nombres de archivo en public/gear/ — ver LEEME.txt */
const CATALOG = [
  {
    id: 'exc-01',
    name: 'Excavadora oruga compacta',
    segment: 'Alquiler',
    image: 'catalogo-excavadora-oruga.webp',
    specs: '8 t · oruga · entrega regional',
    estado: 'Disponible',
  },
  {
    id: 'grua-02',
    name: 'Grúa telescópica todo terreno',
    segment: 'Alquiler',
    image: 'catalogo-grua-telescopica.webp',
    specs: '35 t · despliegue asistido',
    estado: 'En obra',
  },
  {
    id: 'mini-03',
    name: 'Minicargador con brazo',
    segment: 'Alquiler',
    image: 'catalogo-minicargador.webp',
    specs: 'Paletas y cuchilla · 420 h motor',
    estado: 'Disponible',
  },
  {
    id: 'rod-04',
    name: 'Rodillo compactador vial',
    segment: 'Alquiler',
    image: 'catalogo-rodillo-vial.webp',
    specs: 'Compactación fina · tambor liso',
    estado: 'Mantenimiento',
  },
  {
    id: 'vol-05',
    name: 'Volquete / dumper articulado',
    segment: 'Alquiler',
    image: 'catalogo-camion-volquete.webp',
    specs: '25 m³ · revisión técnica vigente',
    estado: 'Disponible',
  },
];

const SEGMENTS = [
  {
    title: 'Arrendador de maquinaria',
    icon: Forklift,
    text: 'Contratos por día/semana/mes, checklist de salida y entrada, horómetro y daños documentados. Disponibilidad en tiempo real y bloqueo de solapes.',
  },
  {
    title: 'Taller y mantenimiento a pesados',
    icon: Wrench,
    text: 'Órdenes de trabajo por bahía, repuestos y mano de obra, historial por chasis o motor. Integración con flota propia o de terceros.',
  },
  {
    title: 'Concesionaria y patio de unidades',
    icon: Store,
    text: 'Stock nuevo y usado, reservas con seña, preparación pre-entrega y entrega documentada. Trazabilidad desde ingreso a patio hasta facturación.',
  },
];

const JOURNEY = [
  { title: 'Reserva o ingreso', desc: 'Web, telefonía o patio: activo, fechas y cliente vinculado.', icon: PackageSearch },
  { title: 'Checklist y fotos', desc: 'Salida/entrada con evidencia; condición de neumáticos, fugas y horómetro.', icon: ClipboardList },
  { title: 'Operación o taller', desc: 'Ocupación en obra o OT en taller con tiempos y repuestos.', icon: Wrench },
  { title: 'Trazabilidad', desc: 'QR o placa interna: historial de movimientos y responsables.', icon: QrCode },
  { title: 'Cierre', desc: 'Facturación, rentabilidad por activo y alertas de mantenimiento preventivo.', icon: Gauge },
];

const CHECKLIST = [
  {
    letter: 'A',
    title: 'Flota y disponibilidad',
    items: [
      'Calendario de ocupación por activo y por sede.',
      'Bloqueos por mantenimiento o transporte en curso.',
      'Integración futura con GPS / telemetría (roadmap).',
    ],
  },
  {
    letter: 'B',
    title: 'Contratos y cumplimiento',
    items: [
      'Plantillas de contrato y anexos fotográficos.',
      'Multas por retraso en devolución o daños no declarados.',
      'Exportación para contabilidad y auditoría.',
    ],
  },
  {
    letter: 'C',
    title: 'Activos y repuestos',
    items: [
      'Vida útil y costo por hora de máquina.',
      'Inventario de repuestos críticos vinculado a OT.',
    ],
  },
];

function CatalogCard({ item, onOpenDetail }) {
  const [imgFailed, setImgFailed] = useState(false);
  const Icon = Forklift;

  const openDetail = () => {
    void trackGear(`catalogo_ver|${item.id}`);
    onOpenDetail(item);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100">
      <button
        type="button"
        onClick={openDetail}
        aria-label={`Abrir ficha: ${item.name}`}
        className="group flex w-full flex-col rounded-2xl text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
      >
        <div className="flex h-52 w-full items-center justify-center bg-slate-100 p-4 transition-colors group-hover:bg-slate-200/60 sm:h-56">
          {!imgFailed && item.image ? (
            <img
              src={`/gear/${item.image}`}
              alt=""
              className="max-h-full max-w-full object-contain"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <Icon className="h-14 w-14 text-slate-300" aria-hidden />
          )}
        </div>
        <div className="border-t border-slate-100 bg-white px-4 py-4">
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-950 sm:text-base">{item.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.specs}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-amber-800">Estado: {item.estado}</p>
          <span className="mt-3 block text-sm font-semibold text-amber-900 underline-offset-2 group-hover:underline">
            Ver ficha demo
          </span>
        </div>
      </button>
    </article>
  );
}

const NexusGear = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState({});
  const [tallerOpen, setTallerOpen] = useState(false);
  const [concesionariaOpen, setConcesionariaOpen] = useState(false);
  const [trazabilidadOpen, setTrazabilidadOpen] = useState(false);
  const [catalogItem, setCatalogItem] = useState(null);

  const toggle = useCallback((key) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!prev[key]) void trackGear(`checklist|${key}`);
      return next;
    });
  }, []);

  return (
    <>
      <div className="animate-in fade-in space-y-12 pb-16 duration-500">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1 font-medium text-amber-900 hover:text-amber-950">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
          <span className="font-medium text-slate-800">Nexus Gear</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/90 px-4 py-3 text-sm text-amber-950 shadow-sm">
          <div className="flex flex-wrap items-start gap-2">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden />
            <p>
              <strong className="font-semibold">Demostración.</strong> Contratos, flota y fotos son ficticios; sin datos
              reales de clientes ni contratos.
            </p>
          </div>
        </div>

        <header className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-900 text-white shadow-xl">
          <div className="absolute inset-0 opacity-40">
            <img
              src="/gear/hero-obra-atardecer.webp"
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-amber-950/80" />
          </div>
          <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-end md:justify-between md:p-10">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-200">
                <Tractor className="h-3.5 w-3.5" aria-hidden />
                Vertical Gear · activos y campo
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Flota en alquiler, taller de pesados y patio con trazabilidad de activos
              </h1>
              <p className="text-sm leading-relaxed text-slate-200 md:text-base">
                Un solo tablero para saber qué máquina está libre, en obra o en mantenimiento; documentar entregas y
                devoluciones; y dar visibilidad a concesionarias y logística de equipos.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  void trackGear('boton_preinscripcion');
                  setModalOpen(true);
                }}
                className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:bg-amber-400"
              >
                Pre inscripción — Gear
              </button>
              <Link
                to="/nexussport"
                onClick={() => void trackGear('link_nexussport')}
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Nexus Sport
              </Link>
              <Link
                to="/nexusstay"
                onClick={() => void trackGear('link_nexusstay')}
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Nexus Stay
              </Link>
              <Link
                to="/nexuscare"
                onClick={() => void trackGear('link_nexuscare')}
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Nexus Care
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Activos en renta', value: '42', sub: '12 con contrato que vence en menos de 7 días', icon: Truck },
            { label: 'En taller / OT', value: '7', sub: '3 esperando repuesto', icon: Wrench },
            { label: 'Alertas preventivas', value: '4', sub: 'Horómetro o calendario', icon: Gauge },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="mb-2 h-5 w-5 text-amber-700" aria-hidden />
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums text-slate-900">{value}</p>
              <p className="mt-1 text-xs text-slate-600">{sub}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Catálogo demo (maquinaria)</h2>
            <button
              type="button"
              onClick={() => void trackGear('catalogo_exportar_mock')}
              className="text-sm font-semibold text-amber-900 underline-offset-2 hover:underline"
            >
              Exportar listado (mock)
            </button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATALOG.map((item) => (
              <CatalogCard key={item.id} item={item} onOpenDetail={(i) => setCatalogItem(i)} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => {
              void trackGear('mock_taller_abrir');
              setTallerOpen(true);
            }}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <Building2 className="h-8 w-8 text-slate-700 transition group-hover:text-amber-800" aria-hidden />
            <h3 className="mt-3 text-lg font-bold text-slate-900">Taller · vehículos pesados</h3>
            <p className="mt-2 text-sm text-slate-600">
              Bahías, OT, repuestos y tiempos de parada. Abre un panel demo con imagen de referencia.
            </p>
            <span className="mt-4 text-sm font-semibold text-amber-900">Abrir mockup →</span>
          </button>
          <button
            type="button"
            onClick={() => {
              void trackGear('mock_concesionaria_abrir');
              setConcesionariaOpen(true);
            }}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <Store className="h-8 w-8 text-slate-700 transition group-hover:text-amber-800" aria-hidden />
            <h3 className="mt-3 text-lg font-bold text-slate-900">Concesionaria / patio</h3>
            <p className="mt-2 text-sm text-slate-600">
              Unidades en patio, reservas y preparación pre-entrega. Vista demo con imagen de referencia.
            </p>
            <span className="mt-4 text-sm font-semibold text-amber-900">Abrir mockup →</span>
          </button>
          <button
            type="button"
            onClick={() => {
              void trackGear('mock_trazabilidad_abrir');
              setTrazabilidadOpen(true);
            }}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <QrCode className="h-8 w-8 text-slate-700 transition group-hover:text-amber-800" aria-hidden />
            <h3 className="mt-3 text-lg font-bold text-slate-900">Trazabilidad de activos</h3>
            <p className="mt-2 text-sm text-slate-600">
              Código interno, movimientos y responsables. Panel demo con imagen de placa/QR genérica.
            </p>
            <span className="mt-4 text-sm font-semibold text-amber-900">Abrir mockup →</span>
          </button>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">¿A quién cubre Gear?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {SEGMENTS.map(({ title, icon: Icon, text }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Flujo de vida del activo</h2>
          <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {JOURNEY.map(({ title, desc, icon: Icon }, i) => (
              <li
                key={title}
                className="relative flex gap-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-amber-50/40 p-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-950">
                  {i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-amber-800" aria-hidden />
                    <h3 className="font-bold text-slate-900">{title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Lista maestra de requerimientos</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Alcance para Nexus Gear. Las casillas son solo en este navegador (demo con clientes).
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
              <Sparkles className="h-3 w-3" aria-hidden />
              Pretotipo
            </span>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {CHECKLIST.map((block) => (
              <div key={block.letter} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-sm text-white">
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
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-700 focus:ring-amber-600"
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

        <AnonymousRecommendationsBox accentClass="from-amber-600 to-orange-800" />

        <p className="text-center text-xs text-slate-500">
          Nexus Gear · referencia de producto · sin datos reales de contratos ni clientes
        </p>
      </div>

      {catalogItem && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gear-catalog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCatalogItem(null);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-amber-50/90 px-4 py-3">
              <h2 id="gear-catalog-title" className="text-lg font-bold text-slate-900">
                Ficha demo
              </h2>
              <button
                type="button"
                onClick={() => setCatalogItem(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-800"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="max-h-[calc(90vh-4rem)] overflow-y-auto p-4">
              <div className="relative flex h-52 items-center justify-center rounded-xl bg-slate-100 p-4">
                <img
                  src={`/gear/${catalogItem.image}`}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-slate-900/80 px-2 py-1 font-mono text-[10px] text-white">
                  ID {catalogItem.id}
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{catalogItem.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{catalogItem.specs}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-800">
                Estado: {catalogItem.estado}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
                  Ubicación actual: patio central (demo)
                </li>
                <li className="flex gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
                  Contrato #CNT-MOCK-2026-0142 · vigente
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tallerOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setTallerOpen(false);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-lg font-bold text-slate-900">Taller · mockup</h2>
              <button type="button" onClick={() => setTallerOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Cerrar">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <img
                src="/gear/taller-bahia-mantenimiento.webp"
                alt=""
                className="w-full object-cover"
                onError={(e) => {
                  e.currentTarget.classList.add('hidden');
                }}
              />
              <div className="space-y-2 p-4 text-sm text-slate-700">
                <p>
                  <strong className="text-slate-900">Bahía 2:</strong> camión 6×4 · OT-883 · frenos + aceite transmisión.
                </p>
                <p>
                  <strong className="text-slate-900">Bahía 4:</strong> excavadora en espera de sellos (repuesto en tránsito).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {concesionariaOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConcesionariaOpen(false);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-lg font-bold text-slate-900">Concesionaria / patio · mockup</h2>
              <button type="button" onClick={() => setConcesionariaOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Cerrar">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <img
                src="/gear/concesionaria-patio-unidades.webp"
                alt=""
                className="w-full object-cover"
                onError={(e) => {
                  e.currentTarget.classList.add('hidden');
                }}
              />
              <div className="p-4 text-sm text-slate-700">
                <p>
                  <strong className="text-slate-900">12 unidades</strong> en patio · 3 reservadas con seña · 1 en
                  preparación pre-entrega.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {trazabilidadOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setTrazabilidadOpen(false);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-lg font-bold text-slate-900">Trazabilidad · mockup</h2>
              <button type="button" onClick={() => setTrazabilidadOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Cerrar">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="p-4">
              <img
                src="/gear/trazabilidad-activo-qr-placa.webp"
                alt=""
                className="mx-auto max-h-64 rounded-lg object-contain"
                onError={(e) => {
                  e.currentTarget.classList.add('hidden');
                }}
              />
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>· Ingreso a patio — 02/05/2026 — Usuario demo</li>
                <li>· Salida a obra “Carretera Norte” — 05/05/2026</li>
                <li>· Devolución — 18/05/2026 — Checklist OK</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedSector="Gear" />
    </>
  );
};

export default NexusGear;
