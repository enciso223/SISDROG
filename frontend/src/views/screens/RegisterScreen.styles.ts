/**
 * Estilos: Pantalla de registro — minimalista.
 * Reutiliza la misma paleta que LoginScreen.
 */

import {StyleSheet} from 'react-native';

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 36,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // ── Encabezado ────────────────────────────────────────────────────
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0078D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 28,
  },

  // ── Campos ────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  inputFocused: {
    borderColor: '#0078D4',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  fieldError: {
    marginTop: 4,
    fontSize: 11,
    color: '#EF4444',
  },

  // ── Botón ─────────────────────────────────────────────────────────
  button: {
    height: 44,
    backgroundColor: '#0078D4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ── Banners ───────────────────────────────────────────────────────
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  errorBoxText: {
    fontSize: 12,
    color: '#DC2626',
  },
  successBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  successBoxText: {
    fontSize: 12,
    color: '#16A34A',
  },

  // ── Enlace inferior ───────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0078D4',
  },
});
