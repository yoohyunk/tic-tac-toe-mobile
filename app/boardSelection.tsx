import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function BoardSelection() {
  const params = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backToHome}
        onPress={() => router.push("/preGameSettings")}
      >
        <FontAwesome6 name="arrow-alt-circle-left" size={45} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.buttonText}>Select Board Size</Text>
      <TouchableOpacity
        style={styles.button1}
        onPress={() => {
          router.push({
            pathname: "/gamePlay",
            params: { row: 3, type: params.type },
          });
        }}
      >
        <Text style={styles.buttonText2}>3 x 3</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button2}
        onPress={() => {
          router.push({
            pathname: "/gamePlay",
            params: { row: 4, type: params.type },
          });
        }}
      >
        <Text style={styles.buttonText2}>4 x 4</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button3}
        onPress={() => {
          router.push({
            pathname: "/gamePlay",
            params: { row: 5, type: params.type },
          });
        }}
      >
        <Text style={styles.buttonText2}>5 x 5</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#b9badf",
    // alignItems: "center",
    // justifyContent: "space-between",
    // height: "100%",
    // padding: 50,
    // zIndex: -1,

    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#40395b",
    gap: 20,
  },
  backToHome: {
    position: "absolute",
    top: 50,
    left: 20,
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
});
