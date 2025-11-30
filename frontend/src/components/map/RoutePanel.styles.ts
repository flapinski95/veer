import { StyleSheet, Dimensions, Platform } from 'react-native';

const SHADOW_COLOR = '#000';

export const styles = StyleSheet.create({
  // --- GŁÓWNY KONTENER ---
  container: {
    position: 'absolute',
    // Ustawiamy panel na dole ekranu.
    // -20 pozwala ukryć dolne zaokrąglenie (wygląda jakby wychodził z ramki telefonu)
    bottom: -20, 
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    
    // Cień rzucany w górę
    elevation: 24,
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    zIndex: 100,
    // Padding na dole (dla iPhone X/11/etc z paskiem home)
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, 
  },
  
  // --- UCHWYT ---
  handleContainer: {
    width: '100%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  handleBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
  },

  // --- SEKCJA TEMP POINT ---
  tempPointBar: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  tempInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cancelBtnText: {
    color: '#8E8E93',
    fontWeight: '700',
    fontSize: 14,
  },
  tempText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },

  // --- CONTENT ---
  content: {
    flex: 1,
  },

  // --- STATYSTYKI ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    marginHorizontal: 24,
  },
  statBox: { 
    alignItems: 'center',
    minWidth: 80,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E5EA',
  },

  // --- LISTA ---
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  pointIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  startIndex: { backgroundColor: '#34C759' },
  stopIndex: { backgroundColor: '#FF3B30' },
  
  pointIndexText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  pointIndexTextWhite: { 
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  pointName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    padding: 8,
  },
  arrow: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '800',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF3B30',
  },

  // --- FOOTER ---
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24, 
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
  saveButton: {
    backgroundColor: '#34C759', 
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 100,
    shadowColor: '#34C759',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#E5E5EA',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});