import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";

// Definimos un tipo para el usuario
interface User {
  UserID: number;
  Nombre: string;
  Correo: string;
  img?: string;
  Peso?: number;
  Altura?: number;
  Gender?: string;
  nickname?: string;
  description?: string;
  gym?: string;
}

export default function UserDetailScreen() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const token = parsedUser.token;

          const response = await fetch(`http://172.20.10.2:8082/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Incluye el token de autorización en el formato correcto
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Mapear los datos recibidos a la estructura esperada
          const mappedUser: User = {
            UserID: data.data.UserID,
            Nombre: data.data.Nombre,
            Correo: data.data.Correo,
            Peso: data.data.Peso,
            Altura: data.data.Altura,
            Gender: data.data.Gender,
            nickname: data.data.nickname,
            description: data.data.description,
            gym: data.data.gym,
            img: data.data.img,
          };

          setUser(mappedUser); // Establecer el usuario mapeado
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.img || "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.Nombre}</Text>
          <Text style={styles.email}>{user.Correo}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        {user.Peso && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>{user.Peso} KG</Text>
          </View>
        )}
        {user.Altura && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Altura</Text>
            <Text style={styles.infoValue}>{user.Altura} m</Text>
          </View>
        )}
        {user.Gender && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Género</Text>
            <Text style={styles.infoValue}>{user.Gender}</Text>
          </View>
        )}
        {user.description && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Descripción</Text>
            <Text style={styles.infoValue}>{user.description}</Text>
          </View>
        )}
        {user.gym && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Gimnasio</Text>
            <Text style={styles.infoValue}>{user.gym}</Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.button}
        >
          Volver
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    justifyContent: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#fff",
  },
  email: {
    fontSize: 18,
    color: "gray",
  },
  infoContainer: {
    backgroundColor: "#F04444",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  infoBox: {
    alignItems: "center",
    marginVertical: 10,
  },
  infoLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoValue: {
    color: "#fff",
    fontSize: 24,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: 200,
    marginBottom: -15,
  },
});
