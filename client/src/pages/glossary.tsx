import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, BookOpen, Paintbrush, Home, Hammer } from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: "painting" | "trim" | "finish" | "technique";
}

const glossaryTerms: GlossaryTerm[] = [
  { term: "Adhesion", definition: "How well dried paint stays attached to the surface without cracking or peeling.", category: "painting" },
  { term: "Apron", definition: "Horizontal trim applied below a window stool to conceal the joint between the window frame and wall.", category: "trim" },
  { term: "Architrave", definition: "Another term for casing moulding used around doors and windows.", category: "trim" },
  { term: "Back Band", definition: "Narrow, rabbeted moulding applied to the outer edge of door/window casing or baseboard to create a heavier, more decorative look.", category: "trim" },
  { term: "Band Moulding", definition: "Flat decorative strip used to trim mantels or cabinets.", category: "trim" },
  { term: "Base Cap", definition: "Decorative moulding installed flush against the wall on top of baseboard.", category: "trim" },
  { term: "Baseboard", definition: "Protective and decorative trim at the bottom edge of a wall (also called wall base).", category: "trim" },
  { term: "Base Shoe", definition: "Narrow quarter-round moulding forming the transition between finished floors and baseboards.", category: "trim" },
  { term: "Bead Moulding", definition: "Plain or sprung moulding applied where two surfaces meet at an angle.", category: "trim" },
  { term: "Beadboard", definition: "Type of wainscoting with vertical boards separated by ridges (beads).", category: "trim" },
  { term: "Bed Mould", definition: "Similar to crown moulding but smaller in size.", category: "trim" },
  { term: "Bleeding", definition: "When stains or colors from the underlying surface come through a newly painted surface.", category: "painting" },
  { term: "Blistering", definition: "Bubbles under the surface of a paint coat.", category: "painting" },
  { term: "Blending", definition: "Merging two colors so the difference is indiscernible (also called feathering).", category: "technique" },
  { term: "Breathable", definition: "Paint that allows moisture from the surface to pass through.", category: "painting" },
  { term: "Brick Moulding", definition: "Exterior casing for doors and windows that's thick enough for siding to butt against.", category: "trim" },
  { term: "Brittleness", definition: "Dry paint coat lacking in flexibility.", category: "painting" },
  { term: "Brushability", definition: "Ease of applying paint with a paintbrush (also called consistency).", category: "painting" },
  { term: "Build", definition: "Thickness or depth of a paint film.", category: "painting" },
  { term: "Burnishing", definition: "Shiny spots on painted surfaces from excessive scrubbing.", category: "painting" },
  { term: "Cap Moulding", definition: "Moulding used to cap something off (e.g., wainscoting cap).", category: "trim" },
  { term: "Cap Rail", definition: "Used to finish the transition between flat chair rail or wainscot and the wall.", category: "trim" },
  { term: "Capital", definition: "The head or crown of a column, pilaster or pier.", category: "trim" },
  { term: "Cased Opening", definition: "Interior opening without a door but finished with jambs and trim.", category: "trim" },
  { term: "Casing", definition: "Trim used around door and window openings to cover gaps between frame and drywall.", category: "trim" },
  { term: "Caulk", definition: "Flexible sealant used to fill gaps and cracks around trim and baseboards.", category: "technique" },
  { term: "Chair Rail", definition: "Horizontal moulding installed approximately 32-36 inches above the floor, originally to prevent chairs from damaging walls.", category: "trim" },
  { term: "Checking", definition: "Small cracks marring the paint surface (also called crow's feet or crazing).", category: "painting" },
  { term: "Cissing", definition: "Retraction of paint into indents caused by surface contamination.", category: "painting" },
  { term: "Coat", definition: "A single application of paint.", category: "painting" },
  { term: "Color Match", definition: "Two colors with no visible difference.", category: "painting" },
  { term: "Color Swatch", definition: "Sample of paint showing the finished color.", category: "painting" },
  { term: "Colorant", definition: "Pigment used to create the color in paint.", category: "painting" },
  { term: "Column", definition: "Vertical circular structure composed of a base, shaft and capital.", category: "trim" },
  { term: "Consistency", definition: "The thickness or viscosity of paint.", category: "painting" },
  { term: "Cope", definition: "Cut or shape the end of moulding so it overlaps the outline of the piece against which it's placed.", category: "technique" },
  { term: "Corner Blocks", definition: "Square blocks used instead of mitering side and head casings.", category: "trim" },
  { term: "Corner Guards", definition: "Trim protecting outside edges of walls from damage.", category: "trim" },
  { term: "Cornice", definition: "Moulding covering the intersection of walls and ceiling (also crown moulding).", category: "trim" },
  { term: "Coverage", definition: "How well paint spreads over the surface.", category: "painting" },
  { term: "Cove Moulding", definition: "Moulding with concave profile used to soften transitions between planes at right angles.", category: "trim" },
  { term: "Covering Power", definition: "Ability of paint to hide the previous coat.", category: "painting" },
  { term: "Cracking", definition: "When wide crossing cracks form in paint layers.", category: "painting" },
  { term: "Crazing", definition: "Fine cracks in paint surface.", category: "painting" },
  { term: "Crown Moulding", definition: "Decorative moulding that gracefully flares at the top edge where wall meets ceiling.", category: "trim" },
  { term: "Curing", definition: "Process of paint drying.", category: "painting" },
  { term: "Cut In", definition: "Technique of painting edges and corners with a brush before rolling the main surface.", category: "technique" },
  { term: "Dado Rail", definition: "Another term for chair rail.", category: "trim" },
  { term: "Deglossing", definition: "Process of reducing surface shine to improve paint adhesion.", category: "technique" },
  { term: "Dentil Block", definition: "Small rectangular blocks spaced closely together in cornices and mantels.", category: "trim" },
  { term: "Door Casing", definition: "Trim surrounding a door opening.", category: "trim" },
  { term: "Door Stop", definition: "Moulding applied to door jambs to prevent door from swinging through.", category: "trim" },
  { term: "Eggshell Finish", definition: "Paint finish with slight sheen resembling an eggshell surface.", category: "finish" },
  { term: "Emulsion Paint", definition: "Water-based paint commonly used for walls and ceilings.", category: "painting" },
  { term: "Enamel", definition: "Paint producing a smooth, glossy, and hard finish (great for trim, windows, doors).", category: "finish" },
  { term: "Fading", definition: "When paint loses quality and color due to sun exposure.", category: "painting" },
  { term: "Feathering", definition: "Blending colors so differences are indiscernible.", category: "technique" },
  { term: "Finishing", definition: "Application of coating to complete decoration and provide protection.", category: "technique" },
  { term: "Flaking", definition: "When paint peels off after blistering or cracking.", category: "painting" },
  { term: "Flat Paint", definition: "Paint with very little or no shine.", category: "finish" },
  { term: "Fluted Moulding", definition: "Wide symmetrical casing with vertical flutes cut into it (also pilaster).", category: "trim" },
  { term: "Gloss", definition: "The level of shine or sheen in paint finish.", category: "finish" },
  { term: "Gloss Finish", definition: "High-shine paint finish ideal for high-wear areas.", category: "finish" },
  { term: "Half Round", definition: "Moulding with 180-degree half-circle profile.", category: "trim" },
  { term: "Hand Railing", definition: "Safety rail for support in stairwells.", category: "trim" },
  { term: "Head Casing", definition: "Horizontal casing at the top of door or window.", category: "trim" },
  { term: "Header Cap Moulding", definition: "Cap applied to top portion of door trim for neo-classic look.", category: "trim" },
  { term: "Hiding Power", definition: "Paint's ability to cover underlying surface.", category: "painting" },
  { term: "Hue", definition: "Another term for color.", category: "painting" },
  { term: "Interior Paint", definition: "Paint specifically formulated for indoor use with low VOCs.", category: "painting" },
  { term: "Jamb", definition: "Vertical members forming sides of door or window frame.", category: "trim" },
  { term: "Lattice", definition: "Thin strips of woven wood or PVC, surfaced on four sides.", category: "trim" },
  { term: "Lintel", definition: "Horizontal beam above a door or window.", category: "trim" },
  { term: "LRV (Light Reflectance Value)", definition: "Measures the percentage of light a paint color reflects. Higher LRV = lighter color.", category: "painting" },
  { term: "Matte Finish", definition: "Paint finish with smooth texture and low gloss (also flat finish).", category: "finish" },
  { term: "Millwork", definition: "General term for manufactured wooden trim and moulding.", category: "trim" },
  { term: "Miter", definition: "Angled cut (usually 45 degrees) where two pieces of trim meet at a corner.", category: "technique" },
  { term: "Moulding", definition: "Decorative trim elements (also spelled molding).", category: "trim" },
  { term: "Mullion", definition: "Vertical member between openings in a multiple-opening window or door frame.", category: "trim" },
  { term: "Opacity", definition: "The degree to which paint covers a surface.", category: "painting" },
  { term: "Orange Peel", definition: "Texture defect resembling orange peel from improper application.", category: "painting" },
  { term: "Panel Moulding", definition: "Moulding used to frame wall paneling or wainscoting.", category: "trim" },
  { term: "Picture Frame Moulding", definition: "Decorative trim installed like a picture frame on the wall.", category: "trim" },
  { term: "Picture Rail", definition: "Trim placed high on wall (7-9 feet) used to hang artwork.", category: "trim" },
  { term: "Pilaster", definition: "Fluted decorative column attached to wall.", category: "trim" },
  { term: "Plinth Block", definition: "Decorative block at base of door casing where it meets baseboard.", category: "trim" },
  { term: "Primer", definition: "Paint applied before topcoat to improve adhesion and hide imperfections.", category: "painting" },
  { term: "Quarter Round", definition: "Moulding with profile of a quarter circle, used as base shoe.", category: "trim" },
  { term: "Rabbet", definition: "Groove cut on edge of wood to fit another piece.", category: "trim" },
  { term: "Rail", definition: "Horizontal member of door or window opening.", category: "trim" },
  { term: "Raised Panel", definition: "Type of wainscoting with panels that protrude from frame.", category: "trim" },
  { term: "Rosette", definition: "Decorative wooden panel used at intersections of trim.", category: "trim" },
  { term: "Sash", definition: "Framework holding window glass.", category: "trim" },
  { term: "Satin Finish", definition: "Paint finish with smooth texture and slight gloss.", category: "finish" },
  { term: "Scallop", definition: "Decorative element with series of curves.", category: "trim" },
  { term: "Scotia", definition: "Concave moulding (similar to cove).", category: "trim" },
  { term: "Sealer", definition: "Used on porous surfaces to prevent liquid penetration.", category: "painting" },
  { term: "Semi-Gloss", definition: "Paint finish with noticeable shine, more durable than satin.", category: "finish" },
  { term: "Shade", definition: "Mixture of black with a color to increase darkness.", category: "painting" },
  { term: "Sheen", definition: "Level of glossiness in paint finish.", category: "finish" },
  { term: "Shoe Moulding", definition: "Trim at junction of baseboard and floor (also base shoe).", category: "trim" },
  { term: "Skirting Board", definition: "British term for baseboard.", category: "trim" },
  { term: "Stool Moulding", definition: "Interior trim serving as window sill cap.", category: "trim" },
  { term: "Stop Moulding", definition: "Moulding that holds window sash in place or prevents door from swinging through frame.", category: "trim" },
  { term: "Tint", definition: "Adding white to a color to lighten it.", category: "painting" },
  { term: "Tongue and Groove", definition: "Lumber with groove on one side and tongue on other for snug fitting.", category: "trim" },
  { term: "Topcoat", definition: "Final coat of paint applied to a surface.", category: "painting" },
  { term: "Trim", definition: "Decorative moulding and edging around windows, doors, baseboards, and architectural features.", category: "trim" },
  { term: "Trim Brush", definition: "Narrow brush (1-2.5 inches) used for precision work on trim.", category: "technique" },
  { term: "Undertone", definition: "The subtle underlying color in a paint that becomes visible under different lighting conditions.", category: "painting" },
  { term: "Varnish", definition: "Clear or colored film coating applied over paint to protect and enhance finish.", category: "finish" },
  { term: "VOC", definition: "Volatile Organic Compounds; regulated paint component that affects air quality.", category: "painting" },
  { term: "Wainscot/Wainscoting", definition: "Lower interior wall surface (typically 3-4 feet high) that contrasts with upper wall, often with chair rail on top.", category: "trim" },
  { term: "Wainscot Cap", definition: "Finishing piece for top of wainscoting.", category: "trim" },
  { term: "Wall Base", definition: "Another term for baseboard.", category: "trim" },
  { term: "Window Casing", definition: "Trim surrounding a window opening.", category: "trim" },
  { term: "Window Sill", definition: "Horizontal shelf at bottom of window.", category: "trim" },
  { term: "Window Stool", definition: "Interior window sill that projects beyond casing.", category: "trim" },
  { term: "Window Trim", definition: "Mouldings needed to complete a window frame.", category: "trim" },
  { term: "Wood Filler", definition: "Putty used to fill gaps, cracks, and holes in wood before painting.", category: "technique" },
];

