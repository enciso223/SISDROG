/**
 * Servicio de autenticación: expone las operaciones CRUD contra /auth.
 */

import apiClient from './api';
import {UserCreate, User} from '../models';

export interface AuthResponse {
  user: User;
  accessToken?: string;
  tokenType?: string;
}

class AuthService {
  async register(data: UserCreate): Promise<AuthResponse> {
    // El backend espera { name, email, password }
    const payload = {
      name: data.fullName ?? data.email.split('@')[0],
      email: data.email,
      password: data.password,
    };
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  }

  async login(data: {email: string; password: string}): Promise<AuthResponse> {
    // TODO: reemplazar por el endpoint real de login cuando exista en el backend
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  }
}

export const authService = new AuthService();
