import { Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#4B5320]/20 backdrop-blur-md border-t border-white/10 text-[10px] md:text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 h-auto md:h-[30px] py-2 md:py-0 flex flex-col md:flex-row justify-between items-center gap-2">
        
        {/* Left: Powered By */}
        <div className="whitespace-nowrap">
          Powered by <span className="font-bold text-foreground">DarkWave Studios, LLC</span> Copyright 2025
        </div>

        {/* Center: Copyright */}
        <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2 whitespace-nowrap">
          © 2025 Nashville Painting Professionals, LLC. All rights reserved.
        </div>

        {/* Right: Socials & Links */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-3 h-3" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Facebook className="w-3 h-3" /></a>
            <a href="#" className="hover:text-accent transition-colors"><Linkedin className="w-3 h-3" /></a>
          </div>
          <div className="h-3 w-px bg-white/20 hidden md:block" />
          <div className="flex gap-2 whitespace-nowrap">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
