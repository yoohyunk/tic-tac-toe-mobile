import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { removeUserFromRoom } from "../firebase/roomManager";
import { useAuth } from "../contexts/AuthContext";
import { avatarMap } from "../utils/randomAvatar";
import ButtonInIndex from "../components/ButtonInIndex";

export default function GameResult() {
  const { winner } = useLocalSearchParams<{ winner?: string }>();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const { room } = useLocalSearchParams<{ room?: string }>();
  const { user } = useAuth();
  const { row } = useLocalSearchParams<{ row?: string }>();
  const { winnerAvatar } = useLocalSearchParams<{ winnerAvatar?: string }>();
  const rowNumber = row !== undefined ? Number(row) : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <View style={styles.profilePic1}>
        {winnerAvatar ? (
          <Image
            source={avatarMap[winnerAvatar]}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <Text>profile{"\n"}picture</Text>
        )}
      </View>
      <Text style={styles.message}>
        {winner === "Tie"
          ? "It's a Tie!"
          : winner
          ? `Winner: ${winner}`
          : "No winner data found."}
      </Text>
      <View style={styles.buttons}>
        {type === "invite" ? (
          <ButtonInIndex
            text="Continue Game"
            route="/gamePlay"
            param={{ continue: room }}
            backgroundColor="#56b0e5"
          />
        ) : (
          <ButtonInIndex
            text="New Game"
            route="/gamePlay"
            param={{ type, row: rowNumber }}
            backgroundColor="#ec647e"
          />
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#40395b",
    gap: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 55,
    fontWeight: "bold",
  },
  message: {
    fontSize: 50,
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  profilePic1: {
    width: 200,
    height: 200,
    borderWidth: 20,
    borderColor: "#ffe880",
    backgroundColor: "#FFF",
    borderRadius: 100,
    overflow: "hidden",
  },
  buttons: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 20,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 320,
    alignItems: "center",
    backgroundColor: "#ec647e",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
});
