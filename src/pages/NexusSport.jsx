import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Banknote,
  Target,
  Clock,
  LineChart,
  ChevronRight,
  MapPin,
  Beer,
  Droplets,
  CupSoda,
  Cookie,
  ShoppingBasket,
  AlertTriangle,
  X,
  Send,
} from 'lucide-react';
import LeadModal from '../components/LeadModal';
import api from '../api/cliente';
import { getClientPathname } from '../utils/appPath';

const KPI = [
  { label: 'Reservas hoy', value: '38', sub: '+6 vs ayer', icon: Calendar, tone: 'emerald' },
  { label: 'Ocupación semanal', value: '76%', sub: 'Meta 80%', icon: TrendingUp, tone: 'teal' },
  { label: 'Ingresos canchas', value: 'S/ 2.8k', sub: 'Alquiler + luces', icon: Banknote, tone: 'slate' },
  {
    label: 'Bar y tienda',
    value: 'S/ 1.4k',
    sub: 'Cervezas, aguas, gaseosas, galletas y piqueos',
    icon: ShoppingBasket,
    tone: 'amber',
  },
  { label: 'Torneos activos', value: '3', sub: '2 ligas + 1 copa', icon: Target, tone: 'violet' },
];

const OCCUPANCY_BY_COURT = [
  { name: 'Cancha 1 · Fútbol 7', pct: 92, fill: 'from-emerald-500 to-teal-400' },
  { name: 'Cancha 2 · Fútbol 7', pct: 71, fill: 'from-teal-500 to-cyan-400' },
  { name: 'Vóley · Indoor', pct: 58, fill: 'from-sky-500 to-indigo-400' },
];

const TODAY_SCHEDULE = [
  { time: '18:00', court: 'Cancha 1', client: 'Equipo local · Fecha 4', status: 'Confirmado' },
  { time: '19:00', court: 'Cancha 2', client: 'Reserva web · Los Halcones', status: 'Pagado' },
  { time: '20:30', court: 'Vóley · Indoor', client: 'Entrenamiento · Universidad', status: 'En curso' },
  { time: '21:00', court: 'Cancha 1', client: 'Torneo relámpago', status: 'Pendiente pago' },
  { time: '22:00', court: 'Cancha 2', client: 'Partido amistoso', status: 'Confirmado' },
];

/** Días de la semana de ejemplo (lunes a domingo) */
const WEEK_DAYS = [
  { short: 'Lun', full: 'Lun 12' },
  { short: 'Mar', full: 'Mar 13' },
  { short: 'Mié', full: 'Mié 14' },
  { short: 'Jue', full: 'Jue 15' },
  { short: 'Vie', full: 'Vie 16' },
  { short: 'Sáb', full: 'Sáb 17' },
  { short: 'Dom', full: 'Dom 18' },
];

/** Franjas horarias mostradas (1 h) */
const HOUR_SLOTS = [16, 17, 18, 19, 20, 21, 22, 23];

const COURT_KEYS = ['Cancha 1', 'Cancha 2', 'Vóley'];

/** Torneo o jornada larga: 5 h o más seguidas = “reservado evento” */
const MOCK_EVENT_BLOCKS = [
  { court: 'Cancha 1', dayIndex: 5, startHour: 17, durationHours: 5 },
  { court: 'Cancha 2', dayIndex: 6, startHour: 17, durationHours: 6 },
  { court: 'Vóley', dayIndex: 4, startHour: 19, durationHours: 5 },
];

/** Reservas de una hora = “reservado” */
const MOCK_NORMAL_SLOTS = [
  ['Cancha 1', 0, 18],
  ['Cancha 1', 0, 19],
  ['Cancha 1', 2, 20],
  ['Cancha 1', 3, 17],
  ['Cancha 1', 4, 19],
  ['Cancha 1', 4, 20],
  ['Cancha 1', 6, 18],
  ['Cancha 2', 0, 17],
  ['Cancha 2', 1, 19],
  ['Cancha 2', 3, 20],
  ['Cancha 2', 4, 18],
  ['Cancha 2', 5, 19],
  ['Cancha 2', 5, 22],
  ['Cancha 2', 6, 16],
  ['Cancha 2', 6, 20],
  ['Vóley', 1, 18],
  ['Vóley', 2, 19],
  ['Vóley', 3, 18],
  ['Vóley', 6, 19],
];

