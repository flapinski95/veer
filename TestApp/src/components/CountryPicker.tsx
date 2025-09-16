// src/components/CountryPicker.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import countries from 'world-countries';

// ---- typy ----
type Props = {
  selectedCountry: string;
  onSelect: (country: string) => void;
  colors: {
    text: string;
    background: string;
    border?: string;
  };
};

const CountryPicker: React.FC<Props> = ({ selectedCountry, onSelect, colors }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const countryList = countries.map(c => c.name.common).sort();

  return (
    <View style={{ marginTop: 10 }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          styles.button,
          { borderColor: colors.border ?? '#ccc', backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.text }}>
          {selectedCountry || 'Select your country'}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeBtn}
          >
            <Text style={{ color: colors.text }}>Close</Text>
          </TouchableOpacity>

          <FlatList
            data={countryList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelect(item);
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: colors.text }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default CountryPicker;

// ---- style ----
const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  modal: {
    flex: 1,
  },
  closeBtn: {
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  item: {
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
});