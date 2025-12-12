import { Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#4B5320]/20 backdrop-blur-md border-t border-white/10 text-[10px] md:text-xs text-muted-foreground h-[60px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
        
        {/* Left: Copyright */}
        <div className="whitespace-nowrap">
          © 2025 Nashville Painting Professionals, LLC. All rights reserved.
        </div>

        {/* Right: Socials & Links */}
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Linkedin className="w-4 h-4" /></a>
          </div>
          <div className="h-4 w-px bg-white/20 hidden md:block" />
          <div className="gap-4 whitespace-nowrap hidden md:flex">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
