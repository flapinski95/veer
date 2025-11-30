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

import { styles } from '../bottomSheet/views/RoutePanel.styles';

export interface RoutePoint {
  id: string;
  coordinate: [number, number];
  name: string;
  type: 'STOP' | 'VIA';
}

interface RoutePanelProps {
  waypoints: RoutePoint[];
  routeStats: { dist: number; dur: number } | null;
  hasTempPoint: boolean;
  tempPointName?: string;
  
  onAddTempPoint: () => void;
  onRemovePoint: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onSave: () => void;
  onCancelSelection: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
// Panel zajmuje 60% ekranu po rozwinięciu
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.6; 
// Ile pikseli ma wystawać, gdy panel jest "schowany" (nagłówek + statystyki)
const VISIBLE_HEIGHT = 190; 

// Obliczamy offset: o ile trzeba przesunąć panel W DÓŁ, żeby go schować
const HIDDEN_OFFSET = EXPANDED_HEIGHT - VISIBLE_HEIGHT;

export const RoutePanel: React.FC<RoutePanelProps> = ({
  waypoints,
  routeStats,
  hasTempPoint,
  onAddTempPoint,
  onRemovePoint,
  onMoveUp,
  onMoveDown,
  onSave,
  tempPointName,
  onCancelSelection,
}) => {
  // Startujemy od pozycji ukrytej (przesuniętej w dół)
  const pan = useRef(new Animated.Value(HIDDEN_OFFSET)).current;
  const [isExpanded, setIsExpanded] = useState(false);
  const isExpandedRef = useRef(isExpanded);

  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  // Jeśli pojawia się nowy punkt/trasa, wysuń panel jeśli był całkowicie schowany
  // (opcjonalna animacja wejścia)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Ignoruj małe drgnięcia
        if (Math.abs(gestureState.dy) < 5) return false;
        
        // Jeśli ZWINIĘTY -> łap dotyk na całym panelu (łatwe wyciąganie)
        if (!isExpandedRef.current) return true;
        
        // Jeśli ROZWINIĘTY -> łap dotyk tylko na górnym pasku (uchwycie)
        // Dzięki temu lista pod spodem może się przewijać
        if (evt.nativeEvent.locationY < 60) return true;
        
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
        // Jeśli machnięto szybko w górę LUB przesunięto wysoko -> OTWÓRZ
        if (gestureState.dy < -50 || gestureState.vy < -0.5) {
          snapToOpen();
        } 
        // Jeśli machnięto szybko w dół LUB przesunięto nisko -> ZAMKNIJ
        else if (gestureState.dy > 50 || gestureState.vy > 0.5) {
          snapToClosed();
        } 
        // Jeśli puszczono w połowie -> wróć do bliższego stanu
        else {
           // W połowie drogi? (HIDDEN_OFFSET / 2)
           // Pamiętaj: 0 to góra, HIDDEN_OFFSET to dół
           if (pan._value < HIDDEN_OFFSET / 2) {
             snapToOpen();
           } else {
             snapToClosed();
           }
        }
      },
    })
  ).current;

  const snapToOpen = () => {
    Animated.spring(pan, {
      toValue: 0, // 0 = Brak przesunięcia w dół = Maksymalne rozwinięcie
      useNativeDriver: false,
      bounciness: 4,
    }).start();
    setIsExpanded(true);
  };

  const snapToClosed = () => {
    Animated.spring(pan, {
      toValue: HIDDEN_OFFSET, // Przesunięcie w dół = Zwinięcie
      useNativeDriver: false,
      bounciness: 4,
    }).start();
    setIsExpanded(false);
  };

  const distKm = routeStats ? (routeStats.dist / 1000).toFixed(2) : '0.00';
  const hours = routeStats ? Math.floor(routeStats.dur / 3600) : 0;
  const minutes = routeStats ? Math.floor((routeStats.dur % 3600) / 60) : 0;
  const timeString = routeStats ? (hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`) : '-- min';

  if (waypoints.length === 0 && !hasTempPoint) return null;

  return (
    <Animated.View 
      {...panResponder.panHandlers}
      style={[
        styles.container, 
        { 
          height: EXPANDED_HEIGHT, 
          // Ograniczamy ruch, żeby nie "oderwać" panelu od dołu (clamp)
          transform: [{ 
            translateY: pan.interpolate({
              inputRange: [-50, HIDDEN_OFFSET + 50],
              outputRange: [-50, HIDDEN_OFFSET + 50],
              extrapolate: 'clamp'
            }) 
          }] 
        }
      ]}
    >
      <View style={styles.handleContainer}>
        <View style={styles.handleBar} />
      </View>

      {/* --- SCENARIUSZ A: DODAWANIE PUNKTU --- */}
      {hasTempPoint && (
        <View style={styles.tempPointBar}>
          <View style={styles.tempInfoRow}>
            <TouchableOpacity onPress={onCancelSelection} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.tempText} numberOfLines={1}>
               { tempPointName || "Zaznaczono punkt" } 
            </Text>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={onAddTempPoint}>
            <Text style={styles.addButtonText}>Dodaj do trasy</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- SCENARIUSZ B: LISTA TRASY --- */}
      {!hasTempPoint && waypoints.length > 0 && (
        <View style={styles.content}>
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

          <ScrollView 
            style={styles.listContainer} 
            showsVerticalScrollIndicator={false}
            scrollEnabled={isExpanded} 
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {waypoints.map((point, index) => {
              const isStart = index === 0;
              const isEnd = index === waypoints.length - 1;
              const isSpecial = isStart || isEnd;

              return (
                <View key={point.id} style={styles.pointRow}>
                  <View style={[
                    styles.pointIndex, 
                    isStart ? styles.startIndex : (isEnd ? styles.stopIndex : null)
                  ]}>
                    <Text style={isSpecial ? styles.pointIndexTextWhite : styles.pointIndexText}>
                      {index + 1}
                    </Text>
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
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
             <Text style={styles.counterText}>{waypoints.length} przystanki</Text>
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