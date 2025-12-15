import { useState } from "react";
import { Link, useLocation } from "wouter";
import { X, PaintRoller, Shield, Crown, Code, ChevronRight, MapPin, Sun, Moon, ArrowLeft, Home, Menu, HardHat, Briefcase, BookOpen } from "lucide-react";
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
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Reviews", href: "/reviews", enabled: tenant.features.reviews },
    { name: "Compare", href: "/compare", enabled: tenant.id === "demo" },
    { name: "Estimate", href: "/estimate", highlight: true, enabled: tenant.features.estimator },
  ].filter(link => link.enabled !== false);

  const adminLinks = [
    { name: "Owner", href: "/owner", icon: Crown, color: "text-gold-400" },
    { name: "Admin", href: "/admin", icon: Shield, color: "text-blue-400" },
    { name: "Project Manager", href: "/project-manager", icon: MapPin, color: "text-teal-400" },
    { name: "Crew Lead", href: "/crew-lead", icon: HardHat, color: "text-orange-400" },
    { name: "Contractor Application", href: "/contractor-application", icon: Briefcase, color: "text-green-400" },
    { name: "Blog", href: "/blog", icon: BookOpen, color: "text-pink-400" },
    { name: "Developer", href: "/developer", icon: Code, color: "text-purple-400" },
  ];

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{ backgroundColor: '#344e41' }}>
      <div className="flex items-center justify-between py-1 gap-1">
        {/* Left: Hamburger Menu - offset left and up */}
        <button 
          className={cn(
            "hover:bg-white/10 rounded-lg transition-all flex-shrink-0 flex items-center -ml-[70px] md:-ml-[70px] -mt-[25px]",
            tenant.id === "demo" ? "p-1" : "p-0"
          )}
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-hamburger-menu"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={36} className="text-white" />
          ) : tenant.id === "demo" ? (
            <Menu size={36} className="text-white" />
          ) : (
            <img 
              src={nppEmblem} 
              alt="Menu"
              className="h-14 md:h-16 w-auto object-contain"
            />
          )}
        </button>
        
        {/* Center: Title - full text, smaller font on mobile */}
        <div 
          className={cn(
            "flex-1 text-center whitespace-nowrap -translate-x-[60px] md:-translate-x-[43px] px-1",
            tenant.id === "demo" 
              ? "text-white text-[14px] md:text-xl lg:text-2xl"
              : "text-[14px] md:text-xl lg:text-2xl bg-clip-text text-transparent"
          )}
          style={{ 
            fontFamily: 'Orbitron, Rajdhani, sans-serif', 
            fontWeight: 400, 
            letterSpacing: '0.03em',
            backgroundImage: tenant.id !== "demo" ? 'linear-gradient(to right, #7A5C45, #A89070, #F5F5DC, #A89070, #7A5C45)' : undefined
          }}
          data-testid="text-header-title"
        >
          {tenant.id === "demo" 
            ? "PaintPros.io"
            : tenant.name
          }
        </div>

        {/* Right: Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 flex items-center justify-center transition-all flex-shrink-0 hover:opacity-80 -translate-x-[65px] bg-white/10 rounded-full"
          aria-label="Toggle theme"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-white" />}
        </button>
      </div>
    </header>

      {/* Mobile Navigation - Fixed below header */}
      {location !== "/" && (
        <div className="fixed top-12 left-2 z-40 md:hidden flex items-center gap-1">
          <button 
            onClick={() => window.history.back()}
            className="p-2 bg-background/90 backdrop-blur-sm border border-white/10 rounded-full shadow-lg hover:bg-white/20 transition-all"
            aria-label="Go back"
            data-testid="button-back-mobile"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <Link href="/">
            <button 
              className="p-2 bg-background/90 backdrop-blur-sm border border-white/10 rounded-full shadow-lg hover:bg-white/20 transition-all"
              aria-label="Go home"
              data-testid="button-home-mobile"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
          </Link>
        </div>
      )}

      {/* Sidebar Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-72 bg-background border-r border-white/10 z-50 overflow-y-auto"
            >
              <div className="px-4 py-6">
                {/* Close button */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="mb-6 p-2 hover:bg-white/10 rounded-lg transition-all"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-white" />
                </button>

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
          </>
        )}
      </AnimatePresence>
    </>
  );
}
