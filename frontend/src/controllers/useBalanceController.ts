/**
 * Controlador: Balance Financiero (MVC).
 *
 * HU "Calcular y visualizar balance financiero":
 *   - Combina datos de ventas y gastos para un periodo seleccionado.
 *   - Calcula: totalSales, totalExpenses y balance (ganancia/pérdida).
 *   - Soporta periodos predefinidos (hoy, semana, mes) y rango personalizado.
 *   - En DEMO_MODE usa mockSales y mockExpenses; en producción llama al backend.
 */

import {useState, useCallback, useEffect, useMemo} from 'react';
import {mockSales, mockExpenses, mockPurchases, salesService, expensesService, purchasesService} from '../services';
import {DEMO_MODE} from '../config/constants';

export type BalancePeriod = 'today' | 'week' | 'month' | 'custom';

export interface BalancePeriodLabel {
  key: BalancePeriod;
  label: string;
}

export const BALANCE_PERIODS: BalancePeriodLabel[] = [
  {key: 'today', label: 'Hoy'},
  {key: 'week', label: 'Esta semana'},
  {key: 'month', label: 'Este mes'},
  {key: 'custom', label: 'Personalizado'},
];

export interface BalanceSummary {
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  balance: number;
  hasData: boolean;
}

export interface UseBalanceControllerReturn {
  period: BalancePeriod;
  setPeriod: (p: BalancePeriod) => void;
  /** Fechas del rango activo (YYYY-MM-DD). Usadas en periodo 'custom'. */
  customDateFrom: string;
  customDateTo: string;
  setCustomDateFrom: (v: string) => void;
  setCustomDateTo: (v: string) => void;
  summary: BalanceSummary;
  loading: boolean;
  error: string | null;
  /** Fechas efectivas del rango activo (YYYY-MM-DD). Calculadas según el periodo. */
  effectiveDateFrom: string;
  effectiveDateTo: string;
}

/* ─── Utilidades de fecha ─── */

/** Devuelve YYYY-MM-DD de hoy. */
const todayISO = (): string => new Date().toISOString().slice(0, 10);

/** Devuelve YYYY-MM-DD del lunes de la semana actual. */
const startOfWeekISO = (): string => {
  const d = new Date();
  const day = d.getDay(); // 0=dom, 1=lun, …
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
};

/** Devuelve YYYY-MM-01 del mes actual. */
const startOfMonthISO = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};

/** Calcula las fechas efectivas del rango según el periodo elegido. */
function getEffectiveDates(
  period: BalancePeriod,
  customFrom: string,
  customTo: string,
): {from: string; to: string} {
  const today = todayISO();
  switch (period) {
    case 'today':
      return {from: today, to: today};
    case 'week':
      return {from: startOfWeekISO(), to: today};
    case 'month':
      return {from: startOfMonthISO(), to: today};
    case 'custom':
      return {from: customFrom, to: customTo};
  }
}

/* ─── Filtros en memoria para DEMO_MODE ─── */

function filterSalesByDate(
  items: typeof mockSales,
  from: string,
  to: string,
): typeof mockSales {
  return items.filter(s => {
    if (s.createdAt) {
      const d = s.createdAt.slice(0, 10);
      if (from && d < from) {return false;}
      if (to && d > to) {return false;}
      return true;
    }
    // Sin fecha → incluir siempre (datos demo sin fecha)
    return true;
  });
}

function filterExpensesByDate(
  items: typeof mockExpenses,
  from: string,
  to: string,
): typeof mockExpenses {
  return items.filter(e => {
    const d = e.expenseDate;
    if (from && d < from) {return false;}
    if (to && d > to) {return false;}
    return true;
  });
}

/* ─── Variables globales para persistencia en sesión ─── */
let savedPeriod: BalancePeriod = 'month';
let savedCustomDateFrom: string = '';
let savedCustomDateTo: string = '';

