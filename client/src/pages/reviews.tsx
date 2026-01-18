import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

export default function Reviews() {
  const tenant = useTenant();
  const cityName = tenant.address?.city || "Local";
  const areas = tenant.seo.serviceAreas;
  const googleRating = tenant.credentials?.googleRating || 4.9;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const reviews = [
    {
      author: "Sarah Jenkins",
      loc: areas[2] ? `${areas[2]}, ${tenant.address?.state || ""}` : cityName,
      rating: 5,
      text: "Absolutely transformed our home. The team was punctual, polite, and the lines are razor sharp. Worth every penny.",
      source: "Google"
    },
    {
      author: "Michael Ross",
      loc: areas[1] ? `${areas[1]}, ${tenant.address?.state || ""}` : "Nearby",
      rating: 5,
      text: "Best painting crew we've ever hired. They finished ahead of schedule and left the place cleaner than they found it.",
      source: "Houzz"
    },
    {
      author: "David Chen",
      loc: `${cityName}, ${tenant.address?.state || ""}`,
      rating: 5,
      text: "Professional from the first quote to the final walk-through. Highly recommend for any commercial work.",
      source: "Google"
    },
    {
      author: "Emily Watson",
      loc: areas[3] || cityName,
      rating: 5,
      text: "I was worried about the disruption, but they were ghost-like. Quiet, efficient, and respectful.",
      source: "Facebook"
    },
    {
      author: "James Miller",
      loc: areas[0] || cityName,
      rating: 5,
      text: "The color consultation was incredibly helpful. They really listened to what we wanted and delivered beyond expectations.",
      source: "Google"
    },
    {
      author: "Lisa Thompson",
      loc: areas[1] || cityName,
      rating: 5,
      text: "Third time using them. Consistent quality every single time. They're our go-to painters now.",
      source: "Yelp"
    }
  ];

  return (
    <PageLayout>
      <main className="pt-20 pb-16 px-3 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-2">Client Reviews</h1>
              <p className="text-sm md:text-lg text-muted-foreground">
                See what your neighbors are saying.
              </p>
            </div>
            <GlassCard className="p-3 flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold font-display">{googleRating}</p>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-accent text-accent" />)}
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <p className="text-xs text-muted-foreground">
                95+ Verified<br />Reviews
              </p>
            </GlassCard>
          </div>

          {/* Mobile: Carousel */}
          <div className="md:hidden mb-4">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-2">
                {reviews.map((review, index) => (
                  <div key={index} className="flex-[0_0_90%] min-w-0">
                    <GlassCard className="p-4 h-full">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">Via {review.source}</span>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed mb-3">
                        "{review.text}"
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center text-xs font-bold text-primary">
                          {review.author[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{review.author}</p>
                          <p className="text-xs text-muted-foreground">{review.loc}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              <button onClick={scrollPrev} className="p-2 rounded-full bg-muted" data-testid="button-reviews-prev">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={scrollNext} className="p-2 rounded-full bg-muted" data-testid="button-reviews-next">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden md:grid grid-cols-3 gap-4 mb-6">
            {reviews.map((review, index) => (
              <GlassCard key={index} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">Via {review.source}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center text-xs font-bold text-primary">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{review.loc}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* CTA */}
          <Link href="/estimate">
            <GlassCard className="p-5 bg-gradient-to-br from-accent/20 to-transparent">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">Ready to join our happy customers?</h3>
                  <p className="text-sm text-muted-foreground">Get your free estimate today.</p>
                </div>
                <Button className="w-full md:w-auto" data-testid="button-reviews-estimate">
                  Get Estimate <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </GlassCard>
          </Link>
        </div>
      </main>
    </PageLayout>
  );
}
