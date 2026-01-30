import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Check,
  Shield,
  Key,
  Globe,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Zap,
  ArrowRight,
  ArrowLeft,
  Building2,
  Paintbrush,
  Wrench,
  Leaf,
  Hammer,
  Plug,
  Droplets,
  Wind,
  Home,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  Image,
  Upload,
  Loader2,
  Copy,
  Info,
  DollarSign,
  CreditCard,
  Clock,
  X
} from "lucide-react";

const NICHES = [
  { id: 'painting', name: 'Painting', icon: Paintbrush, color: 'from-blue-500 to-indigo-500', description: 'Interior & Exterior Painting' },
  { id: 'landscaping', name: 'Landscaping', icon: Leaf, color: 'from-green-500 to-emerald-500', description: 'Lawn Care & Garden Design' },
  { id: 'roofing', name: 'Roofing', icon: Home, color: 'from-orange-500 to-red-500', description: 'Roof Repair & Installation' },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets, color: 'from-cyan-500 to-blue-500', description: 'Plumbing Services' },
  { id: 'hvac', name: 'HVAC', icon: Wind, color: 'from-purple-500 to-pink-500', description: 'Heating & Cooling' },
  { id: 'electrical', name: 'Electrical', icon: Plug, color: 'from-yellow-500 to-orange-500', description: 'Electrical Services' },
  { id: 'remodeling', name: 'Remodeling', icon: Hammer, color: 'from-amber-500 to-yellow-500', description: 'Home Renovations' },
  { id: 'general', name: 'General Contractor', icon: Wrench, color: 'from-slate-500 to-gray-500', description: 'General Construction' },
  { id: 'other', name: 'Other Business', icon: Building2, color: 'from-gray-500 to-slate-600', description: 'Enter your business type' },
];

const PROHIBITED_CONTENT = [
  'Adult content, pornography, or sexually explicit material',
  'Drugs, controlled substances, or drug paraphernalia',
  'Weapons, firearms, or explosives',
  'Gambling or online betting services',
  'Tobacco, vaping, or smoking products',
  'Multi-level marketing or pyramid schemes',
  'Counterfeit goods or intellectual property violations',
  'Hate speech, discrimination, or harassment',
  'Violence, gore, or graphic content',
  'Fraudulent, deceptive, or misleading claims',
  'Illegal services or activities',
  'Content targeting minors inappropriately'
];

const STEPS = [
  { id: 1, title: 'Choose Your Trade', icon: Building2 },
  { id: 2, title: 'Business Info', icon: User },
  { id: 3, title: 'Meta Setup Guide', icon: Key },
  { id: 4, title: 'Enter Credentials', icon: Shield },
  { id: 5, title: 'Select Plan', icon: DollarSign },
];

