/**
 * Punto de entrada de la aplicación SISDROG Desktop.
 * React Native Windows + TypeScript + arquitectura MVC.
 */

import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {HomeScreen, InventoryScreen, SalesScreen} from './src/views/screens';
import {Sidebar, TopHeader} from './src/views/components';
import type {AppScreen} from './src/views/components/Sidebar';

// Mapa de títulos por pantalla
const SCREEN_TITLES: Record<AppScreen, {title: string; breadcrumb: string}> = {
  home: {title: 'Inicio', breadcrumb: 'Panel principal'},
  sales: {title: 'Ventas (POS)', breadcrumb: 'Punto de venta'},
  inventory: {title: 'Inventario', breadcrumb: 'Control de stock'},
  purchases: {title: 'Compras', breadcrumb: 'Gestión de compras'},
  expenses: {title: 'Gastos', breadcrumb: 'Control de gastos'},
  reports: {title: 'Reportes', breadcrumb: 'Análisis y reportes'},
  settings: {title: 'Configuración', breadcrumb: 'Ajustes del sistema'},
};

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const screenInfo = SCREEN_TITLES[currentScreen];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'inventory':
        return <InventoryScreen onBack={() => setCurrentScreen('home')} />;
      case 'sales':
        return <SalesScreen />;
      case 'purchases':
      case 'expenses':
      case 'reports':
      case 'settings':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar
        activeScreen={currentScreen}
        onNavigate={setCurrentScreen}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded(prev => !prev)}
      />
      <View style={styles.content}>
        <TopHeader
          title={screenInfo.title}
          breadcrumb={screenInfo.breadcrumb}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Buscar productos, ventas..."
          userName="Admin"
          userRole="Administrador"
        />
        <View style={styles.screen}>{renderScreen()}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  screen: {
    flex: 1,
  },
});

export default App;
