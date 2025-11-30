import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  PanResponder, 
  Dimensions, 
  ScrollView 
} from 'react-native';

import { styles } from './RoutePanel.styles';

export interface RoutePoint {
  coordinate: [number, number];
  name: string;
}

interface RoutePanelProps {
  waypoints: RoutePoint[];
  routeStats: { dist: number; dur: number } | null;
  hasTempPoint: boolean;
  
  onAddTempPoint: () => void;
  onRemovePoint: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onSave: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.55; 
const COLLAPSED_HEIGHT = 170; // Wysokość widocznego nagłówka + uchwytu

export const RoutePanel: React.FC<RoutePanelProps> = ({
  waypoints,
  routeStats,
  hasTempPoint,
  onAddTempPoint,
  onRemovePoint,
  onMoveUp,
  onMoveDown,
  onSave,
}) => {
  const pan = useRef(new Animated.Value(0)).current;
  const [isExpanded, setIsExpanded] = useState(false);

  // Ref, żeby mieć dostęp do aktualnego stanu wewnątrz PanRespondera
  const isExpandedRef = useRef(isExpanded);

  // Synchronizacja refa ze stanem
  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  const panResponder = useRef(
    PanResponder.create({
      // Tuta dzieje się magia decyzyjna
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Ignoruj bardzo małe ruchy (przypadkowe drgnięcia)
        if (Math.abs(gestureState.dy) < 5) return false;

        // 1. Jeśli panel jest ZWINIĘTY:
        // Łap dotyk wszędzie, żeby łatwo było wyciągnąć panel
        if (!isExpandedRef.current) {
          return true;
        }

        // 2. Jeśli panel jest ROZWINIĘTY:
        // Sprawdź, czy dotyk nastąpił w górnej strefie (uchwyt)
        // locationY to współrzędna Y względem widoku panelu
        const touchY = evt.nativeEvent.locationY;
        
        // Jeśli dotknięto w obrębie górnych 50px (uchwyt), przejmij kontrolę.
        // Jeśli niżej (lista), oddaj kontrolę do ScrollView/przycisków.
        if (touchY < 50) {
          return true;
        }

        return false;
      },
      
      onPanResponderGrant: () => {
        pan.setOffset(pan._value);
        pan.setValue(0);
      },
      
      onPanResponderMove: Animated.event(
        [null, { dy: pan }],
        { useNativeDriver: false }
      ),
      
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        // Logika przyciągania (Snap)
        // Wyciąganie w górę
        if (gestureState.dy < -50 || gestureState.vy < -0.5) {
          snapToOpen();
        } 
        // Chowanie w dół
        else if (gestureState.dy > 50 || gestureState.vy > 0.5) {
          snapToClosed();
        } 
        // Powrót do najbliższego
        else {
           if (isExpandedRef.current) snapToOpen();
           else snapToClosed();
        }
      },
    })
  ).current;

  const snapToOpen = () => {
    Animated.spring(pan, {
      toValue: -(EXPANDED_HEIGHT - COLLAPSED_HEIGHT),
      useNativeDriver: false,
      bounciness: 4,
    }).start();
    setIsExpanded(true);
  };

  const snapToClosed = () => {
    Animated.spring(pan, {
      toValue: 0,
      useNativeDriver: false,
      bounciness: 4,
    }).start();
    setIsExpanded(false);
  };

  // Statystyki
  const distKm = routeStats ? (routeStats.dist / 1000).toFixed(2) : '0.00';
  const hours = routeStats ? Math.floor(routeStats.dur / 3600) : 0;
  const minutes = routeStats ? Math.floor((routeStats.dur % 3600) / 60) : 0;
  const timeString = routeStats 
    ? (hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`) 
    : '-- min';

  if (waypoints.length === 0 && !hasTempPoint) return null;

  return (
    <Animated.View 
      // ZMIANA: Przypisujemy PanResponder tutaj, do całego kontenera
      {...panResponder.panHandlers}
      style={[
        styles.container, 
        { 
          height: EXPANDED_HEIGHT, 
          transform: [{ translateY: pan }] 
        }
      ]}
    >
      {/* Uchwyt wizualny */}
      <View style={styles.handleContainer}>
        <View style={styles.handleBar} />
      </View>

      {/* --- SCENARIUSZ A: PUNKT TYMCZASOWY --- */}
      {hasTempPoint && (
        <View style={styles.tempPointBar}>
          <Text style={styles.tempText}>Zaznaczono punkt</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddTempPoint}>
            <Text style={styles.addButtonText}>Dodaj</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- SCENARIUSZ B: STATYSTYKI --- */}
      {waypoints.length > 0 && (
        <View style={styles.content}>
          {/* HEADER (Zawsze widoczny) */}
          <View style={styles.header}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DYSTANS</Text>
              <Text style={styles.statValue}>{distKm} km</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>CZAS</Text>
              <Text style={styles.statValue}>{timeString}</Text>
            </View>
          </View>

          {/* LISTA (Interaktywna gdy panel rozwinięty) */}
          <ScrollView 
            style={styles.listContainer} 
            showsVerticalScrollIndicator={false}
            // Ważne: w Androidzie czasem trzeba to dodać, żeby touch eventy przechodziły
            scrollEnabled={isExpanded} 
          >
            {waypoints.map((point, index) => (
              <View key={index} style={styles.pointRow}>
                <View style={[
                  styles.pointIndex, 
                  index === 0 ? styles.startIndex : (index === waypoints.length - 1 ? styles.stopIndex : null)
                ]}>
                  <Text style={styles.pointIndexText}>{index + 1}</Text>
                </View>
                
                <Text style={styles.pointName} numberOfLines={1}>{point.name}</Text>

                <View style={styles.actions}>
                  {index > 0 && (
                    <TouchableOpacity onPress={() => onMoveUp(index)} style={styles.actionBtn}>
                      <Text style={styles.arrow}>↑</Text>
                    </TouchableOpacity>
                  )}
                  {index < waypoints.length - 1 && (
                    <TouchableOpacity onPress={() => onMoveDown(index)} style={styles.actionBtn}>
                      <Text style={styles.arrow}>↓</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => onRemovePoint(index)} style={styles.deleteBtn}>
                    <Text style={styles.deleteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            <View style={{ height: 80 }} />
          </ScrollView>

          <View style={styles.footer}>
             <Text style={styles.counterText}>{waypoints.length} pkt</Text>
             <TouchableOpacity 
               style={[styles.saveButton, waypoints.length < 2 && styles.disabledButton]} 
               onPress={onSave}
               disabled={waypoints.length < 2}
             >
               <Text style={styles.saveButtonText}>Zapisz trasę</Text>
             </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
};