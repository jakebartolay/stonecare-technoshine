import { Link } from "wouter";
import { Facebook, Instagram } from "lucide-react";

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
function sectionHref(item: string) {
  if (item === "Home") return "#";
  if (item === "About Us") return "#about";
  return `#${item.toLowerCase()}`;
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative overflow-hidden bg-[#090f11] pt-16 pb-8 text-white md:min-h-[760px] md:py-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* DESKTOP VIEW */}
        <div className="hidden md:block">
          <div className="text-center">
            <h3 className="mx-auto max-w-xl text-3xl leading-tight text-white lg:text-4xl">
              Preserve premium spaces with professional TechnoShine stone care.
            </h3>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/45">
              Marble, granite, terrazzo, and natural stone restoration for hotels, commercial properties, and homes.
            </p>
            <div className="mt-7 flex items-center justify-center gap-5 text-white/30">
              <span className="font-display text-xs uppercase tracking-wider">Marble</span>
              <span className="font-display text-xs uppercase tracking-wider">Granite</span>
              <span className="font-display text-xs uppercase tracking-wider">Terrazzo</span>
              <span className="font-display text-xs uppercase tracking-wider">Sealing</span>
            </div>
          </div>

          <div className="relative my-12 overflow-hidden py-4">
            <p className="select-none text-center font-display text-[7rem] font-black uppercase leading-none tracking-normal text-white/[0.035] lg:text-[10rem]">
              TECHNOSHINE
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.7fr_0.9fr]">
            <div>
              <Link href="/" className="mb-5 inline-flex items-center">
                <img
                  src="/icon.png"
                  alt="TechnoShine"
                  className="h-14 w-auto"
                />
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-white/55">
                TechnoShine provides comprehensive stone care services, from restoration and polishing to sealing and maintenance programs.
              </p>
            </div>

            <div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                Categories
              </p>
              <ul className="space-y-3">
                {services.slice(0, 3).map((service) => (
                  <li key={service.title}>
                    <a
                      href="#services"
                      className="text-sm font-display text-white transition-colors hover:text-primary"
                    >
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                Categories
              </p>
              <ul className="space-y-3">
                {services.slice(3).map((service) => (
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

            <div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                Pages
              </p>
              <ul className="space-y-3">
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

            <div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                Quick Links
              </p>
              <a
                href="#contact"
                className="mb-5 inline-flex w-full items-center justify-center border border-primary/70 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary hover:text-white"
              >
                Contact Us
              </a>
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

          <div className="mt-14 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-2 flex flex-wrap gap-x-4 gap-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-xs font-mono text-white transition-colors hover:text-primary"
                  >
                    {item}
                  </a>
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
          <div className="text-center">
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

          <div className="text-center">
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
            </ul>
          </div>

          <div className="text-center">
            <h4 className="mb-4 text-white font-display uppercase tracking-widest">
              Legal
            </h4>
            <ul className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-mono text-white/50 hover:text-primary">
                    {item}
                  </a>
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
