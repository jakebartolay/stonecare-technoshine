import { useState } from "react";
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

  return (
    <section
      id="services"
      className="py-24 relative bg-card border-y border-border overflow-hidden"
    >
      <div className="absolute inset-0 tech-pattern opacity-[0.04]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="services-heading" className="text-center mb-16">
          <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">
            What We Do
          </h2>
          <h3 className="text-3xl md:text-5xl font-display text-foreground">
            OUR SERVICES
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.button
              key={service.title}
              type="button"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveService(service)}
              className="bg-background border border-border p-8 group hover:-translate-y-2 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] cursor-pointer relative overflow-hidden text-left"
            >
              <div className="w-14 h-14 bg-card border border-border flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>

              <h4 className="text-xl font-display text-foreground mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h4>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>

              <div className="mt-6 flex items-center text-xs font-mono text-primary/60 group-hover:text-primary transition-colors">
                <span className="mr-2">&gt;</span> Learn More
              </div>
            </motion.button>
          ))}
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
