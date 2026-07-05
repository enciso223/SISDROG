/**
 * Estilos para el Sidebar de navegación.
 */

import {StyleSheet} from 'react-native';

export const SIDEBAR_EXPANDED_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 68;

export const sidebarStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingVertical: 20,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  containerExpanded: {
    width: SIDEBAR_EXPANDED_WIDTH,
  },
  containerCollapsed: {
    width: SIDEBAR_COLLAPSED_WIDTH,
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  /* ─── Marca ─── */
  brand: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  brandLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  brandIconCollapsed: {
    alignSelf: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },

  /* ─── Menú ─── */
  menu: {
    flex: 1,
    gap: 2,
  },

  /* ─── Ítem ─── */
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 2,
  },
  itemExpanded: {
    paddingVertical: 11,
    paddingHorizontal: 10,
  },
  itemCollapsed: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    justifyContent: 'center',
    width: 48,
    alignSelf: 'center',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContentCollapsed: {
    justifyContent: 'center',
  },
  itemHovered: {
    backgroundColor: '#F3F4F6',
  },
  itemPressed: {
    backgroundColor: '#E9ECF0',
  },
  itemActive: {
    backgroundColor: '#F0FDFA',
    borderLeftWidth: 3,
    borderLeftColor: '#0D9488',
  },
  itemActiveCollapsed: {
    backgroundColor: '#F0FDFA',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },

  /* ─── Etiqueta ─── */
  label: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  labelHovered: {
    color: '#111827',
  },
  labelActive: {
    color: '#0F766E',
    fontWeight: '700',
  },

  /* ─── Punto activo (modo colapsado) ─── */
  activeDot: {
    position: 'absolute',
    right: -2,
    top: '50%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0D9488',
    marginTop: -3,
  },

  /* ─── Footer: botón toggle ─── */
  footer: {
    marginTop: 16,
    paddingHorizontal: 0,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleButtonExpanded: {
    paddingHorizontal: 12,
    gap: 8,
  },
  toggleButtonCollapsed: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    alignSelf: 'center',
  },
  toggleButtonHovered: {
    backgroundColor: '#F3F4F6',
  },
  toggleButtonPressed: {
    backgroundColor: '#E5E7EB',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});
