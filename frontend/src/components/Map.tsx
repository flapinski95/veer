// MapView.js

import React, { useRef, useState } from 'react'; // Dodajemy useState
import { View, StyleSheet } from 'react-native';
import Mapbox, { LocationPuck, Camera, PointAnnotation } from '@rnmapbox/maps'; 
import { MAPBOX_PUBLIC_TOKEN } from '@env';

import SearchBox from '../components/SearchBox';


Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN as string);

const MapView = () => {
  const cameraRef = useRef<Camera>(null); 
  
  // NOWY STAN: Przechowuje koordynaty markera: [longitude, latitude] lub null
  const [markerCoordinate, setMarkerCoordinate] = useState<[number, number] | null>(null); 

  // Funkcja do przemieszczania kamery I USTAWIANIA MARKERA
  const handleLocationSelected = (coordinate: [number, number]) => {
    // 1. Ustawienie markera w nowym miejscu
    setMarkerCoordinate(coordinate); 

    // 2. Przeniesienie kamery
    if (cameraRef.current) {
      // Używamy setCamera, aby płynnie przenieść widok
      cameraRef.current.setCamera({
        centerCoordinate: coordinate,
        zoomLevel: 14,
        animationDuration: 1500,
      });
    }
  };

  return (
    <View style={styles.container}>
      
      {/* SearchBox przekazuje wybrane współrzędne do naszej nowej funkcji */}
      <SearchBox onLocationSelected={handleLocationSelected} /> 

      <Mapbox.MapView style={styles.map}>
        
        <Mapbox.Camera
          ref={cameraRef} 
          followUserLocation={false} // Ustawiamy na false, aby móc swobodnie sterować kamerą 
          followUserMode="none"    // (Możesz zostawić true, jeśli chcesz, by użytkownik miał wybór)
          zoomLevel={14} 
        />
        
        {/* 3. Warunkowe renderowanie Markera (Pinezki) */}
        {markerCoordinate && (
          <Mapbox.PointAnnotation
            id="searchMarker"
            coordinate={markerCoordinate}
            // Opcjonalnie: dodaj widok dla pinezki, jeśli chcesz niestandardowy wygląd
          />
        )}
        
        <LocationPuck
          // ... Twoja konfiguracja LocationPuck ...
        />
        
      </Mapbox.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});

export default MapView;