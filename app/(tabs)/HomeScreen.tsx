import { StyleSheet, Text, View } from "react-native";
import React from "react";
import BottomNavigationBar from "@/components/Navigation/NavigationBar";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <BottomNavigationBar />
    </View>
  );
}

const styles = StyleSheet.create({});
