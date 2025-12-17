import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import { useTenant } from "@/context/TenantContext";
import { Award, Star, CheckCircle, Calendar, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import nppEmblem from "@assets/npp_emblem_full.png";
import awardImage from "@assets/Screenshot_20251216_195245_Replit_1765936399782.jpg";

export default function Awards() {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 md:pt-20 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto px-4 py-8"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src={nppEmblem} 
                alt="Nashville Painting Professionals" 
                className="h-24 md:h-32 w-auto"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full mb-4">
              <Award className="w-5 h-5 text-accent" />
              <span className="text-accent font-medium text-sm">Recognition</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Nashville Painting Professionals Recognized as Best Painter in Nashville
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Looking Ahead to 2026 and Beyond
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>December 16th, 2025</span>
            </div>
            <span className="text-accent">|</span>
            <span>3 min read</span>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-10">
            <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-accent/20">
              <div className="flex justify-center">
                <img 
                  src={awardImage} 
                  alt="Best of BusinessRate 2025 Award - Nashville Painting Professionals" 
                  className="max-w-full md:max-w-md rounded-lg shadow-lg border border-accent/30"
                />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Best of BusinessRate 2025 Award - Painter Category
              </p>
            </Card>
          </motion.div>

          <motion.article variants={itemVariants} className="prose prose-invert max-w-none space-y-6">
            <p className="text-lg text-foreground leading-relaxed">
              At <strong>Nashville Painting Professionals</strong>, we're honored to have been recognized as the <strong>Best Painter in Nashville for 2025</strong> by BusinessRate. This recognition is based entirely on <strong>verified Google Reviews</strong>, reflecting real experiences from homeowners and businesses across the Nashville area.
            </p>

            <p className="text-foreground leading-relaxed">
              While we're proud of this milestone, our focus is firmly on the future — <strong>raising the standard for professional painting services in Nashville in 2026 and beyond</strong>.
            </p>

            <div className="my-8 p-6 bg-accent/10 rounded-xl border border-accent/20">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-accent" />
                What Makes This "Best Painter in Nashville" Award Meaningful
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                Unlike awards that rely on nominations or paid placements, the BusinessRate Best of 2025 Award is earned through:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Consistent 5-star Google reviews</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Verified customer feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Overall service quality and reputation</span>
                </li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                This means our ranking as one of the <strong>top painting companies in Nashville</strong> comes directly from the people we serve — not marketing claims, but proven results.
              </p>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4">
              A Nashville Painting Company Built on Trust and Results
            </h2>
            <p className="text-foreground leading-relaxed">
              As a locally owned and operated painting company, our reputation matters. Every residential and commercial painting project is completed with a focus on:
            </p>
            <ul className="space-y-3 my-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Clear communication and honest pricing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Reliable scheduling and professional crews</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Clean job sites and attention to detail</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">High-quality finishes that last</span>
              </li>
            </ul>
            <p className="text-foreground leading-relaxed">
              Whether it's interior painting, exterior painting, or commercial projects, we approach every job with the same standards that earned us recognition as one of the <strong>best painters in Nashville</strong>.
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4">
              Why Google Reviews Matter When Choosing a Painter in Nashville
            </h2>
            <p className="text-foreground leading-relaxed">
              When searching for a <strong>professional painter in Nashville</strong>, reviews are often the deciding factor. They provide insight into:
            </p>
            <ul className="space-y-3 my-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Reliability and professionalism</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Workmanship quality</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Customer experience from start to finish</span>
              </li>
            </ul>
            <p className="text-foreground leading-relaxed">
              We're grateful to every client who took the time to leave a review. Your feedback not only helps others find a painting contractor they can trust — it helps us continually improve.
            </p>

            <div className="my-8 p-6 bg-accent/10 rounded-xl border border-accent/20">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                Looking Ahead to 2026 and Beyond
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                Being named Best Painter in Nashville for 2025 is not a finish line — it's a benchmark. As we move into <strong>2026 and beyond</strong>, Nashville Painting Professionals is committed to:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Investing in our team and training</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Improving systems and project management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Delivering consistent, high-quality painting services</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Continuing to earn 5-star reviews from satisfied clients</span>
                </li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                Our goal is simple: to remain one of the <strong>most trusted painting companies in Nashville</strong> year after year.
              </p>
            </div>

            <div className="mt-10 p-6 bg-card rounded-xl border border-accent/20 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                Schedule a Free Painting Estimate in Nashville
              </h2>
              <p className="text-foreground leading-relaxed mb-6">
                If you're planning a painting project and searching for a reliable <strong>Nashville painting professional</strong>, we'd be honored to earn your business. Contact us today to request a free estimate and experience why so many customers consider us one of the best painters in the area.
              </p>
              <a 
                href="/estimate" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Get Your Free Estimate
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.article>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
