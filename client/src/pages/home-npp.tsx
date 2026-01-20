import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import { FlipButton } from "@/components/ui/flip-button";
import { ArrowRight, Phone, Calendar, Star, Shield, Clock, Award } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import paintersImage from "@assets/generated_images/two_painters_ladder_and_ground.png";

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
              <Link href="/estimate">
                <FlipButton data-testid="link-get-estimate">
                  Get Instant Estimate <ArrowRight className="w-4 h-4" />
                </FlipButton>
              </Link>
              
              <Link href="/book">
                <span
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-accent/50 text-foreground hover:bg-accent/10 transition-colors cursor-pointer"
                  data-testid="link-book-now"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </span>
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-2 justify-center md:justify-start text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <a href={`tel:${tenant.phone}`} className="hover:text-foreground transition-colors">
                {tenant.phone}
              </a>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-lg overflow-hidden shadow-2xl"
            >
              <img 
                src={paintersImage} 
                alt="Professional painters at work"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>

        <section className="py-12 px-4 md:px-12 bg-card/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{tenant.credentials?.googleRating || "5.0"}</div>
                <div className="text-sm text-muted-foreground">Google Rating</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{tenant.credentials?.yearsInBusiness || "15"}+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Licensed & Insured</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">24hr</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Nashville's Trusted Painting Professionals</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              From interior transformations to exterior protection, we deliver premium painting services 
              with attention to detail and respect for your home.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/services">
                <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-2">Interior Painting</h3>
                  <p className="text-sm text-muted-foreground">Walls, ceilings, trim, and doors with premium finishes</p>
                </div>
              </Link>
              
              <Link href="/services">
                <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-2">Exterior Painting</h3>
                  <p className="text-sm text-muted-foreground">Weather-resistant coatings that protect and beautify</p>
                </div>
              </Link>
              
              <Link href="/services">
                <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold mb-2">Cabinet Refinishing</h3>
                  <p className="text-sm text-muted-foreground">Transform your kitchen without the cost of replacement</p>
                </div>
              </Link>
            </div>
            
            <div className="mt-10">
              <Link href="/estimate">
                <FlipButton data-testid="link-estimate-bottom">
                  Get Your Free Estimate <ArrowRight className="w-4 h-4" />
                </FlipButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
