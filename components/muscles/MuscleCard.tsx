import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, TouchableRipple } from "react-native-paper";

interface MuscleCardProps {
  muscle: string;
  onPress: () => void;
}

const MuscleCard: React.FC<MuscleCardProps> = ({ muscle, onPress }) => {
  return (
    <Card style={styles.card}>
      <TouchableRipple onPress={onPress}>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>{muscle}</Text>
        </View>
      </TouchableRipple>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  cardText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
});

export default MuscleCard;
