import apiClient from './api';

export interface SalesReport {
  total_sales: number;
  transaction_count: number;
  average_daily: number;
  date_from?: string;
  date_to?: string;
}

export interface TopProductItem {
  product_id: number;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

export interface TopProductsResponse {
  products: TopProductItem[];
  date_from?: string;
  date_to?: string;
}

export interface InventoryValueItem {
  product_id: number;
  product_name: string;
  stock: number;
  purchase_price: number;
  sale_price: number;
  purchase_value: number;
  sale_value: number;
}

export interface InventoryValueResponse {
  products: InventoryValueItem[];
  total_purchase_value: number;
  total_sale_value: number;
  potential_profit: number;
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

  async getTopProducts(filters: ReportsFilters = {}, limit: number = 10): Promise<TopProductsResponse> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (filters.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters.dateTo) params.append('date_to', filters.dateTo);

    const qs = params.toString();
    const url = `/reports/top-products?${qs}`;
    
    const response = await apiClient.get<TopProductsResponse>(url);
    return response.data;
  }

  async getInventoryValue(): Promise<InventoryValueResponse> {
    const url = `/reports/inventory-value`;
    const response = await apiClient.get<InventoryValueResponse>(url);
    return response.data;
  }
}

export const reportsService = new ReportsService();
