import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/cliente';
import { clearAdminJwt } from '../utils/adminAuth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Users, MousePointer2, Briefcase, Eye, MessageSquare, Lock, HeartPulse, Tractor, LogOut, Trophy, Bed } from 'lucide-react';
import { describeAnalyticsClick } from '../utils/analyticsClickLabels';

const COLORS = ['#16a34a', '#2563eb', '#9333ea', '#ea580c'];

/** Colores consistentes por vertical en el gráfico de sectores */
const SECTOR_BAR_COLORS = {
  Sport: '#16a34a',
  Stay: '#2563eb',
  Care: '#0f766e',
  Gear: '#ea580c',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [topClicks, setTopClicks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [clubSurveys, setClubSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resLeads, resStats, resPages, resClicks, resReco] = await Promise.all([
        api.get('/leads'),
        api.get('/analytics/summary-sectors'),
        api.get('/analytics/top-pages'),
        api.get('/analytics/top-clicks'),
        api.get('/recommendations/recent?take=20'),
      ]);
      setLeads(resLeads.data);
      setSectorData(resStats.data);
      setTopPages(resPages.data ?? []);
      setTopClicks(resClicks.data ?? []);
      setRecommendations(resReco.data ?? []);
      try {
        const resClub = await api.get('/PrivateClubSurvey/recent?take=30');
        setClubSurveys(resClub.data ?? []);
      } catch {
        setClubSurveys([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos del dashboard', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-lg font-medium text-slate-600">Cargando estadísticas…</div>
    );
  }

  const totalInteractions = sectorData.reduce((acc, curr) => acc + (curr.total ?? 0), 0);

  const careSectorTotal = sectorData.find((s) => s.sector === 'Care')?.total ?? 0;
  const careLeadsCount = leads.filter((l) => String(l.sector) === 'Care').length;
  const careClickRows = topClicks.filter((c) => String(c.elemento).startsWith('NexusCare|')).slice(0, 12);
  const careClicksSum = careClickRows.reduce((a, r) => a + (r.clicks ?? 0), 0);
  const careVisits = topPages.find((p) => p.ruta === '/nexuscare')?.visitas ?? 0;

  const sportSectorTotal = sectorData.find((s) => s.sector === 'Sport')?.total ?? 0;
  const sportLeadsCount = leads.filter((l) => String(l.sector) === 'Sport').length;
  const sportClickRows = topClicks.filter((c) => String(c.elemento).startsWith('NexusSport|')).slice(0, 12);
  const sportClicksSum = sportClickRows.reduce((a, r) => a + (r.clicks ?? 0), 0);
  const sportVisits = topPages.find((p) => p.ruta === '/nexussport')?.visitas ?? 0;

  const staySectorTotal = sectorData.find((s) => s.sector === 'Stay')?.total ?? 0;
  const stayLeadsCount = leads.filter((l) => String(l.sector) === 'Stay').length;
  const stayClickRows = topClicks.filter((c) => String(c.elemento).startsWith('NexusStay|')).slice(0, 12);
  const stayClicksSum = stayClickRows.reduce((a, r) => a + (r.clicks ?? 0), 0);
  const stayVisits = topPages.find((p) => p.ruta === '/nexusstay')?.visitas ?? 0;

  const gearSectorTotal = sectorData.find((s) => s.sector === 'Gear')?.total ?? 0;
  const gearLeadsCount = leads.filter((l) => String(l.sector) === 'Gear').length;
  const gearClickRows = topClicks.filter((c) => String(c.elemento).startsWith('NexusGear|')).slice(0, 12);
  const gearClicksSum = gearClickRows.reduce((a, r) => a + (r.clicks ?? 0), 0);
  const gearVisits = topPages.find((p) => p.ruta === '/nexusgear')?.visitas ?? 0;

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Panel de control</h1>
          <p className="mt-1 text-slate-600">
            Monitoreo del interés en KallpaNexus: visitas por ruta, clics y recomendaciones anónimas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Actualizar datos
          </button>
          <button
            type="button"
            onClick={() => {
              clearAdminJwt();
              navigate('/login', { replace: true });
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-rose-50 hover:text-rose-900"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Total leads" val={leads.length} icon={Users} color="text-violet-600" chip="bg-violet-50" />
        <StatCard title="Verticales" val="4" icon={Briefcase} color="text-sky-600" chip="bg-sky-50" />
        <StatCard
          title="Interacciones (sector)"
          val={totalInteractions}
          icon={MousePointer2}
          color="text-emerald-600"
          chip="bg-emerald-50"
        />
        <StatCard
          title="Recomendaciones (panel)"
          val={recommendations.length}
          icon={MessageSquare}
          color="text-fuchsia-600"
          chip="bg-fuchsia-50"
        />
        <StatCard
          title="Encuestas acceso reservado"
          val={clubSurveys.length}
          icon={Lock}
          color="text-rose-700"
          chip="bg-rose-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-xl font-bold text-slate-900">Interés por sector</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="sector" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                  }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {sectorData.map((entry) => (
                    <Cell
                      key={`cell-${entry.sector}`}
                      fill={SECTOR_BAR_COLORS[entry.sector] ?? '#64748b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-slate-900">
            <Eye className="h-5 w-5 text-sky-600" aria-hidden />
            Mapa de calor · rutas más visitadas
          </h3>
          <p className="mb-4 text-xs text-slate-500">Basado en eventos VISIT (una fila por carga de ruta).</p>
          <div className="max-h-[280px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-2 font-medium">Ruta</th>
                  <th className="pb-2 text-right font-medium">Visitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topPages.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-6 text-center text-slate-500">
                      Aún no hay visitas registradas.
                    </td>
                  </tr>
                ) : (
                  topPages.map((row) => (
                    <tr key={row.ruta}>
                      <td className="py-2 font-mono text-xs text-slate-800">{row.ruta}</td>
                      <td className="py-2 text-right tabular-nums text-slate-700">{row.visitas}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 p-6 shadow-sm ring-1 ring-slate-200/90">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Trophy className="h-6 w-6 shrink-0 text-emerald-800" aria-hidden />
              Nexus Sport — espacios deportivos
            </h3>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Resumen para dirección: eventos con sector <strong className="text-slate-800">Sport</strong>, preinscripciones,
              visitas a la ruta <span className="font-mono text-xs text-slate-500">/nexussport</span> y los clics
              etiquetados como <span className="font-mono text-xs text-slate-500">NexusSport|…</span>.
            </p>
          </div>
        </div>
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Eventos sector Sport</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-emerald-900">{sportSectorTotal}</p>
            <p className="text-xs text-slate-500">Clics y acciones con sector asignado</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Leads Sport</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{sportLeadsCount}</p>
            <p className="text-xs text-slate-500">Preinscripciones desde la vertical</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Visitas /nexussport</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{sportVisits}</p>
            <p className="text-xs text-slate-500">Cargas de página (VISIT)</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Clics en vista Sport</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{sportClicksSum}</p>
            <p className="text-xs text-slate-500">Suma top acciones NexusSport| (tabla)</p>
          </div>
        </div>
        {sportClickRows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-center text-sm text-slate-500">
            Aún no hay clics registrados desde Nexus Sport. Navega la vista demo y vuelve a actualizar.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <h4 className="border-b border-slate-100 bg-slate-50/90 px-4 py-3 text-sm font-bold text-slate-800">
              Acciones más frecuentes (Nexus Sport)
            </h4>
            <div className="max-h-[220px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2">Interacción</th>
                    <th className="px-4 py-2 text-right">Clics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sportClickRows.map((row, idx) => {
                    const { label, title } = describeAnalyticsClick(row.elemento);
                    return (
                      <tr key={`sport-${row.elemento}-${idx}`}>
                        <td className="cursor-help px-4 py-2 text-slate-800" title={title || row.elemento}>
                          {label}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-700">{row.clicks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-slate-50 via-white to-sky-50/50 p-6 shadow-sm ring-1 ring-slate-200/90">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Bed className="h-6 w-6 shrink-0 text-sky-800" aria-hidden />
              Nexus Stay — hospedaje y rentas
            </h3>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Resumen para dirección: eventos con sector <strong className="text-slate-800">Stay</strong>, preinscripciones,
              visitas a la ruta <span className="font-mono text-xs text-slate-500">/nexusstay</span> y los clics
              etiquetados como <span className="font-mono text-xs text-slate-500">NexusStay|…</span>.
            </p>
          </div>
        </div>
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Eventos sector Stay</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-sky-900">{staySectorTotal}</p>
            <p className="text-xs text-slate-500">Clics y acciones con sector asignado</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Leads Stay</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{stayLeadsCount}</p>
            <p className="text-xs text-slate-500">Preinscripciones desde la vertical</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Visitas /nexusstay</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{stayVisits}</p>
            <p className="text-xs text-slate-500">Cargas de página (VISIT)</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Clics en vista Stay</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{stayClicksSum}</p>
            <p className="text-xs text-slate-500">Suma top acciones NexusStay| (tabla)</p>
          </div>
        </div>
        {stayClickRows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-center text-sm text-slate-500">
            Aún no hay clics registrados desde Nexus Stay. Navega la vista demo y vuelve a actualizar.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <h4 className="border-b border-slate-100 bg-slate-50/90 px-4 py-3 text-sm font-bold text-slate-800">
              Acciones más frecuentes (Nexus Stay)
            </h4>
            <div className="max-h-[220px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2">Interacción</th>
                    <th className="px-4 py-2 text-right">Clics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stayClickRows.map((row, idx) => {
                    const { label, title } = describeAnalyticsClick(row.elemento);
                    return (
                      <tr key={`stay-${row.elemento}-${idx}`}>
                        <td className="cursor-help px-4 py-2 text-slate-800" title={title || row.elemento}>
                          {label}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-700">{row.clicks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-slate-50 via-white to-teal-50/50 p-6 shadow-sm ring-1 ring-slate-200/90">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <HeartPulse className="h-6 w-6 shrink-0 text-teal-800" aria-hidden />
              Nexus Care — salud y estética
            </h3>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Resumen para dirección: eventos con sector <strong className="text-slate-800">Care</strong>, preinscripciones,
              visitas a la ruta <span className="font-mono text-xs text-slate-500">/nexuscare</span> y los clics
              etiquetados como <span className="font-mono text-xs text-slate-500">NexusCare|…</span>.
            </p>
          </div>
        </div>
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Eventos sector Care</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-teal-900">{careSectorTotal}</p>
            <p className="text-xs text-slate-500">Clics y acciones con sector asignado</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Leads Care</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{careLeadsCount}</p>
            <p className="text-xs text-slate-500">Preinscripciones desde la vertical</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Visitas /nexuscare</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{careVisits}</p>
            <p className="text-xs text-slate-500">Cargas de página (VISIT)</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Clics en vista Care</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{careClicksSum}</p>
            <p className="text-xs text-slate-500">Suma top acciones NexusCare| (tabla)</p>
          </div>
        </div>
        {careClickRows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-center text-sm text-slate-500">
            Aún no hay clics registrados desde Nexus Care. Navega la vista demo y vuelve a actualizar.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <h4 className="border-b border-slate-100 bg-slate-50/90 px-4 py-3 text-sm font-bold text-slate-800">
              Acciones más frecuentes (Nexus Care)
            </h4>
            <div className="max-h-[220px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2">Interacción</th>
                    <th className="px-4 py-2 text-right">Clics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {careClickRows.map((row, idx) => {
                    const { label, title } = describeAnalyticsClick(row.elemento);
                    return (
                      <tr key={`care-${row.elemento}-${idx}`}>
                        <td className="cursor-help px-4 py-2 text-slate-800" title={title || row.elemento}>
                          {label}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-700">{row.clicks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-slate-50 via-white to-amber-50/40 p-6 shadow-sm ring-1 ring-slate-200/90">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Tractor className="h-6 w-6 shrink-0 text-amber-900" aria-hidden />
              Nexus Gear — flota, taller y patio
            </h3>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Resumen para dirección: eventos con sector <strong className="text-slate-800">Gear</strong>, preinscripciones,
              visitas a la ruta <span className="font-mono text-xs text-slate-500">/nexusgear</span> y los clics
              etiquetados como <span className="font-mono text-xs text-slate-500">NexusGear|…</span>.
            </p>
          </div>
        </div>
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Eventos sector Gear</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-amber-950">{gearSectorTotal}</p>
            <p className="text-xs text-slate-500">Clics y acciones con sector asignado</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Leads Gear</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{gearLeadsCount}</p>
            <p className="text-xs text-slate-500">Preinscripciones desde la vertical</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Visitas /nexusgear</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{gearVisits}</p>
            <p className="text-xs text-slate-500">Cargas de página (VISIT)</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Clics en vista Gear</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{gearClicksSum}</p>
            <p className="text-xs text-slate-500">Suma top acciones NexusGear| (tabla)</p>
          </div>
        </div>
        {gearClickRows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-center text-sm text-slate-500">
            Aún no hay clics registrados desde Nexus Gear. Navega la vista demo y vuelve a actualizar.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <h4 className="border-b border-slate-100 bg-slate-50/90 px-4 py-3 text-sm font-bold text-slate-800">
              Acciones más frecuentes (Nexus Gear)
            </h4>
            <div className="max-h-[220px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2">Interacción</th>
                    <th className="px-4 py-2 text-right">Clics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gearClickRows.map((row, idx) => {
                    const { label, title } = describeAnalyticsClick(row.elemento);
                    return (
                      <tr key={`gear-${row.elemento}-${idx}`}>
                        <td className="cursor-help px-4 py-2 text-slate-800" title={title || row.elemento}>
                          {label}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-700">{row.clicks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Top clics</h3>
          <p className="mb-4 mt-1 text-xs text-slate-500">
            Descripción en español. Pasa el cursor sobre una fila para ver el identificador técnico guardado en la base de datos.
          </p>
          <div className="max-h-[260px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-2 font-medium">Interacción</th>
                  <th className="pb-2 text-right font-medium">Clics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topClicks.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-6 text-center text-slate-500">
                      Aún no hay clics registrados.
                    </td>
                  </tr>
                ) : (
                  topClicks.slice(0, 15).map((row, idx) => {
                    const { label, title } = describeAnalyticsClick(row.elemento);
                    return (
                      <tr key={`${row.elemento}-${idx}`}>
                        <td
                          className="cursor-help py-2 text-sm leading-snug text-slate-800"
                          title={title || row.elemento}
                        >
                          {label}
                        </td>
                        <td className="py-2 text-right tabular-nums text-slate-700">{row.clicks}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-slate-900">Registros recientes (leads)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium">Sector</th>
                  <th className="pb-3 font-medium">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id}>
                    <td className="py-4 font-medium text-slate-900">{lead.name}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-100">
                        {lead.sector}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600">{lead.telephone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6 shadow-sm">
        <h3 className="mb-2 text-xl font-bold text-slate-900">Encuestas · acceso reservado</h3>
        <p className="mb-4 text-xs text-slate-600">
          Interés en la propuesta (1–5) e intención de visitar el local. Datos confidenciales; trata este panel como sensible.
        </p>
        <div className="max-h-[280px] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-rose-100 text-slate-500">
                <th className="pb-2 font-medium">Interés</th>
                <th className="pb-2 font-medium">Visitaría</th>
                <th className="pb-2 font-medium">Contacto</th>
                <th className="pb-2 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-100/80">
              {clubSurveys.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    Sin respuestas o migración pendiente en la API.
                  </td>
                </tr>
              ) : (
                clubSurveys.map((row) => (
                  <tr key={row.id}>
                    <td className="py-2 tabular-nums">{row.interestScore}</td>
                    <td className="py-2 tabular-nums">{row.visitIntentScore}</td>
                    <td className="py-2 text-xs text-slate-600">{row.contactPhone ?? '—'}</td>
                    <td className="py-2 text-xs text-slate-500">
                      {row.createdAtUtc ? new Date(row.createdAtUtc).toLocaleString('es-PE') : ''}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 max-h-[160px] space-y-2 overflow-y-auto text-xs text-slate-600">
          {clubSurveys.slice(0, 8).map((row) =>
            row.comment ? (
              <li key={`c-${row.id}`} className="rounded-lg border border-rose-100/80 bg-white/80 px-3 py-2">
                {row.comment}
              </li>
            ) : null,
          )}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-xl font-bold text-slate-900">Recomendaciones anónimas (recientes)</h3>
        <p className="mb-4 text-xs text-slate-500">Sin identificación de persona; solo texto y ruta de origen.</p>
        <ul className="max-h-[320px] space-y-3 overflow-y-auto text-sm">
          {recommendations.length === 0 ? (
            <li className="text-slate-500">No hay mensajes aún.</li>
          ) : (
            recommendations.map((r) => (
              <li key={r.id} className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                <p className="text-slate-800">{r.message}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {r.pagePath ? (
                    <>
                      Origen: <span className="font-mono">{r.pagePath}</span> ·{' '}
                    </>
                  ) : null}
                  {r.createdAtUtc ? new Date(r.createdAtUtc).toLocaleString('es-PE') : ''}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ title, val, icon: Icon, color, chip }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className={`rounded-xl p-3 ${chip} ${color}`}>
      <Icon className="h-6 w-6" aria-hidden />
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{val}</p>
    </div>
  </div>
);

export default Dashboard;
