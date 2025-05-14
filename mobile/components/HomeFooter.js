import React from 'react';
import {View, Text, Button, Alert} from 'react-native';
import styles from '../styles/styles';

export default function HomeFooter() {
  return (
    <View  style={styles.buttonRow}>
      <Button
        title="Saved"
        onPress={() => Alert.alert('Left button pressed')}
      />
      <Button
        title="Add"
        onPress={() => Alert.alert('Middle button pressed')}
      />
      <Button
        title="Home"
        onPress={() => Alert.alert('Right button pressed')}
      />
    </View>
  );
}
