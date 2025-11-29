import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapView from '../components/Map';

export default function MainPage({ onLogout }) {
  return (
    <View style={styles.container}>
      <MapView />
      {/* Przycisk wylogowania w prawym dolnym rogu */}
      <View style={styles.logoutButtonContainer}>
        <Button title="Wyloguj" onPress={onLogout} color="#FF3B30" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoutButtonContainer: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        zIndex: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    }
})