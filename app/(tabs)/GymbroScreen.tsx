import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Searchbar, Card } from "react-native-paper";
import { useRouter } from "expo-router";

interface User {
  UserID: number;
  Nombre: string;
  Correo: string;
  img?: string;
}

export default function GymbroScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const router = useRouter();
  const API_URL = "http://172.20.10.2:8082";

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setUsers(responseData.data);
      setFilteredUsers(responseData.data);
    } catch (error) {
      console.error("Error al obtener los usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUserCard = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "UserDetailScreen",
          params: { userId: item.UserID },
        })
      }
    >
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={{ uri: item.img || "https://via.placeholder.com/150" }} // Utiliza la URL de la imagen si está disponible, de lo contrario, una imagen predeterminada
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{item.Nombre}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter((user) =>
        user.Nombre.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>GymBros</Text>
      <Searchbar
        placeholder="Buscar"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      {filteredUsers.length > 0 ? (
        <FlatList
          style={styles.list}
          data={filteredUsers}
          keyExtractor={(item) => item.Correo}
          renderItem={renderUserCard}
        />
      ) : (
        <Text style={styles.noUsersText}>No se encontraron usuarios</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1E1E1E",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 16,
  },
  searchbar: {
    marginBottom: 20,
    borderRadius: 10,
  },
  list: {
    width: "100%",
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#F04444",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "#fff",
  },
  userName: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  noUsersText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});
