import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { auth, db } from "../../backend/firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);

  // Load Quote
  const loadQuote = async () => {
    try {
      const res = await fetch("https://zenquotes.io/api/random");
      const json = await res.json();
      setQuote(json[0].q + " — " + json[0].a);
    } catch (e) {
      setQuote("Stay positive. Work hard. Make it happen.");
    }
  };

  // Load user info
  const loadUserData = async () => {
    const uid = auth.currentUser.uid;
    const refDoc = doc(db, "students", uid);
    const snap = await getDoc(refDoc);
    if (snap.exists()) {
      setUserData(snap.data());
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadQuote();
      await loadUserData();
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !userData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6b5bff" />
        <Text>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f5ff" }}>
      <ScrollView style={styles.container}>
        
        {/* LOGO + QUOTE */}
        <View style={styles.headerSection}>
          <Image source={require("../../assets/OIP.png")} style={styles.logo} />

          <View style={styles.quoteBox}>
            <View style={styles.quoteRow}>
              <MaterialIcons name="format-quote" size={24} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.quoteText}>{quote}</Text>
            </View>
          </View>
        </View>

        {/* USER INFO */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>SAP ID:</Text>
            <Text style={styles.infoValue}>{userData.sapId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Semester:</Text>
            <Text style={styles.infoValue}>{userData.semester}</Text>
          </View>
        </View>

        {/* ENROLLED COURSES + TIMETABLE */}
        <View style={styles.rowCards}>
          <TouchableOpacity style={styles.halfCard} onPress={() => navigation.navigate("Courses")}>
            <Text style={styles.title}>Enrolled Courses</Text>
            <Text style={styles.sub}>{(userData.enrolledCourses || []).length} / 20 selected</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.halfCard} onPress={() => navigation.navigate("Timetable")}>
            <Text style={styles.title}>View Timetable</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut(auth)}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.navBar}>
        
        {/* PROFILE (ACTIVE) */}
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profile")}>
          <View style={styles.activeIconWrapper}>
            <MaterialIcons name="person" size={24} color="black" />
          </View>
          <Text style={styles.activeLabel}>Profile</Text>
        </TouchableOpacity>

        {/* TIMETABLE */}
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Timetable")}>
          <MaterialIcons name="calendar-today" size={24} color="white" />
          <Text style={styles.navLabel}>Timetable</Text>
        </TouchableOpacity>

        {/* COURSES */}
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Courses")}>
          <MaterialIcons name="menu-book" size={24} color="white" />
          <Text style={styles.navLabel}>Courses</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

// ---------------- STYLES ------------------

const styles = StyleSheet.create({
  container: { padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerSection: { alignItems: "center", marginBottom: 20 },
  logo: { width: 169, height: 160, resizeMode: "contain", marginBottom: 18, marginTop: 60 },

  quoteBox: {
    backgroundColor: "#aec0f1ff",
    borderWidth: 2,
    borderColor: "#2e50adff",
    paddingTop: 9,
    paddingHorizontal: 14,
    paddingBottom: 15,
    borderRadius: 16,
    maxWidth: "90%",
  },
  quoteRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  quoteText: { color: "white", fontSize: 15, fontStyle: "italic", textAlign: "center" },

  infoCard: {
    backgroundColor: "#eef0ff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  infoLabel: { fontSize: 15, color: "#333", fontWeight: "600" },
  infoValue: { fontSize: 15, color: "#555" },

  rowCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  halfCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "48%",
    elevation: 3,
  },

  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  sub: { color: "#666", textAlign: "center" },

  logoutBtn: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
  },
  logoutText: { color: "white", fontWeight: "bold", textAlign: "center" },

  navBar: {
    height: 80,
    backgroundColor: "#aec0f1ff",
    borderWidth: 3,
    borderColor: "#2e50adff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 6,
    borderRadius: 80,
  },

  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  navLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 1,
  },

  activeIconWrapper: {
    backgroundColor: "white",
    padding: 6,
    borderRadius: 30,
    marginBottom: 6,
  },

  activeLabel: {
    color: "#2e50adff",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 1,
  },
});
