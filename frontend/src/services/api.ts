/**
 * Servicio base de comunicación HTTP con el backend FastAPI.
 */

import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';
import {API_BASE_URL, API_TIMEOUT} from '../config/constants';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const data = error.response.data as {detail?: string | Array<{msg: string; loc?: unknown[]}>};
      let message: string;
      if (Array.isArray(data?.detail)) {
        // Pydantic v2 devuelve un array de errores de validación
        message = data.detail
          .map((e: {msg: string; loc?: unknown[]}) => {
            const field = e.loc ? e.loc.slice(1).join(' → ') : '';
            return field ? `${field}: ${e.msg}` : e.msg;
          })
          .join(' | ');
      } else {
        message = (data?.detail as string) || `Error ${error.response.status}: ${error.message}`;
      }
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);

export default apiClient;
