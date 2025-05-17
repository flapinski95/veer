import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import ThemeSwitch from '../components/themeSwitch';
import RouteHomePage from '../components/RouteHomePage';
import HomeFooter from '../components/HomeFooter';
import MapScreen from '../components/MapScreen';
import { ScrollView } from 'react-native';

export default function HomePage({navigation}) {
  const {colors} = useTheme();
  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.background}} contentContainerStyle={{padding: 20}}>
  <ThemeSwitch />
  <Text style={{color: colors.text, fontSize: 24}}>Home Screen</Text>
  <View>
    <RouteHomePage />
    <RouteHomePage />
    <RouteHomePage />
  </View>
  <View style={{height: 400, marginTop: 20}}>
    <MapScreen />
  </View>
  <HomeFooter />
</ScrollView>
  );
}
