/**
 * Vista: Reportes — Historial de compras
 * (HU "Consultar historial de compras").
 *
 * Permite al administrador:
 *   - Consultar el historial de compras (fecha, proveedor, producto y total).
 *   - Ver el detalle de cada compra en un panel emergente.
 *   - Filtrar por rango de fechas y/o por proveedor.
 *   - Mostrar un mensaje informativo cuando no hay resultados.
 *
 * La compra se origina en el inventario al registrar un producto; aquí
 * únicamente se consulta el historial resultante.
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {usePurchasesController} from '../../controllers';
import {Purchase} from '../../models';
import {Input, Icon} from '../components';

/* ─── Paleta (coherente con el resto de pantallas) ─── */
const TEAL = '#0D9488';
const TEAL_DARK = '#0F766E';
const TEAL_LIGHT = '#F0FDFA';
const TEXT_MAIN = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#94A3B8';
const BORDER = '#E2E8F0';
const BG_SURFACE = '#FFFFFF';
const BG_SECTION = '#F8FAFC';
const DANGER = '#EF4444';

/* ─── Utilidades de fecha (DD/MM/AAAA visual ↔ YYYY-MM-DD interno) ─── */
const maskDate = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const displayToISO = (display: string): string => {
  const parts = display.split('/');
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return '';
};

const ISOToDisplay = (iso?: string): string => {
  if (!iso) {
    return '';
  }
  const parts = iso.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return iso;
};

const formatCurrency = (amount: number | undefined) => {
  if (amount == null) {
    return '$0';
  }
  const intPart = Math.floor(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${intPart}`;
};

/* ─── Modal de detalle de compra ─── */
interface PurchaseDetailModalProps {
  purchase: Purchase | null;
  onClose: () => void;
}

const PurchaseDetailModal: React.FC<PurchaseDetailModalProps> = ({
  purchase,
  onClose,
}) => {
  if (!purchase) {
    return null;
  }

  const rows: Array<{label: string; value: string}> = [
    {label: 'Fecha', value: ISOToDisplay(purchase.purchaseDate)},
    {label: 'Proveedor', value: purchase.supplierName || 'Sin proveedor'},
    {
      label: 'Producto',
      value: purchase.productName
        ? purchase.productCode
          ? `${purchase.productName} (${purchase.productCode})`
          : purchase.productName
        : `Producto #${purchase.productId}`,
    },
    {label: 'Cantidad', value: `${purchase.quantity} und`},
    {label: 'Precio unitario', value: formatCurrency(purchase.unitPrice)},
    {label: 'Lote', value: purchase.lotNumber || '—'},
  ];

  return (
    <View style={[StyleSheet.absoluteFill, {zIndex: 1000, elevation: 1000}]}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Encabezado */}
          <View style={styles.modalHeader}>
            <View style={styles.cardIconBadge}>
              <Icon name="cart" size={16} color={TEAL} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Detalle de compra</Text>
              <Text style={styles.cardSubtitle}>
                Compra #{purchase.id ?? '—'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseBtn}
              activeOpacity={0.7}>
              <Icon name="close" size={16} color={TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {rows.map(row => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}

            {purchase.notes ? (
              <View style={styles.notesBox}>
                <Text style={styles.detailLabel}>Notas</Text>
                <Text style={styles.notesText}>{purchase.notes}</Text>
              </View>
            ) : null}

            {/* Total destacado */}
            <View style={styles.totalRow}>
              <Text style={styles.totalRowLabel}>Total</Text>
              <Text style={styles.totalRowValue}>
                {formatCurrency(purchase.totalAmount)}
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onClose}
            activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/* ─── Pantalla principal ─── */
export const ReportsScreen: React.FC = () => {
  const {
    purchases,
    loading,
    error,
    dateFrom,
    dateTo,
    supplierName,
    setDateFrom,
    setDateTo,
    setSupplierName,
    suppliers,
    total,
    clearFilters,
  } = usePurchasesController();

  // Estado local de los inputs de fecha (texto DD/MM/AAAA)
  const [fromDisplay, setFromDisplay] = useState(ISOToDisplay(dateFrom));
  const [toDisplay, setToDisplay] = useState(ISOToDisplay(dateTo));

  // Compra seleccionada para el modal de detalle
  const [selected, setSelected] = useState<Purchase | null>(null);

  const applyFilters = () => {
    setDateFrom(displayToISO(fromDisplay));
    setDateTo(displayToISO(toDisplay));
  };

  const handleClearFilters = () => {
    setFromDisplay('');
    setToDisplay('');
    clearFilters();
  };

  const hasActiveFilter = !!dateFrom || !!dateTo || !!supplierName;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* ── Banner de error ── */}
        {error && (
          <View style={styles.errorBanner}>
            <Icon name="warning" size={16} color={DANGER} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* ── Encabezado ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBadge}>
              <Icon name="history" size={16} color={TEAL} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Historial de compras</Text>
              <Text style={styles.cardSubtitle}>
                Consulta tus adquisiciones y analiza el gasto en productos
              </Text>
            </View>
          </View>
        </View>

        {/* ── Filtros ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBadge}>
              <Icon name="filter" size={16} color={TEAL} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Filtrar</Text>
              <Text style={styles.cardSubtitle}>
                Por rango de fechas y/o por proveedor
              </Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formColSmall}>
              <Input
                label="Desde"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                value={fromDisplay}
                onChangeText={v => setFromDisplay(maskDate(v))}
                maxLength={10}
              />
            </View>
            <View style={styles.formColSmall}>
              <Input
                label="Hasta"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                value={toDisplay}
                onChangeText={v => setToDisplay(maskDate(v))}
                maxLength={10}
              />
            </View>
          </View>

          {/* Proveedor: chips seleccionables */}
          <Text style={styles.fieldLabel}>Proveedor</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[
                styles.chip,
                supplierName === '' && styles.chipActive,
              ]}
              onPress={() => setSupplierName('')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.chipText,
                  supplierName === '' && styles.chipTextActive,
                ]}>
                Todos
              </Text>
            </TouchableOpacity>
            {suppliers.map(sup => (
              <TouchableOpacity
                key={sup}
                style={[
                  styles.chip,
                  supplierName === sup && styles.chipActive,
                ]}
                onPress={() => setSupplierName(sup)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.chipText,
                    supplierName === sup && styles.chipTextActive,
                  ]}>
                  {sup}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleClearFilters}
              activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButtonInline}
              onPress={applyFilters}
              activeOpacity={0.9}>
              <Icon name="search" size={14} color={BG_SURFACE} />
              <Text style={styles.primaryButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Lista de compras ── */}
        <View style={styles.card}>
          <View style={styles.listHeader}>
            <Text style={styles.cardTitle}>Compras registradas</Text>
            <View style={styles.totalPill}>
              <Text style={styles.totalPillLabel}>Total</Text>
              <Text style={styles.totalPillValue}>{formatCurrency(total)}</Text>
            </View>
          </View>

          {hasActiveFilter && (
            <Text style={styles.filterInfo}>
              Filtro:{' '}
              {dateFrom ? `desde ${ISOToDisplay(dateFrom)} ` : ''}
              {dateTo ? `hasta ${ISOToDisplay(dateTo)} ` : ''}
              {supplierName ? `· ${supplierName}` : ''}
            </Text>
          )}

          {/* Encabezado de tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, {flex: 2}]}>FECHA</Text>
            <Text style={[styles.thText, {flex: 3}]}>PROVEEDOR</Text>
            <Text style={[styles.thText, {flex: 3}]}>PRODUCTO</Text>
            <Text style={[styles.thText, {flex: 2, textAlign: 'right'}]}>
              TOTAL
            </Text>
            <Text style={[styles.thText, {flex: 1, textAlign: 'right'}]}> </Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={TEAL}
              style={{marginVertical: 32}}
            />
          ) : purchases.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="info" size={40} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No hay compras para mostrar</Text>
              <Text style={styles.emptySubtitle}>
                {hasActiveFilter
                  ? 'No se encontraron compras con los filtros seleccionados.'
                  : 'Las compras aparecerán aquí a medida que registres productos en el inventario.'}
              </Text>
            </View>
          ) : (
            purchases.map(purchase => (
              <View
                key={purchase.id ?? `${purchase.productId}-${purchase.purchaseDate}`}
                style={styles.tableRow}>
                <Text style={[styles.tdDate, {flex: 2}]}>
                  {ISOToDisplay(purchase.purchaseDate)}
                </Text>
                <Text
                  style={[styles.tdText, {flex: 3}]}
                  numberOfLines={2}>
                  {purchase.supplierName || 'Sin proveedor'}
                </Text>
                <Text
                  style={[styles.tdText, {flex: 3}]}
                  numberOfLines={2}>
                  {purchase.productName || `Producto #${purchase.productId}`}
                </Text>
                <Text style={[styles.tdAmount, {flex: 2}]}>
                  {formatCurrency(purchase.totalAmount)}
                </Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => setSelected(purchase)}
                    activeOpacity={0.8}>
                    <Icon name="search" size={14} color={TEAL_DARK} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal de detalle */}
      <PurchaseDetailModal
        purchase={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  );
};

