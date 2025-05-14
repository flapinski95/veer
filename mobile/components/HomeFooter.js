import React from "react";
import { View, Text } from 'react-native';

export default function HomeFooter() {
    return (
    <View
      style={{ padding: '4px' }}>
        <Button
            title="Saved"
            onPress={() => Alert.alert('Left button pressed')}
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
    )
}