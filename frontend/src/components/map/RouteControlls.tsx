import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from './RouteControlls.styles';

interface RouteControlsProps {
  hasTempPoint: boolean;          // Czy jest zaznaczony czerwony punkt?
  pointsCount: number;            // Ile punktów ma trasa?
  onAddPoint: () => void;         // Funkcja dodawania punktu
  onUndo: () => void;             // Cofnij
  onSave: () => void;             // Zapisz
}

export const RouteControls: React.FC<RouteControlsProps> = ({
  hasTempPoint,
  pointsCount,
  onAddPoint,
  onUndo,
  onSave,
}) => {
  // Jeśli nic się nie dzieje (brak punktu tymczasowego i pusta trasa), nic nie wyświetlaj
  if (!hasTempPoint && pointsCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      
      {/* SCENARIUSZ A: Mamy wyszukany punkt (czerwony), chcemy go dodać */}
      {hasTempPoint && (
        <TouchableOpacity style={styles.addButton} onPress={onAddPoint}>
          <Text style={styles.addButtonText}>+ Dodaj punkt</Text>
        </TouchableOpacity>
      )}

      {/* SCENARIUSZ B: Budujemy trasę (mamy punkty) i nie ma aktywnego punktu tymczasowego */}
      {/* (Jeśli jest punkt tymczasowy, priorytet ma przycisk "Dodaj", więc ukrywamy pasek akcji) */}
      {!hasTempPoint && pointsCount > 0 && (
        <View style={styles.actionBar}>
          
          <TouchableOpacity style={[styles.smallBtn, styles.btnUndo]} onPress={onUndo}>
            <Text style={styles.smallBtnText}>Cofnij</Text>
          </TouchableOpacity>

          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{pointsCount} pkt</Text>
          </View>

          <TouchableOpacity style={[styles.smallBtn, styles.btnSave]} onPress={onSave}>
            <Text style={styles.smallBtnText}>Zapisz</Text>
          </TouchableOpacity>
          
        </View>
      )}
    </View>
  );
};