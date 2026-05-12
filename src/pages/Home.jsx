import { useState } from 'react';
import { Link } from 'react-router-dom';
import { pricingPlans } from '../data/pricing';
import {
  Trophy,
  Bed,
  HeartPulse,
  Tractor,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  BarChart3,
  ArrowRight,
  Layers,
  Database,
  Smartphone,
  Sparkles,
  Calendar,
} from 'lucide-react';
import LeadModal from '../components/LeadModal';
import AnonymousRecommendationsBox from '../components/AnonymousRecommendationsBox';
import DiscreetTaconesPortal from '../components/DiscreetTaconesPortal';

const SECTORS = [
  {
    id: 'Sport',
    icon: Trophy,
    title: 'Nexus Sport',
    tag: 'Complejos deportivos',
    exploreHref: '/nexussport',
    gradient: 'from-emerald-600 via-emerald-500 to-teal-600',
    accent: 'emerald',
    desc: 'Lleva el control de tus espacios deportivos: reservas, torneos, iluminación, accesos y reportes de ocupación en un solo flujo operativo.',
    points: ['Agenda y reservas centralizadas', 'Cuadrantes y fixtures', 'Métricas de uso por espacio'],
  },
  {
    id: 'Stay',
    icon: Bed,
    title: 'Nexus Stay',
    tag: 'Hoteles, Airbnb y alojamiento rural',
    exploreHref: '/nexusstay',
    gradient: 'from-sky-600 via-indigo-500 to-indigo-600',
    accent: 'sky',
    desc: 'Desde recepción clásica hasta anfitriones en Airbnb: habitaciones o departamentos por noche, precios por temporada y mensajes con huéspedes.',
    points: [
      'Reservas desde recepción o tu web, sin solapar fechas',
      'Equipo de limpieza: qué toca hoy y cuándo queda lista la habitación',
      'Un solo calendario enlazable con Booking, Airbnb y otros portales',
    ],
  },
  {
    id: 'Care',
    icon: HeartPulse,
    title: 'Nexus Care',
    tag: 'Salud y estética',
    exploreHref: '/nexuscare',
    gradient: 'from-slate-800 via-teal-900 to-slate-900',
    accent: 'clinical',
    desc: 'Agenda clínica, historial resumido por visita, consentimientos y control de cabinas — con interfaz sobria para entornos de salud y spa médico.',
    points: [
      'Citas, sala de espera y ocupación por profesional o cabina',
      'Continuidad: alertas, consentimientos y trazabilidad operativa',
      'Panel para dirección: cumplimiento y productividad sin ruido visual',
    ],
  },
  {
    id: 'Gear',
    icon: Tractor,
    title: 'Nexus Gear',
    tag: 'Maquinaria, taller y patio',
    exploreHref: '/nexusgear',
    gradient: 'from-amber-600 via-orange-600 to-slate-900',
    accent: 'amber',
    desc: 'Alquiler de flota, talleres de vehículos pesados, concesionarias y patio: contratos, checklist de salida/entrada, OT y trazabilidad por activo.',
    points: [
      'Catálogo de máquinas con disponibilidad y documentación',
      'Taller: bahías, repuestos y historial por chasis / horómetro',
      'QR o placa interna para seguir cada activo en patio u obra',
    ],
  },
];

