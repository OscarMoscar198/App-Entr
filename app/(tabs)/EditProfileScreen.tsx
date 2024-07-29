import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

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
  token?: string; // Añadido para incluir el token
}

const CHECK_TEXT_URL = "http://18.234.203.47:5000/check";

export default function EditProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [gym, setGym] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const token = parsedUser.data.token;
          const userId = parsedUser.data.id;
          console.log("Token:", token);

          const response = await fetch(
            `https://entrenatusers.ddns.net/${userId}`,
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
            token,
          };

          setUser(mappedUser);
          setName(mappedUser.Nombre);
          setWeight(mappedUser.Peso ? mappedUser.Peso.toString() : "");
          setHeight(mappedUser.Altura ? mappedUser.Altura.toString() : "");
          setGender(mappedUser.Gender || "");
          setNickname(mappedUser.nickname || "");
          setDescription(mappedUser.description || "");
          setGym(mappedUser.gym || "");
          setImage(mappedUser.img || undefined);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const token = parsedUser.data.token;
        const userId = parsedUser.data.id;

        const formData = new FormData();
        formData.append("image", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any);
        formData.append("user_id", userId);
        formData.append("token", token);

        try {
          let response;
          if (image) {
            response = await fetch(
              `http://34.201.87.239:5000/image/${userId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                body: formData,
              }
            );
          } else {
            response = await fetch("http://34.201.87.239:5000/upload", {
              method: "POST",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              body: formData,
            });
          }

          const textResponse = await response.text();
          try {
            const data = JSON.parse(textResponse);
            console.log("Upload response data:", data);

            if (data.explicit === "false") {
              setImage(result.assets[0].uri);
              Alert.alert("Éxito", "Imagen subida correctamente.");
            } else {
              Alert.alert(
                "Imagen inválida",
                "La imagen contiene contenido inapropiado."
              );
            }
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            console.error("Response was:", textResponse);
            Alert.alert(
              "Error",
              "Error al subir la imagen, la respuesta del servidor no es válida."
            );
          }
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          Alert.alert(
            "Error",
            "Error al subir la imagen, la imagen tiene contenido inapropiado."
          );
        }
      }
    }
  };

  const checkInappropriateWords = async (text: string) => {
    try {
      const response = await fetch(CHECK_TEXT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Check inappropriate words response:", data);
      return data.contains_profanity;
    } catch (error) {
      console.error("Error checking text:", error);
      return false;
    }
  };

  const handleSave = async () => {
    try {
      const results = await Promise.all([
        checkInappropriateWords(name),
        checkInappropriateWords(gender),
        checkInappropriateWords(description),
        checkInappropriateWords(nickname),
        checkInappropriateWords(gym),
      ]);

      const hasInappropriateWords = results.some((result) => result);

      if (hasInappropriateWords) {
        Alert.alert(
          "Error",
          "Uno o más campos contienen palabras inapropiadas. Por favor, cámbialo."
        );
        return;
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al verificar el texto.");
      return;
    }

    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData && user?.UserID !== undefined) {
        const parsedUser = JSON.parse(userData);
        const token = parsedUser.data.token;

        console.log("Saving user with ID:", user.UserID);
        console.log(
          "Request body:",
          JSON.stringify({
            id: user.UserID,
            Nombre: name,
            Altura: parseFloat(height),
            Peso: parseFloat(weight),
            Gender: gender,
            nickname,
            description,
            img: image,
            gym,
          })
        );

        const response = await fetch(`https://entrenatusers.ddns.net/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: user.UserID,
            Nombre: name,
            Altura: parseFloat(height),
            Peso: parseFloat(weight),
            Gender: gender,
            nickname,
            description,
            img: image,
            gym,
          }),
        });

        console.log("Update API Response status:", response.status);

        const responseData = await response.text();
        console.log("Update API Response body:", responseData);

        if (response.ok) {
          const updatedUser: User = {
            ...user,
            Nombre: name,
            Peso: parseFloat(weight),
            Altura: parseFloat(height),
            Gender: gender,
            nickname,
            description,
            gym,
            img: image,
            token,
          };
          await AsyncStorage.setItem(
            "user",
            JSON.stringify({ data: updatedUser })
          );
          setUser(updatedUser);
          router.push("/HomeScreen");
        } else {
          console.log("Error response:", responseData);
          alert("Error al guardar los cambios: " + responseData);
        }
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("An error occurred while saving changes.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Editar Perfil</Text>
      <View style={styles.container}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Peso</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Altura</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Género</Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
        />
        <Text style={styles.label}>Apodo</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
        />
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.label}>Gimnasio</Text>
        <TextInput style={styles.input} value={gym} onChangeText={setGym} />

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Guardar Cambios
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  container: {
    flex: 1,
  },
  label: {
    marginVertical: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
  },
  imageButton: {
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  imageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
