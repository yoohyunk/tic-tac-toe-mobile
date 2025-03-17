import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function BoardSelection() {
  const params = useLocalSearchParams();
  const router = useRouter();

  return (
    <View>
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
