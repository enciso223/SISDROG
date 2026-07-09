/**
 * Vista: Reportes — Hub con múltiples secciones.
 *
 * Tabs disponibles:
 *   - Balance    → Balance financiero (HU "Calcular y visualizar balance financiero")
 *   - Compras    → Historial de compras (HU "Consultar historial de compras")
 *   - Gastos     → Placeholder para futuras funcionalidades
 *
 * Se puede extender añadiendo más tabs sin modificar la estructura base.
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import {
  styles,
  TEAL,
  TEAL_DARK,
  TEAL_LIGHT,
  AMBER,
  INDIGO,
  INDIGO_LIGHT,
  SUCCESS,
  DANGER,
  TEXT_SECONDARY,
  TEXT_MUTED,
  BG_SURFACE,
  BG_SECTION,
} from './ReportsScreen.styles';
import {
  usePurchasesController,
  useBalanceController,
  useSalesReportsController,
  BALANCE_PERIODS,
} from '../../controllers';
import type {BalancePeriod} from '../../controllers';
import {Purchase} from '../../models';
import {Input, Icon} from '../components';
import {PAYMENT_ICON} from '../../assets/paymentIcon';


/* ─── Utilidades de fecha ─── */
const maskDate = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {return digits;}
  if (digits.length <= 4) {return `${digits.slice(0, 2)}/${digits.slice(2)}`;}
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
  if (!iso) {return '';}
  const parts = iso.split('-');
  if (parts.length === 3) {return `${parts[2]}/${parts[1]}/${parts[0]}`;}
  return iso;
};

