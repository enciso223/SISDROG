/**
 * Componente: Panel de alertas de inventario (HU-07).
 *
 * Muestra alertas agrupadas por tipo:
 *  - Stock bajo / agotado
 *  - Productos próximos a vencer
 *
 * Cada sección es colapsable y muestra detalles del producto.
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Icon} from './Icon';
import {Product, InventoryAlertsResponse} from '../../models';

interface AlertsPanelProps {
  alerts: InventoryAlertsResponse;
  loading?: boolean;
}

/* ─── Paleta ─── */
const AMBER_BG = '#FFFBEB';
const AMBER_BORDER = '#FDE68A';
const AMBER_TEXT = '#92400E';
const AMBER_ICON = '#D97706';

const RED_BG = '#FEF2F2';
const RED_BORDER = '#FECACA';
const RED_TEXT = '#991B1B';
const RED_ICON = '#DC2626';

const TEXT_MAIN = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#94A3B8';
const TEAL = '#0D9488';

/* ─── Helpers ─── */

/** Calcula los días restantes hasta una fecha asegurando zona horaria local. */
function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Extraemos YYYY-MM-DD y forzamos hora local añadiendo T00:00:00
  const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const target = new Date(`${cleanDate}T00:00:00`);
  target.setHours(0, 0, 0, 0);
  
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** Retorna la etiqueta y color según los días restantes. */
function expiryBadge(days: number): {label: string; bg: string; color: string} {
  if (days < 0) {
    return {label: 'Vencido', bg: '#FEE2E2', color: RED_TEXT};
  }
  if (days <= 7) {
    return {label: `${days}d`, bg: '#FEE2E2', color: RED_TEXT};
  }
  if (days <= 30) {
    return {label: `${days}d`, bg: '#FEF3C7', color: AMBER_TEXT};
  }
  return {label: `${days}d`, bg: '#ECFDF5', color: '#065F46'};
}

/** Calcula el porcentaje de stock respecto al mínimo (capped 0-100). */
function stockPercentage(stock: number, minStock: number): number {
  if (minStock <= 0) return stock > 0 ? 100 : 0;
  // Queremos que 100% = 2×minStock (saludable), 50% = minStock, 0% = agotado
  const ratio = stock / (minStock * 2);
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}

