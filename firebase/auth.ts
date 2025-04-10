import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, firestore } from "./firebaseConfig";
import { avatarMap, randomAvatarKey } from "../utils/randomAvatar";
import type { ImageSourcePropType } from "react-native";

export interface UserProfile {
  uid: string;
  nickname: string;
  avatar: ImageSourcePropType;
  avatarKey: string;
}

export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  if (!user) throw new Error("Login failed: No user data found");
  return user;
};

export const signup = async (
  email: string,
  password: string,
  nickname: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  if (!user) throw new Error("Signup error: No user data found");

  const usersRef = collection(firestore, "users");
  const nickQuery = query(usersRef, where("nickname", "==", nickname));
  const nickSnap = await getDocs(nickQuery);
  if (!nickSnap.empty) {
    throw new Error("This nickname is already taken.");
  }

  const avatarKey = randomAvatarKey();
  await setDoc(doc(firestore, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    nickname,
    avatar: avatarKey,
  });

  return { uid: user.uid, email: user.email, nickname };
};

export const logout = async () => {
  await signOut(auth);
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userDocRef = doc(firestore, "users", uid);
  const userSnap = await getDoc(userDocRef);
  if (!userSnap.exists()) return null;

  const data = userSnap.data();
  const nickname = typeof data.nickname === "string" ? data.nickname : "Player";

  const key =
    typeof data.avatar === "string" && avatarMap[data.avatar]
      ? data.avatar
      : "default";

  return {
    uid,
    nickname,
    avatarKey: key,
    avatar: avatarMap[key],
  };
};

export const updateNickname = async (
  uid: string,
  newNickname: string
): Promise<void> => {
  const usersRef = collection(firestore, "users");
  const nickQuery = query(usersRef, where("nickname", "==", newNickname));
  const nickSnap = await getDocs(nickQuery);
  if (!nickSnap.empty) {
    throw new Error("This nickname is already taken.");
  }

  const userRef = doc(firestore, "users", uid);
  await updateDoc(userRef, { nickname: newNickname });

  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: newNickname });
  }
};

export const updateAvatar = async (
  uid: string,
  avatarKey: string
): Promise<void> => {
  const userRef = doc(firestore, "users", uid);
  await updateDoc(userRef, { avatar: avatarKey });
};
