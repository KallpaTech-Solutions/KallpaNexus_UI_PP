import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GuideBot from '../components/GuideBot';

export default function MainShell() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/90 via-white to-slate-50 text-slate-900 relative overflow-x-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-violet-200/40 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-[380px] w-[380px] rounded-full bg-fuchsia-100/50 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[280px] w-[280px] rounded-full bg-indigo-100/40 blur-3xl" aria-hidden />
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 py-10 md:py-16">
        <Outlet />
      </main>
      <Footer />
      <GuideBot />
    </div>
  );
}
