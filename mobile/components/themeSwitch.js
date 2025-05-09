import React from 'react';
import { View, Switch, Text } from 'react-native';
import Colors from '../Colors';

export default function ThemeSwitch({ theme, setTheme }) {
  const isDark = theme === Colors.dark;

  const toggleTheme = () => {
    setTheme(isDark ? Colors.light : Colors.dark);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 50 }}>
      <Text style={{ marginRight: 10, fontSize: 16 }}>
        {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? "#ffffff" : "#000000"}
        trackColor={{ false: "#ccc", true: "#666" }}
      />
    </View>
  );
}