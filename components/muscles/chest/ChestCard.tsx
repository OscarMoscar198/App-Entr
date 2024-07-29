import React from "react";
import MuscleCard from "../MuscleCard";

interface ChestCardProps {
  onPress: (muscle: string) => void;
}

const ChestCard: React.FC<ChestCardProps> = ({ onPress }) => {
  return <MuscleCard muscle="Pecho" onPress={() => onPress("Pecho")} />;
};

export default ChestCard;
