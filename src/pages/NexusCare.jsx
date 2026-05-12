import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  HeartPulse,
  CalendarClock,
  ClipboardList,
  ShieldCheck,
  UserRound,
  Stethoscope,
  Sparkles,
  Activity,
  Users,
  Clock,
  FileText,
  Syringe,
  X,
  Bell,
  ChevronDown,
} from 'lucide-react';
import LeadModal from '../components/LeadModal';
import AnonymousRecommendationsBox from '../components/AnonymousRecommendationsBox';
import api from '../api/cliente';
import { getClientPathname } from '../utils/appPath';

async function trackCare(targetName) {
  try {
    await api.post('/analytics/track', {
      eventType: 'CLICK',
      targetName: `NexusCare|${targetName}`,
      sector: 'Care',
      url: typeof window !== 'undefined' ? getClientPathname('/nexuscare') : '/nexuscare',
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Móvil' : 'Escritorio',
    });
  } catch {
    /* silencioso */
  }
}

const TODAY_APPOINTMENTS = [
  { time: '09:00', patient: 'Paciente demo · consulta', room: 'Box 1', pro: 'Dra. V.', status: 'Confirmado' },
  { time: '10:30', patient: 'Control post-procedimiento', room: 'Box 2', pro: 'Dr. M.', status: 'En sala' },
  { time: '11:45', patient: 'Valoración estética', room: 'Consultorio A', pro: 'Lic. R.', status: 'Confirmado' },
  { time: '15:00', patient: 'Láser · sesión 2/4', room: 'Cabina láser', pro: 'Téc. L.', status: 'Pendiente pago' },
];

const SERVICES = [
  {
    title: 'Consulta médica / valoración',
    text: 'Agenda por profesional, duración estándar, notas SOAP resumidas y adjuntos controlados.',
  },
  {
    title: 'Estética y bienestar',
    text: 'Tratamientos recurrentes (láser, limpiezas, masajes): paquetes, contraindicaciones y consentimiento informado.',
  },
  {
    title: 'Control de cabinas y equipos',
    text: 'Ocupación por sala, esterilización y mantenimiento de equipos con trazabilidad mínima para auditoría.',
  },
];

const JOURNEY = [
  { title: 'Reserva y triage', desc: 'Canal web o recepción: motivo, profesional preferido y políticas de cancelación.', icon: CalendarClock },
  { title: 'Consentimiento y ficha', desc: 'Firma digital o registro de versión; alergias y alertas visibles en agenda.', icon: FileText },
  { title: 'Atención', desc: 'Cronómetro de sesión, consumibles vinculados al acto y notas clínicas breves.', icon: Stethoscope },
  { title: 'Post-atención', desc: 'Indicaciones, próxima cita y mensaje seguro (sin datos sensibles en texto libre).', icon: ClipboardList },
  { title: 'Cierre operativo', desc: 'Pago, facturación y métricas de ocupación por profesional y por servicio.', icon: Activity },
];

const RECEPTION_QUEUE = [
  { name: 'Paciente demo · consulta', code: 'C-1042', wait: '—', state: 'En cabina', room: 'Box 1' },
  { name: 'Control post-procedimiento', code: 'C-9811', wait: '2 min', state: 'Llamar', room: 'Box 2' },
  { name: 'Valoración estética', code: 'C-1203', wait: '14 min', state: 'Espera', room: '—' },
  { name: 'Láser · sesión 2/4', code: 'C-0550', wait: '22 min', state: 'Espera', room: '—' },
];

