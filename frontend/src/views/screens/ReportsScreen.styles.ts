import {StyleSheet, Dimensions} from 'react-native';

/* ─── Paleta ─── */
export const TEAL        = '#0D9488';
export const TEAL_DARK   = '#0F766E';
export const TEAL_LIGHT  = '#F0FDFA';
export const AMBER       = '#D97706';
export const AMBER_LIGHT = '#FFFBEB';
export const INDIGO      = '#6366F1';
export const INDIGO_LIGHT = '#EEF2FF';
export const SUCCESS     = '#16A34A';
export const SUCCESS_LIGHT = '#F0FDF4';
export const DANGER      = '#EF4444';
export const DANGER_LIGHT = '#FEF2F2';
export const TEXT_MAIN   = '#1E293B';
export const TEXT_SECONDARY = '#475569';
export const TEXT_MUTED  = '#94A3B8';
export const BORDER      = '#E2E8F0';
export const BG_SURFACE  = '#FFFFFF';
export const BG_SECTION  = '#F8FAFC';

/* ─── Estilos ─── */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_SECTION,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },

  /* Banners */
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorBannerText: {
    color: DANGER,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },

  /* Card genérica */
  card: {
    backgroundColor: BG_SURFACE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_MAIN,
  },
  cardSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },

  /* Tab bar */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: BG_SECTION,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: TEAL,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  tabLabelActive: {
    color: BG_SURFACE,
  },

  /* ─── Gráfico de barras ─── */
  chartSection: {
    marginBottom: 14,
  },
  chartSectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: TEXT_MUTED,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  barLabel: {
    width: 90,
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  barTrack: {
    flex: 1,
    height: 22,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
    minWidth: 4,
  },
  barValue: {
    width: 88,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  chartDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 14,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 10,
  },
  resultLabel: {
    width: 90,
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_MAIN,
  },
  resultBarTrack: {
    flex: 1,
    height: 28,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  resultBarFill: {
    height: '100%',
    borderRadius: 8,
    minWidth: 4,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  resultBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultValue: {
    width: 88,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'right',
  },

  /* KPI cards */
  kpiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  kpiCardResult: {
    paddingVertical: 18,
  },
  kpiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  kpiHint: {
    fontSize: 11,
    marginTop: 2,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },
  kpiValueResult: {
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 8,
  },

  /* Chips */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG_SURFACE,
  },
  chipActive: {
    backgroundColor: TEAL_LIGHT,
    borderColor: '#CCFBF1',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  chipTextActive: {
    color: TEAL_DARK,
  },

  /* Form */
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  formColSmall: {
    flex: 1,
  },
  fieldLabel: {
    marginTop: 6,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },

  /* Botones */
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 12,
  },
  primaryButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 22,
  },
  primaryButtonText: {
    color: BG_SURFACE,
    fontSize: 14,
    fontWeight: '700',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG_SURFACE,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },

  /* Filtro info */
  filterInfo: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 8,
  },

  /* Lista de compras */
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  totalPillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEAL_DARK,
  },
  totalPillValue: {
    fontSize: 14,
    fontWeight: '800',
    color: TEAL_DARK,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 10,
    paddingTop: 6,
    marginBottom: 4,
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_MUTED,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tdDate: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: '500',
  },
  tdText: {
    fontSize: 13,
    color: TEXT_MAIN,
    paddingRight: 8,
  },
  tdAmount: {
    fontSize: 13,
    color: TEXT_MAIN,
    fontWeight: '700',
    textAlign: 'right',
  },
  detailButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TEAL_LIGHT,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },

  /* Estados vacíos */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_SECONDARY,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 20,
  },

  /* Modal */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 440,
    maxWidth: '92%',
    maxHeight: Math.round(Dimensions.get('window').height * 0.85),
    backgroundColor: BG_SURFACE,
    borderRadius: 14,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: BG_SECTION,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_MAIN,
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  notesBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: BG_SECTION,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 6,
  },
  notesText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: TEAL_LIGHT,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  totalRowLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: TEAL_DARK,
  },
  totalRowValue: {
    fontSize: 18,
    fontWeight: '800',
    color: TEAL_DARK,
  },
});
