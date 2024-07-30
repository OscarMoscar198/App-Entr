import React, { useState, useEffect } from "react";
import { View, StyleSheet, ImageBackground, Alert } from "react-native";
import {
  TextInput,
  Text,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthController from "../../interfaces/controllers/AuthController";

const theme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: "#F04444",
  },
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const router = useRouter();
  const API_URL = "http://172.20.10.2:8082";

  useEffect(() => {
    if (loginAttempts >= 3) {
      setIsBlocked(true);
      Alert.alert(
        "Error",
        "Demasiados intentos fallidos. Inténtalo más tarde."
      );
    }
  }, [loginAttempts]);

  const handleLogin = async () => {
    if (isBlocked) {
      Alert.alert(
        "Error",
        "Demasiados intentos fallidos. Inténtalo más tarde."
      );
      return;
    }

    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      console.log("Iniciando sesión...");
      const authController = new AuthController(API_URL);
      const data = await authController.login(email, password);

      console.log("Inicio de sesión exitoso");

      if (data && data.data && data.data.token) {
        console.log("Inicio de sesión exitoso");
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ data: { id: data.data.id, token: data.data.token } })
        );
        router.push("/HomeScreen");
      } else {
        setLoginAttempts(loginAttempts + 1);
        console.error("Error en el inicio de sesión: Credenciales inválidas");
        Alert.alert("Error", "Credenciales incorrectas. Inténtalo de nuevo.");
      }
    } catch (error) {
      setLoginAttempts(loginAttempts + 1);
      console.error("Error en el inicio de sesión", error);
      Alert.alert("Error", "Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <PaperProvider theme={theme}>
      <ImageBackground
        source={require("../../assets/background/login/login.jpg")}
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
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              mode="outlined"
              placeholder="Email"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
              autoComplete="off"
              keyboardType="email-address"
              autoCorrect={false}
              theme={{ colors: { text: "white", primary: "#F04444" } }}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="off"
              autoCorrect={false}
              theme={{ colors: { text: "white", primary: "#F04444" } }}
            />
            <Button mode="contained" onPress={handleLogin}>
              Iniciar Sesión
            </Button>
            <View style={styles.textRegister}>
              <Text style={{ color: "white" }}>
                No tienes una cuenta?{" "}
                <Link style={styles.textRegister} href="/RegisterScreen">
                  Regístrate!
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
    color: "white",
  },
  inputContainer: {
    flex: 2,
    justifyContent: "center",
    alignSelf: "center",
    width: "90%",
  },
  input: {
    marginBottom: 16,
  },
  textCenter: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  textRegister: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
    color: "white",
  },
  registerText: {
    fontWeight: "bold",
    color: "white",
  },
});
