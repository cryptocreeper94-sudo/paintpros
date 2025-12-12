import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import watermark from "@assets/generated_images/minimalist_line_art_of_a_horizontal_paint_roller_for_logo_watermark.png";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-primary flex flex-col relative">
      {/* Pinned Watermark Background */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden">
        <div className="relative w-[80vw] md:w-[50vw] max-w-[800px] aspect-video flex flex-col items-center justify-center -rotate-12">
           <img 
            src={watermark} 
            alt="" 
            className="w-full h-auto object-contain mb-4 grayscale"
          />
           <h1 className="text-[4vw] md:text-[3vw] font-display font-bold uppercase tracking-widest text-foreground whitespace-nowrap">
             Nashville Painting <br/> Professionals
           </h1>
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
