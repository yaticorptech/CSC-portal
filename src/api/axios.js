import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
    "x-api-secret": import.meta.env.VITE_API_SECRET,
  },
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("csc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("csc_token");
      localStorage.removeItem("csc_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
