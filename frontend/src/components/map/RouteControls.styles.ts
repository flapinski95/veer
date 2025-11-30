import { StyleSheet, Platform } from 'react-native';

const SHADOW_COLOR = '#000';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  // --- SCENARIUSZ A: PRZYCISK DODAWANIA (Floating Pill) ---
  addButton: {
    backgroundColor: '#007AFF', // Systemowy niebieski
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 100, // Idealna pigułka
    
    // Miękki, nowoczesny cień
    elevation: 8,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // --- SCENARIUSZ B: PASEK AKCJI (Floating Bar) ---
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 100, // Kapsuła
    paddingVertical: 6,
    paddingHorizontal: 8,
    
    // Cień unoszący pasek nad mapę
    elevation: 10,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)', // Subtelna granica
  },
  
  // Przycisk "Cofnij" (Subtelny)
  btnUndo: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F2F2F7', // Jasne tło
    marginRight: 8,
  },
  btnUndoText: {
    fontWeight: '600',
    color: '#8E8E93', // Szary tekst
    fontSize: 14,
  },

  // Środkowa sekcja (Licznik)
  counterContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Linie oddzielające (Vertical Dividers)
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E5EA',
    height: '60%', // Nie na całą wysokość
  },
  counterText: {
    fontWeight: '800',
    color: '#1C1C1E', // Prawie czarny
    fontSize: 16,
    fontVariant: ['tabular-nums'], // Stała szerokość cyfr (nie skaczą)
  },

  // Przycisk "Zapisz" (Główny)
  btnSave: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24, // Bardziej okrągły
    backgroundColor: '#34C759', // Zielony sukcesu
    marginLeft: 8,
    
    // Delikatny cień wewnętrzny przycisku
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  btnSaveText: {
    fontWeight: '700',
    color: 'white',
    fontSize: 14,
  },
});