import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "client-images/gallery-1.jpg",
    title: "Marble Floor",
    location: "Polished stone surface",
  },
  {
    src: "client-images/gallery-2.jpg",
    title: "Marble Floor",
    location: "Commercial hallway finish",
  },
  {
    src: "client-images/gallery-3.jpg",
    title: "Marble Floor",
    location: "Hotel lobby restoration",
  },
  {
    src: "client-images/gallery-9.jpg",
    title: "Marble Floor",
    location: "Interior floor care",
  },
  {
    src: "client-images/gallery-10.jpg",
    title: "Marble Floor",
    location: "Detail cleaning",
  },
  {
    src: "client-images/gallery-11.jpg",
    title: "Marble Floor",
    location: "Natural stone polishing",
  },
  {
    src: "client-images/gallery-12.jpg",
    title: "Marble Floor",
    location: "Premium floor finish",
  },
  {
    src: "client-images/gallery-13.jpg",
    title: "Marble Floor",
    location: "Restored stone shine",
  },
  {
    src: "client-images/gallery-14.jpg",
    title: "Marble Floor",
    location: "Surface refinishing",
  },
  {
    src: "client-images/gallery-15.jpg",
    title: "Marble Floor",
    location: "Protected polished floor",
  },
];

const slideDuration = 60000;

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const base = import.meta.env.BASE_URL;

  const activeSlide = slides[activeIndex];
  const activeImageSrc = useMemo(
    () => `${base}images/${activeSlide.src}`,
    [activeSlide.src, base],
  );

  const goToSlide = useCallback((nextIndex: number, nextDirection: number) => {
    setDirection(nextDirection);
    setActiveIndex((nextIndex + slides.length) % slides.length);
  }, []);

  const goPrevious = useCallback(() => goToSlide(activeIndex - 1, -1), [activeIndex, goToSlide]);
  const goNext = useCallback(() => goToSlide(activeIndex + 1, 1), [activeIndex, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goPrevious();
      }

      if (event.key === "ArrowRight") {
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, slideDuration);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      id="gallery"
      className="relative flex min-h-screen items-stretch overflow-hidden bg-black py-0"
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.img
          key={activeSlide.src}
          custom={direction}
          src={activeImageSrc}
          alt={activeSlide.location}
          initial={{ opacity: 0, scale: 1.04, x: direction * 36 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 1.02, x: direction * -36 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="gallery-bg absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="gallery-overlay absolute inset-0 bg-gradient-to-b from-black/40 via-black/12 to-black/62" />

      <div className="gallery-content relative z-10 min-h-screen w-full px-4 pb-12 pt-32 sm:px-6 sm:pb-16 sm:pt-36 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mx-auto max-w-4xl text-center text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)]"
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
            Technoshine Stone Care
          </p>
          <h3 className="mt-3 font-display text-4xl font-bold uppercase tracking-normal sm:text-5xl lg:text-6xl">
            {activeSlide.title}
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium uppercase tracking-[0.16em] text-white/85">
            {activeSlide.location}
          </p>
        </motion.div>

        <div className="absolute inset-x-4 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between sm:inset-x-6 lg:inset-x-10">
          <button
            type="button"
            onClick={goPrevious}
            className="flex h-11 w-11 items-center justify-center border border-white/35 bg-black/25 text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur transition-colors hover:border-primary hover:bg-primary sm:h-12 sm:w-12"
            aria-label="Previous marble floor image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="flex h-11 w-11 items-center justify-center border border-white/35 bg-black/25 text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur transition-colors hover:border-primary hover:bg-primary sm:h-12 sm:w-12"
            aria-label="Next marble floor image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
