import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import MapView from '../components/map/Map';

export default function MainPage({ onLogout }) {
  return (
    <View style={styles.container}>
      {/* Mapa na pełnym ekranie */}
      <MapView />

      {/* Przycisk Wyloguj (Floating Pill) */}
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={onLogout}
          activeOpacity={0.8}
        >
          {/* Opcjonalnie: Możesz tu dodać ikonę zamiast tekstu */}
          <Text style={styles.logoutText}>Wyloguj</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Tło pod mapą
  },
  
  // SafeAreaView zapewnia, że przycisk nie wjedzie na zegarek/notcha
  safeArea: {
    position: 'absolute',
    bottom: 20,
    right: 20, // Lewy róg jest zazwyczaj wolny w mapach
    zIndex: 90, // Wyższy niż mapa, ale niższy niż modal
  },

  logoutButton: {
    marginTop: Platform.OS === 'android' ? 60 : 10, // Dostosowanie do SearchBoxa (top: 60)
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20, // Kształt pigułki
    
    // Nowoczesny cień (Floating Effect)
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    color: '#FF3B30', // Czerwony (standard dla akcji destrukcyjnych/wylogowania)
    fontWeight: '700',
    fontSize: 14,
  },
});