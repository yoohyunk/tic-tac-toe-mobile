import { router } from "expo-router";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { playClickingSound } from "../utils/soundEffects";

interface ButtonInIndexProps {
  text: string;
  route?: string;
  param?: Record<string, any>;
  backgroundColor: string;
}

const ButtonInIndex = ({
  text,
  route,
  param,
  backgroundColor,
}: ButtonInIndexProps) => {
  const handleClick = () => {
    playClickingSound();
    if (route) {
      router.push({ pathname: route, params: param });
    }
  };
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: backgroundColor }]}
      onPress={() => handleClick()}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default ButtonInIndex;
