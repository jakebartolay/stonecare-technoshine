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
    <section id="clients" className="py-16 bg-foreground overflow-hidden relative">
      <div className="absolute inset-0 tech-pattern opacity-[0.04]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <div className="flex items-center gap-2 text-white/50 font-mono text-xs uppercase tracking-[0.25em]">
            <Building2 className="w-4 h-4 text-primary" />
            Trusted by Philippine Hotels
          </div>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-foreground to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-foreground to-transparent pointer-events-none" />

        <motion.div
          className="flex w-max whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 80, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="flex shrink-0 items-center">
              {clients.map(({ name, icon }, index) => (
                <div
                  key={`${copyIndex}-${index}`}
                  className="inline-flex items-center gap-5 px-8 group cursor-default"
                >
                  <div className="w-28 h-16 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={`${base}${icon}`}
                      alt={name}
                      className="max-w-full max-h-full object-contain opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>

                  <span className="text-white/75 font-display uppercase tracking-widest text-sm group-hover:text-primary transition-colors duration-300">
                    {name}
                  </span>

                  <span className="text-primary/30 text-lg select-none ml-3">◆</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
