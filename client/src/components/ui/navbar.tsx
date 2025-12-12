import { useState } from "react";
import { Link } from "wouter";
import { X, PaintRoller } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    { name: "Reviews", href: "/reviews" },
    { name: "Estimate", href: "/estimate", highlight: true },
  ];

  // Custom Hamburger Icon with Paint Roller
  const PaintRollerMenu = () => (
    <div className="flex flex-col justify-center items-center gap-[5px] w-6 h-6">
      <div className="w-full h-[2px] bg-current rounded-full" />
      <PaintRoller className="w-full h-4 text-accent rotate-90" strokeWidth={2.5} />
      <div className="w-full h-[2px] bg-current rounded-full" />
    </div>
  );

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-8">
        <Link href="/">
          <span className="font-display font-bold text-xl tracking-tighter text-foreground cursor-pointer">
            NPP<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.name} href={link.href}>
              <span className={cn(
                "text-sm font-medium transition-colors cursor-pointer hover:text-accent",
                link.highlight ? "text-accent font-bold" : "text-muted-foreground"
              )}>
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground hover:text-accent transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <PaintRollerMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-20 left-4 right-4 glass-panel rounded-2xl p-6 flex flex-col gap-4 md:hidden"
          >
            {links.map((link) => (
              <Link key={link.name} href={link.href}>
                <span 
                  className="text-lg font-medium text-foreground block py-2 border-b border-white/5 cursor-pointer hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
