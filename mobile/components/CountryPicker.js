import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';
import countries from 'world-countries';

export default function CountryPicker({ selectedCountry, onSelect, colors }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const countryList = countries.map(c => c.name.common).sort();

  return (
    <View style={{ marginTop: 10 }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          backgroundColor: '#fff',
        }}
      >
        <Text style={{ color: colors.text }}>
          {selectedCountry || 'Select your country'}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              padding: 15,
              backgroundColor: '#f8f8f8',
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
            }}
          >
            <Text style={{ color: colors.text }}>Close</Text>
          </TouchableOpacity>
        <FlatList
          data={countryList}
          keyExtractor={(item) => item}
          style={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
              onPress={() => {
                onSelect(item);
                setModalVisible(false);
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
        </SafeAreaView>
      </Modal>
    </View>
  );
}