import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";

const heroServices =
  "Marble Restoration | Granite Care | Terrazzo Polishing | Sealing & Protection | Floor Maintenance";

export function Hero() {
  const scrollToServices = () => {
    const element = document.querySelector("#services-preview");
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
    <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden pb-48 pt-32 sm:pb-28 sm:pt-36 lg:pb-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/45" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/25 via-black/10 to-black/70" />
        <img
          src={`${import.meta.env.BASE_URL}images/hero-marble-floor-stair.jpg`}
          alt="Polished marble floor"
          className="h-full w-full scale-[1.02] object-cover object-bottom opacity-85"
        />
        <div className="absolute inset-0 z-10 tech-pattern opacity-10" />
      </div>

      <div className="hero-copy-shadow relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-5xl"
        >
          <div className="text-left">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-white sm:text-sm">
              Premium Stone Care & Restoration
            </p>
            <h1
              className="hero-title-shadow whitespace-nowrap font-hero text-[clamp(2.45rem,11vw,3.4rem)] font-black leading-[0.9] tracking-normal text-white sm:text-7xl lg:text-8xl"
              aria-label="Technoshine"
            >
              <span>TECHNO</span>
              <span>SHINE</span>
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 max-w-6xl text-left font-display text-sm font-medium leading-relaxed tracking-normal text-white sm:text-base lg:whitespace-nowrap"
        >
          {heroServices}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-foreground"
          >
            View Services
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center border border-white/45 bg-black/20 px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white backdrop-blur transition-colors hover:border-primary hover:text-primary"
          >
            Request Quote
          </Link>
        </motion.div>
      </div>

      <motion.button
        type="button"
        aria-label="Scroll to services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={scrollToServices}
        className="absolute bottom-5 left-0 right-0 z-20 mx-auto flex w-fit animate-bounce items-center justify-center text-primary/70 transition-colors hover:text-primary sm:bottom-8"
      >
        <ChevronDown className="h-10 w-10" />
      </motion.button>
    </section>
  );
}
