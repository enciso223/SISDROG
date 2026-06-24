import axios from 'axios';

// Acceder desde el navegador en la máquina host a los puertos expuestos en docker-compose
export const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});
