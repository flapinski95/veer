import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authorize } from 'react-native-app-auth'; // Dodajemy, jeśli chcemy użyć go do wylogowania (opcjonalne)

// Importujemy Twoje ekrany
import LoginScreen from './src/screens/LoginPage';
import MainPage from './src/screens/MainPage'; // <== Dodaj import ekranu z mapą!

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Sprawdzenie stanu logowania przy starcie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await AsyncStorage.getItem('auth');
        if (authData) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Błąd podczas odczytu danych autoryzacji:", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. Funkcja wylogowania
  const handleLogout = async () => {
    // Opcjonalnie: Dodaj logikę unieważnienia tokenu na serwerze (revoke)
    // jeśli react-native-app-auth tego wymaga/obsługuje
    await AsyncStorage.removeItem('auth');
    setIsLoggedIn(false);
  };
  
  // W przypadku ładowania możesz wyświetlić pusty ekran/spinner
  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* <ActivityIndicator size="large" /> */}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isLoggedIn ? (
        // 3. W tym miejscu UŻYJ KOMPONENTU MAINPAGE ZAMIAST PROSTEGO WIDOKU
        <MainPage onLogout={handleLogout} /> // Opcjonalnie przekazujemy funkcję wylogowania, by przycisk znalazł się na mapie
      ) : (
        // Użyjemy funkcji do zmiany stanu na true po pomyślnym logowaniu
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // ... inne style
});

export default App;