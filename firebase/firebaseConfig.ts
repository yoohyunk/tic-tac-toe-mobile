// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth"; // Correct import

// Replace the following with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSJTJKuhp_HeUqRzcD5DJbkHQyLpsnDXQ",
  authDomain: "tictactoeapp-5fb1a.firebaseapp.com",
  projectId: "tictactoeapp-5fb1a",
  storageBucket: "tictactoeapp-5fb1a.firebasestorage.app",
  messagingSenderId: "536889922375",
  appId: "1:536889922375:web:a469a13b7f8964d752b262",
  measurementId: "G-CR9VT33JGC",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage), // Correct usage for persistence
});

const firestore = getFirestore(app);

export { app, auth, firestore };
