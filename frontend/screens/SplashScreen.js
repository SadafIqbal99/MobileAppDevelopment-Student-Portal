import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';

// Fixed dimensions
const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 800;

export default function SplashScreen({ onAnimationComplete }) {
  // Curtain animations
  const leftCurtain = useRef(new Animated.Value(SCREEN_WIDTH / 2)).current;
  const rightCurtain = useRef(new Animated.Value(SCREEN_WIDTH / 2)).current;

  // ⬅️ FIX: Replaced height animation with scaleY
  const curtainScale = useRef(new Animated.Value(0)).current;

  // Thread pull effect
  const threadPull = useRef(new Animated.Value(0)).current;
  const threadOpacity = useRef(new Animated.Value(0)).current;

  // Logo reveal
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Text animation
  const textReveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Curtains appear
      Animated.parallel([
        // ⬅️ FIX: scaleY animation instead of height
        Animated.timing(curtainScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(threadOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(1000),

      Animated.timing(threadPull, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),

      Animated.parallel([
        Animated.timing(leftCurtain, {
          toValue: -SCREEN_WIDTH * 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rightCurtain, {
          toValue: SCREEN_WIDTH * 1.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(1000),

      Animated.timing(textReveal, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      Animated.delay(3000),
    ]).start();

    setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, 8600);
  }, []);

  const threadPosition = threadPull.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180],
  });

  return (
    <View style={styles.container}>

      {/* Left Curtain */}
      <Animated.View
        style={[
          styles.curtain,
          styles.leftCurtain,
          {
            transform: [
              { translateX: leftCurtain },
              { scaleY: curtainScale }, // ⬅️ FIXED
            ],
          },
        ]}
      />

      {/* Right Curtain */}
      <Animated.View
        style={[
          styles.curtain,
          styles.rightCurtain,
          {
            transform: [
              { translateX: rightCurtain },
              { scaleY: curtainScale }, // ⬅️ FIXED
            ],
          },
        ]}
      />

      {/* GOLDEN THREAD - LEFT SIDE */}
      <Animated.View
        style={[
          styles.threadContainer,
          {
            opacity: threadOpacity,
            transform: [{ translateY: threadPosition }],
            left: SCREEN_WIDTH * 0.15,
          },
        ]}
      >
        <View style={styles.threadLine} />
        <View style={styles.threadBall} />
        <View style={styles.threadTassel} />
      </Animated.View>

      <View style={styles.threadStart} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('../../assets/OIP.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Text */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textReveal,
            transform: [
              {
                translateY: textReveal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.universityText}>
          Riphah International University
        </Text>
        <View style={styles.textUnderline} />
        <Text style={styles.title}>
          WHERE ORDINARY BECOMES EXTRAORDINARY
        </Text>
      </Animated.View>

    </View>
  );
}

// ---------------------- STYLES ----------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#273b63ff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  curtain: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_HEIGHT, // static height, animation uses scaleY
    top: 0,
    backgroundColor: '#4f69b1ff',
    borderBottomWidth: 3,
    borderBottomColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  leftCurtain: {
    left: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 60,
  },
  rightCurtain: {
    right: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 60,
  },

  // Thread styles
  threadContainer: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
    zIndex: 50,
  },
  threadLine: {
    width: 3,
    height: 200,
    backgroundColor: '#FFD700',
  },
  threadBall: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#B8860B',
    marginTop: 5,
  },
  threadTassel: {
    width: 25,
    height: 35,
    backgroundColor: '#FFD700',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -2,
    opacity: 0.9,
  },
  threadStart: {
    position: 'absolute',
    top: 40,
    left: SCREEN_WIDTH * 0.15 + 1.5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    zIndex: 51,
  },

  logoContainer: {
    alignItems: 'center',
    zIndex: 30,
  },
  logo: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_WIDTH * 0.45,
  },

  textContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    zIndex: 40,
  },
  universityText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 8,
  },
  textUnderline: {
    width: 120,
    height: 2,
    backgroundColor: '#FFD700',
    marginVertical: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#87CEEB',
    fontWeight: '500',
    letterSpacing: 0.8,
  },
});
