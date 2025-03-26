import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { removeUserFromRoom } from "../firebase/roomManager";
import { useAuth } from "../contexts/AuthContext";

export default function GameResult() {
  const { winner } = useLocalSearchParams<{ winner?: string }>();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const { room } = useLocalSearchParams<{ room?: string }>();
  const { user } = useAuth();
  const { row } = useLocalSearchParams<{ row?: string }>();
  const rowNumber = row !== undefined ? Number(row) : undefined;

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
        {type === "invite" ? (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/gamePlay",
                params: { continue: room }, // 'room' is the invite room ID
              })
            }
            style={styles.button}
          >
            <Text style={styles.buttonText}>Continue Game</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push({
                pathname: "/gamePlay",
                params: { row: rowNumber, type: type },
              });
            }}
          >
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={async () => {
            if (room && user) {
              await removeUserFromRoom(room, user.uid);
            }
            router.push("/");
          }}
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
