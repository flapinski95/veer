// src/screens/LoginPage.tsx
import React from 'react';
import {
  View,
  Text,
  Button,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type Props = { navigation: any };

const LoginPage: React.FC<Props> = ({ navigation }) => {
  const { colors, toggleTheme, theme } = useTheme();
  const { login, logout, tokens, loading } = useAuth();

  const onLogin = async () => {
    await login();               // uruchamia Keycloak (PKCE)
    // jeśli chcesz automatycznie przejść dalej po sukcesie:
    // if (tokens) navigation.replace('Home');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Login</Text>

        <Pressable
          onPress={toggleTheme}
          style={[styles.iconBtn, { borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Toggle theme"
          hitSlop={10}
        >
          <Text style={{ fontSize: 18, color: colors.text }}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </Text>
        </Pressable>
      </View>

      {/* Body */}
      <View style={{ gap: 12 }}>
        {!tokens ? (
          <Button
            title={loading ? 'Loading…' : 'Continue with Keycloak'}
            onPress={onLogin}
            color={colors.primary}
            disabled={loading}
          />
        ) : (
          <>
            <Text style={{ color: colors.text }}>
              ✅ Jesteś zalogowany.
            </Text>
            <Button
              title="Go to Home"
              onPress={() => navigation.replace('Home')}
              color={colors.primary}
            />
            <Button
              title="Logout"
              onPress={logout}
              color={colors.primary}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  safe: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  iconBtn: { borderRadius: 12, padding: 8, borderWidth: StyleSheet.hairlineWidth },
});