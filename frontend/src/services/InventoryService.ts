/**
 * Servicio de inventario: expone operaciones CRUD contra /inventory.
 */

import apiClient from './api';
import {Product, ProductCreate, InventoryAlertsResponse} from '../models';

// Interfaz para la respuesta del backend (snake_case)
interface ProductBackend {
  id: number;
  code: string;
  name: string;
  description?: string;
  presentation?: string;
  gramaje?: string;
  laboratory?: string;
  purchase_price: number;
  sale_price: number;
  stock: number;
  min_stock: number;
  is_active: boolean;
  category_id?: number;
  supplier_id?: number;
  supplier_name?: string;
  contact_name?: string;
  phone?: string;
  address?: string;
  lots?: Array<{
    id: number;
    lot_number: string;
    purchase_date: string;
    expiry_date: string;
    stock: number;
  }>;
}

// Función para mapear del backend al frontend
function mapToProduct(data: ProductBackend): Product {
  const firstLot = data.lots && data.lots.length > 0 ? data.lots[0] : null;
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    description: data.description,
    presentation: data.presentation,
    gramaje: data.gramaje,
    laboratory: data.laboratory,
    purchasePrice: data.purchase_price,
    salePrice: data.sale_price,
    stock: data.stock,
    minStock: data.min_stock,
    isActive: data.is_active,
    supplierId: data.supplier_id,
    supplierName: data.supplier_name,
    contactName: data.contact_name,
    phone: data.phone,
    address: data.address,
    lotNumber: firstLot?.lot_number,
    purchaseDate: firstLot?.purchase_date,
    expirationDate: firstLot?.expiry_date,
  };
}

class InventoryService {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<ProductBackend[]>(
      '/inventory/products',
    );
    return response.data.map(mapToProduct);
  }

  async getById(id: number): Promise<Product> {
    const response = await apiClient.get<ProductBackend>(
      `/inventory/products/${id}`,
    );
    return mapToProduct(response.data);
  }

  async create(data: ProductCreate): Promise<Product> {
    const payload: any = {
      code: data.code,
      name: data.name,
      description: data.description,
      presentation: data.presentation,
      gramaje: data.gramaje,
      laboratory: data.laboratory,
      purchase_price: data.purchasePrice ?? 0,
      sale_price: data.salePrice,
      stock: data.stock,
      min_stock: data.minStock || 5,
      supplier_name: data.supplierName,
      contact_name: data.contactName,
      phone: data.phone,
      address: data.address,
    };

    // Si hay número de lote y fecha de compra, enviar el lote
    if (data.lotNumber && data.purchaseDate && data.expirationDate) {
      payload.lots = [{
        lot_number: data.lotNumber,
        purchase_date: data.purchaseDate,
        expiry_date: data.expirationDate,
        stock: data.stock,
      }];
    }

    const response = await apiClient.post<ProductBackend>(
      '/inventory/products',
      payload,
    );
    return mapToProduct(response.data);
  }

  async update(id: number, data: Partial<ProductCreate>): Promise<Product> {
    const payload: any = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.presentation !== undefined) payload.presentation = data.presentation;
    if (data.gramaje !== undefined) payload.gramaje = data.gramaje;
    if (data.laboratory !== undefined) payload.laboratory = data.laboratory;
    if (data.purchasePrice !== undefined) payload.purchase_price = data.purchasePrice;
    if (data.salePrice !== undefined) payload.sale_price = data.salePrice;
    if (data.stock !== undefined) payload.stock = data.stock;
    if (data.minStock !== undefined) payload.min_stock = data.minStock;
    if (data.supplierName !== undefined) payload.supplier_name = data.supplierName;
    if (data.contactName !== undefined) payload.contact_name = data.contactName;
    if (data.phone !== undefined) payload.phone = data.phone;
    if (data.address !== undefined) payload.address = data.address;

    if (data.lotNumber && data.purchaseDate && data.expirationDate) {
      payload.lots = [{
        lot_number: data.lotNumber,
        purchase_date: data.purchaseDate,
        expiry_date: data.expirationDate,
        stock: data.stock !== undefined ? data.stock : 0,
      }];
    }

    const response = await apiClient.put<ProductBackend>(
      `/inventory/products/${id}`,
      payload,
    );
    return mapToProduct(response.data);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/inventory/products/${id}`);
  }

  /**
   * HU-07: obtiene alertas de stock bajo y productos próximos a vencer.
   * - low_stock: List[ProductResponse] → mapToProduct directo
   * - expiring_soon: List[LotAlertResponse] → shape diferente, mapear manualmente
   */
  async getAlerts(expiryDays: number = 30): Promise<InventoryAlertsResponse> {
    interface LotAlertBackend {
      lot_id: number;
      product_id: number;
      product_name: string;
      lot_number: string;
      expiry_date: string;
      days_until_expiry: number;
      stock: number;
    }
    const response = await apiClient.get<{
      low_stock: ProductBackend[];
      expiring_soon: LotAlertBackend[];
    }>(`/inventory/products/alerts?expiry_days=${expiryDays}`);
    return {
      lowStock: response.data.low_stock.map(mapToProduct),
      expiringSoon: response.data.expiring_soon.map(lot => ({
        id: lot.product_id,
        code: '',
        name: lot.product_name,
        stock: lot.stock,
        salePrice: 0,
        lotNumber: lot.lot_number,
        expirationDate: lot.expiry_date,
      })),
    };
  }
}

export const inventoryService = new InventoryService();
