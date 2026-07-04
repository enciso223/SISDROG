/**
 * Modelo de dominio: Producto (inventario)
 */

export type ProductOrigin = 'Compra' | 'Donación' | 'Consignación';

export interface Product {
  id?: number;
  code: string;
  name: string;
  description?: string;
  laboratory?: string;
  presentation?: string;
  stock: number;
  minStock?: number;
  salePrice: number;
  category?: string;
  purchasePrice?: number;
  expirationDate?: string;
  iva?: number;
  isActive?: boolean;
  supplierId?: number;
  origin?: ProductOrigin;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCreate {
  code: string;
  name: string;
  description?: string;
  laboratory?: string;
  presentation?: string;
  stock: number;
  minStock?: number;
  salePrice: number;
  purchasePrice?: number;
  expirationDate?: string;
  iva?: number;
  supplierId?: number;
  origin?: ProductOrigin;
}
