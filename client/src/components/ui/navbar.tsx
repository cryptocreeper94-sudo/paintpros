import { useState } from "react";
import { Link, useLocation } from "wouter";
import { X, PaintRoller, ChevronRight, ArrowLeft, Home, Menu, LogIn, User, LogOut, Award, Palette, BookOpen, TrendingUp, Briefcase, HardHat, Wrench, FileText, Calendar, Paintbrush, Star, HelpCircle, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTenant } from "@/context/TenantContext";
import { useAuth } from "@/hooks/use-auth";
import { LanguageToggle } from "@/components/language-toggle";
import nppLogo from "@assets/Nashville_PP_Logo_RGB-03_1766064290994.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const tenant = useTenant();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const mainLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio", enabled: tenant.features.portfolio },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Reviews", href: "/reviews", enabled: tenant.features.reviews },
    { name: "Blog", href: "/blog", icon: FileText, enabled: tenant.features.blog },
    { name: "Awards", href: "/awards", icon: Award },
    { name: "Color Library", href: "/colors", icon: Palette },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
    { name: "Contact", href: "/contact", icon: MessageSquare },
    { name: "Compare", href: "/compare", enabled: tenant.id === "demo" },
    { name: "Investors", href: "/investors", icon: TrendingUp, enabled: tenant.id === "demo" },
    { name: "Book Online", href: "/estimate", icon: Calendar, highlight: true, enabled: tenant.features.onlineBooking },
    { name: "Estimate", href: "/estimate", highlight: true, enabled: tenant.features.estimator && !tenant.features.onlineBooking },
  ].filter(link => link.enabled !== false);

  return (
    <>
    <header className="relative z-50">
      <div className={cn(
        "flex items-center px-3 md:px-4 overflow-hidden",
        (tenant.id === "npp" || tenant.id === "lumepaint") ? "h-20 md:h-28 lg:h-36" : "h-16 md:h-20"
      )}>
        {/* Left: Hamburger Menu - NPP logo for NPP, standard menu for demo */}
        <button 
          className={cn(
            "hover:opacity-80 transition-all flex-shrink-0 flex items-center justify-center cursor-pointer relative z-50",
            (tenant.id === "npp" || tenant.id === "lumepaint") ? "p-1 ml-1" : "p-2 ml-2"
          )}
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-hamburger-menu"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={28} className="text-gray-700" />
          ) : tenant.id === "npp" ? (
            <img 
              src={nppLogo} 
              alt="Menu"
              className="h-[240px] md:h-56 lg:h-80 w-auto object-contain"
              style={{ marginTop: '-40px', marginLeft: '-145px' }}
            />
          ) : tenant.id === "lumepaint" ? (
            <div className="flex items-center gap-2">
              <Menu size={24} className="text-gray-700" />
              <span 
                className="text-2xl md:text-3xl font-light text-gray-800 tracking-wide"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Lume
              </span>
            </div>
          ) : (
            <Menu size={28} className="text-gray-700" />
          )}
        </button>
        
        {/* Center: Title - only show for demo tenant */}
        {tenant.id === "demo" && (
          <div className="flex flex-col items-start ml-4 md:ml-8 min-w-0 flex-shrink">
            <div 
              className="text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl whitespace-nowrap bg-clip-text text-transparent"
              style={{ 
                fontFamily: 'Orbitron, Rajdhani, sans-serif', 
                fontWeight: 500, 
                letterSpacing: '0.05em',
                backgroundImage: 'linear-gradient(to right, #A89070, #7A5C45, #3D4A3A, #7A5C45, #A89070)'
              }}
              data-testid="text-header-title"
            >
              PaintPros.io
            </div>
            <div 
              className="hidden sm:block text-xs md:text-sm lg:text-base xl:text-lg whitespace-nowrap bg-clip-text text-transparent"
              style={{ 
                fontFamily: 'Rajdhani, sans-serif', 
                fontWeight: 400, 
                letterSpacing: '0.02em',
                backgroundImage: 'linear-gradient(to right, #A89070, #7A5C45, #3D4A3A, #7A5C45, #A89070)'
              }}
              data-testid="text-header-tagline"
            >
              White-Label Websites for Painting Contractors
            </div>
          </div>
        )}

        {/* Spacer to push content to the right */}
        <div className="flex-1" />
        
        {/* Language Toggle - Desktop - show for all tenants */}
        <div className="hidden md:flex items-center mr-4">
          <LanguageToggle variant="compact" />
        </div>
      </div>
    </header>

      {/* Navigation Controls - Back and Close buttons on all pages except home */}
      {location !== "/" && (
        <>
          {/* Mobile - positioned to avoid hamburger menu overlap */}
          <div className="fixed top-3 left-3 z-[60] md:hidden flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.history.back();
              }}
              className="p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-100 transition-all"
              aria-label="Go back"
              data-testid="button-back-mobile"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <Link href="/">
              <button 
                onClick={(e) => e.stopPropagation()}
                className="p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-100 transition-all"
                aria-label="Go home"
                data-testid="button-home-mobile"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </Link>
          </div>
          {/* Desktop - top right corner */}
          <div className="fixed top-4 right-4 z-40 hidden md:flex items-center gap-2">
            <button 
              onClick={() => window.history.back()}
              className="p-2.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-md hover:bg-gray-100 transition-all"
              aria-label="Go back"
              data-testid="button-back-desktop"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <Link href="/">
              <button 
                className="p-2.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-md hover:bg-gray-100 transition-all"
                aria-label="Close and go home"
                data-testid="button-close-desktop"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </Link>
          </div>
        </>
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
              className="fixed top-0 left-0 h-full w-72 bg-background border-r border-white/10 z-50 overflow-y-auto overscroll-contain"
            >
              <div className="px-4 py-6">
                {/* Close button */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="mb-6 p-2 hover:bg-gray-100 rounded-lg transition-all"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-700" />
                </button>

                {/* Language Toggle - show for all tenants */}
                <div className="mb-4 px-2">
                  <LanguageToggle variant="text" />
                </div>

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

                {/* For Contractors Section - All tenants get contractor signup, only demo gets trade verticals */}
                <div className="border-t border-white/10 my-4" />
                <div className="space-y-1 mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2 flex items-center gap-2">
                    <HardHat className="w-3 h-3" />
                    For Contractors
                  </p>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link href="/contractor-application">
                      <span 
                        className={cn(
                          "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all",
                          "bg-gradient-to-r from-accent/10 to-transparent hover:from-accent/20",
                          "border border-accent/20 hover:border-accent/40",
                          location === "/contractor-application" && "bg-accent/20 border-accent/50"
                        )}
                        onClick={() => setIsOpen(false)}
                        data-testid="link-contractor-application"
                      >
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1">
                          <span className="text-base font-medium text-foreground">Join Our Team</span>
                          <p className="text-xs text-muted-foreground">Apply as a contractor</p>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-50" />
                      </span>
                    </Link>
                  </motion.div>
                  {/* Trade Verticals - Demo site only */}
                  {tenant.id === "demo" && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Link href="/trade-verticals">
                        <span 
                          className={cn(
                            "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all",
                            "hover:bg-white/5",
                            location === "/trade-verticals" && "bg-accent/10"
                          )}
                          onClick={() => setIsOpen(false)}
                          data-testid="link-trade-verticals"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Wrench className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <span className="text-base font-medium text-foreground">All Trade Platforms</span>
                            <p className="text-xs text-muted-foreground">Explore our verticals</p>
                          </div>
                          <ChevronRight className="w-5 h-5 opacity-50" />
                        </span>
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Sister Sites - NPP Only (for preview access to Lume) */}
                {tenant.id === "npp" && (
                  <>
                    <div className="border-t border-white/10 my-4" />
                    <div className="space-y-1 mb-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2 flex items-center gap-2">
                        <Star className="w-3 h-3" />
                        Sister Sites
                      </p>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <a 
                          href="/?tenant=lumepaint" 
                          className="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all hover:bg-white/5"
                          onClick={() => setIsOpen(false)}
                          data-testid="link-lume-paint"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
                            <Paintbrush className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <span className="text-base font-medium text-foreground">Lume Paint Co</span>
                            <p className="text-xs text-muted-foreground">Premium painting services</p>
                          </div>
                          <ChevronRight className="w-5 h-5 opacity-50" />
                        </a>
                      </motion.div>
                    </div>
                  </>
                )}

                {/* Divider */}
                <div className="border-t border-white/10 my-4" />

                {/* User Account Section */}
                <div className="space-y-1 mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2">Account</p>
                  {authLoading ? (
                    <div className="py-3 px-4 text-muted-foreground">Loading...</div>
                  ) : isAuthenticated && user ? (
                    <>
                      <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-accent/10">
                        {user.profileImageUrl ? (
                          <img src={user.profileImageUrl} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <User className="w-5 h-5 text-accent" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {user.firstName || user.email || "User"}
                          </div>
                          {user.email && user.firstName && (
                            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                          )}
                        </div>
                      </div>
                      <Link href="/account">
                        <span 
                          className="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all hover:bg-white/5"
                          onClick={() => setIsOpen(false)}
                          data-testid="link-my-account"
                        >
                          <User className="w-5 h-5 text-accent" />
                          <span className="text-lg font-medium text-foreground">My Account</span>
                          <ChevronRight className="w-5 h-5 opacity-50 ml-auto" />
                        </span>
                      </Link>
                      <button 
                        onClick={async () => {
                          setIsOpen(false);
                          try {
                            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                            window.location.href = '/';
                          } catch (e) {
                            console.error('Logout failed', e);
                          }
                        }}
                        className="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all hover:bg-white/5 w-full text-left"
                      >
                        <LogOut className="w-5 h-5 text-red-400" />
                        <span className="text-lg font-medium text-foreground">Log Out</span>
                        <ChevronRight className="w-5 h-5 opacity-50 ml-auto" />
                      </button>
                    </>
                  ) : (
                    <Link href="/auth">
                      <span 
                        className="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all hover:bg-white/5 bg-accent/10"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn className="w-5 h-5 text-accent" />
                        <span className="text-lg font-medium text-foreground">Login / Sign Up</span>
                        <ChevronRight className="w-5 h-5 opacity-50 ml-auto" />
                      </span>
                    </Link>
                  )}
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
