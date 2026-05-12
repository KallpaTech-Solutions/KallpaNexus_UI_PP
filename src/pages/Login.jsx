import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import api from '../api/cliente';
import { setAdminJwt, isAdminTokenValid } from '../utils/adminAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from && location.state.from !== '/login' ? location.state.from : '/admin';

  useEffect(() => {
    if (isAdminTokenValid()) {
      navigate(from.startsWith('/') ? from : '/admin', { replace: true });
    }
  }, [navigate, from]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/Auth/login', {
        username: username.trim(),
        password,
      });
      if (!data?.token) {
        setError('Respuesta inválida del servidor.');
        setLoading(false);
        return;
      }
      setAdminJwt(data.token);
      navigate(from.startsWith('/') ? from : '/admin', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.statusText || 'No se pudo iniciar sesión.';
      setError(typeof msg === 'string' ? msg : 'Credenciales incorrectas o servidor no disponible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-100 via-white to-violet-50/40 px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-violet-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al inicio
        </Link>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Acceso</h1>
              <p className="text-xs text-slate-500">Sesión para el panel interno</p>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-user" className="mb-1 block text-xs font-semibold text-slate-700">
                Usuario
              </label>
              <input
                id="login-user"
                autoComplete="username"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="login-pass" className="mb-1 block text-xs font-semibold text-slate-700">
                Contraseña
              </label>
              <input
                id="login-pass"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error ? (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-100" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
