import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
// Pamiętaj o poprawieniu nazwy importu, jeśli zmienisz nazwę pliku na RouteControls.styles.ts
import { styles } from './RouteControls.styles'; 

interface RouteControlsProps {
  hasTempPoint: boolean;
  pointsCount: number;
  onAddPoint: () => void;
  onUndo: () => void;
  onSave: () => void;
}

export const RouteControls: React.FC<RouteControlsProps> = ({
  hasTempPoint,
  pointsCount,
  onAddPoint,
  onUndo,
  onSave,
}) => {
  if (!hasTempPoint && pointsCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      
      {/* SCENARIUSZ A: Dodawanie punktu (Duża niebieska pigułka) */}
      {hasTempPoint && (
        <TouchableOpacity style={styles.addButton} onPress={onAddPoint} activeOpacity={0.8}>
          {/* Opcjonalnie: Tu można dodać ikonkę Plusa */}
          <Text style={styles.addButtonText}>+ Dodaj punkt</Text>
        </TouchableOpacity>
      )}

      {/* SCENARIUSZ B: Zarządzanie trasą (Pasek narzędzi) */}
      {!hasTempPoint && pointsCount > 0 && (
        <View style={styles.actionBar}>
          
          {/* Lewa strona: Cofnij */}
          <TouchableOpacity style={styles.btnUndo} onPress={onUndo} activeOpacity={0.7}>
            <Text style={styles.btnUndoText}>Cofnij</Text>
          </TouchableOpacity>

          {/* Środek: Licznik */}
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{pointsCount} pkt</Text>
          </View>

          {/* Prawa strona: Zapisz */}
          <TouchableOpacity style={styles.btnSave} onPress={onSave} activeOpacity={0.8}>
            <Text style={styles.btnSaveText}>Zapisz</Text>
          </TouchableOpacity>
          
        </View>
      )}
    </View>
  );
};