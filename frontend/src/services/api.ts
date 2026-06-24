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
      return Promise.reject(
        new Error(
          (error.response.data as {detail?: string})?.detail ||
            `Error ${error.response.status}: ${error.message}`,
        ),
      );
    }
    return Promise.reject(error);
  },
);

export default apiClient;
