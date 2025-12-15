import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { GlassCard } from "@/components/ui/glass-card";
import { Key, Crown, Shield, MapPin, HardHat, Code, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cardBackgroundStyles, iconContainerStyles, springTransition } from "@/lib/theme-effects";

const PIN_ROLES = [
  { role: "Owner", pin: "1111", icon: Crown, color: "text-gold-400", bgColor: "bg-gold-400/20" },
  { role: "Admin", pin: "4444", icon: Shield, color: "text-blue-400", bgColor: "bg-blue-400/20" },
  { role: "Project Manager", pin: "2222", icon: MapPin, color: "text-teal-400", bgColor: "bg-teal-400/20" },
  { role: "Crew Lead", pin: "3333", icon: HardHat, color: "text-orange-400", bgColor: "bg-orange-400/20" },
  { role: "Area Manager", pin: "5555", icon: Users, color: "text-pink-400", bgColor: "bg-pink-400/20" },
  { role: "Developer", pin: "0424", icon: Code, color: "text-purple-400", bgColor: "bg-purple-400/20" },
];

interface PinReferenceAccordionProps {
  className?: string;
}

export function PinReferenceAccordion({ className }: PinReferenceAccordionProps) {
  return (
    <GlassCard className={`p-4 ${cardBackgroundStyles.purple} ${className || ""}`} glow="purple" hoverEffect="subtle">
      <div className="flex items-center gap-2 mb-3">
        <motion.div 
          className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.purple} ${iconContainerStyles.base}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={springTransition}
        >
          <Key className="w-4 h-4 text-purple-400" />
        </motion.div>
        <div>
          <h2 className="text-lg font-display font-bold">Default PINs</h2>
          <p className="text-xs text-muted-foreground">Quick reference</p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pins" className="border-none">
          <AccordionTrigger className="py-2 text-sm text-muted-foreground hover:no-underline" data-testid="accordion-pins-trigger">
            <span className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5" />
              View Role PINs
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-2">
              {PIN_ROLES.map((item) => (
                <div 
                  key={item.role}
                  className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5"
                  data-testid={`pin-reference-${item.role.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${item.bgColor} flex items-center justify-center`}>
                      <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                    </div>
                    <span className="text-sm font-medium">{item.role}</span>
                  </div>
                  <code className={`text-sm font-mono font-bold ${item.color}`}>{item.pin}</code>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </GlassCard>
  );
}
