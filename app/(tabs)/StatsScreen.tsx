import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

interface MuscleData {
  fechas: string[];
  pesos: number[];
}

export default function StatsScreen() {
  const [coreData, setCoreData] = useState<MuscleData | null>(null);
  const [chestData, setChestData] = useState<MuscleData | null>(null);

  useEffect(() => {
    const fetchCoreData = async () => {
      try {
        const response = await fetch("http://3.91.221.110:5000/predict_core", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userid: 1 }),
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setCoreData(data);
      } catch (error) {
        console.error("Error fetching core data:", error);
        Alert.alert("Error", "Failed to fetch core data");
      }
    };

    const fetchChestData = async () => {
      try {
        const response = await fetch("http://3.91.221.110:5000/predict_chest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userid: 1 }),
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setChestData(data);
      } catch (error) {
        console.error("Error fetching chest data:", error);
        Alert.alert("Error", "Failed to fetch chest data");
      }
    };

    fetchCoreData();
    fetchChestData();
  }, []);

  const generateChartData = (data: MuscleData | null) => {
    if (!data || !data.fechas || !data.pesos) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      };
    }

    return {
      labels: data.fechas.map((fecha, index) => (index % 2 === 0 ? fecha : "")), // Mostrar solo etiquetas alternas
      datasets: [
        {
          data: data.pesos,
        },
      ],
    };
  };

  const coreChartData = generateChartData(coreData);
  const chestChartData = generateChartData(chestData);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estadísticas de Core</Text>
      <View style={styles.chartWrapper}>
        {coreData ? (
          <LineChart
            data={coreChartData}
            width={Dimensions.get("window").width * 0.9}
            height={250}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
              propsForLabels: {
                rotation: 45, // Rotar las etiquetas para mejor legibilidad
              },
            }}
            bezier
          />
        ) : (
          <Text>Loading Core Data...</Text>
        )}
      </View>
      <Text style={styles.title}>Estadísticas de Pecho</Text>
      <View style={styles.chartWrapper}>
        {chestData ? (
          <LineChart
            data={chestChartData}
            width={Dimensions.get("window").width * 0.9}
            height={250}
            chartConfig={{
              backgroundColor: "#1cc910",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
              propsForLabels: {
                rotation: 45, // Rotar las etiquetas para mejor legibilidad
              },
            }}
            bezier
          />
        ) : (
          <Text>Loading Chest Data...</Text>
        )}
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
    marginBottom: 30,
  },
});
