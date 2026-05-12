import axios from 'axios';
import { ADMIN_JWT_STORAGE_KEY, clearAdminJwt } from '../utils/adminAuth';

// En Render (Static Site): VITE_API_URL = https://kallpanexus-api-pp.onrender.com (sin /api; se añade aquí).
const raw = import.meta.env.VITE_API_URL;
const baseURL = raw
  ? `${String(raw).replace(/\/$/, '')}/api`
  : 'http://localhost:5062/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const t = sessionStorage.getItem(ADMIN_JWT_STORAGE_KEY);
    if (t) {
      config.headers.Authorization = `Bearer ${t}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      clearAdminJwt();
      const hash = window.location.hash || '';
      if (!hash.includes('/login')) {
        window.location.hash = '#/login';
      }
    }
    return Promise.reject(err);
  },
);

export default api;
