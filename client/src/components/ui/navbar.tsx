import { useState } from "react";
import { Link, useLocation } from "wouter";
import { X, Menu, PaintRoller, Shield, Crown, Code, ChevronRight, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTenant } from "@/context/TenantContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const tenant = useTenant();

  const mainLinks = [
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio", enabled: tenant.features.portfolio },
    { name: "About", href: "/about" },
    { name: "Reviews", href: "/reviews", enabled: tenant.features.reviews },
    { name: "Estimate", href: "/estimate", highlight: true, enabled: tenant.features.estimator },
  ].filter(link => link.enabled !== false);

  const adminLinks = [
    { name: "Admin", href: "/admin", icon: Shield, color: "text-blue-400" },
    { name: "Owner", href: "/owner", icon: Crown, color: "text-gold-400" },
    { name: "Area Manager", href: "/area-manager", icon: MapPin, color: "text-teal-400" },
    { name: "Developer", href: "/developer", icon: Code, color: "text-purple-400" },
  ];

  const getLogoAbbreviation = () => {
    const words = tenant.name.split(" ");
    if (words.length >= 3) {
      return words.slice(0, 3).map(w => w[0]).join("");
    }
    return words.map(w => w[0]).join("");
  };


  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-8">
        <Link href="/">
          <span className="font-display font-bold text-xl tracking-tighter text-foreground cursor-pointer">
            {getLogoAbbreviation()}<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {mainLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <span className={cn(
                "text-sm font-medium transition-colors cursor-pointer hover:text-accent",
                link.highlight ? "text-accent font-bold" : "text-muted-foreground",
                location === link.href && "text-accent"
              )}>
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle - Hamburger Menu */}
        <button 
          className="md:hidden text-foreground hover:text-accent transition-colors p-2 rounded-lg hover:bg-white/10" 
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-hamburger-menu"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-20 left-4 right-4 glass-panel rounded-2xl p-6 md:hidden overflow-hidden"
          >
            {/* Main Links */}
            <div className="space-y-1 mb-6">
              {mainLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={link.href}>
                    <span 
                      className={cn(
                        "text-lg font-medium flex items-center justify-between py-3 px-4 rounded-xl cursor-pointer transition-all",
                        link.highlight 
                          ? "bg-accent/10 text-accent font-bold" 
                          : "text-foreground hover:bg-white/5",
                        location === link.href && "bg-accent/10 text-accent"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                      <ChevronRight className="w-5 h-5 opacity-50" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 my-4" />

            {/* Admin Links */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2">Access</p>
              {adminLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (mainLinks.length + index) * 0.05 }}
                >
                  <Link href={link.href}>
                    <span 
                      className="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all hover:bg-white/5"
                      onClick={() => setIsOpen(false)}
                    >
                      <link.icon className={cn("w-5 h-5", link.color)} />
                      <span className="text-lg font-medium text-foreground">{link.name}</span>
                      <ChevronRight className="w-5 h-5 opacity-50 ml-auto" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Tenant name decoration at bottom */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PaintRoller className="w-5 h-5 text-accent" />
                <span className="text-xs">{tenant.name}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
