import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

import React, { useEffect } from "react";
import ButtonInIndex from "../components/ButtonInIndex";
import { playClickingSound } from "../utils/soundEffects";

const index = () => {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle1}>Tic{"      "}</Text>
        <Text style={styles.headerTitle2}>Tac</Text>
        <Text style={styles.headerTitle3}>{"      "}Toe</Text>
      </View>
      <View>
        <ButtonInIndex
          text="MULTIPLAYER"
          route="/preGameSettings"
          backgroundColor="#56b0e5"
        />
        <ButtonInIndex
          text="SINGLEPLAYER"
          route="/gameLevelSelection"
          backgroundColor="#ec647e"
        />
        <ButtonInIndex
          text="SETTINGS"
          route="/settings"
          backgroundColor="#898dc2"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              await logout();
              playClickingSound();
            } catch (error) {
              console.error("Error during logout", error);
            }
          }}
        >
          <Text style={styles.buttonText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#40395b",
    gap: 20,
  },
  header: {
    backgroundColor: "#40395b",
    justifyContent: "space-between",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle1: {
    fontSize: 80,
    fontWeight: "900",
    color: "#53b2df",
    textAlign: "left",
  },
  headerTitle2: {
    fontSize: 80,
    fontWeight: "900",
    color: "#f0857d",
    textAlign: "center",
  },
  headerTitle3: {
    fontSize: 80,
    fontWeight: "900",
    color: "#fff",
    textAlign: "right",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#56b0e5",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 320,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
});