const PLATFORM_PILLARS = [
  {
    icon: Layers,
    title: 'Multi-tenant real',
    text: 'Aislamiento lógico por organización: datos, roles y configuración sin mezclar contextos.',
  },
  {
    icon: BarChart3,
    title: 'Mini-BI integrado',
    text: 'Eventos de uso, embudos y conversiones desde tu propia API — sin depender de terceros para decisiones.',
  },
  {
    icon: Database,
    title: 'PostgreSQL + EF Core',
    text: 'Modelo relacional sólido para escalar de pretotipo a producción con migraciones y respaldo.',
  },
  {
    icon: Smartphone,
    title: 'Listo para campo',
    text: 'Interfaz responsive pensada para operadores en recepción, cancha, taller o obra.',
  },
];

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState('');

  const openRegister = (sector) => {
    setSelectedSector(sector);
    setModalOpen(true);
  };

  return (
    <div className="animate-in fade-in space-y-20 pb-16 duration-700 md:space-y-28 md:pb-24">
      {/* Hero */}
      <section className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative z-10 max-w-xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-violet-800">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Operación vertical + analíticas propias
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Una plataforma{' '}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
              enterprise
            </span>{' '}
            para Sport, Stay, Care y Gear
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">
            KallpaNexus centraliza reservas, activos, citas y alquileres con arquitectura multi-tenant, API en{' '}
            <strong className="font-semibold text-slate-800">.NET 8</strong> y panel de inteligencia mínima viable
            para medir interés y conversiones desde el primer día.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
              Leads y eventos ya conectados al backend
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
              Cuatro verticales, un mismo núcleo
            </li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => openRegister('General')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-700 hover:to-fuchsia-700"
            >
              Pre inscripción al sistema
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <a
              href="#modulos"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-violet-200 hover:bg-violet-50/50"
            >
              Ver módulos
            </a>
            <Link
              to="/nexussport"
              className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/50 px-7 py-3.5 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-100/80"
            >
              Ver Nexus Sport
            </Link>
            <DiscreetTaconesPortal variant="hero" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-xl shadow-emerald-200/30 ring-1 ring-emerald-100/80">
            <div className="border-b border-emerald-100/80 bg-white/60 px-6 py-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                  <Trophy className="h-7 w-7" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Nexus Sport</p>
                  <p className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                    Lleva el control de tus espacios deportivos
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Canchas, calendario, bar y tienda en un solo tablero — sin mezclarlo con la landing. Entra a la vista
                operativa para ver el ejemplo en vivo.
              </p>
            </div>
            <div className="space-y-4 p-6">
              {[
                { icon: Calendar, t: 'Agenda unificada', d: 'Recepción y operaciones en un solo calendario.' },
                { icon: Trophy, t: 'Torneos y ligas', d: 'Cuadrantes, fixtures y seguimiento por equipo.' },
                { icon: Zap, t: 'Control de operación', d: 'Iluminación, turnos y métricas por espacio (roadmap).' },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="flex gap-4 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{t}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{d}</p>
                  </div>
                </div>
              ))}
              <Link
                to="/nexussport"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Ver vista operativa Sport
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluye la plataforma */}
      <section id="plataforma" className="space-y-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Todo lo que tu pretotipo necesita para validar mercado
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Menos ruido visual y más señal de negocio: captación, comportamiento y un roadmap claro hacia el primer
            módulo productivo.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_PILLARS.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md"
            >
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-violet-100/60 transition group-hover:bg-violet-100" />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-violet-50 p-3 text-violet-600 ring-1 ring-violet-100">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Visión + checklist */}
      <section className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm md:p-10">
          <h2 className="text-3xl font-bold text-slate-900">Potencia tecnológica al servicio de tu operación</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Construimos la base para que pases de landing y leads a <strong className="text-slate-800">un núcleo SaaS</strong>{' '}
            con PostgreSQL, Entity Framework Core y APIs que puedes extender vertical por vertical.
          </p>
          <div className="space-y-5">
            <div className="flex gap-4">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-violet-600" aria-hidden />
              <div>
                <h4 className="font-bold text-slate-900">Seguridad y trazabilidad</h4>
                <p className="text-sm text-slate-600">Buenas prácticas para datos sensibles (Care) y contratos (Gear).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Globe className="mt-0.5 h-6 w-6 shrink-0 text-fuchsia-600" aria-hidden />
              <div>
                <h4 className="font-bold text-slate-900">Desde cualquier sede</h4>
                <p className="text-sm text-slate-600">Web responsive con Tailwind v4: coherencia visual en todo el stack.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-8 shadow-sm md:p-10">
          <Zap className="absolute right-6 top-6 h-24 w-24 text-violet-200/80" aria-hidden />
          <h3 className="relative text-2xl font-bold text-slate-900">¿Por qué KallpaNexus?</h3>
          <ul className="relative mt-6 space-y-4">
            {[
              'Menos integraciones fragmentadas: un solo backend',
              'Analíticas propias para decidir qué vertical construir primero',
              'Precios claros para escalar de founder a equipo',
              'Soporte cercano y roadmap alineado al mercado local',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Módulos */}
      <section id="modulos" className="space-y-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Cuatro verticales, misma experiencia</h2>
          <p className="mt-4 text-lg text-slate-600">
            Elige el módulo que quieras pilotear; la base (usuarios, analíticas, facturación futura) es común.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {SECTORS.map((s) => (
            <SectorCard key={s.id} sector={s} onDemo={() => openRegister(s.id)} />
          ))}
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="space-y-10 rounded-[2rem] border border-violet-100 bg-violet-50/40 px-4 py-14 sm:px-8 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Planes de inversión</h2>
          <p className="mt-4 text-lg text-slate-600">Escala cuando tengas validación; empieza con lo esencial.</p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PriceCard
              key={plan.id}
              title={plan.title}
              price={plan.price}
              features={plan.features}
              featured={plan.featured}
              onSelect={() => openRegister(plan.title)}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl">
        <AnonymousRecommendationsBox accentClass="from-violet-600 to-fuchsia-600" />
      </section>

      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedSector={selectedSector} />
    </div>
  );
};

