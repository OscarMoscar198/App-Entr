import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import { Link, useRouter } from "expo-router";

const theme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: "#F04444",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  text: {
    color: "white",
    marginBottom: 10,
    textAlign: "center", // Centra el texto
  },
  button: {
    width: "100%",
    marginBottom: 20,
    alignSelf: "center", // Centra el botón
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 10, // Hace que los inputs sean un poco más redondos
    alignSelf: "center", // Centra los inputs
  },
  textContainer: {
    flex: 1,
    justifyContent: "center", // Centra el contenedor de texto
    color: "white",
  },
  textCenter: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  inputContainer: {
    alignItems: "center", // Centra los inputs a lo largo del eje transversal (horizontal en este caso)
  },
});

const cleanInput = (input: string) => {
  return encodeURIComponent(
    input
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Normalización para remover acentos
      .replace(/['"]/g, "") // Remover comillas simples y dobles
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remover scripts
  );
};

export default function RegisterScreen() {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [sex, setSex] = useState("");
  const router = useRouter();
  const API_URL = "http://172.20.10.2:8082";
  const CHECK_TEXT_URL = "http://18.234.203.47:5000/check";

  const generateNickname = () => {
    const randomNumbers = Math.floor(10000 + Math.random() * 90000); // Genera 5 números aleatorios
    return `User${randomNumbers}`;
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
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
      return data.contains_profanity; // Devuelve true si el texto contiene palabras inapropiadas
    } catch (error) {
      return false; // En caso de error, asumir que el texto es válido para no bloquear el flujo
    }
  };

  const handleRegister = async () => {
    const cleanedName = cleanInput(name);
    const cleanedEmail = cleanInput(email);
    const cleanedPassword = cleanInput(password);
    const cleanedConfirmPassword = cleanInput(confirmPassword);
    const cleanedWeight = cleanInput(weight);
    const cleanedHeight = cleanInput(height);
    const cleanedSex = cleanInput(sex);

    if (!validatePassword(cleanedPassword)) {
      Alert.alert(
        "Error",
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un símbolo."
      );
      return;
    }

    if (cleanedPassword !== cleanedConfirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      // Verificar si hay palabras inapropiadas en los campos de nombre y sexo
      const results = await Promise.all([
        checkInappropriateWords(decodeURIComponent(cleanedName)),
        checkInappropriateWords(decodeURIComponent(cleanedSex)),
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

    console.log("Realizando petición de registro...");
    const nickname = generateNickname(); // Genera el nickname

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: decodeURIComponent(cleanedName),
          email: decodeURIComponent(cleanedEmail),
          password: decodeURIComponent(cleanedPassword),
          height: parseFloat(decodeURIComponent(cleanedHeight)),
          weight: parseFloat(decodeURIComponent(cleanedWeight)),
          sex: decodeURIComponent(cleanedSex),
          nickname, // Incluye el nickname en los datos del registro
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (response.ok) {
        console.log("Registro exitoso");

        // Inicia sesión automáticamente para obtener el token
        const loginResponse = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: decodeURIComponent(cleanedEmail),
            password: decodeURIComponent(cleanedPassword),
          }),
        });

        if (!loginResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.data && loginData.data.token) {
          const token = loginData.data.token; // Asegúrate de obtener el token del inicio de sesión

          if (token) {
            // Registro de configuración del usuario
            const userID = data.data.id; // Asegúrate de obtener el ID del usuario del registro

            const configResponse = await fetch(`${API_URL}/config/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Incluye el token de autenticación
              },
              body: JSON.stringify({
                userID,
              }),
            });

            if (!configResponse.ok) {
              throw new Error("Network response was not ok");
            }

            if (configResponse.ok) {
              console.log("User configuration created successfully.");
              router.push("/LoginScreen");
            } else {
              const configData = await configResponse.json();
              console.error("Configuration error:", configData);
              Alert.alert(
                "Configuration failed: " +
                  (configData.message || "Unknown error")
              );
            }
          } else {
            console.error("Login failed: No token received");
            Alert.alert("Login failed: No token received");
          }
        } else {
          console.error("Login error");
          Alert.alert(
            "Login failed: " + (loginData.message || "Unknown error")
          );
        }
      } else {
        console.error("Registration error");
        Alert.alert(
          "Registration failed: " + (data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("An error occurred during registration.");
    }
  };

  return (
    <PaperProvider theme={theme}>
      <ImageBackground
        source={require("../../assets/background/register/register.jpg")}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View style={styles.overlay} />
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.textCenter} variant="displaySmall">
              Bienvenido Atleta!
            </Text>
            <Text style={styles.textCenter} variant="titleLarge">
              Por favor ingresa tus datos.
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={name}
            onChangeText={setUsername}
            autoComplete="off" // Desactiva el autocompletado
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            textContentType="emailAddress"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoComplete="off" // Desactiva el autocompletado
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="off" // Desactiva el autocompletado
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="off" // Desactiva el autocompletado
          />
          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            value={weight}
            onChangeText={(text) => {
              const parsedValue = parseFloat(text);
              if (!isNaN(parsedValue) && parsedValue <= 300) {
                setWeight(text);
              } else if (text === "") {
                setWeight(text);
              }
            }}
            keyboardType="numeric"
            autoComplete="off" // Desactiva el autocompletado
          />
          <TextInput
            style={styles.input}
            placeholder="Altura (m)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            autoComplete="off" // Desactiva el autocompletado
          />
          <TextInput
            style={styles.input}
            placeholder="Sexo"
            value={sex}
            onChangeText={setSex}
            autoComplete="off" // Desactiva el autocompletado
          />
          <Button
            style={styles.button}
            mode="contained"
            onPress={handleRegister}
          >
            Registrarme
          </Button>
          <Text style={{ color: "white" }}>
            ¿Ya tienes una cuenta?{" "}
            <Link style={{ color: "white" }} href="/LoginScreen">
              Inicia sesión!
            </Link>
          </Text>
        </View>
      </ImageBackground>
    </PaperProvider>
  );
}
