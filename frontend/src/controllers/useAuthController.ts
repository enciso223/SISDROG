/**
 * Controlador de autenticación (MVC).
 * Orquesta las llamadas al servicio de auth y expone estado a las vistas.
 *
 * Seguridad:
 *  - Nunca almacena la contraseña en el estado más allá de la llamada.
 *  - Usa el error ya sanitizado por el interceptor HTTP.
 */

import {useState, useCallback} from 'react';
import {authService} from '../services';
import {UserCreate, UserLogin, User} from '../models';

interface UseAuthControllerReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (data: UserCreate) => Promise<void>;
  login: (data: UserLogin) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthController = (): UseAuthControllerReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (data: UserCreate): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al registrar usuario',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data: UserLogin): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setError(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    clearError,
  };
};
