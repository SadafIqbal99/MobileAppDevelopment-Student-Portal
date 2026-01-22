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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../backend/firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [dark, setDark] = useState(false);

  const isRiphahEmail = (email) =>
    /^[0-9]+@students\.riphah\.edu\.pk$/.test(email);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Enter email and password");
      return;
    }

    if (!isRiphahEmail(email)) {
      Alert.alert("Invalid Email", "Use 1234@students.riphah.edu.pk");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Login Successful!");
      navigation.replace("Profile");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        Alert.alert(
          "Account Not Found",
          "No account exists with this email. Signup first."
        );
        return;
      }

      if (error.code === "auth/wrong-password") {
        Alert.alert("Incorrect Password", "Wrong password. Try again.");
        return;
      }

      Alert.alert("Login Failed","No account exists with this email. Signup first. ");
    }
  };

  const theme = dark ? darkStyles : lightStyles;

  return (
    <ImageBackground
      source={require("../../assets/Gradient.jpeg")}
      style={styles.screen}
      resizeMode="cover"
    >
      {/* DARK MODE TOGGLE */}
      <TouchableOpacity
        style={styles.darkToggle}
        onPress={() => setDark(!dark)}
      >
        <Text style={{ fontSize: 20, color: theme.text.color }}>
          {dark ? "☀️" : "🌙"}
        </Text>
      </TouchableOpacity>

      {/* LOGO */}
      <Image source={require("../../assets/OIP.png")} style={styles.logo} />

      {/* CARD */}
      <View style={[styles.card, theme.card]}>
        <Text style={[styles.title, theme.text]}>Login</Text>
        <Text style={[styles.subtitle, theme.text]}>
          Use your student email
        </Text>

        {/* EMAIL LABEL */}
        <Text style={[styles.label, theme.text]}>Student Email</Text>

        <TextInput
          style={[styles.input, theme.input]}
          placeholder="1234@students.riphah.edu.pk"
          placeholderTextColor={theme.placeholder.color}
          value={email}
          onChangeText={setEmail}
        />

        {/* PASSWORD LABEL */}
        <Text style={[styles.label, theme.text]}>Password</Text>

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

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={[styles.button, theme.button]}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, theme.buttonText]}>Login</Text>
        </TouchableOpacity>

        {/* SIGNUP LINK */}
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={[styles.link, theme.text]}>
            Create new account
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

/* ---------- LIGHT & DARK THEMES ---------- */

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
