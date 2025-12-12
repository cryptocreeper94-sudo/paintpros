import { Navbar } from "@/components/ui/navbar";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Star, Quote } from "lucide-react";

export default function Reviews() {
  const reviews = [
    {
      author: "Sarah Jenkins",
      loc: "Brentwood, TN",
      rating: 5,
      text: "Absolutely transformed our home. The team was punctual, polite, and the lines are razor sharp. Worth every penny. They even moved the heavy furniture for us.",
      source: "Google"
    },
    {
      author: "Michael Ross",
      loc: "Franklin, TN",
      rating: 5,
      text: "Best painting crew we've ever hired. They finished ahead of schedule and left the place cleaner than they found it. The attention to detail on the trim was exceptional.",
      source: "Houzz"
    },
    {
      author: "David Chen",
      loc: "Nashville, TN",
      rating: 5,
      text: "Professional from the first quote to the final walk-through. Highly recommend for any commercial work. They worked around our office schedule perfectly.",
      source: "Google"
    },
    {
      author: "Emily Watson",
      loc: "East Nashville",
      rating: 5,
      text: "I was worried about the disruption, but they were ghost-like. Quiet, efficient, and respectful. The color consultation was also a huge help.",
      source: "Facebook"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />
      <main className="pt-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">Client Reviews</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Don't just take our word for it. See what your neighbors are saying.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="text-right">
              <p className="text-3xl font-bold font-display">4.9</p>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <p className="text-sm text-muted-foreground font-medium">
              Based on 95+ <br />Verified Reviews
            </p>
          </div>
        </div>

        <BentoGrid>
          {reviews.map((review, index) => (
            <BentoItem key={index} colSpan={6} rowSpan={1}>
              <GlassCard className="p-8 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-white/10" />
                </div>
                
                <p className="text-lg text-foreground/90 leading-relaxed mb-6 flex-grow">
                  "{review.text}"
                </p>

                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center font-bold text-primary">
                      {review.author[0]}
                    </div>
                    <div>
                      <p className="font-bold">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.loc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/50">
                    Via {review.source}
                  </span>
                </div>
              </GlassCard>
            </BentoItem>
          ))}
        </BentoGrid>
      </main>
    </div>
  );
}
