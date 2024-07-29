import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";

interface ExerciseData {
  exercise: string;
  weight: number;
}

export default function StatsScreen() {
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        { exercise: "Pecho", weight: 100 },
        { exercise: "Espalda", weight: 150 },
        { exercise: "Abdomen", weight: 30 },
        { exercise: "Brazo", weight: 70 },
        { exercise: "Pierna", weight: 120 },
      ];
      setExerciseData(data);
    };

    fetchData();
  }, []);

  const pieChartData = exerciseData.map((data, index) => ({
    name: data.exercise,
    population: data.weight,
    color: `rgba(131, 167, 234, ${1 - index * 0.2})`,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estadísticas de Peso por Ejercicio</Text>
      <View style={styles.chartWrapper}>
        <View style={styles.chartContainer}>
          <PieChart
            data={pieChartData}
            width={Dimensions.get("window").width * 0.9}
            height={250}
            chartConfig={{
              backgroundColor: "#1cc910",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"80"}
            hasLegend={false}
            absolute
          />
        </View>
        <View style={styles.legendContainer}>
          {pieChartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Text
                style={styles.legendText}
              >{`${item.population} ${item.name}`}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  chartWrapper: {
    width: "100%",
    alignItems: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "90%",
    maxWidth: 400,
  },
  legendContainer: {
    marginTop: 20,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  legendText: {
    fontSize: 15,
    color: "#7F7F7F",
  },
});
