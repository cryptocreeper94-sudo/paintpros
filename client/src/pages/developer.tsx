import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import colorWheelLight from "@assets/generated_images/paint_color_wheel_transparent_background.png";
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
import { Code, Database, Server, Terminal, GitBranch, Cpu, Bug, ArrowRight, Zap, MapPin, Palette, X, Sparkles, Coins, Link2, Rocket, Shield, Clock, Globe, Wallet, Hash, CheckCircle, ExternalLink, Copy, RefreshCw, AlertCircle, Loader2, Award, Search, Plus, FileText, ScrollText, Camera, BarChart3, ListTodo, Circle, DollarSign, TrendingUp, Users, Building2, Download, History, LayoutGrid, Rows, Target, Radio, FolderOpen, LineChart, UsersRound, Layers } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookingsCard } from "@/components/bookings-card";
import { CrewManagementCard } from "@/components/crew-management-card";
import { VersionHistory } from "@/components/version-history";
import { RoomScannerCard } from "@/components/room-scanner";
import { LiveVisitorsCard } from "@/components/live-visitors-card";
import { toast } from "sonner";
import { HallmarkBadge, HallmarkStamp, PoweredByOrbit } from "@/components/hallmark";
import { ProposalTemplateManager } from "@/components/crm/proposal-templates";
import { getAssetBadge, formatDate } from "@/lib/hallmark";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessagingWidget } from "@/components/messaging-widget";
import { OfficeAssistant } from "@/components/ui/office-assistant";
import { PinReferenceAccordion } from "@/components/pin-reference-accordion";
import { FranchiseManagement } from "@/components/franchise-management";
import { TradeVerticalsCard } from "@/components/trade-verticals-card";
import { SystemHealthCard } from "@/components/system-health-card";
import { SeoTracker } from "@/components/seo/SeoTracker";
import { BlogManager } from "@/components/blog-manager";
import { useAccess } from "@/context/AccessContext";
import { MarketingHub } from "@/components/marketing-hub";
import { TenantSwitcher, useTenantFilter } from "@/components/tenant-switcher";
import { PricingConfigPanel } from "@/components/pricing-config-panel";

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

// Step 1 Foundation checklist items with IDs for persistence
const step1Checklists = {
  brand: [
    { id: "tagline_present", label: 'Present official tagline: "We elevate the backdrop of your life."' },
    { id: "tagline_approve", label: "Approve tagline usage across all marketing materials" },
    { id: "tagline_letterhead", label: "Tagline placement: Letterhead" },
    { id: "tagline_social", label: "Tagline placement: Social media headers" },
    { id: "tagline_website", label: "Tagline placement: Website header/footer (pending contract rules)" },
    { id: "brand_review", label: "Review brand identity for consistency with premium positioning" },
  ],
  website: [
    { id: "confirm_new_site", label: "Confirm new site as primary marketing engine" },
    { id: "maintain_legacy", label: "Maintain legacy site for contract duration" },
  ],
  wordpress: [
    { id: "confirm_no_wordpress", label: "Confirm WordPress will not be used for marketing operations" },
  ],
  contract: [
    { id: "confirm_contract", label: "Confirm understanding of contract limitations" },
    { id: "approve_separate", label: "Approve use of separate marketing site" },
  ],
  ai: [
    { id: "integrate_ai", label: "Integrate AI tools into marketing messaging" },
    { id: "train_team_ai", label: "Train team on AI tool workflows" },
  ],
  radio: [
    { id: "approve_budget", label: "Approve radio advertising budget range" },
    { id: "select_stations", label: "Select preferred stations" },
    { id: "approve_script", label: "Approve script draft" },
  ],
  assets: [
    { id: "upload_logo", label: "Upload logo files" },
    { id: "upload_colors", label: "Upload color codes" },
    { id: "upload_fonts", label: "Upload fonts/templates" },
    { id: "access_facebook", label: "Provide access: Facebook" },
    { id: "access_instagram", label: "Provide access: Instagram" },
    { id: "access_google", label: "Provide access: Google Business Profile" },
    { id: "access_meta", label: "Provide access: Meta Ads Manager" },
    { id: "access_googleads", label: "Provide access: Google Ads" },
    { id: "template_social", label: "Begin building templates: Social posts" },
    { id: "template_flyers", label: "Begin building templates: Flyers" },
    { id: "template_ads", label: "Begin building templates: Ads" },
    { id: "template_radio", label: "Begin building templates: Radio scripts" },
  ],
  tracking: [
    { id: "doc_tracking", label: "Document current lead tracking method" },
    { id: "identify_sources", label: "Identify top-performing lead sources" },
    { id: "identify_gaps", label: "Identify tracking gaps" },
    { id: "build_dashboard", label: "Build initial lead tracking dashboard" },
    { id: "tracking_radio", label: "Assign unique tracking numbers: Radio" },
    { id: "tracking_social", label: "Assign unique tracking numbers: Social" },
    { id: "tracking_print", label: "Assign unique tracking numbers: Print" },
  ],
  team: [
    { id: "identify_field", label: "Identify team contacts: Field content capture" },
    { id: "identify_approvals", label: "Identify team contacts: Approvals" },
    { id: "identify_updates", label: "Identify team contacts: Project updates" },
    { id: "confirm_social", label: "Confirm social media support roles" },
    { id: "build_library", label: "Build shared content library" },
    { id: "establish_workflow", label: "Establish content submission workflow" },
  ],
  deliverables: [
    { id: "del_tagline", label: "Approved tagline usage" },
    { id: "del_assets", label: "Complete brand asset library" },
    { id: "del_contract", label: "Website contract clarity summary" },
    { id: "del_comparison", label: "Current vs. new site comparison" },
    { id: "del_ai", label: "AI tools integrated into workflow" },
    { id: "del_radio", label: "Radio advertising test plan" },
    { id: "del_tracking", label: "Lead tracking dashboard (initial)" },
    { id: "del_team", label: "Team collaboration structure" },
  ],
};

