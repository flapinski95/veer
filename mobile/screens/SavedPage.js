import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSwitch from '../components/themeSwitch';
import RouteHomePage from '../components/RouteHomePage'
import HomeFooter from '../components/HomeFooter'

export default function HomePage({ navigation }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <ThemeSwitch />
      <Text style={{ color: colors.text, fontSize: 24 }}>Home Screen</Text>
      <View>
        <RouteHomePage />
        <RouteHomePage />
        <RouteHomePage />
      </View>
      <HomeFooter/>
    </View>
  );
}