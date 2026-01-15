import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const studentEmailRegex = /^[0-9]+@students\.riphah\.edu\.pk$/;

/* -------------------------------- SIGNUP -------------------------------- */
export async function signup(email, password) {
  if (!studentEmailRegex.test(email)) {
    throw new Error("Email must be 1234@students.riphah.edu.pk");
  }

  // create account in Firebase Authentication
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  const sapId = email.split("@")[0];

  // save data in Firestore (✔ USE UID AS DOC ID)
  await setDoc(doc(db, "students", user.uid), {
    sapId,
    email,
    createdAt: new Date().toISOString(),
  });

  return user;
}

/* -------------------------------- LOGIN -------------------------------- */
export async function login(email, password) {
  if (!studentEmailRegex.test(email)) {
    throw new Error("Invalid Email Format");
  }

  try {
    return (await signInWithEmailAndPassword(auth, email, password)).user;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      throw new Error("Account not found. Please signup first.");
    }
    if (error.code === "auth/wrong-password") {
      throw new Error("Wrong password. Try again.");
    }
    throw error;
  }
}

/* ------------------------------ GET PROFILE ----------------------------- */
export async function getProfile(uid) {
  const snap = await getDoc(doc(db, "students", uid));
  return snap.exists() ? snap.data() : null;
}
