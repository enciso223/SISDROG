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
import {Sale} from '../../models';
import {homeStyles as styles} from './HomeScreen.styles';

interface HomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

// Datos estáticos temporales
const STATIC_INVENTORY_VALUE = 4550000;
const STATIC_TOP_PRODUCTS = [
  {id: 1, name: 'Paracetamol 500mg', qty: 145},
  {id: 2, name: 'Ibuprofeno 400mg', qty: 98},
  {id: 3, name: 'Vitamina C', qty: 76},
  {id: 4, name: 'Amoxicilina 500mg', qty: 54},
];

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

  // Estado para el modal de recibo
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoadingSales(true);
      const data = await salesService.getAll();
      
      // Filtrar últimos 30 días y ordenar descendente por fecha
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

          {/* Ranking de Productos (Estático por ahora) */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Productos más vendidos</Text>
            {STATIC_TOP_PRODUCTS.map((prod, index) => (
              <View key={prod.id} style={styles.rankingItem}>
                <Text style={styles.rankingName}>
                  {index + 1}. {prod.name}
                </Text>
                <Text style={styles.rankingQty}>{prod.qty} ud.</Text>
              </View>
            ))}
            <Text style={styles.emptyText}>* Datos simulados</Text>
          </View>

          {/* Valor del Inventario (Estático por ahora) */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Valor del Inventario</Text>
            <View style={styles.inventoryValueContainer}>
              <Text style={styles.inventoryValueText}>
                {formatCurrency(STATIC_INVENTORY_VALUE)}
              </Text>
              <Text style={styles.inventoryValueSub}>
                Costo total estimado en bodega
              </Text>
              <Text style={styles.emptyText}>* Dato simulado</Text>
            </View>
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
