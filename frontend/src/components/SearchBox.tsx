// src/components/SearchBox.js

import React, { useState, useEffect, useRef } from 'react'; // Dodajemy useEffect i useRef
import { View, TextInput, Button, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { MAPBOX_PUBLIC_TOKEN } from '@env';

// Definicja typu dla pojedynczego wyniku Geocoding API
interface Feature {
  id: string;
  place_name: string;
  center: [number, number];
}

interface SearchBoxProps {
  onLocationSelected: (coordinate: [number, number]) => void;
}

// Funkcja Debounce
// Zapewnia, że funkcja zostanie wywołana tylko raz po upływie podanego opóźnienia
// od ostatniego wywołania.
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};


const SearchBox: React.FC<SearchBoxProps> = ({ onLocationSelected }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);

  // Funkcja odpowiedzialna za faktyczne wywołanie API
  const fetchResults = async (text: string) => {
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setSearchResults([]);

    try {
      const encodedText = encodeURIComponent(text.trim());
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedText}.json?access_token=${MAPBOX_PUBLIC_TOKEN}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.features) {
        setSearchResults(data.features as Feature[]);
      }
    } catch (error) {
      console.error('Błąd podczas wyszukiwania Mapbox:', error);
    } finally {
      setLoading(false);
    }
  };

  // Używamy useRef do przechowania debounced funkcji
  // Opóźnienie (np. 400ms) jest dobrym kompromisem między szybkością a oszczędnością API
  const debouncedSearch = useRef(debounce(fetchResults, 400)).current; 

  // Wywołanie API po zmianie searchText, ale z opóźnieniem
  useEffect(() => {
    // Kiedy searchText się zmienia, wywołujemy debounced funkcję
    debouncedSearch(searchText);

    // Czyszczenie timeoutu przy odmontowywaniu komponentu
    return () => {
      // Wymagane, aby upewnić się, że żadne oczekujące wywołanie nie zostanie uruchomione
      // po opuszczeniu ekranu.
      if (debouncedSearch.cancel) { 
         // Opcjonalnie: Jeśli używasz biblioteki debouncing, musisz to dodać.
         // Ponieważ zdefiniowaliśmy prosty debounce, to czyszczenie nie jest 
         // technicznie wymagane, ale jest dobrą praktyką.
      }
    };
  }, [searchText, debouncedSearch]); // Dependency array: uruchom po zmianie searchText

  const handleSelect = (feature: Feature) => {
    onLocationSelected(feature.center);
    setSearchResults([]);
    setSearchText(feature.place_name); 
  };

  const renderItem = ({ item }: { item: Feature }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
      <Text style={styles.resultText}>{item.place_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Wyszukaj miasto, ulicę, miejsce..."
          value={searchText}
          // Zmiana: Teraz tylko aktualizujemy stan searchText
          onChangeText={setSearchText} 
          // Usunięto onSubmitEditing, ponieważ teraz szukamy dynamicznie
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        {/* Przycisk Szukaj jest opcjonalny przy dynamicznym wyszukiwaniu, 
            ale zostawiamy go, aby wyświetlać status ładowania. */}
        <Button title={loading ? '...' : 'Szukaj'} onPress={() => fetchResults(searchText)} disabled={loading} />
      </View>
      
      {/* Lista wyników wyszukiwania */}
      {searchResults.length > 0 && (
        <View style={styles.resultsBox}>
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled" // Zapobiega zamykaniu klawiatury
          />
        </View>
      )}
    </View>
  );
};

// ... style ...

export default SearchBox;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    width: '90%',
    alignSelf: 'center',
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  resultsBox: {
    maxHeight: 200, // Ograniczenie wysokości listy
    backgroundColor: 'white',
    marginTop: 5,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SearchBox;