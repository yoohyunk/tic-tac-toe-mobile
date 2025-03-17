import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

export default function preGameSettings() {
  // const [rows, setRows] = useState(3);
  // const [cols, setCols] = useState(3);
  const [inviteCode, setInviteCode] = useState("");

  const handleJoinRoom = () => {
    // Only navigate if inviteCode is not empty
    if (inviteCode.trim() !== "") {
      router.push({ pathname: "/gamePlay", params: { room: inviteCode } });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
        >
          <Text style={styles.buttonText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.level}>Level 0</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>X</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.profiles}>
          <View style={styles.profile}>
            <Text>Player 1</Text>
            <View style={styles.profileImageContainer}>
              <View style={styles.profilePic1}>
                <Text>profile {"\n"}picture</Text>
              </View>
              <View style={styles.cross}>
                <Text style={styles.crossText}>X</Text>
              </View>
            </View>
          </View>
          <View style={styles.profile}>
            <Text>Player 2</Text>
            <View style={styles.profileImageContainer}>
              <View style={styles.profilePic2}>
                <Text>profile {"\n"}picture</Text>
              </View>
              <View style={styles.circle}>
                <Text style={styles.circleText}>O</Text>
              </View>
            </View>
          </View>
        </View>
        {/* <View>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => {
              setCols(3);
              setRows(3);
            }}
          >
            <Text style={styles.buttonText2}>3 x 3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => {
              setCols(4);
              setRows(4);
            }}
          >
            <Text style={styles.buttonText2}>4 x 4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button3}
            onPress={() => {
              setCols(5);
              setRows(5);
            }}
          >
            <Text style={styles.buttonText2}>5 x 5</Text>
          </TouchableOpacity>
        </View> */}

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

      {/* <View style={styles.footer}>
        <Text style={styles.footerText}>Points:3000</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#40395b",

    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 60,
  },
  footer: {
    backgroundColor: "#f0857d",
    width: "40%",
    height: 70,
    padding: 10,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "600",
    textAlign: "center",
  },
  level: {
    fontSize: 25,
    fontWeight: "600",
    borderRadius: 40,
    backgroundColor: "#4c436c",
    paddingVertical: 5,
    paddingHorizontal: 20,

    color: "#FFFFFF",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    backgroundColor: "#b9badf",
    zIndex: -1,
  },
  profiles: {
    flexDirection: "row",
    justifyContent: "space-between",

    width: "100%",
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  profileImageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  cross: {
    position: "absolute",
    bottom: -10,
    right: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  crossText: {
    color: "#e76679",
    fontSize: 30,
    fontWeight: "900",
  },
  circle: {
    position: "absolute",
    bottom: -10,
    right: -10,
    borderRadius: 40,
    backgroundColor: "#fff",
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  circleText: {
    color: "#53b2df",
    fontSize: 30,
    fontWeight: "900",
  },
  profile: {
    alignItems: "center",
    gap: 10,
  },
  profilePic1: {
    borderWidth: 20,
    borderColor: "#e76679",
    backgroundColor: "#FFF",

    paddingHorizontal: 13,
    paddingVertical: 20,
    borderRadius: 100,
  },
  profilePic2: {
    borderWidth: 20,
    borderColor: "#53b2df",
    backgroundColor: "#FFF",

    paddingHorizontal: 13,
    paddingVertical: 20,
    borderRadius: 100,
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
