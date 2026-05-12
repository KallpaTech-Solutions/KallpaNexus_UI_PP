import axios from 'axios';

// En Render (Static Site): VITE_API_URL = https://kallpanexus-api-pp.onrender.com (sin /api; se añade aquí).
const raw = import.meta.env.VITE_API_URL;
const baseURL = raw
  ? `${String(raw).replace(/\/$/, '')}/api`
  : 'http://localhost:5062/api';

const api = axios.create({ baseURL });

export default api;
