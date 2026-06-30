/**
 * Vista: Pantalla de inventario.
 */

import React, {useEffect, useState} from 'react';
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
import {Icon, ProductModal} from '../components';
import {inventoryStyles as styles, PRIMARY, TEXT_MUTED} from './InventoryScreen.styles';

interface InventoryScreenProps {
  onBack?: () => void; // Optional if navigated from drawer/menu
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({onBack}) => {
  const {products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct} = useInventoryController();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product || null);
    setIsModalVisible(true);
  };

  const handleSaveProduct = async (data: any, id?: number) => {
    if (id) {
      await updateProduct(id, data);
    } else {
      await createProduct(data);
    }
    setIsModalVisible(false);
  };

  const handleDeleteProduct = async (id?: number) => {
    if (id) {
      // In a real app we would add a confirmation dialog here
      await deleteProduct(id);
    }
  };

  const renderStockBadge = (stock: number, minStock: number = 10) => {
    if (stock <= 0) {
      return (
        <View style={[styles.stockBadge, styles.stockBadgeRed]}>
          <Text style={styles.stockBadgeTextRed}>Agotado</Text>
        </View>
      );
    }
    if (stock <= minStock) {
      return (
        <View style={[styles.stockBadge, styles.stockBadgeYellow]}>
          <Text style={styles.stockBadgeTextYellow}>{stock} (Bajo)</Text>
        </View>
      );
    }
    return (
      <View style={[styles.stockBadge, styles.stockBadgeGreen]}>
        <Text style={styles.stockBadgeTextGreen}>{stock} unid.</Text>
      </View>
    );
  };

  const renderItem = ({item}: {item: Product}) => (
    <View style={styles.row}>
      <View style={styles.colCode}>
        <Text style={styles.cellTextBold}>{item.code}</Text>
      </View>
      <View style={styles.colName}>
        <Text style={styles.cellTextBold}>{item.name}</Text>
        {item.laboratory && (
          <Text style={styles.cellMuted}>{item.laboratory}</Text>
        )}
      </View>
      <View style={styles.colCategory}>
        <Text style={styles.cellText}>{item.category || 'Sin categoría'}</Text>
      </View>
      <View style={styles.colStock}>
        {renderStockBadge(item.stock, item.minStock)}
      </View>
      <View style={styles.colPrice}>
        <Text style={styles.cellTextBold}>${item.salePrice.toFixed(2)}</Text>
      </View>
      <View style={styles.colActions}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenModal(item)}>
            <Icon name="tag" size={16} color={PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteProduct(item.id)}>
            <Icon name="delete" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
