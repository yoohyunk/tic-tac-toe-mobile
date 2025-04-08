import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import { auth, firestore } from "./firebaseConfig";
import { avatarMap, randomAvatarKey } from "../utils/randomAvatar";
import { ImageSourcePropType } from "react-native";

// ✅ Login function
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (!user) {
      throw new Error("Login failed: No user data found");
    }

    // Retrieve user nickname from Firestore
    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { ...user, nickname: userSnap.data().nickname };
    } else {
      return { ...user, nickname: null };
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
};

// ✅ Signup function
export const signup = async (
  email: string,
  password: string,
  nickname: string
) => {
  try {
    // Create a new user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (!user) {
      throw new Error("Signup error: No user data found");
    }

    // Check for duplicate nickname in Firestore
    const usersRef = collection(firestore, "users");
    const nicknameQuery = query(usersRef, where("nickname", "==", nickname));
    const nicknameSnapshot = await getDocs(nicknameQuery);

    if (!nicknameSnapshot.empty) {
      console.error("❌ Nickname already in use");
      throw new Error(
        "This nickname is already taken. Please choose another one."
      );
    }

    // Save user data in Firestore
    await setDoc(doc(firestore, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      nickname: nickname,
      avatar: randomAvatarKey(),
    });

    console.log("✅ User successfully saved to Firestore");
    return { uid: user.uid, email: user.email, nickname };
  } catch (error) {
    console.error("❌ Signup error:", error);
    throw error;
  }
};

// ✅ Logout function (ensuring onAuthStateChanged updates)
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("✅ Successfully logged out");
  } catch (error) {
    console.error("❌ Logout error:", error);
    throw error;
  }
};

export interface UserProfile {
  uid: string;
  nickname: string;
  avatar: ImageSourcePropType;
}

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(firestore, "users", uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      console.warn(`No user found with UID: ${uid}`);
      return null;
    }

    const data = userSnap.data();
    // Type-checking / safety
    const nickname = typeof data.nickname === "string" ? data.nickname : "";
    const key =
      typeof data.avatar === "string" && avatarMap[data.avatar]
        ? data.avatar
        : "default";
    return {
      uid,
      nickname,
      avatar: avatarMap[key],
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
