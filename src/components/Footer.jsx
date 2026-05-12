import { Link } from 'react-router-dom';
import {
  Trophy,
  Bed,
  HeartPulse,
  Tractor,
  Globe,
  MessageCircle,
  Share2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-violet-100 bg-white/80 pb-10 pt-14 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <Link to="/" className="text-xl font-bold text-slate-900">
              <span className="text-violet-600">Kallpa</span>Nexus
            </Link>
            <p className="text-sm leading-relaxed text-slate-600">
              Plataforma SaaS multi-tenant para operar Sport, Stay, Care y Gear con una sola base
              tecnológica, analíticas propias y enfoque enterprise para el mercado local.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={Share2} href="#" />
              <SocialIcon icon={Globe} href="#" />
              <SocialIcon icon={MessageCircle} href="#" />
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-900">Soluciones</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <FooterLink icon={Trophy} text="Nexus Sport" to="/nexussport" />
              </li>
              <li>
                <FooterLink icon={Bed} text="Nexus Stay" to="/nexusstay" />
              </li>
              <li>
                <FooterLink icon={HeartPulse} text="Nexus Care" to="/nexuscare" />
              </li>
              <li>
                <FooterLink icon={Tractor} text="Nexus Gear" to="/nexusgear" />
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-900">Empresa</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link to="/" className="transition-colors hover:text-violet-600">
                  Sobre el producto
                </Link>
              </li>
              <li>
                <Link to="/#precios" className="transition-colors hover:text-violet-600">
                  Planes
                </Link>
              </li>
              <li>
                <Link to="/" className="transition-colors hover:text-violet-600">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link to="/" className="transition-colors hover:text-violet-600">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-900">Contacto</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
                <span>+51 951 907 810</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
                <span>contacto@kallpanexus.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
                <span>Tingo María, Huánuco — Perú</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-violet-100 pt-8 text-xs text-slate-500 md:flex-row">
          <p>© 2026 KallpaNexus. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span>Powered by KallpaTech</span>
            <span className="text-violet-500">Innovación desde la Selva Peruana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ icon: Icon, text, to }) => (
  <Link to={to} className="group flex items-center gap-2 transition-colors hover:text-violet-700">
    <Icon className="h-3.5 w-3.5 text-violet-500 transition-colors group-hover:text-violet-600" aria-hidden />
    <span>{text}</span>
  </Link>
);

const SocialIcon = ({ icon: Icon, href }) => (
  <a
    href={href}
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
  >
    <Icon className="h-[18px] w-[18px]" aria-hidden />
  </a>
);

export default Footer;
