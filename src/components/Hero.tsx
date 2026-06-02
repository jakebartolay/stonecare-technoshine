import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero() {
  const scrollToContact = () => {
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
    <section className="relative flex min-h-screen items-center overflow-hidden border-b border-border bg-background px-4 pb-14 pt-28 text-foreground sm:px-6 lg:px-8">
      <div className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="order-2 overflow-hidden border border-border bg-card shadow-sm lg:order-1">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-marble-floor.png`}
            alt="Polished Marble Floor"
            className="h-[42vh] min-h-[320px] w-full object-cover object-bottom sm:h-[56vh] lg:h-[72vh]"
          />
        </div>

        <div className="order-1 flex flex-col items-start text-left lg:order-2">
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
          className="mb-6 text-5xl font-hero font-black leading-none tracking-normal text-foreground sm:text-7xl md:text-8xl lg:text-9xl"
        >
          TECHNO<span className="text-primary">SHINE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10 max-w-xl text-lg font-light leading-relaxed text-muted-foreground sm:text-xl"
        >
          Restoring marble, granite, and natural stone surfaces to their original brilliance with precision craftsmanship and decades of expertise.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
        >
          <button
            type="button"
            onClick={scrollToContact}
            className="group relative flex items-center justify-center gap-2 overflow-hidden border border-primary bg-primary px-8 py-4 font-display font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(255,107,0,0.2)] transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(255,107,0,0.35)]"
          >
            <span className="absolute inset-0 bg-foreground -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              Book a Free Assessment
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
          <button
            type="button"
            onClick={scrollToServices}
            className="border border-border bg-transparent px-8 py-4 font-display font-bold uppercase tracking-widest text-foreground transition-all duration-300 hover:border-primary hover:text-primary"
          >
            Our Services
          </button>
        </motion.div>
        </div>
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
