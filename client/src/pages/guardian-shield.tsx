import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Lock,
  FileCheck,
  Fingerprint,
  Award,
  Eye,
  Users,
  Building2,
  Star,
  Zap,
  Globe,
  BadgeCheck,
  ShieldCheck,
  Layers,
  Loader2,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

export default function GuardianShield() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Guardian Shield',
        page_path: '/trustlayer/guardian'
      });
    }
  }, []);

  const handleSubmit = async () => {
    if (!businessName || !email) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowForm(false);
      toast({ title: "Application submitted! We'll be in touch within 24 hours." });
    }, 1500);
  };

  const verificationLevels = [
    {
      name: 'Basic Verified',
      price: '$29/mo',
      color: 'from-slate-500 to-slate-600',
      features: [
        'Business name verification',
        'Contact information verified',
        'Basic trust badge',
        'Profile listing'
      ]
    },
    {
      name: 'Professional',
      price: '$49/mo',
      color: 'from-blue-500 to-blue-600',
      popular: true,
      features: [
        'Everything in Basic',
        'License verification',
        'Insurance verification',
        'Professional trust badge',
        'Priority support'
      ]
    },
    {
      name: 'Enterprise',
      price: '$99/mo',
      color: 'from-emerald-500 to-teal-500',
      features: [
        'Everything in Professional',
        'Background checks',
        'Bonding verification',
        'Premium trust badge',
        'API access',
        'White-label options'
      ]
    }
  ];

  const trustFeatures = [
    {
      icon: Fingerprint,
      title: 'Identity Verification',
      desc: 'Verify your business is who you say you are. Build instant credibility with customers.'
    },
    {
      icon: FileCheck,
      title: 'Credential Management',
      desc: 'Licenses, insurance, certifications - all verified and displayed professionally.'
    },
    {
      icon: ShieldCheck,
      title: 'Security Monitoring',
      desc: 'Continuous monitoring for threats, breaches, and reputation issues.'
    },
    {
      icon: Award,
      title: 'Trust Badges',
      desc: 'Display verified badges on your website, emails, and marketing materials.'
    },
    {
      icon: Eye,
      title: 'Transparency Reports',
      desc: 'Show customers your verified history, reviews, and track record.'
    },
    {
      icon: Globe,
      title: 'Public Profile',
      desc: 'A verified public profile customers can check before hiring you.'
    }
  ];

  const stats = [
    { value: '73%', label: 'Trust Increase', desc: 'Average increase in customer trust' },
    { value: '2.4x', label: 'More Leads', desc: 'Verified businesses get more inquiries' },
    { value: '89%', label: 'Conversion Rate', desc: 'Of visitors trust verified badges' },
    { value: '24hr', label: 'Verification', desc: 'Most verifications complete in 24 hours' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.location.href = '/trustlayer'}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">TrustLayer</p>
                <p className="text-slate-500 text-xs">Guardian Shield</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/trustlayer/marketing'}>
                <Zap className="w-4 h-4 mr-2" />
                Marketing
              </Button>
              <Button size="sm" onClick={() => setShowForm(true)} data-testid="button-get-verified">
                Get Verified
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Business Security & Verification
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Build{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Unshakeable Trust
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Customers check reviews, look for badges, and verify credentials before hiring. 
            Guardian Shield gives you verified credibility that converts browsers into buyers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-lg px-8 py-6"
              onClick={() => setShowForm(true)}
              data-testid="button-hero-cta"
            >
              Get Verified Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Get Verified</h2>
                  <p className="text-slate-400">Start building trust today</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Business Name</Label>
                    <Input
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Your business name"
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Email Address</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourbusiness.com"
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Submit Application<ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="border-y border-slate-700 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-emerald-400">{stat.value}</p>
                <p className="text-white font-medium">{stat.label}</p>
                <p className="text-slate-500 text-sm">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Badge Preview */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Display Your Verified Status
            </h2>
            <p className="text-slate-300 mb-6">
              When customers see the Guardian Shield badge, they know your business has been 
              independently verified. Display badges on your website, social media, invoices, 
              and marketing materials.
            </p>

            <div className="space-y-4">
              {[
                'Instantly recognizable trust symbol',
                'Links to your verified public profile',
                'Shows licenses, insurance, and credentials',
                'Updated in real-time as you add verifications'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badge Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 blur-3xl" />
              <Card className="relative bg-slate-800/80 border-emerald-500/30 w-80">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <Badge className="mb-3 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <BadgeCheck className="w-3 h-3 mr-1" />
                    Guardian Shield Verified
                  </Badge>
                  <h4 className="text-xl font-bold text-white mb-1">Your Business Name</h4>
                  <p className="text-slate-400 text-sm mb-4">Professional Verified</p>
                  
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Licensed & Insured</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Background Checked</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Business Verified</span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs mt-4">Member since January 2024</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-slate-800/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Complete Trust Infrastructure</h2>
            <p className="text-slate-400">Everything you need to build and display business credibility</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Verification Level</h2>
          <p className="text-slate-400">Start with Basic and upgrade as you grow</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {verificationLevels.map((level, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`bg-slate-800/50 border-slate-700 h-full relative ${level.popular ? 'ring-2 ring-emerald-500' : ''}`}>
                {level.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${level.color} flex items-center justify-center mb-4`}>
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{level.name}</h3>
                  <p className="text-3xl font-bold text-white mb-4">{level.price}</p>

                  <div className="space-y-3 mb-6">
                    {level.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${level.popular ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : ''}`}
                    variant={level.popular ? 'default' : 'outline'}
                    onClick={() => setShowForm(true)}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-slate-700 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Trust?
          </h2>
          <p className="text-slate-300 mb-8">
            Join verified businesses that customers trust
          </p>
          <Button
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8"
            onClick={() => setShowForm(true)}
          >
            Get Verified Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-5 h-5" />
            <span>Guardian Shield by TrustLayer</span>
          </div>
          <p>TLId.io | Part of the TrustLayer Ecosystem</p>
        </div>
      </div>
    </div>
  );
}
