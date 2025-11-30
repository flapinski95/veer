import { StyleSheet, Platform } from 'react-native';

const SHADOW_COLOR = '#000';

export const styles = StyleSheet.create({
  // Główny kontener (niewidoczny, tylko pozycjonuje elementy)
  container: {
    position: 'absolute',
    top: 60, // Odsunięcie od góry (Safe Area)
    left: '5%', // Margines z lewej
    width: '90%', // Szerokość całkowita
    zIndex: 50, // Bardzo wysoki z-index, żeby przykryć mapę
    backgroundColor: 'transparent', // Ważne: żeby nie było "białego tła" pod spodem
  },

  // --- PASEK WYSZUKIWANIA (INPUT) ---
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // Pełne zaokrąglenie (pill shape)
    height: 50,
    
    // Nowoczesny cień (Floating effect)
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8, // Android shadow

    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)', // Subtelna granica
  },
  
  // Input tekstowy
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E', // Prawie czarny
  },
  
  // Kontener na ikonę X / Loading
  iconContainer: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Przycisk czyszczenia (małe kółko)
  clearButton: {
    backgroundColor: '#E5E5EA', // Systemowy szary iOS
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8E8E93',
    marginTop: -1, // Optyczna korekta środka
  },

  // --- LISTA WYNIKÓW (FLOATING CARD) ---
  resultsBox: {
    position: 'absolute', // Wyjmujemy z przepływu, żeby nie rozpychało
    top: 60, // Zaczyna się 10px pod paskiem (50px wysokość paska + 10px margines)
    left: 0,
    right: 0,
    
    maxHeight: 300, // Limit wysokości
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    
    // Osobny cień dla listy
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    
    overflow: 'hidden', // Żeby dzieci nie wychodziły poza zaokrąglenia
  },

  // Pojedynczy wiersz wyniku
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7', // Bardzo jasny separator
  },
  
  // Tekst wyniku
  resultText: {
    fontSize: 15,
    color: '#1C1C1E',
    flex: 1, // Zajmij całe miejsce
  },
  
  // Podtytuł (adres)
  resultSubText: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },

  // --- HISTORIA ---
  historyHeader: {
    backgroundColor: '#F9F9F9', // Lekko szare tło nagłówka
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  historyHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});