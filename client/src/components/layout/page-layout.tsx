import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingAIButton } from "@/components/floating-ai-button";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-primary flex flex-col relative">
      <Navbar />
      <div className="flex-grow relative z-10 pt-[42px] md:pt-20 pb-[70px]">
        {children}
      </div>
      <Footer />
      <FloatingAIButton />
    </div>
  );
}
