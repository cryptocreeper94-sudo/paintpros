import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Star
} from "lucide-react";

export default function TrustLayerHome() {
  // Track page view
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
      features: ['Business Verification', 'Trust Badges', 'Security Monitoring', 'Credential Management'],
      price: '$49/mo',
      link: '/trustlayer/guardian'
    },
    {
      id: 'staffing',
      name: 'TrustLayer Staffing',
      tagline: 'Workforce Management',
      description: 'Connected to DoorButStaffing. Complete crew management, time tracking, and payroll integration.',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      features: ['Crew Management', 'Time Tracking', 'Payroll Sync', 'Skills Matching'],
      price: '$79/mo',
      link: '/trustlayer/staffing'
    }
  ];

  const connectedSystems = [
    { name: 'DarkWave Studios', desc: 'Architecture & Development', icon: Building2 },
    { name: 'DoorButStaffing', desc: 'Workforce Solutions', icon: Users },
    { name: 'PaintPros.io', desc: 'Trade Verticals', icon: Briefcase },
    { name: 'Orbit Ecosystem', desc: 'Central Hub', icon: Network }
  ];

  const trustFeatures = [
    { icon: Fingerprint, title: 'Verified Identity', desc: 'Every business is verified' },
    { icon: Lock, title: 'Bank-Level Security', desc: 'Enterprise encryption' },
    { icon: FileCheck, title: 'Credential Management', desc: 'Licenses & certifications' },
    { icon: Award, title: 'Trust Badges', desc: 'Display your credibility' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">TrustLayer</p>
                <p className="text-slate-400 text-sm">TLId.io</p>
              </div>
            </div>
          </motion.div>

          <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Complete Business Trust Platform
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Build Trust.{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Grow Business.
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            The complete ecosystem for business verification, automated marketing, 
            and workforce management. All connected. All secure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-lg px-8 py-6"
              onClick={() => window.location.href = '/trustlayer/marketing'}
              data-testid="button-explore-products"
            >
              Explore Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/trustlayer/guardian'}
              data-testid="button-get-verified"
            >
              <Shield className="w-5 h-5 mr-2" />
              Get Verified
            </Button>
          </div>
        </div>
      </div>

      {/* Connected Ecosystem Bar */}
      <div className="border-y border-slate-700 bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-slate-500 text-sm text-center mb-4">Part of the Connected Ecosystem</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {connectedSystems.map((system, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                <system.icon className="w-5 h-5" />
                <span className="text-sm">{system.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">One Platform, Complete Solutions</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything your business needs to build trust, grow visibility, and manage operations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 h-full hover:border-slate-600 transition-all group cursor-pointer"
                onClick={() => window.location.href = product.link}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${product.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <product.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-3">{product.tagline}</p>
                  <p className="text-slate-400 text-sm mb-4">{product.description}</p>

                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className="text-2xl font-bold text-white">{product.price}</span>
                    <Button size="sm" variant="ghost" className="group-hover:bg-slate-700">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Guardian Shield Section */}
      <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Guardian Shield
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">
                Business Security & Verification
              </h2>
              <p className="text-slate-300 mb-6">
                Build customer confidence with verified credentials. Guardian Shield 
                provides comprehensive business verification, security monitoring, 
                and trust badges that show customers you're the real deal.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {trustFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{feature.title}</p>
                      <p className="text-slate-400 text-xs">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="bg-gradient-to-r from-emerald-600 to-teal-600"
                onClick={() => window.location.href = '/trustlayer/guardian'}
                data-testid="button-guardian-shield"
              >
                Get Guardian Shield
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Trust Badge Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 blur-3xl" />
                <Card className="relative bg-slate-800/80 border-emerald-500/30 w-72">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <Badge className="mb-3 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Business
                    </Badge>
                    <h4 className="text-white font-bold mb-1">Your Business Name</h4>
                    <p className="text-slate-400 text-sm mb-4">TrustLayer Certified</p>
                    <div className="flex items-center justify-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-500 text-xs mt-2">Member since 2024</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Dashboard Preview */}
          <div className="order-2 lg:order-1">
            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
              <div className="bg-slate-900 p-3 border-b border-slate-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-500 text-xs ml-2">TrustLayer Marketing Dashboard</span>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-900 rounded-lg p-3">
                    <Eye className="w-4 h-4 text-blue-400 mb-1" />
                    <p className="text-lg font-bold text-white">12,450</p>
                    <p className="text-slate-500 text-xs">Reach</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <TrendingUp className="w-4 h-4 text-green-400 mb-1" />
                    <p className="text-lg font-bold text-white">847</p>
                    <p className="text-slate-500 text-xs">Engagement</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Facebook className="w-3 h-3 text-blue-500" />
                    <span>Connected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Instagram className="w-3 h-3 text-pink-500" />
                    <span>Connected</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    <Zap className="w-2 h-2 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 lg:order-2">
            <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Zap className="w-3 h-3 mr-1" />
              TrustLayer Marketing
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-4">
              Social Media on Autopilot
            </h2>
            <p className="text-slate-300 mb-6">
              Stop spending hours on social media. TrustLayer Marketing posts for you, 
              boosts your best content, and tracks everything - so you can focus on 
              running your business.
            </p>

            <div className="space-y-3 mb-6">
              {['Automated Facebook & Instagram posting', 'Smart ad boosting within your budget', 'Full analytics dashboard', 'Content library management'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>

            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => window.location.href = '/trustlayer/marketing'}
              data-testid="button-trustlayer-marketing"
            >
              Start Marketing Autopilot
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bundle Offer */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="bg-gradient-to-r from-slate-800 to-slate-800/50 border-emerald-500/30 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <Badge className="mb-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Best Value
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-2">TrustLayer Complete Bundle</h3>
                <p className="text-slate-400">Marketing + Guardian Shield + Staffing - All in one</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-sm line-through">$187/mo</p>
                <p className="text-4xl font-bold text-white">$149<span className="text-lg text-slate-400">/mo</span></p>
                <Button
                  className="mt-4 bg-gradient-to-r from-emerald-600 to-blue-600"
                  data-testid="button-get-bundle"
                >
                  Get the Bundle
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">TrustLayer</p>
                <p className="text-slate-500 text-sm">TLId.io</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <span>Part of the Orbit Ecosystem</span>
              <span>|</span>
              <span>support@tlid.io</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