const ACCENT = {
  emerald: {
    ring: 'ring-emerald-500/25 hover:ring-emerald-400/40',
    iconWrap: 'bg-white/25 shadow-lg shadow-emerald-900/20 ring-1 ring-white/40',
    badge: 'border border-white/35 bg-white/20 text-white',
    pointRow: 'border-emerald-100 bg-emerald-50/40',
    check: 'text-emerald-600',
    primaryBtn:
      'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700',
    secondaryBtn:
      'border-slate-200 bg-white text-slate-800 hover:border-emerald-200 hover:bg-emerald-50/80 hover:text-emerald-900',
    singleBtn:
      'border-slate-200 bg-white text-slate-800 hover:border-emerald-200 hover:bg-emerald-50/80 hover:text-emerald-900',
  },
  sky: {
    ring: 'ring-sky-500/25 hover:ring-sky-400/40',
    iconWrap: 'bg-white/25 shadow-lg shadow-sky-900/20 ring-1 ring-white/40',
    badge: 'border border-white/35 bg-white/20 text-white',
    pointRow: 'border-sky-100 bg-sky-50/50',
    check: 'text-sky-600',
    primaryBtn:
      'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-700 hover:to-indigo-700',
    secondaryBtn:
      'border-slate-200 bg-white text-slate-800 hover:border-sky-200 hover:bg-sky-50/90 hover:text-sky-900',
    singleBtn:
      'border-slate-200 bg-white text-slate-800 hover:border-sky-200 hover:bg-sky-50/90 hover:text-sky-900',
  },
  violet: {
    ring: 'ring-violet-500/30 hover:ring-violet-400/45',
    iconWrap: 'bg-white/25 shadow-lg shadow-violet-900/25 ring-1 ring-white/40',
    badge: 'border border-white/35 bg-white/20 text-white',
    pointRow: 'border-violet-100 bg-violet-50/45',
    check: 'text-violet-600',
    primaryBtn:
      'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-700 hover:to-fuchsia-700',
    secondaryBtn:
      'border-slate-200 bg-white text-slate-800 hover:border-violet-200 hover:bg-violet-50/90 hover:text-violet-900',
    singleBtn:
      'border-slate-200 bg-white text-slate-800 hover:border-violet-200 hover:bg-violet-50/90 hover:text-violet-900',
  },
  amber: {
    ring: 'ring-amber-500/25 hover:ring-amber-400/40',
    iconWrap: 'bg-white/25 shadow-lg shadow-amber-900/20 ring-1 ring-white/40',
    badge: 'border border-white/35 bg-white/20 text-white',
    pointRow: 'border-amber-100 bg-amber-50/45',
    check: 'text-amber-600',
    primaryBtn:
      'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 hover:from-amber-600 hover:to-orange-700',
    secondaryBtn:
      'border-slate-200 bg-white text-slate-800 hover:border-amber-200 hover:bg-amber-50/90 hover:text-amber-900',
    singleBtn:
      'border-slate-200 bg-white text-slate-800 hover:border-amber-200 hover:bg-amber-50/90 hover:text-amber-900',
  },
  clinical: {
    ring: 'ring-teal-600/30 hover:ring-teal-500/40',
    iconWrap: 'bg-white/20 shadow-lg shadow-black/30 ring-1 ring-white/35',
    badge: 'border border-white/30 bg-white/15 text-white',
    pointRow: 'border-teal-100/90 bg-teal-50/60',
    check: 'text-teal-800',
    primaryBtn:
      'bg-gradient-to-r from-teal-800 to-slate-900 text-white shadow-lg shadow-teal-900/30 hover:from-teal-900 hover:to-black',
    secondaryBtn:
      'border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50/90 hover:text-teal-950',
    singleBtn:
      'border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50/90 hover:text-teal-950',
  },
};

