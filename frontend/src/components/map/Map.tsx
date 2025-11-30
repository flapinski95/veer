import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Text, Alert, ActivityIndicator, Vibration, Platform } from 'react-native';
import Mapbox, { LocationPuck, Camera, PointAnnotation, ShapeSource, LineLayer, UserLocation } from '@rnmapbox/maps';
import { MAPBOX_PUBLIC_TOKEN } from '@env';
import * as turf from '@turf/turf';

// Style
import { styles } from './map.styles';

// Komponenty
import SearchBox, { SearchBoxHandle } from '../search/SearchBox'; 
import { SaveRouteModal } from './SaveRouteModal';
import { BottomPanel } from '../bottomSheet/BottomPanel';
import { RoutesExploreView } from '../bottomSheet/views/RoutesExploreView';
import { RouteBuilderView } from '../bottomSheet/views/RouteBuilderView';

// Serwisy i Typy
import { saveRoute } from '../../services/routeService';
import { getSmartRoute, getNearbyAttractions, getPoiDetails, PoiDetails } from '../../services/mapboxService';
import { RoutePoint } from './RoutePanel'; // Typ RoutePoint importujemy stąd
import { findBestInsertIndex } from '../../utils/geoUtils';

Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN || '');

const triggerHaptic = () => {
  if (Platform.OS === 'android') Vibration.vibrate(10);
  else Vibration.vibrate(); 
};

