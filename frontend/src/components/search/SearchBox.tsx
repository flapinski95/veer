import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAPBOX_PUBLIC_TOKEN } from '@env';

import { styles } from './SearchBox.styles';

interface Feature {
  id: string;
  place_name: string;
  center: [number, number];
}

interface SearchBoxProps {
  onLocationSelected: (coordinate: [number, number], name: string) => void;
  userLocation: [number, number] | null; // <--- DODAJ TO
}

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const HISTORY_STORAGE_KEY = 'search_history';

const SearchBox: React.FC<SearchBoxProps> = ({ onLocationSelected, userLocation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Feature[]>([]);
  const [history, setHistory] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 1. NOWY STAN: Czy input jest kliknięty/aktywny?
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (jsonValue != null) {
          setHistory(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Błąd ładowania historii', e);
      }
    };
    loadHistory();
  }, []);

  const addToHistory = async (item: Feature) => {
    try {
      const newHistory = [
        item,
        ...history.filter((h) => h.id !== item.id)
      ].slice(0, 5);

      setHistory(newHistory);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Błąd zapisu historii', e);
    }
  };

  const fetchResults = async (text: string) => {
    if (!text.trim() || text.length < 3) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const encodedText = encodeURIComponent(text.trim());
      
      // Budujemy URL
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedText}.json?access_token=${MAPBOX_PUBLIC_TOKEN}&limit=5&language=pl`;
      
      // KLUCZOWA ZMIANA:
      // Dodajemy typy POI oraz parametr proximity (bliskość)
      url += `&types=poi,place,address`;
      
      if (userLocation) {
        // Format: longitude,latitude
        url += `&proximity=${userLocation[0]},${userLocation[1]}`;
      }

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
    Keyboard.dismiss();
    addToHistory(feature);
    // ZMIANA: Przekazujemy coordy ORAZ nazwę
    onLocationSelected(feature.center, feature.place_name);
    
    setSearchText(feature.place_name);
    setSearchResults([]);
    setIsFocused(false);
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    Keyboard.dismiss();
    // Po wyczyszczeniu i schowaniu klawiatury odznaczamy focus, żeby schować historię
    setIsFocused(false);
  };

  // --- LOGIKA WYŚWIETLANIA ---
  const showHistory = searchText.length === 0 && history.length > 0;
  const dataToShow = showHistory ? history : searchResults;

  // Główny warunek widoczności listy:
  // 1. Musi być co pokazać (dataToShow > 0)
  // 2. ORAZ: 
  //    a) Jeśli to historia -> Input musi być sfokusowany (isFocused === true)
  //    b) Jeśli to wyniki wyszukiwania -> Pokazujemy je zawsze gdy są dostępne (searchText > 0)
  const shouldShowList = dataToShow.length > 0 && ((showHistory && isFocused) || (!showHistory && searchText.length > 0));

  const renderItem = ({ item }: { item: Feature }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
      <Text style={styles.resultText} numberOfLines={2}>
        {showHistory ? '🕒 ' : '📍 '} 
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
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()}
          
          // 2. OBSŁUGA FOCUSU
          // Gdy klikamy w pole -> true
          onFocus={() => setIsFocused(true)}
          // Gdy klikamy gdzieś indziej / zamykamy klawiaturę -> false
          onBlur={() => setIsFocused(false)}
        />

        <View style={styles.iconContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : searchText.length > 0 ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 3. Użycie nowego warunku shouldShowList */}
      {shouldShowList && (
        <View style={styles.resultsBox}>
          {showHistory && (
             <View style={styles.historyHeader}>
               <Text style={styles.historyHeaderText}>Ostatnie wyszukiwania</Text>
             </View>
          )}
          
          <FlatList
            data={dataToShow}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled" // To ważne, żeby kliknięcie w listę działało zanim onBlur zamknie listę!
            onScrollBeginDrag={Keyboard.dismiss}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

export default SearchBox;