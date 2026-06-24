/**
 * Controlador de inventario (MVC).
 */

import {useState, useCallback} from 'react';
import {inventoryService} from '../services';
import {Product, ProductCreate} from '../models';

interface UseInventoryControllerReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (data: ProductCreate) => Promise<void>;
  updateProduct: (id: number, data: Partial<ProductCreate>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useInventoryController = (): UseInventoryControllerReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getAll();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar inventario',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(
    async (data: ProductCreate): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const newProduct = await inventoryService.create(data);
        setProducts(prev => [...prev, newProduct]);
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

  const updateProduct = useCallback(
    async (id: number, data: Partial<ProductCreate>): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await inventoryService.update(id, data);
        setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
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

  const deleteProduct = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await inventoryService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
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

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
  };
};
