import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-primary flex flex-col relative">
      <Navbar />
      <div className="flex-grow relative z-10 pt-20 md:pt-24">
        {children}
      </div>
      <Footer />
    </div>
  );
}
