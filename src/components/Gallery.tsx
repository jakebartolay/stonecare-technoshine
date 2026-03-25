import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const items = [
  {
    src: "client-images/gallery-1.jpg",
    title: "Marble Floor",
    category: "Polishing",
    description: "Mirror-finish restoration of white Carrara marble with natural veining preserved.",
  },
  {
    src: "client-images/gallery-2.jpg",
    title: "Hallway Restoration",
    category: "Restoration",
    description: "Full travertine wall and floor restoration in a hallway environment.",
  },
  {
    src: "client-images/gallery-3.jpg",
    title: "Hotel Lobby",
    category: "Polishing",
    description: "Italian marble columns and grand lobby floor brought back to showroom condition.",
  },
  {
    src: "client-images/gallery-4.png",
    title: "Floor Transformation",
    category: "Repair",
    description: "Cracked, heavily etched stone surface restored to a flawless mirror polish.",
  },
  {
    src: "client-images/gallery-5.png",
    title: "Black Marble Countertop",
    category: "Sealing",
    description: "Deep black marble countertop sealed and polished to reveal gold veining.",
  },
  {
    src: "client-images/gallery-6.png",
    title: "Marble Staircase",
    category: "Restoration",
    description: "Antique marble staircase honed and re-polished to its original elegance.",
  },
];

const categories = ["All", "Polishing", "Restoration", "Repair", "Sealing"];

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<typeof items[0] | null>(null);

  useEffect(() => {
    if (!lightbox) {
      return;
    }

    const previousBodyStyle = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverscrollBehavior = document.documentElement.style.overscrollBehavior;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    const preventScroll = (event: Event) => {
      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
        return;
      }

      if (
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"].includes(
          event.key,
        )
      ) {
        event.preventDefault();
      }
    };

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overscrollBehavior = previousOverscrollBehavior;
      document.body.style.overflow = previousBodyStyle.overflow;
      document.body.style.paddingRight = previousBodyStyle.paddingRight;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [lightbox]);

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-background relative">
      <div className="absolute inset-0 tech-pattern opacity-[0.03]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">
            Our Work
          </h2>
          <h3 className="text-3xl md:text-5xl font-display text-foreground mb-4">
            PROJECT <span className="text-primary">GALLERY</span>
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            A selection of marble and natural stone restoration projects across residential, hospitality, and commercial spaces.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs font-mono uppercase tracking-widest border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,107,0,0.3)]"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group relative overflow-hidden border border-border hover:border-primary transition-colors duration-300 cursor-pointer"
                onClick={() => setLightbox(item)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${item.src}`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300 flex flex-col justify-end p-5">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1 block">
                      {item.category}
                    </span>
                    <h4 className="font-display text-white text-lg mb-1">{item.title}</h4>
                    <p className="text-white/70 text-xs leading-relaxed">{item.description}</p>
                  </div>
                  <ZoomIn className="absolute top-4 right-4 w-5 h-5 text-white/0 group-hover:text-white/80 transition-all duration-300" />
                </div>

                {/* Orange corner accent */}
                <div className="absolute top-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-primary transition-colors"
              >
                <X className="w-7 h-7" />
              </button>

              <div className="border border-primary/30">
                <div className="aspect-[4/3] max-h-[75vh] w-full bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${lightbox.src}`}
                    alt={lightbox.title}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="bg-black p-5 border-t border-primary/20">
                  <span className="text-[10px] font-mono text-primary uppercase tracking-widest">
                    {lightbox.category}
                  </span>
                  <h4 className="font-display text-white text-xl mt-1 mb-1">{lightbox.title}</h4>
                  <p className="text-white/60 text-sm">{lightbox.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
