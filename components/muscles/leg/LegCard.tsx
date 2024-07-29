import React from "react";
import MuscleCard from "../MuscleCard";

interface LegCardProps {
  onPress: (muscle: string) => void;
}

const LegCard: React.FC<LegCardProps> = ({ onPress }) => {
  return <MuscleCard muscle="Pierna" onPress={() => onPress("Pierna")} />;
};

export default LegCard;
