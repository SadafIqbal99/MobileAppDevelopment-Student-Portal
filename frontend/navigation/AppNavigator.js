// frontend/navigation/AppNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TimetableScreen from "../screens/TimetableScreen";
import CourseEnrollmentScreen from "../screens/CourseEnrollmentScreen";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Timetable" component={TimetableScreen} />
<Stack.Screen name="Courses" component={CourseEnrollmentScreen} />
    </Stack.Navigator>
  );
}
