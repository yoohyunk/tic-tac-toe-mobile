import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

import React, { useEffect } from "react";
import SignIn from "./signIn";

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
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/preGameSettings")}
        >
          <Text style={styles.buttonText}>MULTIPLAYER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => router.push("/preGameSettings")}
        >
          <Text style={styles.buttonText}>SINGLEPLAYER</Text>
        </TouchableOpacity>
        <View style={styles.button3}>
          <Text style={styles.buttonText}>SETTINGS</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              await logout();
              console.log("Logged out successfully");
            } catch (error) {
              console.error("Error during logout", error);
            }
          }}
        >
          <Text style={styles.buttonText}>SIGN IN</Text>
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },
});