const INTERES_DEMO_CARE = [
  {
    id: 'recordatorios_whatsapp',
    label: 'Recordatorios por WhatsApp',
    detalles: [
      'Plantillas por tipo de cita y canal preferido del paciente.',
      'Confirmación, reprogramación y recordatorio de políticas.',
      'Sin datos clínicos sensibles en el texto del mensaje.',
    ],
  },
  {
    id: 'consentimientos_digitales',
    label: 'Consentimientos digitales',
    detalles: [
      'Versionado de documentos y trazabilidad de firma.',
      'Asociación al acto o al paquete de tratamiento.',
      'Descarga para archivo del paciente o institución.',
    ],
  },
  {
    id: 'reporte_por_profesional',
    label: 'Reporte por profesional',
    detalles: [
      'Ocupación de agenda y mix de servicios.',
      'Tiempo medio de sesión y huecos no utilizados.',
      'Exportación para comisiones o nómina.',
    ],
  },
  {
    id: 'multi_sede',
    label: 'Multi-sede / sucursales',
    detalles: [
      'Catálogo de servicios por sede con reglas propias.',
      'Agenda centralizada o vista filtrada por ubicación.',
      'Traslado de historial resumido entre sedes con permisos.',
    ],
  },
  {
    id: 'portal_paciente',
    label: 'Portal del paciente',
    detalles: [
      'Próximas citas y documentos compartidos.',
      'Pago de señas o saldos pendientes.',
      'Canal seguro para resultados no urgentes.',
    ],
  },
  {
    id: 'inventario_insumos',
    label: 'Inventario de insumos',
    detalles: [
      'Stock por cabina o por almacén.',
      'Consumo vinculado al acto para costeo.',
      'Alertas de mínimo y orden de compra sugerida.',
    ],
  },
];

const CHECKLIST = [
  {
    letter: 'A',
    title: 'Agenda y sala de espera',
    items: [
      'Vista diaria por profesional y por cabina.',
      'Lista de espera con prioridad y tiempo estimado.',
      'Bloqueo de huecos para procedimientos largos o equipamiento especial.',
    ],
  },
  {
    letter: 'B',
    title: 'Historia y continuidad',
    items: [
      'Resumen por visita (no sustituye historia legal completa).',
      'Adjuntos clasificados (consentimientos, laboratorio externo).',
      'Alertas de interacción o alergias en cabecera del turno.',
    ],
  },
  {
    letter: 'C',
    title: 'Cumplimiento y estética institucional',
    items: [
      'Roles: recepción, profesional, administración — permisos separados.',
      'Bitácora de accesos a datos sensibles (auditoría).',
      'Branding sobrio para recepción y tablets de sala (coherencia con esta vista).',
    ],
  },
];

