// src/app/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Saved from '../screens/Saved';
import MapScreen from '../screens/MapScreen';
import AuthScreen from '../screens/AuthScreen';
import { useAuth } from '../contexts/AuthContext';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { tokens, loading } = useAuth();

  if (loading) {
    return <SplashScreen/>
  }

  const isAuthed = !!tokens;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthed ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Saved" component={Saved} />
          <Stack.Screen name="Map" component={MapScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}