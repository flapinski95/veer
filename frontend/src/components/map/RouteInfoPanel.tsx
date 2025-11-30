import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './RouteInfoPanel.styles';

interface RouteInfoPanelProps {
  distance: number; // metry
  duration: number; // sekundy
}

export const RouteInfoPanel: React.FC<RouteInfoPanelProps> = ({ distance, duration }) => {
  // Konwersja
  const distKm = (distance / 1000).toFixed(2);
  
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  // Formatowanie czasu: np. "1h 20min" lub "45 min"
  const timeString = hours > 0 
    ? `${hours}h ${minutes}min` 
    : `${minutes} min`;

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