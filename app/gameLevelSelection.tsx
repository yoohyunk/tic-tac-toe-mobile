import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ButtonInIndex from "../components/ButtonInIndex";
import { playClickingSound } from "../utils/soundEffects";

export default function BoardSelection() {
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
      <Text style={styles.buttonText}>Select Level</Text>
      <ButtonInIndex
        text="Easy"
        route="/boardSelection"
        param={{ type: "easy" }}
        backgroundColor="#56b0e5"
      />
      <ButtonInIndex
        text="Hard"
        route="/boardSelection"
        param={{ type: "hard" }}
        backgroundColor="#ec647e"
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
});
