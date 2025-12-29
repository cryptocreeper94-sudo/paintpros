import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import { useTenant } from "@/context/TenantContext";
import paintRollerWatermark from "@assets/paint_roller_transparent.png";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const tenant = useTenant();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-primary flex flex-col relative">
      <Navbar />
      <div className="flex-grow relative pb-[70px]">
        {children}
      </div>
      <Footer />
      {/* Watermark overlay - paint roller (NPP only) - on top with pointer-events-none */}
      {tenant.id !== "demo" && (
        <div className="fixed inset-0 pointer-events-none z-[5] flex items-center justify-center pt-[156px] md:pt-[206px]">
          <img 
            src={paintRollerWatermark} 
            alt="" 
            className="w-[150vw] max-w-none h-auto opacity-15 dark:opacity-10 dark:invert dark:brightness-50 dark:contrast-75"
          />
        </div>
      )}
    </div>
  );
}
