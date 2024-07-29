import React from "react";
import MuscleCard from "../../MuscleCard";

interface BicepCardProps {
  onPress: (muscle: string) => void;
}

const BicepCard: React.FC<BicepCardProps> = ({ onPress }) => {
  return <MuscleCard muscle="Bíceps" onPress={() => onPress("Bíceps")} />;
};

export default BicepCard;
