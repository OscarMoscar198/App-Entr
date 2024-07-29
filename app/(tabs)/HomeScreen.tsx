import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser.data.id);
      }
    };

    fetchUserId();
  }, []);

  const handleCardPress = (muscle: string) => {
    setSelectedMuscle(muscle);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMuscle(null);
  };

  if (userId === null) {
    return (
      <View>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

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
        <BackModal
          visible={modalVisible}
          onClose={closeModal}
          userId={userId}
        />
      )}
      {selectedMuscle === "Pecho" && (
        <ChestModal
          visible={modalVisible}
          onClose={closeModal}
          userId={userId}
        />
      )}
      {selectedMuscle === "Abdomen" && (
        <AbsModal visible={modalVisible} onClose={closeModal} userId={userId} />
      )}
      {selectedMuscle === "Bíceps" && (
        <BicepModal
          visible={modalVisible}
          onClose={closeModal}
          userId={userId}
        />
      )}
      {selectedMuscle === "Tríceps" && (
        <TricepModal
          visible={modalVisible}
          onClose={closeModal}
          userId={userId}
        />
      )}
      {selectedMuscle === "Hombros" && (
        <ShoulderModal
          visible={modalVisible}
          onClose={closeModal}
          userId={userId}
        />
      )}
      {selectedMuscle === "Pierna" && (
        <LegModal visible={modalVisible} onClose={closeModal} userId={userId} />
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
  loadingText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
  },
});
