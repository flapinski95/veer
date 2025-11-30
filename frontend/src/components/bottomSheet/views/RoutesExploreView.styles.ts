import { StyleSheet, Dimensions, Platform } from 'react-native';
export const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#1C1C1E' },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 100,
  },
  createButtonText: { color: 'white', fontWeight: '700', fontSize: 14 },
  
  content: { flex: 1 },
  emptyState: { padding: 20, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#8E8E93', textAlign: 'center' },
  
  routeItem: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },
  routeName: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  routeInfo: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
});