import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./frontend/navigation/AppNavigator"; 
import SplashScreen from "./frontend/screens/SplashScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // When animation finishes, remove splash
  const handleSplashEnd = () => {
    setShowSplash(false);
  };

  return (
    <NavigationContainer>
      {showSplash ? (
        <SplashScreen onAnimationComplete={handleSplashEnd} />
      ) : (
        <AppNavigator />
      )}
    </NavigationContainer>
  );
}