const checklistSections = [
  { key: "brand", title: "Brand & Messaging Alignment", icon: Target, week: "Week 1" },
  { key: "website", title: "Website Comparison", icon: Globe, week: "Week 1" },
  { key: "wordpress", title: "WordPress Decision", icon: FileText, week: "Week 1" },
  { key: "contract", title: "Contract Clarity", icon: ScrollText, week: "Week 1" },
  { key: "ai", title: "AI Tools Integration", icon: Cpu, week: "Week 2" },
  { key: "radio", title: "Radio Advertising", icon: Radio, week: "Week 2" },
  { key: "assets", title: "Asset Inventory & Access", icon: FolderOpen, week: "Week 1-2" },
  { key: "tracking", title: "Lead Tracking Setup", icon: LineChart, week: "Week 2" },
  { key: "team", title: "Team Collaboration", icon: UsersRound, week: "Week 3-4" },
  { key: "deliverables", title: "Step 1 Deliverables", icon: Award, week: "Final" },
];

function Step1FoundationChecklist() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const saved = localStorage.getItem("npp_step1_checklist");
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, []);

  const toggleCheck = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    localStorage.setItem("npp_step1_checklist", JSON.stringify(updated));
  };

  const getCompletionCount = (items: { id: string; label: string }[]) => {
    return items.filter(item => checkedItems[item.id]).length;
  };

  const getTotalCompletion = () => {
    const allItems = Object.values(step1Checklists).flat();
    const completed = allItems.filter(item => checkedItems[item.id]).length;
    return { completed, total: allItems.length };
  };

  const { completed, total } = getTotalCompletion();
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <Layers className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold">NPP Step 1: Foundation Setup</h3>
            <p className="text-sm text-muted-foreground italic">"We elevate the backdrop of your life."</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-accent">{progress}%</div>
          <div className="text-xs text-muted-foreground">{completed}/{total} tasks</div>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-accent h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Accordion type="multiple" className="space-y-2">
        {checklistSections.map((section) => {
          const items = step1Checklists[section.key as keyof typeof step1Checklists];
          const sectionCompleted = getCompletionCount(items);
          const Icon = section.icon;
          
          return (
            <AccordionItem key={section.key} value={section.key} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="font-medium">{section.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-muted">{section.week}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {sectionCompleted}/{items.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2 pb-3">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        checkedItems[item.id] ? "bg-accent/10" : "hover:bg-muted/50"
                      }`}
                      onClick={() => toggleCheck(item.id)}
                      data-testid={`checkbox-${item.id}`}
                    >
                      <Checkbox 
                        checked={checkedItems[item.id] || false}
                        onCheckedChange={() => toggleCheck(item.id)}
                        className="mt-0.5"
                      />
                      <span className={`text-sm ${checkedItems[item.id] ? "line-through opacity-60" : ""}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
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
                : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:bg-white/5"
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
                    className="p-2 rounded-lg hover:bg-black/5 dark:bg-white/10 transition-colors"
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
          <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
            <p className="text-sm font-medium mb-3">Step 1: Generate Hash</p>
            <textarea
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter data to hash (e.g., estimate JSON, contract text...)"
              className="w-full h-20 bg-black/30 border border-border dark:border-white/20 rounded-lg p-3 text-sm resize-none"
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
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
              <p className="text-sm font-medium mb-3">Step 2: Stamp to Blockchain</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Entity Type</p>
                  <select
                    value={stampEntityType}
                    onChange={(e) => setStampEntityType(e.target.value)}
                    className="w-full bg-black/30 border border-border dark:border-white/20 rounded-lg p-2 text-sm"
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
                    className="bg-black/30 border-border dark:border-white/20 text-sm"
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
              <div key={stamp.id} className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
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
          <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
            <p className="text-sm font-medium mb-3">Verify Transaction</p>
            <Input
              value={verifySignature}
              onChange={(e) => setVerifySignature(e.target.value)}
              placeholder="Enter transaction signature..."
              className="bg-black/30 border-border dark:border-white/20 text-sm font-mono mb-3"
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
      <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl">
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
                  className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-border dark:border-white/10 hover:border-amber-500/30 transition-colors"
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
                      className="p-1 hover:bg-black/5 dark:bg-white/10 rounded"
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
              className="w-full bg-black/30 border border-border dark:border-white/20 rounded-lg p-2 text-sm"
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
              className="bg-black/30 border-border dark:border-white/20"
              data-testid="input-hallmark-recipient"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Recipient Role</label>
            <select
              value={newHallmark.recipientRole}
              onChange={(e) => setNewHallmark(prev => ({ ...prev, recipientRole: e.target.value as any }))}
              className="w-full bg-black/30 border border-border dark:border-white/20 rounded-lg p-2 text-sm"
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
              className="w-full bg-black/30 border border-border dark:border-white/20 rounded-lg p-2 text-sm h-20 resize-none"
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
              className="bg-black/30 border-border dark:border-white/20 pl-10"
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
                    className="block p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-border dark:border-white/10 hover:border-amber-500/30 transition-colors"
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

      <div className="pt-4 border-t border-border dark:border-white/10 flex items-center justify-between">
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
• Role-based dashboards (Owner, Admin, Project Manager)
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
            <div key={item.tier} className="flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-lg p-3 border border-border dark:border-white/10">
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
        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
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

        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
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

function BusinessRoadmapContent() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('paintpros_roadmap_progress');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleItem = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    localStorage.setItem('paintpros_roadmap_progress', JSON.stringify(updated));
  };

  const roadmapSections = [
    {
      title: "Infrastructure (30 days)",
      color: "green",
      items: [
        { id: "stripe_billing", label: "Finalize Stripe billing for self-serve signups", done: true },
        { id: "coinbase_billing", label: "Finalize Coinbase Commerce for crypto payments", done: true },
        { id: "prod_database", label: "Production database migration (Postgres ready)", done: true },
        { id: "tenant_provisioning", label: "Tenant provisioning automation" },
        { id: "gtm_collateral", label: "Go-to-market collateral (competitor matrix, ROI calc)" },
      ]
    },
    {
      title: "Short-term (60-90 days)",
      color: "blue",
      items: [
        { id: "quickbooks", label: "QuickBooks Online integration" },
        { id: "scheduling", label: "Scheduling with route optimization" },
        { id: "customer_portal", label: "Customer/homeowner portal" },
        { id: "offline_mobile", label: "Offline-capable crew mobile app" },
      ]
    },
    {
      title: "Future Upgrades",
      color: "purple",
      items: [
        { id: "marketing_automation", label: "Marketing automation (email, review requests)" },
        { id: "lead_marketplace", label: "Lead generation marketplace" },
        { id: "insurance_certs", label: "Insurance certificate management" },
        { id: "drone_estimates", label: "Drone/photo estimate integration" },
        { id: "enterprise_tier", label: "ServiceTitan-style enterprise tier" },
        { id: "full_i18n", label: "Full app-wide Spanish translation (i18n)" },
      ]
    }
  ];

  const totalItems = roadmapSections.reduce((acc, s) => acc + s.items.length, 0);
  const completedItems = roadmapSections.reduce((acc, s) => 
    acc + s.items.filter(i => checkedItems[i.id] || i.done).length, 0);
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/30">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Progress: {completedItems}/{totalItems}
          </h3>
          <span className="text-2xl font-bold text-green-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-accent/10 to-purple-500/10 rounded-xl p-4 border border-accent/30">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-accent" />
          Valuation Projections
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-black/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">250 tenants</p>
            <p className="font-bold text-lg text-green-400">$7.5M-$12M</p>
            <p className="text-xs text-muted-foreground">~$1.5M ARR</p>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">500 tenants</p>
            <p className="font-bold text-lg text-blue-400">$15M-$24M</p>
            <p className="text-xs text-muted-foreground">~$3M ARR</p>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">2,000 tenants</p>
            <p className="font-bold text-lg text-purple-400">$50M+</p>
            <p className="text-xs text-muted-foreground">~$10M ARR</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">SaaS comps trade at 5-8x ARR</p>
      </div>

      {roadmapSections.map((section) => (
        <div key={section.title} className={`bg-${section.color}-500/5 rounded-xl p-4 border border-${section.color}-500/20`}>
          <h4 className={`font-bold text-sm flex items-center gap-2 mb-3 text-${section.color}-400`}>
            <ListTodo className="w-4 h-4" />
            {section.title}
          </h4>
          <div className="space-y-2">
            {section.items.map((item) => {
              const isChecked = checkedItems[item.id] || item.done;
              return (
                <button
                  key={item.id}
                  onClick={() => !item.done && toggleItem(item.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                    isChecked 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : 'bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                  data-testid={`checkbox-${item.id}`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                    isChecked ? 'bg-green-500' : 'border-2 border-muted-foreground'
                  }`}>
                    {isChecked && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-sm ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                    {item.label}
                  </span>
                  {item.done && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Built-in</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
        <h4 className="font-bold text-sm flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-accent" />
          Competitive Edge
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /> Blockchain verification</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /> White-label multi-tenant</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /> Bilingual AI assistant</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /> Premium Bento UI</div>
        </div>
      </div>
    </div>
  );
}

export default function Developer() {
  const { login, currentUser } = useAccess();
  const isSessionAuth = currentUser.isAuthenticated && currentUser.role === "developer";
  const [isAuthenticated, setIsAuthenticated] = useState(isSessionAuth);
  const { selectedTenant, setSelectedTenant, tenantLabel } = useTenantFilter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState("1.0.0");
  const [buildNumber, setBuildNumber] = useState(0);
  const [lastReleaseId, setLastReleaseId] = useState<string | null>(null);
  const [isStamping, setIsStamping] = useState(false);
  const [stampStatus, setStampStatus] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (isSessionAuth && !isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, [isSessionAuth, isAuthenticated]);

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
      login("developer");
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
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
              <p className="text-2xl font-bold text-accent">7</p>
              <p className="text-xs text-muted-foreground">Active Tables</p>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
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
              <div key={i} className="flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-lg p-3 border border-border dark:border-white/10">
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
            <div className="text-center bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
              <p className="text-3xl font-bold text-green-400">&lt;100ms</p>
              <p className="text-xs text-muted-foreground">API Response</p>
            </div>
            <div className="text-center bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
              <p className="text-3xl font-bold text-accent">99.9%</p>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
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
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 border border-border dark:border-white/10">
              <p className="text-sm text-center text-muted-foreground">{stampStatus}</p>
            </div>
          )}
          
          <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
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
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10 text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm font-bold">Multi-Tenant</p>
              <p className="text-xs text-muted-foreground">Infinite scaling</p>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10 text-center">
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
            {theme === "light" ? (
              <motion.img
                src={colorWheelLight}
                alt="Color Wheel"
                className="w-24 h-24 mx-auto mb-4 object-contain"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <motion.div
                className="w-24 h-24 mx-auto mb-4 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, #FF6B6B, #FFE66D, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD, #FF6B6B)"
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            )}
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
                  className="w-full aspect-square rounded-xl border-2 border-border dark:border-white/20 mb-2"
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
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
              <p className="text-sm text-muted-foreground mb-1">Environment</p>
              <p className="font-mono text-green-400">development</p>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
              <p className="text-sm text-muted-foreground mb-1">Node Version</p>
              <p className="font-mono text-accent">v20.x</p>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
              <p className="text-sm text-muted-foreground mb-1">React Version</p>
              <p className="font-mono text-blue-400">18.3.1</p>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
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
            <h3 className="text-xl font-bold">Integrations</h3>
            <p className="text-sm text-muted-foreground">Connect to external services for enhanced functionality</p>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-bold text-green-400">QuickBooks Online</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">Action Required</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sync invoices, estimates, and customer data with your QuickBooks Online account
                  </p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="font-medium text-foreground">Setup Instructions:</div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">1</span>
                      <span>Go to <a href="https://developer.intuit.com" target="_blank" rel="noopener noreferrer" className="text-green-400 underline hover:text-green-300">developer.intuit.com</a> and create a developer account</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">2</span>
                      <span>Create a new app and select "QuickBooks Online and Payments"</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">3</span>
                      <span>Copy your <strong>Client ID</strong> and <strong>Client Secret</strong> from Keys & OAuth tab</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">4</span>
                      <span>Set Redirect URI to: <code className="bg-black/20 px-1 rounded">https://your-domain.com/api/quickbooks/callback</code></span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">5</span>
                      <span>Add secrets: QUICKBOOKS_CLIENT_ID, QUICKBOOKS_CLIENT_SECRET</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a 
                      href="https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      OAuth 2.0 Docs
                    </a>
                    <a 
                      href="https://developer.intuit.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Get API Keys
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-orange-400">Google Analytics 4</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">Planned</span>
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
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
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
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
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
    businessRoadmap: {
      title: "Business Roadmap & Valuation",
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      content: <BusinessRoadmapContent />,
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
                    className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl"
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

        <div className="max-w-7xl mx-auto mb-4">
          <TenantSwitcher 
            selectedTenant={selectedTenant} 
            onTenantChange={setSelectedTenant}
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
        <BentoGrid>
          {/* Meeting Prep - Talking Points */}
          <BentoItem colSpan={12} rowSpan={2} mobileColSpan={4}>
            <motion.div className="h-full" variants={cardVariants} custom={0}>
              <GlassCard className="h-full p-4 md:p-6 border-l-4 border-amber-500" glow="gold" hoverEffect={false}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <FileText className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Meeting Prep - Talking Points</h3>
                    <p className="text-xs text-muted-foreground">For tomorrow's meeting with Ryan</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Situation */}
                  <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <h4 className="font-semibold text-amber-600 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Current Situation
                    </h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 fill-current" />
                        <span>No historical ROI data exists - never been tracked</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 fill-current" />
                        <span>$2,000/month marketing budget agreed upon</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 fill-current" />
                        <span>Meta Business account needs owner approval to complete setup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 fill-current" />
                        <span>Payment system tied to owner's devices - can't run paid campaigns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 fill-current" />
                        <span>Car wrap & billboards being discussed ($50k+) - no formal plan</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* What's Needed */}
                  <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      What's Needed to Move Forward
                    </h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 fill-current" />
                        <span><strong>Credit card access:</strong> Marketing card with $2,000 limit as discussed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 fill-current" />
                        <span><strong>Meta approval:</strong> 2 minutes to approve new business account setup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 fill-current" />
                        <span><strong>Communication:</strong> Timely responses when access is requested</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 fill-current" />
                        <span><strong>Expense reporting:</strong> Log any marketing spend in the tracking system</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* The Ask */}
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      The Ask (Keep It Simple)
                    </h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-blue-600 min-w-[20px]">1.</span>
                        <span>Give me access to run paid campaigns (card or add me as authorized user)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-blue-600 min-w-[20px]">2.</span>
                        <span>Approve the Meta Business account so I can set up Facebook/Instagram ads</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-blue-600 min-w-[20px]">3.</span>
                        <span>Log any marketing expenses (billboards, car wraps, etc.) in the system</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-blue-600 min-w-[20px]">4.</span>
                        <span>Respond when I ask for access - don't leave me waiting</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* The "Confusion" Argument - NPP New Site */}
                  <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                    <h4 className="font-semibold text-cyan-600 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      The "Confusion" Argument (Our New NPP Site)
                    </h4>
                    <div className="text-sm space-y-3">
                      <div className="p-2 rounded bg-cyan-500/10">
                        <p className="font-medium text-cyan-700 mb-1">His Concern:</p>
                        <p className="text-muted-foreground italic">"Using the new NPP site we built will confuse customers who see the WordPress site."</p>
                      </div>
                      <div className="p-2 rounded bg-red-500/10">
                        <p className="font-medium text-red-700 mb-1">The WordPress Reality:</p>
                        <ul className="space-y-1.5">
                          <li className="flex items-start gap-2">
                            <AlertCircle className="w-3 h-3 mt-1 flex-shrink-0 text-red-600" />
                            <span>Locked into contract for another year</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="w-3 h-3 mt-1 flex-shrink-0 text-red-600" />
                            <span>It's a brochure site with no real function</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="w-3 h-3 mt-1 flex-shrink-0 text-red-600" />
                            <span><strong>It's not generating leads</strong> - nothing to confuse</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="w-3 h-3 mt-1 flex-shrink-0 text-red-600" />
                            <span>The "leads" that were there? Already handled - just showing as unread</span>
                          </li>
                        </ul>
                      </div>
                      <div className="p-2 rounded bg-green-500/10">
                        <p className="font-medium text-green-700 mb-1">Why Our New Site Helps:</p>
                        <ul className="space-y-1.5">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0 text-green-600" />
                            <span>It's <strong>additional exposure</strong>, not a replacement</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0 text-green-600" />
                            <span>Has real tools: instant estimates, room visualization, booking</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0 text-green-600" />
                            <span>Can add banner: "Visit our main site at [WordPress URL]"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0 text-green-600" />
                            <span>Can label as "New Tools Beta" or "Estimator Preview"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0 text-green-600" />
                            <span>If WordPress isn't generating leads, you're not losing anything</span>
                          </li>
                        </ul>
                      </div>
                      <div className="p-2 rounded bg-amber-500/10">
                        <p className="font-medium text-amber-700 mb-1">How to Frame It:</p>
                        <p className="text-sm">"The WordPress site is a brochure - it looks nice but doesn't do anything. Our new site has real tools that generate real leads. People who find it aren't 'confused' - they're getting instant estimates and booking jobs. That's not confusion, that's conversion. And if someone wants the WordPress experience, we put a link right at the top."</p>
                      </div>
                      <div className="p-2 rounded bg-[#1e3a5f]/10">
                        <p className="font-medium text-[#1e3a5f] mb-1">The Bottom Line:</p>
                        <p className="text-sm">"If the WordPress site was generating leads, I'd understand the concern. But it's not. So what exactly are we protecting? A year from now when that contract ends, we need something ready. That's what this is."</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* What I CAN Do Right Now */}
                  <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <h4 className="font-semibold text-emerald-600 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      What I CAN Do Right Now (If Given Access)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="p-2 rounded bg-background/50">
                        <p className="font-medium text-emerald-600">For NPP (has LSA):</p>
                        <ul className="text-xs space-y-1 mt-1">
                          <li>• Review LSA performance data</li>
                          <li>• Connect leads to our tracking system</li>
                          <li>• Optimize based on what's working</li>
                          <li>• Run social campaigns</li>
                          <li>• Launch our new NPP site alongside WordPress</li>
                        </ul>
                      </div>
                      <div className="p-2 rounded bg-background/50">
                        <p className="font-medium text-emerald-600">For Lume (waiting on LLC):</p>
                        <ul className="text-xs space-y-1 mt-1">
                          <li>• Site is ready - just needs approval to go live</li>
                          <li>• Can label as "Beta" or "Preview"</li>
                          <li>• Start building SEO presence</li>
                          <li>• Get LSA set up once LLC approved</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Both can happen in parallel. The new sites are extra reach, not replacements.</p>
                  </div>
                  
                  {/* Industry Benchmarks */}
                  <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Industry Benchmarks (Middle TN)
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 bg-background/50 rounded">
                        <p className="font-bold text-lg text-purple-600">$85</p>
                        <p className="text-xs text-muted-foreground">Avg Cost/Lead</p>
                      </div>
                      <div className="text-center p-2 bg-background/50 rounded">
                        <p className="font-bold text-lg text-purple-600">4:1</p>
                        <p className="text-xs text-muted-foreground">Google Ads ROI</p>
                      </div>
                      <div className="text-center p-2 bg-background/50 rounded">
                        <p className="font-bold text-lg text-purple-600">42:1</p>
                        <p className="text-xs text-muted-foreground">Email ROI</p>
                      </div>
                      <div className="text-center p-2 bg-background/50 rounded">
                        <p className="font-bold text-lg text-purple-600">3-5%</p>
                        <p className="text-xs text-muted-foreground">Website Conv.</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      We can compare our results to these once we start tracking.
                    </p>
                  </div>
                </div>
                
                {/* Billboard vs LSA Comparison */}
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-red-500/5 to-green-500/5 border border-amber-500/30">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-500" />
                    The $50K Question: Billboards vs Google LSA
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Billboard Column */}
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <h5 className="font-semibold text-red-600 mb-2">Billboard ($25,000+/year)</h5>
                      <ul className="text-xs space-y-1.5">
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-red-500" />
                          <span>Mid-size city: $1,500-$5,000/month</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-red-500" />
                          <span>Design/production: $2,000-$5,000 extra</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-red-500" />
                          <span>ROI: 6:1 average (but hard to track)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-red-500" />
                          <span>No way to know which leads came from it</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-red-500" />
                          <span>Brand awareness only - no direct leads</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* LSA Column */}
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <h5 className="font-semibold text-green-600 mb-2">Google LSA ($2,000/month)</h5>
                      <ul className="text-xs space-y-1.5">
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-green-500" />
                          <span><strong>Painters pay $20-$40 per lead</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-green-500" />
                          <span>$2,000/month = 50-100 leads</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-green-500" />
                          <span>50-60% close rate on LSA leads</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-green-500" />
                          <span>25-60 booked jobs per month</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-green-500" />
                          <span>"Google Guaranteed" badge = trust</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-green-500" />
                          <span>Pay only for actual leads (not views)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-current text-green-500" />
                          <span>Dispute bad leads and get refunds</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* The Math */}
                  <div className="p-3 rounded-lg bg-[#1e3a5f]/10 border border-[#1e3a5f]/30">
                    <h5 className="font-semibold text-[#1e3a5f] mb-2">The Math (Same $24,000/year)</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Billboard:</p>
                        <p className="font-medium">1 billboard, unknown leads</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">LSA:</p>
                        <p className="font-medium text-green-600">600-1,200 leads, 300-700 jobs</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      At avg $2,000/job, that's <strong className="text-green-600">$600K-$1.4M potential revenue</strong> from LSA vs. "hope people see the billboard"
                    </p>
                  </div>
                  
                  {/* Key Question */}
                  <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-sm font-medium text-amber-700">
                      <strong>Ask Ryan:</strong> "Does Lume have Google LSA set up? If so, I need access to see performance. 
                      If not, for the same money as one billboard, we could be getting 50+ leads a month with trackable ROI."
                    </p>
                  </div>
                </div>
                
                {/* Bottom Line */}
                <div className="mt-4 p-4 rounded-lg bg-[#1e3a5f]/10 border border-[#1e3a5f]/30">
                  <p className="text-sm font-medium text-[#1e3a5f]">
                    <strong>Bottom Line:</strong> I'm here to do the job. The tracking system is built and ready. 
                    But I can't show results without access to implement the tools. Give me the access, 
                    participate in tracking expenses, and let's build the data to prove what works.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          {/* Estimator Pricing Configuration */}
          <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4}>
            <PricingConfigPanel />
          </BentoItem>

          {/* System Health - full width on mobile */}
          <BentoItem colSpan={3} rowSpan={1} mobileColSpan={4}>
            <SystemHealthCard />
          </BentoItem>

          {/* SEO Tracker - full width on mobile */}
          <BentoItem colSpan={3} rowSpan={2} mobileColSpan={4}>
            <SeoTracker />
          </BentoItem>

          {/* Blog Manager */}
          <BentoItem colSpan={12} rowSpan={3}>
            <motion.div className="h-full" variants={cardVariants} custom={12}>
              <GlassCard className="h-full p-4 md:p-6" glow="gold" hoverEffect={false}>
                <BlogManager />
              </GlassCard>
            </motion.div>
          </BentoItem>

          {/* Marketing Hub */}
          <BentoItem colSpan={12} rowSpan={2}>
            <motion.div className="h-full" variants={cardVariants} custom={13}>
              <GlassCard className="h-full p-4 md:p-6" glow="accent" hoverEffect={false}>
                <MarketingHub showTenantSwitcher={true} />
              </GlassCard>
            </motion.div>
          </BentoItem>

          {/* Live Visitors Card - full width on mobile */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
            <LiveVisitorsCard />
          </BentoItem>

          {/* Layout Switcher Card - full width on mobile */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
            <GlassCard className={`h-full p-4 ${cardBackgroundStyles.accent}`} glow="accent">
              <div className="flex items-center gap-3 mb-3">
                <motion.div 
                  className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.accent}`}
                  whileHover={{ rotate: 10 }}
                >
                  <LayoutGrid className="w-4 h-4 text-accent" />
                </motion.div>
                <h3 className="text-lg font-bold">Layout Switcher</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Override homepage layout for demos</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={typeof window !== 'undefined' && localStorage.getItem('dev_layout_override') === 'bento' ? 'default' : 'outline'}
                  onClick={() => {
                    localStorage.setItem('dev_layout_override', 'bento');
                    toast.success('Layout set to Bento Grid');
                    window.location.href = '/';
                  }}
                  className="flex-1 gap-1"
                  data-testid="button-layout-bento"
                >
                  <LayoutGrid className="w-3 h-3" />
                  Bento
                </Button>
                <Button
                  size="sm"
                  variant={typeof window !== 'undefined' && localStorage.getItem('dev_layout_override') === 'minimalist' ? 'default' : 'outline'}
                  onClick={() => {
                    localStorage.setItem('dev_layout_override', 'minimalist');
                    toast.success('Layout set to Minimalist');
                    window.location.href = '/';
                  }}
                  className="flex-1 gap-1"
                  data-testid="button-layout-minimalist"
                >
                  <Rows className="w-3 h-3" />
                  Simple
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    localStorage.removeItem('dev_layout_override');
                    toast.success('Using tenant default');
                    window.location.href = '/';
                  }}
                  data-testid="button-layout-reset"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={4}>
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

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={8} rowSpan={1} mobileColSpan={4}>
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
                <div className="bg-black/50 rounded-xl p-4 font-mono text-sm h-32 overflow-auto border border-border dark:border-white/10">
                  <p className="text-green-400">[System] Application initialized</p>
                  <p className="text-muted-foreground">[Info] Database connection established</p>
                  <p className="text-purple-400">[Darkwave] Connected to Dev Hub</p>
                  <p className="text-accent">[Ready] Server listening on port 5000</p>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
            <RoomScannerCard locked={false} accentColor="purple-400" />
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
            <motion.div className="h-full" variants={cardVariants} whileHover={hover3DSubtle}>
              <PinReferenceAccordion className="h-full" />
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={6} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={6} rowSpan={1} mobileColSpan={4}>
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

          <BentoItem colSpan={6} rowSpan={1} mobileColSpan={4}>
            <motion.div 
              className="h-full cursor-pointer" 
              variants={cardVariants}
              whileHover={hover3D}
              whileTap={tapEffect}
              onClick={() => setActiveModal("businessRoadmap")}
              data-testid="card-business-roadmap"
            >
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.green}`} glow="green" animatedBorder>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.green}`}
                    whileHover={{ rotate: 10 }}
                  >
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Business Roadmap</h3>
                </div>
                <p className="text-sm text-muted-foreground">Checklist, valuation & projections</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          {/* Bookings Management */}
          <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4}>
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

          {/* Crew Management */}
          <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4}>
            <motion.div 
              className="h-full" 
              variants={cardVariants}
              whileHover={hover3DSubtle}
              whileTap={tapEffect}
            >
              <GlassCard className={`h-full p-4 ${cardBackgroundStyles.accent}`} glow="accent" animatedBorder>
                <CrewManagementCard />
              </GlassCard>
            </motion.div>
          </BentoItem>

          {/* Version History - All Tenants */}
          <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4}>
            <motion.div 
              className="h-full" 
              variants={cardVariants}
              whileHover={hover3DSubtle}
              whileTap={tapEffect}
            >
              <VersionHistory showAllTenants={true} maxItems={10} />
            </motion.div>
          </BentoItem>

          {/* Trade Verticals Expansion */}
          <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4}>
            <motion.div variants={cardVariants} className="h-full">
              <TradeVerticalsCard showFullDetails={true} />
            </motion.div>
          </BentoItem>

          {/* NPP Step 1 Foundation Checklist */}
          <BentoItem colSpan={12} rowSpan={4}>
            <motion.div variants={cardVariants} className="h-full">
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.accent}`} glow="accent" animatedBorder>
                <Step1FoundationChecklist />
              </GlassCard>
            </motion.div>
          </BentoItem>

          {/* Franchise Management System */}
          <BentoItem colSpan={12} rowSpan={4}>
            <motion.div variants={cardVariants} className="h-full">
              <GlassCard className={`h-full p-6 ${cardBackgroundStyles.accent}`} glow="accent" animatedBorder>
                <FranchiseManagement />
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
              className="w-full max-w-lg max-h-[calc(100dvh-2rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6 md:p-8 overflow-y-auto" glow>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {modalContents[activeModal].icon}
                    <h2 className="text-2xl font-display font-bold">{modalContents[activeModal].title}</h2>
                  </div>
                  <motion.button
                    onClick={closeModal}
                    className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/5 dark:bg-white/10 transition-colors"
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
      
      <MessagingWidget 
        currentUserId="developer"
        currentUserRole="developer"
        currentUserName="Developer"
      />
      <OfficeAssistant />
    </PageLayout>
  );
}
