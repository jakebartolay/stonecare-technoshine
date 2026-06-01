import { Link } from "wouter";
import { Facebook, Instagram } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const services = [
  {
    title: "Marble Restoration",
    text: "Deep cleaning, honing, polishing, and sealing for marble surfaces.",
  },
  {
    title: "Granite Care",
    text: "Professional maintenance for granite floors, counters, and walls.",
  },
  {
    title: "Terrazzo Polishing",
    text: "Restoration and shine recovery for terrazzo surfaces.",
  },
  {
    title: "Floor Maintenance",
    text: "Routine stone care programs for commercial and residential spaces.",
  },
  {
    title: "Stone Protection",
    text: "Sealing and treatment solutions built for long-term durability.",
  },
];

const quickLinks = ["Home", "Services", "About Us", "Gallery", "Contact"];
const wordmarkLetters = "TECHNOSHINE".split("").map((letter, index) => ({
  letter,
  x: [-280, 190, -145, 250, -210, 110, -80, 230, -170, 130, -240][index],
  y: [-105, 82, 138, -92, 45, -135, 115, 58, -74, 126, -32][index],
  rotate: [-28, 22, -16, 31, -24, 18, -33, 26, -19, 21, -27][index],
  z: [-260, -210, -320, -240, -300, -190, -280, -230, -310, -220, -260][index],
}));
const letterShards = [
  { clip: "polygon(0 0, 100% 0, 76% 42%, 0 56%)", x: -18, y: -12, rotate: -14, tint: "white" },
  { clip: "polygon(0 48%, 78% 34%, 100% 100%, 12% 100%)", x: 16, y: 14, rotate: 12, tint: "orange" },
  { clip: "polygon(48% 0, 100% 0, 100% 54%, 70% 44%)", x: 12, y: -18, rotate: 20, tint: "orange" },
  { clip: "polygon(0 56%, 42% 43%, 28% 100%, 0 100%)", x: -15, y: 18, rotate: -22, tint: "white" },
];
const glassDebris = [
  { left: 9, top: 18, size: 24, x: -62, y: -34, rotate: -42, opacity: 0.62 },
  { left: 19, top: 78, size: 16, x: 52, y: 44, rotate: 34, opacity: 0.46 },
  { left: 34, top: 15, size: 22, x: -38, y: 58, rotate: 72, opacity: 0.54 },
  { left: 47, top: 82, size: 15, x: 32, y: -62, rotate: -28, opacity: 0.4 },
  { left: 61, top: 20, size: 21, x: 66, y: 36, rotate: 45, opacity: 0.56 },
  { left: 74, top: 72, size: 24, x: -50, y: 40, rotate: -64, opacity: 0.58 },
  { left: 90, top: 28, size: 16, x: 38, y: -48, rotate: 26, opacity: 0.44 },
];
const glassGlints = [
  { left: 13, top: 28, size: 12, delay: 0 },
  { left: 28, top: 70, size: 8, delay: 0.8 },
  { left: 51, top: 20, size: 10, delay: 1.4 },
  { left: 68, top: 75, size: 9, delay: 0.4 },
  { left: 86, top: 33, size: 11, delay: 1 },
];
const crackLines = [
  { left: 10, top: 36, width: 16, rotate: -18 },
  { left: 31, top: 61, width: 13, rotate: 14 },
  { left: 55, top: 34, width: 18, rotate: -10 },
  { left: 73, top: 58, width: 14, rotate: 20 },
];
const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

function sectionHref(item: string) {
  if (item === "Home") return "#";
  if (item === "About Us") return "#about";
  return `#${item.toLowerCase()}`;
}

