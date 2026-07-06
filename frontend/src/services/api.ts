/**
 * Servicio base de comunicación HTTP con el backend FastAPI.
 *
 * Aplica seguridad transversal:
 *  - Adjunta el token de sesión (en memoria) a cada solicitud.
 *  - Sanitiza mensajes de error antes de propagarlos a la UI.
 *  - Nunca registra en consola contraseñas, tokens ni cabeceras Authorization.
 */

import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';
import {API_BASE_URL, API_TIMEOUT} from '../config/constants';
import {getAuthHeader, sanitizeError, safeLog, clearSession} from '../security';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor: adjunta token en memoria ─────────────────────────
apiClient.interceptors.request.use(config => {
  const auth = getAuthHeader();
  if (auth) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = auth;
  }
  return config;
});

// ── Response interceptor: sanitiza errores ────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const isTimeout = error.code === 'ECONNABORTED';
    const isNetworkError = !error.response && !isTimeout;

    // Extraer mensaje "crudo" del backend (si existe) sin dejar pasar detalles.
    let rawMessage = '';
    if (error.response) {
      const data = error.response.data as {
        detail?: string | Array<{msg: string; loc?: unknown[]}>;
      } | undefined;
      if (Array.isArray(data?.detail)) {
        rawMessage = data!.detail
          .map(e => {
            const field = e.loc ? e.loc.slice(1).join(' → ') : '';
            return field ? `${field}: ${e.msg}` : e.msg;
          })
          .join(' | ');
      } else if (typeof data?.detail === 'string') {
        rawMessage = data.detail;
      } else {
        rawMessage = error.message ?? '';
      }
    }

    // 401 → limpiar sesión: token inválido o expirado en el servidor
    if (status === 401) {
      clearSession();
    }

    const safeMessage = sanitizeError({
      status,
      message: rawMessage,
      isNetworkError,
      isTimeout,
    });

    safeLog('api-error', {status, url: error.config?.url, code: error.code});

    return Promise.reject(new Error(safeMessage));
  },
);

export default apiClient;
