// src/screens/VerificationLoadingPage.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { io, Socket } from 'socket.io-client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// Jeśli używasz @env dla IP, zadbaj o deklarację modułu w env.d.ts (patrz notatki niżej)
import { IP } from '@env';

// --- Typy nawigacji (dostosuj do swojego AppNavigatora) ---
type RootStackParamList = {
  Home: undefined;
  VerificationLoadingScreen: { userId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'VerificationLoadingScreen'>;
// Jeśli nie masz typów stosu / nie chcesz ich teraz dodawać,
// możesz tymczasowo użyć: type Props = { navigation: any; route: any };

const VerificationLoadingPage: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const userId = route.params?.userId;

  useEffect(() => {
    if (!userId) {
      console.warn('VerificationLoading: missing userId');
      return;
    }

    // Połącz z socketem (tylko websocket)
    const socket: Socket = io(IP, { transports: ['websocket'] });

    const onConnect = () => {
      console.log('connected to socket: ', socket.id);
      socket.emit('watchUser', String(userId));
    };

    const onVerified = () => {
      navigation.replace('Home');
    };

    const onError = (err: Error) => {
      console.error('❌ Socket connect_error:', err.message);
    };

    socket.on('connect', onConnect);
    socket.on('verified', onVerified);
    socket.on('connect_error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('verified', onVerified);
      socket.off('connect_error', onError);
      socket.disconnect();
    };
  }, [IP, navigation, userId]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Verify your account</Text>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default VerificationLoadingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
  },
});