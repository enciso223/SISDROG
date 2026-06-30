/**
 * Estilos para la pantalla de inventario.
 */

import {StyleSheet} from 'react-native';

export const PRIMARY = '#00685F';
export const PRIMARY_LIGHT = '#0083781A'; // 0.1 opacity
export const TEXT_MAIN = '#3D4947';
export const TEXT_MUTED = '#6B7280';
export const BG_COLOR = '#F7F9FB';
export const BORDER = '#E2E8F0';

export const inventoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    padding: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_MAIN,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: 300,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_MAIN,
    marginLeft: 10,
    paddingVertical: 0,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 8,
    shadowColor: PRIMARY,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  
  /* ─── Tabla ─── */
  tableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerCellText: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowHover: {
    backgroundColor: PRIMARY_LIGHT,
  },
  cellText: {
    fontSize: 14,
    color: TEXT_MAIN,
    fontWeight: '500',
  },
  cellTextBold: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_MAIN,
  },
  cellMuted: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  
  /* ─── Columnas ─── */
  colCode: { flex: 1.5 },
  colName: { flex: 3 },
  colCategory: { flex: 2 },
  colStock: { flex: 1.5, alignItems: 'center' },
  colPrice: { flex: 1.5, alignItems: 'flex-end' },
  colActions: { flex: 1, alignItems: 'center' },

  /* ─── Badges ─── */
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockBadgeGreen: { backgroundColor: '#ECFDF5' },
  stockBadgeYellow: { backgroundColor: '#FFFBEB' },
  stockBadgeRed: { backgroundColor: '#FEF2F2' },
  stockBadgeTextGreen: { color: '#059669', fontSize: 12, fontWeight: '700' },
  stockBadgeTextYellow: { color: '#D97706', fontSize: 12, fontWeight: '700' },
  stockBadgeTextRed: { color: '#DC2626', fontSize: 12, fontWeight: '700' },

  /* ─── Acciones ─── */
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  actionButtonEdit: {
    color: PRIMARY,
  },
  actionButtonDelete: {
    color: '#EF4444',
  },

  /* ─── Estados ─── */
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_MAIN,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});
