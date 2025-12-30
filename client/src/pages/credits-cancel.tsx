import { useLocation } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CreditsCancel() {
  const [, setLocation] = useLocation();

  return (
    <PageLayout>
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full" data-testid="card-cancel">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="w-16 h-16 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold" data-testid="text-cancel-heading">
              Payment Cancelled
            </h1>
            <p className="text-muted-foreground" data-testid="text-cancel-message">
              Your payment was not processed.
            </p>
            <Button 
              onClick={() => setLocation("/credits")}
              className="w-full"
              data-testid="button-return-credits"
            >
              Return to Credits
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
