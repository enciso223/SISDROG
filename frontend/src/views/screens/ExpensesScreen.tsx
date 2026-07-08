/**
 * Vista: Gestión de gastos del negocio (HU "Gestionar gastos del negocio").
 *
 * Permite:
 *   - Registrar un gasto (valor, motivo, fecha).
 *   - Consultar la lista de gastos (valor, motivo, fecha).
 *   - Filtrar por rango de fechas.
 *   - Mostrar un mensaje informativo cuando no hay resultados.
 */

import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useExpensesController} from '../../controllers';
import {Input, Icon} from '../components';

/* ─── Paleta ─── */
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

const todayISO = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, '0');
  const d = `${now.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
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

export const ExpensesScreen: React.FC = () => {
  const {
    expenses,
    loading,
    error,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    fetchExpenses,
    createExpense,
    clearFilters,
  } = useExpensesController();

  // ── Formulario de registro ──
  const [amountInput, setAmountInput] = useState('');
  const [reasonInput, setReasonInput] = useState('');
  const [dateDisplay, setDateDisplay] = useState(ISOToDisplay(todayISO()));
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // ── Filtro por rango de fechas (texto local) ──
  const [fromDisplay, setFromDisplay] = useState(ISOToDisplay(dateFrom));
  const [toDisplay, setToDisplay] = useState(ISOToDisplay(dateTo));

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    [expenses],
  );

  const handleDateChange = (raw: string) => {
    setDateDisplay(maskDate(raw));
    if (formErrors.date) {
      setFormErrors(prev => ({...prev, date: ''}));
    }
  };

  const validate = (): {ok: boolean; iso: string; amount: number} => {
    const newErrors: Record<string, string> = {};
    const amount = parseFloat(amountInput);
    if (!amountInput || Number.isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Ingresa un valor mayor a 0';
    }
    if (!reasonInput.trim()) {
      newErrors.reason = 'El motivo es obligatorio';
    }
    const iso = displayToISO(dateDisplay);
    if (!iso) {
      newErrors.date = 'Fecha incompleta (DD/MM/AAAA)';
    }
    setFormErrors(newErrors);
    return {ok: Object.keys(newErrors).length === 0, iso, amount};
  };

  const handleRegister = async () => {
    const {ok, iso, amount} = validate();
    if (!ok) {
      return;
    }
    setSaving(true);
    try {
      await createExpense({
        amount,
        reason: reasonInput.trim(),
        expenseDate: iso,
      });
      // Limpiar formulario tras registrar
      setAmountInput('');
      setReasonInput('');
      setDateDisplay(ISOToDisplay(todayISO()));
      setFormErrors({});
    } catch {
      // El error se muestra desde el controlador (banner).
    } finally {
      setSaving(false);
    }
  };

  const applyFilters = () => {
    setDateFrom(displayToISO(fromDisplay));
    setDateTo(displayToISO(toDisplay));
  };

  const handleClearFilters = () => {
    setFromDisplay('');
    setToDisplay('');
    clearFilters();
  };

  const hasActiveFilter = !!dateFrom || !!dateTo;

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

        {/* ── Registrar gasto ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBadge}>
              <Icon name="money" size={16} color={TEAL} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Registrar gasto</Text>
              <Text style={styles.cardSubtitle}>
                Ingresa el valor, el motivo y la fecha del gasto
              </Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formColSmall}>
              <Input
                label="Valor *"
                placeholder="0"
                keyboardType="numeric"
                value={amountInput}
                onChangeText={v => {
                  setAmountInput(v.replace(/[^0-9.]/g, ''));
                  if (formErrors.amount) {
                    setFormErrors(prev => ({...prev, amount: ''}));
                  }
                }}
                error={formErrors.amount}
              />
            </View>
            <View style={styles.formColSmall}>
              <Input
                label="Fecha *"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                value={dateDisplay}
                onChangeText={handleDateChange}
                maxLength={10}
                error={formErrors.date}
              />
            </View>
          </View>

          <Input
            label="Motivo *"
            placeholder="Ej. Pago de arriendo, servicios, transporte..."
            value={reasonInput}
            onChangeText={v => {
              setReasonInput(v);
              if (formErrors.reason) {
                setFormErrors(prev => ({...prev, reason: ''}));
              }
            }}
            error={formErrors.reason}
          />

          <TouchableOpacity
            style={[styles.primaryButton, saving && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={saving}
            activeOpacity={0.9}>
            {saving ? (
              <ActivityIndicator color={BG_SURFACE} size="small" />
            ) : (
              <>
                <Icon name="save" size={14} color={BG_SURFACE} />
                <Text style={styles.primaryButtonText}>Registrar gasto</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Filtro por rango de fechas ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBadge}>
              <Icon name="calendar" size={16} color={TEAL} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Filtrar por fechas</Text>
              <Text style={styles.cardSubtitle}>
                Consulta los gastos dentro de un rango de fechas
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

        {/* ── Lista de gastos ── */}
        <View style={styles.card}>
          <View style={styles.listHeader}>
            <Text style={styles.cardTitle}>Gastos registrados</Text>
            <View style={styles.totalPill}>
              <Text style={styles.totalPillLabel}>Total</Text>
              <Text style={styles.totalPillValue}>{formatCurrency(total)}</Text>
            </View>
          </View>

          {hasActiveFilter && (
            <Text style={styles.filterInfo}>
              Filtro:{' '}
              {dateFrom ? `desde ${ISOToDisplay(dateFrom)}` : 'sin inicio'}{' '}
              {dateTo ? `hasta ${ISOToDisplay(dateTo)}` : 'sin fin'}
            </Text>
          )}

          {/* Encabezado de tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, {flex: 2}]}>FECHA</Text>
            <Text style={[styles.thText, {flex: 5}]}>MOTIVO</Text>
            <Text style={[styles.thText, {flex: 3, textAlign: 'right'}]}>
              VALOR
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={TEAL}
              style={{marginVertical: 32}}
            />
          ) : expenses.length === 0 ? (
            // Mensaje informativo cuando no hay resultados
            <View style={styles.emptyState}>
              <Icon name="info" size={40} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No hay gastos para mostrar</Text>
              <Text style={styles.emptySubtitle}>
                {hasActiveFilter
                  ? 'No se encontraron gastos en el rango de fechas seleccionado.'
                  : 'Registra tu primer gasto usando el formulario de arriba.'}
              </Text>
            </View>
          ) : (
            expenses.map(expense => (
              <View key={expense.id ?? expense.reason} style={styles.tableRow}>
                <Text style={[styles.tdDate, {flex: 2}]}>
                  {ISOToDisplay(expense.expenseDate)}
                </Text>
                <Text style={[styles.tdReason, {flex: 5}]} numberOfLines={2}>
                  {expense.reason}
                </Text>
                <Text style={[styles.tdAmount, {flex: 3}]}>
                  {formatCurrency(expense.amount)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  buttonDisabled: {
    opacity: 0.6,
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
  },
  tdReason: {
    fontSize: 14,
    color: TEXT_MAIN,
    fontWeight: '500',
    paddingRight: 8,
  },
  tdAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_MAIN,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginTop: 4,
  },
});
