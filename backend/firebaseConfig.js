import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfo_2jRJ6EGCcc-vuLsHbh9YeAZ2FTDWQ",
  authDomain: "studentportal-91f89.firebaseapp.com",
  projectId: "studentportal-91f89",
  storageBucket: "studentportal-91f89.firebasestorage.app",
  messagingSenderId: "341362409428",
  appId: "1:341362409428:web:452fba4f28dbf88669a041",
  measurementId: "G-9K0QN4HTE4"
};
const app = initializeApp(firebaseConfig);

// IMPORTANT: React Native needs this:
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Firestore
export const db = getFirestore(app);
//const app = initializeApp(firebaseConfig);

//export const auth = getAuth(app);
//export const db = getFirestore(app); // ✅ important
