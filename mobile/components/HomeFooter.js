import {View, Button, Alert} from 'react-native';
import styles from '../styles/styles';

export default function HomeFooter() {
  return (
    <View  style={styles.boxRow}>
      <Button
        title="Saved"
        onPress={() => {navigation.navigate('Saved')}}
      />
      <Button
        title="Add"
        onPress={() => Alert.alert('Middle button pressed')}
      />
      <Button
        title="Home"
        onPress={() => Alert.alert('Right button pressed')}
      />
    </View>
  );
}
