import { Link } from "wouter";
import { ArrowRight, Building2, FileText } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { clientItems } from "@/lib/site-content";

function assetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export default function ClientsPage() {
  return (
    <SiteLayout>
      <section className="relative flex min-h-[74svh] items-end overflow-hidden bg-black pb-16 pt-32 text-white">
        <img
          src={assetPath("images/client-images/gallery-12.jpg")}
          alt="Polished stone surface in a commercial space"
          className="absolute inset-0 h-full w-full object-cover opacity-68"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/28 to-black/32" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
            Client Experience
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-bold uppercase leading-tight tracking-normal sm:text-6xl">
            Trusted by hotels, commercial properties, and premium spaces
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base">
            Technoshine supports properties that depend on polished, presentable,
            and properly maintained natural stone surfaces.
          </p>
        </div>
      </section>

      <section id="client-grid" className="relative bg-background py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
                Selected Clients
              </p>
              <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-normal text-foreground sm:text-5xl">
                Service experience across known Philippine locations
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              A static client list keeps the page easier to review and gives
              prospects a cleaner proof point for formal inquiries.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clientItems.map((client) => (
              <div
                key={client.name}
                className="flex min-h-32 items-center gap-4 rounded-md border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md border border-border bg-white p-3">
                  <img
                    src={assetPath(client.icon)}
                    alt={client.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <Building2 className="mb-2 h-4 w-4 text-primary" />
                  <h3 className="font-display text-base font-bold uppercase leading-tight tracking-normal text-foreground">
                    {client.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-foreground"
            >
              Request Assessment
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/company/company-client"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-foreground/20 px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Client Profile
              <FileText className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
