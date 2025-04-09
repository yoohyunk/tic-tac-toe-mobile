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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ButtonInIndex from "../components/ButtonInIndex";
import { playClickingSound } from "../utils/soundEffects";

export default function preGameSettings() {
  const [inviteCode, setInviteCode] = useState("");

  const handleJoinRoom = () => {
    if (inviteCode.trim() !== "") {
      playClickingSound();
      router.push({ pathname: "/gamePlay", params: { room: inviteCode } });
    }
  };
  const handleExit = () => {
    playClickingSound();
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backToHome} onPress={() => handleExit()}>
        <FontAwesome6 name="arrow-alt-circle-left" size={45} color="#fff" />
      </TouchableOpacity>
      <View style={styles.body}>
        <View>
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
        <View>
          <ButtonInIndex
            text="Play with random user"
            route="/boardSelection"
            param={{ type: "random" }}
            backgroundColor="#56b0e5"
          />
          <ButtonInIndex
            text="Create new room"
            route="/boardSelection"
            param={{ type: "invite" }}
            backgroundColor="#ec647e"
          />
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
    backgroundColor: "#898dc2",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 320,
    alignItems: "center",
  },

  buttonText2: {
    color: "#FFFFFF",
    fontSize: 25,
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
    fontSize: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
});
