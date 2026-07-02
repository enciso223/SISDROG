import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Product} from '../../models';
import {Icon} from './Icon';
import {inventoryStyles as styles, PRIMARY} from '../screens/InventoryScreen.styles';

interface ProductRowProps {
  item: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
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

  return (
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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(item)}>
            <Icon name="tag" size={16} color={PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => item.id && onDelete(item.id)}>
            <Icon name="delete" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