function BrokenGlassWordmark({
  className = "",
}: {
  className?: string;
}) {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateWordmark = () => {
      const element = wordmarkRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const viewportHeight = window.innerHeight || 1;
      const start = viewportHeight * 0.98;
      const end = viewportHeight * 0.38;
      const rawProgress = (start - rect.top) / Math.max(start - end, 1);
      const nextProgress = Number((Math.min(Math.max(rawProgress, 0), 1)).toFixed(3));

      setProgress((current) => (Math.abs(current - nextProgress) > 0.002 ? nextProgress : current));
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateWordmark);
    };

    updateWordmark();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const easedProgress = 1 - Math.pow(1 - progress, 3);
  const scatter = 1 - easedProgress;

  return (
    <div
      ref={wordmarkRef}
      className={`footer-wordmark relative overflow-hidden py-5 ${className}`}
      style={
        {
          "--assemble-progress": Number(easedProgress.toFixed(3)),
          "--scatter-scale": Number(scatter.toFixed(3)),
        } as CSSProperties
      }
      aria-label="TECHNOSHINE"
    >
      <div className="absolute left-1/2 top-1/2 h-28 w-2/3 -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-3xl" />

      <div className="footer-wordmark-stage relative select-none" aria-hidden="true">
        {crackLines.map((crack) => (
          <span
            key={`${crack.left}-${crack.top}`}
            className="footer-wordmark-crack"
            style={
              {
                left: `${crack.left}%`,
                top: `${crack.top}%`,
                width: `${crack.width}%`,
                transform: `rotate(${crack.rotate}deg) scaleX(${0.45 + easedProgress * 0.55})`,
              } as CSSProperties
            }
          />
        ))}

        <div className="footer-wordmark-letters absolute inset-0 flex items-center justify-center text-center font-display font-black uppercase leading-none tracking-normal">
          {wordmarkLetters.map((item, index) => (
            <span
              key={`${item.letter}-${index}`}
              className="footer-wordmark-letter"
              style={{ "--letter-index": index } as CSSProperties}
            >
              {letterShards.map((shard, shardIndex) => (
                <span
                  key={`${shard.clip}-${shardIndex}`}
                  className="footer-wordmark-piece"
                  style={
                    {
                      clipPath: shard.clip,
                      color:
                        shard.tint === "white"
                          ? "rgb(255 255 255 / 0.92)"
                          : "hsl(var(--primary))",
                      opacity: 0.42 + easedProgress * 0.58,
                      transform: `
                        translate3d(
                          ${(item.x + shard.x) * scatter}px,
                          ${(item.y + shard.y) * scatter}px,
                          ${(item.z - shardIndex * 18) * scatter}px
                        )
                        rotate(${(item.rotate + shard.rotate) * scatter}deg)
                        scale(${0.72 + easedProgress * 0.28})
                      `,
                    } as CSSProperties
                  }
                >
                  {item.letter}
                </span>
              ))}
            </span>
          ))}
        </div>

        {glassDebris.map((debris) => (
          <span
            key={`${debris.left}-${debris.top}`}
            className="footer-glass-debris"
            style={
              {
                left: `${debris.left}%`,
                top: `${debris.top}%`,
                width: debris.size,
                height: debris.size * 0.72,
                opacity: debris.opacity * scatter,
                transform: `
                  translate3d(${debris.x * scatter}px, ${debris.y * scatter}px, 0)
                  rotate(${debris.rotate * scatter}deg)
                  scale(${0.4 + scatter * 0.75})
                `,
              } as CSSProperties
            }
          />
        ))}

        {glassGlints.map((glint) => (
          <span
            key={`${glint.left}-${glint.top}`}
            className="footer-wordmark-glint"
            style={
              {
                left: `${glint.left}%`,
                top: `${glint.top}%`,
                width: glint.size,
                height: glint.size,
                animationDelay: `${glint.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="site-footer relative overflow-hidden bg-[#090f11] pt-16 pb-8 text-white md:min-h-screen md:py-8 lg:py-10"
    >
      <div className="site-footer-content relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* DESKTOP VIEW */}
        <div className="hidden md:block">
          <div className="text-center" data-aos="fade-up">
            <h3 className="mx-auto max-w-2xl text-2xl leading-tight text-white lg:text-3xl">
              Preserve premium spaces with professional TechnoShine stone care.
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
              Marble, granite, terrazzo, and natural stone restoration for hotels, commercial properties, and homes.
            </p>
            <div className="mt-4 flex items-center justify-center gap-5 text-white/30">
              <span className="font-display text-xs uppercase tracking-wider">Marble</span>
              <span className="font-display text-xs uppercase tracking-wider">Granite</span>
              <span className="font-display text-xs uppercase tracking-wider">Terrazzo</span>
              <span className="font-display text-xs uppercase tracking-wider">Sealing</span>
            </div>
          </div>

          <BrokenGlassWordmark className="my-6 lg:my-7" />

          <div className="site-footer-columns grid gap-7 lg:grid-cols-[1.25fr_1.15fr_0.75fr_0.7fr_0.9fr]">
            <div data-aos="fade-up" data-aos-delay="80">
              <Link href="/" className="mb-4 inline-flex items-center">
                <img
                  src="/icon.png"
                  alt="TechnoShine"
                  className="h-11 w-auto"
                />
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-white/55">
                TechnoShine provides comprehensive stone care services, from restoration and polishing to sealing and maintenance programs.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="140">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                Categories
              </p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {services.map((service) => (
                  <li key={service.title}>
                    <a
                      href="#services"
                      className="text-sm font-display text-white transition-colors hover:text-primary"
                    >
                      {service.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#before-after"
                    className="text-sm font-display text-white transition-colors hover:text-primary"
                  >
                    Before & After
                  </a>
                </li>
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="140">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                Company
              </p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/company-profile"
                    className="text-sm font-display text-white transition-colors hover:text-primary"
                  >
                    Company Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="260">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                Pages
              </p>
              <ul className="space-y-2.5">
                {quickLinks.map((item) => (
                  <li key={item}>
                    <a
                      href={sectionHref(item)}
                      className="text-sm font-display text-white transition-colors hover:text-primary"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="320">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                Quick Links
              </p>
              <a
                href="#contact"
                className="mb-4 inline-flex w-full items-center justify-center border border-primary/70 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary hover:text-white"
              >
                Contact Us
              </a>
              <Link
                href="/company-profile"
                className="mb-4 inline-flex w-full items-center justify-center border border-white/20 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-primary hover:text-primary"
              >
                Company Profile
              </Link>
              <a
                href="tel:+63286522230"
                className="mb-3 block text-lg font-display text-white transition-colors hover:text-primary"
              >
                (02) 8652-2230
              </a>
              <a
                href="mailto:contactus@technoshineph.com"
                className="block text-sm font-mono text-white/50 transition-colors hover:text-primary"
              >
                contactus@technoshineph.com
              </a>
            </div>
          </div>

          <div className="site-footer-bottom mt-8 grid items-end gap-6 lg:grid-cols-[1fr_auto]" data-aos="fade-up">
            <div>
              <div className="mb-2 flex flex-wrap gap-x-4 gap-y-2">
                {legalLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-xs font-mono text-white transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <p className="text-xs font-mono text-white/35">
                &copy; {year} TECHNOSHINE. ALL RIGHTS RESERVED.
              </p>
            </div>

            <div className="text-right">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                Social Links
              </p>
              <div className="flex justify-end gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61568188433022"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TechnoShine Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-white transition-transform hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/technoshine_ph/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TechnoShine Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white transition-transform hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* PHONE VIEW */}
        <div className="grid grid-cols-1 gap-12 md:hidden">
          <div className="text-center" data-aos="fade-up">
            <Link href="/" className="mb-4 flex items-center justify-center group">
              <img
                src="/icon.png"
                alt="TechnoShine"
                className="h-60 w-auto mx-auto"
              />
            </Link>
            <p className="mx-auto max-w-sm text-sm font-light text-white/50">
              Premium marble and natural stone restoration specialists.
            </p>
          </div>

          <BrokenGlassWordmark className="-my-4" />

          <div className="text-center" data-aos="fade-up" data-aos-delay="100">
            <h4 className="mb-4 text-white font-display uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {["Home", "Services", "About", "Gallery", "Team", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                    className="text-sm font-mono text-white/50 hover:text-primary"
                  >
                    | {item}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/company-profile"
                  className="text-sm font-mono text-white/50 hover:text-primary"
                >
                  | Company Profile
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center" data-aos="fade-up" data-aos-delay="180">
            <h4 className="mb-4 text-white font-display uppercase tracking-widest">
              Legal
            </h4>
            <ul className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm font-mono text-white/50 hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mb-3 text-white font-display uppercase tracking-widest">
              Our Social Links
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61568188433022"
                target="_blank"
                rel="noreferrer"
                aria-label="TechnoShine Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1877f2] bg-[#1877f2] text-white transition-transform hover:scale-105"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/technoshine_ph/"
                target="_blank"
                rel="noreferrer"
                aria-label="TechnoShine Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white transition-transform hover:scale-105"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="w-full text-center text-xs font-mono text-white/40">
              &copy; {year} TECHNOSHINE. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
