import {useState, useCallback, useEffect, useMemo} from 'react';
import {reportsService, mockSales} from '../services';
import {DEMO_MODE} from '../config/constants';
import type {BalancePeriod} from './useBalanceController';

export interface SalesReportSummary {
  totalSales: number;
  transactionCount: number;
  averageDaily: number;
  hasData: boolean;
}

export interface UseSalesReportsControllerReturn {
  period: BalancePeriod;
  setPeriod: (p: BalancePeriod) => void;
  customDateFrom: string;
  customDateTo: string;
  setCustomDateFrom: (v: string) => void;
  setCustomDateTo: (v: string) => void;
  summary: SalesReportSummary;
  loading: boolean;
  error: string | null;
  effectiveDateFrom: string;
  effectiveDateTo: string;
}

/* ─── Variables globales para persistencia en sesión ─── */
let savedPeriod: BalancePeriod = 'month';
let savedCustomDateFrom: string = '';
let savedCustomDateTo: string = '';

/* ─── Utilidades de fecha (duplicadas para aislamiento) ─── */
const todayISO = (): string => new Date().toISOString().slice(0, 10);
const startOfWeekISO = (): string => {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
};
const startOfMonthISO = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};

function getEffectiveDates(
  period: BalancePeriod,
  customFrom: string,
  customTo: string,
): {from: string; to: string} {
  const today = todayISO();
  switch (period) {
    case 'today': return {from: today, to: today};
    case 'week': return {from: startOfWeekISO(), to: today};
    case 'month': return {from: startOfMonthISO(), to: today};
    case 'custom': return {from: customFrom, to: customTo};
  }
}

export const useSalesReportsController = (): UseSalesReportsControllerReturn => {
  const [period, setPeriodState] = useState<BalancePeriod>(savedPeriod);
  const [customDateFrom, setCustomDateFromState] = useState(savedCustomDateFrom);
  const [customDateTo, setCustomDateToState] = useState(savedCustomDateTo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SalesReportSummary>({
    totalSales: 0,
    transactionCount: 0,
    averageDaily: 0,
    hasData: false,
  });

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

  const fetchReport = useCallback(async (): Promise<void> => {
    if (period === 'custom' && (!effectiveDateFrom || !effectiveDateTo)) {
      setSummary({totalSales: 0, transactionCount: 0, averageDaily: 0, hasData: false});
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (DEMO_MODE) {
        // Mock fallback
        const filtered = mockSales.filter(s => {
          if (s.isDonation) return false;
          if (s.createdAt) {
            const d = s.createdAt.slice(0, 10);
            if (effectiveDateFrom && d < effectiveDateFrom) return false;
            if (effectiveDateTo && d > effectiveDateTo) return false;
            return true;
          }
          return true;
        });

        const totalSales = filtered.reduce((sum, s) => sum + (s.total || 0), 0);
        const transactionCount = filtered.length;
        
        let days = 1;
        if (effectiveDateFrom && effectiveDateTo) {
          const t1 = new Date(effectiveDateFrom).getTime();
          const t2 = new Date(effectiveDateTo).getTime();
          days = Math.max(1, Math.ceil((t2 - t1) / (1000 * 3600 * 24)) + 1);
        }
        const averageDaily = totalSales / days;

        setSummary({
          totalSales,
          transactionCount,
          averageDaily,
          hasData: transactionCount > 0,
        });
      } else {
        const data = await reportsService.getSalesReport({
          dateFrom: effectiveDateFrom || undefined,
          dateTo: effectiveDateTo || undefined,
        });
        
        setSummary({
          totalSales: data.total_sales,
          transactionCount: data.transaction_count,
          averageDaily: data.average_daily,
          hasData: data.transaction_count > 0,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar reporte de ventas',
      );
    } finally {
      setLoading(false);
    }
  }, [period, effectiveDateFrom, effectiveDateTo]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

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
