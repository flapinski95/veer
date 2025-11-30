import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { styles } from './RoutesExploreView.styles';

interface RoutesExploreViewProps {
  onCreateRoutePress: () => void; // Funkcja przełączająca tryb
}

export const RoutesExploreView: React.FC<RoutesExploreViewProps> = ({ onCreateRoutePress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Odkrywaj Trasy</Text>
        <TouchableOpacity style={styles.createButton} onPress={onCreateRoutePress}>
          <Text style={styles.createButtonText}>+ Nowa Trasa</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Placeholder listy tras */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Tutaj pojawią się Twoje zapisane trasy oraz propozycje wycieczek.</Text>
        </View>
        
        {/* Przykładowy element listy (mockup) */}
        <View style={styles.routeItem}>
           <Text style={styles.routeName}>Spacer po Starówce</Text>
           <Text style={styles.routeInfo}>2.5 km • 45 min</Text>
        </View>
      </ScrollView>
    </View>
  );
};

