/**
 * Componente de fila de producto (v2).
 *
 * Columnas: ID PROD. | NOMBRE + ORIGEN | CATEGORÍA/LAB | STOCK | CADUCIDAD | PRECIO VENTA | ACCIONES
 */

import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Product, ProductOrigin} from '../../models';
import {Icon, IconName} from './Icon';
import {inventoryStyles as styles, PRIMARY, TEXT_MUTED} from '../screens/InventoryScreen.styles';

interface ProductRowProps {
  item: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

/** Formatea el id numérico como PRD-XXXX */
const formatProductId = (id?: number): string => {
  if (!id) {return '—'}
  return `PRD-${String(id).padStart(4, '0')}`;
};

/** Formatea YYYY-MM-DD → DD/MM/YYYY */
const formatDate = (dateStr?: string): string => {
  if (!dateStr) {return '—';}
  const parts = dateStr.split('-');
  if (parts.length !== 3) {return dateStr;}
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

/** Ícono según el origen del producto */
const originIcon = (origin?: ProductOrigin): IconName => {
  if (origin === 'Donación') {return 'gift';}
  return 'cart';
};

/** Badge de estado de stock */
const renderStockBadge = (stock: number, minStock: number = 10) => {
  if (stock <= 0) {
    return (
      <View style={styles.stockRow}>
        <Text style={styles.stockNumber}>{stock}</Text>
        <View style={[styles.stockBadge, styles.stockBadgeRed]}>
          <Text style={styles.stockBadgeTextRed}>AGOTADO</Text>
        </View>
      </View>
    );
  }
  if (stock <= minStock) {
    return (
      <View style={styles.stockRow}>
        <Text style={[styles.stockNumber, {color: '#D97706'}]}>{stock}</Text>
        <View style={[styles.stockBadge, styles.stockBadgeYellow]}>
          <Text style={styles.stockBadgeTextYellow}>BAJO</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.stockRow}>
      <Text style={styles.stockNumber}>{stock}</Text>
      <View style={[styles.stockBadge, styles.stockBadgeGreen]}>
        <Text style={styles.stockBadgeTextGreen}>NORMAL</Text>
      </View>
    </View>
  );
};

export const ProductRow: React.FC<ProductRowProps> = ({item, onEdit, onDelete}) => {
  return (
    <View style={styles.row}>

      {/* ID PROD. */}
      <View style={styles.colCode}>
        <Text style={styles.cellText}>{item.code}</Text>
      </View>

      {/* NOMBRE DEL PRODUCTO + origen */}
      <View style={styles.colName}>
        <Text style={styles.cellTextBold}>{item.name}</Text>
        {item.origin && (
          <View style={styles.originTag}>
            <Icon name={originIcon(item.origin)} size={11} color={TEXT_MUTED} />
            <Text style={styles.originText}>{item.origin}</Text>
          </View>
        )}
      </View>

      {/* CATEGORÍA / LAB */}
      <View style={styles.colCategory}>
        <Text style={styles.cellText}>{item.category || 'Sin categoría'}</Text>
        {item.laboratory && (
          <Text style={styles.cellMuted}>Lab. {item.laboratory.replace(/^Lab\.\s*/i, '')}</Text>
        )}
      </View>

      {/* STOCK */}
      <View style={styles.colStock}>
        {renderStockBadge(item.stock, item.minStock)}
      </View>

      {/* CADUCIDAD */}
      <View style={styles.colExpiry}>
        <Text style={styles.cellText}>{formatDate(item.expirationDate)}</Text>
      </View>

      {/* PRECIO VENTA */}
      <View style={styles.colPrice}>
        <Text style={styles.cellTextBold}>${item.salePrice.toFixed(2)}</Text>
      </View>

      {/* ACCIONES: editar | eliminar */}
      <View style={styles.colActions}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(item)}>
            <Icon name="edit" size={15} color={PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => item.id && onDelete(item.id)}>
            <Icon name="delete" size={15} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};
