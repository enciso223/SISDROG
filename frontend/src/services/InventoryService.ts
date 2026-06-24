/**
 * Servicio de inventario: expone operaciones CRUD contra /inventory.
 */

import apiClient from './api';
import {Product, ProductCreate} from '../models';

// Interfaz para la respuesta del backend (snake_case)
interface ProductBackend {
  id: number;
  code: string;
  name: string;
  description?: string;
  presentation?: string;
  laboratory?: string;
  purchase_price: number;
  sale_price: number;
  batch?: string;
  expiry_date?: string;
  stock: number;
  min_stock: number;
  is_active: boolean;
  category_id?: number;
  supplier_id?: number;
}

// Función para mapear del backend al frontend
function mapToProduct(data: ProductBackend): Product {
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    description: data.description,
    presentation: data.presentation,
    laboratory: data.laboratory,
    purchasePrice: data.purchase_price,
    salePrice: data.sale_price,
    stock: data.stock,
    minStock: data.min_stock,
    isActive: data.is_active,
    // categoryId: data.category_id, // categoryId was removed/renamed in Product model
    supplierId: data.supplier_id,
    // Compatibilidad adicional requerida por los modelos
    expirationDate: data.expiry_date,
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
    const payload = {
      code: data.code,
      name: data.name,
      description: data.description,
      presentation: data.presentation,
      laboratory: data.laboratory,
      purchase_price: data.purchasePrice,
      sale_price: data.salePrice,
      stock: data.stock,
      min_stock: data.minStock || 5,
    };
    const response = await apiClient.post<ProductBackend>(
      '/inventory/products',
      payload,
    );
    return mapToProduct(response.data);
  }

  async update(id: number, data: Partial<ProductCreate>): Promise<Product> {
    const payload: any = {};
    if (data.name !== undefined) {
      payload.name = data.name;
    }
    if (data.salePrice !== undefined) {
      payload.sale_price = data.salePrice;
    }
    if (data.stock !== undefined) {
      payload.stock = data.stock;
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
}

export const inventoryService = new InventoryService();
