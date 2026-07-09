/**
 * Vista: Pantalla principal (dashboard).
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Button, ReceiptModal} from '../components';
import type {AppScreen} from '../components/Sidebar';
import {salesService} from '../../services/SalesService';
import {reportsService, TopProductItem, InventoryValueResponse} from '../../services/ReportsService';
import {Sale} from '../../models';
import {homeStyles as styles} from './HomeScreen.styles';

interface HomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

const formatCurrency = (amount: number) => {
  const intPart = Math.floor(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

export const HomeScreen: React.FC<HomeScreenProps> = ({onNavigate}) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);

  // Ranking de productos
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);
  const [loadingTopProducts, setLoadingTopProducts] = useState(true);
  const [rankingPeriod, setRankingPeriod] = useState<number | 'all'>(30);

  // Valor de inventario
  const [inventoryValue, setInventoryValue] = useState<InventoryValueResponse | null>(null);
  const [loadingInventoryValue, setLoadingInventoryValue] = useState(true);

  // Estado para el modal de recibo
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

  useEffect(() => {
    fetchSales();
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
        .filter(sale => new Date(sale.createdAt ?? 0).getTime() >= thirtyDaysAgo.getTime())
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        );
      setSales(filteredAndSorted);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoadingSales(false);
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
    } catch (error) {
      console.error('Error fetching top products:', error);
    } finally {
      setLoadingTopProducts(false);
    }
  };

  const fetchInventoryValue = async () => {
    try {
      setLoadingInventoryValue(true);
      const data = await reportsService.getInventoryValue();
      setInventoryValue(data);
    } catch (error) {
      console.error('Error fetching inventory value:', error);
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Panel de Control</Text>
        </View>

        <Text style={styles.cardTitle}>Módulos de Acceso Rápido</Text>
        <View style={styles.modulesRow}>
          <Button
            title="Ventas (POS)"
            variant="primary"
            onPress={() => onNavigate('sales')}
          />
          <Button
            title="Inventario"
            variant="primary"
            onPress={() => onNavigate('inventory')}
          />
        </View>

        <View style={styles.dashboardGrid}>
          {/* Historial de Ventas */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ventas Recientes</Text>
            {loadingSales ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : sales.length === 0 ? (
              <Text style={styles.emptyText}>No hay ventas registradas en los últimos 30 días.</Text>
            ) : (
              <ScrollView style={styles.salesList} nestedScrollEnabled>
                {sales.map(sale => (
                  <TouchableOpacity
                    key={sale.id}
                    style={styles.saleRow}
                    onPress={() => handleOpenReceipt(sale.id)}>
                    <View style={styles.saleInfo}>
                      <Text style={styles.saleId}>
                        Venta #{sale.id}
                      </Text>
                      <Text style={styles.saleDate}>
                        {sale.createdAt ? formatDate(sale.createdAt) : 'Sin fecha'}
                      </Text>
                    </View>
                    <Text style={styles.saleTotal}>
                      {formatCurrency(sale.total)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Ranking de Productos */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Productos más vendidos</Text>
            <View style={styles.chipRow}>
              {[7, 30, 'all'].map(days => (
                <TouchableOpacity
                  key={days.toString()}
                  style={[styles.chip, rankingPeriod === days && styles.chipActive]}
                  onPress={() => setRankingPeriod(days as any)}>
                  <Text style={[styles.chipText, rankingPeriod === days && styles.chipTextActive]}>
                    {days === 'all' ? 'Todo' : `${days} d`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {loadingTopProducts ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : topProducts.length === 0 ? (
              <Text style={styles.emptyText}>No hay productos vendidos en este período.</Text>
            ) : (
              topProducts.map((prod, index) => (
                <View key={prod.product_id} style={styles.rankingItem}>
                  <Text style={styles.rankingName}>
                    {index + 1}. {prod.product_name}
                  </Text>
                  <Text style={styles.rankingQty}>{prod.total_quantity} ud.</Text>
                </View>
              ))
            )}
          </View>

          {/* Valor del Inventario */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Valor del Inventario</Text>
            {loadingInventoryValue ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : !inventoryValue ? (
              <Text style={styles.emptyText}>No se pudo cargar el valor del inventario.</Text>
            ) : (
              <View style={styles.inventoryValueContainer}>
                {/* Capital Invertido */}
                <View style={{alignItems: 'center', marginBottom: 20}}>
                  <Text style={styles.inventoryValueText}>
                    {formatCurrency(inventoryValue.total_purchase_value)}
                  </Text>
                  <Text style={styles.inventoryValueSub}>
                    Capital invertido (Precio de Compra)
                  </Text>
                </View>
                
                {/* Valor Esperado */}
                <View style={{alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', width: '100%'}}>
                  <Text style={[styles.inventoryValueText, {color: '#10B981', fontSize: 28}]}>
                    {formatCurrency(inventoryValue.total_sale_value)}
                  </Text>
                  <Text style={styles.inventoryValueSub}>
                    Valor esperado (Precio de Venta)
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <ReceiptModal
        visible={isReceiptVisible}
        saleId={selectedSaleId}
        onClose={() => setIsReceiptVisible(false)}
      />
    </View>
  );
};
