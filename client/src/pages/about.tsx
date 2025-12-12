import { Navbar } from "@/components/ui/navbar";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Users, Award, Heart, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />
      <main className="pt-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">Our Story</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Founded on the principles of integrity, craftsmanship, and community.
          </p>
        </div>

        <BentoGrid>
          <BentoItem colSpan={8} rowSpan={2}>
            <GlassCard className="p-8 md:p-12">
              <h2 className="text-3xl font-display font-bold mb-6">More Than Just Painters</h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Nashville Painting Professionals started with a simple mission: to bring a level of professionalism to the trade that was sorely missing. We believe that inviting someone into your home is an act of trust.
                </p>
                <p>
                  Our team consists of full-time, vetted artisans—not subcontractors. We invest in their training, their tools, and their futures, which translates directly to the quality of work in your home.
                </p>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <GlassCard className="p-8 flex flex-col justify-center items-center text-center">
              <Users className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-4xl font-bold font-display mb-1">500+</h3>
              <p className="text-muted-foreground">Homes Transformed</p>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <GlassCard className="p-8 flex flex-col justify-center items-center text-center">
              <Award className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-4xl font-bold font-display mb-1">15+</h3>
              <p className="text-muted-foreground">Years Experience</p>
            </GlassCard>
          </BentoItem>
          
          <BentoItem colSpan={4} rowSpan={1}>
            <GlassCard className="p-8 bg-accent/10 border-accent/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent" /> Community First
              </h3>
              <p className="text-sm text-muted-foreground">
                We donate 5% of our profits to local Nashville housing initiatives every quarter.
              </p>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" /> 3-Year Warranty
              </h3>
              <p className="text-sm text-muted-foreground">
                We stand behind our work. Any peeling or blistering is covered, no questions asked.
              </p>
            </GlassCard>
          </BentoItem>
        </BentoGrid>
      </main>
    </div>
  );
}
