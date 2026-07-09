/**
 * Servicio de compras: consulta el historial contra /purchases.
 *
 * HU "Consultar historial de compras": el administrador puede consultar
 * las compras registradas (fecha, proveedor, productos y total), ver el
 * detalle de cada una y filtrarlas por fecha o proveedor.
 *
 * Nota de arquitectura:
 *   El backend expone /purchases con el ID del producto, pero no el nombre
 *   del producto ni el proveedor. Estos datos viven en el inventario, por lo
 *   que el servicio cruza cada compra con el catálogo de productos
 *   (/inventory/products) para resolver `productName`, `productCode` y
 *   `supplierName`. El filtrado por fecha/proveedor se aplica en el cliente.
 */

import apiClient from './api';
import {inventoryService} from './InventoryService';
import {Purchase, PurchaseFilters, Product} from '../models';

// Respuesta del backend (snake_case) — ver purchases/schema.py
interface PurchaseBackend {
  id: number;
  product_id: number;
  purchase_date: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  lot_number?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
}

function mapToPurchase(data: PurchaseBackend): Purchase {
  return {
    id: data.id,
    productId: data.product_id,
    purchaseDate: data.purchase_date,
    quantity: data.quantity,
    unitPrice: data.unit_price,
    totalAmount: data.total_amount,
    lotNumber: data.lot_number ?? undefined,
    notes: data.notes ?? undefined,
    isActive: data.is_active,
    createdAt: data.created_at,
  };
}

/** Cruza una compra con el catálogo de productos para resolver nombre/proveedor. */
function enrich(purchase: Purchase, productsById: Map<number, Product>): Purchase {
  const product = productsById.get(purchase.productId);
  return {
    ...purchase,
    productName: product?.name,
    productCode: product?.code,
    supplierName: product?.supplierName,
  };
}

/** Aplica el filtrado por rango de fechas y proveedor en el cliente. */
function applyFilters(purchases: Purchase[], filters: PurchaseFilters): Purchase[] {
  return purchases.filter(p => {
    if (filters.dateFrom && p.purchaseDate < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && p.purchaseDate > filters.dateTo) {
      return false;
    }
    if (
      filters.supplierName &&
      (p.supplierName ?? '') !== filters.supplierName
    ) {
      return false;
    }
    return true;
  });
}

class PurchasesService {
  /**
   * Lista el historial de compras enriquecido con datos del producto,
   * ordenado por fecha descendente y filtrado según los criterios dados.
   */
  async list(filters: PurchaseFilters = {}): Promise<Purchase[]> {
    // Se piden compras y catálogo en paralelo para resolver proveedor/producto.
    const [purchasesRes, products] = await Promise.all([
      apiClient.get<PurchaseBackend[]>('/purchases'),
      inventoryService.getAll().catch(() => [] as Product[]),
    ]);

    const productsById = new Map<number, Product>();
    products.forEach(prod => {
      if (prod.id != null) {
        productsById.set(prod.id, prod);
      }
    });

    const purchases = purchasesRes.data
      .map(mapToPurchase)
      .map(p => enrich(p, productsById));

    return applyFilters(purchases, filters).sort((a, b) =>
      b.purchaseDate.localeCompare(a.purchaseDate),
    );
  }

  /** Obtiene el detalle de una compra concreta, enriquecida con el producto. */
  async getById(id: number): Promise<Purchase> {
    const response = await apiClient.get<PurchaseBackend>(`/purchases/${id}`);
    const purchase = mapToPurchase(response.data);
    try {
      const product = await inventoryService.getById(purchase.productId);
      return {
        ...purchase,
        productName: product.name,
        productCode: product.code,
        supplierName: product.supplierName,
      };
    } catch {
      return purchase;
    }
  }

  /** Registra una nueva compra en el backend. */
  async create(data: {
    productId: number;
    purchaseDate: string;
    quantity: number;
    unitPrice: number;
    lotNumber?: string;
    expiryDate?: string;
    notes?: string;
  }): Promise<Purchase> {
    const payload = {
      product_id: data.productId,
      purchase_date: data.purchaseDate,
      quantity: data.quantity,
      unit_price: data.unitPrice,
      lot_number: data.lotNumber || 'N/A',
      expiry_date: data.expiryDate || '2099-12-31',
      notes: data.notes,
    };
    const response = await apiClient.post<PurchaseBackend>('/purchases', payload);
    return mapToPurchase(response.data);
  }
}

export const purchasesService = new PurchasesService();
