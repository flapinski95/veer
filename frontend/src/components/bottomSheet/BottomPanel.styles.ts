import { StyleSheet, Dimensions, Platform } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    zIndex: 100,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  handleContainer: {
    width: '100%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  handleBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
  },
});