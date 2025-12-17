import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import { Home, ArrowLeft } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useTenant } from "@/context/TenantContext";
import paintRollerWatermark from "@assets/paint_roller_transparent.png";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const [location] = useLocation();
  const tenant = useTenant();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-primary flex flex-col relative">
      {/* Watermark background - paint roller (NPP only) */}
      {tenant.id !== "demo" && (
        <div className="fixed inset-0 pointer-events-none z-[1] flex items-center justify-center pt-[136px] md:pt-[186px]">
          <img 
            src={paintRollerWatermark} 
            alt="" 
            className="w-[150vw] max-w-none h-auto opacity-35 dark:opacity-20 dark:invert dark:brightness-50 dark:contrast-75"
          />
        </div>
      )}
      <Navbar />
      {location !== "/" && (
        <div className="fixed top-16 left-4 z-30 flex gap-2">
          <Link 
            href="/"
            className="group w-11 h-11 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20 flex items-center justify-center hover:bg-accent/20 hover:border-accent/30 hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Go home"
            data-testid="button-home-desktop"
          >
            <Home className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-accent transition-colors" />
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="group w-11 h-11 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20 flex items-center justify-center hover:bg-accent/20 hover:border-accent/30 hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Go back"
            data-testid="button-back-desktop"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-accent transition-colors" />
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
