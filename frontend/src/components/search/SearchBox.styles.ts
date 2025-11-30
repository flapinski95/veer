import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    width: '90%',
    alignSelf: 'center',
    zIndex: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  iconContainer: {
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
  },
  clearButton: {
    padding: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  resultsBox: {
    maxHeight: 250, // Zwiększamy nieco, by zmieścić nagłówek
    backgroundColor: 'white',
    marginTop: 8,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultText: {
    fontSize: 15,
    color: '#333',
  },
  // --- NOWE STYLE DLA HISTORII ---
  historyHeader: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyHeaderText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});