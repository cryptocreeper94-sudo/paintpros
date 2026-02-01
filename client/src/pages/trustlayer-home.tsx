import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { cardVariants, staggerContainer, fadeInUp, scaleIn } from "@/lib/theme-effects";

import stepConnectImg from "@/assets/images/step-connect.png";
import stepPreferencesImg from "@/assets/images/step-preferences.png";
import stepSubscribeImg from "@/assets/images/step-subscribe.png";
import productMarketingImg from "@/assets/images/product-marketing.png";
import productShieldImg from "@/assets/images/product-shield.png";
import productStaffingImg from "@/assets/images/product-staffing.png";
// Ecosystem app images - 17 apps with premium placeholders
import ecosystemDriverConnect from "@assets/franchise_hero_facebook.png";
import ecosystemHappyEats from "@assets/17698344491552583768895781273262_1769834987195.png";
import ecosystemVedaSolus from "@/assets/images/ecosystem-vedasolus.png";
import ecosystemGarageBot from "@/assets/images/ecosystem-garagebot.png";
import ecosystemOrbitStaffing from "@/assets/images/ecosystem-orbitstaffing.png";
import ecosystemTradeWorks from "@/assets/images/ecosystem-tradeworks.png";
import ecosystemPaintPros from "@/assets/images/ecosystem-paintpros.png";
import ecosystemNPP from "@/assets/images/ecosystem-npp.png";
import ecosystemLume from "@/assets/images/ecosystem-lume.png";
import ecosystemTrustLayerMarketing from "@/assets/images/ecosystem-trustlayer-marketing.png";
import ecosystemYourLegacy from "@/assets/images/ecosystem-yourlegacy.png";
import ecosystemDarkWaveGames from "@/assets/images/ecosystem-darkwavegames.png";
import ecosystemDWTL from "@/assets/images/ecosystem-dwtl.png";
import ecosystemDarkWaveStudios from "@/assets/images/ecosystem-darkwavestudios.png";
import ecosystemGetOrby from "@/assets/images/ecosystem-getorby.png";
import ecosystemStrikeAgent from "@/assets/images/ecosystem-strikeagent.png";
import ecosystemDarkWavePulse from "@/assets/images/ecosystem-darkwavepulse.png";
import ecosystemPulse from "@/assets/images/ecosystem-pulse.png";
import ecosystemLotOpsPro from "@/assets/images/ecosystem-lotopspro.png";
import ecosystemBrewBoard from "@/assets/images/ecosystem-brewboard.png";
import {
  Shield,
  Zap,
  Users,
  BarChart3,
  Lock,
  CheckCircle,
  ArrowRight,
  Facebook,
  Instagram,
  Globe,
  Building2,
  Briefcase,
  Target,
  Eye,
  TrendingUp,
  Award,
  FileCheck,
  Fingerprint,
  Network,
  Layers,
  Star,
  Sparkles,
  ExternalLink,
  Clock,
  Link2,
  Settings
} from "lucide-react";

