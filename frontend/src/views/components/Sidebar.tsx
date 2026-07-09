/**
 * Componente visual reutilizable: Menú lateral de navegación.
 * Los estilos están en Sidebar.styles.ts
 */

import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {Icon} from './Icon';
import type {IconName} from './Icon';
import {sidebarStyles as styles} from './Sidebar.styles';

export type AppScreen =
  | 'home'
  | 'sales'
  | 'inventory'
  | 'purchases'
  | 'expenses'
  | 'reports'
  | 'settings';

export interface MenuItem {
  key: AppScreen;
  label: string;
  icon: IconName;
}

interface SidebarProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  branchName?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {key: 'home', label: 'Inicio', icon: 'home'},
  {key: 'sales', label: 'Ventas (POS)', icon: 'sales'},
  {key: 'inventory', label: 'Inventario', icon: 'inventory'},
  {key: 'expenses', label: 'Gastos', icon: 'expenses'},
  {key: 'reports', label: 'Reportes', icon: 'reports'},
];

// ─── Toggle Button ────────────────────────────────────────────────

interface ToggleButtonProps {
  isExpanded: boolean;
  onToggleExpand?: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isExpanded,
  onToggleExpand,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <View style={styles.footer}>
      <Pressable
        onPress={onToggleExpand}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        style={({pressed}) => [
          styles.toggleButton,
          isExpanded
            ? styles.toggleButtonExpanded
            : styles.toggleButtonCollapsed,
          hovered && styles.toggleButtonHovered,
          pressed && styles.toggleButtonPressed,
        ]}>
        <Icon
          name={isExpanded ? 'chevronLeft' : 'chevronRight'}
          size={14}
          color="#6B7280"
        />
        {isExpanded && <Text style={styles.toggleText}>Ocultar menú</Text>}
      </Pressable>
    </View>
  );
};

// ─── Menu Item Button ─────────────────────────────────────────────

interface MenuItemButtonProps {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  onPress: () => void;
}

const MenuItemButton: React.FC<MenuItemButtonProps> = ({
  item,
  isActive,
  isExpanded,
  onPress,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({pressed}) => [
        styles.item,
        isExpanded ? styles.itemExpanded : styles.itemCollapsed,
        hovered && !isActive && styles.itemHovered,
        pressed && styles.itemPressed,
        // El borde izquierdo activo se aplica solo en modo expandido
        isActive && isExpanded && styles.itemActive,
        isActive && !isExpanded && styles.itemActiveCollapsed,
      ]}>
      <View
        style={[
          styles.itemContent,
          !isExpanded && styles.itemContentCollapsed,
        ]}>
        <Icon
          name={item.icon}
          size={18}
          color={isActive ? '#0F766E' : hovered ? '#111827' : '#6B7280'}
        />
        {isExpanded && (
          <Text
            style={[
              styles.label,
              hovered && !isActive && styles.labelHovered,
              isActive && styles.labelActive,
            ]}>
            {item.label}
          </Text>
        )}
      </View>
      {/* Punto indicador en modo colapsado */}
      {isActive && !isExpanded && <View style={styles.activeDot} />}
    </Pressable>
  );
};

// ─── Sidebar Principal ────────────────────────────────────────────

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  isExpanded = true,
  onToggleExpand,
  branchName = 'Sucursal Central',
}) => {
  return (
    <View
      style={[
        styles.container,
        isExpanded ? styles.containerExpanded : styles.containerCollapsed,
      ]}>
      {/* Marca / Logo */}
      <View style={styles.brand}>
        {isExpanded ? (
          <View style={styles.brandLogoRow}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>D</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>Droguería Laureano Gómez</Text>
              <Text style={styles.brandSubtitle}>{branchName}</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.brandIcon, styles.brandIconCollapsed]}>
            <Text style={styles.brandIconText}>D</Text>
          </View>
        )}
      </View>

      {/* Items del menú */}
      <View style={styles.menu}>
        {MENU_ITEMS.map(item => (
          <MenuItemButton
            key={item.key}
            item={item}
            isActive={item.key === activeScreen}
            isExpanded={isExpanded}
            onPress={() => onNavigate(item.key)}
          />
        ))}
      </View>

      <ToggleButton isExpanded={isExpanded} onToggleExpand={onToggleExpand} />
    </View>
  );
};
