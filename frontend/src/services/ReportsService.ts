import apiClient from './api';

export interface SalesReport {
  total_sales: number;
  transaction_count: number;
  average_daily: number;
  date_from?: string;
  date_to?: string;
}

export interface ReportsFilters {
  dateFrom?: string;
  dateTo?: string;
}

class ReportsService {
  async getSalesReport(filters: ReportsFilters = {}): Promise<SalesReport> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters.dateTo) params.append('date_to', filters.dateTo);

    const qs = params.toString();
    const url = `/reports/sales${qs ? '?' + qs : ''}`;
    
    const response = await apiClient.get<SalesReport>(url);
    return response.data;
  }
}

export const reportsService = new ReportsService();
