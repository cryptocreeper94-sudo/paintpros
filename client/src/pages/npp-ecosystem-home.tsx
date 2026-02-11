import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ecosystemApps, categoryLabels, getAppUrl, type EcosystemCategory, type EcosystemApp } from "@/data/ecosystem";
import {
  Shield,
  Zap,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Globe,
  Building2,
  Briefcase,
  Target,
  TrendingUp,
  Award,
  Fingerprint,
  Network,
  Layers,
  Star,
  Sparkles,
  ExternalLink,
  Search,
  Paintbrush,
  Wrench,
  Gamepad2,
  Bitcoin,
  Server,
  Truck,
  ShoppingCart,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Filter
} from "lucide-react";

import ecosystemNPPHero from "@/assets/images/ecosystem-npp.png";

function trackUrl(baseUrl: string, medium: string = 'nav'): string {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}ref=npp&utm_source=nashpaintpros&utm_medium=${medium}&utm_campaign=ecosystem`;
}

const categoryIcons: Partial<Record<EcosystemCategory, any>> = {
  'marketing': Target,
  'field-tools': Wrench,
  'trust-security': Shield,
  'marketplace': ShoppingCart,
  'staffing': Users,
  'gaming': Gamepad2,
  'infrastructure': Server,
  'crypto': Bitcoin,
  'operations': Truck,
};

export default function NPPEcosystemHome() {
  const [activeFilter, setActiveFilter] = useState<EcosystemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = "Nash PaintPros | Find Your Contractor. Find Your Customer. | Ecosystem Hub";

    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = "Nashville's lead generation and contractor marketplace. Explore the DarkWave Trust Layer ecosystem - 20+ connected platforms for trades, marketing, staffing, and more. Find trusted contractors or grow your business.";
    if (metaDescription) {
      metaDescription.setAttribute('content', descContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descContent;
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords = "Nashville painters, find a contractor, contractor marketplace, painting leads, TradeWorks AI, DWSC.io, TrustShield.tech, TLID.io, PaintPros, lead generation, affiliate marketing, home services, trade professionals, DarkWave ecosystem, Orbit Staffing, GarageBot, VedaSolus, StrikeAgent, automated marketing";
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords;
      document.head.appendChild(meta);
    }

    const ogTags = [
      { property: 'og:title', content: 'Nash PaintPros | Contractor Marketplace & Ecosystem Hub' },
      { property: 'og:description', content: 'Find your contractor. Find your customer. Explore 20+ connected platforms for trades, marketing, staffing, crypto, and more.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://nashpaintpros.io' },
      { property: 'og:site_name', content: 'Nash PaintPros' },
      { property: 'og:image', content: 'https://nashpaintpros.io/og-npp.png' }
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

    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Nash PaintPros | Contractor Marketplace & Ecosystem Hub' },
      { name: 'twitter:description', content: 'Find your contractor. Find your customer. 20+ connected platforms.' },
      { name: 'twitter:image', content: 'https://nashpaintpros.io/og-npp.png' }
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

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://nashpaintpros.io');
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://nashpaintpros.io');
      document.head.appendChild(canonical);
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'NPP Ecosystem Home',
        page_path: '/npp'
      });
    }
  }, []);

  const displayApps = ecosystemApps.filter(app => {
    if (app.category === 'tenant') return false;
    const matchesFilter = activeFilter === 'all' || app.category === activeFilter;
    const matchesSearch = !searchQuery || 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featuredApps = ecosystemApps.filter(app => app.featured && app.category !== 'tenant');

  const categories = Object.entries(categoryLabels).filter(([key]) => key !== 'tenant') as [EcosystemCategory, string][];

  const affiliateBanners = [
    { name: 'DWSC.io', url: 'https://dwsc.io', desc: 'DarkWave Smart Contracts', color: 'from-blue-600 to-cyan-700' },
    { name: 'TrustShield.tech', url: 'https://trustshield.tech', desc: 'Guardian Shield Security', color: 'from-sky-600 to-teal-700' },
    { name: 'TLID.io', url: 'https://tlid.io', desc: 'TrustLayer Automated Marketing', color: 'from-cyan-600 to-blue-700' },
    { name: 'TradeWorksAI.io', url: 'https://tradeworksai.io', desc: '8-Trade Field Toolkit', color: 'from-indigo-600 to-purple-700' },
    { name: 'OrbitStaffing.io', url: 'https://orbitstaffing.io', desc: 'Automated Staffing & Payroll', color: 'from-blue-700 to-indigo-800' },
  ];

  const stats = [
    { label: 'Connected Platforms', value: '20+', icon: Network },
    { label: 'Industries Served', value: '8+', icon: Building2 },
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Revenue Generated', value: '$2M+', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" data-testid="npp-ecosystem-home">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"
        />
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative border-b border-white/5 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25"
              >
                <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-white">Nash PaintPros</p>
                <p className="text-slate-500 text-[10px] sm:text-xs tracking-wider">NashPaintPros.io</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.open(trackUrl('https://tlid.io', 'header_nav'), '_blank')}
                className="text-slate-400 hover:text-white hidden md:inline-flex"
                data-testid="button-nav-tlid"
              >
                TrustLayer
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open(trackUrl('https://trustshield.tech', 'header_nav'), '_blank')}
                className="text-slate-400 hover:text-white hidden md:inline-flex"
                data-testid="button-nav-trustshield"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                TrustShield
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open(trackUrl('https://tradeworksai.io', 'header_nav'), '_blank')}
                className="text-slate-400 hover:text-white hidden md:inline-flex"
                data-testid="button-nav-tradeworks"
              >
                TradeWorks AI
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                data-testid="button-npp-estimate"
                onClick={() => window.location.href = '/npp/estimate'}
              >
                Get Estimate
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25"
                data-testid="button-npp-contact"
                onClick={() => window.location.href = '/npp/contact'}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl px-4 sm:px-6 py-3 shadow-xl">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Paintbrush className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              <div className="text-left">
                <p className="text-xl sm:text-2xl font-bold text-white">Nash PaintPros</p>
                <p className="text-slate-400 text-xs sm:text-sm">Contractor Marketplace & Ecosystem Hub</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-4 sm:mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 sm:px-4 py-2 backdrop-blur-sm" data-testid="badge-lead-gen">
              <Zap className="w-4 h-4 mr-2" />
              Lead Generation & Affiliate Hub
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight"
          >
            Find Your Contractor.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Find Your Customer.
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4"
          >
            Nashville's contractor marketplace connecting homeowners with trusted professionals. 
            Explore our ecosystem of 20+ connected platforms powering the future of trades, 
            marketing, staffing, and business automation.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-16"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base sm:text-lg font-semibold px-8 sm:px-10 py-6 sm:py-7 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow border border-white/20"
              onClick={() => window.location.href = '/npp/estimate'}
              data-testid="button-hero-estimate"
            >
              <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Get a Free Estimate
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 backdrop-blur-sm text-white text-base sm:text-lg font-semibold px-8 sm:px-10 py-6 sm:py-7"
              onClick={() => {
                document.getElementById('ecosystem-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-hero-explore"
            >
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Explore Ecosystem
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 sm:p-6 text-center"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-xs sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative border-y border-white/5 bg-slate-900/30 backdrop-blur-sm py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-slate-500 text-xs text-center mb-2 tracking-wider uppercase">Affiliate Partners</p>
          <h3 className="text-xl sm:text-2xl font-bold text-center text-white mb-6 sm:mb-8">Powered by the DarkWave Ecosystem</h3>
          
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-3 sm:gap-4 w-max mx-auto">
              {affiliateBanners.map((banner, i) => (
                <motion.a
                  key={i}
                  href={`${banner.url}?ref=npp&utm_source=nashpaintpros&utm_medium=affiliate_banner&utm_campaign=ecosystem`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-shrink-0 w-[220px] sm:w-[260px] rounded-xl bg-gradient-to-br ${banner.color} p-4 sm:p-5 border border-white/10 cursor-pointer group`}
                  data-testid={`affiliate-banner-${banner.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                    <span className="text-white font-bold text-sm sm:text-base">{banner.name}</span>
                  </div>
                  <p className="text-white/70 text-xs sm:text-sm">{banner.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-white/50 text-xs group-hover:text-white/80 transition-colors">
                    <span>Visit Site</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="ecosystem-grid" className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className="mb-4 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-2" data-testid="badge-ecosystem">
            <Network className="w-4 h-4 mr-2" />
            Connected Ecosystem
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">20+ Platforms, One Ecosystem</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            From contractor tools to automated marketing, staffing to crypto trading - 
            everything connected through the DarkWave Trust Layer
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
              data-testid="input-ecosystem-search"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <Button
              variant={activeFilter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('all')}
              className={activeFilter === 'all' ? 'bg-blue-600' : 'text-slate-400'}
              data-testid="filter-all"
            >
              All
            </Button>
            {categories.map(([key, label]) => {
              const Icon = categoryIcons[key];
              return (
                <Button
                  key={key}
                  variant={activeFilter === key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveFilter(key)}
                  className={`flex-shrink-0 ${activeFilter === key ? 'bg-blue-600' : 'text-slate-400'}`}
                  data-testid={`filter-${key}`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 mr-1.5" />}
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
          >
            {displayApps.map((app, i) => (
              <motion.div
                key={app.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
              >
                <EcosystemCard app={app} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {displayApps.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No platforms match your search</p>
          </div>
        )}
      </div>

      <div className="relative border-y border-white/5 bg-slate-900/30 backdrop-blur-sm py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Featured Platforms
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Spotlight Partners</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Our most impactful connected platforms</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApps.slice(0, 6).map((app, i) => (
              <motion.div
                key={app.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <FeaturedCard app={app} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-indigo-900/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2">
                <Briefcase className="w-4 h-4 mr-2" />
                Why Nash PaintPros
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Your Gateway to the{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Entire Ecosystem
                </span>
              </h2>
              <p className="text-slate-400 mb-8 text-sm sm:text-base">
                Nash PaintPros is more than a contractor marketplace. It's your entry point to 
                a fully connected network of business tools, automation platforms, and growth opportunities.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Target, title: 'Lead Generation', desc: 'Connect homeowners with trusted contractors instantly' },
                  { icon: Network, title: 'Ecosystem Access', desc: 'One account, 20+ connected platforms and tools' },
                  { icon: TrendingUp, title: 'Business Growth', desc: 'Automated marketing, staffing, and operations' },
                  { icon: Shield, title: 'Trust & Security', desc: 'Verified contractors with TrustShield certification' },
                  { icon: Sparkles, title: 'AI-Powered Tools', desc: 'TradeWorks AI estimation and field tools' },
                  { icon: Award, title: 'Affiliate Revenue', desc: 'Earn from referrals across the ecosystem' },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{feature.title}</h4>
                      <p className="text-slate-400 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={ecosystemNPPHero} 
                  alt="Nash PaintPros Ecosystem"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg font-bold mb-2">Ready to Grow Your Business?</p>
                  <p className="text-slate-300 text-sm mb-4">Join Nashville's fastest-growing contractor network</p>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30"
                    onClick={() => window.location.href = '/npp/contact'}
                    data-testid="button-cta-join"
                  >
                    Join the Network
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5 bg-gradient-to-b from-slate-900/50 to-slate-950 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
              <Paintbrush className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Growing Today
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm sm:text-base">
              Whether you're a homeowner looking for trusted contractors or a business 
              ready to join the ecosystem - Nash PaintPros is your starting point.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-6 shadow-xl shadow-blue-500/30"
                onClick={() => window.location.href = '/npp/estimate'}
                data-testid="button-footer-estimate"
              >
                <Paintbrush className="w-5 h-5 mr-2" />
                Get a Free Estimate
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 backdrop-blur-sm text-white font-semibold px-8 py-6"
                onClick={() => window.open(trackUrl('https://tlid.io', 'footer_cta'), '_blank')}
                data-testid="button-footer-tlid"
              >
                <Layers className="w-5 h-5 mr-2" />
                Visit TrustLayer
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="relative border-t border-white/5 bg-slate-950 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Nash PaintPros</h4>
              <div className="space-y-2">
                <a href="/npp/services" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-services">Services</a>
                <a href="/npp/portfolio" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-portfolio">Portfolio</a>
                <a href="/npp/estimate" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-estimate">Get Estimate</a>
                <a href="/npp/contact" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-contact">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Ecosystem</h4>
              <div className="space-y-2">
                <a href={trackUrl('https://tlid.io', 'footer')} target="_blank" rel="noopener noreferrer" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-tlid">TLID.io</a>
                <a href={trackUrl('https://dwsc.io', 'footer')} target="_blank" rel="noopener noreferrer" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-dwsc">DWSC.io</a>
                <a href={trackUrl('https://trustshield.tech', 'footer')} target="_blank" rel="noopener noreferrer" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-trustshield">TrustShield.tech</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Tools</h4>
              <div className="space-y-2">
                <a href={trackUrl('https://tradeworksai.io', 'footer')} target="_blank" rel="noopener noreferrer" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-tradeworks">TradeWorks AI</a>
                <a href={trackUrl('https://paintpros.io', 'footer')} target="_blank" rel="noopener noreferrer" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-paintpros">PaintPros.io</a>
                <a href={trackUrl('https://orbitstaffing.io', 'footer')} target="_blank" rel="noopener noreferrer" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-orbit">Orbit Staffing</a>
                <a href={trackUrl('https://garagebot.io', 'footer')} target="_blank" rel="noopener noreferrer" className="block text-slate-400 text-sm hover:text-white transition-colors" data-testid="link-footer-garagebot">GarageBot</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Phone className="w-3.5 h-3.5" />
                  <span>(615) 555-PAINT</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail className="w-3.5 h-3.5" />
                  <span>team@dwsc.io</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Nashville, TN</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-blue-400" />
              <span className="text-slate-500 text-sm">Nash PaintPros - Part of the DarkWave Ecosystem</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/npp/terms" className="text-slate-500 text-xs hover:text-slate-300 transition-colors" data-testid="link-footer-terms">Terms</a>
              <a href="/privacy" className="text-slate-500 text-xs hover:text-slate-300 transition-colors" data-testid="link-footer-privacy">Privacy</a>
              <span className="text-slate-600 text-xs">&copy; 2026 Nash PaintPros. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EcosystemCard({ app }: { app: EcosystemApp }) {
  const trackedUrl = getAppUrl(app, 'npp-ecosystem');

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => window.open(trackedUrl, '_blank')}
      className="relative w-full h-[240px] sm:h-[260px] rounded-xl overflow-hidden cursor-pointer group ring-1 ring-white/10 hover:ring-white/20 transition-all"
      data-testid={`ecosystem-card-${app.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
    >
      <div className="absolute inset-0">
        <img 
          src={app.image} 
          alt={app.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
        <Badge className={`mb-2 text-xs ${
          app.status === 'Live' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' :
          app.status === 'Live - In Development' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
          app.status === 'Beta' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
          app.status === 'Coming Soon' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
          app.status === 'Presale' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
          'bg-slate-500/20 text-slate-400 border-slate-500/30'
        }`}>
          {app.status}
        </Badge>
        <h4 className="text-white font-semibold text-sm">{app.name}</h4>
        <p className="text-slate-400 text-xs">{app.desc}</p>
        <div className="mt-2 flex items-center gap-1 text-blue-400/60 text-xs group-hover:text-blue-400 transition-colors">
          <ExternalLink className="w-3 h-3" />
          <span>Visit</span>
        </div>
      </div>
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-purple-500/10 via-transparent to-cyan-500/10" />
    </motion.div>
  );
}

function FeaturedCard({ app }: { app: EcosystemApp }) {
  const trackedUrl = getAppUrl(app, 'npp-featured');

  return (
    <div 
      className="relative rounded-2xl overflow-hidden cursor-pointer h-full group border border-white/10 hover:border-white/20 transition-colors"
      onClick={() => window.open(trackedUrl, '_blank')}
      data-testid={`featured-card-${app.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
    >
      <div className="absolute inset-0">
        <img 
          src={app.image} 
          alt={app.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/60" />
      </div>
      
      <div className="relative p-6 sm:p-8 flex flex-col h-full min-h-[280px]">
        <Badge className="mb-3 w-fit bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
          {categoryLabels[app.category]}
        </Badge>
        
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{app.name}</h3>
        <p className="text-slate-300 text-sm mb-4 flex-grow">{app.desc}</p>

        <Badge className={`mb-3 w-fit text-xs ${
          app.status === 'Live' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' :
          'bg-blue-500/20 text-blue-400 border-blue-500/30'
        }`}>
          {app.status}
        </Badge>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-slate-400 text-sm">Learn more</span>
          <Button size="sm" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white">
            Visit
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
