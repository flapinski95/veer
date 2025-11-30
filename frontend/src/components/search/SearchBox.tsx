import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
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

export interface SearchBoxHandle {
  close: () => void;
}

interface SearchBoxProps {
  onLocationSelected: (coordinate: [number, number], name: string) => void;
  userLocation: [number, number] | null;
}

interface Suggestion {
  mapbox_id: string;
  name: string;
  place_formatted: string;
  feature_type: string;
}

interface HistoryItem {
  id: string;
  place_name: string;
  center: [number, number];
}

const HISTORY_STORAGE_KEY = 'search_history_v2';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const SearchBox = forwardRef<SearchBoxHandle, SearchBoxProps>(({ onLocationSelected, userLocation }, ref) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [sessionToken, setSessionToken] = useState(generateUUID());

  useImperativeHandle(ref, () => ({
    close: () => {
      Keyboard.dismiss();
      setIsFocused(false);
    }
  }));

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (jsonValue != null) setHistory(JSON.parse(jsonValue));
      } catch (e) {}
    };
    loadHistory();
  }, []);

  const addToHistory = async (item: HistoryItem) => {
    try {
      const newHistory = [
        item,
        ...history.filter((h) => h.place_name !== item.place_name)
      ].slice(0, 5);
      setHistory(newHistory);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {}
  };

  const fetchSuggestions = async (text: string) => {
    if (!text.trim() || text.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const encodedText = encodeURIComponent(text.trim());
      let url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedText}&access_token=${MAPBOX_PUBLIC_TOKEN}&session_token=${sessionToken}&language=pl&limit=5`;
      if (userLocation) url += `&proximity=${userLocation[0]},${userLocation[1]}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.suggestions) setSuggestions(data.suggestions as Suggestion[]);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useRef(debounce(fetchSuggestions, 400)).current;

  useEffect(() => {
    if (searchText.length === 0) setSessionToken(generateUUID());
    debouncedSearch(searchText);
  }, [searchText, debouncedSearch]);

  const handleSelectSuggestion = async (suggestion: Suggestion) => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}?access_token=${MAPBOX_PUBLIC_TOKEN}&session_token=${sessionToken}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const coordinates = feature.geometry.coordinates as [number, number];
        const name = feature.properties.name || suggestion.name;
        
        const historyItem: HistoryItem = { id: suggestion.mapbox_id, place_name: name, center: coordinates };
        
        addToHistory(historyItem);
        onLocationSelected(coordinates, name);
        setSearchText(name);
        setSuggestions([]);
        setIsFocused(false);
        setSessionToken(generateUUID());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    Keyboard.dismiss();
    onLocationSelected(item.center, item.place_name);
    setSearchText(item.place_name);
    setSuggestions([]);
    setIsFocused(false);
    addToHistory(item);
  };

  const clearSearch = () => {
    setSearchText('');
    setSuggestions([]);
    Keyboard.dismiss();
    setIsFocused(false);
    setSessionToken(generateUUID());
  };

  const showHistory = searchText.length === 0 && history.length > 0;
  const shouldShowList = isFocused && ((showHistory) || (!showHistory && suggestions.length > 0));

  const renderSuggestionItem = ({ item }: { item: Suggestion }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectSuggestion(item)}>
      <View style={{flex: 1}}>
        <Text style={styles.resultText} numberOfLines={1}>📍 {item.name}</Text>
        {item.place_formatted ? (
          <Text style={styles.resultSubText} numberOfLines={1}>{item.place_formatted}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectHistory(item)}>
      <Text style={styles.resultText} numberOfLines={1}>🕒 {item.place_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Pasek Wyszukiwania */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Szukaj (np. pizza, muzeum)..."
          placeholderTextColor="#8E8E93"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()}
          onFocus={() => setIsFocused(true)}
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

      {/* Lista Wyników */}
      {shouldShowList && (
        <View style={styles.resultsBox}>
          {showHistory && (
             <View style={styles.historyHeader}>
               <Text style={styles.historyHeaderText}>Ostatnie wyszukiwania</Text>
             </View>
          )}
          
          <FlatList
            data={showHistory ? history : suggestions}
            renderItem={showHistory ? renderHistoryItem : renderSuggestionItem}
            keyExtractor={(item: any) => item.mapbox_id || item.id}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            showsVerticalScrollIndicator={false}
            // Ważne: to zapobiega ucinaniu cieni na Androidzie
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      )}
    </View>
  );
});

export default SearchBox;