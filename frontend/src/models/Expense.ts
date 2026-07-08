/**
 * Modelo de dominio: Gasto del negocio.
 *
 * Corresponde a la HU "Gestionar gastos del negocio":
 *   - valor  → amount
 *   - motivo → reason
 *   - fecha  → expenseDate (YYYY-MM-DD)
 */

export interface Expense {
  id?: number;
  amount: number;
  reason: string;
  /** Fecha del gasto en formato YYYY-MM-DD. */
  expenseDate: string;
  category?: string;
  notes?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface ExpenseCreate {
  amount: number;
  reason: string;
  expenseDate: string;
  category?: string;
  notes?: string;
}

/** Filtros para consultar gastos (rango de fechas, YYYY-MM-DD). */
export interface ExpenseFilters {
  dateFrom?: string;
  dateTo?: string;
}
