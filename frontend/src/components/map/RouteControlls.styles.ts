import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20, // Ważne, żeby było nad mapą
  },

  // --- Przycisk "+ Dodaj punkt" ---
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },

  // --- Pasek z akcjami (Cofnij | Licznik | Zapisz) ---
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  
  // Małe przyciski w pasku
  smallBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  btnUndo: {
    backgroundColor: '#f2f2f2',
  },
  btnSave: {
    backgroundColor: '#34C759', // Zielony iOS
  },
  smallBtnText: {
    fontWeight: 'bold',
    color: '#333', // Dla btnSave można zmienić na white w razie potrzeby
  },

  // Licznik punktów pośrodku
  counterContainer: {
    paddingHorizontal: 15,
    minWidth: 80,
    alignItems: 'center',
  },
  counterText: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 16,
  },
});