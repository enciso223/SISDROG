/**
 * Servicio de ventas: expone operaciones CRUD contra /sales.
 */

import apiClient from './api';
import {Sale, SaleCreate, SaleReceipt} from '../models';

interface SaleItemBackend {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface SaleBackend {
  id: number;
  total: number;
  notes?: string;
  created_at: string;
  items: SaleItemBackend[];
}

function mapToSale(data: SaleBackend): Sale {
  return {
    id: data.id,
    subtotal: data.total, // El backend actual en esta rama solo tiene 'total'
    tax: 0,
    total: data.total,
    createdAt: data.created_at,
    items: data.items.map(i => ({
      id: i.id,
      productId: i.product_id,
      quantity: i.quantity,
      unitPrice: i.unit_price,
      subtotal: i.subtotal,
    })),
  };
}

class SalesService {
  async getAll(): Promise<Sale[]> {
    const response = await apiClient.get<SaleBackend[]>('/sales');
    return response.data.map(mapToSale);
  }

  async getById(id: number): Promise<Sale> {
    const response = await apiClient.get<SaleBackend>(`/sales/${id}`);
    return mapToSale(response.data);
  }

  async create(data: SaleCreate): Promise<Sale> {
    // El backend actual de develop solo espera `items` (con product_id y quantity) y `notes`.
    // Los campos de cliente o descuento se omiten porque no están en este schema de BD.
    const payload = {
      items: data.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      notes: data.customerName ? `Cliente: ${data.customerName}` : undefined,
    };

    const response = await apiClient.post<SaleBackend>('/sales', payload);
    return mapToSale(response.data);
  }

  async getReceipt(saleId: number): Promise<SaleReceipt> {
    const response = await apiClient.get<SaleReceipt>(`/sales/${saleId}/receipt`);
    return response.data;
  }
}

export const salesService = new SalesService();
