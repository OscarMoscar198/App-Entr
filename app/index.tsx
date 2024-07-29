import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";
import {
  Button,
  Text,
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: "#F04444",
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <ImageBackground
        source={require("../assets/background/welcome/welcome.jpg")}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View style={styles.overlay} />
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo/logo.png")} // Asegúrate de que la ruta a la imagen del logo sea correcta
              style={styles.logo}
            />
          </View>
          <Text style={styles.text} variant="displaySmall">
            Comienza el cambio
          </Text>
          <Text style={styles.text} variant="headlineSmall">
            Tú tienes el poder
          </Text>
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => router.push("/LoginScreen")}
          >
            Comenzar
          </Button>
        </View>
      </ImageBackground>
      <StatusBar style="light" />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 16,
    paddingBottom: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  logoContainer: {
    position: "absolute",
    top: -350,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150, // Ajusta el tamaño según necesites
    height: 150, // Ajusta el tamaño según necesites
  },
  text: {
    color: "white",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
});
