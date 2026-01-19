import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

// ✅ Antes de cada request: agrega el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Si el backend responde 401: token expirado / inválido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Limpia sesión
      localStorage.setItem("sessionExpired", "1");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // Redirige al login (ajusta si tu ruta es distinta)
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;