export default function AutopilotOnboarding() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('create-dev');
  
  const [formData, setFormData] = useState({
    niche: '',
    customNiche: '',
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    website: '',
    tagline: '',
    appId: '',
    appSecret: '',
    pageAccessToken: '',
    facebookPageId: '',
    instagramAccountId: '',
    ownerPin: '',
    acceptedTerms: false,
    acceptedContentPolicy: false
  });

  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional' | 'enterprise'>('professional');
  const [isOwnerApp, setIsOwnerApp] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const requiredPermissions = [
    { name: 'pages_manage_posts', desc: 'Post to your Facebook Page' },
    { name: 'pages_read_engagement', desc: 'Read page analytics' },
    { name: 'instagram_basic', desc: 'Access Instagram account' },
    { name: 'instagram_content_publish', desc: 'Post to Instagram' },
    { name: 'business_management', desc: 'Manage business assets' }
  ];

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied!` });
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/autopilot/onboard", {
        ...formData,
        plan: selectedPlan,
        isOwnerApp
      });
    },
    onSuccess: (data: any) => {
      toast({ title: "Account created successfully!" });
      if (data.subscriberId) {
        window.location.href = `/autopilot/portal?id=${data.subscriberId}`;
      }
    },
    onError: (error: any) => {
      toast({ title: error.message || "Failed to create account", variant: "destructive" });
    }
  });

  const verifyOwnerPin = () => {
    if (formData.ownerPin === '04240424') {
      setIsOwnerApp(true);
      toast({ title: "Owner PIN verified! Billing will be bypassed." });
    } else {
      toast({ title: "Invalid PIN", variant: "destructive" });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: 
        if (formData.niche === 'other') {
          return !!(formData.customNiche && formData.acceptedContentPolicy);
        }
        return !!(formData.niche && formData.acceptedContentPolicy);
      case 2: return !!(formData.businessName && formData.city && formData.state && formData.email);
      case 3: return true;
      case 4: return !!(formData.appId && formData.appSecret && formData.pageAccessToken);
      case 5: return formData.acceptedTerms;
      default: return false;
    }
  };

  const getEffectiveNiche = () => {
    return formData.niche === 'other' ? formData.customNiche : formData.niche;
  };

  const selectedNiche = NICHES.find(n => n.id === formData.niche);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TrustLayer Marketing</h1>
                <p className="text-slate-400 text-sm">Self-Service Setup</p>
              </div>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Step {currentStep} of 5
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  currentStep === step.id 
                    ? 'bg-blue-500/20 border border-blue-500/50' 
                    : currentStep > step.id 
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-slate-800/50 border border-slate-700'
                }`}
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > step.id ? 'bg-green-500' : currentStep === step.id ? 'bg-blue-500' : 'bg-slate-700'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <step.icon className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className={`text-sm whitespace-nowrap hidden md:block ${
                  currentStep >= step.id ? 'text-white' : 'text-slate-500'
                }`}>{step.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-blue-400" />
                    What type of business do you have?
                  </CardTitle>
                  <p className="text-slate-400">
                    We'll customize your marketing content based on your trade
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {NICHES.map(niche => (
                      <div
                        key={niche.id}
                        onClick={() => updateField('niche', niche.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all text-center ${
                          formData.niche === niche.id
                            ? 'bg-gradient-to-br ' + niche.color + ' ring-2 ring-white/50'
                            : 'bg-slate-900 hover:bg-slate-800 border border-slate-700'
                        }`}
                        data-testid={`niche-${niche.id}`}
                      >
                        <niche.icon className={`w-10 h-10 mx-auto mb-3 ${
                          formData.niche === niche.id ? 'text-white' : 'text-slate-400'
                        }`} />
                        <p className={`font-semibold ${
                          formData.niche === niche.id ? 'text-white' : 'text-white'
                        }`}>{niche.name}</p>
                        <p className={`text-xs mt-1 ${
                          formData.niche === niche.id ? 'text-white/80' : 'text-slate-500'
                        }`}>{niche.description}</p>
                      </div>
                    ))}
                  </div>

                  {formData.niche === 'other' && (
                    <div className="bg-slate-900 rounded-lg p-4">
                      <Label className="text-slate-300">Describe your business type *</Label>
                      <Input
                        value={formData.customNiche}
                        onChange={(e) => updateField('customNiche', e.target.value)}
                        placeholder="e.g., Pool cleaning, Window washing, Pet grooming..."
                        className="bg-slate-800 border-slate-700 mt-2"
                        data-testid="input-custom-niche"
                      />
                      <p className="text-slate-500 text-xs mt-2">
                        Enter your specific business type so we can customize your marketing content
                      </p>
                    </div>
                  )}

                  {formData.niche && (
                    <Card className="bg-red-500/10 border-red-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-red-400 font-semibold mb-2">Prohibited Content Policy</h4>
                            <p className="text-slate-300 text-sm mb-3">
                              By using TrustLayer Marketing, you agree NOT to upload or promote any of the following:
                            </p>
                            <ul className="text-slate-400 text-xs space-y-1 mb-4">
                              {PROHIBITED_CONTENT.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-red-400">-</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <div 
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                formData.acceptedContentPolicy 
                                  ? 'bg-green-500/20 border border-green-500/50' 
                                  : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                              }`}
                              onClick={() => setFormData(prev => ({ ...prev, acceptedContentPolicy: !prev.acceptedContentPolicy }))}
                              data-testid="checkbox-content-policy"
                            >
                              <div className={`w-5 h-5 rounded flex items-center justify-center ${
                                formData.acceptedContentPolicy ? 'bg-green-500' : 'bg-slate-700 border border-slate-600'
                              }`}>
                                {formData.acceptedContentPolicy && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-white text-sm">
                                I understand and agree that my content will be reviewed and any violations will result in immediate account termination without refund
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="text-blue-400 font-medium text-sm">Content Moderation</p>
                          <p className="text-slate-400 text-xs mt-1">
                            All uploaded images and content are automatically scanned using AI moderation to ensure compliance 
                            with Facebook and Instagram community standards. Content that violates these standards will be 
                            rejected and may result in account suspension.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <User className="w-6 h-6 text-blue-400" />
                    Tell us about your business
                  </CardTitle>
                  <p className="text-slate-400">
                    This info will be used to generate personalized marketing content
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedNiche && (
                    <div className={`p-4 rounded-lg bg-gradient-to-r ${selectedNiche.color} flex items-center gap-3`}>
                      <selectedNiche.icon className="w-8 h-8 text-white" />
                      <div>
                        <p className="text-white font-semibold">{selectedNiche.name}</p>
                        <p className="text-white/80 text-sm">{selectedNiche.description}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Business Name *</Label>
                      <Input
                        value={formData.businessName}
                        onChange={(e) => updateField('businessName', e.target.value)}
                        placeholder="e.g., Smith's Painting Co."
                        className="bg-slate-900 border-slate-700"
                        data-testid="input-business-name"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Owner Name</Label>
                      <Input
                        value={formData.ownerName}
                        onChange={(e) => updateField('ownerName', e.target.value)}
                        placeholder="e.g., John Smith"
                        className="bg-slate-900 border-slate-700"
                        data-testid="input-owner-name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">City *</Label>
                      <Input
                        value={formData.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        placeholder="e.g., Nashville"
                        className="bg-slate-900 border-slate-700"
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">State *</Label>
                      <Input
                        value={formData.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        placeholder="e.g., Tennessee"
                        className="bg-slate-900 border-slate-700"
                        data-testid="input-state"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Email *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="you@yourbusiness.com"
                        className="bg-slate-900 border-slate-700"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Phone</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="(615) 555-1234"
                        className="bg-slate-900 border-slate-700"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Website (optional)</Label>
                    <Input
                      value={formData.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      placeholder="https://yourbusiness.com"
                      className="bg-slate-900 border-slate-700"
                      data-testid="input-website"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Business Tagline (optional)</Label>
                    <Textarea
                      value={formData.tagline}
                      onChange={(e) => updateField('tagline', e.target.value)}
                      placeholder="e.g., Transforming Nashville homes since 1995"
                      className="bg-slate-900 border-slate-700 resize-none"
                      rows={2}
                      data-testid="input-tagline"
                    />
                    <p className="text-slate-500 text-xs mt-1">We'll use this in your marketing posts</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Info className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">What you'll need from Meta</h3>
                      <p className="text-slate-300 text-sm">
                        To post to Facebook and Instagram automatically, you need to create a Meta Developer App. 
                        This takes about 10-15 minutes. Follow the steps below - we'll walk you through it.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`bg-slate-800/50 border-slate-700 ${expandedSection === 'create-dev' ? 'ring-2 ring-blue-500/50' : ''}`}>
                <div 
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedSection(expandedSection === 'create-dev' ? null : 'create-dev')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Create a Meta Developer Account</p>
                      <p className="text-slate-400 text-sm">Free - uses your existing Facebook login</p>
                    </div>
                  </div>
                  {expandedSection === 'create-dev' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </div>
                {expandedSection === 'create-dev' && (
                  <CardContent className="pt-0 pb-6 space-y-4">
                    <div className="bg-slate-900 rounded-lg p-4 space-y-3">
                      <p className="text-slate-300">
                        1. Go to <Button variant="link" className="text-blue-400 p-0 h-auto" onClick={() => window.open('https://developers.facebook.com/', '_blank')}>
                          developers.facebook.com <ExternalLink className="w-3 h-3 inline ml-1" />
                        </Button>
                      </p>
                      <p className="text-slate-300">2. Click "Get Started" and log in with Facebook</p>
                      <p className="text-slate-300">3. Accept the terms and complete registration</p>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card className={`bg-slate-800/50 border-slate-700 ${expandedSection === 'create-app' ? 'ring-2 ring-blue-500/50' : ''}`}>
                <div 
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedSection(expandedSection === 'create-app' ? null : 'create-app')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Create a New App</p>
                      <p className="text-slate-400 text-sm">Select "Business" type app</p>
                    </div>
                  </div>
                  {expandedSection === 'create-app' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </div>
                {expandedSection === 'create-app' && (
                  <CardContent className="pt-0 pb-6 space-y-4">
                    <div className="bg-slate-900 rounded-lg p-4 space-y-3">
                      <p className="text-slate-300">1. Click "My Apps" in the top menu</p>
                      <p className="text-slate-300">2. Click "Create App"</p>
                      <p className="text-slate-300">3. Select <span className="text-white font-medium">"Business"</span> as the app type</p>
                      <p className="text-slate-300">4. Name it (e.g., "{formData.businessName || 'My Business'} Marketing")</p>
                      <p className="text-slate-300">5. Click "Create App"</p>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card className={`bg-slate-800/50 border-slate-700 ${expandedSection === 'permissions' ? 'ring-2 ring-blue-500/50' : ''}`}>
                <div 
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedSection(expandedSection === 'permissions' ? null : 'permissions')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Add Required Products</p>
                      <p className="text-slate-400 text-sm">Enable Facebook Login & Instagram API</p>
                    </div>
                  </div>
                  {expandedSection === 'permissions' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </div>
                {expandedSection === 'permissions' && (
                  <CardContent className="pt-0 pb-6 space-y-4">
                    <div className="bg-slate-900 rounded-lg p-4 space-y-3">
                      <p className="text-slate-300">1. In your app dashboard, find "Add Products"</p>
                      <p className="text-slate-300">2. Add <span className="text-white font-medium">"Facebook Login for Business"</span></p>
                      <p className="text-slate-300">3. Add <span className="text-white font-medium">"Instagram Graph API"</span></p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Key className="w-4 h-4 text-yellow-400" />
                        Required Permissions
                      </h4>
                      <div className="space-y-2">
                        {requiredPermissions.map(perm => (
                          <div key={perm.name} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                            <code className="text-blue-400 text-sm">{perm.name}</code>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => copyText(perm.name, perm.name)}
                              className="h-6 px-2"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card className={`bg-slate-800/50 border-slate-700 ${expandedSection === 'credentials' ? 'ring-2 ring-blue-500/50' : ''}`}>
                <div 
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedSection(expandedSection === 'credentials' ? null : 'credentials')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Get Your Credentials</p>
                      <p className="text-slate-400 text-sm">App ID, App Secret, and Access Token</p>
                    </div>
                  </div>
                  {expandedSection === 'credentials' ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </div>
                {expandedSection === 'credentials' && (
                  <CardContent className="pt-0 pb-6 space-y-4">
                    <div className="bg-slate-900 rounded-lg p-4 space-y-4">
                      <div>
                        <p className="text-white font-medium mb-2">App ID & App Secret:</p>
                        <p className="text-slate-300 text-sm">Go to Settings → Basic in your app dashboard</p>
                      </div>
                      <div>
                        <p className="text-white font-medium mb-2">Page Access Token:</p>
                        <p className="text-slate-300 text-sm mb-2">
                          1. Go to <Button variant="link" className="text-blue-400 p-0 h-auto" onClick={() => window.open('https://developers.facebook.com/tools/explorer/', '_blank')}>
                            Graph API Explorer <ExternalLink className="w-3 h-3 inline ml-1" />
                          </Button>
                        </p>
                        <p className="text-slate-300 text-sm">2. Select your app from dropdown</p>
                        <p className="text-slate-300 text-sm">3. Add the permissions listed above</p>
                        <p className="text-slate-300 text-sm">4. Click "Generate Access Token"</p>
                        <p className="text-slate-300 text-sm">5. Authorize and copy the token</p>
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        <div>
                          <p className="text-yellow-400 font-medium">Important</p>
                          <p className="text-slate-300 text-sm">
                            Your Page Access Token expires. For a long-lived token, we'll exchange it automatically.
                            Just paste whatever token you generate - we handle the rest.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-400" />
                    Enter Your Meta Credentials
                  </CardTitle>
                  <p className="text-slate-400">
                    Paste the credentials from your Meta Developer App
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-green-400 font-medium">Secure & Encrypted</p>
                        <p className="text-slate-300 text-sm">
                          Your credentials are encrypted and stored securely. We never share your data.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">App ID *</Label>
                    <Input
                      value={formData.appId}
                      onChange={(e) => updateField('appId', e.target.value)}
                      placeholder="e.g., 1234567890123456"
                      className="bg-slate-900 border-slate-700 font-mono"
                      data-testid="input-app-id"
                    />
                    <p className="text-slate-500 text-xs mt-1">Found in Settings → Basic</p>
                  </div>

                  <div>
                    <Label className="text-slate-300">App Secret *</Label>
                    <Input
                      type="password"
                      value={formData.appSecret}
                      onChange={(e) => updateField('appSecret', e.target.value)}
                      placeholder="Click 'Show' in Meta dashboard to copy"
                      className="bg-slate-900 border-slate-700 font-mono"
                      data-testid="input-app-secret"
                    />
                    <p className="text-slate-500 text-xs mt-1">Found in Settings → Basic (click Show)</p>
                  </div>

                  <div>
                    <Label className="text-slate-300">Page Access Token *</Label>
                    <Textarea
                      value={formData.pageAccessToken}
                      onChange={(e) => updateField('pageAccessToken', e.target.value)}
                      placeholder="Paste your access token from Graph API Explorer..."
                      className="bg-slate-900 border-slate-700 font-mono text-sm resize-none"
                      rows={3}
                      data-testid="input-access-token"
                    />
                    <p className="text-slate-500 text-xs mt-1">Generated from Graph API Explorer</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Facebook Page ID (optional)</Label>
                      <Input
                        value={formData.facebookPageId}
                        onChange={(e) => updateField('facebookPageId', e.target.value)}
                        placeholder="Auto-detected from token"
                        className="bg-slate-900 border-slate-700 font-mono"
                        data-testid="input-page-id"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Instagram Account ID (optional)</Label>
                      <Input
                        value={formData.instagramAccountId}
                        onChange={(e) => updateField('instagramAccountId', e.target.value)}
                        placeholder="Auto-detected from token"
                        className="bg-slate-900 border-slate-700 font-mono"
                        data-testid="input-instagram-id"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Start with $1 for 7 Days</p>
                      <p className="text-slate-400 text-sm">See the automation work with organic posts. Auto-converts to your chosen plan.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                    Choose Your Plan
                  </CardTitle>
                  <p className="text-slate-400 text-sm">Select the plan that fits your business. Your $1 trial will auto-convert after 7 days.</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Starter Plan */}
                    <div 
                      onClick={() => setSelectedPlan('starter')}
                      className={`p-5 rounded-xl cursor-pointer transition-all ${
                        selectedPlan === 'starter'
                          ? 'bg-blue-500/20 ring-2 ring-blue-500'
                          : 'bg-slate-900 border border-slate-700 hover:border-slate-600'
                      }`}
                      data-testid="plan-starter"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">Starter</h3>
                        {selectedPlan === 'starter' && <CheckCircle className="w-5 h-5 text-blue-400" />}
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">$99<span className="text-base text-slate-400">/mo</span></p>
                      <p className="text-slate-500 text-xs mb-4">After $1 trial</p>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> Automated posting</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> Facebook & Instagram</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> Content library</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> Basic analytics</li>
                        <li className="flex items-center gap-2 text-slate-500"><X className="w-4 h-4 flex-shrink-0" /> Paid ad campaigns</li>
                        <li className="flex items-center gap-2 text-slate-500"><X className="w-4 h-4 flex-shrink-0" /> AI content generation</li>
                      </ul>
                    </div>

                    {/* Professional Plan */}
                    <div 
                      onClick={() => setSelectedPlan('professional')}
                      className={`p-5 rounded-xl cursor-pointer transition-all relative ${
                        selectedPlan === 'professional'
                          ? 'bg-purple-500/20 ring-2 ring-purple-500'
                          : 'bg-slate-900 border border-slate-700 hover:border-slate-600'
                      }`}
                      data-testid="plan-professional"
                    >
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-500 text-white border-0">
                        Most Popular
                      </Badge>
                      <div className="flex items-center justify-between mb-3 mt-2">
                        <h3 className="text-lg font-bold text-white">Professional</h3>
                        {selectedPlan === 'professional' && <CheckCircle className="w-5 h-5 text-purple-400" />}
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">$199<span className="text-base text-slate-400">/mo</span></p>
                      <p className="text-slate-500 text-xs mb-4">After $1 trial</p>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> Everything in Starter</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> All 4 platforms</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 flex-shrink-0" /> Paid ad campaigns</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 flex-shrink-0" /> AI content generation</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> Geo-targeted ads</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> Advanced analytics</li>
                      </ul>
                    </div>

                    {/* Enterprise Plan */}
                    <div 
                      onClick={() => setSelectedPlan('enterprise')}
                      className={`p-5 rounded-xl cursor-pointer transition-all ${
                        selectedPlan === 'enterprise'
                          ? 'bg-amber-500/20 ring-2 ring-amber-500'
                          : 'bg-slate-900 border border-slate-700 hover:border-slate-600'
                      }`}
                      data-testid="plan-enterprise"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">Enterprise</h3>
                        {selectedPlan === 'enterprise' && <CheckCircle className="w-5 h-5 text-amber-400" />}
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">$349<span className="text-base text-slate-400">/mo</span></p>
                      <p className="text-slate-500 text-xs mb-4">After $1 trial</p>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> Everything in Professional</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 flex-shrink-0" /> Priority support</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 flex-shrink-0" /> Custom branding</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 flex-shrink-0" /> Dedicated manager</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> Unlimited content</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 flex-shrink-0" /> White-label reports</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-slate-400 text-xs text-center">
                      <Clock className="w-3 h-3 inline mr-1" />
                      7-day trial includes organic posting only. Paid ad features activate after trial converts.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Key className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">Internal App (Owner PIN)</p>
                      <p className="text-slate-400 text-sm">For Orbit ecosystem apps - bypasses billing</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Input
                      type="password"
                      value={formData.ownerPin}
                      onChange={(e) => updateField('ownerPin', e.target.value)}
                      placeholder="Enter owner PIN"
                      className="bg-slate-900 border-slate-700 font-mono flex-1"
                      data-testid="input-owner-pin"
                    />
                    <Button onClick={verifyOwnerPin} variant="outline" data-testid="button-verify-pin">
                      Verify
                    </Button>
                  </div>
                  {isOwnerApp && (
                    <Badge className="mt-3 bg-green-500/20 text-green-400 border-green-500/30">
                      <Check className="w-3 h-3 mr-1" /> Owner PIN verified - billing bypassed
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Terms of Service Agreement
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto text-xs text-slate-400 space-y-2">
                    <p className="font-medium text-slate-300">TrustLayer Marketing - Terms of Service</p>
                    <p>By using TrustLayer Marketing ("Service"), you agree to the following terms:</p>
                    <p><strong className="text-slate-300">1. Service Description:</strong> TrustLayer provides automated social media marketing services for legitimate businesses. We post content and manage ads on your behalf using your connected Meta Business Suite accounts.</p>
                    <p><strong className="text-slate-300">2. Content Responsibility:</strong> You are solely responsible for all content you upload or provide. TrustLayer reserves the right to reject, remove, or refuse to post any content at our sole discretion.</p>
                    <p><strong className="text-slate-300">3. Prohibited Content:</strong> You agree not to upload content that violates our Prohibited Content Policy, Facebook/Instagram Community Standards, or any applicable laws. Violations may result in immediate account termination without refund.</p>
                    <p><strong className="text-slate-300">4. Content Moderation:</strong> All content is subject to AI-powered moderation. We may reject content that appears to violate platform guidelines, even if not explicitly listed in our prohibited content policy.</p>
                    <p><strong className="text-slate-300">5. Liability Disclaimer:</strong> TrustLayer is not liable for: (a) content you provide or approve, (b) actions taken by Facebook/Instagram against your accounts, (c) performance of ad campaigns, (d) any business losses resulting from use of the Service.</p>
                    <p><strong className="text-slate-300">6. Account Suspension:</strong> We reserve the right to suspend or terminate accounts that violate these terms, abuse the platform, or engage in fraudulent activity.</p>
                    <p><strong className="text-slate-300">7. Refund Policy:</strong> Subscriptions are billed monthly. No refunds for accounts terminated due to policy violations.</p>
                    <p><strong className="text-slate-300">8. Indemnification:</strong> You agree to indemnify and hold harmless TrustLayer, its officers, and employees from any claims arising from your use of the Service or content you provide.</p>
                    <p><strong className="text-slate-300">9. Changes to Terms:</strong> We may update these terms at any time. Continued use constitutes acceptance.</p>
                    <p className="text-slate-500 pt-2">Last updated: January 2026</p>
                  </div>
                  <div 
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                      formData.acceptedTerms 
                        ? 'bg-green-500/20 border border-green-500/50' 
                        : 'bg-slate-900 border border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, acceptedTerms: !prev.acceptedTerms }))}
                    data-testid="checkbox-terms"
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                      formData.acceptedTerms ? 'bg-green-500' : 'bg-slate-700 border border-slate-600'
                    }`}>
                      {formData.acceptedTerms && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-white text-sm">
                      I have read and agree to the Terms of Service, Privacy Policy, and understand that I am responsible for all content I upload
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-8 h-8 text-blue-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">What happens next?</h3>
                      <ul className="space-y-2 text-slate-300 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          We'll verify your Meta connection
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          Generate marketing content for your {selectedNiche?.name.toLowerCase()} business
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          Set up automated posting schedule
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          Start growing your online presence
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="border-slate-700"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              data-testid="button-next"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
              className="bg-gradient-to-r from-green-600 to-emerald-600"
              data-testid="button-submit"
            >
              {submitMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {isOwnerApp ? 'Activate (No Billing)' : 'Start $1 Trial'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
