import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const emailContent = `Team,

Excited to announce that our Nashville Painting Professionals Marketing Hub is now fully operational with automated social media posting!

WHAT'S WORKING NOW:

✓ Automated Social Media Posting
- Posts automatically publish to BOTH Facebook AND Instagram
- 3-4 posts per day (8 AM, 12 PM, 5 PM, 8 PM) Monday through Saturday
- Professional images and engaging captions ready to go

✓ Ad Campaign Manager
- $50/day ad budget with Nashville targeting
- Automated campaign execution
- Budget tracking ($2,000/month total - $1,400 for ads, $600 reserved)

✓ Content Library
- 5 professional posts with images ready for rotation
- Easy to add new Before & After photos from jobs
- Tracks which content has been used and when

✓ Content Calendar
- Visual calendar showing all scheduled posts
- MWF: Project showcases (Before/After)
- TThSat: Tips and engagement content
- Sunday: Planning day

✓ Analytics Dashboard
- Facebook & Instagram metrics in one place
- Followers, reach, engagement tracking
- Sync button to pull latest data from Meta
- Combined totals across both platforms

✓ System Health Dashboard
- Real-time status of all 10 connected services
- Green/yellow/red indicators for quick health checks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHERE TO ACCESS EVERYTHING:

MARKETING HUB (Desktop):
https://nashpaintpros.io/owner
→ Click "Marketing Hub" tab in the dashboard

MARKETING HUB (Mobile App):
https://nashpaintpros.io/app
→ Marketing section available in the app

DIRECT LINKS:
• Marketing Hub: https://nashpaintpros.io/owner (Marketing Hub tab)
• System Health: https://nashpaintpros.io/developer (System Health section)
• Trade Toolkit: https://nashpaintpros.io/trade-toolkit

MARKETING HUB TABS:
- Compose Tab - Create new posts
- Content Tab - Manage your image/message library
- Ads Tab - Manage ad campaigns
- Budget Tab - Track expenses
- Calendar Tab - See what's scheduled
- Analytics Tab - View performance metrics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT CREWS CAN DO:
- Submit Before & After photos through the Trade Toolkit camera
- Photos go directly into the Content Studio for social posting
- Access Trade Toolkit at: https://nashpaintpros.io/trade-toolkit

Questions? Reach out and I'll walk you through the system.

Let's keep transforming Nashville homes!`;

export default function EmailTemplate() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textarea = document.getElementById('email-content') as HTMLTextAreaElement;
    if (textarea) {
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(textarea.value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  const fullEmail = `Subject: NPP Marketing Hub is LIVE - Automated Posting to Facebook & Instagram

${emailContent}`;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Marketing Hub Announcement Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleCopy} 
              size="lg"
              className="w-full gap-2 text-lg py-6"
              data-testid="button-copy-email"
            >
              {copied ? (
                <>
                  <Check className="w-6 h-6" />
                  Copied! Now paste in your email
                </>
              ) : (
                <>
                  <Copy className="w-6 h-6" />
                  Click Here to Copy Email
                </>
              )}
            </Button>
            
            <textarea
              id="email-content"
              readOnly
              value={fullEmail}
              className="w-full h-96 p-4 text-sm font-mono bg-muted border rounded-lg resize-none"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              data-testid="textarea-email-content"
            />
            
            <p className="text-center text-muted-foreground text-sm">
              Click the button above or click inside the box and press Ctrl+A then Ctrl+C
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
