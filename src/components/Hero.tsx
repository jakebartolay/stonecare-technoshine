import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import {
  defaultHomepageHeroBackground,
  getContentSectionBody,
  homepageHeroBackgroundContentKey,
  usePublicContentSections,
} from "@/lib/admin-store";

const heroServices =
  "Tiles Cleaning | Marble Restoration | Granite Care | Terrazzo Polishing | Floor Maintenance";

function heroAssetPath(path: string) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function Hero() {
  const contentSections = usePublicContentSections();
  const heroBackgroundImage = getContentSectionBody(
    contentSections,
    homepageHeroBackgroundContentKey,
    defaultHomepageHeroBackground,
  );

  const scrollToServices = () => {
    const element = document.querySelector("#services-preview");
    if (!element) return;

    const section = element as HTMLElement;
    const rect = section.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const navbarHeight = document.querySelector("nav")?.getBoundingClientRect().height ?? 72;
    const top = Math.max(absoluteTop - navbarHeight, 0);

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[100svh] items-end justify-center overflow-hidden pb-24 pt-28 sm:pb-28 sm:pt-36 lg:pb-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/45" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/25 via-black/10 to-black/70" />
        <img
          src={heroAssetPath(heroBackgroundImage)}
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
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white sm:mb-4 sm:text-sm sm:tracking-[0.22em]">
              Premium Stone Care & Restoration
            </p>
            <h1
              className="hero-title-shadow whitespace-nowrap font-hero text-[clamp(2.15rem,10vw,3rem)] font-black leading-[0.9] tracking-normal text-white sm:text-7xl lg:text-8xl"
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
          className="mt-4 max-w-4xl text-left font-display text-sm font-medium leading-6 tracking-normal text-white sm:mt-6 sm:text-xl sm:leading-relaxed"
        >
          The{" "}
          <strong className="font-bold text-primary">First and Leading</strong>{" "}
          stone restoration expert in the Philippines. <br></br>Where innovation meets{" "}
          <strong className="font-bold text-primary">craftsmanship</strong>. We
          don't just clean —{" "}
          <strong className="font-bold text-primary">we restore prestige</strong>.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.82 }}
          className="mt-3 max-w-6xl text-left font-display text-[11px] font-medium leading-5 tracking-normal text-white sm:mt-4 sm:text-sm sm:leading-relaxed lg:whitespace-nowrap"
        >
          {heroServices}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3"
        >
          <Link
            href="/services"
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-primary bg-primary px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-foreground sm:min-h-11 sm:px-5 sm:py-3 sm:text-sm"
          >
            View Services
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center justify-center border border-white/45 bg-black/20 px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-white backdrop-blur transition-colors hover:border-primary hover:text-primary sm:min-h-11 sm:px-5 sm:py-3 sm:text-sm"
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
        className="absolute bottom-2 left-0 right-0 z-20 mx-auto flex w-fit animate-bounce items-center justify-center text-primary/70 transition-colors hover:text-primary sm:bottom-8"
      >
        <ChevronDown className="h-8 w-8 sm:h-10 sm:w-10" />
      </motion.button>
    </section>
  );
}