export default function TrustLayerHome() {
  // SEO Meta Tags
  useEffect(() => {
    // Page title
    document.title = "TrustLayer - Automated Social Media Marketing | Set It & Forget It";
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = "Connect your Meta Business Suite and let TrustLayer handle your Facebook & Instagram posts, ad campaigns, and analytics automatically. From $99/mo.";
    if (metaDescription) {
      metaDescription.setAttribute('content', descContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descContent;
      document.head.appendChild(meta);
    }
    
    // Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords = "automated marketing, social media automation, Facebook marketing, Instagram marketing, small business marketing, digital marketing platform, Meta Business Suite, automated posting";
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords;
      document.head.appendChild(meta);
    }
    
    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'TrustLayer - Automated Social Media Marketing' },
      { property: 'og:description', content: 'Set it once, run forever. Automated Facebook & Instagram posting, smart ad boosting, and real-time analytics. From $99/mo.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://tlid.io' },
      { property: 'og:site_name', content: 'TrustLayer' },
      { property: 'og:image', content: 'https://tlid.io/og-trustlayer.png' }
    ];
    
    ogTags.forEach(tag => {
      let meta = document.querySelector(`meta[property="${tag.property}"]`);
      if (meta) {
        meta.setAttribute('content', tag.content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      }
    });
    
    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'TrustLayer - Automated Social Media Marketing' },
      { name: 'twitter:description', content: 'Set it once, run forever. Automated Facebook & Instagram posting from $99/mo.' },
      { name: 'twitter:image', content: 'https://tlid.io/og-trustlayer.png' }
    ];
    
    twitterTags.forEach(tag => {
      let meta = document.querySelector(`meta[name="${tag.name}"]`);
      if (meta) {
        meta.setAttribute('content', tag.content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', tag.name);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      }
    });
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://tlid.io');
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://tlid.io');
      document.head.appendChild(canonical);
    }
    
    // Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'TrustLayer Home',
        page_path: '/trustlayer'
      });
    }
  }, []);

  const products = [
    {
      id: 'marketing',
      name: 'TrustLayer Marketing',
      tagline: 'Automated Social Media',
      description: 'Set it and forget it marketing. Automated Facebook & Instagram posting, smart ad boosting, and real-time analytics.',
      icon: Zap,
      color: 'from-blue-500 to-purple-500',
      glowColor: 'blue' as const,
      features: ['Automated Posting', 'Smart Ad Boosting', 'Full Analytics', 'Content Library'],
      price: 'From $99/mo',
      link: '/trustlayer/marketing',
      image: productMarketingImg
    },
    {
      id: 'guardian',
      name: 'Guardian Shield',
      tagline: 'Business Security & Verification',
      description: 'Complete business verification and security infrastructure. Protect your reputation with certified trust badges.',
      icon: Shield,
      color: 'from-emerald-500 to-teal-500',
      glowColor: 'green' as const,
      features: ['Business Verification', 'Trust Badges', 'Security Monitoring', 'Credential Management'],
      price: '$49/mo',
      link: '/trustlayer/guardian',
      image: productShieldImg
    },
    {
      id: 'staffing',
      name: 'Orbit Staffing Connect',
      tagline: 'Workforce & Financials',
      description: 'Seamlessly connected to Orbit Staffing. Complete crew management, payroll, time tracking, and financial hub integration.',
      icon: Users,
      color: 'from-orange-500 to-amber-500',
      glowColor: 'gold' as const,
      features: ['Crew Management', 'Payroll Integration', 'Financial Hub', 'Time Tracking'],
      price: '$79/mo',
      link: 'https://orbitstaffing.io',
      external: true,
      image: productStaffingImg
    }
  ];

  // DarkWave Trust Layer Ecosystem Apps
  const connectedSystems = [
    // TrustLayer Hub
    { name: 'TrustLayer Marketing', desc: 'Automated Social Media', url: '/trustlayer', image: ecosystemTrustLayerMarketing, current: true, status: 'Live - In Development' },
    // Priority Apps
    { name: 'TL Driver Connect', desc: 'Food, Parts & Services to Truck Stops', url: 'https://tldriverconnect.com', image: ecosystemDriverConnect, status: 'Live - In Development' },
    { name: 'Happy Eats', desc: 'Food Delivery to Truck Stops', url: 'https://happyeats.app', image: ecosystemHappyEats, status: 'Coming Soon' },
    { name: 'GarageBot', desc: 'Auto Parts Aggregator - 40+ Retailers', url: 'https://garagebot.io', image: ecosystemGarageBot, status: 'Live - In Development' },
    { name: 'VedaSolus', desc: 'Holistic Wellness & Ayurveda', url: 'https://vedasolus.io', image: ecosystemVedaSolus, status: 'Live - In Development' },
    { name: 'PaintPros.io', desc: 'Painting Contractors', url: 'https://paintpros.io', image: ecosystemPaintPros, status: 'Live - In Development' },
    { name: 'TradeWorks AI', desc: '8-Trade Field Toolkit', url: 'https://tradeworksai.io', image: ecosystemTradeWorks, status: 'Live - In Development' },
    { name: 'ORBIT Staffing OS', desc: 'Automated Staffing & Payroll', url: 'https://orbitstaffing.io', image: ecosystemOrbitStaffing, status: 'Live - In Development' },
    { name: 'Lot Ops Pro', desc: 'Driver Performance & Lot Management', url: 'https://lotopspro.io', image: ecosystemLotOpsPro, status: 'Live - In Development' },
    { name: 'Brew & Board', desc: 'B2B Coffee Concierge Nashville', url: 'https://brewandboardcoffee.com', image: ecosystemBrewBoard, status: 'Live - In Development' },
    // Tenant Demos
    { name: 'Nashville Painting Professionals', desc: 'Lead Generator Demo', url: 'https://nashpaintpros.io', image: ecosystemNPP, status: 'Live' },
    { name: 'Lume Paint Co', desc: 'Luxury Painting', url: 'https://lumepaint.co', image: ecosystemLume, status: 'Live' },
    // Gaming & Entertainment
    { name: 'YourLegacy.io', desc: 'Chronicles Game', url: 'https://yourlegacy.io', image: ecosystemYourLegacy, status: 'Live - In Development' },
    { name: 'DarkWave Games', desc: 'Arcade & Casino Games', url: 'https://darkwavegames.io', image: ecosystemDarkWaveGames, status: 'Live - In Development' },
    // Core Infrastructure
    { name: 'DWTL.io', desc: 'Blockchain Trust Layer', url: 'https://dwtl.io', image: ecosystemDWTL, status: 'Presale' },
    { name: 'DarkWave Studios', desc: 'Full-Stack Dev & AI Integration', url: 'https://darkwavestudios.io', image: ecosystemDarkWaveStudios, status: 'Live - In Development' },
    // Events & Operations
    { name: 'GetOrby.io', desc: 'Event Command Center', url: 'https://getorby.io', image: ecosystemGetOrby, status: 'Live - In Development' },
    // Crypto & Trading
    { name: 'StrikeAgent.io', desc: 'Quant Trading Tool', url: 'https://strikeagent.io', image: ecosystemStrikeAgent, status: 'Live - In Development' },
    { name: 'Pulse', desc: 'AI Crypto Trading Signals', url: 'https://dwsc.io/pulse', image: ecosystemPulse, status: 'Live - In Development' },
    { name: 'DarkWave Pulse', desc: 'Crypto Research Hub', url: 'https://darkwavepulse.com', image: ecosystemDarkWavePulse, status: 'Live - In Development' },
    // AI Security & Certification
    { name: 'TrustShield', desc: 'AI Agent Certification', url: 'https://trustshield.tech', image: ecosystemDWTL, status: 'Live - In Development' }
  ];

  const trustFeatures = [
    { icon: Fingerprint, title: 'Verified Identity', desc: 'Every business is verified' },
    { icon: Lock, title: 'Bank-Level Security', desc: 'Enterprise encryption' },
    { icon: FileCheck, title: 'Credential Management', desc: 'Licenses & certifications' },
    { icon: Award, title: 'Trust Badges', desc: 'Display your credibility' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative border-b border-white/5 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25"
              >
                <Layers className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-xl font-bold text-white">TrustLayer</p>
                <p className="text-slate-500 text-xs tracking-wider">TLId.io</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = '/trustlayer/marketing'}
                className="text-slate-400 hover:text-white hidden md:inline-flex"
              >
                Marketing
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/trustlayer/guardian'}
                className="text-slate-400 hover:text-white hidden md:inline-flex"
              >
                Guardian Shield
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('https://dwsc.io/guardian-ai', '_blank')}
                className="text-slate-400 hover:text-white hidden md:inline-flex"
                data-testid="button-guardian-ai"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Guardian AI
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('https://trustshield.tech', '_blank')}
                className="text-slate-400 hover:text-white hidden md:inline-flex"
                data-testid="button-guardian-shield-nav"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Guardian Shield
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('https://dwsc.io/ai-agents', '_blank')}
                className="text-slate-400 hover:text-white hidden md:inline-flex"
                data-testid="button-ai-agents"
              >
                AI Agents
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                data-testid="button-login"
                onClick={() => window.open('https://dwtl.io/login', '_blank')}
              >
                Sign In
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/25"
                data-testid="button-signup"
                onClick={() => window.open('https://dwtl.io/signup', '_blank')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3 shadow-xl">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <Layers className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">TrustLayer</p>
                <p className="text-slate-400 text-sm">Complete Business Trust Platform</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2 backdrop-blur-sm">
              <Zap className="w-4 h-4 mr-2" />
              Automated Digital Marketing
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
          >
            Connect Your Business.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Automate Everything.
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            Link your Meta Business Suite and let TrustLayer handle your Facebook & Instagram 
            posts, ad campaigns, and analytics. Set it once, run forever.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center justify-center gap-3 sm:gap-6 mb-10 flex-wrap"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span className="text-sm sm:text-base">Facebook</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
              <span className="text-sm sm:text-base">Instagram</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="text-sm sm:text-base">Nextdoor</span>
              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[10px] sm:text-xs px-1.5 py-0">Soon</Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-lg font-semibold px-10 py-7 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow border border-white/20"
              onClick={() => window.location.href = '/autopilot/onboarding'}
              data-testid="button-connect-now"
            >
              <Zap className="w-6 h-6 mr-2" />
              Get Started - Connect Meta
            </Button>
          </motion.div>

          {/* How It Works - 3 Steps */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-slate-500 text-sm text-center mb-8 uppercase tracking-wider">How It Works</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Connect Meta', desc: 'Link your Facebook Page & Instagram in 5 minutes', icon: Link2, image: stepConnectImg },
                { step: '2', title: 'Set Preferences', desc: 'Choose your content style, schedule & budget', icon: Settings, image: stepPreferencesImg },
                { step: '3', title: 'Subscribe & Go', desc: 'From $99/mo - We handle everything automatically', icon: Zap, image: stepSubscribeImg }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="relative rounded-xl overflow-hidden group"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative p-6 pt-8 text-center min-h-[200px] flex flex-col justify-end">
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                      {item.step}
                    </div>
                    <item.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h4 className="text-white font-semibold text-lg mb-2">{item.title}</h4>
                    <p className="text-slate-300 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                onClick={() => window.location.href = '/trustlayer/marketing'}
                data-testid="button-learn-more"
              >
                Learn More About Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Connected Ecosystem - Premium Cards Carousel */}
      <div className="relative border-y border-white/5 bg-slate-900/30 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-slate-500 text-xs sm:text-sm text-center mb-2 tracking-wider uppercase">Connected Ecosystem</p>
          <h3 className="text-2xl font-bold text-center text-white mb-8">One Platform, Everything You Need</h3>
          <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">Build and grow your business with our fully connected ecosystem of tools and automation.</p>
          
          {/* Horizontal scroll carousel - works on all screen sizes */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4 w-max mx-auto">
              {connectedSystems.map((system: any, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => system.url && window.open(system.url, '_blank')}
                  className={`relative w-[200px] h-[260px] rounded-xl overflow-hidden cursor-pointer flex-shrink-0 group ${
                    system.primary 
                      ? 'ring-2 ring-emerald-500/50' 
                      : 'ring-1 ring-white/10'
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={system.image} 
                      alt={system.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {system.current && (
                      <Badge className="mb-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                        You Are Here
                      </Badge>
                    )}
                    {system.status && (
                      <Badge className={`mb-2 text-xs ${
                        system.status === 'Live' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        system.status === 'Live - In Development' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        system.status === 'Beta' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                        system.status === 'Coming Soon' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                        system.status === 'Presale' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }`}>
                        {system.status}
                      </Badge>
                    )}
                    <h4 className="text-white font-semibold text-sm">{system.name}</h4>
                    <p className="text-slate-400 text-xs">{system.desc}</p>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-purple-500/10 via-transparent to-cyan-500/10" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2">
            <Target className="w-4 h-4 mr-2" />
            Complete Solutions
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">One Platform, Everything You Need</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Build trust, grow visibility, and manage operations - all in one connected ecosystem
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {products.map((product, i) => (
            <motion.div key={product.id} variants={cardVariants} custom={i}>
              <div 
                className="relative rounded-2xl overflow-hidden cursor-pointer h-full group border border-white/10 hover:border-white/20 transition-colors"
                onClick={() => (product as any).external ? window.open(product.link, '_blank') : window.location.href = product.link}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dark gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/60" />
                </div>
                
                {/* Content */}
                <div className="relative p-8 flex flex-col h-full">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm`}
                    style={{ boxShadow: `0 10px 40px -10px ${product.glowColor === 'blue' ? 'rgba(59, 130, 246, 0.5)' : product.glowColor === 'green' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)'}` }}
                  >
                    <product.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-slate-400 text-sm mb-3">{product.tagline}</p>
                  <p className="text-slate-300 text-sm mb-6 flex-grow">{product.description}</p>

                  <div className="space-y-3 mb-6">
                    {product.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-200">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <span className="text-3xl font-bold text-white">{product.price}</span>
                    <Button size="sm" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Guardian Shield Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-teal-900/20" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <Shield className="w-3 h-3 mr-1" />
                Guardian Shield
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-6">
                Business Security & Verification
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Build customer confidence with verified credentials. Guardian Shield 
                provides comprehensive business verification, security monitoring, 
                and trust badges that show customers you're the real deal.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {trustFeatures.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{feature.title}</p>
                      <p className="text-slate-500 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/25"
                onClick={() => window.location.href = '/trustlayer/guardian'}
                data-testid="button-guardian-shield"
              >
                Get Guardian Shield
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Trust Badge Preview - Ultra Premium */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 blur-[100px]" />
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative w-80 rounded-2xl overflow-hidden"
                >
                  {/* Premium dark glass background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/95 via-slate-900/98 to-slate-950/95 backdrop-blur-xl" />
                  <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                  
                  <div className="relative p-8 text-center">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50"
                    >
                      <Shield className="w-10 h-10 text-white" />
                    </motion.div>
                    <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-400/30 font-medium">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Business
                    </Badge>
                    <h4 className="text-2xl font-bold text-white mb-2">Your Business Name</h4>
                    <p className="text-slate-300 text-sm mb-5">TrustLayer Certified</p>
                    <div className="flex items-center justify-center gap-1.5 mb-4">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow-lg" />
                      ))}
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Member since 2024</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Guardian AI Section - Ultra Premium */}
      <div className="relative py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-violet-900/20" />
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px]" 
        />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-lg shadow-purple-500/10">
              <Sparkles className="w-3 h-3 mr-1" />
              New Service
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Guardian AI Certification
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Certify your AI agents with enterprise-grade security validation. Build trust with your users through verified AI compliance.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Features */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: 'Security Audit', desc: 'Complete vulnerability assessment' },
                  { icon: CheckCircle, title: 'Compliance Verified', desc: 'SOC 2 & GDPR ready' },
                  { icon: Fingerprint, title: 'Identity Validation', desc: 'Agent behavior verification' },
                  { icon: Award, title: 'Trust Certification', desc: 'Displayable trust badges' }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                  >
                    <div className="p-5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                      <feature.icon className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                      <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                      <p className="text-slate-400 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-500/30"
                  onClick={() => window.open('https://dwsc.io/guardian-ai', '_blank')}
                  data-testid="button-guardian-ai-cta"
                >
                  Certify Your AI Agent
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                  onClick={() => window.open('https://dwsc.io/guardian-ai', '_blank')}
                  data-testid="button-guardian-ai-learn"
                >
                  Learn More
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* Right - Premium Visual */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-violet-500/30 blur-[100px]" />
                <motion.div 
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative w-80 rounded-2xl overflow-hidden"
                  style={{ perspective: "1000px" }}
                >
                  {/* Premium dark glass background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/95 via-slate-900/98 to-slate-950/95 backdrop-blur-xl" />
                  <div className="absolute inset-0 border border-purple-500/30 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />
                  
                  {/* Animated glow ring */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border border-dashed border-purple-500/20 rounded-xl"
                  />
                  
                  <div className="relative p-8 text-center">
                    <motion.div
                      animate={{ 
                        y: [0, -8, 0],
                        boxShadow: [
                          "0 25px 50px -12px rgba(147, 51, 234, 0.5)",
                          "0 35px 60px -15px rgba(147, 51, 234, 0.7)",
                          "0 25px 50px -12px rgba(147, 51, 234, 0.5)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 flex items-center justify-center"
                    >
                      <Shield className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-400/30 font-medium shadow-lg shadow-purple-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      AI Agent Certified
                    </Badge>
                    
                    <h4 className="text-2xl font-bold text-white mb-2">Your AI Agent</h4>
                    <p className="text-slate-300 text-sm mb-5">Guardian AI Verified</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                        <span className="text-slate-300">Security: <span className="text-green-400 font-medium">Passed</span></span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                        <span className="text-slate-300">Compliance: <span className="text-green-400 font-medium">Verified</span></span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                        <span className="text-slate-300">Trust Score: <span className="text-green-400 font-medium">98/100</span></span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-purple-500/20">
                      <p className="text-slate-400 text-xs font-medium">Certified by DarkWave Studios</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marketing Preview */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Dashboard Preview - Ultra Premium */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-[60px]" />
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              >
                {/* Window chrome */}
                <div className="bg-slate-900 p-4 border-b border-white/10 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                  <span className="text-slate-300 text-sm ml-4 font-medium">TrustLayer Marketing Dashboard</span>
                </div>
                {/* Dashboard content */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-5 border border-blue-500/20">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                        <Eye className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">12,450</p>
                      <p className="text-blue-300 text-sm font-medium">Reach</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-5 border border-emerald-500/20">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">847</p>
                      <p className="text-emerald-300 text-sm font-medium">Engagement</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full">
                      <Facebook className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">Connected</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full">
                      <Instagram className="w-4 h-4 text-pink-400" />
                      <span className="text-white font-medium">Connected</span>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 font-medium">
                      <Zap className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <Badge className="mb-3 bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Zap className="w-3 h-3 mr-1" />
              TrustLayer Marketing
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Social Media on Autopilot
            </h2>
            <p className="text-slate-400 mb-4">
              Posts for you, boosts your best content, tracks everything.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {['Auto Facebook/Instagram', 'Smart ad boosting', 'Analytics dashboard', 'Content library'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>

            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25"
              onClick={() => window.location.href = '/trustlayer/marketing'}
              data-testid="button-trustlayer-marketing"
            >
              Start Marketing Autopilot
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Pain Points - Compact Horizontal Carousel */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">Sound Familiar?</h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible">
          {[
            { problem: "Hours on social media daily", solution: "Auto-posts while you work", icon: Clock },
            { problem: "Posts get zero engagement", solution: "Analytics optimize results", icon: TrendingUp },
            { problem: "Same content getting stale", solution: "Fresh rotation daily", icon: Sparkles }
          ].map((item, i) => (
            <div key={i} className="flex-shrink-0 w-72 md:w-auto snap-center">
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-red-400 text-xs font-medium">PROBLEM</span>
                </div>
                <p className="text-white text-sm font-medium mb-3">{item.problem}</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-sm">{item.solution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-white font-semibold mt-6 text-lg">
          "Set it up once. It runs forever."
        </p>
      </div>

      {/* Real Businesses - Compact */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Already Powering Growth</h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible">
          {[
            { name: 'Nashville Painting Professionals', industry: 'Painting', result: 'Automated daily posts', color: 'from-blue-500 to-purple-500' },
            { name: 'Lume Paint Co', industry: 'Premium Painting', result: 'Smart ad boosting', color: 'from-amber-500 to-orange-500' }
          ].map((business, i) => (
            <div key={i} className="flex-shrink-0 w-72 md:w-auto snap-center">
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${business.color} flex items-center justify-center`}>
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{business.name}</h3>
                    <p className="text-slate-400 text-xs">{business.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{business.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Ways to Create - Compact */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Two Ways to Create</h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          Your content or AI-generated. Both run automatically.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-900/80"
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Use Your Templates</h3>
              <p className="text-slate-300 text-sm mb-4">
                Upload your images, write your messages. We post automatically.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Your images', 'Custom messages', 'Your schedule', 'Brand control'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white">
                    <CheckCircle className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-900/80"
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI-Generated Content</h3>
              <p className="text-slate-300 text-sm mb-4">
                Tell us your niche. Our AI creates posts that resonate.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['AI writes posts', 'Industry-specific', 'Optimized', 'Fresh daily'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white">
                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bundle Offer */}
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <GlassCard hoverEffect="glow" glow="gold" animatedBorder depth="deep">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
          <div className="p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <Badge className="mb-3 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Best Value
                </Badge>
                <h3 className="text-3xl font-bold text-white mb-2">TrustLayer Complete Bundle</h3>
                <p className="text-slate-400">Marketing + Guardian Shield + Orbit Staffing Connect - All in one</p>
              </div>
              <div className="text-center">
                <p className="text-slate-500 text-sm line-through mb-1">$187/mo</p>
                <p className="text-5xl font-bold text-white mb-2">
                  $149<span className="text-lg text-slate-400">/mo</span>
                </p>
                <Button
                  className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 shadow-xl"
                  data-testid="button-get-bundle"
                >
                  Get the Bundle
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* TrustLayer Ecosystem */}
      <div className="relative border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-white font-semibold text-center mb-4 flex items-center justify-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            TrustLayer Ecosystem
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center md:flex-wrap">
            {[
              { name: 'TLId.io', url: 'https://tlid.io', active: true },
              { name: 'DWSC.io', url: 'https://dwsc.io' },
              { name: 'Guardian AI', url: 'https://dwsc.io/guardian-ai' },
              { name: 'AI Agents', url: 'https://dwsc.io/ai-agents' },
              { name: 'Guardian Shield', url: 'https://trustshield.tech' },
              { name: 'DarkWave Studios', url: 'https://darkwavestudios.io' },
              { name: 'DarkWave Games', url: 'https://darkwavegames.io' },
              { name: 'YourLegacy.io', url: 'https://yourlegacy.io' },
              { name: 'DWTL.io', url: 'https://dwtl.io' },
              { name: 'OrbitStaffing.io', url: 'https://orbitstaffing.io' },
              { name: 'VedaSolus.io', url: 'https://vedasolus.io' },
              { name: 'StrikeAgent.io', url: 'https://strikeagent.io' },
              { name: 'DarkWavePulse.com', url: 'https://darkwavepulse.com' },
            ].map((site, i) => (
              <a
                key={i}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-shrink-0 snap-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  site.active 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white hover:border-white/20'
                }`}
                data-testid={`link-ecosystem-${site.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                {site.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">TrustLayer</p>
                <p className="text-slate-500 text-xs">TLId.io</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-xs">
              <button 
                onClick={() => window.location.href = '/trustlayer/privacy'}
                className="hover:text-white transition-colors"
                data-testid="link-privacy"
              >
                Privacy
              </button>
              <button 
                onClick={() => window.location.href = '/trustlayer/terms'}
                className="hover:text-white transition-colors"
                data-testid="link-terms"
              >
                Terms
              </button>
              <span>support@tlid.io</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
