import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Type imports
import { RootStackParamList } from "../types/navigation";

// Screen imports
import HomeScreen from "../screens/HomeScreen";

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function BottomNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "black",
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#8E8E93",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Ana Sayfa",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
