// TimetableScreen.js
// Roman comments: screen ko update kia gaya hai — date picker, day tabs, time-format, current-class highlight.

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { auth, db } from "../../backend/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
//import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";



// agar aapne generateTimetable utility file rakha hua hai, use karo
// else hum neeche simple logic use karenge (same as aapka original)
const defaultSlots = [
  "09:00 - 10:30",
  "10:45 - 12:15",
  "13:30 - 15:00",
  "15:15 - 16:45",
];

const daysFull = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function TimetableScreen({ navigation }) {
  const [generated, setGenerated] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  // Firestore load
  const loadData = async () => {
    try {
      const user = auth.currentUser.uid;
      const ref = doc(db, "students", user);
      const snap = await getDoc(ref);
      const enrolled = (snap.exists() && snap.data().enrolledCourses) || [];
      generate(enrolled);
    } catch (e) {
      console.log("Error loading timetable:", e);
    } finally {
      setLoading(false);
    }
  };

  // keep your original generate logic — I kept same behaviour
  const generate = (selected) => {
    const days = ["Mon","Tue","Wed","Thu","Fri"];
    const slots = defaultSlots;

    const temp = [];
    let d = 0, t = 0;

    selected.forEach((course) => {
      // ensure we only create classes inside 08:00-16:00 window by slot definitions
      temp.push({
        id: course.id || course.name,
        name: course.name,
        professor: course.prof || course.professor || "",
        room: course.room || "TBD",
        day: days[d],
        time: slots[t],
      });

      t++;
      if (t >= slots.length) {
        t = 0;
        d++;
        if (d >= days.length) d = 0;
      }
    });

    setGenerated(temp);
  };

  useEffect(() => {
    loadData();
  }, []);

  // helper: format time string like "13:30" -> "1:30 PM"
  const to12Hour = (hhmm) => {
    if (!hhmm) return hhmm;
    const [hStr, mStr] = hhmm.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  // helper parse slot "09:00 - 10:30" to start/end Date relative to selectedDate
  const slotToRange = (slot, date) => {
    const [start, end] = slot.split("-").map(s => s.trim());
    const [sh, sm] = start.split(":").map(n => parseInt(n,10));
    const [eh, em] = end.split(":").map(n => parseInt(n,10));
    const sd = new Date(date);
    sd.setHours(sh, sm, 0, 0);
    const ed = new Date(date);
    ed.setHours(eh, em, 0, 0);
    return { start: sd, end: ed };
  };

  // determine whether a class should be highlighted (current time within its slot & day matches)
  const isCurrentClass = (item) => {
    const todayName = daysFull[new Date().getDay()].slice(0,3); // Mon Tue ...
    const thisDay = item.day; // e.g. "Mon"
    // only highlight if selectedDate is today
    const sel = new Date(selectedDate);
    const now = new Date();
    if (sel.toDateString() !== now.toDateString()) return false; // only when viewing today's date
    if (thisDay !== todayName) return false;
    const range = slotToRange(item.time, sel);
    return now >= range.start && now <= range.end;
  };

  // filter items by selectedDate day
  const visibleItems = generated.filter((it) => {
    const dayName = daysFull[new Date(selectedDate).getDay()].slice(0,3); // Mon/Tue...
    return it.day === dayName;
  });

  // show datepicker
  const openDatePicker = () => setShowPicker(true);
  const onChangeDate = (event, date) => {
    setShowPicker(false);
    if (date) setSelectedDate(date);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4ff" }}>
      {/* header: Title + calendar icon */}
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>My Schedule</Text>
        <TouchableOpacity style={styles.calendarBtn} onPress={openDatePicker}>
          <Ionicons name="calendar" size={20} color="#6b5bff" />
        </TouchableOpacity>
      </View>

      {/* DAYS TABS (centered like screenshot) */}
      <View style={styles.daysRow}>
        {["Mon","Tue","Wed","Thu","Fri"].map((d, i) => {
          // highlight tab if it matches selectedDate's day
          const selDay = daysFull[new Date(selectedDate).getDay()].slice(0,3);
          const active = selDay === d;
          return (
            <View key={d} style={[styles.dayTab, active && styles.activeDayTab]}>
              <Text style={[styles.dayLabel, active && { color: "#fff" }]}>{d}</Text>
            </View>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* show currently selected date under tabs */}
        <Text style={styles.selectedDateText}>
          {selectedDate.toDateString()}
        </Text>

        {/* no classes */}
        {visibleItems.length === 0 && (
          <Text style={{ marginTop: 20, color: "#666" }}>No classes for this day.</Text>
        )}

        {/* class cards */}
        {visibleItems.map((item, index) => {
          const current = isCurrentClass(item);
          // convert times to nicer format
          const [startStr, endStr] = item.time.split("-").map(s => s.trim());
          const niceTime = `${to12Hour(startStr)} - ${to12Hour(endStr)}`;

          return (
            <View
              key={item.id || index}
              style={[
                styles.card,
                current ? styles.cardActive : null
              ]}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.courseName}>{item.name}</Text>
                <Text style={styles.courseDay}>{item.day}</Text>
              </View>

              <Text style={styles.roomText}>{item.day} • Room {item.room}</Text>
              <Text style={styles.timeText}>{niceTime}</Text>

              <View style={styles.profRow}>
                <Image
                  source={require("../../assets/user.png")}
                  style={styles.profPic}
                />
                <Text style={styles.profText}>{item.professor}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
<View style={styles.navBar}>

  {/* PROFILE (ACTIVE) */}
  <TouchableOpacity
    style={styles.navButton}
    onPress={() => navigation.navigate("Profile")}
  >
    <View style={styles.activeIconWrapper}>
      <MaterialIcons name="person" size={24} color="black" />
    </View>
    <Text style={styles.activeLabel}>Profile</Text>
  </TouchableOpacity>

  {/* TIMETABLE */}
  <TouchableOpacity
    style={styles.navButton}
    onPress={() => navigation.navigate("Timetable")}
  >
    <MaterialIcons name="calendar-today" size={24} color="white" />
    <Text style={styles.navLabel}>Timetable</Text>
  </TouchableOpacity>

  {/* COURSES */}
  <TouchableOpacity
    style={styles.navButton}
    onPress={() => navigation.navigate("Courses")}
  >
    <MaterialIcons name="menu-book" size={24} color="white" />
    <Text style={styles.navLabel}>Courses</Text>
  </TouchableOpacity>

  {/* RESUME */}
  <TouchableOpacity
    style={styles.navButton}
    onPress={() => navigation.navigate("Resume")}
  >
    <MaterialIcons name="description" size={24} color="white" />
    <Text style={styles.navLabel}>Resume</Text>
  </TouchableOpacity>

</View>

      {/* date picker component */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={onChangeDate}
          minimumDate={new Date(2000,0,1)}
          maximumDate={new Date(2100,11,31)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
     marginTop: 49,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 19,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f3f4ff"
  },
  screenTitle: { fontSize: 26, fontWeight: "800", color: "#111" },
  calendarBtn: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee"
  },

  daysRow: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: "space-around",
    backgroundColor: "#f3f4ff"
  },
  dayTab: {
    backgroundColor: "#ecebff",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  activeDayTab: { backgroundColor: "#6b5bff" },
  dayLabel: { color: "#444", fontWeight: "700" },

  selectedDateText: { marginTop: 8, marginLeft: 8, color: "#555", fontWeight: "600" },

  card: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardActive: { backgroundColor: "#c8ffd7" },

  courseName: { fontSize: 18, fontWeight: "800" },
  courseDay: { fontSize: 14, color: "#444", fontWeight: "700" },
  roomText: { color: "#666", marginTop: 6 },
  timeText: { marginTop: 6, fontWeight: "700", color: "#222" },

  profRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  profPic: { width: 36, height: 36, borderRadius: 20, marginRight: 12 },
  profText: { fontWeight: "700" },

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
  borderBottomLeftRadius:80,
  borderTopRightRadius: 80,
  borderBottomRightRadius: 80,
},

navButton: {
  alignItems: "center",
  justifyContent: "center",
},

navIcon: {
  fontSize: 20,
  color: "white",
},

activeIconWrapper: {
  backgroundColor: "white",
  padding: 6,
  borderRadius: 30,
  marginBottom: 6,
},

activeIcon: {
  fontSize: 15,
  color: "black",
  fontWeight: "bold",
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
