/**
 * Controlador de ventas (MVC).
 */

import {useState, useCallback} from 'react';
import {salesService} from '../services';
import {Sale, SaleCreate} from '../models';

interface UseSalesControllerReturn {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
  createSale: (data: SaleCreate) => Promise<void>;
  clearError: () => void;
}

export const useSalesController = (): UseSalesControllerReturn => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await salesService.getAll();
      setSales(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ventas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSale = useCallback(async (data: SaleCreate): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const newSale = await salesService.create(data);
      setSales(prev => [...prev, newSale]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar venta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    sales,
    loading,
    error,
    fetchSales,
    createSale,
    clearError,
  };
};
