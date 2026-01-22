import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../backend/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [dark, setDark] = useState(false);

  const isRiphahEmail = (email) =>
    /^[0-9]+@students\.riphah\.edu\.pk$/.test(email);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    if (!isRiphahEmail(email)) {
      Alert.alert("Invalid Email", "Use 1234@students.riphah.edu.pk format only");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Minimum 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "students", user.uid), {
        sapId: email.split("@")[0],
        email: email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Signup Successfully!");
      navigation.replace("Profile");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Account Exists", "This email is already registered. Please login.");
        return;
      }

      Alert.alert("Signup Failed", error.message);
    }
  };

  const theme = dark ? darkStyles : lightStyles;

  return (
    <ImageBackground
      source={require("../../assets/Gradient.jpeg")}
      style={styles.screen}
      resizeMode="cover"
    >
      {/* Dark Mode Toggle */}
      <TouchableOpacity
        style={styles.darkToggle}
        onPress={() => setDark(!dark)}
      >
        <Text style={{ fontSize: 20, color: theme.text.color }}>
          {dark ? "☀️" : "🌙"}
        </Text>
      </TouchableOpacity>

      {/* UNIVERSITY LOGO */}
      <Image source={require("../../assets/OIP.png")} style={styles.logo} />

      {/* WHITE CARD */}
      <View style={[styles.card, theme.card]}>
        <Text style={[styles.title, theme.text]}>Create Account</Text>
        <Text style={[styles.subtitle, theme.text]}>
          Use your Riphah student email
        </Text>

        {/* EMAIL LABEL */}
        <Text style={[styles.label, theme.text]}>Student Email</Text>

        {/* EMAIL INPUT */}
        <TextInput
          style={[styles.input, theme.input]}
          placeholder="1234@students.riphah.edu.pk"
          placeholderTextColor={theme.placeholder.color}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* PASSWORD LABEL */}
        <Text style={[styles.label, theme.text]}>Password</Text>

        {/* PASSWORD */}
        <View style={[styles.passContainer, theme.input]}>
          <TextInput
            style={{ flex: 1, color: theme.text.color }}
            placeholder="Password"
            placeholderTextColor={theme.placeholder.color}
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Text style={{ color: theme.text.color }}>
              {showPass ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONFIRM PASSWORD LABEL */}
        <Text style={[styles.label, theme.text]}>Confirm Password</Text>

        {/* CONFIRM PASSWORD */}
        <View style={[styles.passContainer, theme.input]}>
          <TextInput
            style={{ flex: 1, color: theme.text.color }}
            placeholder="Confirm Password"
            placeholderTextColor={theme.placeholder.color}
            secureTextEntry={!showConfirmPass}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPass(!showConfirmPass)}
          >
            <Text style={{ color: theme.text.color }}>
              {showConfirmPass ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SIGN UP BUTTON */}
        <TouchableOpacity
          style={[styles.button, theme.button]}
          onPress={handleSignup}
        >
          <Text style={[styles.buttonText, theme.buttonText]}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.link, theme.text]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

/* ---------- THEMES ---------- */

const lightStyles = {
  card: { backgroundColor: "#fff" },
  text: { color: "#1b1f3b" },
  input: { backgroundColor: "#f0f0f0", borderColor: "#e769d6ff" },
  placeholder: { color: "#b9b4b4ff" },
  button: { backgroundColor: "#1A56DB" },
  buttonText: { color: "#fff" },
};

const darkStyles = {
  card: { backgroundColor: "#ffffff" },
  text: { color: "#000" },
  input: { backgroundColor: "#f0f0f0", borderColor: "#e769d6ff" },
  placeholder: { color: "#c0c2c5" },
  button: { backgroundColor: "#4c56c0" },
  buttonText: { color: "#fff" },
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
 background: {
    flex: 1,              // FULL SCREEN
    width: '100%',
    height: '100%',
  },
  darkToggle: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 99,
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 10,
  },

  card: {
    width: "88%",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  passContainer: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  link: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 14,
  },
});
