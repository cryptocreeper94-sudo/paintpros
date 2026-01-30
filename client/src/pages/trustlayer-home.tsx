import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { cardVariants, staggerContainer, fadeInUp, scaleIn } from "@/lib/theme-effects";
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
  ExternalLink
} from "lucide-react";

export default function TrustLayerHome() {
  useEffect(() => {
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
      price: '$59/mo',
      link: '/trustlayer/marketing'
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
      link: '/trustlayer/guardian'
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
      external: true
    }
  ];

  const connectedSystems = [
    { name: 'Orbit Staffing', desc: 'Workforce & Financials', icon: Users, url: 'https://orbitstaffing.io' },
    { name: 'PaintPros.io', desc: 'Trade Verticals & Field Tools', icon: Briefcase, url: 'https://paintpros.io' },
    { name: 'DarkWave Studios', desc: 'Architecture & Development', icon: Building2, url: 'https://darkwavestudios.io' },
    { name: 'TradeWorks AI', desc: 'Field Tool Platform', icon: Zap, url: 'https://tradeworksai.io' }
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
                className="text-slate-400 hover:text-white"
              >
                Marketing
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/trustlayer/guardian'}
                className="text-slate-400 hover:text-white"
              >
                Guardian Shield
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/25"
                data-testid="button-get-started"
                onClick={() => window.location.href = '/trustlayer/claim'}
              >
                <Globe className="w-4 h-4 mr-1" />
                Claim .tlid.io
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
            <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              The Future of Business Trust
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
          >
            Build Trust.{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              Grow Business.
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The complete ecosystem for business verification, automated marketing, 
            and workforce management. All connected. All secure.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-lg px-8 py-6 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
              onClick={() => window.location.href = '/trustlayer/marketing'}
              data-testid="button-explore-products"
            >
              Explore Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10"
              onClick={() => window.location.href = '/trustlayer/guardian'}
              data-testid="button-get-verified"
            >
              <Shield className="w-5 h-5 mr-2" />
              Get Verified
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Connected Ecosystem */}
      <div className="relative border-y border-white/5 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-slate-500 text-sm text-center mb-6 tracking-wider uppercase">Part of the Connected Ecosystem</p>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8"
          >
            {connectedSystems.map((system, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800/30 border border-white/5 backdrop-blur-sm"
              >
                <system.icon className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-white text-sm font-medium">{system.name}</p>
                  <p className="text-slate-500 text-xs">{system.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
              <GlassCard
                hoverEffect="3d"
                glow={product.glowColor}
                animatedBorder
                depth="deep"
                className="cursor-pointer h-full"
                onClick={() => (product as any).external ? window.open(product.link, '_blank') : window.location.href = product.link}
              >
                <div className="p-8 flex flex-col h-full">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6 shadow-lg`}
                    style={{ boxShadow: `0 10px 40px -10px ${product.glowColor === 'blue' ? 'rgba(59, 130, 246, 0.5)' : product.glowColor === 'green' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)'}` }}
                  >
                    <product.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-3">{product.tagline}</p>
                  <p className="text-slate-400 text-sm mb-6 flex-grow">{product.description}</p>

                  <div className="space-y-3 mb-6">
                    {product.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-3xl font-bold text-white">{product.price}</span>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
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

            {/* Trust Badge Preview */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-[80px]" />
                <GlassCard
                  hoverEffect="glow"
                  glow="green"
                  depth="deep"
                  className="w-80"
                >
                  <div className="p-8 text-center">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40"
                    >
                      <Shield className="w-12 h-12 text-white" />
                    </motion.div>
                    <Badge className="mb-3 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Business
                    </Badge>
                    <h4 className="text-xl font-bold text-white mb-1">Your Business Name</h4>
                    <p className="text-slate-400 text-sm mb-4">TrustLayer Certified</p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-500 text-xs">Member since 2024</p>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marketing Preview */}
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Dashboard Preview */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <GlassCard hoverEffect="subtle" depth="deep">
              <div className="bg-slate-900/80 p-4 border-b border-white/5 flex items-center gap-2 rounded-t-xl">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-500 text-xs ml-3">TrustLayer Marketing Dashboard</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                    <Eye className="w-5 h-5 text-blue-400 mb-2" />
                    <p className="text-2xl font-bold text-white">12,450</p>
                    <p className="text-slate-500 text-sm">Reach</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                    <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
                    <p className="text-2xl font-bold text-white">847</p>
                    <p className="text-slate-500 text-sm">Engagement</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-500" />
                    <span>Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span>Connected</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Zap className="w-3 h-3 mr-1" />
              TrustLayer Marketing
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-6">
              Social Media on Autopilot
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Stop spending hours on social media. TrustLayer Marketing posts for you, 
              boosts your best content, and tracks everything - so you can focus on 
              running your business.
            </p>

            <div className="space-y-4 mb-8">
              {['Automated Facebook & Instagram posting', 'Smart ad boosting within your budget', 'Full analytics dashboard', 'Content library management'].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">{item}</span>
                </motion.div>
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

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">TrustLayer</p>
                <p className="text-slate-500 text-sm">TLId.io</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-slate-400 text-sm">
              <span>Part of the Orbit Ecosystem</span>
              <span className="text-slate-600">|</span>
              <span>support@tlid.io</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
