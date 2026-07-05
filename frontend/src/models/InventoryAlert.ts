/**
 * Modelo de dominio: Alertas de inventario (HU-07).
 *
 * Representa las alertas generadas por productos con stock bajo
 * o próximos a vencer.
 */

import {Product} from './Product';

/** Severidad de la alerta para determinar estilo visual. */
export enum AlertSeverity {
  CRITICAL = 'critical', // Agotado o ya vencido
  WARNING = 'warning',   // Stock bajo o próximo a vencer
  INFO = 'info',         // Informativo
}

/** Tipo de alerta de inventario. */
export enum AlertType {
  LOW_STOCK = 'low_stock',
  EXPIRING_SOON = 'expiring_soon',
}

/** Alerta individual enriquecida con metadatos visuales. */
export interface InventoryAlert {
  product: Product;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
}

/** Respuesta agrupada del endpoint de alertas. */
export interface InventoryAlertsResponse {
  lowStock: Product[];
  expiringSoon: Product[];
}
