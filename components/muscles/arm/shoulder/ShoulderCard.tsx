import React from "react";
import MuscleCard from "../../MuscleCard";

interface ShoulderCardProps {
  onPress: (muscle: string) => void;
}

const ShoulderCard: React.FC<ShoulderCardProps> = ({ onPress }) => {
  return <MuscleCard muscle="Hombros" onPress={() => onPress("Hombros")} />;
};

export default ShoulderCard;
