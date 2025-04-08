import { useLocalSearchParams, useRouter } from "expo-router";

import { TouchableOpacity, View, Text, StyleSheet, Button } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ButtonInIndex from "../components/ButtonInIndex";
import { playClickingSound } from "../utils/soundEffects";

export default function BoardSelection() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const handleExit = () => {
    playClickingSound();
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backToHome} onPress={() => handleExit()}>
        <FontAwesome6 name="arrow-alt-circle-left" size={45} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.buttonText}>Select Board Size</Text>
      <ButtonInIndex
        text="3 x 3"
        route="/gamePlay"
        param={{ row: 3, type: params.type }}
        backgroundColor="#56b0e5"
      />
      <ButtonInIndex
        text="4 x 4"
        route="/gamePlay"
        param={{ row: 4, type: params.type }}
        backgroundColor="#ec647e"
      />
      <ButtonInIndex
        text="5 x 5"
        route="/gamePlay"
        param={{ row: 5, type: params.type }}
        backgroundColor="#898dc2"
      />
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
