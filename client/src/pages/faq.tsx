import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";
import { 
  HelpCircle, ChevronDown, ArrowRight, 
  DollarSign, Clock, Brush, Shield, Calendar, Users
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
  category: string;
}

export default function FAQ() {
  const tenant = useTenant();
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqs: FAQItem[] = [
    {
      question: "How do I get a painting estimate?",
      answer: `Getting an estimate is easy! You can use our online estimator tool to get an instant quote, or contact us to schedule an in-person consultation. Our estimates are always free and come with no obligation. We'll assess your space, discuss your vision, and provide a detailed breakdown of costs.`,
      icon: DollarSign,
      category: "Pricing",
    },
    {
      question: "How long does a typical painting project take?",
      answer: `Project timelines vary based on scope. A single room typically takes 1-2 days, while a full interior can take 3-7 days. Exterior projects usually require 2-5 days depending on the home's size and prep work needed. We'll provide a specific timeline during your estimate and keep you updated throughout the project.`,
      icon: Clock,
      category: "Timeline",
    },
    {
      question: "What type of paint do you use?",
      answer: `We use premium paints from trusted brands like Sherwin-Williams and Benjamin Moore. The specific product depends on the application - we choose paints based on durability, finish quality, and environmental factors. We're happy to discuss paint options and help you select the perfect product for your project.`,
      icon: Brush,
      category: "Materials",
    },
    {
      question: "Do you offer a warranty on your work?",
      answer: `Yes! We stand behind our work with a ${tenant.credentials.warrantyYears || 3}-year warranty on workmanship. If you notice any issues with our painting - peeling, bubbling, or color fading due to application - we'll make it right at no additional cost. This warranty covers labor and materials used in the repair.`,
      icon: Shield,
      category: "Warranty",
    },
    {
      question: "Are you licensed and insured?",
      answer: `Absolutely. We are fully licensed and carry comprehensive liability insurance and workers' compensation coverage. This protects both your property and our crew. We're happy to provide certificates of insurance upon request.`,
      icon: Shield,
      category: "Credentials",
    },
    {
      question: "Do I need to move my furniture?",
      answer: `We handle all the heavy lifting! Our crew will carefully move and cover your furniture before starting work. We use drop cloths and plastic sheeting to protect floors, fixtures, and belongings. When we're done, we return everything to its original position.`,
      icon: Users,
      category: "Preparation",
    },
    {
      question: "Can you help me choose paint colors?",
      answer: `Definitely! Color selection can be overwhelming, and we're here to help. We offer color consultations where we can recommend colors based on your style, lighting conditions, and existing decor. We also have access to large color samples so you can see how colors look in your actual space before committing.`,
      icon: Brush,
      category: "Colors",
    },
    {
      question: "What preparation work do you do?",
      answer: `Proper preparation is the foundation of a quality paint job. We fill nail holes and cracks, sand rough surfaces, prime as needed, caulk gaps and seams, and apply painter's tape for clean lines. For exteriors, we power wash, scrape loose paint, and address any wood rot or damage before painting.`,
      icon: Brush,
      category: "Preparation",
    },
    {
      question: "How do I schedule my project?",
      answer: `Contact us for an estimate, and once you approve the proposal, we'll work with you to find a convenient start date. We recommend booking 1-2 weeks in advance, though we can sometimes accommodate shorter timelines. During peak seasons (spring and summer), earlier booking is recommended.`,
      icon: Calendar,
      category: "Scheduling",
    },
    {
      question: "What forms of payment do you accept?",
      answer: `We accept all major credit cards, checks, and bank transfers. For larger projects, we typically require a deposit to secure your spot on our schedule, with the remaining balance due upon completion. We're happy to discuss payment arrangements for extensive projects.`,
      icon: DollarSign,
      category: "Payment",
    },
  ];

  return (
    <PageLayout>
      <main className="min-h-screen bg-background pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                <HelpCircle className="w-7 h-7 text-accent" />
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold mb-3" data-testid="text-faq-title">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find answers to common questions about our painting services.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            {faqs.map((faq, index) => {
              const isOpen = openItems.has(index);
              const Icon = faq.icon;
              
              return (
                <GlassCard 
                  key={index} 
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen && "ring-1 ring-accent/30"
                  )}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-5 flex items-start gap-4 text-left"
                    data-testid={`button-faq-${index}`}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      isOpen ? "bg-accent/20" : "bg-muted"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5 transition-colors",
                        isOpen ? "text-accent" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground pr-8">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0",
                      isOpen && "rotate-180"
                    )} />
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pl-[4.5rem]">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </GlassCard>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <GlassCard className="p-8 text-center" glow="accent">
              <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Can't find the answer you're looking for? Our team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="outline" data-testid="button-contact-us">
                    Contact Us
                  </Button>
                </Link>
                {tenant.features.estimator && (
                  <Link href="/estimate">
                    <Button data-testid="button-get-estimate">
                      Get a Free Estimate
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </PageLayout>
  );
}
