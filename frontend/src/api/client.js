import axios from 'axios';

// Cambia esta URL si tu backend se expone en un puerto o ruta diferente en docker-compose
export const apiClient = axios.create({
  baseURL: 'http://localhost:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});