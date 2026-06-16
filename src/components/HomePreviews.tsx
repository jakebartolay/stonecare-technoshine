import { Link } from "wouter";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Images,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  galleryHighlights,
  serviceItems,
} from "@/lib/site-content";

const featuredServices = serviceItems.slice(0, 4);

function assetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-normal text-foreground sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {text}
      </p>
    </div>
  );
}

function RouteButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-foreground"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function ServicesPreview() {
  return (
    <section id="services-preview" className="relative bg-background py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionIntro
            eyebrow="Core Services"
            title="Formal stone care for client-facing spaces"
            text="A quick view of the work Technoshine handles for hotels, commercial properties, and premium homes."
          />
          <div className="lg:text-right">
            <RouteButton href="/services">View Services</RouteButton>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service) => (
            <Link
              key={service.title}
              href="/services"
              className="group overflow-hidden rounded-md border border-border bg-card shadow-sm transition-all hover:border-primary hover:shadow-[0_20px_50px_rgba(8,8,8,0.1)]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                <img
                  src={assetPath(service.image)}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-bold uppercase tracking-normal text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutPreview() {
  const stats = [
    { value: "30+", label: "Years of Experience" },
    { value: "5,000+", label: "Projects Completed" },
    { value: "1993", label: "Founded in Stone Restoration" },
  ];

  return (
    <section id="about-preview" className="relative bg-background py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <SectionIntro
            eyebrow="Company Overview"
            title="Built for careful, professional restoration"
            text="Technoshine began in 1993 and continues to serve clients who want to restore natural stone instead of replacing it."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-md border border-border bg-card p-5">
                <p className="font-display text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <RouteButton href="/about">About Technoshine</RouteButton>
            <Link
              href="/company-profile"
              className="inline-flex min-h-11 items-center justify-center border border-foreground/20 px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Company Profile
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-md border border-border bg-card p-2 shadow-sm">
          <img
            src={assetPath("images/marble-hall.jpg")}
            alt="Restored marble hall"
            className="h-full min-h-[360px] w-full object-cover"
          />
          <div className="absolute bottom-5 left-5 right-5 rounded-md border border-white/30 bg-black/62 p-4 text-white backdrop-blur">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="font-display text-sm font-bold uppercase tracking-wider">
                Precision. Integrity. Craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkPreview() {
  return (
    <section id="gallery-preview" className="relative bg-background py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionIntro
            eyebrow="Proof of Work"
            title="See the finish before booking"
            text="Browse selected floor finishes and before-after restorations from Technoshine project work."
          />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <RouteButton href="/gallery">View Gallery</RouteButton>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center border border-foreground/20 px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Request Assessment
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {galleryHighlights.map((item) => (
            <Link
              key={item.title}
              href="/gallery"
              className="group relative min-h-[320px] overflow-hidden rounded-md border border-border bg-black"
            >
              <img
                src={assetPath(item.image)}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/16 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                  {item.label}
                </p>
                <h3 className="font-display text-2xl font-bold uppercase tracking-normal">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeContactPreview() {
  const items = [
    {
      icon: Sparkles,
      title: "Free Assessment",
      text: "Send the project scope and stone condition for review.",
    },
    {
      icon: Building2,
      title: "Commercial Ready",
      text: "Suitable for hotels, malls, offices, residences, and premium facilities.",
    },
    {
      icon: CheckCircle2,
      title: "Clear Scope",
      text: "Discuss the surface, schedule, and restoration approach before work begins.",
    },
  ];

  return (
    <section id="contact-preview" className="relative bg-background py-20 text-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:items-center">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
            Start a Project
          </p>
          <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-normal sm:text-5xl">
            Need a formal quotation or site assessment?
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Send your property details, surface type, and preferred schedule so Technoshine can prepare the next step clearly.
          </p>
          <div className="mt-8">
            <RouteButton href="/contact">Contact Us</RouteButton>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-md border border-border bg-card p-5 shadow-sm">
              <Icon className="mb-4 h-6 w-6 text-primary" />
              <h3 className="font-display text-lg font-bold uppercase tracking-normal">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
