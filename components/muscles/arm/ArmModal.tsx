// components/muscles/ChestModal.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";

interface ArmModalProps {
  visible: boolean;
  onClose: () => void;
}

const ArmModal: React.FC<ArmModalProps> = ({ visible, onClose }) => {
  const exercises = [
    "Barbell Bench Press",
    "Dumbell Bench Press",
    "Incline Bench Press",
    "Machine Chest Press",
    "Decline Press",
  ];
  const [weights, setWeights] = useState(Array(exercises.length).fill(""));

  const handleInputChange = (text: string, index: number) => {
    const newWeights = [...weights];
    newWeights[index] = text;
    setWeights(newWeights);
  };

  const handleSave = async () => {
    try {
      const userId = 2;
      const exercisesId = 2;

      const data = {
        userid: userId,
        exercisesid: exercisesId,
        weight: parseFloat(weights[0]),
      };

      const response = await fetch(
        "https://entrenat-gateway.ddns.net/api/v1/add/arm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        alert("Datos registrados correctamente.");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al registrar los datos.");
    }

    onClose();
    setWeights(Array(exercises.length).fill(""));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Ejercicios para Pecho</Text>
          {exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseContainer}>
              <Text style={styles.exerciseText}>{exercise}</Text>
              <TextInput
                style={styles.input}
                placeholder="Kilos"
                keyboardType="numeric"
                value={weights[index]}
                onChangeText={(text) => handleInputChange(text, index)}
              />
            </View>
          ))}
          <Button title="Guardar" onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    position: "relative",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  exerciseText: {
    fontSize: 16,
    flex: 1,
  },
  input: {
    width: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
  },
});

export default ArmModal;
