import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Check,
  Copy,
  Shield,
  Settings,
  Key,
  Globe,
  Users,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Facebook,
  Instagram,
  Zap,
  ArrowRight,
  FileText,
  Link2
} from "lucide-react";

interface StepProps {
  number: number;
  title: string;
  description: string;
  isOpen: boolean;
  isComplete: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function SetupStep({ number, title, description, isOpen, isComplete, onClick, children }: StepProps) {
  return (
    <Card className={`bg-slate-800/50 border-slate-700 transition-all ${isOpen ? 'ring-2 ring-blue-500/50' : ''}`}>
      <div
        className="p-6 cursor-pointer flex items-start gap-4"
        onClick={onClick}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isComplete 
            ? 'bg-green-500/20 border-2 border-green-500' 
            : isOpen 
            ? 'bg-blue-500/20 border-2 border-blue-500'
            : 'bg-slate-700 border-2 border-slate-600'
        }`}>
          {isComplete ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <span className={`font-bold ${isOpen ? 'text-blue-400' : 'text-slate-400'}`}>{number}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        )}
      </div>
      {isOpen && (
        <CardContent className="pt-0 pb-6 px-6">
          <div className="ml-14 border-t border-slate-700 pt-6">
            {children}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function AutopilotSetupGuide() {
  const { toast } = useToast();
  const [openStep, setOpenStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Form state for collecting credentials
  const [credentials, setCredentials] = useState({
    appId: '',
    appSecret: '',
    pageAccessToken: ''
  });

  const markComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    if (step < 5) {
      setOpenStep(step + 1);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard` });
  };

  const requiredPermissions = [
    { name: 'pages_manage_posts', desc: 'Allows posting to your Facebook Page' },
    { name: 'pages_read_engagement', desc: 'Allows reading your page analytics' },
    { name: 'instagram_basic', desc: 'Access to your Instagram business account' },
    { name: 'instagram_content_publish', desc: 'Allows posting to Instagram' },
    { name: 'business_management', desc: 'Manage your business assets' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <FileText className="w-3 h-3 mr-1" />
            Setup Guide
          </Badge>
          <h1 className="text-3xl font-bold text-white mb-2">
            Connect Your Meta Business Account
          </h1>
          <p className="text-slate-400">
            Follow these steps to connect your Facebook Page and Instagram to Marketing Autopilot. 
            This one-time setup takes about 10-15 minutes.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
        {/* Why This Is Needed */}
        <Card className="bg-blue-500/10 border-blue-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-2">Why do I need to do this?</h3>
                <p className="text-slate-300 text-sm">
                  Meta (Facebook/Instagram) requires each business to authorize which apps can post on their behalf. 
                  This protects your accounts from unauthorized access. Once set up, our system can automatically 
                  post content and run ads for you - completely hands-off.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Create Meta Developer Account */}
        <SetupStep
          number={1}
          title="Create a Meta Developer Account"
          description="Sign up for Meta's developer platform (free)"
          isOpen={openStep === 1}
          isComplete={completedSteps.includes(1)}
          onClick={() => setOpenStep(openStep === 1 ? 0 : 1)}
        >
          <div className="space-y-4">
            <p className="text-slate-300">
              First, you need a Meta Developer account. This is free and uses your existing Facebook login.
            </p>
            
            <div className="bg-slate-900 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white">Go to Meta for Developers</p>
                  <Button
                    variant="link"
                    className="text-blue-400 p-0 h-auto"
                    onClick={() => window.open('https://developers.facebook.com/', '_blank')}
                  >
                    developers.facebook.com
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">2</span>
                </div>
                <p className="text-white">Click "Get Started" and log in with your Facebook account</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">3</span>
                </div>
                <p className="text-white">Accept the terms and complete registration</p>
              </div>
            </div>

            <Button onClick={() => markComplete(1)} className="w-full" data-testid="button-complete-step-1">
              I've Created My Developer Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </SetupStep>

        {/* Step 2: Create an App */}
        <SetupStep
          number={2}
          title="Create a New App"
          description="Create an app to manage your business's social media access"
          isOpen={openStep === 2}
          isComplete={completedSteps.includes(2)}
          onClick={() => setOpenStep(openStep === 2 ? 0 : 2)}
        >
          <div className="space-y-4">
            <p className="text-slate-300">
              Now create an app that will handle posting to your Facebook Page and Instagram.
            </p>
            
            <div className="bg-slate-900 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white">Go to "My Apps" in the top menu</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">2</span>
                </div>
                <p className="text-white">Click "Create App"</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-white">Select "Business" as the app type</p>
                  <p className="text-slate-400 text-sm">This gives access to Pages and Instagram</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">4</span>
                </div>
                <div>
                  <p className="text-white">Name your app (e.g., "My Business Marketing")</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">5</span>
                </div>
                <p className="text-white">Click "Create App" to finish</p>
              </div>
            </div>

            <Button onClick={() => markComplete(2)} className="w-full" data-testid="button-complete-step-2">
              I've Created My App
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </SetupStep>

        {/* Step 3: Add Required Products/Permissions */}
        <SetupStep
          number={3}
          title="Add Required Permissions"
          description="Enable Facebook Login and Instagram API access"
          isOpen={openStep === 3}
          isComplete={completedSteps.includes(3)}
          onClick={() => setOpenStep(openStep === 3 ? 0 : 3)}
        >
          <div className="space-y-4">
            <p className="text-slate-300">
              Your app needs specific permissions to post on your behalf. Add these products to your app:
            </p>
            
            <div className="bg-slate-900 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white">In your app dashboard, find "Add Products" section</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-white">Add "Facebook Login for Business"</p>
                  <p className="text-slate-400 text-sm">Click "Set Up" next to it</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-white">Add "Instagram Graph API"</p>
                  <p className="text-slate-400 text-sm">Click "Set Up" next to it</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-yellow-400" />
                Required Permissions
              </h4>
              <div className="space-y-2">
                {requiredPermissions.map(perm => (
                  <div key={perm.name} className="flex items-center gap-3 p-2 bg-slate-800 rounded">
                    <code className="text-blue-400 text-sm">{perm.name}</code>
                    <span className="text-slate-400 text-sm">- {perm.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => markComplete(3)} className="w-full" data-testid="button-complete-step-3">
              I've Added The Permissions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </SetupStep>

        {/* Step 4: Get Your App Credentials */}
        <SetupStep
          number={4}
          title="Copy Your App Credentials"
          description="Get your App ID and App Secret"
          isOpen={openStep === 4}
          isComplete={completedSteps.includes(4)}
          onClick={() => setOpenStep(openStep === 4 ? 0 : 4)}
        >
          <div className="space-y-4">
            <p className="text-slate-300">
              Now copy your app credentials. You'll provide these to us so we can connect to your accounts.
            </p>
            
            <div className="bg-slate-900 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white">Go to Settings → Basic in your app dashboard</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-white">Copy your "App ID" (a string of numbers)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-white">Click "Show" next to App Secret and copy it</p>
                  <p className="text-yellow-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Keep your App Secret private - never share it publicly
                  </p>
                </div>
              </div>
            </div>

            {/* Credential Input */}
            <div className="space-y-4 bg-slate-900/50 rounded-lg p-4">
              <div>
                <Label className="text-slate-300">App ID</Label>
                <Input
                  value={credentials.appId}
                  onChange={(e) => setCredentials({ ...credentials, appId: e.target.value })}
                  placeholder="e.g., 1234567890123456"
                  className="bg-slate-800 border-slate-700 font-mono"
                  data-testid="input-app-id"
                />
              </div>
              
              <div>
                <Label className="text-slate-300">App Secret</Label>
                <Input
                  type="password"
                  value={credentials.appSecret}
                  onChange={(e) => setCredentials({ ...credentials, appSecret: e.target.value })}
                  placeholder="Your app secret"
                  className="bg-slate-800 border-slate-700 font-mono"
                  data-testid="input-app-secret"
                />
              </div>
            </div>

            <Button 
              onClick={() => markComplete(4)} 
              className="w-full"
              disabled={!credentials.appId || !credentials.appSecret}
              data-testid="button-complete-step-4"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </SetupStep>

        {/* Step 5: Generate Access Token */}
        <SetupStep
          number={5}
          title="Generate Your Page Access Token"
          description="Create a long-lived token for automated posting"
          isOpen={openStep === 5}
          isComplete={completedSteps.includes(5)}
          onClick={() => setOpenStep(openStep === 5 ? 0 : 5)}
        >
          <div className="space-y-4">
            <p className="text-slate-300">
              Finally, generate an access token that allows posting to your Facebook Page and Instagram.
            </p>
            
            <div className="bg-slate-900 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white">Go to "Graph API Explorer" in your app</p>
                  <Button
                    variant="link"
                    className="text-blue-400 p-0 h-auto"
                    onClick={() => window.open('https://developers.facebook.com/tools/explorer/', '_blank')}
                  >
                    Open Graph API Explorer
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">2</span>
                </div>
                <p className="text-white">Select your app from the dropdown</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-white">Click "Add Permissions" and select:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {requiredPermissions.map(p => (
                      <Badge key={p.name} variant="outline" className="text-xs">{p.name}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">4</span>
                </div>
                <p className="text-white">Click "Generate Access Token" and authorize</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-sm font-bold">5</span>
                </div>
                <p className="text-white">Copy the generated token (long string of characters)</p>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <Label className="text-slate-300">Page Access Token</Label>
              <Input
                value={credentials.pageAccessToken}
                onChange={(e) => setCredentials({ ...credentials, pageAccessToken: e.target.value })}
                placeholder="Paste your access token here..."
                className="bg-slate-800 border-slate-700 font-mono text-sm"
                data-testid="input-page-token"
              />
              <p className="text-slate-500 text-xs mt-2">
                This token allows us to post on your behalf. It's stored securely and encrypted.
              </p>
            </div>

            <Button 
              onClick={() => markComplete(5)} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!credentials.pageAccessToken}
              data-testid="button-complete-setup"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Setup
            </Button>
          </div>
        </SetupStep>

        {/* Completion Card */}
        {completedSteps.length === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Setup Complete!</h2>
                <p className="text-slate-300 mb-6">
                  Your Meta Business account is now connected. You can proceed to configure your 
                  posting preferences and activate your Marketing Autopilot.
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => window.location.href = '/autopilot/dashboard'}
                  data-testid="button-go-to-dashboard"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Need Help */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-6 h-6 text-slate-400 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium mb-1">Need Help?</h4>
                <p className="text-slate-400 text-sm">
                  If you're having trouble with any step, contact our support team at{" "}
                  <span className="text-blue-400">support@paintpros.io</span> and we'll walk you through it.
                  You can also schedule a screen-share session where we guide you through the setup.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
