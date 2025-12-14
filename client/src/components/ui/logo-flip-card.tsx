import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./glass-card";

interface Publication {
  name: string;
  style: string;
}

const publications: Publication[] = [
  { name: "The Spruce", style: "font-serif italic text-emerald-600 dark:text-emerald-400" },
  { name: "Homes & Gardens", style: "font-serif tracking-wide text-rose-700 dark:text-rose-400" },
  { name: "Livingetc", style: "font-sans font-black uppercase tracking-tighter text-orange-600 dark:text-orange-400" },
  { name: "The Kitchn", style: "font-serif font-light text-amber-700 dark:text-amber-400" },
  { name: "Architectural Digest", style: "font-serif tracking-tight uppercase text-slate-700 dark:text-slate-300 text-sm md:text-lg lg:text-xl" },
];

export function LogoFlipCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % publications.length);
        setIsFlipping(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentPub = publications[currentIndex];

  return (
    <GlassCard className="h-full flex flex-col justify-center items-center p-4 md:p-6 bg-white/80 dark:bg-white/5 backdrop-blur-xl border-white/30 dark:border-white/10 overflow-hidden">
      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 md:mb-4">
        As Seen In
      </span>
      
      <div className="relative w-full h-12 md:h-16 flex items-center justify-center perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center backface-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className={`text-lg md:text-2xl lg:text-3xl ${currentPub.style}`}>
              {currentPub.name}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5 mt-3 md:mt-4">
        {publications.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? "bg-accent scale-125" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            data-testid={`button-publication-dot-${idx}`}
          />
        ))}
      </div>
    </GlassCard>
  );
}
