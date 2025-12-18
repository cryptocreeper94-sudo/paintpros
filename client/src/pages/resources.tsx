import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Palette, 
  Shield, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Paintbrush,
  Clock,
  Droplets,
  Home,
  Building2,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";

export default function Resources() {
  const tenant = useTenant();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const resourceCategories = [
    {
      title: "Tools & Calculators",
      items: [
        {
          name: "Color Library",
          description: "Browse curated professional paint colors from Sherwin-Williams and Benjamin Moore",
          href: "/colors",
          icon: Palette,
          color: "text-pink-500"
        },
        {
          name: "Free Estimate",
          description: "Get an instant estimate for your painting project",
          href: "/estimate",
          icon: FileText,
          color: "text-emerald-500"
        }
      ]
    },
    {
      title: "Guides & Education",
      items: [
        {
          name: "Colors & Sheens Guide",
          description: "Learn about different paint finishes and when to use them",
          href: "#sheens",
          icon: Droplets,
          color: "text-blue-500"
        },
        {
          name: "Preparation Tips",
          description: "How we prepare surfaces for a lasting finish",
          href: "#prep",
          icon: Paintbrush,
          color: "text-amber-500"
        },
        {
          name: "Drying Times",
          description: "Understanding paint curing and when you can use your space",
          href: "#drying",
          icon: Clock,
          color: "text-purple-500"
        }
      ]
    },
    {
      title: "Policies & Support",
      items: [
        {
          name: "Terms & Warranty",
          description: `Our ${tenant.credentials?.warrantyYears || 3}-year warranty and service terms`,
          href: "/terms",
          icon: Shield,
          color: "text-green-500"
        },
        {
          name: "Help Center",
          description: "Frequently asked questions and support",
          href: "/help",
          icon: HelpCircle,
          color: "text-cyan-500"
        }
      ]
    },
    {
      title: "Services",
      items: [
        {
          name: "Interior Painting",
          description: "Walls, ceilings, trim, doors, and cabinets",
          href: "/services",
          icon: Home,
          color: "text-orange-500"
        },
        {
          name: "Exterior Painting",
          description: "Siding, trim, decks, and outdoor structures",
          href: "/services",
          icon: Building2,
          color: "text-teal-500"
        }
      ]
    }
  ];

  const sheenGuide = [
    { name: "Flat/Matte", description: "No shine, hides imperfections. Best for ceilings and low-traffic areas.", durability: 1 },
    { name: "Eggshell", description: "Subtle sheen, easy to clean. Great for living rooms and bedrooms.", durability: 2 },
    { name: "Satin", description: "Soft luster, very washable. Ideal for kitchens, bathrooms, and hallways.", durability: 3 },
    { name: "Semi-Gloss", description: "Reflective and durable. Perfect for trim, doors, and cabinets.", durability: 4 },
    { name: "High-Gloss", description: "Maximum shine and durability. Used for accents and high-wear surfaces.", durability: 5 }
  ];

  return (
    <PageLayout>
      <main className="pt-20 px-4 md:px-8 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full mb-4">
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="text-accent font-medium text-sm">Knowledge Base</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Resources</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about professional painting services, color selection, and project preparation.
            </p>
          </motion.div>

          <div className="grid gap-8 md:gap-12">
            {resourceCategories.map((category, catIdx) => (
              <motion.div key={category.title} variants={itemVariants}>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  {category.title}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item, idx) => (
                    <Link key={item.name} href={item.href}>
                      <GlassCard 
                        className="p-5 h-full cursor-pointer group" 
                        hoverEffect
                        data-testid={`card-resource-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg bg-white/10 ${item.color}`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
                              {item.name}
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-16" id="sheens">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Paint Sheens Guide</h2>
            <GlassCard className="p-6 md:p-8">
              <div className="grid gap-4">
                {sheenGuide.map((sheen, idx) => (
                  <div key={sheen.name} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                    <div className="flex-shrink-0 w-24 md:w-32">
                      <span className="font-semibold text-foreground">{sheen.name}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{sheen.description}</p>
                    </div>
                    <div className="flex-shrink-0 flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level}
                          className={`w-3 h-3 rounded-full ${level <= sheen.durability ? 'bg-accent' : 'bg-white/20'}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Durability rating: Higher = more washable and durable
              </p>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">Ready to Get Started?</h3>
            <Link href="/estimate">
              <Button size="lg" className="gap-2" data-testid="button-resources-estimate">
                Get Your Free Estimate
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </PageLayout>
  );
}
