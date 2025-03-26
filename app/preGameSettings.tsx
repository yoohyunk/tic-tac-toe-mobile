import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function preGameSettings() {
  const [inviteCode, setInviteCode] = useState("");

  const handleJoinRoom = () => {
    if (inviteCode.trim() !== "") {
      router.push({ pathname: "/gamePlay", params: { room: inviteCode } });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backToHome}
        onPress={() => router.push("/")}
      >
        <FontAwesome6 name="arrow-alt-circle-left" size={45} color="#fff" />
      </TouchableOpacity>
      <View style={styles.body}>
        <View>
          <TouchableOpacity
            style={styles.button1}
            onPress={() =>
              router.push({
                pathname: "/boardSelection",
                params: { type: "random" },
              })
            }
          >
            <Text style={styles.buttonText2}>Play with random user</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button1}
            onPress={() =>
              router.push({
                pathname: "/boardSelection",
                params: { type: "invite" },
              })
            }
          >
            <Text style={styles.buttonText2}>create new room</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter invitation code"
            value={inviteCode}
            onChangeText={setInviteCode}
          />
          <TouchableOpacity
            style={[
              styles.button1,
              inviteCode.trim() === "" && styles.buttonDisabled,
            ]}
            onPress={handleJoinRoom}
            disabled={inviteCode.trim() === ""}
          >
            <Text style={styles.buttonText2}>join the room with code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 60,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    backgroundColor: "#b9badf",
    zIndex: -1,
  },

  backToHome: {
    position: "absolute",
    top: 50,
    left: 20,
  },

  button: {
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
  button1: {
    backgroundColor: "#56b0e5",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 320,
    alignItems: "center",
  },
  button2: {
    backgroundColor: "#ec647e",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 320,
    alignItems: "center",
  },
  button3: {
    width: 320,
    backgroundColor: "#898dc2",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,

    alignItems: "center",
  },
  buttonText2: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },
  input: {
    width: 320,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
});
