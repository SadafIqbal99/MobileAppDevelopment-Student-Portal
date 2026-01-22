import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { auth, db } from "../../backend/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";

// -------------------------------
// Custom Checkbox (REPLACES expo-checkbox)
// -------------------------------
const Checkbox = ({ value, onValueChange }) => (
  <Pressable
    onPress={() => onValueChange(!value)}
    style={{
      height: 22,
      width: 22,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: "#444",
      backgroundColor: value ? "#4CAF50" : "transparent",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {value && (
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
        ✔
      </Text>
    )}
  </Pressable>
);

export default function CourseEnrollmentScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [creditHours, setCreditHours] = useState(0);

  // -------------------------------
  // 20 COURSE LIST
  // -------------------------------
  const courses = [
    { name: "Analysis of Algorithms", ch: 3, prof: "Dr. Adeel" },
    { name: "Database Systems", ch: 4, prof: "Dr. Waqas" },
    { name: "Linear Algebra", ch: 3, prof: "Dr. Rida" },
    { name: "Probability & Statistics", ch: 3, prof: "Dr. Ali" },
    { name: "Software Requirement Engineering", ch: 3, prof: "Dr. Sara" },
    { name: "Software Design & Architecture", ch: 3, prof: "Dr. Hamza" },
    { name: "Parallel & Distributed Computing", ch: 3, prof: "Dr. Usman" },
    { name: "HCI & Computer Graphics", ch: 3, prof: "Dr. Nabeel" },
    { name: "Mobile Application Development", ch: 3, prof: "Dr. Amna" },
    { name: "Introduction to Machine Learning", ch: 3, prof: "Dr. Saad" },
    { name: "Expository Writing", ch: 3, prof: "Ma’am Aysha" },
    { name: "Islamic Studies", ch: 2, prof: "Ma’am Iqra" },
    { name: "Basic Teachings of Quran", ch: 2, prof: "Ma’am Hira" },
    { name: "Digital Logic Design", ch: 3, prof: "Dr. Sidra" },
    { name: "Computer Organization", ch: 3, prof: "Dr. Anum Aleem" },
    { name: "Assembly Language", ch: 3, prof: "Dr. Anum Aleem" },
    { name: "Object Oriented Programming", ch: 4, prof: "Dr. Amna" },
    { name: "Operating Systems", ch: 3, prof: "Dr. Anum Aleem" },
    { name: "Data Communication", ch: 3, prof: "Dr. Farhan" },
    { name: "Computer Networks", ch: 3, prof: "Dr. Aisha" },
  ];

  // Calculate credit hours dynamically
  useEffect(() => {
    let total = 0;
    selected.forEach((item) => {
      total += item.ch;
    });
    setCreditHours(total);
  }, [selected]);

  // Toggle course selection
  const toggleSelect = (course) => {
    const exists = selected.find((x) => x.name === course.name);

    if (exists) {
      setSelected(selected.filter((x) => x.name !== course.name));
    } else {
      if (creditHours + course.ch > 20) {
        Alert.alert("Limit Reached", "You cannot exceed 20 credit hours.");
        return;
      }
      setSelected([...selected, course]);
    }
  };

  // Save to Firebase
  const saveCourses = async () => {
    const uid = auth.currentUser.uid;
    const ref = doc(db, "students", uid);

    await updateDoc(ref, {
      enrolledCourses: selected,
    });

    Alert.alert("Success", "Courses saved!");
    navigation.navigate("Timetable");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9ff" }}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Select Your Courses</Text>
        <Text style={styles.subHeading}>
          Total Credit Hours: {creditHours} / 20
        </Text>

        {/* COURSE LIST */}
        {courses.map((course, index) => (
          <TouchableOpacity
            key={index}
            style={styles.courseBox}
            onPress={() => toggleSelect(course)}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.courseName}>{course.name}</Text>
              <Checkbox
                value={!!selected.find((x) => x.name === course.name)}
                onValueChange={() => toggleSelect(course)}
              />
            </View>

            <Text style={styles.prof}>
              Professor:{" "}
              <Text style={{ fontWeight: "bold" }}>{course.prof}</Text>
            </Text>
            <Text style={styles.credit}>Credit Hours: {course.ch}</Text>
          </TouchableOpacity>
        ))}

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveCourses}>
          <Text style={styles.saveText}>Save & Generate Timetable</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.activeIconWrapper}>
            <MaterialIcons name="person" size={24} color="black" />
          </View>
          <Text style={styles.activeLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Timetable")}
        >
          <MaterialIcons name="calendar-today" size={24} color="white" />
          <Text style={styles.navLabel}>Timetable</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Courses")}
        >
          <MaterialIcons name="menu-book" size={24} color="white" />
          <Text style={styles.navLabel}>Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Resume")}
        >
          <MaterialIcons name="description" size={24} color="white" />
          <Text style={styles.navLabel}>Resume</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------
// STYLES
// ---------------------------
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9ff",
  },
  heading: {
    fontSize: 22,
    marginTop: 45,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
  },
  courseBox: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#d0d0ff",
  },
  courseName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },
  prof: {
    fontSize: 14,
    color: "#555",
  },
  credit: {
    fontSize: 14,
    marginTop: 5,
    color: "#444",
  },
  saveBtn: {
    backgroundColor: "#dfd276ff",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  saveText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
  },
  navBar: {
    height: 80,
    backgroundColor: "#aec0f1ff",
    borderWidth: 3,
    borderColor: "#2e50adff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 6,
    borderTopLeftRadius: 80,
    borderBottomLeftRadius: 80,
    borderTopRightRadius: 80,
    borderBottomRightRadius: 80,
  },

  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  activeIconWrapper: {
    backgroundColor: "white",
    padding: 6,
    borderRadius: 30,
    marginBottom: 6,
  },

  navLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 1,
  },

  activeLabel: {
    color: "#2e50adff",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 1,
  },
});
