import {View, Text, ActivityIndicator} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {io} from 'socket.io-client';
import {useEffect} from 'react';
import {IP} from '@env';

export default function LoadingPage({navigation, route}) {
  const {colors} = useTheme();
  const userId = route.params?.userId;
  useEffect(() => {
    const socket = io(IP, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('connected to socket: ', socket.id);
      socket.emit('watchUser', String(userId));
    });

    socket.on('verified', () => {
      navigation.replace('Home');
    });

    socket.on('connect_error', err => {
      console.error('❌ Błąd połączenia z socketem:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <View>
      <Text>Verify your account</Text>
      <ActivityIndicator size={'large'} color={'black'} />
    </View>
  );
}