const formatCurrency = (amount: number | undefined): string => {
  if (amount == null) {return '$0';}
  const intPart = Math.floor(Math.abs(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${amount < 0 ? '-' : ''}$${intPart}`;
};

/* ══════════════════════════════════════════════════════
   TAB: Balance Financiero
══════════════════════════════════════════════════════ */

const BalanceTab: React.FC = () => {
  const {
    period,
    setPeriod,
    customDateFrom,
    customDateTo,
    setCustomDateFrom,
    setCustomDateTo,
    summary,
    loading,
    error,
    effectiveDateFrom,
    effectiveDateTo,
  } = useBalanceController();

  // Estados locales para los inputs de fecha custom (formato visual DD/MM/AAAA)
  const [fromDisplay, setFromDisplay] = useState(ISOToDisplay(customDateFrom));
  const [toDisplay, setToDisplay]     = useState(ISOToDisplay(customDateTo));

  const handleApplyCustom = () => {
    setCustomDateFrom(displayToISO(fromDisplay));
    setCustomDateTo(displayToISO(toDisplay));
  };

  const handlePeriodSelect = (p: BalancePeriod) => {
    setPeriod(p);
    if (p !== 'custom') {
      setFromDisplay('');
      setToDisplay('');
    }
  };

  const isGain    = summary.balance >= 0;
  const balanceColor = summary.hasData ? (isGain ? SUCCESS : DANGER) : TEXT_MUTED;

  // Escala de barras: máximo entre todos los valores
  const maxValue = Math.max(
    summary.totalSales,
    summary.totalPurchases,
    summary.totalExpenses,
    Math.abs(summary.balance),
    1,
  );
  const pct = (v: number) => `${Math.max((Math.abs(v) / maxValue) * 100, v > 0 ? 1 : 0)}%`;

  const rangeLabel =
    effectiveDateFrom && effectiveDateTo
      ? `${ISOToDisplay(effectiveDateFrom)} – ${ISOToDisplay(effectiveDateTo)}`
      : effectiveDateFrom
        ? `Desde ${ISOToDisplay(effectiveDateFrom)}`
        : '';

  return (
    <View>
      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <Icon name="warning" size={16} color={DANGER} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      {/* Selector de periodo */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBadge}>
            <Icon name="calendar" size={16} color={TEAL} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.cardTitle}>Período de análisis</Text>
            <Text style={styles.cardSubtitle}>
              Selecciona el rango de tiempo a consultar
            </Text>
          </View>
        </View>

        <View style={styles.chipRow}>
          {BALANCE_PERIODS.map(bp => (
            <TouchableOpacity
              key={bp.key}
              style={[styles.chip, period === bp.key && styles.chipActive]}
              onPress={() => handlePeriodSelect(bp.key)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.chipText,
                  period === bp.key && styles.chipTextActive,
                ]}>
                {bp.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inputs de rango personalizado */}
        {period === 'custom' && (
          <>
            <View style={[styles.formRow, {marginTop: 12}]}>
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
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.primaryButtonInline}
                onPress={handleApplyCustom}
                activeOpacity={0.9}>
                <Icon name="search" size={14} color={BG_SURFACE} />
                <Text style={styles.primaryButtonText}>Calcular</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {rangeLabel ? (
          <Text style={[styles.filterInfo, {marginTop: 8}]}>
            Rango activo: {rangeLabel}
          </Text>
        ) : null}
      </View>

      {/* KPI cards */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBadge}>
            <Icon name="reports" size={16} color={TEAL} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.cardTitle}>Balance financiero</Text>
            <Text style={styles.cardSubtitle}>
              Resumen de ingresos, egresos y resultado
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={TEAL}
            style={{marginVertical: 32}}
          />
        ) : !summary.hasData ? (
          /* Estado vacío */
          <View style={styles.emptyState}>
            <Icon name="info" size={40} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Sin datos para este período</Text>
            <Text style={styles.emptySubtitle}>
              No se encontraron ventas ni gastos registrados en el rango
              seleccionado. Prueba con otro período o registra transacciones.
            </Text>
          </View>
        ) : (
          <>
            {/* ─── INGRESOS ─── */}
            <View style={styles.chartSection}>
              <Text style={styles.chartSectionLabel}>INGRESOS</Text>
              <View style={styles.barRow}>
                <Text style={styles.barLabel}>Ventas</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, {width: pct(summary.totalSales), backgroundColor: TEAL}]} />
                </View>
                <Text style={[styles.barValue, {color: TEAL_DARK}]}>
                  {formatCurrency(summary.totalSales)}
                </Text>
              </View>
            </View>

            {/* ─── EGRESOS ─── */}
            <View style={styles.chartSection}>
              <Text style={styles.chartSectionLabel}>EGRESOS</Text>
              <View style={styles.barRow}>
                <Text style={styles.barLabel}>Compras</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, {width: pct(summary.totalPurchases), backgroundColor: INDIGO}]} />
                </View>
                <Text style={[styles.barValue, {color: INDIGO}]}>
                  {formatCurrency(summary.totalPurchases)}
                </Text>
              </View>
              <View style={styles.barRow}>
                <Text style={styles.barLabel}>Gastos oper.</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, {width: pct(summary.totalExpenses), backgroundColor: AMBER}]} />
                </View>
                <Text style={[styles.barValue, {color: AMBER}]}>
                  {formatCurrency(summary.totalExpenses)}
                </Text>
              </View>
            </View>

            {/* ─── Divisor ─── */}
            <View style={styles.chartDivider} />

            {/* ─── RESULTADO ─── */}
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>
                {isGain ? ' Ganancia' : ' Pérdida'}
              </Text>
              <View style={styles.resultBarTrack}>
                <View
                  style={[
                    styles.resultBarFill,
                    {width: pct(summary.balance), backgroundColor: balanceColor},
                  ]}
                />
              </View>
              <Text style={[styles.resultValue, {color: balanceColor}]}>
                {formatCurrency(summary.balance)}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

/* ══════════════════════════════════════════════════════
   Modal de detalle de compra
══════════════════════════════════════════════════════ */
interface PurchaseDetailModalProps {
  purchase: Purchase | null;
  onClose: () => void;
}

const PurchaseDetailModal: React.FC<PurchaseDetailModalProps> = ({
  purchase,
  onClose,
}) => {
  if (!purchase) {return null;}

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

/* ══════════════════════════════════════════════════════
   TAB: Historial de Compras
══════════════════════════════════════════════════════ */
const PurchasesTab: React.FC = () => {
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

  const [fromDisplay, setFromDisplay] = useState(ISOToDisplay(dateFrom));
  const [toDisplay, setToDisplay]     = useState(ISOToDisplay(dateTo));
  const [selected, setSelected]       = useState<Purchase | null>(null);

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
    <View>
      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <Icon name="warning" size={16} color={DANGER} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      {/* Filtros */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBadge}>
            <Icon name="filter" size={16} color={TEAL} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.cardTitle}>Filtrar compras</Text>
            <Text style={styles.cardSubtitle}>
              Por rango de fechas y/o proveedor
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

        <Text style={styles.fieldLabel}>Proveedor</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[styles.chip, supplierName === '' && styles.chipActive]}
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
              style={[styles.chip, supplierName === sup && styles.chipActive]}
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

      {/* Lista */}
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
              <Text style={[styles.tdText, {flex: 3}]} numberOfLines={2}>
                {purchase.supplierName || 'Sin proveedor'}
              </Text>
              <Text style={[styles.tdText, {flex: 3}]} numberOfLines={2}>
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

      {/* Modal de detalle */}
      <PurchaseDetailModal
        purchase={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  );
};

/* ══════════════════════════════════════════════════════
   TAB: Ventas (Reportes)
══════════════════════════════════════════════════════ */
const SalesReportsTab: React.FC = () => {
  const {
    period,
    setPeriod,
    customDateFrom,
    customDateTo,
    setCustomDateFrom,
    setCustomDateTo,
    summary,
    loading,
    error,
    effectiveDateFrom,
    effectiveDateTo,
  } = useSalesReportsController();

  const [fromDisplay, setFromDisplay] = useState(ISOToDisplay(customDateFrom));
  const [toDisplay, setToDisplay]     = useState(ISOToDisplay(customDateTo));

  const handleApplyCustom = () => {
    setCustomDateFrom(displayToISO(fromDisplay));
    setCustomDateTo(displayToISO(toDisplay));
  };

  const handlePeriodSelect = (p: BalancePeriod) => {
    setPeriod(p);
    if (p !== 'custom') {
      setFromDisplay('');
      setToDisplay('');
    }
  };

  const rangeLabel =
    effectiveDateFrom && effectiveDateTo
      ? `${ISOToDisplay(effectiveDateFrom)} – ${ISOToDisplay(effectiveDateTo)}`
      : effectiveDateFrom
        ? `Desde ${ISOToDisplay(effectiveDateFrom)}`
        : '';

  return (
    <View>
      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <Icon name="warning" size={16} color={DANGER} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      {/* Selector de periodo */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBadge}>
            <Icon name="calendar" size={16} color={TEAL} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.cardTitle}>Período de análisis</Text>
            <Text style={styles.cardSubtitle}>
              Selecciona el rango de tiempo a consultar
            </Text>
          </View>
        </View>

        <View style={styles.chipRow}>
          {BALANCE_PERIODS.map(bp => (
            <TouchableOpacity
              key={bp.key}
              style={[styles.chip, period === bp.key && styles.chipActive]}
              onPress={() => handlePeriodSelect(bp.key)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.chipText,
                  period === bp.key && styles.chipTextActive,
                ]}>
                {bp.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inputs de rango personalizado */}
        {period === 'custom' && (
          <>
            <View style={[styles.formRow, {marginTop: 12}]}>
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
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.primaryButtonInline}
                onPress={handleApplyCustom}
                activeOpacity={0.9}>
                <Icon name="search" size={14} color={BG_SURFACE} />
                <Text style={styles.primaryButtonText}>Calcular</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {rangeLabel ? (
          <Text style={[styles.filterInfo, {marginTop: 8}]}>
            Rango activo: {rangeLabel}
          </Text>
        ) : null}
      </View>

      {/* KPI cards */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBadge}>
            <Icon name="reports" size={16} color={TEAL} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.cardTitle}>Reporte de ventas</Text>
            <Text style={styles.cardSubtitle}>
              Total de ingresos y estadísticas
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={TEAL}
            style={{marginVertical: 32}}
          />
        ) : !summary.hasData ? (
          /* Estado vacío */
          <View style={styles.emptyState}>
            <Icon name="info" size={40} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Sin ventas para este período</Text>
            <Text style={styles.emptySubtitle}>
              No se encontraron ventas registradas en el rango seleccionado.
            </Text>
          </View>
        ) : (
          <>
            {/* Total ventas */}
            <View style={[styles.kpiCard, {backgroundColor: TEAL_LIGHT, borderColor: '#CCFBF1'}]}>
              <View style={styles.kpiLeft}>
                <View style={[styles.kpiIcon, {backgroundColor: '#99F6E4'}]}>
                  <Icon name="money" size={20} color={TEAL_DARK} />
                </View>
                <View>
                  <Text style={[styles.kpiLabel, {color: TEAL_DARK}]}>Total Ventas</Text>
                  <Text style={[styles.kpiHint, {color: '#5EEAD4'}]}>Ingresos netos del periodo</Text>
                </View>
              </View>
              <Text style={[styles.kpiValue, {color: TEAL_DARK}]}>
                {formatCurrency(summary.totalSales)}
              </Text>
            </View>

            {/* Número de transacciones */}
            <View style={[styles.kpiCard, {backgroundColor: INDIGO_LIGHT, borderColor: '#E0E7FF', marginTop: 12}]}>
              <View style={styles.kpiLeft}>
                <View style={[styles.kpiIcon, {backgroundColor: '#C7D2FE'}]}>
                  <Icon name="cart" size={20} color={INDIGO} />
                </View>
                <View>
                  <Text style={[styles.kpiLabel, {color: INDIGO}]}>Transacciones</Text>
                  <Text style={[styles.kpiHint, {color: '#818CF8'}]}>Facturas/tickets generados</Text>
                </View>
              </View>
              <Text style={[styles.kpiValue, {color: INDIGO}]}>
                {summary.transactionCount}
              </Text>
            </View>

            {/* Promedio diario */}
            <View style={[styles.kpiCard, {backgroundColor: '#F3F4F6', borderColor: '#E5E7EB', marginTop: 12}]}>
              <View style={styles.kpiLeft}>
                <View style={[styles.kpiIcon, {backgroundColor: '#E5E7EB'}]}>
                  <Icon name="reports" size={20} color="#4B5563" />
                </View>
                <View>
                  <Text style={[styles.kpiLabel, {color: '#4B5563'}]}>Promedio Diario</Text>
                  <Text style={[styles.kpiHint, {color: '#9CA3AF'}]}>Venta promedio por día</Text>
                </View>
              </View>
              <Text style={[styles.kpiValue, {color: '#4B5563'}]}>
                {formatCurrency(summary.averageDaily)}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

/* ══════════════════════════════════════════════════════
   Tabs definition
══════════════════════════════════════════════════════ */
type ReportTab = 'balance' | 'compras' | 'ventas';

interface TabConfig {
  key: ReportTab;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  {key: 'balance', label: 'Balance',  icon: 'reports'},
  {key: 'ventas',  label: 'Ventas',   icon: 'money'},
  {key: 'compras', label: 'Compras',  icon: 'cart'},
];

/* ══════════════════════════════════════════════════════
   Pantalla principal — ReportsScreen
══════════════════════════════════════════════════════ */
export const ReportsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('balance');

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Encabezado de sección ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBadge}>
              <Icon name="reports" size={16} color={TEAL} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Reportes</Text>
              <Text style={styles.cardSubtitle}>
                Analiza el desempeño financiero y el historial de operaciones
              </Text>
            </View>
          </View>

          {/* ── Tabs ── */}
          <View style={styles.tabBar}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabItem, isActive && styles.tabItemActive]}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.8}>
                  {tab.key === 'ventas' ? (
                    <Image
                      source={{uri: PAYMENT_ICON}}
                      style={{
                        width: 16,
                        height: 16,
                        tintColor: isActive ? BG_SURFACE : TEXT_SECONDARY,
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Icon
                      name={tab.icon as any}
                      size={15}
                      color={isActive ? BG_SURFACE : TEXT_SECONDARY}
                    />
                  )}
                  <Text
                    style={[
                      styles.tabLabel,
                      isActive && styles.tabLabelActive,
                    ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Contenido del tab activo ── */}
        {activeTab === 'balance' && <BalanceTab />}
        {activeTab === 'ventas'  && <SalesReportsTab />}
        {activeTab === 'compras' && <PurchasesTab />}

      </ScrollView>
    </View>
  );
};
