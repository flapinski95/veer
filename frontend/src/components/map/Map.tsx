import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import Mapbox, { LocationPuck, Camera, PointAnnotation, ShapeSource, LineLayer } from '@rnmapbox/maps';
import { MAPBOX_PUBLIC_TOKEN } from '@env';

import { styles } from './map.styles';
import SearchBox from '../search/SearchBox';
import { SaveRouteModal } from './SaveRouteModal';
import { saveRoute } from '../../services/routeService';
import { getSmartRoute, getNearbyAttractions } from '../../services/mapboxService';

// Import nowego panelu i typu
import { RoutePanel, RoutePoint } from './RoutePanel';

Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN || '');

const MapView = () => {
  const cameraRef = useRef<Camera>(null);

  const [isFollowingUser, setIsFollowingUser] = useState(true);
  
  // ZMIANA: TempPoint teraz przechowuje też nazwę
  const [tempPoint, setTempPoint] = useState<RoutePoint | null>(null);

  // ZMIANA: Waypoints to teraz obiekty RoutePoint { coordinate, name }
  const [waypoints, setWaypoints] = useState<RoutePoint[]>([]);
  
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [routeStats, setRouteStats] = useState<{ dist: number, dur: number } | null>(null);
  const [attractions, setAttractions] = useState<{ id: string, name: string, coordinate: [number, number] }[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- EFEKT PRZELICZANIA TRASY ---
  useEffect(() => {
    const recalculateRoute = async () => {
      if (waypoints.length < 2) {
        setRouteGeometry(null);
        setRouteStats(null);
        return;
      }

      setIsLoading(true);
      // Wyciągamy same współrzędne do API
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
  }, [waypoints]);

  const isPointInRoute = (coord: [number, number]) => {
     return waypoints.some(wp => 
       Math.abs(wp.coordinate[0] - coord[0]) < 0.0001 && 
       Math.abs(wp.coordinate[1] - coord[1]) < 0.0001
     );
  };

  // --- OBSŁUGA UI ---

  // ZMIANA: Przyjmujemy name
  const handleLocationSelected = (coordinate: [number, number], name: string) => {
    setIsFollowingUser(false);
    setTempPoint({ coordinate, name });
    
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: coordinate,
        zoomLevel: 15,
        animationDuration: 1000,
      });
    }
  };

  const handleBackToUserLocation = () => {
    setIsFollowingUser(true);
    setTempPoint(null);
    if (cameraRef.current) {
      cameraRef.current.setCamera({ zoomLevel: 14, animationDuration: 1000 });
    }
  };

  // --- ZARZĄDZANIE PUNKTAMI (CRUD) ---

  const addTempPointToRoute = () => {
    if (tempPoint) {
      setWaypoints(prev => [...prev, tempPoint]);
      setTempPoint(null);
    }
  };
  
  const addAttractionToRoute = (coordinate: [number, number], name: string) => {
     setWaypoints(prev => [...prev, { coordinate, name }]);
     setAttractions(prev => prev.filter(a => a.coordinate !== coordinate));
  };

  // Nowe funkcje dla Panelu
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

  // DRAG & DROP NA MAPIE
  const onDragEnd = (index: number, feature: any) => {
    const newCoordinate = feature.geometry.coordinates;
    const updatedWaypoints = [...waypoints];
    // Aktualizujemy tylko koordynaty, nazwa zostaje ta sama (chyba że chcesz reverse geocoding)
    updatedWaypoints[index] = { ...updatedWaypoints[index], coordinate: newCoordinate };
    setWaypoints(updatedWaypoints);
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
      <SearchBox onLocationSelected={handleLocationSelected} />
      
      {/* Usunęliśmy stary RouteInfoPanel i RouteControls, teraz jest RoutePanel */}

      <Mapbox.MapView
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        onTouchStart={() => setIsFollowingUser(false)}
        onLongPress={(e) => handleLocationSelected(e.geometry.coordinates as [number, number], "Zaznaczony punkt")}
      >
        <Mapbox.Camera
          ref={cameraRef}
          followUserLocation={isFollowingUser}
          followUserMode="normal"
          zoomLevel={14}
        />

        {routeGeoJSON && (
          <ShapeSource id="routeSource" shape={routeGeoJSON}>
            <LineLayer
              id="routeLine"
              style={{
                lineColor: '#007AFF',
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </ShapeSource>
        )}

        {/* PUNKTY TRASY */}
        {waypoints.map((point, index) => {
          const isStart = index === 0;
          return (
            <PointAnnotation
              key={`wp-${index}`}
              id={`wp-${index}`}
              coordinate={point.coordinate}
              draggable={true}
              onDragEnd={(e) => onDragEnd(index, e)}
            >
              <View style={[styles.routePointContainer, isStart ? styles.startPoint : styles.stopPoint]} collapsable={false}>
                <Text style={styles.routePointText}>{isStart ? 'S' : index + 1}</Text>
              </View>
            </PointAnnotation>
          );
        })}

        {/* ATRAKCJE */}
        {attractions.map((attr) => (
          <PointAnnotation
            key={`attr-${attr.id}`}
            id={`attr-${attr.id}`}
            coordinate={attr.coordinate}
            onSelected={() => Alert.alert("Atrakcja", attr.name, [
                { text: "Anuluj" },
                { text: "Dodaj", onPress: () => addAttractionToRoute(attr.coordinate, attr.name) }
            ])}
          >
             <View style={styles.attractionMarker} collapsable={false}>
                <Text style={{fontSize: 10}}>🏛️</Text>
             </View>
          </PointAnnotation>
        ))}

        {/* TYMCZASOWY PUNKT */}
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

      {/* NOWY PANEL */}
      <RoutePanel 
        waypoints={waypoints}
        routeStats={routeStats}
        hasTempPoint={!!tempPoint}
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