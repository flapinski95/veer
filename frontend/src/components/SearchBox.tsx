import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard, // Importujemy Keyboard
} from 'react-native';
import { MAPBOX_PUBLIC_TOKEN } from '@env';

interface Feature {
  id: string;
  place_name: string;
  center: [number, number];
}

interface SearchBoxProps {
  onLocationSelected: (coordinate: [number, number]) => void;
}

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const SearchBox: React.FC<SearchBoxProps> = ({ onLocationSelected }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (text: string) => {
    if (!text.trim() || text.length < 3) {
      setSearchResults([]);
      setLoading(false); // Upewnijmy się, że loading jest wyłączony
      return;
    }

    setLoading(true);
    try {
      const encodedText = encodeURIComponent(text.trim());
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedText}.json?access_token=${MAPBOX_PUBLIC_TOKEN}&limit=5`; // Dodano limit=5 dla optymalizacji

      const response = await fetch(url);
      const data = await response.json();

      if (data.features) {
        setSearchResults(data.features as Feature[]);
      }
    } catch (error) {
      console.error('Błąd Mapbox Geocoding:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useRef(debounce(fetchResults, 400)).current;

  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText, debouncedSearch]);

  const handleSelect = (feature: Feature) => {
    Keyboard.dismiss(); // Kluczowe: chowamy klawiaturę po wyborze
    onLocationSelected(feature.center);
    setSearchText(feature.place_name); // Ustawiamy nazwę miejsca w pasku
    setSearchResults([]); // Chowamy listę
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const renderItem = ({ item }: { item: Feature }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
      <Text style={styles.resultText} numberOfLines={2}>
        {item.place_name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Szukaj miejsca..."
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          placeholderTextColor="#999"
          returnKeyType="search" // Zmienia przycisk na klawiaturze na "Szukaj"
          onSubmitEditing={() => Keyboard.dismiss()} // Chowa klawiaturę po enterze
        />

        {/* Wskaźnik ładowania lub przycisk czyszczenia */}
        <View style={styles.iconContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : searchText.length > 0 ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
               {/* Prosty "X" jako tekst, można podmienić na ikonę */}
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultsBox}>
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            // Kluczowe dla płynności: chowa klawiaturę przy początku scrollowania
            onScrollBeginDrag={Keyboard.dismiss}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // Lekko niżej dla iOS notch
    width: '90%',
    alignSelf: 'center',
    zIndex: 20, // Wyższy z-index
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12, // Bardziej zaokrąglone rogi
    elevation: 8, // Mocniejszy cień na Android
    shadowColor: '#000', // Cień na iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  iconContainer: {
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
  },
  clearButton: {
    padding: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  resultsBox: {
    maxHeight: 220,
    backgroundColor: 'white',
    marginTop: 8,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    overflow: 'hidden', // Ważne dla zaokrąglonych rogów listy
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultText: {
    fontSize: 15,
    color: '#333',
  },
});

export default SearchBox;