import React from 'react';
import {View, Switch, Text} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';

export default function ThemeSwitch() {
  const {theme, colors, toggleTheme} = useTheme();
  const isDark = theme === 'dark';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingTop: 50,
      }}>
      <Text style={{marginRight: 10, fontSize: 16}}>
        {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? '#ffffff' : '#000000'}
        trackColor={{false: '#ccc', true: '#666'}}
      />
    </View>
  );
}
