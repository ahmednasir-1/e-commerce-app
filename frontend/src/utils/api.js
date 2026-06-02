import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL + "/api" });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.startsWith('/login')) window.location.href = '/login';
    }
    const msg = err.response?.data?.message || err.message;
    if (err.response?.status !== 401) toast.error(msg);
    return Promise.reject(err);
  }
);

export default api;
