/**
 * Componente visual: Encabezado de la aplicación.
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {APP_NAME} from '../../config/constants';

interface HeaderProps {
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({subtitle}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{APP_NAME}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    backgroundColor: '#0078D4',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: '#E0E0E0',
  },
});
