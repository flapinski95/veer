import React from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import styles from '../styles/styles';

export default function RouteHomePage() {
  const test_tip_name = 'Route 1';
  const test_tip_user = 'User';

  return (
    <View style={{padding: '4px'}}>
      <View style={styles.boxRow}>
        <Text>{test_tip_name}</Text>
        <Text>{test_tip_user}</Text>
      </View>
      <View
        style={{
          backgroundColor: 'red',
          width: '100%',
          padding: 16,
        }}>Mapa</View>
    </View>
  );
}
