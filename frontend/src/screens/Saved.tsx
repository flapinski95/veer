import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function Saved() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text, fontSize: 22 }}>Saved</Text>
    </View>
  );
}