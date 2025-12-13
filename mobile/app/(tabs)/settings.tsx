import { View, Text, ScrollView, Pressable, Switch, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Settings, 
  Bell, 
  Moon, 
  Shield, 
  HelpCircle, 
  Mail, 
  Phone,
  ChevronRight,
  ExternalLink,
  Smartphone,
  Globe
} from "lucide-react-native";
import { useState } from "react";
import GlassCard from "../../components/GlassCard";
import SolanaVerifiedModal from "../../components/SolanaVerifiedModal";

const ACCENT_COLOR = "hsl(45, 90%, 55%)";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showSolanaModal, setShowSolanaModal] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Settings size={24} color={ACCENT_COLOR} />
            <Text className="text-accent text-sm font-semibold uppercase tracking-wider">
              App Settings
            </Text>
          </View>
          <Text className="text-foreground text-2xl font-bold">
            Settings
          </Text>
        </View>

        {/* App Preferences */}
        <Text className="text-foreground text-lg font-semibold mb-3">Preferences</Text>
        <GlassCard className="p-4 mb-6">
          <SettingsToggle
            icon={<Bell size={20} color={ACCENT_COLOR} />}
            title="Push Notifications"
            subtitle="Get updates on your estimates"
            value={notifications}
            onToggle={setNotifications}
          />
          <SettingsToggle
            icon={<Moon size={20} color={ACCENT_COLOR} />}
            title="Dark Mode"
            subtitle="Use dark theme"
            value={darkMode}
            onToggle={setDarkMode}
            noBorder
          />
        </GlassCard>

        {/* Company Info */}
        <Text className="text-foreground text-lg font-semibold mb-3">Company</Text>
        <GlassCard className="p-4 mb-6">
          <SettingsLink
            icon={<Phone size={20} color={ACCENT_COLOR} />}
            title="Call Us"
            subtitle="(615) 555-PAINT"
            onPress={() => Linking.openURL('tel:+16155557246')}
          />
          <SettingsLink
            icon={<Mail size={20} color={ACCENT_COLOR} />}
            title="Email Us"
            subtitle="info@nashpaintpros.io"
            onPress={() => Linking.openURL('mailto:info@nashpaintpros.io')}
          />
          <SettingsLink
            icon={<Globe size={20} color={ACCENT_COLOR} />}
            title="Website"
            subtitle="nashpaintpros.io"
            onPress={() => Linking.openURL('https://nashpaintpros.io')}
            noBorder
          />
        </GlassCard>

        {/* About & Legal */}
        <Text className="text-foreground text-lg font-semibold mb-3">About</Text>
        <GlassCard className="p-4 mb-6">
          <SettingsLink
            icon={<Shield size={20} color={ACCENT_COLOR} />}
            title="Privacy Policy"
            onPress={() => {}}
          />
          <SettingsLink
            icon={<HelpCircle size={20} color={ACCENT_COLOR} />}
            title="Terms of Service"
            onPress={() => {}}
          />
          <SettingsLink
            icon={<Smartphone size={20} color={ACCENT_COLOR} />}
            title="App Version"
            subtitle="1.0.0"
            noBorder
          />
        </GlassCard>

        {/* Blockchain Verification */}
        <Pressable onPress={() => setShowSolanaModal(true)}>
          <GlassCard className="p-4 mb-8 border border-accent/30">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center">
                <Shield size={24} color={ACCENT_COLOR} />
              </View>
              <View className="flex-1">
                <Text className="text-accent font-bold">Solana Verified</Text>
                <Text className="text-muted-foreground text-sm">
                  Powered by PaintPros.io blockchain
                </Text>
              </View>
              <ExternalLink size={20} color="rgba(255,255,255,0.5)" />
            </View>
          </GlassCard>
        </Pressable>

        {/* Bottom Padding */}
        <View className="h-8" />
      </ScrollView>

      {/* Solana Modal */}
      <SolanaVerifiedModal 
        isOpen={showSolanaModal} 
        onClose={() => setShowSolanaModal(false)} 
      />
    </SafeAreaView>
  );
}

function SettingsToggle({
  icon,
  title,
  subtitle,
  value,
  onToggle,
  noBorder,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  noBorder?: boolean;
}) {
  return (
    <View className={`flex-row items-center py-4 ${noBorder ? "" : "border-b border-muted"}`}>
      <View className="w-10 h-10 rounded-lg bg-accent/10 items-center justify-center mr-3">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-medium">{title}</Text>
        {subtitle && <Text className="text-muted-foreground text-sm">{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "rgba(255,255,255,0.1)", true: "hsl(45, 90%, 55%)" }}
        thumbColor="#fff"
      />
    </View>
  );
}

function SettingsLink({
  icon,
  title,
  subtitle,
  onPress,
  noBorder,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  noBorder?: boolean;
}) {
  return (
    <Pressable
      className={`flex-row items-center py-4 ${noBorder ? "" : "border-b border-muted"}`}
      onPress={onPress}
    >
      <View className="w-10 h-10 rounded-lg bg-accent/10 items-center justify-center mr-3">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-medium">{title}</Text>
        {subtitle && <Text className="text-muted-foreground text-sm">{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color="rgba(255,255,255,0.5)" />
    </Pressable>
  );
}
