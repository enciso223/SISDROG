/**
 * Controlador de gastos del negocio.
 *
 * HU "Gestionar gastos del negocio": registrar, consultar y filtrar
 * los gastos por rango de fechas.
 */

import {useState, useCallback, useEffect} from 'react';
import {expensesService} from '../services';
import {Expense, ExpenseCreate} from '../models';
import {DEMO_MODE} from '../config/constants';

export interface UseExpensesControllerReturn {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  dateFrom: string;
  dateTo: string;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  fetchExpenses: () => Promise<void>;
  createExpense: (data: ExpenseCreate) => Promise<void>;
  clearFilters: () => void;
  clearError: () => void;
}

// Almacén en memoria para el modo demo (sin backend).
let demoExpenses: Expense[] = [];

export const useExpensesController = (): UseExpensesControllerReturn => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchExpenses = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        const filtered = demoExpenses.filter(e => {
          if (dateFrom && e.expenseDate < dateFrom) {
            return false;
          }
          if (dateTo && e.expenseDate > dateTo) {
            return false;
          }
          return true;
        });
        setExpenses(
          [...filtered].sort((a, b) =>
            b.expenseDate.localeCompare(a.expenseDate),
          ),
        );
      } else {
        const data = await expensesService.list({dateFrom, dateTo});
        setExpenses(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los gastos');
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = useCallback(
    async (data: ExpenseCreate): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        if (DEMO_MODE) {
          const created: Expense = {
            id: Date.now(),
            ...data,
            isActive: true,
            createdAt: new Date().toISOString(),
          };
          demoExpenses = [created, ...demoExpenses];
        } else {
          await expensesService.create(data);
        }
        await fetchExpenses();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'No se pudo registrar el gasto',
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchExpenses],
  );

  const clearFilters = useCallback(() => {
    setDateFrom('');
    setDateTo('');
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    expenses,
    loading,
    error,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    fetchExpenses,
    createExpense,
    clearFilters,
    clearError,
  };
};
