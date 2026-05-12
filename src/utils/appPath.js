/**
 * Ruta “lógica” de la app (p. ej. /admin). Con HashRouter el servidor solo ve "/";
 * la ruta visible va en location.hash (#/admin).
 */
export function getClientPathname(fallback = '/') {
  if (typeof window === 'undefined') return fallback;
  const { hash, pathname } = window.location;
  if (hash.length > 1 && hash.startsWith('#/')) {
    const inner = hash.slice(1);
    const q = inner.indexOf('?');
    const pathOnly = q >= 0 ? inner.slice(0, q) : inner;
    return pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  }
  if (pathname && pathname !== '') return pathname;
  return fallback;
}
