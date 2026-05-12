import { useState, useEffect } from 'react';
import api from '../api/cliente';
import { X, Send } from 'lucide-react';

const LeadModal = ({ isOpen, onClose, selectedSector }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    company: '',
    sector: selectedSector,
    preferredContactMethod: 'WhatsApp',
  });

  useEffect(() => {
    if (isOpen) setFormData((prev) => ({ ...prev, sector: selectedSector }));
  }, [selectedSector, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads', { ...formData, sector: selectedSector });
      alert('¡Gracias! Te contactaremos pronto.');
      onClose();
    } catch (error) {
      console.error('Error al registrar lead', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl shadow-violet-200/50">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">Únete a KallpaNexus</h2>
        <p className="mt-2 text-slate-600">
          Estamos en lanzamiento. Prioridad para equipos en{' '}
          <span className="font-semibold text-violet-600">{selectedSector}</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            type="text"
            placeholder="Nombre completo"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Correo electrónico"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            required
            type="tel"
            placeholder="WhatsApp / Teléfono"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          />
          <select
            className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
          >
            <option value="WhatsApp">Prefiero WhatsApp</option>
            <option value="Email">Prefiero Email</option>
          </select>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 font-bold text-white transition hover:from-violet-700 hover:to-fuchsia-700"
          >
            <Send className="h-4 w-4" aria-hidden />
            Registrarme ahora
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
