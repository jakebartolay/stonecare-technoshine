import { Link } from "wouter";
import { Facebook, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

const services = [
  {
    title: "Tiles Cleaning",
    text: "Professional cleaning and stain treatment for ceramic, porcelain, and other tile surfaces.",
    href: "/services/tiles",
  },
  {
    title: "Marble Restoration",
    text: "Deep cleaning, honing, polishing, and sealing for marble surfaces.",
    href: "/services/marble-polishing",
  },
  {
    title: "Granite Care",
    text: "Professional maintenance for granite floors, counters, and walls.",
    href: "/services/granite-care",
  },
  {
    title: "Terrazzo Polishing",
    text: "Restoration and shine recovery for terrazzo surfaces.",
    href: "/services/terrazzo-polishing",
  },
  {
    title: "Floor Maintenance",
    text: "Routine stone care programs for commercial and residential spaces.",
    href: "/services",
  },
];

const serviceChips = [
  { label: "Tiles", href: "/services/tiles" },
  { label: "Marble", href: "/services/marble-polishing" },
  { label: "Granite", href: "/services/granite-care" },
  { label: "Terrazzo", href: "/services/terrazzo-polishing" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Clients", href: "/clients" },
  { label: "Contact", href: "/contact" },
];
const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

const socialLinks = [
  {
    label: "Technoshine Facebook",
    href: "https://www.facebook.com/profile.php?id=61568188433022",
    Icon: Facebook,
  },
  {
    label: "Technoshine Instagram",
    href: "https://www.instagram.com/technoshine_ph/",
    Icon: Instagram,
  },
  {
    label: "Technoshine TikTok",
    href: "https://www.tiktok.com/@technoshine.ph",
    Icon: FaTiktok,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="site-footer relative flex min-h-[100svh] items-center overflow-hidden bg-background py-16 text-foreground"
    >
      <div className="site-footer-content relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* DESKTOP VIEW */}
        <div className="hidden md:block">
          <div
            className="grid items-end gap-8 border-b border-foreground/10 pb-10 lg:grid-cols-[1.1fr_0.9fr]"
            data-aos="fade-up"
          >
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-primary">
                Technoshine Stone Care
              </p>
              <h3 className="max-w-3xl text-3xl leading-tight text-foreground lg:text-5xl">
              Preserve premium spaces with professional Technoshine stone care.
              </h3>
            </div>
            <div className="lg:text-right">
              <p className="ml-auto max-w-xl text-base leading-relaxed text-foreground/75">
                Tile, marble, granite, and terrazzo cleaning and restoration for hotels, commercial properties, and homes.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 lg:justify-end">
                {serviceChips.map((chip) => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="border border-foreground/15 px-4 py-2 font-display text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="site-footer-columns mt-12 grid gap-8 border-b border-foreground/10 pb-10 lg:grid-cols-[1.25fr_1.15fr_0.75fr_0.7fr_0.9fr]">
            <div data-aos="fade-up" data-aos-delay="80">
              <Link href="/" className="mb-4 inline-flex items-center">
                <img
                  src="/icon.png"
                  alt="Technoshine"
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-auto"
                />
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-foreground/75">
                Technoshine provides comprehensive stone care services, from restoration and polishing to sealing and maintenance programs.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="140">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Categories
              </p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {services.map((service) => (
                  <li key={service.title}>
                    <Link
                      href={service.href}
                      className="text-sm font-display text-foreground transition-colors hover:text-primary"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/gallery"
                    className="text-sm font-display text-foreground transition-colors hover:text-primary"
                  >
                    Before & After
                  </Link>
                </li>
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="140">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Company
              </p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/company/company-profile"
                    className="text-sm font-display text-foreground transition-colors hover:text-primary"
                  >
                    Company Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/company/organization-chart"
                    className="text-sm font-display text-foreground transition-colors hover:text-primary"
                  >
                    Our Organization
                  </Link>
                </li>
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="260">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Pages
              </p>
              <ul className="space-y-2.5">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm font-display text-foreground transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="320">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Quick Links
              </p>
              <Link
                href="/company/company-profile"
                className="mb-4 inline-flex w-full items-center justify-center border border-foreground/20 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Company Profile
              </Link>
              <Link
                href="/company/organization-chart"
                className="mb-4 inline-flex w-full items-center justify-center border border-foreground/20 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Organization
              </Link>
              <Link
                href="/help"
                className="inline-flex w-full items-center justify-center border border-foreground/20 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Help Center
              </Link>
            </div>
          </div>

          <div className="site-footer-bottom mt-8 grid items-end gap-6 lg:grid-cols-[1fr_auto]" data-aos="fade-up">
            <div>
              <div className="mb-2 flex flex-wrap gap-x-4 gap-y-2">
                {legalLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-xs font-mono text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <p className="text-xs font-mono text-foreground/70">
                &copy; {year} Technoshine. All rights reserved.
              </p>
            </div>

            <div className="text-right">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Social Links
              </p>
              <div className="flex justify-end gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PHONE VIEW */}
        <div className="grid grid-cols-1 gap-10 md:hidden">
          <div className="text-center" data-aos="fade-up">
            <Link href="/" className="mb-4 flex items-center justify-center group">
              <img
                src="/icon.png"
                alt="Technoshine"
                loading="lazy"
                decoding="async"
                className="mx-auto h-44 w-auto"
              />
            </Link>
            <p className="mx-auto max-w-sm text-sm font-medium text-foreground/75">
              Premium marble and natural stone restoration specialists.
            </p>
          </div>

          <div className="text-center" data-aos="fade-up" data-aos-delay="100">
            <h4 className="mb-4 text-foreground font-display uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm font-mono text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/company/company-profile"
                  className="text-sm font-mono text-foreground transition-colors hover:text-primary"
                >
                  Company Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/company/organization-chart"
                  className="text-sm font-mono text-foreground transition-colors hover:text-primary"
                >
                  Organization
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center" data-aos="fade-up" data-aos-delay="180">
            <h4 className="mb-4 text-foreground font-display uppercase tracking-widest">
              Legal
            </h4>
            <ul className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm font-mono text-foreground transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mb-3 text-foreground font-display uppercase tracking-widest">
              Our Social Links
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <p className="w-full text-center text-xs font-mono text-foreground/70">
              &copy; {year} Technoshine. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
