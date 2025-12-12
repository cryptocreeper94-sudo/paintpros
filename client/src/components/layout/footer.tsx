import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, Award, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white/5 border-t border-white/10 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Contact */}
          <div className="space-y-6">
            <Link href="/">
              <span className="font-display font-bold text-2xl tracking-tighter text-foreground cursor-pointer">
                NPP<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nashville's premier painting company. Dedicated to transforming spaces with exceptional craftsmanship and integrity.
            </p>
            <div className="space-y-3">
              <a href="tel:615-930-1550" className="flex items-center gap-3 text-sm hover:text-accent transition-colors">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                (615) 930-1550
              </a>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <span>5016 Centennial Blvd, Suite 200<br/>Nashville, TN 37209</span>
              </div>
              <a href="mailto:service@nashvillepaintingprofessionals.com" className="flex items-center gap-3 text-sm hover:text-accent transition-colors">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                service@nashvillepaintingprofessionals.com
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-accent transition-colors">Residential Painting</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Commercial Painting</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Interior Painting</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Exterior Painting</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Cabinet Painting</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Deck Staining</Link></li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Service Areas</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-accent" /> Nashville</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-accent" /> Brentwood</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-accent" /> Franklin</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-accent" /> Hendersonville</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-accent" /> Mt. Juliet</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-accent" /> Belle Meade</li>
            </ul>
          </div>

          {/* Trust Badges */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Awards</h4>
            <div className="flex flex-wrap gap-4">
               <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-lg text-center w-full">
                 <Award className="w-8 h-8 text-accent mb-2" />
                 <span className="font-bold text-xs">Expertise.com</span>
                 <span className="text-[10px] text-muted-foreground">Best of 2025</span>
               </div>
               <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-lg text-center w-full">
                 <Award className="w-8 h-8 text-accent mb-2" />
                 <span className="font-bold text-xs">Best Pros</span>
                 <span className="text-[10px] text-muted-foreground">Recommended</span>
               </div>
            </div>
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2025 Nashville Painting Professionals, LLC. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-accent transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
