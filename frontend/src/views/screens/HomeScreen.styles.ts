import {StyleSheet} from 'react-native';

export const PRIMARY = '#007AFF'; // O el color principal de tu app

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  modulesRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  dashboardGrid: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  // Historial de Ventas
  salesList: {
    maxHeight: 320,
  },
  saleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  saleInfo: {
    flex: 1,
  },
  saleId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  saleDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  saleTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  // Valor de Inventario
  inventoryValueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  inventoryValueText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  inventoryValueSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  // Ranking
  rankingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankingName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  rankingQty: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  chipActive: {
    backgroundColor: PRIMARY,
  },
  chipText: {
    fontSize: 12,
    color: '#4B5563',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
