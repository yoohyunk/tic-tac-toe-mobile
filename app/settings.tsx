// src/screens/Settings.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Button,
  ActivityIndicator,
} from "react-native";
import { auth } from "../firebase/firebaseConfig";
import {
  getUserProfile,
  updateNickname,
  updateAvatar,
  UserProfile,
} from "../firebase/auth";
import { avatarMap } from "../utils/randomAvatar";
import { playClickingSound } from "../utils/soundEffects";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ButtonInIndex from "../components/ButtonInIndex";

export default function Settings() {
  const [uid, setUid] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [nickname, setNickname] = useState("");
  const [avatarKey, setAvatarKey] = useState("default");
  const [loading, setLoading] = useState(true);
  const avatarKeys = Object.keys(avatarMap);

  // 1) 마운트 시 프로필 로드
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUid(user.uid);
      (async () => {
        const p = await getUserProfile(user.uid);
        if (p) {
          setProfile(p);
          setNickname(p.nickname);
          setAvatarKey(p.avatarKey);
        }
        setLoading(false);
      })();
    } else {
      setLoading(false);
    }
  }, []);

  const onSave = async () => {
    if (!uid || !profile) return;
    try {
      if (nickname.trim() && nickname.trim() !== profile.nickname) {
        await updateNickname(uid, nickname.trim());
      }
      if (avatarKey && avatarKey !== profile.avatarKey) {
        await updateAvatar(uid, avatarKey);
      }
      const updated = await getUserProfile(uid);
      if (updated) {
        setProfile(updated);
        setNickname(updated.nickname);
        setAvatarKey(updated.avatarKey);
      }
      Alert.alert("Success", "Profile updated.");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };
  const router = useRouter();
  const handleExit = () => {
    playClickingSound();
    router.push("/");
  };

  const handlePress = () => {
    playClickingSound();
    onSave();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backToHome} onPress={() => handleExit()}>
        <FontAwesome6 name="arrow-alt-circle-left" size={45} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Profile Settings</Text>

      <Text style={styles.label}>Nickname</Text>
      <TextInput
        value={nickname}
        onChangeText={setNickname}
        placeholder="Enter new nickname"
        style={styles.input}
      />

      <Text style={styles.label}>Avatar</Text>
      <FlatList
        data={avatarKeys}
        keyExtractor={(k) => k}
        numColumns={4}
        contentContainerStyle={styles.avatarList}
        renderItem={({ item: key }) => {
          const isSelected = key === avatarKey;
          return (
            <TouchableOpacity
              style={[
                styles.avatarWrapper,
                isSelected && styles.avatarSelected,
              ]}
              onPress={() => setAvatarKey(key)}
            >
              <Image
                source={avatarMap[key]}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handlePress();
        }}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  backToHome: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#40395b",
    gap: 20,
    paddingTop: 70,
    paddingBottom: 70,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
  label: { fontSize: 16, marginTop: 10, color: "#FFFFFF", fontWeight: "bold" },
  input: {
    width: 320,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  avatarList: { marginTop: 10 },
  avatarWrapper: {
    margin: 8,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarSelected: {
    borderColor: "#ec647e",
    borderWidth: 4,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  button: {
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
