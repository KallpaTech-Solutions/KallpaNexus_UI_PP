import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquareHeart, Send, Shield } from 'lucide-react';
import api from '../api/cliente';

export default function AnonymousRecommendationsBox({ accentClass = 'from-sky-600 to-indigo-600' }) {
  const location = useLocation();
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const msg = text.trim();
    if (msg.length < 8) {
      setError('Escribe al menos 8 caracteres para que podamos entender tu idea.');
      return;
    }
    setStatus('sending');
    try {
      await api.post('/recommendations', {
        message: msg,
        pagePath: location.pathname,
      });
      setText('');
      setStatus('ok');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('idle');
      setError('No se pudo enviar. Intenta de nuevo en unos segundos.');
    }
  };

  return (
    <section
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 sm:p-8"
      aria-labelledby="reco-anon-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accentClass} text-white shadow-md`}
          >
            <MessageSquareHeart className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 id="reco-anon-title" className="text-lg font-bold text-slate-900 sm:text-xl">
              Recomendaciones anónimas
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Ayúdanos a priorizar el roadmap. No pedimos nombre ni correo: solo tu mensaje y la página
              desde la que escribes (para contexto interno).
            </p>
            <p className="mt-2 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-900">
              <Shield className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                Las recomendaciones se guardan de forma anónima. No forman parte de la preinscripción ni
                del CRM de leads.
              </span>
            </p>
          </div>
        </div>
      </div>

      <form className="mt-6 space-y-3" onSubmit={submit}>
        <label htmlFor="reco-anon-text" className="sr-only">
          Tu recomendación
        </label>
        <textarea
          id="reco-anon-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="Ej.: Me gustaría exportar a Excel el listado de limpieza del día…"
          className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500">{text.length} / 2000</span>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-violet-500/25 transition hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-60"
          >
            <Send className="h-4 w-4" aria-hidden />
            {status === 'sending' ? 'Enviando…' : 'Enviar recomendación'}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {status === 'ok' && (
          <p className="text-sm font-medium text-emerald-700">¡Gracias! Tu mensaje quedó registrado.</p>
        )}
      </form>
    </section>
  );
}
