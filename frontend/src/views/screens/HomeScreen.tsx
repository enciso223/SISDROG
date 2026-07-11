/**
 * Vista: Pantalla principal (dashboard) — diseño premium.
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ReceiptModal, Icon} from '../components';
import type {AppScreen} from '../components/Sidebar';
import {salesService} from '../../services/SalesService';
import {reportsService, TopProductItem, InventoryValueResponse} from '../../services/ReportsService';
import {donationsService, Donation} from '../../services/DonationsService';
import {Sale, SaleReceipt, PaymentMethod} from '../../models';
import {homeStyles as styles, TEAL, TEAL_DARK, INDIGO, AMBER} from './HomeScreen.styles';

interface HomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

const formatCurrency = (amount: number) => {
  const intPart = Math.floor(Math.abs(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${intPart}`;
};

const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTodayLabel = () => {
  const d = new Date();
  return d.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const HomeScreen: React.FC<HomeScreenProps> = ({onNavigate: _onNavigate}) => {  // eslint-disable-line @typescript-eslint/no-unused-vars
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(true);

  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);
  const [loadingTopProducts, setLoadingTopProducts] = useState(true);
  const [rankingPeriod, setRankingPeriod] = useState<number | 'all'>(30);

  const [inventoryValue, setInventoryValue] = useState<InventoryValueResponse | null>(null);
  const [loadingInventoryValue, setLoadingInventoryValue] = useState(true);

  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  useEffect(() => {
    fetchSales();
    fetchDonations();
    fetchInventoryValue();
  }, []);

  useEffect(() => {
    fetchTopProducts(rankingPeriod);
  }, [rankingPeriod]);

  const fetchSales = async () => {
    try {
      setLoadingSales(true);
      const data = await salesService.getAll();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const filteredAndSorted = data
        .filter(s => new Date(s.createdAt ?? 0).getTime() >= thirtyDaysAgo.getTime())
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        );
      setSales(filteredAndSorted);
    } catch (e) {
      console.error('Error fetching sales:', e);
    } finally {
      setLoadingSales(false);
    }
  };

  const fetchDonations = async () => {
    try {
      setLoadingDonations(true);
      const data = await donationsService.getAll();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const filteredAndSorted = data
        .filter(d => new Date(d.createdAt ?? 0).getTime() >= thirtyDaysAgo.getTime())
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        );
      setDonations(filteredAndSorted);
    } catch (e) {
      console.error('Error fetching donations:', e);
    } finally {
      setLoadingDonations(false);
    }
  };

  const fetchTopProducts = async (period: number | 'all') => {
    try {
      setLoadingTopProducts(true);
      const filters: any = {};
      if (period !== 'all') {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - period);
        filters.dateFrom = fromDate.toISOString().split('T')[0];
      }
      const response = await reportsService.getTopProducts(filters, 5);
      setTopProducts(response.products || []);
    } catch (e) {
      console.error('Error fetching top products:', e);
    } finally {
      setLoadingTopProducts(false);
    }
  };

  const fetchInventoryValue = async () => {
    try {
      setLoadingInventoryValue(true);
      const data = await reportsService.getInventoryValue();
      setInventoryValue(data);
    } catch (e) {
      console.error('Error fetching inventory value:', e);
    } finally {
      setLoadingInventoryValue(false);
    }
  };

  const handleOpenReceipt = (saleId: number | undefined) => {
    if (saleId != null) {
      setSelectedSaleId(saleId);
      setIsReceiptVisible(true);
    }
  };

  const handleOpenDonationReceipt = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsReceiptVisible(true);
  };

  const generateDonationReceipt = (donation: Donation): SaleReceipt => {
    const isReceived = donation.donationType === 'received';
    return {
      id: donation.id,
      sale_id: donation.id,
      receipt_number: `DON-${donation.id.toString().padStart(5, '0')}`,
      establishment_name: 'Droguería Laureano Gómez',
      created_at: donation.createdAt,
      sale: {
        id: donation.id,
        invoiceNumber: `DON-${donation.id.toString().padStart(5, '0')}`,
        customerName: isReceived ? 'Entrada por Donación' : 'Salida por Donación',
        subtotal: 0,
        tax: 0,
        total: 0,
        isDonation: true,
        createdAt: donation.createdAt,
        paymentMethod: PaymentMethod.CASH,
        items: donation.items.map(item => ({
          productId: item.productId,
          productName: item.productName || `Producto ID: ${item.productId}`,
          quantity: item.quantity,
          unitPrice: 0,
          subtotal: 0,
        })),
      }
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero Header ── */}
        <View style={styles.hero}>
          <Text style={styles.heroGreeting}>Droguería Laureano Gómez</Text>
          <Text style={styles.heroTitle}>Inicio</Text>
          <Text style={styles.heroSubtitle}>{getTodayLabel()}</Text>
          <View style={styles.heroAccentLine} />
        </View>

        <View style={styles.contentWrapper}>

          {/* ─────────────────────────── SECCIÓN: VENTAS ─────────────────────────── */}
          <Text style={styles.sectionLabel}>Historial de ventas · últimos 30 días</Text>
          <View style={styles.dashboardGrid}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconWrap, styles.cardIconWrapTeal]}>
                  <Icon name="history" size={18} color={TEAL} />
                </View>
                <Text style={styles.cardTitle}>Ventas Recientes</Text>
                <Text style={styles.cardBadge}>{sales.length} reg.</Text>
              </View>

              {loadingSales ? (
                <ActivityIndicator size="small" color={TEAL} style={{marginVertical: 24}} />
              ) : sales.length === 0 ? (
                <Text style={styles.emptyText}>No hay ventas en los últimos 30 días.</Text>
              ) : (
                <ScrollView style={styles.salesList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {sales.map(sale => (
                    <TouchableOpacity
                      key={sale.id}
                      style={styles.saleRow}
                      onPress={() => handleOpenReceipt(sale.id)}
                      activeOpacity={0.7}>
                      <View style={styles.saleLeftDot} />
                      <View style={styles.saleInfo}>
                        <Text style={styles.saleId}>Venta #{sale.id}</Text>
                        <Text style={styles.saleDate}>
                          {sale.createdAt ? formatDate(sale.createdAt) : 'Sin fecha'}
                        </Text>
                      </View>
                      <View style={styles.saleTotalWrap}>
                        <Text style={styles.saleTotal}>{formatCurrency(sale.total)}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Donaciones Recientes */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconWrap, styles.cardIconWrapTeal]}>
                  <Icon name="gift" size={18} color={TEAL} />
                </View>
                <Text style={styles.cardTitle}>Donaciones Recientes</Text>
                <Text style={styles.cardBadge}>{donations.length} reg.</Text>
              </View>

              {loadingDonations ? (
                <ActivityIndicator size="small" color={TEAL} style={{marginVertical: 24}} />
              ) : donations.length === 0 ? (
                <Text style={styles.emptyText}>No hay donaciones en los últimos 30 días.</Text>
              ) : (
                <ScrollView style={styles.salesList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {donations.map(donation => (
                    <TouchableOpacity
                      key={donation.id}
                      style={styles.saleRow}
                      onPress={() => handleOpenDonationReceipt(donation)}
                      activeOpacity={0.7}>
                      <View style={styles.saleLeftDot} />
                      <View style={styles.saleInfo}>
                        <Text style={styles.saleId}>
                          Donación #{donation.id} ({donation.donationType === 'received' ? 'Recibida' : 'Entregada'})
                        </Text>
                        <Text style={styles.saleDate}>
                          {donation.createdAt ? formatDate(donation.createdAt) : 'Sin fecha'}
                        </Text>
                      </View>
                      <View style={styles.saleTotalWrap}>
                        <Text style={[styles.saleTotal, {color: TEAL, fontSize: 13}]}>
                          {donation.items.reduce((acc, item) => acc + item.quantity, 0)} items
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>

          {/* ─────────────────────────── SECCIÓN: ANÁLISIS ─────────────────────────── */}
          <Text style={styles.sectionLabel}>Análisis</Text>
          <View style={styles.dashboardGrid}>

            {/* Ranking de productos */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconWrap, styles.cardIconWrapIndigo]}>
                  <Icon name="reports" size={18} color={INDIGO} />
                </View>
                <Text style={styles.cardTitle}>Productos más vendidos</Text>
              </View>

              <View style={styles.chipRow}>
                {([7, 30, 'all'] as const).map(days => (
                  <TouchableOpacity
                    key={days.toString()}
                    style={[styles.chip, rankingPeriod === days && styles.chipActive]}
                    onPress={() => setRankingPeriod(days as any)}
                    activeOpacity={0.75}>
                    <Text style={[styles.chipText, rankingPeriod === days && styles.chipTextActive]}>
                      {days === 'all' ? 'Todo' : `${days} días`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {loadingTopProducts ? (
                <ActivityIndicator size="small" color={TEAL} style={{marginVertical: 24}} />
              ) : topProducts.length === 0 ? (
                <Text style={styles.emptyText}>No hay productos vendidos en este período.</Text>
              ) : (
                topProducts.map((prod, index) => (
                  <View key={prod.product_id} style={styles.rankingItem}>
                    <View style={[styles.rankingBadge, index === 0 && styles.rankingBadgeTop]}>
                      <Text style={[styles.rankingBadgeText, index === 0 && styles.rankingBadgeTextTop]}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={styles.rankingName} numberOfLines={1}>{prod.product_name}</Text>
                    <View style={styles.rankingQtyWrap}>
                      <Text style={styles.rankingQty}>{prod.total_quantity} ud.</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Valor del Inventario */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconWrap, styles.cardIconWrapAmber]}>
                  <Icon name="inventory" size={18} color={AMBER} />
                </View>
                <Text style={styles.cardTitle}>Valor del Inventario</Text>
              </View>

              {loadingInventoryValue ? (
                <ActivityIndicator size="small" color={TEAL} style={{marginVertical: 24}} />
              ) : !inventoryValue ? (
                <Text style={styles.emptyText}>No se pudo cargar el valor del inventario.</Text>
              ) : (
                <View style={styles.inventoryValueContainer}>
                  {/* Capital Invertido */}
                  <View style={styles.inventoryMetricRow}>
                    <View>
                      <Text style={styles.inventoryMetricLabel}>Capital invertido</Text>
                      <Text style={[styles.inventoryMetricValue, styles.inventoryMetricValueTeal]}>
                        {formatCurrency(inventoryValue.total_purchase_value)}
                      </Text>
                    </View>
                  </View>

                  {/* Valor Esperado */}
                  <View style={styles.inventoryMetricRow}>
                    <View>
                      <Text style={styles.inventoryMetricLabel}>Valor esperado (venta)</Text>
                      <Text style={[styles.inventoryMetricValue, styles.inventoryMetricValueIndigo]}>
                        {formatCurrency(inventoryValue.total_sale_value)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

          </View>
        </View>
      </ScrollView>

      <ReceiptModal
        visible={isReceiptVisible}
        saleId={selectedSaleId}
        demoSale={null}
        localReceipt={selectedDonation ? generateDonationReceipt(selectedDonation) : null}
        onClose={() => {
          setIsReceiptVisible(false);
          setSelectedSaleId(null);
          setSelectedDonation(null);
        }}
      />
    </View>
  );
};
