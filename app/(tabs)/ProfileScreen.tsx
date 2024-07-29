import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const token = parsedUser.data.token;
          console.log("Token:", token);

          const response = await fetch(
            `https://entrenatusers.ddns.net/${parsedUser.data.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("API Response status:", response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("User data from API:", data);

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

          setUser(mappedUser);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={{ uri: user.img || "https://via.placeholder.com/150" }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user.Nombre}</Text>
            <Text style={styles.email}>{user.Correo}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/EditProfileScreen")}>
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          {user.Peso && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Tu peso</Text>
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
            onPress={async () => {
              await AsyncStorage.removeItem("user");
              router.push("/LoginScreen");
            }}
            style={styles.button}
          >
            Cerrar Sesión
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
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
  icon: {
    marginLeft: 10,
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
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  button: {
    width: 200,
    marginBottom: -15,
  },
});
