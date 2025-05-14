import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSwitch from '../components/themeSwitch';
import HomeFooter from '../components/HomeFooter'

export default function SavedPage({ navigation }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      <ThemeSwitch />
      <Text style={{ color: colors.text, fontSize: 24 }}>Home Screen</Text>
      <View>
        <RouteSavedPage />
        <RouteSavedPage />
        <RouteSavedPage />
      </View>
      <HomeFooter/>
    </View>
  );
}