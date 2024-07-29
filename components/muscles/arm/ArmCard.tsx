import React from "react";
import MuscleCard from "../MuscleCard";

interface ArmCardProps {
  onPress: (muscle: string) => void;
}

const ArmCard: React.FC<ArmCardProps> = ({ onPress }) => {
  return <MuscleCard muscle="Brazo" onPress={() => onPress("Brazo")} />;
};

export default ArmCard;
