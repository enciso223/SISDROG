/**
 * Controlador de inventario (MVC).
 *
 * Gestiona productos y alertas de inventario (HU-07).
 */

import {useState, useCallback} from 'react';
import {inventoryService, mockProducts, mockAlerts} from '../services';
import {Product, ProductCreate, InventoryAlertsResponse} from '../models';
import {DEMO_MODE} from '../config/constants';

interface UseInventoryControllerReturn {
  /* ─── Productos ─── */
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (data: ProductCreate) => Promise<void>;
  updateProduct: (id: number, data: Partial<ProductCreate>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  clearError: () => void;

  /* ─── Alertas (HU-07) ─── */
  alerts: InventoryAlertsResponse;
  alertsLoading: boolean;
  lowStockCount: number;
  expiringCount: number;
  totalAlertCount: number;
  fetchAlerts: () => Promise<void>;
}

const EMPTY_ALERTS: InventoryAlertsResponse = {
  lowStock: [],
  expiringSoon: [],
};

export const useInventoryController = (): UseInventoryControllerReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ─── Estado de alertas (HU-07) ─── */
  const [alerts, setAlerts] = useState<InventoryAlertsResponse>(EMPTY_ALERTS);
  const [alertsLoading, setAlertsLoading] = useState(false);

  /* ─── Fetch Products ─── */
  const fetchProducts = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        setProducts(mockProducts);
      } else {
        const data = await inventoryService.getAll();
        setProducts(data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar inventario',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ─── Fetch Alerts (HU-07) ─── */
  const fetchAlerts = useCallback(async (): Promise<void> => {
    setAlertsLoading(true);
    try {
      if (DEMO_MODE) {
        setAlerts(mockAlerts);
      } else {
        const data = await inventoryService.getAlerts();
        setAlerts(data);
      }
    } catch (err) {
      // Las alertas no son críticas; si fallan, simplemente
      // dejamos la lista vacía sin bloquear la interfaz.
      console.warn('Error al cargar alertas de inventario:', err);
      setAlerts(EMPTY_ALERTS);
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  /* ─── Create Product ─── */
  const createProduct = useCallback(
    async (data: ProductCreate): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        if (DEMO_MODE) {
          const newProduct: Product = {
            ...data,
            id: Date.now(),
            salePrice: data.salePrice,
            stock: data.stock,
          };
          setProducts(prev => [...prev, newProduct]);
        } else {
          const newProduct = await inventoryService.create(data);
          setProducts(prev => [...prev, newProduct]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al crear producto',
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /* ─── Update Product ─── */
  const updateProduct = useCallback(
    async (id: number, data: Partial<ProductCreate>): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        if (DEMO_MODE) {
          setProducts(prev =>
            prev.map(p => (p.id === id ? {...p, ...data} : p)),
          );
        } else {
          const updated = await inventoryService.update(id, data);
          setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al actualizar producto',
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /* ─── Delete Product ─── */
  const deleteProduct = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        await inventoryService.delete(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al eliminar producto',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  /* ─── Contadores derivados (HU-07) ─── */
  const lowStockCount = alerts.lowStock.length;
  const expiringCount = alerts.expiringSoon.length;
  const totalAlertCount = lowStockCount + expiringCount;

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
    alerts,
    alertsLoading,
    lowStockCount,
    expiringCount,
    totalAlertCount,
    fetchAlerts,
  };
};
