import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "../firebase/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Define the context structure
interface AuthContextProps {
  user: User | null;
  nickname: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (
    email: string,
    password: string,
    nickname: string
  ) => Promise<User | null>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname);
        } else {
          setNickname(null);
        }
      } else {
        setUser(null);
        setNickname(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);

      // Retrieve nickname from Firestore
      const userRef = doc(firestore, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setNickname(userSnap.data().nickname);
      } else {
        setNickname(null);
      }
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, nickname: string) => {
    try {
      // Check for duplicate nickname in Firestore
      const usersRef = collection(firestore, "users");
      const nicknameQuery = query(usersRef, where("nickname", "==", nickname));
      const nicknameSnapshot = await getDocs(nicknameQuery);

      if (!nicknameSnapshot.empty) {
        throw new Error(
          "This nickname is already taken. Please choose another one."
        );
      }

      // Create new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        nickname: nickname,
      });

      setUser(user);
      setNickname(nickname);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setNickname(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, nickname, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
