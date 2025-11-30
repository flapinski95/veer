import { StyleSheet, Platform } from 'react-native';

const SHADOW_COLOR = '#000';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // --- MARKERY GŁÓWNE (Start/Stop) ---
  // Styl: Duże, wyraźne, z efektem "wypukłości"
  routePointContainer: {
    width: 40,
    height: 40,
    borderRadius: 20, // Idealne koło
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF', // Biała ramka oddziela od tła mapy
    
    // Cień rzucany na mapę
    elevation: 8,
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 10,
  },
  
  // Kolory
  startPoint: { backgroundColor: '#34C759' }, // Vibrant Green
  stopPoint: { backgroundColor: '#007AFF' },  // Vibrant Blue
  
  routePointText: {
    color: '#FFFFFF',
    fontWeight: '800', // Extra Bold dla czytelności numerka
    fontSize: 15,
    includeFontPadding: false, // Fix dla pionowego wyrównania na Androidzie
  },

  // --- PUNKTY POŚREDNIE (VIA - "Uchwyty") ---
  // Styl: Minimalistyczne, białe z kolorową obwódką
  viaPointContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#5856D6', // Indigo/Purple - odróżnia się od trasy
    
    elevation: 4,
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    zIndex: 5,
  },
  
  // Styl podczas przeciągania (Powiększenie + zmiana koloru)
  viaPointDragging: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 4,
    borderColor: '#34C759', // Zielony = "Aktywny/Dobry"
    transform: [{ scale: 1.1 }], // Dodatkowy pop
    zIndex: 20, // Zawsze na wierzchu podczas ruchu
  },

  // --- TYMCZASOWY MARKER (Szpilka) ---
  tempMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30', // System Red
    borderWidth: 3,
    borderColor: '#FFFFFF',
    
    elevation: 6,
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // --- ATRAKCJE (POI) ---
  attractionMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#AF52DE', // Purple
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    
    elevation: 5,
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },

  // --- PRZYCISK LOKALIZACJI (FAB) ---
  myLocationButton: {
    position: 'absolute',
    bottom: 120, // Unosimy nad dolny panel
    right: 20,
    
    width: 56, // Standardowy rozmiar FAB (Floating Action Button)
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    
    justifyContent: 'center',
    alignItems: 'center',
    
    // Mocny cień, żeby przycisk "pływał" wysoko nad mapą
    elevation: 10,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 10,
  },
  
  myLocationText: {
    fontSize: 26,
    color: '#007AFF', // Blue tint
    fontWeight: '700',
    // Delikatna korekta optyczna dla strzałki
    marginTop: Platform.OS === 'ios' ? -2 : 0, 
    transform: [{ rotate: '-45deg' }],
  },

  // --- OVERLAY ŁADOWANIA ---
  // Styl "Glassmorphism" (lekkie przeźroczystość)
  loadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -32, // Połowa szerokości
    marginTop: -32,
    width: 64,
    height: 64,
    
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
});