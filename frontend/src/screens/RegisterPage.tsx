// src/screens/RegisterPage.tsx
import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type Props = { navigation: any };

const s = (n: number) => n * 8;

const RegisterPage: React.FC<Props> = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const { login, tokens, loading } = useAuth();

  const handleRegister = async () => {
    await login({ register: true }); // ⬅️ otwiera ekran rejestracji Keycloak
    // po sukcesie możesz od razu przenieść:
    // navigation.replace('Home');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
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

      {/* Actions */}
      <View style={{ gap: s(1) }}>
        <Button
          title={loading ? 'Loading…' : 'Continue in Keycloak'}
          onPress={handleRegister}
          color={colors.primary}
          disabled={loading}
        />

        <Button
          title="I already have an account"
          onPress={() => navigation.replace('Login')}
          color={colors.primary}
        />

        {tokens && (
          <Button
            title="Go to Home"
            onPress={() => navigation.replace('Home')}
            color={colors.primary}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: s(2),
    paddingTop: s(1),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(2),
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
  },
  iconBtn: {
    borderRadius: 12,
    padding: s(1),
    borderWidth: StyleSheet.hairlineWidth,
  },
});