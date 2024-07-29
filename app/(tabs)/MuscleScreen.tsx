import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import BackCard from "../../components/muscles/back/BackCard";
import ChestCard from "../../components/muscles/chest/ChestCard";
import AbsCard from "../../components/muscles/core/CoreCard";
import BicepCard from "../../components/muscles/arm/bicep/BicepCard";
import TricepCard from "../../components/muscles/arm/tricep/TricepCard";
import ShoulderCard from "../../components/muscles/arm/shoulder/ShoulderCard";
import LegCard from "../../components/muscles/leg/LegCard";
import BackModal from "../../components/muscles/back/BackModal";
import ChestModal from "../../components/muscles/chest/ChestModal";
import AbsModal from "../../components/muscles/core/CoreModal";
import BicepModal from "../../components/muscles/arm/bicep/BicepModal";
import TricepModal from "../../components/muscles/arm/tricep/TricepModal";
import ShoulderModal from "../../components/muscles/arm/shoulder/ShoulderModal";
import LegModal from "../../components/muscles/leg/LegModal";

export default function MuscleScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const handleCardPress = (muscle: string) => {
    setSelectedMuscle(muscle);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMuscle(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerText}>¿Qué músculo vas a entrenar?</Text>
        <ScrollView contentContainerStyle={styles.cardsContainer}>
          <BackCard onPress={() => handleCardPress("Espalda")} />
          <ChestCard onPress={() => handleCardPress("Pecho")} />
          <AbsCard onPress={() => handleCardPress("Abdomen")} />
          <BicepCard onPress={() => handleCardPress("Bíceps")} />
          <TricepCard onPress={() => handleCardPress("Tríceps")} />
          <ShoulderCard onPress={() => handleCardPress("Hombros")} />
          <LegCard onPress={() => handleCardPress("Pierna")} />
        </ScrollView>
      </View>
      {selectedMuscle === "Espalda" && (
        <BackModal visible={modalVisible} onClose={closeModal} />
      )}
      {selectedMuscle === "Pecho" && (
        <ChestModal visible={modalVisible} onClose={closeModal} />
      )}
      {selectedMuscle === "Abdomen" && (
        <AbsModal visible={modalVisible} onClose={closeModal} />
      )}
      {selectedMuscle === "Bíceps" && (
        <BicepModal visible={modalVisible} onClose={closeModal} />
      )}
      {selectedMuscle === "Tríceps" && (
        <TricepModal visible={modalVisible} onClose={closeModal} />
      )}
      {selectedMuscle === "Hombros" && (
        <ShoulderModal visible={modalVisible} onClose={closeModal} />
      )}
      {selectedMuscle === "Pierna" && (
        <LegModal visible={modalVisible} onClose={closeModal} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  cardsContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
