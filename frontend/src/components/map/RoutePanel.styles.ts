import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // Ustawiamy panel tak, że wystaje tylko nagłówek.
    // Dajemy duży margines na dole, a Animated wyciąga go w górę.
    bottom: -(SCREEN_HEIGHT * 0.55) + 170, 
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    zIndex: 100,
  },
  // Reszta stylów bez zmian (możesz skopiować z poprzedniej odpowiedzi)
  handleContainer: {
    width: '100%',
    height: 30, // To jest nasza "bezpieczna strefa" dotyku
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  // ... reszta stylów (content, header, listContainer, footer itd.)
  content: { flex: 1 },
  tempPointBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  tempText: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  addButton: { 
    backgroundColor: '#007AFF', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20 
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 5,
  },
  statBox: { alignItems: 'center', width: '40%' },
  statLabel: { fontSize: 11, color: '#888', fontWeight: 'bold', marginBottom: 2 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  divider: { width: 1, height: 30, backgroundColor: '#eee' },

  listContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginBottom: 1, 
  },
  pointIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  startIndex: { backgroundColor: '#34C759' },
  stopIndex: { backgroundColor: '#FF3B30' },
  pointIndexText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  pointName: { flex: 1, fontSize: 15, color: '#333' },
  
  actions: { flexDirection: 'row' },
  actionBtn: { padding: 8 },
  arrow: { fontSize: 16, color: '#007AFF' },
  deleteBtn: { padding: 8, marginLeft: 5 },
  deleteText: { fontSize: 16, color: '#FF3B30', fontWeight: 'bold' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5,
  },
  counterText: { color: '#888', fontWeight: 'bold', marginLeft: 10 },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  disabledButton: { backgroundColor: '#ccc' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});