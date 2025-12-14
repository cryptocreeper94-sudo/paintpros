import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  hover3D, 
  hover3DSubtle, 
  cardVariants, 
  staggerContainer, 
  iconContainerStyles, 
  cardBackgroundStyles, 
  glowGradients,
  tapEffect 
} from "@/lib/theme-effects";
import { Code, Database, Server, Terminal, GitBranch, Cpu, Bug, ArrowRight, Zap, MapPin, Palette, X, Sparkles, Coins, Link2, Rocket, Shield, Clock, Globe, Wallet, Hash, CheckCircle, ExternalLink, Copy, RefreshCw, AlertCircle, Loader2, Award, Search, Plus, FileText, ScrollText, Camera, BarChart3, ListTodo, Circle, DollarSign, TrendingUp, Users, Building2, Download, History } from "lucide-react";
import { BookingsCard } from "@/components/bookings-card";
import { VersionHistory } from "@/components/version-history";
import { RoomScannerCard } from "@/components/room-scanner";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { TenantAnalyticsDashboard } from "@/components/tenant-analytics-dashboard";
import { toast } from "sonner";
import { HallmarkBadge, HallmarkStamp, PoweredByOrbit } from "@/components/hallmark";
import { ProposalTemplateManager } from "@/components/crm/proposal-templates";
import { getAssetBadge, formatDate } from "@/lib/hallmark";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const DEVELOPER_PIN = "0424";

const SERVICE_AREAS = [
  "Nashville Metro",
  "Franklin",
  "Brentwood",
  "Murfreesboro",
  "Lebanon",
  "Goodlettsville",
  "Hendersonville",
  "Mt. Juliet",
  "Southern Kentucky",
];

interface ModalContent {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface BlockchainStamp {
  id: string;
  entityType: string;
  entityId: string;
  documentHash: string;
  transactionSignature: string | null;
  network: string;
  status: string;
  blockSlot: number | null;
  blockTime: string | null;
  createdAt: string;
}

interface WalletInfo {
  publicKey: string;
  balance: number;
  network: string;
}

function SolanaModalContent() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [stamps, setStamps] = useState<BlockchainStamp[]>([]);
  const [loading, setLoading] = useState({ wallet: false, airdrop: false, stamp: false, verify: false });
  const [hashInput, setHashInput] = useState("");
  const [generatedHash, setGeneratedHash] = useState("");
  const [stampEntityType, setStampEntityType] = useState("test");
  const [stampEntityId, setStampEntityId] = useState("");
  const [verifySignature, setVerifySignature] = useState("");
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [newWallet, setNewWallet] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"wallet" | "stamp" | "history" | "verify">("wallet");

  const fetchWalletBalance = async () => {
    setLoading(prev => ({ ...prev, wallet: true }));
    setWalletError(null);
    try {
      const res = await fetch("/api/blockchain/wallet/balance");
      if (!res.ok) {
        const err = await res.json();
        setWalletError(err.error || "Failed to fetch balance");
        setWalletInfo(null);
      } else {
        const data = await res.json();
        setWalletInfo(data);
      }
    } catch (e) {
      setWalletError("Network error");
    } finally {
      setLoading(prev => ({ ...prev, wallet: false }));
    }
  };

  const fetchStamps = async () => {
    try {
      const res = await fetch("/api/blockchain/stamps");
      if (res.ok) {
        const data = await res.json();
        setStamps(data);
      }
    } catch (e) {
      console.error("Failed to fetch stamps", e);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
    fetchStamps();
  }, []);

  const requestAirdrop = async () => {
    setLoading(prev => ({ ...prev, airdrop: true }));
    try {
      const res = await fetch("/api/blockchain/wallet/airdrop", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setWalletInfo(prev => prev ? { ...prev, balance: data.newBalance } : null);
        toast.success("Airdrop successful! +1 SOL");
      } else {
        toast.error("Airdrop failed. Try again later.");
      }
    } catch (e) {
      console.error("Airdrop failed", e);
      toast.error("Network error during airdrop");
    } finally {
      setLoading(prev => ({ ...prev, airdrop: false }));
    }
  };

  const generateHash = async () => {
    if (!hashInput.trim()) return;
    try {
      const res = await fetch("/api/blockchain/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: hashInput })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedHash(data.hash);
        toast.success("Hash generated successfully");
      } else {
        toast.error("Failed to generate hash");
      }
    } catch (e) {
      console.error("Hash generation failed", e);
      toast.error("Network error generating hash");
    }
  };