const MapView = () => {
  // --- REFS ---
  const cameraRef = useRef<Camera>(null);
  const mapRef = useRef<Mapbox.MapView>(null);
  const searchBoxRef = useRef<SearchBoxHandle>(null);

  // --- STANY UI / MAPY ---
  const [panelMode, setPanelMode] = useState<'EXPLORE' | 'BUILD'>('EXPLORE');
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- STANY TRASY ---
  const [tempPoint, setTempPoint] = useState<RoutePoint | null>(null);
  const [tempPointDetails, setTempPointDetails] = useState<PoiDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [waypoints, setWaypoints] = useState<RoutePoint[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [routeStats, setRouteStats] = useState<{ dist: number, dur: number } | null>(null);
  const [attractions, setAttractions] = useState<{ id: string, name: string, coordinate: [number, number] }[]>([]);

  // --- STANY GESTÓW (DRAG & DROP) ---
  const [isDragging, setIsDragging] = useState(false); // Przesuwanie istniejącego
  const [isDraggingNewPoint, setIsDraggingNewPoint] = useState(false); // Tworzenie i przesuwanie nowego
  
  const isDraggingRef = useRef(false);
  const isDraggingNewPointRef = useRef(false);
  
  const dragIndexRef = useRef<number | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const startTouch = useRef<{x: number, y: number} | null>(null);

  // Synchronizacja refs dla pętli zdarzeń
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => { isDraggingNewPointRef.current = isDraggingNewPoint; }, [isDraggingNewPoint]);

  // --- EFEKT: PRZELICZANIE TRASY ---
  useEffect(() => {
    const recalculateRoute = async () => {
      // Nie odpytuj API w trakcie przesuwania palcem!
      if (isDragging || isDraggingNewPoint) return;

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
        
        // Pobierz atrakcje przy ostatnim punkcie
        const lastPoint = waypoints[waypoints.length - 1];
        const nearby = await getNearbyAttractions(lastPoint.coordinate);
        setAttractions(nearby.filter(a => !isPointInRoute(a.coordinate)));
      }
    };
    recalculateRoute();
  }, [waypoints, isDragging, isDraggingNewPoint]);

  // --- HELPERY ---
  const isPointInRoute = (coord: [number, number]) => {
     return waypoints.some(wp => Math.abs(wp.coordinate[0] - coord[0]) < 0.0001 && Math.abs(wp.coordinate[1] - coord[1]) < 0.0001);
  };

  const onUserLocationUpdate = (location: Mapbox.Location) => {
    if (location?.coords) {
      const { longitude, latitude } = location.coords;
      setUserLocation([longitude, latitude]);
    }
  };

  // --- ZARZĄDZANIE TRYBAMI (EXPLORE vs BUILD) ---
  
  const startCreatingRoute = () => {
    setPanelMode('BUILD');
    setWaypoints([]);
    setRouteGeometry(null);
    setRouteStats(null);
    setTempPoint(null);
  };

  const exitBuildMode = () => {
    setPanelMode('EXPLORE');
    setWaypoints([]);
    setRouteGeometry(null);
    setRouteStats(null);
    setTempPoint(null);
    setAttractions([]);
  };

  // --- OBSŁUGA DOTYKU (GESTY) ---

  const handleTouchStart = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    startTouch.current = { x: locationX, y: locationY };

    // Start timera Long Press (500ms)
    longPressTimer.current = setTimeout(async () => {
      // Jeśli jesteśmy w trybie EXPLORE, ignorujemy edycję trasy
      if (panelMode !== 'BUILD') return;

      if (!mapRef.current) return;
      const coord = await mapRef.current.getCoordinateFromView([locationX, locationY]);
      const clickPoint = turf.point(coord);
      const HIT_RADIUS = 80; // Tolerancja dotyku

      // 1. Sprawdź, czy trafiono w ISTNIEJĄCY punkt
      const existingPointIndex = waypoints.findIndex(wp => {
        const wpPoint = turf.point(wp.coordinate);
        const dist = turf.distance(clickPoint, wpPoint, { units: 'meters' });
        return dist < HIT_RADIUS;
      });

      if (existingPointIndex !== -1) {
        // SCENARIUSZ A: Przesuwanie istniejącego punktu
        triggerHaptic();
        setIsDragging(true);
        dragIndexRef.current = existingPointIndex;
        return;
      }

      // 2. Sprawdź, czy trafiono w LINIĘ (tworzenie punktu VIA)
      let insertIndex = -1;
      if (waypoints.length >= 2 && Array.isArray(routeGeometry) && routeGeometry.length > 1) {
        const line = turf.lineString(routeGeometry); 
        const distance = turf.pointToLineDistance(clickPoint, line, { units: 'meters' });

        if (distance < 100) { 
          insertIndex = findBestInsertIndex(coord, waypoints);
        }
      }

      if (insertIndex !== -1) {
        // SCENARIUSZ B: Tworzenie nowego punktu na trasie
        triggerHaptic();
        const newWaypoints = [...waypoints];
        newWaypoints.splice(insertIndex, 0, {
          id: Date.now().toString(),
          coordinate: coord,
          name: "Punkt pośredni",
          type: 'VIA' 
        });
        
        setWaypoints(newWaypoints);
        setTempPoint(null); // Czyść ewentualną czerwoną kropkę
        setTempPointDetails(null);
        
        setIsDraggingNewPoint(true);
        dragIndexRef.current = insertIndex;
      }

    }, 400); 
  };

  const handleTouchMove = async (e: any) => {
    const { locationX, locationY } = e.nativeEvent;

    // Anuluj long press przy zwykłym przesuwaniu mapy
    if (!isDraggingRef.current && !isDraggingNewPointRef.current && startTouch.current) {
      const dist = Math.sqrt(Math.pow(locationX - startTouch.current.x, 2) + Math.pow(locationY - startTouch.current.y, 2));
      if (dist > 10) {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        startTouch.current = null;
      }
      return;
    }

    // Tryb Dragging (Aktualizacja pozycji punktu)
    if ((isDraggingRef.current || isDraggingNewPointRef.current) && dragIndexRef.current !== null && mapRef.current) {
      const newCoord = await mapRef.current.getCoordinateFromView([locationX, locationY]);
      
      setWaypoints(prev => {
        const updated = [...prev];
        if (updated[dragIndexRef.current!]) {
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
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    startTouch.current = null;
    
    // Zakończ wszystkie tryby przeciągania
    if (isDraggingRef.current) setIsDragging(false);
    if (isDraggingNewPointRef.current) setIsDraggingNewPoint(false);
    
    dragIndexRef.current = null;
  };

  // --- OBSŁUGA KLIKNIĘCIA (TAP) ---

  const handleLocationSelected = async (coordinate: [number, number], name: string) => {
    // Jeśli jesteśmy w trybie EXPLORE i ktoś coś wyszuka, przełączamy na BUILD
    if (panelMode === 'EXPLORE') {
      setPanelMode('BUILD');
      setWaypoints([]); // Reset starej trasy
    }

    setIsFollowingUser(false);
    searchBoxRef.current?.close();
    
    // Ustaw punkt tymczasowy
    setTempPoint({ id: 'temp', coordinate, name, type: 'STOP' });
    
    // Pobierz detale
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
    // Ignoruj kliknięcia podczas przeciągania lub w trybie EXPLORE (opcjonalnie)
    if (isDraggingRef.current || isDraggingNewPointRef.current) return;

    // Pobierz współrzędne
    const clickCoordinates = e.geometry.coordinates as [number, number];
    const screenPoint = [e.properties.screenPointX, e.properties.screenPointY];

    // 1. Sprawdź, czy nie kliknięto w istniejący punkt (ochrona przed fat finger)
    const HIT_RADIUS = 50; 
    const clickPoint = turf.point(clickCoordinates);
    const nearestWaypointIndex = waypoints.findIndex(wp => {
      const wpPoint = turf.point(wp.coordinate);
      const dist = turf.distance(clickPoint, wpPoint, { units: 'meters' });
      return dist < HIT_RADIUS;
    });

    if (nearestWaypointIndex !== -1) return; // Kliknięto w punkt, ignorujemy (obsłuży to TouchStart)

    // 2. Zapytaj mapę o POI pod palcem
    setIsFollowingUser(false);
    searchBoxRef.current?.close();

    try {
      const features = await mapRef.current?.queryRenderedFeaturesAtPoint(
        screenPoint, undefined, ['poi-label', 'transit-label', 'airport-label']
      );

      if (features && features.features.length > 0) {
        // Trafiono w POI Mapboxa
        const feature = features.features[0];
        const name = feature.properties?.name_pl || feature.properties?.name || "Wybrane miejsce";
        
        let targetCoordinates = clickCoordinates;
        if (feature.geometry && feature.geometry.type === 'Point') {
            targetCoordinates = feature.geometry.coordinates as [number, number];
        }
        
        handleLocationSelected(targetCoordinates, name);
      } else {
        // Kliknięto w puste pole
        // W trybie BUILD stawiamy czerwoną kropkę
        if (panelMode === 'BUILD') {
           handleLocationSelected(clickCoordinates, "Zaznaczony punkt");
        } else {
           // W trybie EXPLORE np. tylko chowamy klawiaturę
           searchBoxRef.current?.close();
        }
      }
    } catch (error) {
      if (panelMode === 'BUILD') handleLocationSelected(clickCoordinates, "Zaznaczony punkt");
    }
  };

  // --- CRUD PUNKTÓW ---

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
      setIsModalVisible(false);
      exitBuildMode(); // Powrót do Explore
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się zapisać.");
    }
  };

  const handleBackToUserLocation = () => {
    setIsFollowingUser(true);
    setTempPoint(null);
    if (cameraRef.current) {
      cameraRef.current.setCamera({ zoomLevel: 14, animationDuration: 1000 });
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
        
        // Blokada mapy podczas przesuwania punktów
        scrollEnabled={!isDragging && !isDraggingNewPoint} 
        pitchEnabled={!isDragging && !isDraggingNewPoint}
        rotateEnabled={!isDragging && !isDraggingNewPoint}
        zoomEnabled={!isDragging && !isDraggingNewPoint}

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
          const isDraggingThis = (isDragging || isDraggingNewPoint) && dragIndexRef.current === index;
          const isStart = index === 0;

          return (
            <PointAnnotation
              key={point.id} 
              id={point.id}
              coordinate={point.coordinate}
              draggable={false}
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

        {/* Atrakcje (Tylko w trybie BUILD) */}
        {panelMode === 'BUILD' && attractions.map((attr) => (
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

      {/* --- PANEL DOLNY (ZALEŻNY OD TRYBU) --- */}
      <BottomPanel isVisible={true}>
        
        {panelMode === 'EXPLORE' ? (
          <RoutesExploreView 
             onCreateRoutePress={startCreatingRoute} 
          />
        ) : (
          <RouteBuilderView 
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
            
            // NOWY PROP: Przekazujemy funkcję czyszczącą i zamykającą tryb
            onCancel={exitBuildMode} 
          />
        )}

      </BottomPanel>

      <SaveRouteModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveConfirmed}
      />
    </View>
  );
};

export default MapView;