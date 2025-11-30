import React, { useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, View, Dimensions, StyleSheet, Platform } from 'react-native';
import { styles } from './BottomPanel.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.6; 
const COLLAPSED_HEIGHT = 180; 
const HIDDEN_OFFSET = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;

interface BottomPanelProps {
  children: React.ReactNode; // Tu wstrzykniemy zawartość (Explore lub Builder)
  isVisible?: boolean;       // Czy panel ma być w ogóle widoczny?
}

export const BottomPanel: React.FC<BottomPanelProps> = ({ children, isVisible = true }) => {
  const pan = useRef(new Animated.Value(HIDDEN_OFFSET)).current;
  const [isExpanded, setIsExpanded] = useState(false);
  const isExpandedRef = useRef(isExpanded);

  useEffect(() => { isExpandedRef.current = isExpanded; }, [isExpanded]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (Math.abs(gestureState.dy) < 5) return false;
        if (!isExpandedRef.current) return true; 
        // Łap dotyk tylko na górze panelu (uchwyt + nagłówek)
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
        if (gestureState.dy < -50 || gestureState.vy < -0.5) snapToOpen();
        else if (gestureState.dy > 50 || gestureState.vy > 0.5) snapToClosed();
        else isExpandedRef.current ? snapToOpen() : snapToClosed();
      },
    })
  ).current;

  const snapToOpen = () => {
    Animated.spring(pan, { toValue: 0, useNativeDriver: false, bounciness: 4 }).start();
    setIsExpanded(true);
  };

  const snapToClosed = () => {
    Animated.spring(pan, { toValue: HIDDEN_OFFSET, useNativeDriver: false, bounciness: 4 }).start();
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <Animated.View 
      {...panResponder.panHandlers}
      style={[
        styles.container, 
        { 
          height: EXPANDED_HEIGHT, 
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
      {/* Uchwyt jest zawsze ten sam */}
      <View style={styles.handleContainer}>
        <View style={styles.handleBar} />
      </View>

      {/* Tu renderujemy zmienną zawartość */}
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </Animated.View>
  );
};

