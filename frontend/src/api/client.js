import axios from 'axios';

/**
 * Cliente HTTP centralizado para DevBoard
 * Conecta con el backend REST y normaliza errores y cabeceras
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Interceptor de Petición: Inyección de Token JWT si existe sesión activa
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('devboard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Retorno directo de datos y normalización de errores { error: "..." }
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const serverMessage = error.response?.data?.error;
    const message = serverMessage || error.message || 'Error de comunicación con el servidor';

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status || 500;
    normalizedError.response = error.response;
    normalizedError.data = error.response?.data;
    normalizedError.isNetworkError = !error.response;

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
