import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox, { LocationPuck, Camera, PointAnnotation } from '@rnmapbox/maps';
import { MAPBOX_PUBLIC_TOKEN } from '@env';

import SearchBox from '../components/SearchBox';

// Ustawienie tokena (upewnij się, że .env działa)
Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN || '');

const MapView = () => {
  const cameraRef = useRef<Camera>(null);
  
  // Stan na koordynaty wybranego markera
  const [markerCoordinate, setMarkerCoordinate] = useState<[number, number] | null>(null);

  const handleLocationSelected = (coordinate: [number, number]) => {
    setMarkerCoordinate(coordinate);

    if (cameraRef.current) {
      // Płynne przejście kamery (1.5 sekundy)
      cameraRef.current.setCamera({
        centerCoordinate: coordinate,
        zoomLevel: 15, // Lekko większy zoom dla konkretnego miejsca
        animationDuration: 1500,
        animationMode: 'flyTo', // 'flyTo' daje ładniejszy efekt niż domyślny
      });
    }
  };

  return (
    <View style={styles.container}>
      <SearchBox onLocationSelected={handleLocationSelected} />

      <Mapbox.MapView
        style={styles.map}
        // Opcjonalne: ukrywa logo i atrybucję dla czystszego wyglądu (sprawdź licencję Mapbox!)
        logoEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
      >
        <Mapbox.Camera
          ref={cameraRef}
          followUserLocation={false} // Musi być false, żeby nie wracało do użytkownika po wyszukaniu
          zoomLevel={14}
        />

        {/* Renderowanie profesjonalnie wyglądającego markera */}
        {markerCoordinate && (
          <Mapbox.PointAnnotation
            id="searchMarker"
            coordinate={markerCoordinate}
            // 'anchor' ustawia punkt zakotwiczenia. {x: 0.5, y: 0.5} to środek.
            anchor={{ x: 0.5, y: 0.5 }} 
          >
            {/* Niestandardowy wygląd pinezki (kółko w kółku) */}
            <View style={styles.markerContainer}>
               <View style={styles.markerOuterHalo} />
               <View style={styles.markerInnerCircle} />
            </View>
          </Mapbox.PointAnnotation>
        )}

        <LocationPuck
          pulsing={{
            isEnabled: true,
            color: '#007AFF', // Niebieski kolor pulsowania
            radius: 'accuracy',
          }}
          puckBearing="heading" // 'heading' pokazuje gdzie patrzy telefon
          puckBearingEnabled={true}
        />
      </Mapbox.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  // Style dla niestandardowego markera
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  markerOuterHalo: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.3)', // Półprzezroczysty niebieski
  },
  markerInnerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#007AFF', // Pełny niebieski
    borderWidth: 3,
    borderColor: 'white', // Biała obwódka
  },
});

export default MapView;