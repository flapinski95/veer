import React from 'react';
import { View } from 'react-native';
import MapView from '../components/Map';

export default function MainPage() {
  return (
    <View style={{ flex: 1 }}>
      <MapView />
    </View>
  );
}