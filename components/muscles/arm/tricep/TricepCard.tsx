import React from "react";
import MuscleCard from "../../MuscleCard";

interface TricepCardProps {
  onPress: (muscle: string) => void;
}

const TricepCard: React.FC<TricepCardProps> = ({ onPress }) => {
  return <MuscleCard muscle="Tríceps" onPress={() => onPress("Tríceps")} />;
};

export default TricepCard;
