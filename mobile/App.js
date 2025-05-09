import React from 'react';
import styles from './styles';
import Colors from './Colors'; // nazwij poprawnie plik!
import ThemeSwitch from './components/themeSwitch';

import {
  ScrollView,
  useColorScheme,
  StatusBar,
  Text,
  View,
} from 'react-native';

import {
  DebugInstructions,

  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

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
        <View
          style={{
            backgroundColor: currentTheme.surface,
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          <Section title="Step One" theme={currentTheme}>
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes" theme={currentTheme}>
            <ReloadInstructions />
          </Section>
          <Section title="Debug" theme={currentTheme}>
            <DebugInstructions />
          </Section>
          <Section title="Learn More" theme={currentTheme}>
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </View>
  );
}

export default App;