/**
 * Controlador del historial de compras (MVC).
 *
 * HU "Consultar historial de compras": permite consultar las compras
 * registradas y filtrarlas por rango de fechas o por proveedor. El detalle
 * de cada compra se muestra desde la vista con los datos ya cargados.
 */

import {useState, useCallback, useEffect, useMemo} from 'react';
import {purchasesService, mockPurchases} from '../services';
import {Purchase} from '../models';
import {DEMO_MODE} from '../config/constants';

export interface UsePurchasesControllerReturn {
  purchases: Purchase[];
  loading: boolean;
  error: string | null;
  /** Filtros activos (YYYY-MM-DD y nombre de proveedor). */
  dateFrom: string;
  dateTo: string;
  supplierName: string;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  setSupplierName: (value: string) => void;
  /** Lista de proveedores disponibles para el filtro. */
  suppliers: string[];
  /** Suma total de las compras mostradas. */
  total: number;
  fetchPurchases: () => Promise<void>;
  clearFilters: () => void;
  clearError: () => void;
}

/** Filtra el mock en memoria replicando la lógica del servicio real. */
function filterMock(
  data: Purchase[],
  dateFrom: string,
  dateTo: string,
  supplierName: string,
): Purchase[] {
  return data
    .filter(p => {
      if (dateFrom && p.purchaseDate < dateFrom) {
        return false;
      }
      if (dateTo && p.purchaseDate > dateTo) {
        return false;
      }
      if (supplierName && (p.supplierName ?? '') !== supplierName) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));
}

export const usePurchasesController = (): UsePurchasesControllerReturn => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [supplierName, setSupplierName] = useState('');

  /**
   * Catálogo de proveedores para el filtro. Se calcula a partir de todas
   * las compras conocidas (sin filtrar) para no perder opciones al filtrar.
   */
  const [allSuppliers, setAllSuppliers] = useState<string[]>([]);

  const fetchPurchases = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        const filtered = filterMock(
          mockPurchases,
          dateFrom,
          dateTo,
          supplierName,
        );
        setPurchases(filtered);
        setAllSuppliers(
          [...new Set(mockPurchases.map(p => p.supplierName).filter(Boolean))] as string[],
        );
      } else {
        const data = await purchasesService.list({
          dateFrom,
          dateTo,
          supplierName,
        });
        setPurchases(data);
        // Proveedores: si aún no se han cargado, se piden sin filtro de proveedor.
        setAllSuppliers(prev => {
          const fromData = data
            .map(p => p.supplierName)
            .filter(Boolean) as string[];
          const merged = new Set([...prev, ...fromData]);
          return [...merged];
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar el historial de compras',
      );
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, supplierName]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const clearFilters = useCallback(() => {
    setDateFrom('');
    setDateTo('');
    setSupplierName('');
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const total = useMemo(
    () => purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0),
    [purchases],
  );

  const suppliers = useMemo(
    () => [...allSuppliers].sort((a, b) => a.localeCompare(b)),
    [allSuppliers],
  );

  return {
    purchases,
    loading,
    error,
    dateFrom,
    dateTo,
    supplierName,
    setDateFrom,
    setDateTo,
    setSupplierName,
    suppliers,
    total,
    fetchPurchases,
    clearFilters,
    clearError,
  };
};
