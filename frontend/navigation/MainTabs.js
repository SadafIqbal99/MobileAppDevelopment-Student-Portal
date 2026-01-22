import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/ProfileScreen";
import CourseEnrollmentScreen from "../screens/CourseEnrollmentScreen";
import TimetableScreen from "../screens/TimetableScreen";
import ResumeBuilder from "../screens/ResumeBuilder";

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Courses" component={CourseEnrollmentScreen} />
      <Stack.Screen name="Timetable" component={TimetableScreen} />
      <Stack.Screen name="Resume" component={ResumeBuilder} />
    </Stack.Navigator>
  );
}
