import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './RoutePanel.styles'; 
import { RoutePoint } from '../../map/RoutePanel';
import { PoiDetails } from '../../../services/mapboxService';

interface RouteBuilderViewProps {
  waypoints: RoutePoint[];
  routeStats: { dist: number; dur: number } | null;
  hasTempPoint: boolean;
  tempPointName?: string;
  tempPointDetails: PoiDetails | null;
  isLoadingDetails: boolean;
  onAddTempPoint: () => void;
  onRemovePoint: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onSave: () => void;
  onCancelSelection: () => void;
  
  // NOWY PROP: Wyjście z trybu tworzenia
  onCancel: () => void; 
}

export const RouteBuilderView: React.FC<RouteBuilderViewProps> = (props) => {
  const {
    waypoints, routeStats, hasTempPoint, tempPointName, 
    onAddTempPoint, onRemovePoint, onMoveUp, onMoveDown, onSave, onCancelSelection,
    onCancel // <--- Odbieramy
  } = props;

  const distKm = routeStats ? (routeStats.dist / 1000).toFixed(2) : '0.00';
  const hours = routeStats ? Math.floor(routeStats.dur / 3600) : 0;
  const minutes = routeStats ? Math.floor((routeStats.dur % 3600) / 60) : 0;
  const timeString = routeStats ? (hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`) : '-- min';

  return (
    <View style={{ flex: 1 }}>
      
      {/* --- SCENARIUSZ A: PUNKT TYMCZASOWY (BEZ ZMIAN) --- */}
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
            <Text style={styles.addButtonText}>Dodaj</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- SCENARIUSZ B: LISTA I STATYSTYKI --- */}
      {!hasTempPoint && (
        <View style={styles.content}>
          
          {/* NOWY NAGŁÓWEK Z PRZYCISKIEM ZAMKNIĘCIA */}
          <View style={styles.builderHeader}>
            <Text style={styles.builderTitle}>Nowa trasa</Text>
            <TouchableOpacity style={styles.closeBuilderBtn} onPress={onCancel}>
              <Text style={styles.closeBuilderText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Statystyki */}
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

          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {waypoints.length === 0 ? (
               <View style={{padding: 40, alignItems: 'center'}}>
                 <Text style={{color: '#8E8E93', textAlign: 'center'}}>
                   Kliknij na mapie lub wyszukaj miejsce,{"\n"}aby dodać pierwszy punkt.
                 </Text>
               </View>
            ) : (
                waypoints.map((point, index) => (
                  <View key={point.id} style={styles.pointRow}>
                    <View style={[styles.pointIndex, index === 0 ? styles.startIndex : (index === waypoints.length-1 ? styles.stopIndex : null)]}>
                      <Text style={(index === 0 || index === waypoints.length-1) ? styles.pointIndexTextWhite : styles.pointIndexText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.pointName} numberOfLines={1}>{point.name}</Text>
                    <View style={styles.actions}>
                      {index > 0 && <TouchableOpacity onPress={() => onMoveUp(index)} style={styles.actionBtn}><Text style={styles.arrow}>↑</Text></TouchableOpacity>}
                      {index < waypoints.length - 1 && <TouchableOpacity onPress={() => onMoveDown(index)} style={styles.actionBtn}><Text style={styles.arrow}>↓</Text></TouchableOpacity>}
                      <TouchableOpacity onPress={() => onRemovePoint(index)} style={styles.deleteBtn}><Text style={styles.deleteText}>✕</Text></TouchableOpacity>
                    </View>
                  </View>
                ))
            )}
          </ScrollView>

          <View style={styles.footer}>
             <Text style={styles.counterText}>{waypoints.length} przystanki</Text>
             <TouchableOpacity style={[styles.saveButton, waypoints.length < 2 && styles.disabledButton]} onPress={onSave} disabled={waypoints.length < 2}>
               <Text style={styles.saveButtonText}>Zapisz trasę</Text>
             </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};