import React from 'react';
import styles from './styles/styles';
import Colors from './styles/Colors'; // nazwij poprawnie plik!
import ThemeSwitch from './components/themeSwitch';

import {
  ScrollView,
  useColorScheme,
  StatusBar,
  Text,
  View,
  
} from 'react-native';



function Section({ children, title, theme }) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {title}
      </Text>
      <Text style={[styles.sectionDescription, { color: theme.text }]}>
        {children}
      </Text>
    </View>
  );
}

function App() {
  const systemDarkMode = useColorScheme() === 'dark';
  const [currentTheme, setCurrentTheme] = React.useState(systemDarkMode ? Colors.dark : Colors.light);

  const safePadding = '5%';

  return (
    <View style={{ backgroundColor: currentTheme.background }}>
      <ThemeSwitch theme={currentTheme} setTheme={setCurrentTheme} />
      <StatusBar
        barStyle={currentTheme.text === '#ffffff' ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.background}
      />
      <ScrollView style={{ backgroundColor: currentTheme.background }}>
        <View style={{ paddingRight: safePadding }}>
          <Text style={[styles.appTitle, { color: currentTheme.text, padding: safePadding }]}>
            Veer
          </Text>
        </View>      
      </ScrollView>
    </View>
  );
}

export default App;