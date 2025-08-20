// src/app/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Saved from '../screens/Saved';
import MapScreen from '../screens/MapScreen';
import LoginPage from '../screens/LoginPage';
import RegisterPage from '../screens/RegisterPage';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen name="Login" component={LoginPage} /> */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Saved" component={Saved} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
}