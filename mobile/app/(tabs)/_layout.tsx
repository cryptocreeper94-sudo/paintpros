import { Tabs } from "expo-router";
import { Home, Calculator, User, Settings } from "lucide-react-native";
import { View, Text } from "react-native";

const ICON_SIZE = 24;
const ACCENT_COLOR = "hsl(45, 90%, 55%)";
const INACTIVE_COLOR = "rgba(255, 255, 255, 0.5)";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "hsl(85, 15%, 10%)",
          borderTopColor: "rgba(255, 255, 255, 0.1)",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: ACCENT_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Home size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="estimate"
        options={{
          title: "Estimate",
          tabBarIcon: ({ color }) => (
            <Calculator size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <User size={ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Settings size={ICON_SIZE} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
