import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const openFreeQuote = () => {
    window.dispatchEvent(new Event("open-free-quote"));
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    const element = document.querySelector("#services-heading");
    if (!element) return;

    const section = element as HTMLElement;
    const rect = section.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const top = Math.max(
      absoluteTop - window.innerHeight / 2 + rect.height / 2,
      0,
    );

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image & Overlay — keep dark so hero text is readable */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/55 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black z-10" />
        <img
          src={`${import.meta.env.BASE_URL}images/hero-marble-floor.png`}
          alt="Polished Marble Floor"
          className="w-full h-full object-cover object-bottom opacity-80"
        />
        <div className="absolute inset-0 tech-pattern opacity-10 z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-primary/50 bg-primary/10 text-primary text-xs font-mono mb-6 uppercase tracking-widest"
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Premium Stone Restoration Specialists
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-hero font-black text-white leading-none tracking-tighter mb-6 glow-text"
        >
          TECHNO<span className="text-primary">SHINE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl text-lg sm:text-xl text-white/80 font-light mb-10"
        >
          Restoring marble, granite, and natural stone surfaces to their original brilliance — with precision craftsmanship and decades of expertise.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            type="button"
            onClick={openFreeQuote}
            className="relative overflow-hidden px-8 py-4 font-display font-bold text-white bg-transparent border border-primary uppercase tracking-widest flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(255,107,0,0.2)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] transition-shadow duration-300"
          >
            <span className="absolute inset-0 bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              Book a Free Assessment
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>
          <button
            type="button"
            onClick={scrollToServices}
            className="px-8 py-4 font-display font-bold text-white bg-transparent border border-white/40 hover:border-white transition-all duration-300 uppercase tracking-widest"
          >
            Our Services
          </button>
        </motion.div>
      </div>

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={scrollToServices}
        className="absolute bottom-5 left-0 right-0 mx-auto flex w-fit items-center justify-center text-primary/70 hover:text-primary transition-colors z-20 animate-bounce sm:bottom-8"
      >
        <ChevronDown className="w-10 h-10" />
      </motion.button>
    </section>
  );
}
