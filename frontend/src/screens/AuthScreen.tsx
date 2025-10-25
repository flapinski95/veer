// src/screens/AuthScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type Props = { navigation: any };
const s = (n: number) => n * 8; // 8pt scale

const AuthScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const { login, tokens, loading } = useAuth();
  const [working, setWorking] = useState<'login' | 'register' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Po zalogowaniu wpuść do Home
  useEffect(() => {
    if (tokens) {
      navigation.replace('Home');
    }
  }, [tokens, navigation]);

  const handleLogin = async () => {
    setError(null);
    setWorking('login');
    try {
      await login();
    } catch (e: any) {
      setError(e?.message ?? 'Login failed');
      setWorking(null);
    }
  };

  const handleRegister = async () => {
    setError(null);
    setWorking('register');
    try {
      await login({ register: true });
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed');
      setWorking(null);
    }
  };

  const isBusy = loading || working !== null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome 👋</Text>
          <Text style={[styles.subtitle, { color: colors.text + 'B3' }]}>
            Sign in or create your account
          </Text>
        </View>

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

      {/* Big hero Emoji / Logo placeholder */}
      <View style={styles.hero}>
        <Text style={{ fontSize: 56 }}>{theme === 'dark' ? '🗺️' : '🧭'}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <PrimaryButton
          label={working === 'login' ? 'Opening Keycloak…' : 'Continue with Keycloak'}
          onPress={handleLogin}
          disabled={isBusy}
          colors={colors}
        />

        <Divider label="or" colors={colors} />

        <OutlineButton
          label={working === 'register' ? 'Opening Sign-up…' : 'Create a new account'}
          onPress={handleRegister}
          disabled={isBusy}
          colors={colors}
        />

        {error && (
          <Text style={[styles.error, { color: '#ff3b30' }]} accessibilityLiveRegion="polite">
            {error}
          </Text>
        )}
      </View>

      {/* Busy overlay */}
      {isBusy && (
        <View style={styles.busyOverlay} pointerEvents="none">
          <ActivityIndicator size="large" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default AuthScreen;

/* ----------------- Sub-components ----------------- */

function PrimaryButton({
  label,
  onPress,
  disabled,
  colors,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  colors: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!!disabled}
      style={({ pressed }) => [
        styles.primaryBtn,
        { backgroundColor: disabled ? colors.primary + '66' : colors.primary, opacity: pressed ? 0.9 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.primaryBtnText, { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

function OutlineButton({
  label,
  onPress,
  disabled,
  colors,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  colors: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!!disabled}
      style={({ pressed }) => [
        styles.outlineBtn,
        {
          borderColor: colors.border,
          backgroundColor: pressed ? (colors.background + 'F2') : 'transparent',
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.outlineBtnText, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

function Divider({ label, colors }: { label: string; colors: any }) {
  return (
    <View style={styles.dividerRow} accessible accessibilityLabel={label}>
      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      <Text style={[styles.dividerLabel, { color: colors.text + '80' }]}>{label}</Text>
      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
    </View>
  );
}

/* ----------------- Styles ----------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: s(2),
    paddingTop: s(1),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(3),
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },
  iconBtn: {
    borderRadius: 12,
    padding: s(1),
    borderWidth: StyleSheet.hairlineWidth,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(3),
  },
  actions: {
    gap: s(1.5),
  },
  primaryBtn: {
    borderRadius: 12,
    paddingVertical: s(1.75),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  outlineBtn: {
    borderRadius: 12,
    paddingVertical: s(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(1),
    marginVertical: s(1),
  },
  dividerLine: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
  },
  dividerLabel: {
    fontSize: 12,
    minWidth: 36,
    textAlign: 'center',
  },
  error: {
    marginTop: s(1),
    fontSize: 13,
    textAlign: 'center',
  },
  busyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});