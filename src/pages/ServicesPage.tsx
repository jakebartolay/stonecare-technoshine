import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Services } from "@/components/Services";
import { SiteLayout } from "@/components/SiteLayout";
import { serviceItems } from "@/lib/site-content";

function assetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export default function ServicesPage() {
  return (
    <SiteLayout>
      <Services />

      <section id="service-details" className="relative bg-background py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
                Detailed Scope
              </p>
              <h1 className="font-display text-3xl font-bold uppercase leading-tight tracking-normal text-foreground sm:text-5xl">
                Professional services for natural stone surfaces
              </h1>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Technoshine handles inspection, preparation, restoration, polishing,
              sealing, and maintenance recommendations for premium residential,
              hotel, and commercial environments.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceItems.map((service) => (
              <article
                key={service.title}
                className="overflow-hidden rounded-md border border-border bg-card shadow-sm"
              >
                <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img
                    src={assetPath(service.image)}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-2xl font-bold uppercase tracking-normal text-foreground">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.summary}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {service.scope.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-foreground/82">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-md border border-foreground/10 bg-foreground p-6 text-white sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                Ready for Assessment
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-normal">
                Send your surface details for a formal quotation.
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-foreground"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
