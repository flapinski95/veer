import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  // Tło modala (przyciemnienie)
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // Nieco lżejsze przyciemnienie
    padding: 20,
  },
  
  // Karta modala
  modalView: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'white',
    borderRadius: 24, // Duże zaokrąglenie
    padding: 24,
    
    // Modern Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  // Nagłówki
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubTitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },

  // Formularz
  formContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F2F2F7', // Jasnoszare tło (iOS style)
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // Ważne dla Androida
    paddingTop: 14,
  },

  // Przełącznik (Switch Row)
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9', // Osobny kontener dla switcha
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },

  // Przyciski
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: {
    backgroundColor: '#F2F2F7',
  },
  btnSave: {
    backgroundColor: '#34C759', // Success Green (spójne z resztą apki)
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnTextCancel: {
    color: '#8E8E93',
    fontWeight: '600',
    fontSize: 16,
  },
  btnTextSave: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});