import { Link } from 'react-router-dom';
import { LayoutDashboard, Home as HomeIcon, Sparkles, Trophy, Bed, HeartPulse } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-violet-100/80 bg-white/75 backdrop-blur-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/25">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <span>
            <span className="text-violet-600">Kallpa</span>
            <span className="text-slate-800">Nexus</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link
            to="/nexussport"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50"
          >
            <Trophy className="h-3.5 w-3.5" aria-hidden />
            Nexus Sport
          </Link>
          <Link
            to="/nexusstay"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-sky-800 transition-colors hover:bg-sky-50"
          >
            <Bed className="h-3.5 w-3.5" aria-hidden />
            Nexus Stay
          </Link>
          <Link
            to="/nexuscare"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-teal-900 transition-colors hover:bg-teal-50"
          >
            <HeartPulse className="h-3.5 w-3.5" aria-hidden />
            Nexus Care
          </Link>
          <Link
            to="/#modulos"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700"
          >
            Módulos
          </Link>
          <Link
            to="/#plataforma"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700"
          >
            Plataforma
          </Link>
          <Link
            to="/#precios"
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700"
          >
            Precios
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700"
          >
            <HomeIcon className="h-4 w-4" aria-hidden />
            Inicio
          </Link>
          <Link
            to="/admin"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm transition-all hover:border-violet-300 hover:bg-violet-50"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            Acceso admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
