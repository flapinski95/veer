import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Text, Alert, ActivityIndicator, Vibration, Platform } from 'react-native';
import Mapbox, { LocationPuck, Camera, PointAnnotation, ShapeSource, LineLayer, UserLocation } from '@rnmapbox/maps';
import { MAPBOX_PUBLIC_TOKEN } from '@env';
import * as turf from '@turf/turf';

import { styles } from './map.styles';
import SearchBox, { SearchBoxHandle } from '../search/SearchBox'; 
import { SaveRouteModal } from './SaveRouteModal';
import { saveRoute } from '../../services/routeService';
import { getSmartRoute, getNearbyAttractions, getPoiDetails, PoiDetails } from '../../services/mapboxService';
import { RoutePanel, RoutePoint } from './RoutePanel';
import { findBestInsertIndex } from '../../utils/geoUtils';

Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN || '');

const triggerHaptic = () => {
  if (Platform.OS === 'android') Vibration.vibrate(10);
  else Vibration.vibrate(); 
};

const MapView = () => {
  const cameraRef = useRef<Camera>(null);
  const mapRef = useRef<Mapbox.MapView>(null);
  const searchBoxRef = useRef<SearchBoxHandle>(null);

  // --- STANY ---
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  const [tempPoint, setTempPoint] = useState<RoutePoint | null>(null);
  const [tempPointDetails, setTempPointDetails] = useState<PoiDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [waypoints, setWaypoints] = useState<RoutePoint[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [routeStats, setRouteStats] = useState<{ dist: number, dur: number } | null>(null);
  const [attractions, setAttractions] = useState<{ id: string, name: string, coordinate: [number, number] }[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- STANY GESTÓW (Drag & Drop) ---
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragIndexRef = useRef<number | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const startTouch = useRef<{x: number, y: number} | null>(null);

  // Synchronizacja refa ze stanem (dla wydajności w eventach dotyku)
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // --- PRZELICZANIE TRASY ---
  useEffect(() => {
    const recalculateRoute = async () => {
      // WAŻNE: Nie odpytuj API, gdy użytkownik wciąż trzyma punkt!
      if (isDragging) return;

      if (waypoints.length < 2) {
        setRouteGeometry(null);
        setRouteStats(null);
        return;
      }

      setIsLoading(true);
      const coordsOnly = waypoints.map(wp => wp.coordinate);
      const result = await getSmartRoute(coordsOnly);
      setIsLoading(false);

      if (result) {
        setRouteGeometry(result.geometry);
        setRouteStats({ dist: result.distance, dur: result.duration });
        const lastPoint = waypoints[waypoints.length - 1];
        const nearby = await getNearbyAttractions(lastPoint.coordinate);
        setAttractions(nearby.filter(a => !isPointInRoute(a.coordinate)));
      }
    };
    recalculateRoute();
  }, [waypoints, isDragging]); // Dodano isDragging, aby odpalić przeliczenie po puszczeniu punktu

  const isPointInRoute = (coord: [number, number]) => {
     return waypoints.some(wp => Math.abs(wp.coordinate[0] - coord[0]) < 0.0001 && Math.abs(wp.coordinate[1] - coord[1]) < 0.0001);
  };

  const onUserLocationUpdate = (location: Mapbox.Location) => {
    if (location?.coords) {
      const { longitude, latitude } = location.coords;
      setUserLocation([longitude, latitude]);
    }
  };

  // --- OBSŁUGA DOTYKU (KLUCZOWA LOGIKA) ---

  const handleTouchStart = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    startTouch.current = { x: locationX, y: locationY };

    // Ustawiamy timer na 400ms (czas na wykrycie przytrzymania)
    longPressTimer.current = setTimeout(async () => {
      
      if (!mapRef.current) return;
      
      // Pobieramy współrzędne geograficzne pod palcem
      const coord = await mapRef.current.getCoordinateFromView([locationX, locationY]);
      const clickPoint = turf.point(coord);

      // KROK 1: Sprawdź, czy kliknięto w ISTNIEJĄCY punkt (PRIORYTET)
      // Jeśli tak, to chcemy go przesunąć, a nie tworzyć nowy.
      const HIT_RADIUS = 80; // Tolerancja w metrach (zależy od zoomu, ale to bezpieczna wartość)
      
      const existingPointIndex = waypoints.findIndex(wp => {
        const wpPoint = turf.point(wp.coordinate);
        const dist = turf.distance(clickPoint, wpPoint, { units: 'meters' });
        return dist < HIT_RADIUS;
      });

      if (existingPointIndex !== -1) {
        // --- SCENARIUSZ A: Złapano istniejący punkt ---
        triggerHaptic();
        setIsDragging(true);
        dragIndexRef.current = existingPointIndex;
        // Wychodzimy - nie tworzymy nic nowego
        return;
      }

      // KROK 2: Jeśli nie trafiono w punkt, sprawdź czy trafiono w LINIĘ trasy (żeby dodać VIA point)
      let insertIndex = -1;

      if (waypoints.length >= 2 && Array.isArray(routeGeometry) && routeGeometry.length > 1) {
        const line = turf.lineString(routeGeometry); 
        const distance = turf.pointToLineDistance(clickPoint, line, { units: 'meters' });

        // Jeśli kliknięto blisko linii (<100m)
        if (distance < 100) { 
          insertIndex = findBestInsertIndex(coord, waypoints);
        }
      }

      if (insertIndex !== -1) {
        // --- SCENARIUSZ B: Tworzymy nowy punkt na linii ---
        triggerHaptic();
        const newWaypoints = [...waypoints];
        newWaypoints.splice(insertIndex, 0, {
          id: Date.now().toString(),
          coordinate: coord,
          name: "Punkt pośredni",
          type: 'VIA' 
        });
        
        setWaypoints(newWaypoints);
        setTempPoint(null);
        setTempPointDetails(null);
        
        setIsDragging(true);
        dragIndexRef.current = insertIndex;
      } 
      // SCENARIUSZ C: Kliknięto w puste pole -> Long press nic nie robi (ewentualnie można stawiać pinezkę)

    }, 400); 
  };

  const handleTouchMove = async (e: any) => {
    const { locationX, locationY } = e.nativeEvent;

    // 1. Jeśli to zwykły szybki ruch (przesuwanie mapy) -> Anuluj timer long press
    if (!isDraggingRef.current && startTouch.current) {
      const dist = Math.sqrt(Math.pow(locationX - startTouch.current.x, 2) + Math.pow(locationY - startTouch.current.y, 2));
      if (dist > 10) {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        startTouch.current = null;
      }
      return;
    }

    // 2. Jeśli jesteśmy w trybie PRZESUWANIA (isDragging = true) -> Aktualizuj pozycję punktu
    if (isDraggingRef.current && dragIndexRef.current !== null && mapRef.current) {
      const newCoord = await mapRef.current.getCoordinateFromView([locationX, locationY]);
      
      setWaypoints(prev => {
        const updated = [...prev];
        // Upewniamy się, że punkt istnieje (index jest poprawny)
        if (updated[dragIndexRef.current!] !== undefined) {
           updated[dragIndexRef.current!] = {
             ...updated[dragIndexRef.current!],
             coordinate: newCoord
           };
        }
        return updated;
      });
    }
  };

  const handleTouchEnd = () => {
    // Czyścimy timer (jeśli puszczono palec szybko - tapnięcie)
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    startTouch.current = null;
    
    // Jeśli byliśmy w trybie przeciągania -> kończymy go
    if (isDraggingRef.current) {
      setIsDragging(false); // To odblokuje useEffect i przeliczy trasę w API
      dragIndexRef.current = null;
    }
  };

  // --- CRUD & LOGIKA (BEZ ZMIAN) ---

  const handleLocationSelected = async (coordinate: [number, number], name: string) => {
    setIsFollowingUser(false);
    setTempPoint({ id: 'temp', coordinate, name, type: 'STOP' });
    searchBoxRef.current?.close();
    
    setIsLoadingDetails(true);
    setTempPointDetails(null);
    const details = await getPoiDetails(name, coordinate);
    setTempPointDetails(details);
    setIsLoadingDetails(false);

    if (cameraRef.current) {
      cameraRef.current.setCamera({ centerCoordinate: coordinate, zoomLevel: 16, animationDuration: 1000 });
    }
  };

  const handleMapPress = async (e: any) => {
    // Ignoruj kliknięcia, jeśli właśnie skończyliśmy przeciągać
    if (isDraggingRef.current) return;

    const clickCoordinates = e.geometry.coordinates as [number, number];
    
    // 1. Sprawdzamy czy kliknięto w istniejący punkt (żeby nie stawiać czerwonej kropki na niebieskiej)
    const HIT_RADIUS = 50; 
    const clickPoint = turf.point(clickCoordinates);
    const nearestWaypointIndex = waypoints.findIndex(wp => {
      const wpPoint = turf.point(wp.coordinate);
      const distance = turf.distance(clickPoint, wpPoint, { units: 'meters' });
      return distance < HIT_RADIUS;
    });

    if (nearestWaypointIndex !== -1) return;

    setIsFollowingUser(false);
    searchBoxRef.current?.close();
    const screenPoint = [e.properties.screenPointX, e.properties.screenPointY];

    try {
      const features = await mapRef.current?.queryRenderedFeaturesAtPoint(
        screenPoint, undefined, ['poi-label', 'transit-label', 'airport-label']
      );

      if (features && features.features.length > 0) {
        const feature = features.features[0];
        const name = feature.properties?.name_pl || feature.properties?.name || "Wybrane miejsce";
        let targetCoordinates = clickCoordinates;
        if (feature.geometry && feature.geometry.type === 'Point') {
            targetCoordinates = feature.geometry.coordinates as [number, number];
        }
        handleLocationSelected(targetCoordinates, name);
      } else {
        handleLocationSelected(clickCoordinates, "Zaznaczony punkt");
      }
    } catch (error) {
      handleLocationSelected(clickCoordinates, "Zaznaczony punkt");
    }
  };

  const handleBackToUserLocation = () => {
    setIsFollowingUser(true);
    setTempPoint(null);
    if (cameraRef.current) {
      cameraRef.current.setCamera({ zoomLevel: 14, animationDuration: 1000 });
    }
  };

  const addTempPointToRoute = () => {
    if (tempPoint) {
      const newPoint = { ...tempPoint, id: Date.now().toString() };
      setWaypoints(prev => [...prev, newPoint]);
      setTempPoint(null);
      setTempPointDetails(null);
    }
  };
  
  const addAttractionToRoute = (coordinate: [number, number], name: string) => {
     setWaypoints(prev => [...prev, { id: Date.now().toString(), coordinate, name, type: 'STOP' }]);
     setAttractions(prev => prev.filter(a => a.coordinate !== coordinate));
  };

  const removePoint = (index: number) => {
    const newWaypoints = [...waypoints];
    newWaypoints.splice(index, 1);
    setWaypoints(newWaypoints);
  };
  const movePointUp = (index: number) => {
    if (index === 0) return;
    const newWaypoints = [...waypoints];
    const temp = newWaypoints[index];
    newWaypoints[index] = newWaypoints[index - 1];
    newWaypoints[index - 1] = temp;
    setWaypoints(newWaypoints);
  };
  const movePointDown = (index: number) => {
    if (index === waypoints.length - 1) return;
    const newWaypoints = [...waypoints];
    const temp = newWaypoints[index];
    newWaypoints[index] = newWaypoints[index + 1];
    newWaypoints[index + 1] = temp;
    setWaypoints(newWaypoints);
  };
  const handleSaveConfirmed = async (name: string, description: string, isPublic: boolean) => {
    try {
      const pointsPayload = waypoints.map((wp, index) => ({
        lng: wp.coordinate[0],
        lat: wp.coordinate[1],
        order: index + 1,
      }));
      await saveRoute({ name, description, isPublic, points: pointsPayload });
      Alert.alert("Sukces", "Trasa zapisana!");
      setWaypoints([]);
      setAttractions([]);
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się zapisać.");
    }
  };

  const routeGeoJSON = useMemo(() => {
    if (!routeGeometry) return null;
    return {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: routeGeometry },
    } as const;
  }, [routeGeometry]);

  return (
    <View style={styles.container}>
      <SearchBox 
        ref={searchBoxRef} 
        onLocationSelected={handleLocationSelected} 
        userLocation={userLocation} 
      />
      
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        
        // --- BLOKADA PRZESUWANIA MAPY ---
        // Gdy trzymamy punkt, mapa stoi w miejscu (można precyzyjnie celować punktem)
        scrollEnabled={!isDragging} 
        pitchEnabled={!isDragging}
        rotateEnabled={!isDragging}
        zoomEnabled={!isDragging}

        onPress={handleMapPress}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Mapbox.Camera ref={cameraRef} followUserLocation={isFollowingUser} followUserMode="normal" zoomLevel={14} />
        <UserLocation visible={false} onUpdate={onUserLocationUpdate} minDisplacement={10} />
        
        {routeGeoJSON && (
          <ShapeSource id="routeSource" shape={routeGeoJSON}>
            <LineLayer id="routeLine" style={{ lineColor: '#007AFF', lineWidth: 5, lineCap: 'round', lineJoin: 'round' }} />
          </ShapeSource>
        )}

        {waypoints.map((point, index) => {
          const isDraggingThis = isDragging && dragIndexRef.current === index;
          const isStart = index === 0;

          return (
            <PointAnnotation
              key={point.id} 
              id={point.id}
              coordinate={point.coordinate}
              draggable={false} // Używamy naszego customowego systemu drag&drop
            >
              {point.type === 'STOP' && (
                <View style={[
                    styles.routePointContainer, 
                    isStart ? styles.startPoint : styles.stopPoint,
                    isDraggingThis ? { transform: [{scale: 1.3}], opacity: 0.9, zIndex: 100 } : {}
                  ]} 
                  collapsable={false}
                >
                  <Text style={styles.routePointText}>{isStart ? 'S' : index + 1}</Text>
                </View>
              )}

              {point.type === 'VIA' && (
                <View style={[
                    styles.viaPointContainer,
                    isDraggingThis ? styles.viaPointDragging : {}
                  ]} 
                  collapsable={false}
                />
              )}
            </PointAnnotation>
          );
        })}

        {attractions.map((attr) => (
          <PointAnnotation
            key={`attr-${attr.id}`}
            id={`attr-${attr.id}`}
            coordinate={attr.coordinate}
            onSelected={() => Alert.alert("Atrakcja", attr.name, [{ text: "Anuluj" }, { text: "Dodaj", onPress: () => addAttractionToRoute(attr.coordinate, attr.name) }])}
          >
             <View style={styles.attractionMarker} collapsable={false}><Text style={{fontSize: 10}}>🏛️</Text></View>
          </PointAnnotation>
        ))}

        {tempPoint && (
          <PointAnnotation id="tempMarker" coordinate={tempPoint.coordinate}>
            <View style={styles.tempMarker} collapsable={false} />
          </PointAnnotation>
        )}

        <LocationPuck pulsing={{ isEnabled: true }} />
      </Mapbox.MapView>

      {!isFollowingUser && (
        <TouchableOpacity style={styles.myLocationButton} onPress={handleBackToUserLocation}>
          <Text style={styles.myLocationText}>➤</Text>
        </TouchableOpacity>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      <RoutePanel 
        waypoints={waypoints}
        routeStats={routeStats}
        hasTempPoint={!!tempPoint}
        tempPointName={tempPoint?.name}
        tempPointDetails={tempPointDetails}
        isLoadingDetails={isLoadingDetails}
        onCancelSelection={() => {
            setTempPoint(null);
            setTempPointDetails(null);
        }}
        onAddTempPoint={addTempPointToRoute}
        onRemovePoint={removePoint}
        onMoveUp={movePointUp}
        onMoveDown={movePointDown}
        onSave={() => setIsModalVisible(true)}
      />

      <SaveRouteModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveConfirmed}
      />
    </View>
  );
};

export default MapView;