import { View, Text, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';

const orderScreen = () => {
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(4);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Bounce animation on mount
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  // Countdown and auto navigate to home
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigation.navigate("main"); // ✅ go to home after countdown
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white" }}>
      
      <Animated.View style={{
        width: "85%",
        padding: 30,
        borderRadius: 15,
        backgroundColor: "#F5F7FA",
        alignItems: "center",
        transform: [{ scale: scaleAnim }],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}>
        {/* Big checkmark */}
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: "#00CED1",
          justifyContent: "center", alignItems: "center",
          marginBottom: 20
        }}>
          <Text style={{ fontSize: 40 }}>✓</Text>
        </View>

        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#333" }}>
          Order Placed Successfully!
        </Text>

        <Text style={{ fontSize: 15, textAlign: "center", color: "gray", marginBottom: 20 }}>
          Thank you for your order.{"\n"}Your items will be delivered soon.
        </Text>

        {/* Countdown */}
        <Text style={{ fontSize: 13, color: "#00CED1", fontWeight: "bold" }}>
          Returning to home in {countdown}s...
        </Text>
      </Animated.View>

    </View>
  );
};

export default orderScreen;