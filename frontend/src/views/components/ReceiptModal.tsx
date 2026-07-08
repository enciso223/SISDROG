import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import {salesService} from '../../services';
import {SaleReceipt, Sale} from '../../models';
import {DEMO_MODE} from '../../config/constants';
import {Icon} from './Icon';

interface ReceiptModalProps {
  visible: boolean;
  saleId: number | null;
  demoSale: Sale | null;
  /** Comprobante generado localmente (p. ej. donaciones, sin endpoint de recibo). */
  localReceipt?: SaleReceipt | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  visible,
  saleId,
  demoSale,
  localReceipt,
  onClose,
}) => {
  const [receipt, setReceipt] = useState<SaleReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Comprobante local (donaciones): se muestra sin llamar al backend.
    if (visible && localReceipt) {
      setReceipt(localReceipt);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchReceipt = async () => {
      if (!saleId) return;

      setLoading(true);
      setError(null);

      try {
        if (DEMO_MODE && saleId === 999 && demoSale) {
          // Mock receipt for demo mode
          const mockReceipt: SaleReceipt = {
            id: 1,
            sale_id: 999,
            receipt_number: 'REC-000999',
            establishment_name: 'Farmacia Demo',
            establishment_address: 'Calle Falsa 123',
            establishment_phone: '555-0123',
            created_at: new Date().toISOString(),
            sale: demoSale,
          };
          setReceipt(mockReceipt);
        } else {
          const data = await salesService.getReceipt(saleId);
          setReceipt(data);
        }
      } catch (err) {
        setError('No se pudo cargar el comprobante.');
      } finally {
        setLoading(false);
      }
    };

    if (visible && saleId) {
      fetchReceipt();
    } else if (!visible) {
      setReceipt(null);
      setError(null);
    }
  }, [visible, saleId, demoSale, localReceipt]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number | string | undefined) => {
    if (amount == null) return '$0.00';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    // Separa los miles con punto y los decimales con coma (opcional, aquí no mostramos decimales si son 0)
    const intPart = Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$${intPart}`;
  };


  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, {zIndex: 1000, elevation: 1000}]}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Generando comprobante...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContent}>
              <Icon name="error" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          ) : receipt ? (
            <View style={styles.receiptContainer}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header del Ticket */}
                <View style={styles.ticketHeader}>
                  <Icon name="inventory" size={40} color="#374151" />
                  <Text style={styles.establishmentName}>
                    {receipt.establishment_name || 'SISDROG'}
                  </Text>
                  {receipt.establishment_address && (
                    <Text style={styles.establishmentInfo}>
                      {receipt.establishment_address}
                    </Text>
                  )}
                  {receipt.establishment_phone && (
                    <Text style={styles.establishmentInfo}>
                      Tel: {receipt.establishment_phone}
                    </Text>
                  )}
                </View>

                {receipt.sale.isDonation && (
                  <View style={styles.donationBadge}>
                    <Icon name="gift" size={16} color="#0F766E" />
                    <Text style={styles.donationBadgeText}>DONACIÓN</Text>
                  </View>
                )}

                <View style={styles.divider} />

                {/* Info de la Venta */}
                <View style={styles.saleInfo}>
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Comprobante: </Text>
                    {receipt.receipt_number}
                  </Text>
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Fecha: </Text>
                    {formatDate(receipt.created_at)}
                  </Text>
                </View>

                <View style={styles.dividerDashed} />

                {/* Productos */}
                <View style={styles.productsList}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, {flex: 2}]}>CANT</Text>
                    <Text style={[styles.tableHeaderText, {flex: 4}]}>DESCRIPCIÓN</Text>
                    <Text style={[styles.tableHeaderText, {flex: 3, textAlign: 'right'}]}>IMPORTE</Text>
                  </View>
                  {receipt.sale.items.map((item: any, idx) => {
                    const name = item.productName || item.product_name || `Prod ID: ${item.productId || item.product_id || 'Desconocido'}`;
                    const subtotal = item.subtotal || item.sub_total || 0;
                    return (
                      <View key={idx} style={styles.tableRow}>
                        <Text style={[styles.tableCell, {flex: 2}]}>{item.quantity}</Text>
                        <Text style={[styles.tableCell, {flex: 4}]} numberOfLines={2}>
                          {name}
                        </Text>
                        <Text style={[styles.tableCell, {flex: 3, textAlign: 'right'}]}>
                          {formatCurrency(subtotal)}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.dividerDashed} />

                {/* Totales */}
                <View style={styles.totalsContainer}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
                    <Text style={styles.totalValue}>{formatCurrency(receipt.sale.total)}</Text>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.ticketFooter}>
                  <Text style={styles.footerText}>
                    {receipt.sale.isDonation
                      ? 'Comprobante de donación · Sin valor comercial'
                      : '¡Gracias por su compra!'}
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                  <Text style={styles.primaryButtonText}>Aceptar y Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 400,
    maxWidth: '90%',
    height: Math.round(Dimensions.get('window').height * 0.85),
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    elevation: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  centerContent: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 24,
  },
  receiptContainer: {
    flex: 1,
    padding: 24,
  },
  ticketHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  establishmentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  establishmentInfo: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 4,
  },
  donationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#5EEAD4',
  },
  donationBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#0F766E',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 16,
  },
  dividerDashed: {
    height: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    marginVertical: 16,
    borderRadius: 1,
  },
  saleInfo: {
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  productsList: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  tableCell: {
    fontSize: 14,
    color: '#111827',
  },
  totalsContainer: {
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  ticketFooter: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  actions: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: '#374151',
    fontWeight: 'bold',
  },
});
