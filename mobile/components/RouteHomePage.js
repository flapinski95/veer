import React from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import styles from '../styles/styles';

export default function RouteHomePage() {
  const test_tip_name = 'Route 1';
  const test_tip_user = 'User';

  return (
    <View style={{padding: '4px'}}>
      <View
        style={{padding: '4px', display: 'flex', justify_content: 'center'}}>
        <Text>{test_tip_name}</Text>
        <Text>{test_tip_user}</Text>
      </View>
      <View
        style={{
          backgroundColor: 'red',
          width: '400px',
          height: '400px',
        }}></View>
      <View style={styles.fixToText}>
        <Button
          title="Like"
          onPress={() => Alert.alert('Left button pressed')}
        />
        <Button
          title="Dislike"
          onPress={() => Alert.alert('Right button pressed')}
        />
      </View>
    </View>
  );
}
