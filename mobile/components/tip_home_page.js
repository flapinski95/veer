import React from "react";
import { View, Text } from 'react-native';

export default function TipHomePage() {
    const test_tip_name = "Tip 1"
    const test_tip_user = "User"
    const test_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non blandit nunc, vel bibendum nisl. Vestibulum consectetur lectus nec sem ultricies egestas. Quisque ac lacus sit amet nulla dapibus blandit ac id magna. Mauris nec sapien quis magna euismod feugiat at quis est. Maecenas orci orci, laoreet eu augue id, cursus tristique risus. Donec vitae accumsan ipsum. Integer vitae metus finibus, viverra sapien at, consectetur nulla. Sed suscipit, ipsum et consectetur fermentum, risus mi auctor nulla, non faucibus diam nisi at justo. Pellentesque vitae rutrum nisl, eget semper quam. Mauris."

    return (
    <View
      style={{ padding: '4px' }}>
        <View style={{ padding: '4px', display: 'flex', justify_content: 'center' }}>
          <Text>{test_tip_name}</Text>
          <Text>{test_tip_user}</Text>
        </View>
        <View>
          <Text style={{ padding: '4px' }}>{test_text}</Text>
        </View>
        <View style={styles.fixToText}>
          <Button
            title="Like"
            onPress={() => Alert.alert('Left button pressed')}
          />
          <Button
            title="Dislike"
            onPress={() => Alert.alert('Right button pressed')}
          />
        </View>
    </View>
    )
}