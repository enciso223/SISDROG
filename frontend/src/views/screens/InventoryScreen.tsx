/**
 * Vista: Pantalla de inventario.
 *
 * Incluye panel de alertas (HU-07), tabla de productos y modal CRUD.
 */

import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useInventoryController} from '../../controllers';
import {Product} from '../../models';
import {Icon, ProductModal, AlertsPanel, ProductRow} from '../components';
import {inventoryStyles as styles, PRIMARY, TEXT_MUTED} from './InventoryScreen.styles';

interface InventoryScreenProps {
  onBack?: () => void; // Optional if navigated from drawer/menu
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({onBack}) => {
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // HU-07: alertas
    alerts,
    alertsLoading,
    fetchAlerts,
  } = useInventoryController();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchAlerts();
  }, [fetchProducts, fetchAlerts]);

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product || null);
    setIsModalVisible(true);
  };

  /** Guarda un producto y refresca las alertas automáticamente. */
  const handleSaveProduct = useCallback(
    async (data: any, id?: number) => {
      if (id) {
        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }
      setIsModalVisible(false);
      // Refrescar alertas tras modificar inventario
      fetchAlerts();
    },
    [updateProduct, createProduct, fetchAlerts],
  );

  /** Elimina un producto y refresca las alertas automáticamente. */
  const handleDeleteProduct = useCallback(
    async (id?: number) => {
      if (id) {
        await deleteProduct(id);
        fetchAlerts();
      }
    },
    [deleteProduct, fetchAlerts],
  );

  const renderItem = ({item}: {item: Product}) => (
    <ProductRow
      item={item}
      onEdit={handleOpenModal}
      onDelete={handleDeleteProduct}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Inventario de Productos</Text>
          <Text style={styles.subtitle}>
            Gestiona los productos, existencias y precios
          </Text>
        </View>
        
        <View style={styles.toolbar}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={16} color={TEXT_MUTED} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o código..."
              placeholderTextColor={TEXT_MUTED}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
            <Icon name="tag" size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Nuevo Producto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HU-07: Panel de Alertas */}
      <AlertsPanel alerts={alerts} loading={alertsLoading} />

      {/* Tabla */}
      <View style={styles.tableContainer}>
        {/* Cabecera de Tabla */}
        <View style={styles.tableHeader}>
          <View style={styles.colCode}>
            <Text style={styles.headerCellText}>CÓDIGO</Text>
          </View>
          <View style={styles.colName}>
            <Text style={styles.headerCellText}>NOMBRE / LAB</Text>
          </View>
          <View style={styles.colCategory}>
            <Text style={styles.headerCellText}>CATEGORÍA</Text>
          </View>
          <View style={styles.colStock}>
            <Text style={styles.headerCellText}>STOCK</Text>
          </View>
          <View style={styles.colPrice}>
            <Text style={styles.headerCellText}>PRECIO</Text>
          </View>
          <View style={styles.colActions}>
            <Text style={styles.headerCellText}>ACCIONES</Text>
          </View>
        </View>

        {/* Contenido */}
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={PRIMARY} />
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Icon name="close" size={32} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={item => item.id?.toString() ?? item.code}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.centerContent}>
                <View style={styles.emptyIcon}>
                  <Icon name="inventory" size={24} color={TEXT_MUTED} />
                </View>
                <Text style={styles.emptyTitle}>No hay productos</Text>
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? 'No se encontraron resultados para tu búsqueda.'
                    : 'Añade tu primer producto al inventario para comenzar.'}
                </Text>
              </View>
            }
          />
        )}
      </View>
      
      {/* Modal para Crear/Editar */}
      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </View>
  );
};
