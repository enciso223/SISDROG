/**
 * Componente visual reutilizable: Barra superior con título, búsqueda y perfil.
 * Los estilos están en TopHeader.styles.ts
 */

import React from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';
import {Icon} from './Icon';
import {topHeaderStyles as styles} from './TopHeader.styles';

interface TopHeaderProps {
  title?: string;
  breadcrumb?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  userName?: string;
  userRole?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title = 'SISDROG',
  breadcrumb,
  searchValue,
  onSearchChange,
  placeholder = 'Buscar productos, ventas...',
  userName = 'Usuario',
  userRole = 'Administrador',
}) => {
  return (
    <View style={styles.container}>
      {/* Título de sección */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        {breadcrumb && <Text style={styles.breadcrumb}>{breadcrumb}</Text>}
      </View>

      {/* Buscador global */}
      <View style={styles.searchWrapper}>
        <Icon name="search" size={15} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={searchValue}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Área de perfil */}
      <View style={styles.profileArea}>
        {/* Botón de notificaciones */}
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
          <Icon name="reports" size={16} color="#6B7280" />
        </TouchableOpacity>

        {/* Info del usuario */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userRole}>{userRole}</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};
