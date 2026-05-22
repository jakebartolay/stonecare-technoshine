import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const clients = [
  { name: "Shangri-La Manila", icon: "images/client-logo/hotel-icon-1.png" },
  { name: "Marco Polo Hotels", icon: "images/client-logo/hotel-icon-2.png" },
  { name: "Okura Hotels & Resorts", icon: "images/client-logo/hotel-icon-3.png" },
  { name: "Okada Manila", icon: "images/client-logo/hotel-icon-4.png" },
  { name: "Solaire Resort & Casino", icon: "images/client-logo/hotel-icon-5.png" },
  { name: "Waterfront Hotels & Casinos", icon: "images/client-logo/hotel-icon-6.png" },
  { name: "Nustar SkyDeck", icon: "images/client-logo/hotel-icon-7.png" },
  { name: "Marriott Hotels & Resorts", icon: "images/client-logo/hotel-icon-8.png" },
  { name: "Waterfront Hotels & Casinos | Cebu", icon: "images/client-logo/hotel-icon-9.png" },
  { name: "The Manila Hotel", icon: "images/client-logo/hotel-icon-10.png" },
  { name: "City of Dreams Manila", icon: "images/client-logo/hotel-icon-11.png" },
  { name: "Mactan Cebu International Airport", icon: "images/client-logo/hotel-icon-12.png" },
];

export function Clients() {
  const base = import.meta.env.BASE_URL;

  return (
    <section id="clients" className="relative z-20 -mt-8 bg-foreground py-6 overflow-hidden md:py-8">
      <div className="absolute inset-0 tech-pattern opacity-[0.04]" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 md:mb-6 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <div className="hidden h-px flex-1 bg-white/10 sm:block" />
          <div className="flex max-w-[260px] items-center justify-center gap-2 text-center text-white/60 font-mono text-xs uppercase tracking-[0.18em] leading-relaxed sm:max-w-none sm:tracking-[0.25em]">
            <Building2 className="w-4 h-4 text-primary" />
            Trusted by Philippine Hotels
          </div>
          <div className="hidden h-px flex-1 bg-white/10 sm:block" />
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-foreground to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-foreground to-transparent pointer-events-none" />

        <motion.div
          className="flex w-max whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 70, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex shrink-0 items-center">
              {clients.map(({ name, icon }, index) => (
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