function buildStaticOccupancyMap(court) {
  const m = new Map();
  for (const b of MOCK_EVENT_BLOCKS) {
    if (b.court !== court) continue;
    for (let i = 0; i < b.durationHours; i++) {
      const hour = b.startHour + i;
      if (HOUR_SLOTS.includes(hour)) m.set(`${b.dayIndex}-${hour}`, 'evento');
    }
  }
  for (const [c, dayIdx, hour] of MOCK_NORMAL_SLOTS) {
    if (c !== court) continue;
    const k = `${dayIdx}-${hour}`;
    if (!m.has(k)) m.set(k, 'normal');
  }
  return m;
}

async function registrarClicNexusSport(targetName) {
  try {
    await api.post('/analytics/track', {
      eventType: 'CLICK',
      targetName,
      sector: 'Sport',
      url: typeof window !== 'undefined' ? getClientPathname('/nexussport') : '/nexussport',
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Móvil' : 'Escritorio',
    });
  } catch (e) {
    console.error('No se pudo registrar el clic en analíticas:', e);
  }
}

const BAR_PRODUCTS = [
  {
    name: 'Cerveza (lata / pack)',
    icon: Beer,
    soldToday: 86,
    unit: 'uds.',
    revenue: 'S/ 580',
    stock: 120,
    minStock: 48,
    alert: false,
  },
  {
    name: 'Agua mineral',
    icon: Droplets,
    soldToday: 42,
    unit: 'uds.',
    revenue: 'S/ 210',
    stock: 36,
    minStock: 40,
    alert: true,
  },
  {
    name: 'Gaseosas',
    icon: CupSoda,
    soldToday: 55,
    unit: 'uds.',
    revenue: 'S/ 330',
    stock: 90,
    minStock: 30,
    alert: false,
  },
  {
    name: 'Galletas y piqueos',
    icon: Cookie,
    soldToday: 28,
    unit: 'uds.',
    revenue: 'S/ 280',
    stock: 22,
    minStock: 25,
    alert: true,
  },
];

