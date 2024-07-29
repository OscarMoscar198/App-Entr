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

interface ExerciseModalProps {
  visible: boolean;
  muscle: string;
  exercises: string[];
  onClose: () => void;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  visible,
  muscle,
  exercises,
  onClose,
}) => {
  const [weights, setWeights] = useState(Array(exercises.length).fill(""));

  const handleInputChange = (text: string, index: number) => {
    const newWeights = [...weights];
    newWeights[index] = text;
    setWeights(newWeights);
  };

  const handleSave = async () => {
    try {
      const userId = 2; // ID de usuario fijo para el registro
      const exercisesId = 1; // ID de ejercicio fijo para el registro

      // Solo envía los datos del primer ejercicio registrado
      const data = {
        userid: userId,
        exercisesid: exercisesId,
        weight: parseFloat(weights[0]),
      };

      const response = await fetch("http://172.20.10.2:8083/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.status === "success") {
        console.log("Registro exitoso:", result.data);
        alert("Datos registrados correctamente.");
      } else {
        console.error("Error en el registro:", result);
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Error al registrar los datos:", error);
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
          <Text style={styles.modalHeader}>Ejercicios para {muscle}</Text>
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
    position: "relative", // Para posicionar absolutamente el botón de cierre
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

export default ExerciseModal;
