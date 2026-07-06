/**
 * Modal de advertencia de expiración de sesión.
 *
 * Se muestra WARNING_BEFORE_MS antes de que la sesión expire por inactividad.
 * Permite al usuario continuar (reinicia el conteo) o cerrar sesión ahora.
 */

import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface SessionTimeoutModalProps {
  visible: boolean;
  remainingMs: number;
  onContinue: () => void;
  onLogout: () => void;
}

const formatSeconds = (ms: number): string => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const mm = Math.floor(s / 60).toString().padStart(2, '0');
  const ss = (s % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
};

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  visible,
  remainingMs,
  onContinue,
  onLogout,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onLogout}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Tu sesión está por expirar</Text>
          <Text style={styles.subtitle}>
            Por seguridad, cerraremos tu sesión por inactividad en:
          </Text>
          <Text style={styles.timer}>{formatSeconds(remainingMs)}</Text>
          <Text style={styles.hint}>
            ¿Deseas seguir conectado?
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.secondary]}
              onPress={onLogout}
              activeOpacity={0.85}>
              <Text style={styles.secondaryText}>Cerrar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.primary]}
              onPress={onContinue}
              activeOpacity={0.85}>
              <Text style={styles.primaryText}>Seguir conectado</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  timer: {
    fontSize: 36,
    fontWeight: '800',
    color: '#DC2626',
    textAlign: 'center',
    marginVertical: 12,
    letterSpacing: 2,
  },
  hint: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#0078D4',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  secondary: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
});
