import { useState, useEffect, useCallback } from "react";
import { View, Text, Modal, Pressable, ScrollView, Linking, ActivityIndicator, Alert } from "react-native";
import { 
  ShieldCheck, 
  Lock, 
  Search, 
  FileCheck, 
  ExternalLink, 
  ChevronDown,
  Hash,
  Award,
  History,
  Clock,
  CheckCircle2,
  X,
  Info
} from "lucide-react-native";
import GlassCard from "./GlassCard";

const SOLANA_GREEN = "#14F195";
const SOLANA_PURPLE = "#9945FF";
const ACCENT_COLOR = "hsl(45, 90%, 55%)";

interface BlockchainStamp {
  id: string;
  entityType: string;
  entityId: string;
  documentHash: string;
  transactionSignature: string | null;
  network: string;
  slot: number | null;
  blockTime: string | null;
  status: string;
  createdAt: string;
}

interface SolanaVerifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBaseUrl?: string;
}

const FOUNDING_ASSET = {
  badge: "Founding Member",
  number: "#0000001",
};

export default function SolanaVerifiedModal({ isOpen, onClose, apiBaseUrl }: SolanaVerifiedModalProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [stamps, setStamps] = useState<BlockchainStamp[]>([]);
  const [loadingStamps, setLoadingStamps] = useState(false);
  const [stampError, setStampError] = useState<string | null>(null);
  
  const solscanUrl = "https://solscan.io/account/NPP0000000001";
  const displaySerial = FOUNDING_ASSET.number.replace('#', '');

  const openUrl = useCallback(async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Unable to Open", "Cannot open this link on your device.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open the link.");
    }
  }, []);

  useEffect(() => {
    if (isOpen && apiBaseUrl) {
      setLoadingStamps(true);
      setStampError(null);
      fetch(`${apiBaseUrl}/api/blockchain/stamps`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then(data => {
          setStamps(Array.isArray(data) ? data : []);
          setLoadingStamps(false);
        })
        .catch(() => {
          setStamps([]);
          setStampError("Unable to load history");
          setLoadingStamps(false);
        });
    } else if (isOpen && !apiBaseUrl) {
      setStampError("History available in full app");
      setLoadingStamps(false);
    }
  }, [isOpen, apiBaseUrl]);

  const features = [
    {
      id: "antifraud",
      icon: ShieldCheck,
      title: "Anti-Fraud Protection",
      summary: "Every document is tamper-proof and permanently recorded.",
      details: "Your estimates, contracts, and warranties are cryptographically hashed and stored on the Solana blockchain."
    },
    {
      id: "recall",
      icon: Search,
      title: "Document Recall",
      summary: "Access your complete project history anytime.",
      details: "Lost your estimate? Every document we create is permanently stored with a blockchain timestamp."
    },
    {
      id: "verify",
      icon: FileCheck,
      title: "Instant Verification",
      summary: "Prove authenticity with one click.",
      details: "Each document includes a unique hash that can be verified on any Solana blockchain explorer."
    },
    {
      id: "trust",
      icon: Lock,
      title: "Transparent Business",
      summary: "We prove our legitimacy through technology.",
      details: "Every promise is permanent. Your warranty terms and pricing will never change without your knowledge."
    }
  ];

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/10">
          <View className="flex-row items-center gap-3">
            <View 
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: SOLANA_PURPLE,
              }}
            >
              <ShieldCheck size={20} color="#fff" />
            </View>
            <Text className="text-foreground text-lg font-bold">Solana Verified</Text>
          </View>
          <Pressable onPress={onClose} className="p-2">
            <X size={24} color="rgba(255,255,255,0.5)" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          <View className="py-4">
            <GlassCard 
              className="p-4 mb-4"
              style={{ 
                borderColor: SOLANA_GREEN,
                borderWidth: 1,
              }}
            >
              <View className="flex-row items-start gap-4">
                <View 
                  className="p-3 rounded-lg items-center justify-center"
                  style={{ backgroundColor: SOLANA_GREEN }}
                >
                  <ShieldCheck size={32} color="#000" />
                  <Text style={{ color: '#000', fontSize: 8, fontWeight: 'bold', marginTop: 4 }}>
                    VERIFIED
                  </Text>
                </View>
                <View className="flex-1">
                  <View 
                    className="self-start px-2 py-1 rounded-full mb-2"
                    style={{ 
                      backgroundColor: SOLANA_PURPLE,
                    }}
                  >
                    <View className="flex-row items-center gap-1">
                      <Award size={10} color="#fff" />
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                        {FOUNDING_ASSET.badge}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-foreground font-bold text-base leading-tight">
                    The <Text style={{ color: SOLANA_GREEN }}>First</Text> Solana-Verified{" "}
                    <Text style={{ color: SOLANA_GREEN }}>Painting Company</Text>
                  </Text>
                  <View className="flex-row items-center gap-1 mt-2">
                    <Hash size={14} color="rgba(255,255,255,0.5)" />
                    <Text style={{ color: SOLANA_GREEN, fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {displaySerial}
                    </Text>
                  </View>
                </View>
              </View>
            </GlassCard>

            <Text className="text-muted-foreground text-sm mb-4">
              <Text style={{ color: SOLANA_GREEN, fontWeight: '500' }}>Blockchain verified</Text> — Your documents are tamper-proof and permanently recorded.
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-4">
              {features.map((feature) => (
                <Pressable
                  key={feature.id}
                  onPress={() => setExpandedSection(expandedSection === feature.id ? null : feature.id)}
                  className="w-[48%]"
                >
                  <GlassCard className="p-3 min-h-[80px]">
                    <View className="flex-row items-center gap-2 mb-1">
                      <feature.icon size={14} color={ACCENT_COLOR} />
                      <Text className="text-foreground font-bold text-xs flex-1">{feature.title}</Text>
                    </View>
                    <Text className="text-muted-foreground text-xs leading-tight">{feature.summary}</Text>
                    {expandedSection === feature.id && (
                      <Text className="text-muted-foreground text-xs mt-2 pt-2 border-t border-white/10 leading-snug">
                        {feature.details}
                      </Text>
                    )}
                  </GlassCard>
                </Pressable>
              ))}
            </View>

            <View className="flex-row gap-2 mb-4">
              <Pressable
                onPress={() => setExpandedSection(expandedSection === 'history' ? null : 'history')}
                className="flex-1"
              >
                <GlassCard className="p-3">
                  <View className="flex-row items-center gap-2">
                    <History size={14} color={SOLANA_GREEN} />
                    <Text className="text-foreground font-bold text-xs">History</Text>
                    <Text className="text-muted-foreground text-xs">({stamps.length})</Text>
                    <View className="flex-1" />
                    <ChevronDown 
                      size={14} 
                      color="rgba(255,255,255,0.5)"
                      style={{ transform: [{ rotate: expandedSection === 'history' ? '180deg' : '0deg' }] }}
                    />
                  </View>
                </GlassCard>
              </Pressable>

              <Pressable
                onPress={() => openUrl(solscanUrl)}
                className="flex-1"
              >
                <GlassCard 
                  className="p-3"
                  style={{ 
                    borderColor: SOLANA_GREEN,
                    borderWidth: 1,
                  }}
                >
                  <View className="flex-row items-center gap-2">
                    <Search size={14} color={SOLANA_GREEN} />
                    <Text style={{ color: SOLANA_GREEN, fontWeight: 'bold', fontSize: 12 }}>
                      Verify on Solana
                    </Text>
                    <View className="flex-1" />
                    <ExternalLink size={14} color={SOLANA_GREEN} />
                  </View>
                </GlassCard>
              </Pressable>
            </View>

            {expandedSection === 'history' && (
              <GlassCard className="p-3 mb-4">
                {loadingStamps ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color={SOLANA_GREEN} />
                    <Text className="text-muted-foreground text-xs">Loading...</Text>
                  </View>
                ) : stampError ? (
                  <View className="flex-row items-center gap-2">
                    <Info size={12} color="rgba(255,255,255,0.5)" />
                    <Text className="text-muted-foreground text-xs">{stampError}</Text>
                  </View>
                ) : stamps.length === 0 ? (
                  <Text className="text-muted-foreground text-xs">No stamps yet.</Text>
                ) : (
                  <View className="gap-2">
                    {stamps.slice(0, 5).map((stamp) => (
                      <View key={stamp.id} className="flex-row items-center gap-2">
                        {stamp.status === 'confirmed' ? (
                          <CheckCircle2 size={12} color={SOLANA_GREEN} />
                        ) : (
                          <Clock size={12} color="#EAB308" />
                        )}
                        <Text className="text-muted-foreground text-xs uppercase">{stamp.entityType}</Text>
                        <Text 
                          className="flex-1 text-xs"
                          style={{ color: `${SOLANA_GREEN}99`, fontFamily: 'monospace' }}
                          numberOfLines={1}
                        >
                          {stamp.documentHash.substring(0, 16)}...
                        </Text>
                        {stamp.transactionSignature && (
                          <Pressable
                            onPress={() => openUrl(`https://explorer.solana.com/tx/${stamp.transactionSignature}`)}
                          >
                            <ExternalLink size={12} color={SOLANA_GREEN} />
                          </Pressable>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </GlassCard>
            )}

            <Text className="text-center text-muted-foreground text-xs opacity-50 mb-4">
              Powered by Solana • Fast, secure, eco-friendly
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
