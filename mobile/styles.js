import { StyleSheet } from 'react-native';
import Colors from './Colors'


const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    appTitle: {
      fontSize: 50,
      fontWeight: '600',
      color: Colors.dark,
      textAlign: 'center',
      marginTop: 40,
    },
  });
export default styles;