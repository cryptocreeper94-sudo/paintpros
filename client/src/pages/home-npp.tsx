import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import { FlipButton } from "@/components/ui/flip-button";
import { ArrowRight, Phone } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import paintersImage from "@assets/stock_images/professional_interio_efb5d9bc.jpg";

export default function HomeNPP() {
  const tenant = useTenant();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col pt-16">
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 md:px-12 py-8 gap-8 md:gap-16">
          
          <div className="flex-1 max-w-xl text-center md:text-left">
            <h1 
              className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4 md:mb-6"
              style={{ 
                fontFamily: 'Orbitron, Rajdhani, sans-serif',
                backgroundImage: 'linear-gradient(to right, #BDB76B 0%, #355E3B 50%, #BDB76B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {tenant.name}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              {tenant.tagline}
            </p>
            
            <p className="text-base md:text-lg text-foreground/80 mb-8 md:mb-10 max-w-md mx-auto md:mx-0">
              {tenant.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="/estimate" data-testid="link-get-estimate">
                <FlipButton>
                  Get Free Estimate <ArrowRight className="w-4 h-4" />
                </FlipButton>
              </a>
              
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-accent/50 text-foreground hover:bg-accent/10 transition-colors"
                data-testid="link-contact-us"
              >
                <Phone className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={paintersImage} 
                alt="Professional painters at work"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
