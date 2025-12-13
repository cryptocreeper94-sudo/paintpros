import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Lock, TrendingUp, Users, DollarSign, FileText, ChevronRight } from "lucide-react-native";
import GlassCard from "../../components/GlassCard";

const ACCENT_COLOR = "hsl(45, 90%, 55%)";

type Role = "none" | "admin" | "owner" | "manager";

const PINS: Record<string, Role> = {
  "4444": "admin",
  "1111": "owner",
  "2222": "manager",
  "0424": "admin", // Developer bypass
};

export default function DashboardScreen() {
  const [role, setRole] = useState<Role>("none");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const foundRole = PINS[pin];
    if (foundRole) {
      setRole(foundRole);
      setError("");
    } else {
      setError("Invalid PIN. Please try again.");
    }
    setPin("");
  };

  if (role === "none") {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 px-4 justify-center">
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-full bg-accent/20 items-center justify-center mb-4">
              <Lock size={40} color={ACCENT_COLOR} />
            </View>
            <Text className="text-foreground text-2xl font-bold mb-2">Staff Login</Text>
            <Text className="text-muted-foreground text-center">
              Enter your PIN to access the dashboard
            </Text>
          </View>

          <GlassCard className="p-6">
            <TextInput
              className="bg-muted rounded-xl p-4 text-foreground text-2xl text-center tracking-[10px] mb-4"
              placeholder="****"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
              value={pin}
              onChangeText={setPin}
            />

            {error ? (
              <Text className="text-red-400 text-center mb-4">{error}</Text>
            ) : null}

            <Pressable
              className="bg-accent py-4 px-6 rounded-xl flex-row items-center justify-center"
              onPress={handleLogin}
            >
              <Text className="text-accent-foreground font-bold text-lg">Login</Text>
            </Pressable>
          </GlassCard>

          <Text className="text-muted-foreground text-center text-sm mt-8">
            Contact your manager if you forgot your PIN
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-accent text-sm font-semibold uppercase tracking-wider">
                {role === "admin" ? "Admin" : role === "owner" ? "Owner" : "Area Manager"} Dashboard
              </Text>
              <Text className="text-foreground text-2xl font-bold">
                Welcome Back
              </Text>
            </View>
            <Pressable
              className="w-10 h-10 rounded-full bg-muted items-center justify-center"
              onPress={() => setRole("none")}
            >
              <User size={20} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row gap-3 mb-6">
          <GlassCard className="flex-1 p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <DollarSign size={18} color={ACCENT_COLOR} />
              <Text className="text-muted-foreground text-sm">Revenue</Text>
            </View>
            <Text className="text-foreground text-2xl font-bold">$24,580</Text>
            <Text className="text-green-400 text-sm">+12% this month</Text>
          </GlassCard>

          <GlassCard className="flex-1 p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <FileText size={18} color={ACCENT_COLOR} />
              <Text className="text-muted-foreground text-sm">Leads</Text>
            </View>
            <Text className="text-foreground text-2xl font-bold">47</Text>
            <Text className="text-green-400 text-sm">+8 this week</Text>
          </GlassCard>
        </View>

        {/* Menu Items */}
        <Text className="text-foreground text-lg font-semibold mb-3">Quick Actions</Text>
        <View className="gap-3 mb-6">
          <DashboardMenuItem
            icon={<FileText size={24} color={ACCENT_COLOR} />}
            title="View Leads"
            subtitle="47 pending leads"
          />
          <DashboardMenuItem
            icon={<TrendingUp size={24} color={ACCENT_COLOR} />}
            title="Analytics"
            subtitle="View performance metrics"
          />
          <DashboardMenuItem
            icon={<Users size={24} color={ACCENT_COLOR} />}
            title="Team"
            subtitle="Manage staff and roles"
          />
          <DashboardMenuItem
            icon={<DollarSign size={24} color={ACCENT_COLOR} />}
            title="Payments"
            subtitle="View transactions"
          />
        </View>

        {/* Recent Activity */}
        <Text className="text-foreground text-lg font-semibold mb-3">Recent Activity</Text>
        <GlassCard className="p-4 mb-8">
          <ActivityItem
            title="New lead submitted"
            time="5 min ago"
            description="John D. requested an interior estimate"
          />
          <ActivityItem
            title="Estimate sent"
            time="1 hour ago"
            description="$4,500 proposal for exterior painting"
          />
          <ActivityItem
            title="Payment received"
            time="2 hours ago"
            description="$2,200 deposit from Sarah M."
            noBorder
          />
        </GlassCard>

        {/* Bottom Padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}

function DashboardMenuItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable>
      <GlassCard className="p-4 flex-row items-center">
        <View className="w-12 h-12 rounded-xl bg-accent/10 items-center justify-center mr-4">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-foreground font-semibold">{title}</Text>
          <Text className="text-muted-foreground text-sm">{subtitle}</Text>
        </View>
        <ChevronRight size={20} color="rgba(255,255,255,0.5)" />
      </GlassCard>
    </Pressable>
  );
}

function ActivityItem({
  title,
  time,
  description,
  noBorder,
}: {
  title: string;
  time: string;
  description: string;
  noBorder?: boolean;
}) {
  return (
    <View className={`py-3 ${noBorder ? "" : "border-b border-muted"}`}>
      <View className="flex-row justify-between mb-1">
        <Text className="text-foreground font-medium">{title}</Text>
        <Text className="text-muted-foreground text-xs">{time}</Text>
      </View>
      <Text className="text-muted-foreground text-sm">{description}</Text>
    </View>
  );
}
