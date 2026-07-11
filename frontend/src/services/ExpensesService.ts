/**
 * Servicio de gastos: expone operaciones contra /expenses.
 *
 * HU "Gestionar gastos del negocio": registrar, consultar y filtrar
 * (por rango de fechas) los gastos del negocio.
 */

import apiClient from './api';
import {Expense, ExpenseCreate, ExpenseFilters} from '../models';

interface ExpenseBackend {
  id: number;
  amount: number;
  reason: string;
  expense_date: string;
  category?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
}

function mapToExpense(data: ExpenseBackend): Expense {
  return {
    id: data.id,
    amount: data.amount,
    reason: data.reason,
    expenseDate: data.expense_date,
    category: data.category ?? undefined,
    notes: data.notes ?? undefined,
    isActive: data.is_active,
    createdAt: data.created_at,
  };
}

class ExpensesService {
  async list(filters: ExpenseFilters = {}): Promise<Expense[]> {
    const params: Record<string, string> = {};
    if (filters.dateFrom) {
      params.date_from = filters.dateFrom;
    }
    if (filters.dateTo) {
      params.date_to = filters.dateTo;
    }
    // Añadimos un límite alto para poder ver hasta 5000 registros en la FlatList
    params.limit = '5000';
    const response = await apiClient.get<ExpenseBackend[]>('/expenses', {
      params,
    });
    return response.data.map(mapToExpense);
  }

  async create(data: ExpenseCreate): Promise<Expense> {
    const payload = {
      amount: data.amount,
      reason: data.reason,
      expense_date: data.expenseDate,
      category: data.category,
      notes: data.notes,
    };
    const response = await apiClient.post<ExpenseBackend>('/expenses', payload);
    return mapToExpense(response.data);
  }
}

export const expensesService = new ExpensesService();
