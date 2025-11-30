// src/components/map/SaveRouteModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface SaveRouteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, isPublic: boolean) => Promise<void>;
}

export const SaveRouteModal: React.FC<SaveRouteModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await onSave(name, description, isPublic);
    setLoading(false);
    // Reset formularza
    setName('');
    setDescription('');
    setIsPublic(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Zakończono nagrywanie</Text>
          <Text style={styles.modalSubTitle}>Podaj szczegóły trasy</Text>

          <TextInput
            style={styles.input}
            placeholder="Nazwa trasy (np. Spacer po plaży)"
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Opis (opcjonalnie)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Trasa publiczna?</Text>
            <Switch 
              value={isPublic} 
              onValueChange={setIsPublic}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isPublic ? "#007AFF" : "#f4f3f4"} 
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnCancel]}>
              <Text style={styles.btnTextCancel}>Odrzuć</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={[styles.btn, styles.btnSave]}
              disabled={loading || !name.trim()}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Zapisz trasę</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  modalSubTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnSave: {
    backgroundColor: '#007AFF',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnTextCancel: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 16,
  },
});