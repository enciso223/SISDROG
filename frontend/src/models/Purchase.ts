/**
 * Modelo de dominio: Compra (historial de adquisiciones).
 *
 * Corresponde a la HU "Consultar historial de compras":
 *   - fecha     → purchaseDate
 *   - proveedor → supplierName (tomado del producto asociado)
 *   - productos → productName / productCode
 *   - total     → totalAmount
 *
 * Una compra se registra en el inventario al dar de alta un producto
 * (backend: POST /purchases crea el lote y aumenta el stock). Aquí solo
 * se consulta el historial resultante.
 */

export interface Purchase {
  id?: number;
  /** ID del producto adquirido. */
  productId: number;
  /** Nombre del producto (resuelto desde inventario). */
  productName?: string;
  /** Código del producto (resuelto desde inventario). */
  productCode?: string;
  /** Proveedor asociado al producto (resuelto desde inventario). */
  supplierName?: string;
  /** Fecha de la compra en formato YYYY-MM-DD. */
  purchaseDate: string;
  /** Unidades adquiridas. */
  quantity: number;
  /** Precio unitario de compra. */
  unitPrice: number;
  /** Valor total de la compra (quantity * unitPrice). */
  totalAmount: number;
  lotNumber?: string;
  notes?: string;
  isActive?: boolean;
  createdAt?: string;
}

/**
 * Filtros para consultar el historial de compras.
 * - Rango de fechas en formato YYYY-MM-DD.
 * - Proveedor por nombre exacto.
 */
export interface PurchaseFilters {
  dateFrom?: string;
  dateTo?: string;
  supplierName?: string;
}
