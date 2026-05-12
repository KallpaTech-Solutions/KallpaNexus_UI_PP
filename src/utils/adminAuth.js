/** Clave sessionStorage para el JWT del panel (pretotipo). */
export const ADMIN_JWT_STORAGE_KEY = 'kallpa_admin_jwt';

export function getAdminJwt() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ADMIN_JWT_STORAGE_KEY);
}

export function setAdminJwt(token) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ADMIN_JWT_STORAGE_KEY, token);
}

export function clearAdminJwt() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_JWT_STORAGE_KEY);
}

/** Comprueba presencia y expiración del JWT (sin verificar firma en cliente). */
export function isAdminTokenValid() {
  const t = getAdminJwt();
  if (!t) return false;
  try {
    const payloadB64 = t.split('.')[1];
    if (!payloadB64) return false;
    const normalized = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(normalized));
    if (typeof payload.exp !== 'number') return false;
    return payload.exp * 1000 > Date.now() + 5000;
  } catch {
    return false;
  }
}
