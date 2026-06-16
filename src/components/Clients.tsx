import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { clientItems } from "@/lib/site-content";

export function Clients() {
  const base = import.meta.env.BASE_URL;

  return (
    <section id="clients" className="relative z-20 overflow-hidden bg-foreground py-6 md:py-8">
      <div className="absolute inset-0 tech-pattern opacity-[0.04]" />
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 md:mb-6 relative z-10"
        data-aos="fade-in"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="flex max-w-[260px] items-center justify-center gap-2 text-center text-white/60 font-mono text-xs uppercase tracking-[0.18em] leading-relaxed sm:max-w-none sm:tracking-[0.25em]">
            <Building2 className="w-4 h-4 text-primary" />
            Trusted by Philippine Hotels
          </div>
        </div>
      </div>

      <div className="relative w-full" data-aos="fade-in" data-aos-delay="120">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-foreground to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-foreground to-transparent pointer-events-none" />

        <motion.div
          className="flex w-max whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 70, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex shrink-0 items-center">
              {clientItems.map(({ name, icon }, index) => (
                <div
                  key={`${copyIndex}-${index}`}
                  className="inline-flex items-center gap-3 px-5 group cursor-default md:gap-5 md:px-8"
                >
                  <div className="w-20 h-10 shrink-0 overflow-hidden flex items-center justify-center md:w-24 md:h-12">
                    <img
                      src={`${base}${icon}`}
                      alt={name}
                      className="max-w-full max-h-full object-contain opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>

                  <span className="hidden text-white/75 font-display uppercase tracking-widest text-sm group-hover:text-primary transition-colors duration-300 sm:inline">
                    {name}
                  </span>

                  <span className="text-primary/30 text-lg select-none ml-3">/</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
