import React from "react";
import MuscleCard from "../MuscleCard";

interface CoreCardProps {
  onPress: (muscle: string) => void;
}

const CoreCard: React.FC<CoreCardProps> = ({ onPress }) => {
  return <MuscleCard muscle="Abdomen" onPress={() => onPress("Abdomen")} />;
};

export default CoreCard;
