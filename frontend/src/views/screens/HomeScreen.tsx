/**
 * Vista: Pantalla principal (dashboard).
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from '../components';
import type {AppScreen} from '../components/Sidebar';

interface HomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({onNavigate}) => {
  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <Text style={styles.heading}>Módulos disponibles</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  menu: {
    padding: 32,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333333',
  },
});
