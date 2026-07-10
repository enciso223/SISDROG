/**
 * Modal de cobro: permite ingresar el dinero recibido del cliente
 * y calcula el cambio a devolver en tiempo real.
 *
 * Usa StyleSheet.absoluteFill en lugar de <Modal> nativo, ya que
 * RCTModalHostView no está implementado en React Native Windows (Paper).
 */

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

interface PaymentModalProps {
  visible: boolean;
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const formatNum = (n: number) =>
  '$' + Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  total,
  onConfirm,
  onCancel,
}) => {
  const [amountText, setAmountText] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setAmountText('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [visible]);

  if (!visible) return null;

  const amountReceived = parseFloat(amountText.replace(/[^0-9.]/g, '')) || 0;
  const change = amountReceived - total;
  const hasEnough = amountReceived >= total;

  return (
    <View style={[StyleSheet.absoluteFill, {zIndex: 2000, elevation: 2000}]}>
      {/* Fondo oscuro */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onCancel}
      />

      {/* Tarjeta centrada */}
      <View style={styles.centeredWrapper} pointerEvents="box-none">
        <View style={styles.card}>
          {/* Encabezado */}
          <View style={styles.header}>
            <Text style={styles.title}>Cobro</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Total a cobrar */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total a cobrar</Text>
            <Text style={styles.totalValue}>{formatNum(total)}</Text>
          </View>

          {/* Dinero recibido */}
          <Text style={styles.inputLabel}>Dinero recibido del cliente</Text>
          <View style={[styles.inputWrapper, hasEnough && amountReceived > 0 && styles.inputWrapperOk]}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={amountText}
              onChangeText={setAmountText}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#94A3B8"
              selectTextOnFocus
            />
          </View>

          {/* Montos rápidos */}
          <View style={styles.quickRow}>
            {QUICK_AMOUNTS.map(v => (
              <TouchableOpacity
                key={v}
                style={styles.quickBtn}
                onPress={() => setAmountText(v.toString())}
                activeOpacity={0.75}>
                <Text style={styles.quickBtnText}>
                  {'$' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Resultado */}
          <View
            style={[
              styles.changeBox,
              amountReceived === 0
                ? styles.changeBoxNeutral
                : hasEnough
                ? styles.changeBoxOk
                : styles.changeBoxErr,
            ]}>
            {amountReceived === 0 ? (
              <Text style={styles.changeHint}>Ingresa el dinero recibido</Text>
            ) : hasEnough ? (
              <>
                <Text style={styles.changeLabel}>Cambio a devolver</Text>
                <Text style={styles.changeValue}>{formatNum(change)}</Text>
              </>
            ) : (
              <>
                <Text style={styles.changeLabel}>Falta por recibir</Text>
                <Text style={styles.changeValueErr}>
                  {formatNum(Math.abs(change))}
                </Text>
              </>
            )}
          </View>

          {/* Acciones */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                !hasEnough && styles.confirmBtnDisabled,
              ]}
              onPress={() => {
                if (hasEnough) onConfirm();
              }}
              activeOpacity={0.85}
              disabled={!hasEnough}>
              <Text style={styles.confirmBtnText}>
                {hasEnough ? `Cobrar ${formatNum(total)}` : 'Monto insuficiente'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  centeredWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '700',
  },
  totalSection: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  totalLabel: {
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0D9488',
    letterSpacing: -1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  inputWrapperOk: {
    borderColor: '#34D399',
    backgroundColor: '#F0FDF4',
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    paddingVertical: 12,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  quickBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  changeBox: {
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
  },
  changeBoxNeutral: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  changeBoxOk: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  changeBoxErr: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  changeHint: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  changeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  changeValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: -1,
  },
  changeValueErr: {
    fontSize: 32,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: -1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  confirmBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
