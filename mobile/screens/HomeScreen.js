import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSwitch from '../components/themeSwitch';
import Tip from '../components/tip'

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <ThemeSwitch />
      <Text style={{ color: colors.text, fontSize: 24 }}>Home Screen</Text>
      <Tip />
    </View>
  );
}