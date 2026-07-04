/**
 * Vista: Pantalla de inventario (v2).
 *
 * Incluye:
 *  - Panel de alertas rápidas (HU-07)
 *  - Barra de búsqueda por nombre, código o laboratorio
 *  - Tabla con 7 columnas
 *  - Paginación client-side
 *  - Modal CRUD
 */

import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useInventoryController} from '../../controllers';
import {Product} from '../../models';
import {Icon, ProductModal, AlertsPanel, ProductRow} from '../components';
import {
  inventoryStyles as styles,
  PRIMARY,
  TEXT_MUTED,
  BORDER,
} from './InventoryScreen.styles';

const PAGE_SIZE = 8;

interface InventoryScreenProps {
  onBack?: () => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({onBack: _onBack}) => {
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    alerts,
    alertsLoading,
    fetchAlerts,
  } = useInventoryController();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchAlerts();
  }, [fetchProducts, fetchAlerts]);

  /* ─── Filtrado por búsqueda ─── */
  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) {return true;}
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      (p.laboratory || '').toLowerCase().includes(q)
    );
  });

  /* ─── Paginación ─── */
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageItems = filteredProducts.slice(startIdx, startIdx + PAGE_SIZE);
  const startLabel = totalItems === 0 ? 0 : startIdx + 1;
  const endLabel = Math.min(startIdx + PAGE_SIZE, totalItems);

  /* ─── Handlers ─── */
  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product || null);
    setIsModalVisible(true);
  };

  const handleSaveProduct = useCallback(
    async (data: any, id?: number) => {
      if (id) {
        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }
      setIsModalVisible(false);
      fetchAlerts();
    },
    [updateProduct, createProduct, fetchAlerts],
  );

  const handleDeleteProduct = useCallback(
    async (id?: number) => {
      if (id) {
        await deleteProduct(id);
        fetchAlerts();
      }
    },
    [deleteProduct, fetchAlerts],
  );

  /* ─── Páginas a mostrar ─── */
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (safePage > 3) {pages.push('...');}
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) {pages.push('...');}
    pages.push(totalPages);
    return pages;
  };

  const renderItem = ({item}: {item: Product}) => (
    <ProductRow
      item={item}
      onEdit={handleOpenModal}
      onDelete={handleDeleteProduct}
    />
  );

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Gestión de Inventario</Text>
          <Text style={styles.subtitle}>
            Administra productos, niveles de stock y caducidades.
          </Text>
        </View>
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
            <Icon name="plus" size={15} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Agregar Nuevo Producto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── HU-07: Panel de Alertas ── */}
      <AlertsPanel alerts={alerts} loading={alertsLoading} />

      {/* ── Barra de búsqueda ── */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color={TEXT_MUTED} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, código o laboratorio..."
          placeholderTextColor={TEXT_MUTED}
          value={searchQuery}
          onChangeText={v => { setSearchQuery(v); setCurrentPage(1); }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={13} color={TEXT_MUTED} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Tabla ── */}
      <View style={styles.tableContainer}>
        {/* Cabecera */}
        <View style={styles.tableHeader}>
          <View style={styles.colCode}>
            <Text style={styles.headerCellText}>ID PROD.</Text>
          </View>
          <View style={styles.colName}>
            <Text style={styles.headerCellText}>NOMBRE DEL PRODUCTO</Text>
          </View>
          <View style={styles.colCategory}>
            <Text style={styles.headerCellText}>CATEGORÍA / LAB</Text>
          </View>
          <View style={styles.colStock}>
            <Text style={styles.headerCellText}>STOCK</Text>
          </View>
          <View style={styles.colExpiry}>
            <Text style={styles.headerCellText}>CADUCIDAD</Text>
          </View>
          <View style={styles.colPrice}>
            <Text style={styles.headerCellText}>PRECIO VENTA</Text>
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
            data={pageItems}
            keyExtractor={item => item.id?.toString() ?? item.code}
            renderItem={renderItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.centerContent}>
                <View style={styles.emptyIcon}>
                  <Icon name="inventory" size={24} color={TEXT_MUTED} />
                </View>
                <Text style={styles.emptyTitle}>No hay productos</Text>
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? 'No se encontraron resultados para tu búsqueda.'
                    : 'Agrega tu primer producto al inventario para comenzar.'}
                </Text>
              </View>
            }
          />
        )}

        {/* Paginación */}
        {!loading && !error && totalItems > 0 && (
          <View style={styles.paginationBar}>
            <Text style={styles.paginationInfo}>
              Mostrando {startLabel} a {endLabel} de {totalItems} producto{totalItems !== 1 ? 's' : ''}
            </Text>
            <View style={styles.paginationControls}>
              <TouchableOpacity
                style={[styles.pageButton, safePage === 1 && styles.pageButtonDisabled]}
                disabled={safePage === 1}
                onPress={() => setCurrentPage(p => p - 1)}>
                <Icon name="chevronLeft" size={12} color={BORDER} />
              </TouchableOpacity>

              {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                  <Text key={`ellipsis-${idx}`} style={styles.pageEllipsis}>…</Text>
                ) : (
                  <TouchableOpacity
                    key={page}
                    style={[styles.pageButton, page === safePage && styles.pageButtonActive]}
                    onPress={() => setCurrentPage(page as number)}>
                    <Text style={[styles.pageButtonText, page === safePage && styles.pageButtonTextActive]}>
                      {page}
                    </Text>
                  </TouchableOpacity>
                ),
              )}

              <TouchableOpacity
                style={[styles.pageButton, safePage === totalPages && styles.pageButtonDisabled]}
                disabled={safePage === totalPages}
                onPress={() => setCurrentPage(p => p + 1)}>
                <Icon name="chevronRight" size={12} color={BORDER} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Modal Crear/Editar */}
      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </View>
  );
};
