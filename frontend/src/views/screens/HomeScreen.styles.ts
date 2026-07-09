import {StyleSheet} from 'react-native';

// ── Paleta consistente con el resto de la app ────────────────────
export const TEAL        = '#0D9488';
export const TEAL_DARK   = '#0F766E';
export const TEAL_LIGHT  = '#F0FDFA';
export const AMBER       = '#D97706';
export const AMBER_LIGHT = '#FFFBEB';
export const INDIGO      = '#6366F1';
export const INDIGO_LIGHT = '#EEF2FF';
export const SUCCESS     = '#16A34A';
export const DANGER      = '#EF4444';
export const TEXT_MAIN   = '#1E293B';
export const TEXT_SECONDARY = '#475569';
export const TEXT_MUTED  = '#94A3B8';
export const BORDER      = '#E2E8F0';
export const BG_SURFACE  = '#FFFFFF';
export const BG_SECTION  = '#F8FAFC';

export const homeStyles = StyleSheet.create({
  // ── Contenedor ─────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: BG_SECTION,
  },

  // ── Hero Header ─────────────────────────────────────────────────
  hero: {
    backgroundColor: '#0F172A',
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  heroGreeting: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  heroAccentLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: TEAL,
    marginTop: 14,
  },

  // ── Wrapper de contenido ────────────────────────────────────────
  contentWrapper: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_MUTED,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 14,
    marginLeft: 2,
  },
  dashboardGrid: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
    marginBottom: 28,
  },

  // ── Card base ───────────────────────────────────────────────────
  card: {
    backgroundColor: BG_SURFACE,
    borderRadius: 14,
    padding: 20,
    flex: 1,
    minWidth: 300,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  // ── Card header ─────────────────────────────────────────────────
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconWrapTeal:   {backgroundColor: TEAL_LIGHT},
  cardIconWrapIndigo: {backgroundColor: INDIGO_LIGHT},
  cardIconWrapAmber:  {backgroundColor: AMBER_LIGHT},

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_MAIN,
    flex: 1,
  },
  cardBadge: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: '500',
    backgroundColor: BG_SECTION,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
  },

  // ── Historial de Ventas ─────────────────────────────────────────
  salesList: {
    maxHeight: 340,
  },
  saleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  saleLeftDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: TEAL,
    flexShrink: 0,
  },
  saleInfo: {
    flex: 1,
  },
  saleId: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MAIN,
  },
  saleDate: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  saleTotalWrap: {
    backgroundColor: TEAL_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  saleTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: TEAL_DARK,
  },

  // ── Ranking ─────────────────────────────────────────────────────
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  rankingBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: INDIGO_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rankingBadgeTop: {
    backgroundColor: AMBER_LIGHT,
  },
  rankingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: INDIGO,
  },
  rankingBadgeTextTop: {
    color: AMBER,
  },
  rankingName: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    flex: 1,
  },
  rankingQtyWrap: {
    backgroundColor: BG_SECTION,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: BORDER,
  },
  rankingQty: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_MAIN,
  },

  // ── Chips de período ────────────────────────────────────────────
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: BG_SECTION,
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  chipText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // ── Inventario ──────────────────────────────────────────────────
  inventoryValueContainer: {
    gap: 12,
  },
  inventoryMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BG_SECTION,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  inventoryMetricLabel: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontWeight: '500',
    marginBottom: 4,
  },
  inventoryMetricValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  inventoryMetricIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inventoryMetricIconTeal:  {backgroundColor: TEAL_LIGHT},
  inventoryMetricIconIndigo: {backgroundColor: INDIGO_LIGHT},
  inventoryMetricValueTeal:  {color: TEAL_DARK},
  inventoryMetricValueIndigo: {color: INDIGO},

  // ── Estado vacío ────────────────────────────────────────────────
  emptyText: {
    color: TEXT_MUTED,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
  },
});