  const stampToBlockchain = async () => {
    if (!generatedHash || !stampEntityId) return;
    setLoading(prev => ({ ...prev, stamp: true }));
    try {
      const res = await fetch("/api/blockchain/stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: stampEntityType,
          entityId: stampEntityId,
          documentHash: generatedHash,
          network: "mainnet-beta"
        })
      });
      if (res.ok) {
        await fetchStamps();
        await fetchWalletBalance();
        setGeneratedHash("");
        setHashInput("");
        setStampEntityId("");
        setActiveTab("history");
        toast.success("Stamped to blockchain successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to stamp to blockchain");
      }
    } catch (e) {
      console.error("Stamp failed", e);
      toast.error("Network error during stamp");
    } finally {
      setLoading(prev => ({ ...prev, stamp: false }));
    }
  };

  const verifyStamp = async () => {
    if (!verifySignature) return;
    setLoading(prev => ({ ...prev, verify: true }));
    setVerifyResult(null);
    try {
      const res = await fetch("/api/blockchain/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature: verifySignature, network: "mainnet-beta" })
      });
      if (res.ok) {
        const data = await res.json();
        setVerifyResult(data);
        if (data.found) {
          toast.success("Transaction verified on blockchain");
        } else {
          toast.warning("Transaction not found on blockchain");
        }
      } else {
        toast.error("Verification request failed");
      }
    } catch (e) {
      console.error("Verification failed", e);
      toast.error("Network error during verification");
    } finally {
      setLoading(prev => ({ ...prev, verify: false }));
    }
  };

  const generateNewWallet = async () => {
    try {
      const res = await fetch("/api/blockchain/wallet/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setNewWallet(data);
      }
    } catch (e) {
      console.error("Wallet generation failed", e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const tabs = [
    { id: "wallet" as const, label: "Wallet", icon: <Wallet className="w-4 h-4" /> },
    { id: "stamp" as const, label: "Stamp", icon: <Hash className="w-4 h-4" /> },
    { id: "history" as const, label: "History", icon: <Clock className="w-4 h-4" /> },
    { id: "verify" as const, label: "Verify", icon: <CheckCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 bg-black/30 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? "bg-gold-400/20 text-gold-400 border border-gold-400/30" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
            data-testid={`tab-solana-${tab.id}`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "wallet" && (
        <div className="space-y-4">
          {walletError ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-400 mb-3">
                <AlertCircle className="w-5 h-5" />
                <span className="font-bold">Wallet Not Configured</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{walletError}</p>
              <motion.button
                onClick={generateNewWallet}
                className="w-full p-3 rounded-xl bg-gold-400/20 border border-gold-400/30 text-gold-400 hover:bg-gold-400/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-generate-wallet"
              >
                <Wallet className="w-4 h-4 inline mr-2" />
                Generate New Wallet
              </motion.button>
              {newWallet && (
                <div className="mt-4 space-y-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                    <p className="text-xs text-green-400 mb-1">Public Key:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs break-all flex-1">{newWallet.publicKey}</code>
                      <button onClick={() => copyToClipboard(newWallet.publicKey)} className="text-muted-foreground hover:text-foreground">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                    <p className="text-xs text-yellow-400 mb-1">Private Key (save securely!):</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs break-all flex-1">{newWallet.privateKey}</code>
                      <button onClick={() => copyToClipboard(newWallet.privateKey)} className="text-muted-foreground hover:text-foreground">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add these as secrets: SOLANA_PUBLIC_KEY and SOLANA_PRIVATE_KEY
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gold-400/10 to-purple-500/10 rounded-xl p-5 border border-gold-400/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Devnet Wallet</p>
                      <p className="text-2xl font-bold text-gold-400">
                        {loading.wallet ? "..." : walletInfo?.balance.toFixed(4)} SOL
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={fetchWalletBalance}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    data-testid="button-refresh-balance"
                  >
                    <RefreshCw className={`w-5 h-5 text-muted-foreground ${loading.wallet ? "animate-spin" : ""}`} />
                  </button>
                </div>
                {walletInfo?.publicKey && (
                  <div className="flex items-center gap-2 bg-black/30 rounded-lg p-2">
                    <code className="text-xs text-muted-foreground flex-1 truncate">{walletInfo.publicKey}</code>
                    <button onClick={() => copyToClipboard(walletInfo.publicKey)} className="text-muted-foreground hover:text-foreground">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <motion.button
                onClick={requestAirdrop}
                disabled={loading.airdrop}
                className="w-full p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-airdrop"
              >
                {loading.airdrop ? (
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                ) : (
                  <Coins className="w-4 h-4 inline mr-2" />
                )}
                Request Devnet Airdrop (1 SOL)
              </motion.button>
            </div>
          )}
        </div>
      )}

      {activeTab === "stamp" && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm font-medium mb-3">Step 1: Generate Hash</p>
            <textarea
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter data to hash (e.g., estimate JSON, contract text...)"
              className="w-full h-20 bg-black/30 border border-white/20 rounded-lg p-3 text-sm resize-none"
              data-testid="input-hash-data"
            />
            <motion.button
              onClick={generateHash}
              className="mt-2 w-full p-2 rounded-lg bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30 transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-generate-hash"
            >
              <Hash className="w-4 h-4 inline mr-2" />
              Generate SHA-256 Hash
            </motion.button>
            {generatedHash && (
              <div className="mt-3 bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                <p className="text-xs text-green-400 mb-1">Generated Hash:</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs break-all flex-1">{generatedHash}</code>
                  <button onClick={() => copyToClipboard(generatedHash)} className="text-muted-foreground hover:text-foreground">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {generatedHash && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm font-medium mb-3">Step 2: Stamp to Blockchain</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Entity Type</p>
                  <select
                    value={stampEntityType}
                    onChange={(e) => setStampEntityType(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-sm"
                    data-testid="select-entity-type"
                  >
                    <option value="test">Test</option>
                    <option value="estimate">Estimate</option>
                    <option value="contract">Contract</option>
                    <option value="invoice">Invoice</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Entity ID</p>
                  <Input
                    value={stampEntityId}
                    onChange={(e) => setStampEntityId(e.target.value)}
                    placeholder="e.g., EST-001"
                    className="bg-black/30 border-white/20 text-sm"
                    data-testid="input-entity-id"
                  />
                </div>
              </div>
              <motion.button
                onClick={stampToBlockchain}
                disabled={loading.stamp || !stampEntityId}
                className="w-full p-3 rounded-xl bg-gold-400/20 border border-gold-400/30 text-gold-400 hover:bg-gold-400/30 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="button-stamp-blockchain"
              >
                {loading.stamp ? (
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4 inline mr-2" />
                )}
                Stamp to Solana Devnet
              </motion.button>
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {stamps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No stamps yet</p>
              <p className="text-xs">Create your first blockchain stamp</p>
            </div>
          ) : (
            stamps.map((stamp) => (
              <div key={stamp.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                    {stamp.entityType}:{stamp.entityId}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    stamp.status === "confirmed" 
                      ? "bg-green-500/20 text-green-400" 
                      : stamp.status === "failed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {stamp.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  <p className="truncate">Hash: {stamp.documentHash}</p>
                  {stamp.blockTime && (
                    <p>Time: {new Date(stamp.blockTime).toLocaleString()}</p>
                  )}
                </div>
                {stamp.transactionSignature && (
                  <a
                    href={`https://explorer.solana.com/tx/${stamp.transactionSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gold-400 hover:underline"
                    data-testid={`link-explorer-${stamp.id}`}
                  >
                    View on Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "verify" && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm font-medium mb-3">Verify Transaction</p>
            <Input
              value={verifySignature}
              onChange={(e) => setVerifySignature(e.target.value)}
              placeholder="Enter transaction signature..."
              className="bg-black/30 border-white/20 text-sm font-mono mb-3"
              data-testid="input-verify-signature"
            />
            <motion.button
              onClick={verifyStamp}
              disabled={loading.verify || !verifySignature}
              className="w-full p-2 rounded-lg bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30 transition-colors text-sm disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-verify-stamp"
            >
              {loading.verify ? (
                <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 inline mr-2" />
              )}
              Verify on Blockchain
            </motion.button>
          </div>
          {verifyResult && (
            <div className={`rounded-xl p-4 border ${
              verifyResult.found 
                ? "bg-green-500/10 border-green-500/30" 
                : "bg-red-500/10 border-red-500/30"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {verifyResult.found ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-bold ${verifyResult.found ? "text-green-400" : "text-red-400"}`}>
                  {verifyResult.found ? "Transaction Found" : "Transaction Not Found"}
                </span>
              </div>
              {verifyResult.found && (
                <div className="text-xs text-muted-foreground space-y-1">
                  {verifyResult.blockTime && (
                    <p>Block Time: {new Date(verifyResult.blockTime).toLocaleString()}</p>
                  )}
                  {verifyResult.slot && <p>Slot: {verifyResult.slot}</p>}
                </div>
              )}
              <a
                href={verifyResult.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gold-400 hover:underline mt-2"
                data-testid="link-verify-explorer"
              >
                View on Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Hallmark {
  id: string;
  hallmarkNumber: string;
  assetNumber?: string;
  assetType: string;
  recipientName: string;
  recipientRole: string;
  contentHash: string;
  createdAt: string;
  blockchainTxSignature?: string;
}

function HallmarkModalContent() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"list" | "create" | "search">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [newHallmark, setNewHallmark] = useState({
    assetType: "document",
    recipientName: "",
    recipientRole: "client" as const,
    content: "",
    metadata: {}
  });

  const { data: hallmarks = [], isLoading } = useQuery<Hallmark[]>({
    queryKey: ["/api/hallmarks"],
    queryFn: async () => {
      const res = await fetch("/api/hallmarks");
      if (!res.ok) throw new Error("Failed to fetch hallmarks");
      return res.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newHallmark) => {
      const res = await fetch("/api/hallmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create hallmark");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hallmarks"] });
      toast.success("Hallmark created successfully!");
      setNewHallmark({ assetType: "document", recipientName: "", recipientRole: "client", content: "", metadata: {} });
      setActiveTab("list");
    },
    onError: () => {
      toast.error("Failed to create hallmark");
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const filteredHallmarks = searchQuery
    ? hallmarks.filter(h => 
        h.hallmarkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.assetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.assetNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : hallmarks;

  const tabs = [
    { id: "list" as const, label: "All Hallmarks", icon: <FileText className="w-4 h-4" /> },
    { id: "create" as const, label: "Create", icon: <Plus className="w-4 h-4" /> },
    { id: "search" as const, label: "Search", icon: <Search className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id 
                ? "bg-amber-500/20 text-amber-400" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`tab-hallmark-${tab.id}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "list" && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            </div>
          ) : filteredHallmarks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hallmarks found</p>
            </div>
          ) : (
            filteredHallmarks.slice(0, 10).map((hallmark) => {
              const badge = getAssetBadge(hallmark.assetNumber || hallmark.hallmarkNumber);
              return (
                <div
                  key={hallmark.id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-amber-500/30 transition-colors"
                  data-testid={`hallmark-item-${hallmark.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{badge.icon}</span>
                      <span className="text-sm font-bold" style={{ color: badge.color }}>
                        {badge.tier}
                      </span>
                    </div>
                    {hallmark.blockchainTxSignature && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-mono">{hallmark.hallmarkNumber}</code>
                    <button
                      onClick={() => copyToClipboard(hallmark.hallmarkNumber)}
                      className="p-1 hover:bg-white/10 rounded"
                      data-testid="button-copy-hallmark-id"
                    >
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                    <span>{hallmark.recipientName}</span>
                    <span className="capitalize">{hallmark.assetType.replace(/_/g, ' ')}</span>
                  </div>
                  {hallmark.assetNumber && (
                    <div className="mt-1">
                      <code className="text-xs font-mono" style={{ color: badge.color }}>
                        {hallmark.assetNumber}
                      </code>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "create" && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Asset Type</label>
            <select
              value={newHallmark.assetType}
              onChange={(e) => setNewHallmark(prev => ({ ...prev, assetType: e.target.value }))}
              className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-sm"
              data-testid="select-hallmark-type"
            >
              <option value="document">Document</option>
              <option value="invoice">Invoice</option>
              <option value="estimate">Estimate</option>
              <option value="contract">Contract</option>
              <option value="paystub">Paystub</option>
              <option value="certification">Certification</option>
              <option value="report">Report</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Recipient Name</label>
            <Input
              value={newHallmark.recipientName}
              onChange={(e) => setNewHallmark(prev => ({ ...prev, recipientName: e.target.value }))}
              placeholder="Enter recipient name"
              className="bg-black/30 border-white/20"
              data-testid="input-hallmark-recipient"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Recipient Role</label>
            <select
              value={newHallmark.recipientRole}
              onChange={(e) => setNewHallmark(prev => ({ ...prev, recipientRole: e.target.value as any }))}
              className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-sm"
              data-testid="select-hallmark-role"
            >
              <option value="client">Client</option>
              <option value="employee">Employee</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Content (for hash)</label>
            <textarea
              value={newHallmark.content}
              onChange={(e) => setNewHallmark(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter content to be hashed..."
              className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-sm h-20 resize-none"
              data-testid="textarea-hallmark-content"
            />
          </div>
          <motion.button
            onClick={() => createMutation.mutate(newHallmark)}
            disabled={createMutation.isPending || !newHallmark.recipientName || !newHallmark.content}
            className="w-full p-3 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-create-hallmark"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
            ) : (
              <Award className="w-4 h-4 inline mr-2" />
            )}
            Create Hallmark
          </motion.button>
        </div>
      )}

      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hallmark number, recipient, type..."
              className="bg-black/30 border-white/20 pl-10"
              data-testid="input-search-hallmark"
            />
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {filteredHallmarks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No results found</p>
              </div>
            ) : (
              filteredHallmarks.map((hallmark) => {
                const badge = getAssetBadge(hallmark.assetNumber || hallmark.hallmarkNumber);
                return (
                  <a
                    key={hallmark.id}
                    href={`/verify/${hallmark.hallmarkNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-white/5 rounded-lg border border-white/10 hover:border-amber-500/30 transition-colors"
                    data-testid={`search-result-${hallmark.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{badge.icon}</span>
                        <code className="text-xs font-mono">{hallmark.hallmarkNumber}</code>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {hallmark.recipientName} • {hallmark.assetType.replace(/_/g, ' ')}
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <PoweredByOrbit size="sm" />
        <span className="text-xs text-muted-foreground">
          {hallmarks.length} total hallmarks
        </span>
      </div>
    </div>
  );
}

function InvestorPricingContent() {
  const copyAllContent = () => {
    const content = `PaintPros.io - Investor Pricing Sheet
Prepared by: Orbit Development Team | December 2025

LICENSING TIERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tier                    Monthly         Setup Fee    Target Customer
──────────────────────────────────────────────────────────────────
Starter                 $349/mo         $5,000       Solo contractors, 1 location
Professional            $549/mo         $7,000       Growing painters, 1-3 locations
Franchise Core          $799/mo + $99/loc  $10,000   Multi-location (5+ sites)
Enterprise White-Label  $1,399/mo base  $15,000      Large franchises

FEATURE MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STARTER ($349/month)
• White-label website with Bento Grid design
• Interactive estimator tool
• Basic lead capture & CRM
• Email support (2 business day response)
• Blockchain stamping add-on ($69/mo)

PROFESSIONAL ($549/month)
• Everything in Starter
• Full analytics dashboard
• Role-based dashboards (Owner, Admin, Area Manager)
• Phone support (24-hour response)
• 2 strategy sessions per year
• Blockchain stamping included

FRANCHISE CORE ($799/month + $99/location)
• Everything in Professional
• Multi-tenant management console
• Shared asset libraries
• Orbit ecosystem integrations
• Dedicated account manager
• Compliance & audit trail

ENTERPRISE WHITE-LABEL ($1,399/month base)
• Full brand suppression
• API priority access
• Co-branded marketing assets
• SLA guarantees (99.9% uptime)
• Custom contract terms
• Additional locations: $99/location

SUPPORT PACKAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Starter Care        Included    2 business days    Email support, quarterly webinars
ProCare             $500/mo     24 hours           Priority support, 2 strategy sessions
Enterprise SLA      $1,500/mo   4 hours critical   Dedicated CSM, monthly roadmap sync

CUSTOMIZATION MENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Branding Refresh            $2,000          1 week
Custom Theme/Layout Pack    $3,500          2 weeks
Feature Module Build        $5,000-$10,000  3-6 weeks
Third-Party Integration     $150/hr         Varies
Data Migration              $1,000/system   1 week
Franchise Rollout Workshop  $4,500          2-day onsite

VOLUME DISCOUNTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1-10 locations      Standard pricing
11-25 locations     12% off
26-50 locations     18% off
51+ locations       Custom enterprise deal

UNIT ECONOMICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gross Margin                85%
Infrastructure Cost         ~$45/tenant/month
LTV:CAC Ratio              30:1
ARPU                       $349/month + $5,000 setup
3-Year Customer LTV        $17,564
CAC (projected)            $400

REVENUE PROJECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Year    Customers    MRR      Annual Revenue    Net Profit
2025    100          $35K     $920K             $350K
2026    500          $175K    $4.6M             $2M
2027    2,000        $700K    $14M              $7M

MARKET OPPORTUNITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

U.S. Painting Services Market: $46.5B annually
Painting Contractors: 300,000+
Residential Growth: 4.2% CAGR
Commercial Growth: 3.8% CAGR

Contact: Orbit Development Team
Website: https://paintpros.io
Ecosystem: https://darkwavestudios.io`;

    navigator.clipboard.writeText(content);
    toast.success("Investor pricing sheet copied to clipboard!");
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">Copy-ready for investor presentations</p>
        <motion.button
          onClick={copyAllContent}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-testid="button-copy-investor-sheet"
        >
          <Copy className="w-4 h-4" />
          Copy All
        </motion.button>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/30">
        <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-green-400" />
          Licensing Tiers
        </h3>
        <div className="grid gap-2">
          {[
            { tier: "Starter", price: "$349/mo", setup: "$5,000", target: "Solo contractors" },
            { tier: "Professional", price: "$549/mo", setup: "$7,000", target: "1-3 locations" },
            { tier: "Franchise Core", price: "$799/mo + $99/loc", setup: "$10,000", target: "5+ sites" },
            { tier: "Enterprise", price: "$1,399/mo base", setup: "$15,000", target: "Large franchises" },
          ].map((item) => (
            <div key={item.tier} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
              <div>
                <span className="font-bold text-sm">{item.tier}</span>
                <span className="text-xs text-muted-foreground ml-2">({item.target})</span>
              </div>
              <div className="text-right">
                <span className="text-green-400 font-mono text-sm">{item.price}</span>
                <span className="text-xs text-muted-foreground ml-2">+ {item.setup}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="font-bold text-sm flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Unit Economics
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross Margin</span>
              <span className="font-mono text-green-400">85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">LTV:CAC</span>
              <span className="font-mono text-blue-400">30:1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ARPU</span>
              <span className="font-mono text-accent">$349/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">3yr LTV</span>
              <span className="font-mono text-purple-400">$17,564</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="font-bold text-sm flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-purple-400" />
            Volume Discounts
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">1-10 sites</span>
              <span className="font-mono">Standard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">11-25 sites</span>
              <span className="font-mono text-green-400">-12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">26-50 sites</span>
              <span className="font-mono text-green-400">-18%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">51+ sites</span>
              <span className="font-mono text-gold-400">Custom</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-accent/10 rounded-xl p-4 border border-purple-500/30">
        <h4 className="font-bold text-sm flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-purple-400" />
          Revenue Projections
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-muted-foreground">2025</p>
            <p className="font-bold text-lg text-green-400">$300K</p>
            <p className="text-xs">100 customers</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">2026</p>
            <p className="font-bold text-lg text-blue-400">$1.5M</p>
            <p className="text-xs">500 customers</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">2027</p>
            <p className="font-bold text-lg text-purple-400">$6M</p>
            <p className="text-xs">2,000 customers</p>
          </div>
        </div>
      </div>

      <div className="bg-accent/10 rounded-xl p-4 border border-accent/30">
        <h4 className="font-bold text-sm flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-accent" />
          Market Opportunity
        </h4>
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">$46.5B</strong> U.S. painting market • 
          <strong className="text-foreground"> 300,000+</strong> contractors • 
          <strong className="text-foreground"> 4.2%</strong> CAGR
        </p>
      </div>

      <div className="flex gap-2">
        <a
          href="/INVESTOR_PRICING.md"
          target="_blank"
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm"
          data-testid="link-download-md"
        >
          <Download className="w-4 h-4" />
          View Full Document
        </a>
        <motion.button
          onClick={copyAllContent}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-testid="button-copy-investor-sheet-bottom"
        >
          <Copy className="w-4 h-4" />
          Copy for Email
        </motion.button>
      </div>
    </div>
  );
}

export default function Developer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState("1.0.0");
  const [buildNumber, setBuildNumber] = useState(0);
  const [lastReleaseId, setLastReleaseId] = useState<string | null>(null);
  const [isStamping, setIsStamping] = useState(false);
  const [stampStatus, setStampStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/releases/latest')
      .then(res => res.json())
      .then(data => {
        setCurrentVersion(data.version || "1.0.0");
        setBuildNumber(data.buildNumber || 0);
        if (data.id) setLastReleaseId(data.id);
      })
      .catch(() => {});
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DEVELOPER_PIN) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid PIN");
      setPin("");
    }
  };

  const bumpVersion = async (type: "major" | "minor" | "patch") => {
    try {
      setStampStatus('Creating new version...');
      const response = await fetch('/api/releases/bump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bumpType: type }),
      });
      if (!response.ok) {
        setStampStatus('Failed to create version');
        return;
      }
      const data = await response.json();
      if (data.release) {
        setCurrentVersion(data.release.version);
        setBuildNumber(data.release.buildNumber);
        setLastReleaseId(data.release.id);
        setStampStatus(`v${data.release.version} created - auto-stamping to Solana...`);
        
        setIsStamping(true);
        try {
          const stampResponse = await fetch(`/api/releases/${data.release.id}/stamp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ network: 'mainnet-beta' }),
          });
          if (stampResponse.ok) {
            const stampData = await stampResponse.json();
            if (stampData.blockchain?.signature) {
              setStampStatus(`✓ v${data.release.version} stamped: ${stampData.blockchain.signature.slice(0, 16)}...`);
            } else {
              setStampStatus(`✓ v${data.release.version} created (stamp pending)`);
            }
          } else {
            setStampStatus(`✓ v${data.release.version} created (stamp unavailable)`);
          }
        } catch {
          setStampStatus(`✓ v${data.release.version} created (stamp unavailable)`);
        } finally {
          setIsStamping(false);
        }
      }
    } catch (err) {
      console.error('Failed to bump version:', err);
      setStampStatus('Failed to create version');
    }
  };

  const stampToSolana = async () => {
    if (!lastReleaseId) return;
    setIsStamping(true);
    setStampStatus('Stamping to Solana...');
    try {
      const response = await fetch(`/api/releases/${lastReleaseId}/stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network: 'mainnet-beta' }),
      });
      const data = await response.json();
      if (data.blockchain?.signature) {
        setStampStatus(`✓ Stamped to Solana: ${data.blockchain.signature.slice(0, 16)}...`);
      } else {
        setStampStatus('Stamp pending confirmation');
      }
    } catch (err) {
      setStampStatus('Failed to stamp to Solana');
    } finally {
      setIsStamping(false);
    }
  };

  const modalContents: Record<string, ModalContent> = {
    database: {
      title: "Database Management",
      icon: <Database className="w-8 h-8 text-purple-400" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 font-bold">PostgreSQL Connected</span>
            </div>
            <p className="text-sm text-muted-foreground">Neon-backed database with automatic scaling and instant branching</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-accent">7</p>
              <p className="text-xs text-muted-foreground">Active Tables</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-purple-400">Drizzle ORM</p>
              <p className="text-xs text-muted-foreground">Type-safe queries</p>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 font-mono text-xs">
            <p className="text-green-400">Tables: leads, estimates, seo_tags, crm_deals,</p>
            <p className="text-green-400">crm_activities, crm_notes, user_pins</p>
          </div>
        </div>
      ),
    },
    api: {
      title: "API Status & Endpoints",
      icon: <Server className="w-8 h-8 text-accent" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 font-bold text-lg">All Systems Operational</span>
          </div>
          <div className="grid gap-2">
            {[
              { method: "GET/POST", path: "/api/leads", status: "active" },
              { method: "GET/POST", path: "/api/estimates", status: "active" },
              { method: "CRUD", path: "/api/crm/deals", status: "active" },
              { method: "CRUD", path: "/api/crm/activities", status: "active" },
              { method: "POST", path: "/api/auth/pin/*", status: "active" },
            ].map((endpoint, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-accent/20 text-accent px-2 py-1 rounded">{endpoint.method}</span>
                  <span className="text-sm font-mono">{endpoint.path}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    performance: {
      title: "Performance Metrics",
      icon: <Cpu className="w-8 h-8 text-accent" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Sparkles className="w-12 h-12 mx-auto text-gold-400 mb-3" />
            <h3 className="text-xl font-bold">Lightning Fast Performance</h3>
            <p className="text-sm text-muted-foreground">Optimized for the painting industry</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-3xl font-bold text-green-400">&lt;100ms</p>
              <p className="text-xs text-muted-foreground">API Response</p>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-3xl font-bold text-accent">99.9%</p>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-3xl font-bold text-purple-400">A+</p>
              <p className="text-xs text-muted-foreground">Lighthouse Score</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-accent/10 to-purple-500/10 rounded-xl p-4 border border-accent/20">
            <p className="text-sm"><Zap className="w-4 h-4 inline mr-2 text-gold-400" />Powered by Vite for instant hot module replacement and optimized builds</p>
          </div>
        </div>
      ),
    },
    version: {
      title: "Version Control & Auto-Bumping",
      icon: <GitBranch className="w-8 h-8 text-accent" />,
      content: (
        <div className="space-y-6">
          <div className="text-center bg-gradient-to-br from-purple-500/20 to-accent/10 rounded-2xl p-6 border border-purple-500/30">
            <p className="text-sm text-muted-foreground mb-2">Current Version</p>
            <p className="text-4xl font-bold font-mono text-purple-400">v{currentVersion}</p>
            <p className="text-xs text-muted-foreground mt-2">Build #{buildNumber}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              onClick={() => bumpVersion("patch")}
              className="p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-bump-patch"
            >
              <p className="font-bold">Patch</p>
              <p className="text-xs opacity-70">Bug fixes</p>
            </motion.button>
            <motion.button
              onClick={() => bumpVersion("minor")}
              className="p-3 rounded-xl bg-accent/20 border border-accent/30 text-accent hover:bg-accent/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-bump-minor"
            >
              <p className="font-bold">Minor</p>
              <p className="text-xs opacity-70">New features</p>
            </motion.button>
            <motion.button
              onClick={() => bumpVersion("major")}
              className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-bump-major"
            >
              <p className="font-bold">Major</p>
              <p className="text-xs opacity-70">Breaking changes</p>
            </motion.button>
          </div>
          
          {lastReleaseId && (
            <motion.button
              onClick={stampToSolana}
              disabled={isStamping}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400 hover:from-amber-500/30 hover:to-yellow-500/30 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              data-testid="button-stamp-solana"
            >
              <p className="font-bold">{isStamping ? 'Stamping...' : 'Stamp to Solana Blockchain'}</p>
              <p className="text-xs opacity-70">Create permanent on-chain record</p>
            </motion.button>
          )}
          
          {stampStatus && (
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-sm text-center text-muted-foreground">{stampStatus}</p>
            </div>
          )}
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm text-muted-foreground">
              <Clock className="w-4 h-4 inline mr-2" />
              Version bumps create hallmarks automatically
            </p>
          </div>
        </div>
      ),
    },
    solana: {
      title: "Solana Blockchain Stamping",
      icon: <Coins className="w-8 h-8 text-gold-400" />,
      content: <SolanaModalContent />,
    },
    hallmarks: {
      title: "ORBIT Hallmark System",
      icon: <Award className="w-8 h-8 text-amber-400" />,
      content: <HallmarkModalContent />,
    },
    darkwave: {
      title: "Darkwave Dev Hub Connection",
      icon: <Link2 className="w-8 h-8 text-purple-400" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600/40 to-blue-500/40 flex items-center justify-center border border-purple-500/50"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Rocket className="w-10 h-10 text-purple-400" />
            </motion.div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Darkwave Dev Hub</h3>
            <p className="text-sm text-muted-foreground">Next-gen development ecosystem by Orbit</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm font-bold">Multi-Tenant</p>
              <p className="text-xs text-muted-foreground">Infinite scaling</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-gold-400" />
              <p className="text-sm font-bold">Real-time Sync</p>
              <p className="text-xs text-muted-foreground">Live updates</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-500/30">
            <p className="text-sm">
              <Sparkles className="w-4 h-4 inline mr-2 text-purple-400" />
              Connected to Orbit's proprietary development infrastructure for automated deployments, real-time monitoring, and cross-platform synchronization
            </p>
          </div>
        </div>
      ),
    },
    serviceAreas: {
      title: "Active Service Areas",
      icon: <MapPin className="w-8 h-8 text-teal-400" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <Globe className="w-12 h-12 mx-auto text-teal-400 mb-3" />
            <h3 className="text-xl font-bold">Tennessee & Beyond</h3>
            <p className="text-sm text-muted-foreground">Expanding our service footprint</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {SERVICE_AREAS.map((area, i) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-teal-500/20 to-accent/10 rounded-xl p-3 border border-teal-500/30 text-center"
              >
                <MapPin className="w-4 h-4 mx-auto mb-1 text-teal-400" />
                <p className="text-sm font-medium">{area}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-teal-500/10 rounded-xl p-4 border border-teal-500/30">
            <p className="text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 inline mr-2 text-teal-400" />
              Premium painting services now available across Middle Tennessee and Southern Kentucky regions
            </p>
          </div>
        </div>
      ),
    },
    colorWheel: {
      title: "Sherwin-Williams Integration",
      icon: <Palette className="w-8 h-8 text-accent" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              className="w-24 h-24 mx-auto mb-4 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, #FF6B6B, #FFE66D, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD, #FF6B6B)"
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <h3 className="text-xl font-bold">Color Visualization</h3>
            <p className="text-sm text-muted-foreground">Powered by Sherwin-Williams ColorSnap</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { name: "Agreeable Gray", hex: "#D1CBC1" },
              { name: "Repose Gray", hex: "#C2BDB6" },
              { name: "Accessible Beige", hex: "#D1C6B4" },
              { name: "Pure White", hex: "#F0EDE5" },
            ].map((color) => (
              <div key={color.name} className="text-center">
                <div 
                  className="w-full aspect-square rounded-xl border-2 border-white/20 mb-2"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-xs text-muted-foreground">{color.name}</p>
              </div>
            ))}
          </div>
          <div className="bg-accent/10 rounded-xl p-4 border border-accent/30">
            <p className="text-sm">
              <Palette className="w-4 h-4 inline mr-2 text-accent" />
              Full Sherwin-Williams color library with AI-powered room visualization
            </p>
          </div>
        </div>
      ),
    },
    console: {
      title: "Developer Console",
      icon: <Terminal className="w-8 h-8 text-green-400" />,
      content: (
        <div className="space-y-4">
          <div className="bg-black rounded-xl p-4 font-mono text-sm h-64 overflow-auto border border-green-500/30">
            <p className="text-green-400">[{new Date().toLocaleTimeString()}] System initialized</p>
            <p className="text-muted-foreground">[INFO] Loading PaintPros.io v{currentVersion}</p>
            <p className="text-muted-foreground">[INFO] PostgreSQL connection established</p>
            <p className="text-blue-400">[DB] 7 tables loaded successfully</p>
            <p className="text-muted-foreground">[INFO] CRM module initialized</p>
            <p className="text-muted-foreground">[INFO] Estimator engine ready</p>
            <p className="text-purple-400">[DARKWAVE] Connected to Dev Hub</p>
            <p className="text-gold-400">[SOLANA] Blockchain stamping module loaded</p>
            <p className="text-accent">[READY] Server listening on port 5000</p>
            <p className="text-green-400 animate-pulse">_ Awaiting commands...</p>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter command..." 
              className="bg-black/50 border-green-500/30 font-mono text-sm"
              data-testid="input-console-command"
            />
            <FlipButton className="px-4" data-testid="button-run-command">
              Run
            </FlipButton>
          </div>
        </div>
      ),
    },
    proposalTemplates: {
      title: "Proposal Templates",
      icon: <ScrollText className="w-8 h-8 text-accent" />,
      content: <ProposalTemplateManager maxHeight="350px" />,
    },
    debug: {
      title: "Debug & Environment",
      icon: <Bug className="w-8 h-8 text-accent" />,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-accent/10 rounded-xl p-4 border border-accent/30">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-accent" />
              <span className="font-bold">Development Mode</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
              Active
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-muted-foreground mb-1">Environment</p>
              <p className="font-mono text-green-400">development</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-muted-foreground mb-1">Node Version</p>
              <p className="font-mono text-accent">v20.x</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-muted-foreground mb-1">React Version</p>
              <p className="font-mono text-blue-400">18.3.1</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-muted-foreground mb-1">TypeScript</p>
              <p className="font-mono text-purple-400">5.6.x</p>
            </div>
          </div>
          <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
            <p className="text-sm text-yellow-400">
              <Bug className="w-4 h-4 inline mr-2" />
              Hot Module Replacement enabled for instant updates
            </p>
          </div>
        </div>
      ),
    },
    investorPricing: {
      title: "Investor Pricing Sheet",
      icon: <DollarSign className="w-8 h-8 text-green-400" />,
      content: <InvestorPricingContent />,
    },
    integrations: {
      title: "Integrations Roadmap",
      icon: <ListTodo className="w-8 h-8 text-blue-400" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <ListTodo className="w-12 h-12 mx-auto text-blue-400 mb-3" />
            <h3 className="text-xl font-bold">Future Integrations</h3>
            <p className="text-sm text-muted-foreground">Planned enhancements for analytics & tracking</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-orange-400">Google Analytics 4</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">Planned</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect GA4 for advanced audience insights, conversion tracking, and cross-platform analytics
                  </p>
                  <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Circle className="w-3 h-3 text-yellow-400" />
                      <span>Add GOOGLE_ANALYTICS_ID to secrets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="w-3 h-3 text-yellow-400" />
                      <span>Implement gtag.js script loader</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="w-3 h-3 text-yellow-400" />
                      <span>Add event tracking for estimates & leads</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-blue-400">Facebook Pixel</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">Future</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track conversions from Facebook/Instagram ads and build remarketing audiences
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-green-400">Hotjar / Heatmaps</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">Future</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visual heatmaps and session recordings to understand user behavior
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
            <p className="text-sm text-blue-400">
              <Sparkles className="w-4 h-4 inline mr-2" />
              Currently using built-in analytics. External integrations coming soon!
            </p>
          </div>
        </div>
      ),
    },
  };

  const closeModal = () => setActiveModal(null);

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <main className="pt-24 px-4 md:px-8 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-accent/20 blur-3xl opacity-40" />
              <GlassCard className="relative p-10 border-purple-500/20" glow>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/30 to-accent/20 flex items-center justify-center border border-purple-500/30">
                    <Code className="w-10 h-10 text-purple-400" />
                  </div>
                  <h1 className="text-3xl font-display font-bold mb-2">Developer Access</h1>
                  <p className="text-muted-foreground">Enter your PIN to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-white/5 border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl"
                    maxLength={4}
                    data-testid="input-developer-pin"
                  />
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <FlipButton className="w-full h-14" data-testid="button-developer-login">
                    Access Console <ArrowRight className="w-5 h-5" />
                  </FlipButton>
                </form>
              </GlassCard>
            </div>
          </motion.div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="pt-20 px-4 md:px-8 pb-24">
        <motion.div 
          className="max-w-7xl mx-auto mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className={`${iconContainerStyles.sizes.xl} ${iconContainerStyles.base} ${iconContainerStyles.gradients.purple}`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Code className="w-7 h-7 text-purple-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Developer Console</h1>
              <p className="text-muted-foreground">System configuration and debugging</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
        <BentoGrid>
          <BentoItem colSpan={4} rowSpan={2}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3D}
              whileTap={tapEffect}
              onClick={() => setActiveModal("database")}
              data-testid="card-database"
            >
              <GlassCard className={`h-full p-8 ${cardBackgroundStyles.purple}`} glow="purple" animatedBorder>
                <div className="flex items-center gap-3 mb-6">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.lg} ${iconContainerStyles.base} ${iconContainerStyles.gradients.purple}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <Database className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  <h2 className="text-2xl font-display font-bold">Database</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 font-medium">Connected</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 font-mono text-xs text-muted-foreground">
                    <p>PostgreSQL + Drizzle ORM</p>
                    <p className="text-accent">7 Active Tables</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Click to manage</p>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3DSubtle}
              whileTap={tapEffect}
              onClick={() => setActiveModal("api")}
              data-testid="card-api"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.accent}`} glow="accent">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.accent}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <Server className="w-4 h-4 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-bold">API Status</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm text-green-400">All systems operational</span>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3DSubtle}
              whileTap={tapEffect}
              onClick={() => setActiveModal("performance")}
              data-testid="card-performance"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.blue}`} glow="blue">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.blue}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <Cpu className="w-4 h-4 text-blue-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Performance</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span className="text-sm text-muted-foreground">Lightning fast &lt;100ms</span>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3D}
              whileTap={tapEffect}
              onClick={() => setActiveModal("solana")}
              data-testid="card-solana"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.gold}`} glow="gold" animatedBorder>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.gold}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <Coins className="w-4 h-4 text-gold-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Solana Stamping</h3>
                </div>
                <p className="text-sm text-muted-foreground">Blockchain-verified estimates</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3D}
              whileTap={tapEffect}
              onClick={() => setActiveModal("hallmarks")}
              data-testid="card-hallmarks"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.gold}`} glow="gold" animatedBorder>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.gold}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Hallmarks</h3>
                </div>
                <p className="text-sm text-muted-foreground">ORBIT asset verification</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3D}
              whileTap={tapEffect}
              onClick={() => setActiveModal("darkwave")}
              data-testid="card-darkwave"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.purple}`} glow="purple" animatedBorder>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.purple}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <Rocket className="w-4 h-4 text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Darkwave Dev Hub</h3>
                </div>
                <p className="text-sm text-muted-foreground">Connected to Orbit ecosystem</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3D}
              whileTap={tapEffect}
              onClick={() => setActiveModal("investorPricing")}
              data-testid="card-investor-pricing"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.green}`} glow="green" animatedBorder>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.green}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Investor Pricing</h3>
                </div>
                <p className="text-sm text-muted-foreground">Licensing & valuation sheet</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3DSubtle}
              whileTap={tapEffect}
              onClick={() => setActiveModal("serviceAreas")}
              data-testid="card-service-areas"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.accent}`} glow="accent">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.accent}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <MapPin className="w-4 h-4 text-teal-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Service Areas</h3>
                </div>
                <p className="text-sm text-muted-foreground">{SERVICE_AREAS.length} active regions</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={8} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3DSubtle}
              whileTap={tapEffect}
              onClick={() => setActiveModal("console")}
              data-testid="card-console"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.green}`} glow="green">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.green}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <Terminal className="w-4 h-4 text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Console</h3>
                </div>
                <div className="bg-black/50 rounded-xl p-4 font-mono text-sm h-32 overflow-auto border border-white/10">
                  <p className="text-green-400">[System] Application initialized</p>
                  <p className="text-muted-foreground">[Info] Database connection established</p>
                  <p className="text-purple-400">[Darkwave] Connected to Dev Hub</p>
                  <p className="text-accent">[Ready] Server listening on port 5000</p>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3DSubtle}
              whileTap={tapEffect}
              onClick={() => setActiveModal("version")}
              data-testid="card-version"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.purple}`} glow="purple">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.purple}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <GitBranch className="w-4 h-4 text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Version Control</h3>
                </div>
                <p className="text-sm font-mono text-purple-400">v{currentVersion}</p>
                <p className="text-xs text-muted-foreground">Auto-bumping enabled</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3DSubtle}
              whileTap={tapEffect}
              onClick={() => setActiveModal("debug")}
              data-testid="card-debug"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.accent}`} glow="accent">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.accent}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <Bug className="w-4 h-4 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Debug Mode</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Development environment</span>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <RoomScannerCard locked={false} accentColor="purple-400" />
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3D}
              whileTap={tapEffect}
              onClick={() => setActiveModal("colorWheel")}
              data-testid="card-color-wheel"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.mixed}`} glow="accent" animatedBorder>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.accent}`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Palette className="w-4 h-4 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Color Wheel</h3>
                </div>
                <p className="text-sm text-muted-foreground">Sherwin-Williams linked</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={6} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3D}
              whileTap={tapEffect}
              onClick={() => setActiveModal("proposalTemplates")}
              data-testid="card-proposal-templates"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.mixed}`} glow="accent" animatedBorder>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.accent}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <ScrollText className="w-4 h-4 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Proposal Templates</h3>
                </div>
                <p className="text-sm text-muted-foreground">Manage painting proposal templates</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={6} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3D}
              whileTap={tapEffect}
              onClick={() => setActiveModal("integrations")}
              data-testid="card-integrations"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.blue}`} glow="blue" animatedBorder>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.blue}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <ListTodo className="w-4 h-4 text-blue-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Integrations Roadmap</h3>
                </div>
                <p className="text-sm text-muted-foreground">Google Analytics, Facebook Pixel & more</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          {/* Bookings Management */}
          <BentoItem colSpan={6} rowSpan={2}>
            <motion.div 
              className="h-full" 
              variants={cardVariants}
              whileHover={hover3DSubtle}
              whileTap={tapEffect}
            >
              <GlassCard className={`h-full p-4 ${cardBackgroundStyles.purple}`} glow="purple" animatedBorder>
                <BookingsCard />
              </GlassCard>
            </motion.div>
          </BentoItem>

          {/* Version History - All Tenants */}
          <BentoItem colSpan={6} rowSpan={2}>
            <motion.div 
              className="h-full" 
              variants={cardVariants}
              whileHover={hover3DSubtle}
              whileTap={tapEffect}
            >
              <VersionHistory showAllTenants={true} maxItems={10} />
            </motion.div>
          </BentoItem>

          {/* Analytics Dashboard - Full Width */}
          <BentoItem colSpan={12} rowSpan={4}>
            <AnalyticsDashboard />
          </BentoItem>

          {/* Tenant Analytics Dashboard - Per-Client Analytics */}
          <BentoItem colSpan={12} rowSpan={4}>
            <motion.div variants={cardVariants} className="h-full">
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.mixed}`} glow="purple" animatedBorder>
                <TenantAnalyticsDashboard />
              </GlassCard>
            </motion.div>
          </BentoItem>
        </BentoGrid>
        </motion.div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && modalContents[activeModal] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6 md:p-8" glow>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {modalContents[activeModal].icon}
                    <h2 className="text-2xl font-display font-bold">{modalContents[activeModal].title}</h2>
                  </div>
                  <motion.button
                    onClick={closeModal}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    data-testid="button-close-modal"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                {modalContents[activeModal].content}
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
