import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import { Home, ArrowLeft } from "lucide-react";
import { useLocation, Link } from "wouter";
import paintRollerWatermark from "@assets/paint_roller_transparent.png";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-primary flex flex-col relative">
      {/* Watermark background - paint roller */}
      <div className="fixed inset-0 pointer-events-none z-[1] flex items-center justify-center">
        <img 
          src={paintRollerWatermark} 
          alt="" 
          className="w-[75vw] max-w-4xl h-auto opacity-30 dark:opacity-25"
        />
      </div>
      <Navbar />
      {location !== "/" && (
        <div className="fixed top-16 left-4 z-30 hidden md:flex gap-2">
          <Link 
            href="/"
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
            aria-label="Go home"
            data-testid="button-home-desktop"
          >
            <Home className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
            aria-label="Go back"
            data-testid="button-back-desktop"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      )}
      <div className="flex-grow relative z-10 pt-[42px] md:pt-20 pb-[70px]">
        {children}
      </div>
      <Footer />
    </div>
  );
}
