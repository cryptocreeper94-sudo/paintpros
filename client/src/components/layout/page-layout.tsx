import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import nppLogo from "@assets/npp_logo_transparent.png";
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
            className="w-full h-auto object-contain"
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
