import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginPage'; // <== upewnij się, że ścieżka się zgadza

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const authData = await AsyncStorage.getItem('auth');
      if (authData) setIsLoggedIn(true);
    })();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('auth');
    setIsLoggedIn(false);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isLoggedIn ? (
        <View style={styles.container}>
          <Text style={styles.title}>Witaj w aplikacji Veer!</Text>
          <Button title="Wyloguj" onPress={handleLogout} />
        </View>
      ) : (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, marginBottom: 12 },
});

export default App;