/* ─── Estilos ─── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_SECTION,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorBannerText: {
    color: DANGER,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  card: {
    backgroundColor: BG_SURFACE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_MAIN,
  },
  cardSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  formColSmall: {
    flex: 1,
  },
  fieldLabel: {
    marginTop: 6,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG_SURFACE,
  },
  chipActive: {
    backgroundColor: TEAL_LIGHT,
    borderColor: '#CCFBF1',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  chipTextActive: {
    color: TEAL_DARK,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 12,
  },
  primaryButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 22,
  },
  primaryButtonText: {
    color: BG_SURFACE,
    fontSize: 14,
    fontWeight: '700',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG_SURFACE,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  totalPillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEAL_DARK,
  },
  totalPillValue: {
    fontSize: 14,
    fontWeight: '800',
    color: TEAL_DARK,
  },
  filterInfo: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 10,
    paddingTop: 6,
    marginBottom: 4,
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_MUTED,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tdDate: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: '500',
  },
  tdText: {
    fontSize: 13,
    color: TEXT_MAIN,
    paddingRight: 8,
  },
  tdAmount: {
    fontSize: 13,
    color: TEXT_MAIN,
    fontWeight: '700',
    textAlign: 'right',
  },
  detailButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TEAL_LIGHT,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    maxWidth: 360,
  },
  /* ─── Modal ─── */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 440,
    maxWidth: '92%',
    maxHeight: Math.round(Dimensions.get('window').height * 0.85),
    backgroundColor: BG_SURFACE,
    borderRadius: 14,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG_SECTION,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_MAIN,
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  notesBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: BG_SECTION,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 6,
  },
  notesText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: TEAL_LIGHT,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  totalRowLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: TEAL_DARK,
  },
  totalRowValue: {
    fontSize: 18,
    fontWeight: '800',
    color: TEAL_DARK,
  },
});