const NexusSport = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [courtTab, setCourtTab] = useState(0);
  const courtName = COURT_KEYS[courtTab];

  const staticMap = useMemo(() => buildStaticOccupancyMap(courtName), [courtName]);

  /** Reservas mock añadidas por el usuario en esta sesión (se pierden al recargar) */
  const [userReservedKeys, setUserReservedKeys] = useState(() => new Set());
  const [bookingTarget, setBookingTarget] = useState(null);
  const [bookingForm, setBookingForm] = useState({ nombre: '', telefono: '', nota: '' });
  const [sessionLog, setSessionLog] = useState([]);

  const cellKey = (dayIdx, hour) => `${dayIdx}-${hour}`;
  const userKey = (court, dayIdx, hour) => `${court}|${dayIdx}|${hour}`;

  const appendLog = (desc) => {
    setSessionLog((prev) =>
      [{ t: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), desc }, ...prev].slice(
        0,
        50,
      ),
    );
  };

  const track = async (targetName) => {
    appendLog(targetName);
    await registrarClicNexusSport(targetName);
  };

  const getCellKind = (dayIdx, hour) => {
    const uk = userKey(courtName, dayIdx, hour);
    if (userReservedKeys.has(uk)) return 'normal';
    return staticMap.get(cellKey(dayIdx, hour)) ?? 'libre';
  };

  const openBooking = (dayIdx, hour) => {
    const kind = getCellKind(dayIdx, hour);
    if (kind !== 'libre') return;
    setBookingForm({ nombre: '', telefono: '', nota: '' });
    setBookingTarget({ dayIndex: dayIdx, hour, court: courtName });
    void track(
      `NexusSport|calendario_celda_libre|${courtName}|${WEEK_DAYS[dayIdx].full}|${String(hour).padStart(2, '0')}h|abrir_formulario`,
    );
  };

  const confirmBooking = (e) => {
    e.preventDefault();
    if (!bookingTarget) return;
    const { dayIndex, hour, court } = bookingTarget;
    const uk = userKey(court, dayIndex, hour);
    setUserReservedKeys((prev) => new Set(prev).add(uk));
    void track(
      `NexusSport|reserva_mock_enviar|${court}|${WEEK_DAYS[dayIndex].full}|${String(hour).padStart(2, '0')}h|${bookingForm.nombre || 'sin_nombre'}`,
    );
    void track(
      `NexusSport|reserva_mock_confirmada|${court}|${WEEK_DAYS[dayIndex].full}|${String(hour).padStart(2, '0')}h`,
    );
    setBookingTarget(null);
  };

  const kindStyles = {
    libre: 'cursor-pointer border-slate-500 bg-slate-50 text-slate-400 hover:bg-emerald-50/90 hover:text-emerald-800',
    normal:
      'cursor-default border-emerald-900 bg-emerald-600 text-white shadow-[inset_0_0_0_1px_rgba(6,78,59,0.4)]',
    evento:
      'cursor-default border-violet-950 bg-violet-600 text-white shadow-[inset_0_0_0_1px_rgba(76,29,149,0.45)]',
  };

  return (
    <>
      <div className="animate-in fade-in space-y-10 pb-16 duration-500">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
          <span className="font-medium text-slate-800">Nexus Sport</span>
        </div>

        <header className="flex flex-col gap-6 border-b border-emerald-100 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800">
              <Trophy className="h-3.5 w-3.5" aria-hidden />
              Vertical Sport · vista operativa de demostración
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Lleva el control de tus espacios deportivos
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Vista operativa de demostración: calendario por cancha, bar y tienda, registro de clics para analíticas.
              Datos de ejemplo para tu pretotipo; luego enlazas con los servicios de tu sistema y tu base de datos.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void track('NexusSport|boton_preinscripcion');
                setModalOpen(true);
              }}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-700 hover:to-teal-700"
            >
              Pre inscripción al sistema
            </button>
            <Link
              to="/nexusstay"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-200 hover:bg-sky-50/50"
            >
              Nexus Stay
            </Link>
            <Link
              to="/nexuscare"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/70"
            >
              Nexus Care
            </Link>
            <Link
              to="/nexusgear"
              onClick={() => void track('NexusSport|link_nexusgear')}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50/70"
            >
              Nexus Gear
            </Link>
            <Link
              to="/#modulos"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/50"
            >
              Otros módulos
            </Link>
          </div>
        </header>

        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Datos demostrativos · no conectados a producción
        </p>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {KPI.map(({ label, value, sub, icon: Icon, tone }) => {
            const tones = {
              emerald: 'border-emerald-100 bg-emerald-50/80 text-emerald-700',
              teal: 'border-teal-100 bg-teal-50/80 text-teal-700',
              slate: 'border-slate-200 bg-slate-50 text-slate-700',
              amber: 'border-amber-100 bg-amber-50/90 text-amber-800',
              violet: 'border-violet-100 bg-violet-50/80 text-violet-700',
            };
            return (
              <div key={label} className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${tones[tone]}`}>
                <Icon className="mb-2 h-5 w-5 opacity-80" aria-hidden />
                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-90">{label}</p>
                <p className="mt-0.5 text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">{value}</p>
                <p className="mt-1 text-[11px] leading-snug text-slate-600">{sub}</p>
              </div>
            );
          })}
        </section>

        {/* Calendario semanal por cancha */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/90 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Calendario semanal · reservas por hora</h2>
              <p className="text-sm text-slate-500">
                Toca una celda <strong>libre</strong> para abrir el formulario de reserva (demostración). Al enviar, la
                hora queda reservada solo en esta sesión; al recargar la página vuelve al mock inicial. Cada toque y
                envío se registra como clic para tu mapa de calor en analíticas.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
            {COURT_KEYS.map((name, i) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setCourtTab(i);
                  void track(`NexusSport|calendario_pestana|${name}`);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  courtTab === i
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto p-4 sm:p-6">
            <div className="min-w-[720px]">
              <table className="w-full border-collapse overflow-hidden rounded-lg border-[3px] border-slate-700 shadow-md">
                <thead>
                  <tr className="bg-slate-200">
                    <th
                      scope="col"
                      className="border-2 border-slate-600 px-2 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-slate-800"
                    >
                      Hora
                    </th>
                    {WEEK_DAYS.map((d) => (
                      <th
                        key={d.short}
                        scope="col"
                        className="border-2 border-slate-600 px-1 py-2.5 text-center text-xs font-bold text-slate-800 sm:text-sm"
                      >
                        <span className="hidden sm:inline">{d.full}</span>
                        <span className="sm:hidden">{d.short}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOUR_SLOTS.map((hour) => (
                    <tr key={hour} className="bg-white">
                      <th
                        scope="row"
                        className="whitespace-nowrap border-2 border-slate-500 bg-slate-100 px-2 py-2 text-left text-xs font-bold tabular-nums text-slate-800"
                      >
                        {String(hour).padStart(2, '0')}:00
                      </th>
                      {WEEK_DAYS.map((_, dayIdx) => {
                        const ck = cellKey(dayIdx, hour);
                        const kind = getCellKind(dayIdx, hour);
                        const label =
                          kind === 'libre'
                            ? `Libre · tocar para reservar · ${WEEK_DAYS[dayIdx].full} · ${String(hour).padStart(2, '0')}:00`
                            : kind === 'evento'
                              ? `Reservado evento · ${courtName} · ${String(hour).padStart(2, '0')}:00`
                              : `Reservado · ${courtName} · ${String(hour).padStart(2, '0')}:00`;
                        return (
                          <td
                            key={ck}
                            role={kind === 'libre' ? 'button' : undefined}
                            tabIndex={kind === 'libre' ? 0 : undefined}
                            onClick={() => openBooking(dayIdx, hour)}
                            onKeyDown={(ev) => {
                              if (kind === 'libre' && (ev.key === 'Enter' || ev.key === ' ')) {
                                ev.preventDefault();
                                openBooking(dayIdx, hour);
                              }
                            }}
                            className={`min-h-[44px] border-2 p-0 text-center align-middle text-[10px] font-bold leading-tight sm:min-h-[48px] sm:text-xs ${kindStyles[kind]}`}
                            title={label}
                          >
                            <span className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 px-0.5 sm:min-h-[48px]">
                              {kind === 'libre' && (
                                <>
                                  <span>Libre</span>
                                  <span className="text-[9px] font-semibold opacity-80">+ reservar</span>
                                </>
                              )}
                              {kind === 'normal' && <span>Reservado</span>}
                              {kind === 'evento' && (
                                <span className="px-0.5 leading-tight">Reservado evento</span>
                              )}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-6 rounded border-2 border-slate-500 bg-slate-50 shadow-sm" /> Libre (toca
                  para reservar)
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-6 rounded border-2 border-emerald-900 bg-emerald-600 shadow-sm" /> Reservado
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-6 rounded border-2 border-violet-950 bg-violet-600 shadow-sm" />
                  Reservado evento
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-200 bg-violet-50/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Clics de esta visita (referencia rápida)</h2>
          <p className="mt-1 text-sm text-slate-600">
            Cada acción relevante se guarda en analíticas (sector Sport) con un nombre de objetivo único, para mapas de
            calor y ranking de clics en tu panel. Esta lista solo muestra lo ocurrido en esta pestaña del navegador.
          </p>
          <ul className="mt-4 max-h-52 space-y-1.5 overflow-y-auto rounded-lg border border-violet-100 bg-white p-3 font-mono text-[11px] text-slate-800">
            {sessionLog.length === 0 ? (
              <li className="text-slate-500">Aún no hay interacciones registradas en esta sesión.</li>
            ) : (
              sessionLog.map((row, i) => (
                <li key={`${row.t}-${i}`}>
                  <span className="font-semibold text-violet-700">{row.t}</span> — {row.desc}
                </li>
              ))
            )}
          </ul>
        </section>

        <div className="grid gap-8 lg:grid-cols-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="mb-6 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Ocupación por cancha / espacio</h2>
                <p className="text-sm text-slate-500">% de franjas reservadas esta semana</p>
              </div>
              <LineChart className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
            </div>
            <div className="space-y-5">
              {OCCUPANCY_BY_COURT.map((row) => (
                <div key={row.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-slate-800">{row.name}</span>
                    <span className="tabular-nums font-semibold text-slate-600">{row.pct}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${row.fill}`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900">Rendimiento rápido</h2>
            <div className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-emerald-600" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Horario pico</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Viernes y sábado 19:00–23:00. Bar alineado a picos de cancha (demostración).
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <ShoppingBasket className="mt-0.5 h-5 w-5 text-amber-600" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Ingresos: cancha y bar</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Ingresos del día: alrededor de dos tercios canchas y un tercio bar y tienda. Sirve para ver el margen
                    real del turno (demostración).
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-teal-600" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Iluminación</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Próxima versión: encendido por reserva y alertas de consumo por cancha.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bar & tienda: ventas + stock */}
        <section className="overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/40 via-white to-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-amber-100/80 bg-amber-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bar y tienda · ventas y stock</h2>
              <p className="text-sm text-slate-600">
                Control de lo que siempre se vende: cerveza, aguas, gaseosas, galletas y piqueos. Alertas cuando el
                stock cae bajo el mínimo.
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Hoy · bar y tienda</p>
              <p className="text-lg font-bold text-slate-900">S/ 1.4k</p>
              <p className="text-xs text-slate-500">211 unidades movidas</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3 font-semibold">Producto</th>
                  <th className="px-6 py-3 font-semibold">Vendido hoy</th>
                  <th className="px-6 py-3 font-semibold">Ingreso aprox.</th>
                  <th className="px-6 py-3 font-semibold">Stock actual</th>
                  <th className="px-6 py-3 font-semibold">Mínimo</th>
                  <th className="px-6 py-3 font-semibold">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {BAR_PRODUCTS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <tr key={p.name} className="hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="font-medium text-slate-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 tabular-nums text-slate-700">
                        {p.soldToday} {p.unit}
                      </td>
                      <td className="px-6 py-4 font-semibold tabular-nums text-slate-900">{p.revenue}</td>
                      <td className="px-6 py-4 tabular-nums text-slate-700">{p.stock}</td>
                      <td className="px-6 py-4 tabular-nums text-slate-500">{p.minStock}</td>
                      <td className="px-6 py-4">
                        {p.alert ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-800 ring-1 ring-orange-100">
                            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                            Reponer
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                            Correcto
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900">Agenda de hoy (detalle)</h2>
            <p className="text-sm text-slate-500">Lista por hora; el calendario arriba muestra la semana por cancha</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3 font-semibold">Hora</th>
                  <th className="px-6 py-3 font-semibold">Espacio</th>
                  <th className="px-6 py-3 font-semibold">Cliente / evento</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TODAY_SCHEDULE.map((row) => (
                  <tr key={`${row.time}-${row.court}`} className="hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-6 py-4 font-medium tabular-nums text-slate-900">{row.time}</td>
                    <td className="px-6 py-4 text-slate-700">{row.court}</td>
                    <td className="px-6 py-4 text-slate-600">{row.client}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {bookingTarget && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => {
                void track('NexusSport|reserva_mock_cerrar_sin_enviar');
                setBookingTarget(null);
              }}
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 id="booking-title" className="pr-10 text-xl font-bold text-slate-900">
              Nueva reserva (demostración)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {bookingTarget.court} · {WEEK_DAYS[bookingTarget.dayIndex].full} · {String(bookingTarget.hour).padStart(2, '0')}:00
              a {String(bookingTarget.hour + 1).padStart(2, '0')}:00. Al enviar solo se actualiza la vista en memoria;
              al recargar la página se restauran los datos de ejemplo.
            </p>
            <form className="mt-5 space-y-4" onSubmit={confirmBooking}>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="nb-nombre">
                  Nombre del equipo o responsable
                </label>
                <input
                  id="nb-nombre"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={bookingForm.nombre}
                  onChange={(e) => setBookingForm((f) => ({ ...f, nombre: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="nb-tel">
                  Teléfono o WhatsApp
                </label>
                <input
                  id="nb-tel"
                  type="tel"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={bookingForm.telefono}
                  onChange={(e) => setBookingForm((f) => ({ ...f, telefono: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="nb-nota">
                  Nota (opcional)
                </label>
                <textarea
                  id="nb-nota"
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={bookingForm.nota}
                  onChange={(e) => setBookingForm((f) => ({ ...f, nota: e.target.value }))}
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  Enviar reserva
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    void track('NexusSport|reserva_mock_cancelar');
                    setBookingTarget(null);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedSector="Sport" />
    </>
  );
};

const StatusPill = ({ status }) => {
  const styles = {
    Confirmado: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
    Pagado: 'bg-sky-50 text-sky-800 ring-sky-100',
    'En curso': 'bg-amber-50 text-amber-900 ring-amber-100',
    'Pendiente pago': 'bg-orange-50 text-orange-900 ring-orange-100',
  };
  const s = styles[status] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${s}`}>
      {status}
    </span>
  );
};

export default NexusSport;
