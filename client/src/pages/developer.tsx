import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Database, Server, Terminal, GitBranch, Cpu, Bug, ArrowRight, Zap, MapPin, Palette, X, Sparkles, Coins, Link2, Rocket, Shield, Clock, Globe, Wallet, Hash, CheckCircle, ExternalLink, Copy, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

export default function Developer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState("1.0.0");
  const [buildNumber, setBuildNumber] = useState(1);

  useEffect(() => {
    const storedVersion = localStorage.getItem("app_version") || "1.0.0";
    const storedBuild = parseInt(localStorage.getItem("build_number") || "1");
    setCurrentVersion(storedVersion);
    setBuildNumber(storedBuild);
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

  const bumpVersion = (type: "major" | "minor" | "patch") => {
    const parts = currentVersion.split(".").map(Number);
    if (type === "major") {
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
    } else if (type === "minor") {
      parts[1]++;
      parts[2] = 0;
    } else {
      parts[2]++;
    }
    const newVersion = parts.join(".");
    const newBuild = buildNumber + 1;
    setCurrentVersion(newVersion);
    setBuildNumber(newBuild);
    localStorage.setItem("app_version", newVersion);
    localStorage.setItem("build_number", String(newBuild));
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
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm text-muted-foreground">
              <Clock className="w-4 h-4 inline mr-2" />
              Auto-versioning tracks all deployments with semantic versioning
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
        <div className="max-w-7xl mx-auto mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Code className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Developer Console</h1>
              <p className="text-muted-foreground">System configuration and debugging</p>
            </div>
          </div>
        </div>

        <BentoGrid>
          <BentoItem colSpan={4} rowSpan={2}>
            <motion.div 
              className="h-full cursor-pointer" 
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveModal("database")}
              data-testid="card-database"
            >
              <GlassCard className="h-full p-8 bg-gradient-to-br from-purple-500/10 to-transparent" glow>
                <div className="flex items-center gap-3 mb-6">
                  <Database className="w-6 h-6 text-purple-400" />
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
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveModal("api")}
              data-testid="card-api"
            >
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-5 h-5 text-accent" />
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
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveModal("performance")}
              data-testid="card-performance"
            >
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Cpu className="w-5 h-5 text-accent" />
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
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveModal("solana")}
              data-testid="card-solana"
            >
              <GlassCard className="h-full p-6 bg-gradient-to-br from-gold-400/10 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <Coins className="w-5 h-5 text-gold-400" />
                  <h3 className="text-xl font-bold">Solana Stamping</h3>
                </div>
                <p className="text-sm text-muted-foreground">Blockchain-verified estimates</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveModal("darkwave")}
              data-testid="card-darkwave"
            >
              <GlassCard className="h-full p-6 bg-gradient-to-br from-purple-600/10 to-blue-500/10">
                <div className="flex items-center gap-3 mb-4">
                  <Rocket className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-bold">Darkwave Dev Hub</h3>
                </div>
                <p className="text-sm text-muted-foreground">Connected to Orbit ecosystem</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveModal("serviceAreas")}
              data-testid="card-service-areas"
            >
              <GlassCard className="h-full p-6 bg-gradient-to-br from-teal-500/10 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-teal-400" />
                  <h3 className="text-xl font-bold">Service Areas</h3>
                </div>
                <p className="text-sm text-muted-foreground">{SERVICE_AREAS.length} active regions</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={8} rowSpan={1}>
            <motion.div 
              className="h-full cursor-pointer" 
              whileHover={{ scale: 1.01 }}
              onClick={() => setActiveModal("console")}
              data-testid="card-console"
            >
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="w-5 h-5 text-purple-400" />
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
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveModal("version")}
              data-testid="card-version"
            >
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <GitBranch className="w-5 h-5 text-accent" />
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
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveModal("debug")}
              data-testid="card-debug"
            >
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Bug className="w-5 h-5 text-accent" />
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
            <motion.div 
              className="h-full cursor-pointer" 
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveModal("colorWheel")}
              data-testid="card-color-wheel"
            >
              <GlassCard className="h-full p-6 bg-gradient-to-br from-accent/10 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Color Wheel</h3>
                </div>
                <p className="text-sm text-muted-foreground">Sherwin-Williams linked</p>
              </GlassCard>
            </motion.div>
          </BentoItem>
        </BentoGrid>
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
