import React from "react";
import MuscleCard from "../MuscleCard";

interface BackCardProps {
  onPress: (muscle: string) => void;
}

const BackCard: React.FC<BackCardProps> = ({ onPress }) => {
  return <MuscleCard muscle="Espalda" onPress={() => onPress("Espalda")} />;
};

export default BackCard;