const SectorCard = ({ sector, onDemo }) => {
  const Icon = sector.icon;
  const a = ACCENT[sector.accent] ?? ACCENT.emerald;
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40 ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/50 ${a.ring}`}
    >
      <div className={`relative overflow-hidden bg-gradient-to-br px-6 pb-14 pt-7 ${sector.gradient}`}>
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl backdrop-blur-sm ${a.iconWrap}`}>
            <Icon className="h-7 w-7 text-white drop-shadow-sm" aria-hidden />
          </div>
          <span className={`max-w-[11rem] rounded-full px-3.5 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide backdrop-blur-sm sm:text-xs ${a.badge}`}>
            {sector.tag}
          </span>
        </div>
      </div>

      <div className="relative -mt-9 flex flex-1 flex-col rounded-t-[1.75rem] border border-slate-100/90 bg-white px-6 pb-6 pt-9 shadow-[0_-12px_40px_-18px_rgba(15,23,42,0.12)]">
        <div className="mb-1 flex items-center gap-2">
          <span className={`h-1 w-8 rounded-full bg-gradient-to-r ${sector.gradient} opacity-90`} aria-hidden />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Módulo</span>
        </div>
        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{sector.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{sector.desc}</p>

        <ul className="mt-5 flex flex-1 flex-col gap-2.5">
          {sector.points.map((p) => (
            <li
              key={p}
              className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 transition group-hover:border-slate-200/90 ${a.pointRow}`}
            >
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${a.check}`}>
                <CheckCircle2 className="h-4 w-4" aria-hidden />
              </span>
              <span className="leading-snug">{p}</span>
            </li>
          ))}
        </ul>

        {sector.exploreHref ? (
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            <Link
              to={sector.exploreHref}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-center text-sm font-bold transition ${a.primaryBtn}`}
            >
              Ver página {sector.id}
              <ArrowRight className="h-4 w-4 opacity-90" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={onDemo}
              className={`inline-flex flex-1 items-center justify-center rounded-xl border py-3.5 text-sm font-semibold transition ${a.secondaryBtn}`}
            >
              Pre inscripción — {sector.id}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onDemo}
            className={`mt-7 w-full rounded-xl border py-3.5 text-sm font-semibold transition ${a.singleBtn}`}
          >
            Solicitar demo — {sector.id}
          </button>
        )}
      </div>
    </article>
  );
};

const isCustomPrice = (price) => price === 'Personalizado' || price === 'Custom';

const PriceCard = ({ title, price, features, featured, onSelect }) => (
  <div
    className={`flex flex-col rounded-3xl border p-8 ${
      featured
        ? 'scale-[1.02] border-violet-400 bg-white shadow-xl shadow-violet-200/50 ring-2 ring-violet-500/20'
        : 'border-slate-200 bg-white shadow-sm'
    }`}
  >
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    <div className="mb-6 mt-2">
      <span className="text-4xl font-bold text-slate-900">
        {isCustomPrice(price) ? 'A medida' : `$${price}`}
      </span>
      {!isCustomPrice(price) && <span className="ml-2 text-slate-500">/ mes</span>}
    </div>
    <ul className="mb-8 flex flex-1 flex-col gap-3">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden />
          {f}
        </li>
      ))}
    </ul>
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl py-3 text-sm font-bold transition ${
        featured
          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-fuchsia-700'
          : 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
      }`}
    >
      Elegir plan
    </button>
  </div>
);

export default Home;
