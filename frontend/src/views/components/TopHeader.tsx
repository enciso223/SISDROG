/**
 * Componente visual reutilizable: Barra superior con título, búsqueda y perfil.
 * Los estilos están en TopHeader.styles.ts
 */

import React, {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, Alert} from 'react-native';
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
  onLogout?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title = 'SISDROG',
  breadcrumb,
  searchValue,
  onSearchChange,
  placeholder = 'Buscar productos, ventas...',
  userName = 'Usuario',
  userRole = 'Administrador',
  onLogout,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogoutPress = () => {
    setMenuVisible(false);
    Alert.alert('Cerrar sesión', '¿Desea cerrar sesión?', [
      {text: 'No', style: 'cancel'},
      {text: 'Sí', onPress: onLogout},
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Título de sección */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        {breadcrumb && <Text style={styles.breadcrumb}>{breadcrumb}</Text>}
      </View>



      {/* Área de perfil */}
      <View style={styles.profileArea}>

        {/* Info del usuario */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userRole}>{userRole}</Text>
        </View>

        {/* Avatar */}
        <View style={{position: 'relative'}}>
          <TouchableOpacity
            style={styles.avatar}
            activeOpacity={0.7}
            onPress={() => setMenuVisible(!menuVisible)}>
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>

          {menuVisible && (
            <View style={styles.popoverMenu}>
              <TouchableOpacity
                style={styles.popoverItem}
                onPress={handleLogoutPress}>
                <Text style={styles.popoverItemText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
