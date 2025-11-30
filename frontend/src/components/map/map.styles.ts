import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // --- Punkty ---
  routePointContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  
  // Zielony dla START
  startPoint: {
    backgroundColor: '#34C759', 
  },
  // Niebieski/Czerwony dla STOP
  stopPoint: {
    backgroundColor: '#007AFF', 
  },
  
  routePointText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  tempMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B30',
    borderWidth: 3,
    borderColor: 'white',
  },

  // Atrakcje (Fioletowe małe kropki)
  attractionMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#AF52DE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    elevation: 3,
  },

  // --- Overlay ładowania ---
  loadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
  },

  // Przycisk lokalizacji (bez zmian)
  myLocationButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },
  myLocationText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
    transform: [{ rotate: '-45deg' }],
  },
});