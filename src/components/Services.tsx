import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Layers, Wrench, ShieldCheck, X } from "lucide-react";

const services = [
  {
    icon: Gem,
    title: "Marble Polishing",
    description:
      "Diamond-grade polishing that revives dull, scratched marble to a mirror-finish brilliance.",
    details:
      "We refine the surface in stages to restore reflection, remove dullness, and bring back the depth and clarity natural stone is known for.",
    category: "Polishing",
    image: "/images/client-images/gallery-1.jpg",
  },
  {
    icon: Wrench,
    title: "Crack & Chip Repair",
    description:
      "Expert structural repair of cracks, chips, and fractures using colour-matched stone epoxies.",
    details:
      "Our repair process is designed to blend with the original stone while improving structural stability and preserving the visual finish.",
    category: "Repair",
    image: "/images/client-images/gallery-8.png",
  },
  {
    icon: Layers,
    title: "Stone Restoration",
    description:
      "Full-cycle restoration for marble, granite, travertine, and limestone surfaces.",
    details:
      "From honing rough surfaces to correcting wear patterns and re-levelling problem areas, we restore stone to a cleaner, more refined condition.",
    category: "Restoration",
    image: "/images/client-images/gallery-3.jpg",
  },
  {
    icon: ShieldCheck,
    title: "Sealing & Protection",
    description:
      "Premium penetrating sealers that guard against staining, etching, and moisture ingress.",
    details:
      "This treatment helps preserve the stone after restoration and reduces the impact of daily wear, spills, and environmental exposure.",
    category: "Protection",
    image: "/images/client-images/gallery-7.png",
  },
];

export function Services() {
  const [activeService, setActiveService] = useState<(typeof services)[number] | null>(
    null,
  );

  useEffect(() => {
    if (!activeService) {
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
        setActiveService(null);
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
  }, [activeService]);

  return (
    <section
      id="services"
      className="relative flex min-h-screen items-center bg-background py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="services-heading" className="mx-auto mb-14 max-w-3xl text-center" data-aos="fade-up">
          <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">
            What We Do
          </h2>
          <h3 className="text-3xl md:text-5xl font-display text-foreground">
            OUR SERVICES
          </h3>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div className="overflow-hidden border border-border bg-card" data-aos="fade-right">
            <img
              src={`${import.meta.env.BASE_URL}images/client-images/gallery-1.jpg`}
              alt="Marble Polishing"
              className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[620px]"
            />
          </div>

          <div className="space-y-4" data-aos="fade-left" data-aos-delay="120">
          {services.map((service, index) => (
            <button
              key={service.title}
              type="button"
              data-aos="zoom-in-up"
              data-aos-delay={index * 80}
              onClick={() => setActiveService(service)}
              className="group relative grid w-full cursor-pointer grid-cols-[3.75rem_1fr] gap-5 bg-background py-4 text-left transition-colors duration-300 hover:bg-primary/5 sm:grid-cols-[4.5rem_1fr]"
            >
              <div className="flex h-14 w-14 items-center justify-center border border-border bg-card transition-colors group-hover:border-primary group-hover:bg-primary/10">
                <service.icon className="w-6 h-6 text-primary" />
              </div>

              <div className="min-w-0">
              <h4 className="text-xl font-display text-foreground mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h4>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>

              <div className="mt-6 flex items-center text-xs font-mono text-primary/60 group-hover:text-primary transition-colors">
                <span className="mr-2">&gt;</span> Learn More
              </div>
              </div>
            </button>
          ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-primary transition-colors"
                aria-label="Close service details"
              >
                <X className="w-7 h-7" />
              </button>

              <div className="border border-primary/30">
                <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-black p-5 border-t border-primary/20">
                  <span className="text-[10px] font-mono text-primary uppercase tracking-widest">
                    {activeService.category}
                  </span>
                  <h4 className="font-display text-white text-xl mt-1 mb-1">
                    {activeService.title}
                  </h4>
                  <p className="text-white/60 text-sm">{activeService.details}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
