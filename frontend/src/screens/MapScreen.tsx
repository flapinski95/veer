// src/screens/MapScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Text,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MAPBOX_ACCESS_TOKEN } from '@env';
import Mapbox, {
  MapView,
  Camera,
  UserLocation,
  PointAnnotation,
  UserTrackingMode,
} from '@rnmapbox/maps';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

type LngLat = [number, number]; // [lng, lat]

type GeoFeature = {
  id: string;
  place_name: string;
  center: LngLat;
};

export default function MapScreen() {
  const camRef = useRef<Camera>(null);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [followUser, setFollowUser] = useState(true);

  // bieżąca pozycja usera (dla proximity)
  const [userLngLat, setUserLngLat] = useState<LngLat | null>(null);

  // wybrany punkt wyszukiwania → pokaż pinezkę
  const [selectedCoord, setSelectedCoord] = useState<LngLat | null>(null);

  // czy panel wyników jest otwarty
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    if (!isResultsOpen) return;
    const t = setTimeout(() => {
      void search(query);
    }, 300);
    return () => clearTimeout(t);
  }, [query, userLngLat, isResultsOpen]);

  const search = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const prox = userLngLat
        ? `&proximity=${userLngLat[0]},${userLngLat[1]}`
        : '';
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          q,
        )}.json` +
        `?access_token=${MAPBOX_ACCESS_TOKEN}&limit=6&autocomplete=true&language=pl${prox}`;
      const res = await fetch(url);
      const data = await res.json();
      const feats: GeoFeature[] = (data.features ?? []).map((f: any) => ({
        id: f.id,
        place_name: f.place_name,
        center: f.center as LngLat, // [lng, lat]
      }));
      setResults(feats);
    } catch (e) {
      console.warn('geocoding error', e);
    } finally {
      setLoading(false);
    }
  };

  const goTo = (lngLat: LngLat) => {
    setFollowUser(false); // przestań śledzić użytkownika
    setSelectedCoord(lngLat); // pokaż pinezkę w wybranym miejscu
    requestAnimationFrame(() => {
      camRef.current?.setCamera({
        centerCoordinate: lngLat,
        zoomLevel: 14,
        animationDuration: 1000,
      });
    });
  };

  const onPick = (f: GeoFeature) => {
    setQuery(f.place_name);
    setIsResultsOpen(false); // zamknij panel wyników
    setResults([]); // czyść wyniki
    inputRef.current?.blur(); // schowaj klawiaturę
    goTo(f.center);
  };

  const styles = useMemo(() => createStyles(insets.top), [insets.top]);

  return (
    <View style={styles.root}>
      <MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
        rotateEnabled
        pitchEnabled
        compassEnabled
        logoEnabled={false}
        attributionEnabled={false}
      >
        {/* Lokalizacja usera + aktualizacja proximity */}
        <UserLocation
          visible
          onUpdate={(loc: any) => {
            const lng = loc?.coords?.longitude;
            const lat = loc?.coords?.latitude;
            if (typeof lng === 'number' && typeof lat === 'number') {
              setUserLngLat([lng, lat]);
            }
          }}
        />

        <Camera
          ref={camRef}
          zoomLevel={14}
          followUserLocation={followUser}
          followUserMode={UserTrackingMode.Follow}
        />

        {/* Pinezka w wybranym miejscu (jeśli jest) */}
        {selectedCoord && (
          <PointAnnotation id="search-pin" coordinate={selectedCoord}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#007AFF',
                borderWidth: 6,
                borderColor: '#007AFF55',
              }}
            />
          </PointAnnotation>
        )}
      </MapView>

      {/* WYSZUKIWARKA */}
      <View style={styles.searchWrap}>
        <TextInput
          ref={inputRef}
          value={query}
          onFocus={() => setIsResultsOpen(true)}
          onChangeText={t => {
            setQuery(t);
            setIsResultsOpen(!!t.trim()); // tylko gdy coś wpisane
          }}
          placeholder="Search place…"
          placeholderTextColor="#00000080"
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={() => void search(query)}
        />

        {isResultsOpen && !!results.length && (
          <View style={styles.resultsBox}>
            <FlatList
              data={results}
              keyExtractor={it => it.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={styles.resultRow}
                  onPress={() => onPick(item)}
                >
                  <Text numberOfLines={2} style={styles.resultText}>
                    {item.place_name}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
}

function createStyles(topInset: number) {
  return StyleSheet.create({
    root: { flex: 1 },
    map: { flex: 1 },
    searchWrap: {
      position: 'absolute',
      top: Math.max(topInset + 8, 12),
      left: 12,
      right: 12,
    },
    searchInput: {
      backgroundColor: Platform.select({
        ios: '#FFFFFFF2',
        android: '#FFFFFFF2',
      }) as string,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: Platform.select({ ios: 12, android: 10 }) as number,
      fontSize: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#D0D0D3',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    resultsBox: {
      marginTop: 6,
      maxHeight: 260,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#fff',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#D0D0D3',
    },
    resultRow: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E6E6EA',
    },
    resultText: { color: '#111', fontSize: 14 },
  });
}
