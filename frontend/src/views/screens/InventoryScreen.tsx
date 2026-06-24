/**
 * Vista: Pantalla de inventario.
 */

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Button} from '../components';
import {useInventoryController} from '../../controllers';
import {Product} from '../../models';

interface InventoryScreenProps {
  onBack: () => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({onBack}) => {
  const {products, loading, error, fetchProducts} = useInventoryController();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const renderItem = ({item}: {item: Product}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.code}</Text>
      <Text style={[styles.cell, styles.name]}>{item.name}</Text>
      <Text style={styles.cell}>{item.stock}</Text>
      <Text style={styles.cell}>${item.salePrice.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.toolbar}>
          <Button title="Volver" variant="secondary" onPress={onBack} />
          <Button title="Actualizar" onPress={fetchProducts} />
        </View>
        {loading && <ActivityIndicator size="large" color="#0078D4" />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.headerRow}>
          <Text style={[styles.cell, styles.headerCell]}>Código</Text>
          <Text style={[styles.cell, styles.headerCell, styles.name]}>
            Nombre
          </Text>
          <Text style={[styles.cell, styles.headerCell]}>Stock</Text>
          <Text style={[styles.cell, styles.headerCell]}>Precio</Text>
        </View>
        <FlatList
          data={products}
          keyExtractor={item => item.id?.toString() ?? item.code}
          renderItem={renderItem}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.empty}>No hay productos registrados.</Text>
            ) : null
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  headerCell: {
    fontWeight: '700',
  },
  name: {
    flex: 3,
  },
  errorText: {
    color: '#DC3545',
    marginVertical: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666666',
  },
});
