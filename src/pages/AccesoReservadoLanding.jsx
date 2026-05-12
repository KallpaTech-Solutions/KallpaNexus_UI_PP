import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Wine, ArrowLeft, Send, Shield, Sparkles, Music2, Clock } from 'lucide-react';
import api from '../api/cliente';

const LOGO = '/tacones/logo.png';
const FONDO = '/tacones/Fondo.jpg';

/** Tres imágenes; si una falla, pasa a la siguiente extensión o al siguiente slide. */
const PROMO_CANDIDATES = [
  ['/tacones/promo-1.png', '/tacones/promo-1.jpg'],
  ['/tacones/promo-2.png', '/tacones/promo-2.jpg'],
  ['/tacones/promo-3.png', '/tacones/promo-3.jpg'],
];

async function trackPrivate(targetName) {
  try {
    await api.post('/analytics/track', {
      eventType: 'CLICK',
      targetName: `PrivateClub|${targetName}`,
      sector: null,
      url: '/acceso-reservado',
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Móvil' : 'Escritorio',
    });
  } catch {
    /* silencioso */
  }
}

export default function AccesoReservadoLanding() {
  const [logoOk, setLogoOk] = useState(true);
  const [fondoOk, setFondoOk] = useState(true);
  const [interest, setInterest] = useState(3);
  const [visitIntent, setVisitIntent] = useState(3);
  const [comment, setComment] = useState('');
  const [phone, setPhone] = useState('');
  const [adult, setAdult] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    void trackPrivate('vista_landing');
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!adult) {
      setError('Debes confirmar que eres mayor de edad para continuar.');
      return;
    }
    setStatus('sending');
    try {
      await api.post('/PrivateClubSurvey', {
        interestScore: interest,
        visitIntentScore: visitIntent,
        comment: comment.trim() || null,
        contactPhone: phone.trim() || null,
        confirmedAdult: true,
      });
      void trackPrivate('encuesta_enviada');
      setStatus('ok');
    } catch (err) {
      setStatus('idle');
      const data = err?.response?.data;
      const hint = typeof data === 'object' && data?.hint ? String(data.hint) : '';
      const msg = typeof data === 'object' && data?.error ? String(data.error) : '';
      setError(
        hint || msg
          ? `${msg || 'Error del servidor.'} ${hint ? `(${hint})` : ''}`
          : 'No se pudo enviar. Revisa la conexión o inténtalo más tarde.',
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-zinc-200">
      {/* Fondo */}
      {fondoOk ? (
        <div
          className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat bg-zinc-950"
          style={{ backgroundImage: `url('${FONDO}')` }}
          role="presentation"
        >
          <img src={FONDO} alt="" className="absolute h-0 w-0 opacity-0" onError={() => setFondoOk(false)} aria-hidden />
        </div>
      ) : null}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/80 via-[#0a0608]/92 to-black/90"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/25 via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative z-10">
        <header className="border-b border-white/10 px-4 py-6 sm:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <Link
              to="/"
              className="inline-flex items-center gap-2 self-start text-sm text-zinc-500 transition hover:text-zinc-300 sm:self-center"
              onClick={() => void trackPrivate('salir_inicio')}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Salir
            </Link>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/20 bg-black/40 shadow-lg ring-1 ring-rose-900/40">
                {logoOk ? (
                  <img
                    src={LOGO}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setLogoOk(false)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-950 to-zinc-950">
                    <Wine className="h-9 w-9 text-rose-200/90" aria-hidden />
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-rose-300/80">Acceso reservado</p>
                <h1 className="mt-1 font-serif text-2xl font-light tracking-wide text-white sm:text-3xl">Tacones</h1>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
                  Club privado — solo mayores de edad. Ambiente discreto tipo lounge; reserva previa. Si llegaste aquí,
                  ya conoces el resto.
                </p>
              </div>
            </div>
            <div className="hidden w-24 sm:block" aria-hidden />
          </div>
        </header>

        {/* Bloques informativos (sin detallar servicios por web) */}
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-black/35 p-5 shadow-lg backdrop-blur-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-950/60 text-rose-200">
                <Wine className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="font-serif text-lg font-medium text-white">Encuentra tus tragos</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Coctelería y bebidas en un ambiente íntimo. Clásicos de siempre y propuestas de la casa; al llegar, el
                equipo te orienta según lo que busques esa noche.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/35 p-5 shadow-lg backdrop-blur-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-950/60 text-rose-200">
                <Sparkles className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="font-serif text-lg font-medium text-white">Servicios especiales</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Atención personalizada y experiencias reservadas. Tiempo, preferencias y detalles se coordinan en
                persona o por el canal que te indiquemos — aquí no publicamos listas ni descripciones explícitas.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-black/35 p-5 shadow-lg backdrop-blur-md">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-950/60 text-rose-200">
                  <Music2 className="h-5 w-5" aria-hidden />
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-950/60 text-rose-200">
                  <Clock className="h-5 w-5" aria-hidden />
                </span>
              </div>
              <h2 className="font-serif text-lg font-medium text-white">Ambiente y horario</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Música y energía cambian según la noche. Te recomendamos reservar con anticipación para asegurar mesa
                y el tipo de experiencia que prefieras.
              </p>
            </article>
          </div>
        </section>

        {/* Carrusel promos: 3 slides, cambio cada 4 s */}
        <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-8">
          <PromoCarousel />
        </section>

        <section className="mx-auto max-w-lg px-4 pb-20 sm:px-8">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-light text-white">
              <Shield className="h-5 w-5 text-rose-300/90" aria-hidden />
              Tu opinión (confidencial)
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Nos ayuda a mejorar la experiencia y saber si te interesaría visitar el local en persona. Los datos se
              guardan en nuestro sistema interno; no publicamos respuestas.
            </p>

            <form className="mt-8 space-y-6" onSubmit={submit}>
              <LikertRow
                label="¿Qué tan atractiva te resulta nuestra propuesta?"
                value={interest}
                onChange={setInterest}
              />
              <LikertRow
                label="¿Con qué probabilidad visitarías el local físico?"
                value={visitIntent}
                onChange={setVisitIntent}
              />

              <div>
                <label htmlFor="pc-comment" className="block text-sm font-medium text-zinc-300">
                  Comentario (opcional)
                </label>
                <textarea
                  id="pc-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={2000}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-900/50 focus:outline-none focus:ring-1 focus:ring-rose-800/40"
                  placeholder="Horarios que te vendrían bien, sugerencias…"
                />
              </div>

              <div>
                <label htmlFor="pc-phone" className="block text-sm font-medium text-zinc-300">
                  WhatsApp o teléfono (opcional, solo si deseas que te contactemos)
                </label>
                <input
                  id="pc-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={40}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-900/50 focus:outline-none focus:ring-1 focus:ring-rose-800/40"
                  placeholder="+51 …"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-4">
                <input
                  type="checkbox"
                  checked={adult}
                  onChange={(e) => setAdult(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-rose-700 focus:ring-rose-900"
                />
                <span className="text-sm text-zinc-300">
                  Declaro ser mayor de 18 años y entiendo que este espacio es exclusivo para adultos.
                </span>
              </label>

              {error && <p className="text-sm text-rose-300">{error}</p>}
              {status === 'ok' && (
                <p className="text-sm font-medium text-emerald-400/90">
                  Gracias. Registramos tu respuesta de forma confidencial.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || status === 'ok'}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-900/50 bg-gradient-to-r from-rose-950 to-zinc-950 py-3.5 text-sm font-semibold text-rose-50 shadow-lg transition hover:from-rose-900 hover:to-zinc-900 disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden />
                {status === 'sending' ? 'Enviando…' : status === 'ok' ? 'Enviado' : 'Enviar respuestas'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

function LikertRow({ label, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-300">{label}</p>
      <p className="mt-1 text-xs text-zinc-500">1 = poco · 5 = mucho</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-10 min-w-[2.5rem] rounded-lg border text-sm font-semibold transition ${
              value === n
                ? 'border-rose-400/60 bg-rose-950/80 text-rose-100'
                : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

const CAROUSEL_FADE_MS = 1800;
const CAROUSEL_STILL_MS = 5200;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function raf2() {
  return new Promise((r) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(r);
    });
  });
}

function slideSrc(slideIndex, variantIndex) {
  const list = PROMO_CANDIDATES[slideIndex] ?? PROMO_CANDIDATES[0];
  return list[Math.min(variantIndex, list.length - 1)];
}

function PromoCarousel() {
  const n = PROMO_CANDIDATES.length;
  const [visible, setVisible] = useState(0);
  const [incoming, setIncoming] = useState(null);
  const [fading, setFading] = useState(false);
  const [varV, setVarV] = useState(0);
  const [varI, setVarI] = useState(0);
  const [autoToken, setAutoToken] = useState(0);
  const visibleRef = useRef(0);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    let cancelled = false;

    async function loop() {
      while (!cancelled) {
        await sleep(CAROUSEL_STILL_MS);
        if (cancelled) break;
        const next = (visibleRef.current + 1) % n;
        setVarI(0);
        setIncoming(next);
        await raf2();
        if (cancelled) break;
        setFading(true);
        await sleep(CAROUSEL_FADE_MS);
        if (cancelled) break;
        visibleRef.current = next;
        setVisible(next);
        setVarV(0);
        setIncoming(null);
        setFading(false);
      }
    }

    void loop();
    return () => {
      cancelled = true;
    };
  }, [autoToken, n]);

  const goTo = (i) => {
    setVarV(0);
    setVarI(0);
    setIncoming(null);
    setFading(false);
    visibleRef.current = i;
    setVisible(i);
    void trackPrivate(`carousel_manual|${i + 1}`);
    setAutoToken((t) => t + 1);
  };

  const srcBottom = slideSrc(visible, varV);
  const srcTop = incoming != null ? slideSrc(incoming, varI) : srcBottom;

  const fadeStyle = {
    transitionProperty: 'opacity, transform',
    transitionDuration: `${CAROUSEL_FADE_MS}ms`,
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div className="relative mx-auto overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/70 shadow-2xl">
      <div className="relative flex min-h-[min(54vh,440px)] w-full items-center justify-center p-4 sm:min-h-[min(64vh,540px)] sm:p-6 md:min-h-[min(72vh,620px)]">
        <div className="relative z-0 flex w-full max-w-4xl items-center justify-center">
          <img
            key={`b-${visible}-${varV}-${srcBottom}`}
            src={srcBottom}
            alt=""
            style={fadeStyle}
            className={`max-h-[min(72vh,640px)] w-auto max-w-full object-contain object-center ${
              fading ? 'opacity-0 scale-[0.97]' : 'opacity-100 scale-100'
            }`}
            onError={() =>
              setVarV((v) => {
                const list = PROMO_CANDIDATES[visible];
                return v < list.length - 1 ? v + 1 : v;
              })
            }
          />
        </div>
        {incoming != null && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6">
            <img
              key={`t-${incoming}-${varI}-${srcTop}`}
              src={srcTop}
              alt=""
              style={fadeStyle}
              className={`max-h-[min(72vh,640px)] w-auto max-w-full object-contain object-center ${
                fading ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
              }`}
              onError={() =>
                setVarI((v) => {
                  const list = PROMO_CANDIDATES[incoming];
                  return v < list.length - 1 ? v + 1 : v;
                })
              }
            />
          </div>
        )}
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {PROMO_CANDIDATES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
              i === visible ? 'w-8 bg-rose-400' : 'w-2.5 bg-white/35 hover:bg-white/55'
            }`}
            aria-label={`Ver imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
