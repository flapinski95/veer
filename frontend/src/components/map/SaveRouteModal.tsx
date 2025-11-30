import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { styles } from './SaveRouteModal.styles';

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
    
    // Zamykamy klawiaturę przed zapisem
    Keyboard.dismiss();
    
    setLoading(true);
    await onSave(name, description, isPublic);
    setLoading(false);
    
    // Reset formularza po sukcesie
    setName('');
    setDescription('');
    setIsPublic(false);
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" // Fade wygląda bardziej elegancko dla modali
      onRequestClose={onClose} // Obsługa przycisku wstecz na Androidzie
    >
      {/* Pozwala zamknąć klawiaturę po kliknięciu w tło */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.centeredView}>
          
          {/* Przesuwa modal, gdy wyskakuje klawiatura */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <View style={styles.modalView}>
              
              {/* HEADER */}
              <View style={styles.headerContainer}>
                <Text style={styles.modalTitle}>Zapisz trasę</Text>
                <Text style={styles.modalSubTitle}>Podsumuj swoją wycieczkę</Text>
              </View>

              {/* FORMULARZ */}
              <View style={styles.formContainer}>
                <Text style={styles.label}>NAZWA TRASY</Text>
                <TextInput
                  style={styles.input}
                  placeholder="np. Spacer po Starówce"
                  placeholderTextColor="#C7C7CC"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="sentences"
                />

                <Text style={styles.label}>OPIS (OPCJONALNIE)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Dodaj notatki o trasie..."
                  placeholderTextColor="#C7C7CC"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />

                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Trasa publiczna</Text>
                  <Switch 
                    value={isPublic} 
                    onValueChange={setIsPublic}
                    trackColor={{ false: "#E5E5EA", true: "#34C759" }} // Zielony iOS
                    thumbColor={"#FFFFFF"} 
                    ios_backgroundColor="#E5E5EA"
                  />
                </View>
              </View>

              {/* PRZYCISKI */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnCancel]}>
                  <Text style={styles.btnTextCancel}>Anuluj</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  style={[styles.btn, styles.btnSave, !name.trim() && { opacity: 0.5 }]} // Wygaszenie, gdy brak nazwy
                  disabled={loading || !name.trim()}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnTextSave}>Zapisz</Text>
                  )}
                </TouchableOpacity>
              </View>

            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};