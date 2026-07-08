/**
 * Punto de entrada de la aplicación SISDROG Desktop.
 * React Native Windows + TypeScript + arquitectura MVC.
 *
 * Flujo de navegación:
 *   login → (registro opcional) → dashboard (sidebar + pantallas)
 *
 * Seguridad de sesión:
 *   - Detecta actividad (touch, teclado, scroll) para reiniciar el timer.
 *   - Muestra modal de advertencia 1 min antes de expirar.
 *   - Cierra sesión automáticamente por inactividad (15 min).
 *   - Al cerrar sesión limpia token de memoria vía authService.logout().
 */

import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  HomeScreen,
  InventoryScreen,
  SalesScreen,
  ExpensesScreen,
  ReportsScreen,
  LoginScreen,
  RegisterScreen,
} from './src/views/screens';
import {
  Sidebar,
  TopHeader,
  SessionTimeoutModal,
} from './src/views/components';
import type {AppScreen} from './src/views/components/Sidebar';
import {useSession} from './src/controllers';
import {authService} from './src/services';
import {sessionManager} from './src/security';

// ── Tipos de pantallas de auth ────────────────────────────────────────────
type AuthScreen = 'login' | 'register';

// ── Mapa de títulos por pantalla del dashboard ───────────────────────────
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
  // ── Estado de autenticación ──────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  // ── Estado del dashboard ─────────────────────────────────────────────
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // ── Cierre de sesión (manual o por expiración) ───────────────────────
  const handleLogout = useCallback(() => {
    // Limpia token en memoria y llama al backend (fire-and-forget).
    void authService.logout();
    setIsAuthenticated(false);
    setCurrentScreen('home');
  }, []);

  // ── Gestor de sesión: warning + auto-logout por inactividad ─────────
  const {showWarning, remainingMs, extendSession} = useSession({
    enabled: isAuthenticated,
    onExpire: handleLogout,
  });

  // ── Handlers de auth ─────────────────────────────────────────────────
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    setAuthScreen('login');
  };

  // Cualquier interacción con la app cuenta como actividad
  const trackActivity = useCallback(() => {
    if (isAuthenticated) {
      sessionManager.registerActivity();
    }
  }, [isAuthenticated]);

  // ── Renderizado condicional: auth vs dashboard ───────────────────────
  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => setAuthScreen('login')}
        />
      );
    }
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setAuthScreen('register')}
      />
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────
  const screenInfo = SCREEN_TITLES[currentScreen];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'inventory':
        return <InventoryScreen onBack={() => setCurrentScreen('home')} />;
      case 'sales':
        return <SalesScreen />;
      case 'expenses':
        return <ExpensesScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'purchases':
      case 'settings':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => {trackActivity(); return false;}}
      onResponderMove={trackActivity}>
      <Sidebar
        activeScreen={currentScreen}
        onNavigate={s => {trackActivity(); setCurrentScreen(s);}}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => {trackActivity(); setIsSidebarExpanded(prev => !prev);}}
      />
      <View style={styles.content}>
        <View style={{zIndex: 10, elevation: 10}}>
          <TopHeader
            title={screenInfo.title}
            breadcrumb={screenInfo.breadcrumb}
            searchValue={searchQuery}
            onSearchChange={v => {trackActivity(); setSearchQuery(v);}}
            placeholder="Buscar productos, ventas..."
            userName="Admin"
            userRole="Administrador"
            onLogout={handleLogout}
          />
        </View>
        <View style={styles.screen}>{renderScreen()}</View>
      </View>

      {/* Modal de expiración de sesión por inactividad */}
      <SessionTimeoutModal
        visible={showWarning}
        remainingMs={remainingMs}
        onContinue={extendSession}
        onLogout={handleLogout}
      />
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
