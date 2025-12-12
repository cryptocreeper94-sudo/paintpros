import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
// @ts-ignore - JPG asset import
import nppLogo from "@assets/Logo_NPP_Vertical_Light_1_(1)_1765567882082.JPG";
import { useTenant } from "@/context/TenantContext";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const tenant = useTenant();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-primary flex flex-col relative">
      {/* Pinned Watermark Background - NPP Logo */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.04] dark:opacity-[0.06] overflow-hidden">
        <div className="relative w-[70vw] md:w-[40vw] max-w-[600px]">
           <img 
            src={nppLogo} 
            alt="" 
            className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
          />
        </div>
      </div>

      <Navbar />
      <div className="flex-grow relative z-10">
        {children}
      </div>
      <Footer />
    </div>
  );
}
