import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RouteInfoPanelProps {
  distance: number; // metry
  duration: number; // sekundy
}

export const RouteInfoPanel: React.FC<RouteInfoPanelProps> = ({ distance, duration }) => {
  // Konwersja
  const distKm = (distance / 1000).toFixed(2);
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  const timeString = hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.label}>Dystans</Text>
        <Text style={styles.value}>{distKm} km</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Text style={styles.label}>Czas</Text>
        <Text style={styles.value}>{timeString}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100, // Pod searchboxem (lub nad nim, zależnie od layoutu)
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 15,
  },
  statItem: { alignItems: 'center' },
  label: { fontSize: 12, color: '#888', textTransform: 'uppercase' },
  value: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  divider: { width: 1, height: '80%', backgroundColor: '#eee' },
});