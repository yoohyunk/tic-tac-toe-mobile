import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function GameResult() {
  const { winner } = useLocalSearchParams<{ winner?: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.message}>
        {winner === "Tie"
          ? "It's a Tie!"
          : winner
          ? `Winner: ${winner}`
          : "No winner data found."}
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => router.push("/gamePlay")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 24,
    color: "#333",
  },
  buttons: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 20,
  },
  button: {
    backgroundColor: "#56b0e5",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
  },
});
