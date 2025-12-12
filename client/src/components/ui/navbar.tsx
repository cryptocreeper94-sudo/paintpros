import { useState } from "react";
import { Link, useLocation } from "wouter";
import { X, PaintRoller, Shield, Crown, Code, ChevronRight, MapPin, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTenant } from "@/context/TenantContext";
import { useTheme } from "@/context/ThemeContext";
import nppEmblem from "@assets/npp_emblem_full.png";
import nppText from "@assets/npp_text_full.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const tenant = useTenant();
  const { theme, toggleTheme } = useTheme();

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{ backgroundColor: '#344e41' }}>
      <div className="w-full px-2 md:px-4 py-1 flex items-center justify-between">
        {/* Left: Hamburger Emblem */}
        <button 
          className="p-0 hover:bg-white/10 rounded-lg transition-all flex-shrink-0 flex items-center" 
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-hamburger-menu"
          aria-label="Toggle menu"
          style={{ marginLeft: '-140px' }}
        >
          {isOpen ? (
            <X size={56} className="text-white" />
          ) : (
            <img 
              src={nppEmblem} 
              alt="Menu"
              className="h-20 md:h-[90px] w-auto object-contain"
            />
          )}
        </button>

        {/* Right: Desktop Nav Links + Theme Toggle */}
        <div className="hidden md:flex items-center gap-6">
          {mainLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <span className={cn(
                "text-sm font-medium transition-colors cursor-pointer hover:text-accent",
                link.highlight ? "text-accent font-bold" : "text-white/80",
                location === link.href && "text-accent"
              )}>
                {link.name}
              </span>
            </Link>
          ))}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-accent" />
            ) : (
              <Moon className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Mobile: Theme Toggle only (hamburger is on left now) */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            aria-label="Toggle theme"
            data-testid="button-theme-toggle-mobile"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-accent" />
            ) : (
              <Moon className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
