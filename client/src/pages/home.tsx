import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border bg-card text-card-foreground shadow-sm">
        <CardContent className="pt-6 text-center space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Canvas Reset
          </h1>
          <p className="text-muted-foreground">
            The previous project context has been cleared. We are ready to start fresh.
            What would you like to build?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