/* ─── Componente principal ─── */
export const AlertsPanel: React.FC<AlertsPanelProps> = ({alerts, loading}) => {
  const [lowStockExpanded, setLowStockExpanded] = useState(true);
  const [expiringExpanded, setExpiringExpanded] = useState(true);

  const hasLowStock = alerts.lowStock.length > 0;
  const hasExpiring = alerts.expiringSoon.length > 0;
  const hasAlerts = hasLowStock || hasExpiring;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={TEAL} />
        <Text style={styles.loadingText}>Verificando alertas...</Text>
      </View>
    );
  }

  if (!hasAlerts) return null;

  return (
    <View style={styles.container}>
      {/* ── Barra de resumen ── */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryLeft}>
          <Icon name="warning" size={16} color={AMBER_ICON} />
          <Text style={styles.summaryTitle}>Alertas de Inventario</Text>
        </View>
        <View style={styles.summaryBadges}>
          {hasLowStock && (
            <View style={[styles.countBadge, {backgroundColor: AMBER_BG}]}>
              <View style={[styles.countDot, {backgroundColor: AMBER_ICON}]} />
              <Text style={[styles.countText, {color: AMBER_TEXT}]}>
                {alerts.lowStock.length} stock bajo
              </Text>
            </View>
          )}
          {hasExpiring && (
            <View style={[styles.countBadge, {backgroundColor: RED_BG}]}>
              <View style={[styles.countDot, {backgroundColor: RED_ICON}]} />
              <Text style={[styles.countText, {color: RED_TEXT}]}>
                {alerts.expiringSoon.length} por vencer
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Sección: Stock Bajo ── */}
      {hasLowStock && (
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.sectionHeader, {backgroundColor: AMBER_BG, borderColor: AMBER_BORDER}]}
            onPress={() => setLowStockExpanded(prev => !prev)}
            accessibilityLabel="Expandir alertas de stock bajo">
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIconBadge, {backgroundColor: '#FEF3C7'}]}>
                <Icon name="warning" size={14} color={AMBER_ICON} />
              </View>
              <View>
                <Text style={[styles.sectionTitle, {color: AMBER_TEXT}]}>
                  Stock Bajo / Agotado
                </Text>
                <Text style={[styles.sectionSubtitle, {color: AMBER_ICON}]}>
                  {alerts.lowStock.length} producto{alerts.lowStock.length !== 1 ? 's' : ''} requiere{alerts.lowStock.length !== 1 ? 'n' : ''} reposición
                </Text>
              </View>
            </View>
            <Icon
              name={lowStockExpanded ? 'chevronUp' : 'chevronDown'}
              size={12}
              color={AMBER_TEXT}
            />
          </TouchableOpacity>

          {lowStockExpanded && (
            <View style={[styles.sectionBody, {borderColor: AMBER_BORDER}]}>
              {alerts.lowStock.map((product, index) => (
                <LowStockRow
                  key={product.id ?? index}
                  product={product}
                  isLast={index === alerts.lowStock.length - 1}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* ── Sección: Próximos a Vencer ── */}
      {hasExpiring && (
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.sectionHeader, {backgroundColor: RED_BG, borderColor: RED_BORDER}]}
            onPress={() => setExpiringExpanded(prev => !prev)}
            accessibilityLabel="Expandir alertas de vencimiento">
            <View style={styles.sectionHeaderLeft}>
              <View style={[styles.sectionIconBadge, {backgroundColor: '#FEE2E2'}]}>
                <Icon name="calendar" size={14} color={RED_ICON} />
              </View>
              <View>
                <Text style={[styles.sectionTitle, {color: RED_TEXT}]}>
                  Próximos a Vencer
                </Text>
                <Text style={[styles.sectionSubtitle, {color: RED_ICON}]}>
                  {alerts.expiringSoon.length} producto{alerts.expiringSoon.length !== 1 ? 's' : ''} con fecha de vencimiento cercana
                </Text>
              </View>
            </View>
            <Icon
              name={expiringExpanded ? 'chevronUp' : 'chevronDown'}
              size={12}
              color={RED_TEXT}
            />
          </TouchableOpacity>

          {expiringExpanded && (
            <View style={[styles.sectionBody, {borderColor: RED_BORDER}]}>
              {alerts.expiringSoon.map((product, index) => (
                <ExpiringRow
                  key={product.id ?? index}
                  product={product}
                  isLast={index === alerts.expiringSoon.length - 1}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

/* ─── Fila: Producto con stock bajo ─── */
const LowStockRow: React.FC<{product: Product; isLast: boolean}> = ({
  product,
  isLast,
}) => {
  const minStock = product.minStock ?? 10;
  const pct = stockPercentage(product.stock, minStock);
  const isOut = product.stock <= 0;

  return (
    <View style={[styles.alertRow, !isLast && styles.alertRowBorder]}>
      <View style={styles.alertRowMain}>
        <Text style={styles.alertProductName}>{product.name}</Text>
        {product.laboratory && (
          <Text style={styles.alertProductMeta}>{product.laboratory}</Text>
        )}
      </View>
      <View style={styles.alertRowRight}>
        {/* Badge de estado */}
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: isOut ? '#FEE2E2' : '#FEF3C7'},
          ]}>
          <Text
            style={[
              styles.statusBadgeText,
              {color: isOut ? RED_TEXT : AMBER_TEXT},
            ]}>
            {isOut ? 'Agotado' : 'Bajo'}
          </Text>
        </View>

        {/* Stock actual vs mínimo */}
        <View style={styles.stockInfo}>
          <Text style={styles.stockNumbers}>
            <Text style={{fontWeight: '800', color: isOut ? RED_ICON : AMBER_ICON}}>
              {product.stock}
            </Text>
            <Text style={{color: TEXT_MUTED}}> / {minStock} mín.</Text>
          </Text>
          {/* Barra de progreso */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${pct}%`,
                  backgroundColor: isOut ? RED_ICON : pct < 50 ? AMBER_ICON : TEAL,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

/* ─── Fila: Producto próximo a vencer ─── */
const ExpiringRow: React.FC<{product: Product; isLast: boolean}> = ({
  product,
  isLast,
}) => {
  const days = product.expirationDate ? daysUntil(product.expirationDate) : 999;
  const badge = expiryBadge(days);

  return (
    <View style={[styles.alertRow, !isLast && styles.alertRowBorder]}>
      <View style={styles.alertRowMain}>
        <Text style={styles.alertProductName}>{product.name}</Text>
        {product.laboratory && (
          <Text style={styles.alertProductMeta}>{product.laboratory}</Text>
        )}
      </View>
      <View style={styles.alertRowRight}>
        {/* Badge de urgencia */}
        <View style={[styles.statusBadge, {backgroundColor: badge.bg}]}>
          <Text style={[styles.statusBadgeText, {color: badge.color}]}>
            {badge.label}
          </Text>
        </View>

        {/* Fecha de vencimiento */}
        <View style={styles.expiryInfo}>
          <Icon name="calendar" size={12} color={TEXT_MUTED} />
          <Text style={styles.expiryDate}>
            {product.expirationDate ?? 'Sin fecha'}
          </Text>
        </View>
      </View>
    </View>
  );
};

/* ─── Estilos ─── */
const styles = StyleSheet.create({
  /* Contenedor principal */
  container: {
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
  },

  /* Barra de resumen */
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_MAIN,
    letterSpacing: -0.2,
  },
  summaryBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  countDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* Sección */
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sectionIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },

  /* Cuerpo de sección */
  sectionBody: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },

  /* Fila de alerta */
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  alertRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  alertRowMain: {
    flex: 1,
    marginRight: 16,
  },
  alertProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_MAIN,
  },
  alertProductMeta: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  alertRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  /* Badge de estado */
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  /* Stock info */
  stockInfo: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  stockNumbers: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  progressBar: {
    width: 100,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  /* Expiry info */
  expiryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expiryDate: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: '500',
  },
});
