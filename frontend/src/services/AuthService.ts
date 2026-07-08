/**
 * Servicio de autenticación: expone las operaciones CRUD contra /auth.
 *
 * Seguridad:
 *  - Los tokens se guardan en memoria (secureStorage), no en disco.
 *  - La contraseña se envía sólo por HTTPS y nunca se registra en logs.
 *  - El logout limpia la sesión activa localmente aunque el backend falle.
 */

import apiClient from './api';
import {UserCreate, User} from '../models';
import {setSessionToken, clearSession} from '../security';

export interface AuthResponse {
  user?: User;
  access_token?: string;
  token_type?: string;
  // fallback para camelCase
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
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    
    // El backend puede devolver en snake_case (access_token) o camelCase (accessToken)
    const token = response.data.access_token || response.data.accessToken;
    const type = response.data.token_type || response.data.tokenType || 'Bearer';
    
    if (token) {
      setSessionToken(token, type);
    }
    return response.data;
  }

  /** Cierra sesión local. Ignora cualquier error del backend. */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // La sesión local se limpia siempre.
    } finally {
      clearSession();
    }
  }
}

export const authService = new AuthService();
