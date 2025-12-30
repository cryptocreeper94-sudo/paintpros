import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CreditsSuccess() {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setLocation("/credits");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setLocation]);

  return (
    <PageLayout>
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full" data-testid="card-success">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold" data-testid="text-success-heading">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground" data-testid="text-success-message">
              Your credits have been added to your account.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting in {countdown} seconds...
            </p>
            <Button 
              onClick={() => setLocation("/credits")}
              className="w-full"
              data-testid="button-view-credits"
            >
              View Credits Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
