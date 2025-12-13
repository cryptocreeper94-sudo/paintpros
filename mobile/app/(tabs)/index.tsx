import { useState } from "react";
import { View, Text, ScrollView, Pressable, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Phone, Star, Shield, Award, ChevronRight, Sparkles } from "lucide-react-native";
import GlassCard from "../../components/GlassCard";
import SolanaVerifiedModal from "../../components/SolanaVerifiedModal";

const ACCENT_COLOR = "hsl(45, 90%, 55%)";
const PRIMARY_COLOR = "hsl(85, 20%, 35%)";

export default function HomeScreen() {
  const [showSolanaModal, setShowSolanaModal] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="py-8">
          <View className="flex-row items-center gap-2 mb-2">
            <Sparkles size={20} color={ACCENT_COLOR} />
            <Text className="text-accent text-sm font-semibold uppercase tracking-wider">
              Premium Painting Services
            </Text>
          </View>
          <Text className="text-foreground text-4xl font-bold mb-2">
            Nashville Painting{"\n"}Professionals
          </Text>
          <Text className="text-muted-foreground text-lg mb-6">
            Exceptional Painters. Extraordinary Service.
          </Text>

          {/* CTA Buttons */}
          <View className="flex-row gap-3">
            <Link href="/estimate" asChild>
              <Pressable className="flex-1 bg-accent py-4 px-6 rounded-xl flex-row items-center justify-center">
                <Text className="text-accent-foreground font-bold text-lg">Get Estimate</Text>
              </Pressable>
            </Link>
            <Pressable 
              className="flex-1 bg-card border border-card-border py-4 px-6 rounded-xl flex-row items-center justify-center"
              onPress={() => Linking.openURL('tel:+1234567890')}
            >
              <Phone size={20} color="#fff" />
              <Text className="text-foreground font-bold text-lg ml-2">Call</Text>
            </Pressable>
          </View>
        </View>

        {/* Stats Grid - Bento Style */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <GlassCard className="flex-1 min-w-[45%] p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Star size={20} color={ACCENT_COLOR} fill={ACCENT_COLOR} />
              <Text className="text-accent font-bold text-2xl">4.9</Text>
            </View>
            <Text className="text-foreground font-semibold">Google Rating</Text>
            <Text className="text-muted-foreground text-sm">100+ Reviews</Text>
          </GlassCard>

          <GlassCard className="flex-1 min-w-[45%] p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Shield size={20} color={ACCENT_COLOR} />
              <Text className="text-accent font-bold text-2xl">3 Yr</Text>
            </View>
            <Text className="text-foreground font-semibold">Warranty</Text>
            <Text className="text-muted-foreground text-sm">Full Coverage</Text>
          </GlassCard>

          <GlassCard className="flex-1 min-w-[45%] p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Award size={20} color={ACCENT_COLOR} />
              <Text className="text-accent font-bold text-2xl">Licensed</Text>
            </View>
            <Text className="text-foreground font-semibold">& Insured</Text>
            <Text className="text-muted-foreground text-sm">Fully Protected</Text>
          </GlassCard>

          <GlassCard className="flex-1 min-w-[45%] p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Sparkles size={20} color={ACCENT_COLOR} />
              <Text className="text-accent font-bold text-2xl">Pro</Text>
            </View>
            <Text className="text-foreground font-semibold">Quality</Text>
            <Text className="text-muted-foreground text-sm">Premium Paints</Text>
          </GlassCard>
        </View>

        {/* Services Section */}
        <Text className="text-foreground text-2xl font-bold mb-4">Our Services</Text>
        <View className="gap-3 mb-8">
          <ServiceCard 
            title="Interior Painting" 
            description="Walls, ceilings, trim, and doors"
            icon="interior"
          />
          <ServiceCard 
            title="Exterior Painting" 
            description="Siding, trim, decks, and more"
            icon="exterior"
          />
          <ServiceCard 
            title="Commercial Painting" 
            description="Offices, retail, and industrial"
            icon="commercial"
          />
          <ServiceCard 
            title="Cabinet Refinishing" 
            description="Kitchen and bathroom cabinets"
            icon="cabinet"
          />
        </View>

        {/* Solana Verification Badge */}
        <Pressable onPress={() => setShowSolanaModal(true)}>
          <GlassCard className="p-4 mb-8 border border-accent/30">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center">
                <Shield size={24} color={ACCENT_COLOR} />
              </View>
              <View className="flex-1">
                <Text className="text-accent font-bold">Blockchain Verified</Text>
                <Text className="text-muted-foreground text-sm">
                  All estimates secured on Solana
                </Text>
              </View>
              <ChevronRight size={20} color="rgba(255,255,255,0.5)" />
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

function ServiceCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <Link href="/estimate" asChild>
      <Pressable>
        <GlassCard className="p-4 flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center mr-4">
            <Sparkles size={24} color={PRIMARY_COLOR} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground font-semibold text-lg">{title}</Text>
            <Text className="text-muted-foreground text-sm">{description}</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.5)" />
        </GlassCard>
      </Pressable>
    </Link>
  );
}
