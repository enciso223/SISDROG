/**
 * Componente visual reutilizable: iconos de Segoe MDL2 Assets.
 *
 * Usa la fuente nativa de Windows para mostrar iconos limpios sin
 * depender de librerías externas ni emojis.
 */

import React from 'react';
import {Text, StyleSheet} from 'react-native';

export type IconName =
  | 'home'
  | 'sales'
  | 'inventory'
  | 'purchases'
  | 'expenses'
  | 'reports'
  | 'settings'
  | 'search'
  | 'user'
  | 'scan'
  | 'tag'
  | 'delete'
  | 'payment'
  | 'close'
  | 'chevronLeft'
  | 'chevronRight'
  | 'menu'
  | 'info'
  | 'money'
  | 'calendar'
  | 'package'
  | 'save'
  | 'edit';

const ICONS: Record<IconName, string> = {
  home: '\uE80F',
  sales: '\uE7BF',
  inventory: '\uE7B8',
  purchases: '\uE719',
  expenses: '\uE8A7',
  reports: '\uE9D2',
  settings: '\uE713',
  search: '\uE721',
  user: '\uE77B',
  scan: '\uE8B0',
  tag: '\uE7C3',
  delete: '\uE74D',
  payment: '\uE719',
  close: '\uE8BB',
  chevronLeft: '\uE76B',
  chevronRight: '\uE76C',
  menu: '\uE700',
  info: '\uE946',
  money: '\uE8A7',
  calendar: '\uE787',
  package: '\uE7B8',
  save: '\uE74E',
  edit: '\uE70F',
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 16,
  color = '#374151',
}) => <Text style={[styles.icon, {fontSize: size, color}]}>{ICONS[name]}</Text>;

const styles = StyleSheet.create({
  icon: {
    fontFamily: 'Segoe MDL2 Assets',
  },
});
