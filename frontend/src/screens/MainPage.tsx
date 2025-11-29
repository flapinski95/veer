// src/screens/MainPage.js
import React from 'react';
import { View, Button } from 'react-native';
import MapView from '../components/Map';

// Dodajemy prop onLogout, która jest przekazywana z App.js
export default function MainPage({ onLogout }) {
  return (
    <View style={{ flex: 1 }}>
      <MapView />
      {/* Dodajemy przycisk wylogowania, umieszczając go np. na górze mapy */}
      <View style={{ position: 'absolute', bottom: 50, right: 10, zIndex: 10 }}>
        <Button title="Wyloguj" onPress={onLogout} />
      </View>
    </View>
  );
}