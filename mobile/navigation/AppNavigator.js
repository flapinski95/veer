import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from '../screens/HomePage';
import SavedPage from '../screens/SavedPage';
import LoginPage from '../screens/LoginPage';
import Register from '../screens/RegisterPage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Saved" component={SavedPage} />
    </Stack.Navigator>
  );
}