const NexusCare = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [receptionOpen, setReceptionOpen] = useState(false);
  const [agendaDetailOpen, setAgendaDetailOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [checked, setChecked] = useState({});
  const [interesAbierto, setInteresAbierto] = useState(null);

  const toggle = useCallback((key) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!prev[key]) void trackCare(`checklist|${key}`);
      return next;
    });
  }, []);

  return (
    <>
      <div className="animate-in fade-in space-y-12 pb-16 duration-500">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1 font-medium text-teal-800 hover:text-teal-900">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
          <span className="font-medium text-slate-800">Nexus Care</span>
        </div>

        <div
          role="note"
          className="flex flex-wrap items-start gap-3 rounded-xl border border-teal-200/80 bg-teal-50/90 px-4 py-3 text-sm text-teal-950"
        >
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" aria-hidden />
          <p>
            <strong className="font-semibold">Vista de producto (demostración).</strong> No almacena datos clínicos
            reales. En producción, Care cumple políticas de privacidad, retención y consentimiento según normativa
            aplicable.
          </p>
        </div>

        <header className="flex flex-col gap-6 border-b border-slate-200/90 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-800">
              <HeartPulse className="h-3.5 w-3.5" aria-hidden />
              Vertical Care · salud y estética
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Agenda clínica, control de servicios y trazabilidad sin perder seriedad
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
              Nexus Care está pensado para clínicas, centros médicos estéticos y spas médicos: citas confirmables,
              continuidad del paciente/cliente y tableros operativos para dirección — con una interfaz sobria acorde a
              entornos de salud.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                void trackCare('boton_preinscripcion');
                setModalOpen(true);
              }}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800"
            >
              Pre inscripción — Care
            </button>
            <Link
              to="/nexusstay"
              onClick={() => void trackCare('link_nexusstay')}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50/50"
            >
              Nexus Stay
            </Link>
            <Link
              to="/nexussport"
              onClick={() => void trackCare('link_nexussport')}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/50"
            >
              Nexus Sport
            </Link>
            <Link
              to="/nexusgear"
              onClick={() => void trackCare('link_nexusgear')}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50/60"
            >
              Nexus Gear
            </Link>
          </div>
        </header>

        {/* KPIs operativos (mock) */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Citas confirmadas hoy', value: '14', sub: '2 pendientes de confirmación', icon: CalendarClock },
            { label: 'Sala de espera', value: '5', sub: 'Tiempo medio estimado 12 min', icon: Users },
            { label: 'Ocupación cabinas', value: '78%', sub: 'Meta operativa 85%', icon: Activity },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                <Icon className="h-4 w-4 text-teal-700" aria-hidden />
                {label}
              </div>
              <p className="mt-2 text-3xl font-extrabold tabular-nums text-slate-900">{value}</p>
              <p className="mt-1 text-xs text-slate-600">{sub}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-teal-200/90 bg-gradient-to-br from-teal-50/90 via-white to-slate-50/80 p-6 shadow-sm ring-1 ring-teal-100/80">
          <h2 className="text-lg font-bold text-slate-900">Funcionalidades destacadas</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Toca un tema para ver el alcance previsto en Nexus Care (contenido orientativo).
          </p>
          <div className="mt-4 space-y-2">
            {INTERES_DEMO_CARE.map(({ id, label, detalles }) => {
              const abierto = interesAbierto === id;
              return (
                <div key={id} className="overflow-hidden rounded-xl border border-teal-200/90 bg-white shadow-sm">
                  <button
                    type="button"
                    aria-expanded={abierto}
                    onClick={() => {
                      setInteresAbierto((prev) => {
                        const next = prev === id ? null : id;
                        if (next === id) void trackCare(`interes_mock|${id}`);
                        return next;
                      });
                    }}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-teal-950 transition hover:bg-teal-50/80"
                  >
                    <span>{label}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-teal-700 transition-transform ${abierto ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                  {abierto ? (
                    <div className="border-t border-teal-100 bg-slate-50/60 px-4 py-3">
                      <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                        {detalles.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* Agenda del día */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Agenda del día (ejemplo)</h2>
            <button
              type="button"
              onClick={() => {
                void trackCare('agenda_ver_detalle');
                setAgendaDetailOpen(true);
              }}
              className="text-sm font-semibold text-teal-800 underline-offset-2 hover:underline"
            >
              Ver detalle en panel (pretotipo)
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-600">
                  <th className="px-4 py-3">Hora</th>
                  <th className="px-4 py-3">Motivo / servicio</th>
                  <th className="px-4 py-3">Sala</th>
                  <th className="px-4 py-3">Profesional</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TODAY_APPOINTMENTS.map((row) => (
                  <tr key={`${row.time}-${row.patient}`}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-800">{row.time}</td>
                    <td className="px-4 py-3 text-slate-800">{row.patient}</td>
                    <td className="px-4 py-3 text-slate-600">{row.room}</td>
                    <td className="px-4 py-3 text-slate-600">{row.pro}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Syringe className="h-6 w-6 text-teal-700" aria-hidden />
              Catálogo de servicios y control
            </h2>
            <ul className="mt-4 space-y-4">
              {SERVICES.map((s) => (
                <li key={s.title} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <h3 className="font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                void trackCare('servicios_ver_politicas');
                setPoliciesOpen(true);
              }}
              className="mt-4 text-sm font-semibold text-teal-800 underline-offset-2 hover:underline"
            >
              Políticas de cancelación y no presentado (demo)
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <UserRound className="h-6 w-6 text-slate-700" aria-hidden />
              Continuidad y recepción
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <strong className="text-slate-900">Identidad verificada en recepción:</strong> documento o código de
                cita; registro de llegada con marca de tiempo.
              </li>
              <li>
                <strong className="text-slate-900">Historial resumido:</strong> últimas visitas, alertas y consentimientos
                vigentes visibles antes de entrar a cabina.
              </li>
              <li>
                <strong className="text-slate-900">Mensajería sobria:</strong> recordatorios y resultados sin datos
                clínicos sensibles en notificaciones push.
              </li>
            </ul>
            <button
              type="button"
              onClick={() => {
                void trackCare('panel_recepcion_mock');
                setReceptionOpen(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Clock className="h-4 w-4" aria-hidden />
              Abrir vista recepción (mock)
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Flujo clínico / estético</h2>
          <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {JOURNEY.map(({ title, desc, icon: Icon }, i) => (
              <li
                key={title}
                className="relative flex gap-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/90 p-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-900">
                  {i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-teal-700" aria-hidden />
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
                Alcance funcional para Nexus Care. Las casillas sirven en demo con stakeholders (solo este navegador).
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              <Sparkles className="h-3 w-3" aria-hidden />
              Pretotipo
            </span>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {CHECKLIST.map((block) => (
              <div key={block.letter} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-800 text-sm text-white">
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
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-800 focus:ring-teal-600"
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

        <AnonymousRecommendationsBox accentClass="from-teal-800 to-slate-900" />

        <p className="text-center text-xs text-slate-500">
          Nexus Care · referencia de producto · sin datos reales de pacientes
        </p>
      </div>

      {receptionOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reception-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReceptionOpen(false);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-900 px-5 py-4 text-white">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-teal-300/90">Nexus Care · demo</p>
                <h2 id="reception-title" className="text-lg font-bold">
                  Vista recepción
                </h2>
                <p className="mt-1 text-xs text-slate-300">Cola del día y estados (datos ficticios).</p>
              </div>
              <button
                type="button"
                onClick={() => setReceptionOpen(false)}
                className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="max-h-[calc(90vh-6rem)] space-y-5 overflow-y-auto p-5">
              <div className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                <Bell className="h-4 w-4 shrink-0 text-amber-700" aria-hidden />
                <span>
                  <strong className="font-semibold">Aviso operativo:</strong> 1 cita con pago pendiente antes de las
                  15:00.
                </span>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Sala de espera / llamados</h3>
                <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {RECEPTION_QUEUE.map((row) => (
                    <li key={row.code} className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 text-sm">
                      <div>
                        <p className="font-semibold text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500">
                          Código <span className="font-mono">{row.code}</span>
                          {row.room !== '—' && (
                            <>
                              {' '}
                              · {row.room}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            row.state === 'En cabina'
                              ? 'bg-teal-100 text-teal-900'
                              : row.state === 'Llamar'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {row.state}
                        </span>
                        <p className="mt-0.5 text-xs text-slate-500">Espera {row.wait}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-center text-xs text-slate-400">
                En el producto final esta vista viviría en tablet o segundo monitor de recepción.
              </p>
            </div>
          </div>
        </div>
      )}

      {agendaDetailOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agenda-detail-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAgendaDetailOpen(false);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-teal-50/80 px-5 py-4">
              <h2 id="agenda-detail-title" className="text-lg font-bold text-slate-900">
                Detalle agenda · hoy
              </h2>
              <button
                type="button"
                onClick={() => setAgendaDetailOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-800"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="max-h-[calc(90vh-5rem)] overflow-y-auto p-5">
              <p className="mb-4 text-sm text-slate-600">
                Misma información que la tabla principal, con foco en coordinación entre recepción y cabinas.
              </p>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                    <th className="pb-2">Hora</th>
                    <th className="pb-2">Motivo</th>
                    <th className="pb-2">Sala</th>
                    <th className="pb-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TODAY_APPOINTMENTS.map((row) => (
                    <tr key={`d-${row.time}`}>
                      <td className="py-2 font-mono text-xs">{row.time}</td>
                      <td className="py-2 text-slate-800">{row.patient}</td>
                      <td className="py-2 text-slate-600">{row.room}</td>
                      <td className="py-2 text-slate-600">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {policiesOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="policies-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPoliciesOpen(false);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 id="policies-title" className="text-lg font-bold text-slate-900">
                Políticas (demo)
              </h2>
              <button
                type="button"
                onClick={() => setPoliciesOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="max-h-[calc(90vh-5rem)] space-y-3 overflow-y-auto p-5 text-sm text-slate-700">
              <p>
                <strong className="text-slate-900">Cancelación:</strong> reprogramación sin coste hasta 24 h antes;
                dentro de 24 h puede aplicarse cargo según tabla del centro.
              </p>
              <p>
                <strong className="text-slate-900">No presentado:</strong> bloqueo suave de nueva reserva web hasta
                regularizar; recepción puede liberar la excepción con nota de auditoría.
              </p>
              <p className="text-xs text-slate-500">Texto orientativo para talleres con clientes; no constituye asesoría legal.</p>
            </div>
          </div>
        </div>
      )}

      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedSector="Care" />
    </>
  );
};

export default NexusCare;
