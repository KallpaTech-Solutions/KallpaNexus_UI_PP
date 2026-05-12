import axios from 'axios';

// Debe coincidir con applicationUrl en KallpaNexus_API/Properties/launchSettings.json (p. ej. http://localhost:5062)
const baseURL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5062/api';

const api = axios.create({ baseURL });

export default api;