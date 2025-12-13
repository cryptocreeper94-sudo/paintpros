import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calculator, Check, ChevronRight, Minus, Plus } from "lucide-react-native";
import GlassCard from "../../components/GlassCard";

const ACCENT_COLOR = "hsl(45, 90%, 55%)";
const PRIMARY_COLOR = "hsl(85, 20%, 35%)";

interface EstimateState {
  squareFootage: string;
  includeWalls: boolean;
  includeTrim: boolean;
  includeCeilings: boolean;
  doorCount: number;
}

export default function EstimateScreen() {
  const [step, setStep] = useState(1);
  const [estimate, setEstimate] = useState<EstimateState>({
    squareFootage: "",
    includeWalls: true,
    includeTrim: false,
    includeCeilings: false,
    doorCount: 0,
  });
  const [email, setEmail] = useState("");

  const PRICING = {
    wallsPerSqFt: 2.50,
    fullJobPerSqFt: 5.00,
    doorsPerUnit: 150,
  };

  const calculateTotal = () => {
    const sqft = parseInt(estimate.squareFootage) || 0;
    let total = 0;

    if (estimate.includeWalls && estimate.includeTrim && estimate.includeCeilings) {
      total += sqft * PRICING.fullJobPerSqFt;
    } else if (estimate.includeWalls) {
      total += sqft * PRICING.wallsPerSqFt;
    }

    total += estimate.doorCount * PRICING.doorsPerUnit;
    return total;
  };

  const totalEstimate = calculateTotal();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Calculator size={24} color={ACCENT_COLOR} />
            <Text className="text-accent text-sm font-semibold uppercase tracking-wider">
              Instant Quote
            </Text>
          </View>
          <Text className="text-foreground text-3xl font-bold">
            Get Your Estimate
          </Text>
        </View>

        {/* Progress Steps */}
        <View className="flex-row items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              className={`w-3 h-3 rounded-full ${
                s === step ? "bg-accent" : s < step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </View>

        {step === 1 && (
          <View>
            {/* Square Footage Input */}
            <GlassCard className="p-4 mb-4">
              <Text className="text-foreground font-semibold mb-3">Square Footage</Text>
              <TextInput
                className="bg-muted rounded-xl p-4 text-foreground text-lg"
                placeholder="Enter approximate sq ft"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="numeric"
                value={estimate.squareFootage}
                onChangeText={(text) => setEstimate({ ...estimate, squareFootage: text })}
              />
            </GlassCard>

            {/* Service Toggles */}
            <GlassCard className="p-4 mb-4">
              <Text className="text-foreground font-semibold mb-4">Select Services</Text>

              <ServiceToggle
                label="Walls"
                description="Interior wall painting"
                value={estimate.includeWalls}
                onToggle={(v) => setEstimate({ ...estimate, includeWalls: v })}
              />

              <ServiceToggle
                label="Trim & Molding"
                description="Add to walls for full job pricing"
                value={estimate.includeTrim}
                onToggle={(v) => setEstimate({ ...estimate, includeTrim: v })}
              />

              <ServiceToggle
                label="Ceilings"
                description="Add to walls for full job pricing"
                value={estimate.includeCeilings}
                onToggle={(v) => setEstimate({ ...estimate, includeCeilings: v })}
                noBorder
              />
            </GlassCard>

            {/* Full Job Package Note */}
            {estimate.includeWalls && estimate.includeTrim && estimate.includeCeilings && (
              <GlassCard className="p-3 mb-4 border border-accent/30">
                <Text className="text-accent text-center text-sm font-medium">
                  Full Job Package: $5.00/sqft (walls + trim + ceilings)
                </Text>
              </GlassCard>
            )}

            {estimate.includeWalls && !(estimate.includeTrim && estimate.includeCeilings) && (
              <GlassCard className="p-3 mb-4">
                <Text className="text-muted-foreground text-center text-sm">
                  Add trim & ceilings for the full job package deal
                </Text>
              </GlassCard>
            )}

            {/* Door Count */}
            <GlassCard className="p-4 mb-6">
              <Text className="text-foreground font-semibold mb-3">Door Count</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-muted-foreground">Interior doors to paint</Text>
                <View className="flex-row items-center gap-4">
                  <Pressable
                    className="w-10 h-10 rounded-full bg-muted items-center justify-center"
                    onPress={() => setEstimate({ ...estimate, doorCount: Math.max(0, estimate.doorCount - 1) })}
                  >
                    <Minus size={20} color="#fff" />
                  </Pressable>
                  <Text className="text-foreground text-xl font-bold min-w-[30px] text-center">
                    {estimate.doorCount}
                  </Text>
                  <Pressable
                    className="w-10 h-10 rounded-full bg-accent items-center justify-center"
                    onPress={() => setEstimate({ ...estimate, doorCount: estimate.doorCount + 1 })}
                  >
                    <Plus size={20} color="#000" />
                  </Pressable>
                </View>
              </View>
            </GlassCard>

            {/* Continue Button */}
            <Pressable
              className="bg-accent py-4 px-6 rounded-xl flex-row items-center justify-center"
              onPress={() => setStep(2)}
            >
              <Text className="text-accent-foreground font-bold text-lg mr-2">Continue</Text>
              <ChevronRight size={20} color="#000" />
            </Pressable>
          </View>
        )}

        {step === 2 && (
          <View>
            {/* Estimate Summary */}
            <GlassCard className="p-6 mb-4 border border-accent/30">
              <Text className="text-accent text-sm font-semibold uppercase tracking-wider mb-2">
                Your Estimate
              </Text>
              <Text className="text-foreground text-5xl font-bold mb-2">
                ${totalEstimate.toLocaleString()}
              </Text>
              <Text className="text-muted-foreground">
                Based on {estimate.squareFootage} sq ft
              </Text>
            </GlassCard>

            {/* Breakdown */}
            <GlassCard className="p-4 mb-4">
              <Text className="text-foreground font-semibold mb-4">Estimate Breakdown</Text>

              {estimate.includeWalls && (
                <View className="flex-row justify-between py-2 border-b border-muted">
                  <Text className="text-muted-foreground">Walls</Text>
                  <Text className="text-foreground">
                    ${((parseInt(estimate.squareFootage) || 0) * PRICING.wallsPerSqFt).toLocaleString()}
                  </Text>
                </View>
              )}

              {estimate.includeTrim && (
                <View className="flex-row justify-between py-2 border-b border-muted">
                  <Text className="text-muted-foreground">Trim & Molding</Text>
                  <Text className="text-foreground">
                    {estimate.includeWalls && estimate.includeCeilings ? "Included" : "+$0"}
                  </Text>
                </View>
              )}

              {estimate.includeCeilings && (
                <View className="flex-row justify-between py-2 border-b border-muted">
                  <Text className="text-muted-foreground">Ceilings</Text>
                  <Text className="text-foreground">
                    {estimate.includeWalls && estimate.includeTrim ? "Included" : "+$0"}
                  </Text>
                </View>
              )}

              {estimate.doorCount > 0 && (
                <View className="flex-row justify-between py-2 border-b border-muted">
                  <Text className="text-muted-foreground">
                    Doors ({estimate.doorCount}x)
                  </Text>
                  <Text className="text-foreground">
                    ${(estimate.doorCount * PRICING.doorsPerUnit).toLocaleString()}
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between py-3">
                <Text className="text-foreground font-bold">Total Estimate</Text>
                <Text className="text-accent font-bold text-xl">
                  ${totalEstimate.toLocaleString()}
                </Text>
              </View>
            </GlassCard>

            {/* Email Capture */}
            <GlassCard className="p-4 mb-6">
              <Text className="text-foreground font-semibold mb-3">Get Your Quote</Text>
              <TextInput
                className="bg-muted rounded-xl p-4 text-foreground text-lg mb-3"
                placeholder="Enter your email"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <Pressable
                className="bg-accent py-4 px-6 rounded-xl flex-row items-center justify-center"
                onPress={() => setStep(3)}
              >
                <Text className="text-accent-foreground font-bold text-lg">Send My Quote</Text>
              </Pressable>
            </GlassCard>

            {/* Back Button */}
            <Pressable
              className="py-4 items-center"
              onPress={() => setStep(1)}
            >
              <Text className="text-muted-foreground">Back to edit</Text>
            </Pressable>
          </View>
        )}

        {step === 3 && (
          <View className="items-center py-12">
            <View className="w-20 h-20 rounded-full bg-accent/20 items-center justify-center mb-6">
              <Check size={40} color={ACCENT_COLOR} />
            </View>
            <Text className="text-foreground text-2xl font-bold mb-2 text-center">
              Quote Sent!
            </Text>
            <Text className="text-muted-foreground text-center mb-8">
              Check your email for your detailed estimate.{"\n"}We'll be in touch soon!
            </Text>

            <Pressable
              className="bg-accent py-4 px-8 rounded-xl"
              onPress={() => {
                setStep(1);
                setEstimate({
                  squareFootage: "",
                  includeWalls: true,
                  includeTrim: false,
                  includeCeilings: false,
                  doorCount: 0,
                });
                setEmail("");
              }}
            >
              <Text className="text-accent-foreground font-bold text-lg">Start New Estimate</Text>
            </Pressable>
          </View>
        )}

        {/* Bottom Padding */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}

function ServiceToggle({
  label,
  description,
  value,
  onToggle,
  noBorder,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  noBorder?: boolean;
}) {
  return (
    <View className={`flex-row items-center justify-between py-4 ${noBorder ? "" : "border-b border-muted"}`}>
      <View className="flex-1">
        <Text className="text-foreground font-medium">{label}</Text>
        <Text className="text-muted-foreground text-sm">{description}</Text>
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
