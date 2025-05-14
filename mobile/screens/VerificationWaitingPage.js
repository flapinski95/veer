import {View, Text, ActivityIndicator} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';

export default function LoadingPage({navigation}) {
  const {colors} = useTheme();

  return (
    <View>
      <Text>Verify your account</Text>
      <ActivityIndicator size={'large'} color={'black'} />
    </View>
  );
}