const categories = [
  { id: "all", name: "All Terms", icon: BookOpen },
  { id: "painting", name: "Painting", icon: Paintbrush },
  { id: "trim", name: "Trim & Moulding", icon: Home },
  { id: "finish", name: "Finishes", icon: Paintbrush },
  { id: "technique", name: "Techniques", icon: Hammer },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
    const matchesLetter = !selectedLetter || term.term.toUpperCase().startsWith(selectedLetter);
    return matchesSearch && matchesCategory && matchesLetter;
  });

  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {} as Record<string, GlossaryTerm[]>);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "painting": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "trim": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "finish": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "technique": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <PageLayout>
      <main className="pt-20 px-4 md:px-8 pb-24 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <BookOpen className="w-8 h-8 text-accent" />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold">Painting Glossary</h1>
                <p className="text-muted-foreground">A-Z guide to painting and interior trim terms</p>
              </div>
            </div>
          </motion.div>

          <GlassCard className="p-4 mb-6" glow="accent">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-glossary"
              />
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(cat.id)}
                  data-testid={`badge-category-${cat.id}`}
                >
                  <cat.icon className="w-3 h-3 mr-1" />
                  {cat.name}
                </Badge>
              ))}
            </div>

            <div className="flex gap-1 flex-wrap">
              <Badge
                variant={selectedLetter === null ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedLetter(null)}
              >
                All
              </Badge>
              {alphabet.map((letter) => (
                <Badge
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "outline"}
                  className="cursor-pointer text-xs w-7 justify-center"
                  onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                  data-testid={`badge-letter-${letter}`}
                >
                  {letter}
                </Badge>
              ))}
            </div>
          </GlassCard>

          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredTerms.length} of {glossaryTerms.length} terms
          </p>

          <div className="space-y-8">
            {Object.keys(groupedTerms).sort().map((letter) => (
              <motion.div
                key={letter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent">{letter}</span>
                  </div>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="space-y-3">
                  {groupedTerms[letter].map((term) => (
                    <GlassCard 
                      key={term.term} 
                      className="p-4"
                      data-testid={`card-term-${term.term.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-foreground">{term.term}</h3>
                          <p className="text-muted-foreground mt-1">{term.definition}</p>
                        </div>
                        <Badge className={getCategoryColor(term.category)}>
                          {term.category}
                        </Badge>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No terms found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
