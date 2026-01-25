import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import { useTenant } from "@/context/TenantContext";
// import paintRollerWatermark from "@assets/paint_roller_transparent.png"; // temporarily hidden

interface PageLayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

export function PageLayout({ children, hideNavbar = false, hideFooter = false }: PageLayoutProps) {
  const tenant = useTenant();
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-primary flex flex-col relative">
      {!hideNavbar && <Navbar />}
      <div className="flex-grow relative pb-[70px]">
        {children}
      </div>
      {!hideFooter && <Footer />}
      {/* Watermark overlay - paint roller - temporarily hidden */}
    </div>
  );
}
