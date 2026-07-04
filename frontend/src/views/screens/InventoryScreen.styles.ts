/**
 * Estilos para la pantalla de inventario (rediseño v2).
 */

import {StyleSheet} from 'react-native';

export const PRIMARY = '#00685F';
export const PRIMARY_LIGHT = '#0083781A';
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

  /* ─── Header ─── */
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 26,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 8,
    shadowColor: PRIMARY,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* ─── Barra de búsqueda ─── */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_MAIN,
    paddingVertical: 0,
  },

  /* ─── Tabla ─── */
  tableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
    zIndex: 1,            // <-- debajo del filterBar
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerCellText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cellText: {
    fontSize: 13,
    color: TEXT_MAIN,
    fontWeight: '500',
  },
  cellTextBold: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_MAIN,
  },
  cellMuted: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },

  /* ─── Columnas (7 columnas) ─── */
  colCode:     {flex: 1.2},
  colName:     {flex: 2.5},
  colCategory: {flex: 1.8},
  colStock:    {flex: 1.6, alignItems: 'center'},
  colExpiry:   {flex: 1.4, alignItems: 'center'},
  colPrice:    {flex: 1.2, alignItems: 'flex-end'},
  colActions:  {flex: 1.3, alignItems: 'center'},

  /* ─── Stock (número + badge inline) ─── */
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_MAIN,
  },
  stockBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stockBadgeGreen:      {backgroundColor: '#ECFDF5'},
  stockBadgeYellow:     {backgroundColor: '#FFFBEB'},
  stockBadgeRed:        {backgroundColor: '#FEF2F2'},
  stockBadgeTextGreen:  {color: '#059669', fontSize: 10, fontWeight: '800'},
  stockBadgeTextYellow: {color: '#D97706', fontSize: 10, fontWeight: '800'},
  stockBadgeTextRed:    {color: '#DC2626', fontSize: 10, fontWeight: '800'},

  /* ─── Origen tag ─── */
  originTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  originText: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: '500',
  },

  /* ─── Acciones ─── */
  actionsContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },

  /* ─── Paginación ─── */
  paginationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: '#FAFBFC',
  },
  paginationInfo: {
    fontSize: 13,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
  },
  pageButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MAIN,
  },
  pageButtonTextActive: {
    color: '#FFFFFF',
  },
  pageEllipsis: {
    fontSize: 13,
    color: TEXT_MUTED,
    paddingHorizontal: 4,
    fontWeight: '600',
  },

  /* ─── Estados vacío / error ─── */
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
