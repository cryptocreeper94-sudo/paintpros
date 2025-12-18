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
      <div className="flex-grow relative z-10 pb-[70px]">
        {children}
      </div>
      <Footer />
    </div>
  );
}