export const useBalanceController = (): UseBalanceControllerReturn => {
  const [period, setPeriodState] = useState<BalancePeriod>(savedPeriod);
  const [customDateFrom, setCustomDateFromState] = useState(savedCustomDateFrom);
  const [customDateTo, setCustomDateToState] = useState(savedCustomDateTo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalSales, setTotalSales] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const setPeriod = useCallback((p: BalancePeriod) => {
    savedPeriod = p;
    setPeriodState(p);
  }, []);

  const setCustomDateFrom = useCallback((v: string) => {
    savedCustomDateFrom = v;
    setCustomDateFromState(v);
  }, []);

  const setCustomDateTo = useCallback((v: string) => {
    savedCustomDateTo = v;
    setCustomDateToState(v);
  }, []);

  const {from: effectiveDateFrom, to: effectiveDateTo} = useMemo(
    () => getEffectiveDates(period, customDateFrom, customDateTo),
    [period, customDateFrom, customDateTo],
  );

  const fetchBalance = useCallback(async (): Promise<void> => {
    // No calcular si el rango personalizado está incompleto.
    if (period === 'custom' && (!effectiveDateFrom || !effectiveDateTo)) {
      setTotalSales(0);
      setTotalExpenses(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        const salesTotal = filterSalesByDate(mockSales, effectiveDateFrom, effectiveDateTo)
          .reduce((sum, s) => sum + (s.total || 0), 0);

        // Compras de productos filtradas por purchaseDate
        const purchasesTotal = mockPurchases
          .filter(p => {
            const d = p.purchaseDate;
            if (effectiveDateFrom && d < effectiveDateFrom) {return false;}
            if (effectiveDateTo && d > effectiveDateTo) {return false;}
            return true;
          })
          .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

        const expensesTotal = filterExpensesByDate(mockExpenses, effectiveDateFrom, effectiveDateTo)
          .reduce((sum, e) => sum + (e.amount || 0), 0);

        setTotalSales(salesTotal);
        setTotalPurchases(purchasesTotal);
        setTotalExpenses(expensesTotal);
      } else {
        // Modo real: calcular balance con los endpoints existentes.
        // Ventas: traer todas y filtrar por createdAt en el cliente.
        const allSales = await salesService.getAll();
        const salesTotal = allSales
          .filter(s => {
            if (!s.createdAt) {return true;}
            const d = s.createdAt.slice(0, 10);
            if (effectiveDateFrom && d < effectiveDateFrom) {return false;}
            if (effectiveDateTo && d > effectiveDateTo) {return false;}
            return true;
          })
          .reduce((sum, s) => sum + (s.total || 0), 0);

        // Gastos operacionales: el endpoint ya soporta filtro de fechas.
        const expenses = await expensesService.list({
          dateFrom: effectiveDateFrom || undefined,
          dateTo: effectiveDateTo || undefined,
        });
        const expensesTotal = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

        // Compras de productos (filtro en cliente por purchaseDate).
        const allPurchases = await purchasesService.list({
          dateFrom: effectiveDateFrom || undefined,
          dateTo: effectiveDateTo || undefined,
        });
        const purchasesTotal = allPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

        setTotalSales(salesTotal);
        setTotalPurchases(purchasesTotal);
        setTotalExpenses(expensesTotal);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al calcular el balance financiero.',
      );
    } finally {
      setLoading(false);
    }
  }, [period, effectiveDateFrom, effectiveDateTo]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);



  const balance = totalSales - totalPurchases - totalExpenses;
  const hasData = totalSales > 0 || totalPurchases > 0 || totalExpenses > 0;

  const summary: BalanceSummary = {
    totalSales,
    totalPurchases,
    totalExpenses,
    balance,
    hasData,
  };

  return {
    period,
    setPeriod,
    customDateFrom,
    customDateTo,
    setCustomDateFrom,
    setCustomDateTo,
    summary,
    loading,
    error,
    effectiveDateFrom,
    effectiveDateTo,
  };
};
