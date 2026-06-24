/**
 * Modelo de dominio: Venta
 */

export interface SaleItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id?: number;
  invoiceNumber?: string;
  customerDocument?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: PaymentMethod;
  soldBy?: string;
  createdAt?: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
}

export interface SaleCreate {
  customerDocument?: string;
  customerName?: string;
  items: Omit<SaleItem, 'id' | 'productName' | 'subtotal'>[];
  paymentMethod: PaymentMethod;
}

export interface SaleReceipt {
  id: number;
  sale_id: number;
  receipt_number: string;
  establishment_name?: string;
  establishment_address?: string;
  establishment_phone?: string;
  created_at: string;
  sale: Sale;
}
