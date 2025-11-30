import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120, // Odsunięcie od góry (pod SearchBoxem)
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Nowoczesne zaokrąglenie
    paddingVertical: 16, // Więcej oddechu w pionie
    paddingHorizontal: 10,
    
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    
    // Miękki, nowoczesny cień (Floating Effect)
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    
    zIndex: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)', // Subtelna ramka
  },
  
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  
  // Małe etykiety (np. DYSTANS)
  label: {
    fontSize: 11,
    color: '#8E8E93', // Systemowy szary
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8, // Szersze litery dla czytelności małego tekstu
    marginBottom: 4,
  },
  
  // Wartości (np. 1.5 km)
  value: {
    fontSize: 20,
    fontWeight: '800', // Bardzo gruby font
    color: '#1C1C1E',  // Prawie czarny
    letterSpacing: -0.5, // Ciaśniejsze cyfry wyglądają nowocześniej
  },
  
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E5EA', // Bardzo jasny separator
  },
});