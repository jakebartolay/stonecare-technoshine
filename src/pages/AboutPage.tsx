import { Link } from "wouter";
import { ArrowRight, Building2, FileText, Network } from "lucide-react";
import { About } from "@/components/About";
import { SiteLayout } from "@/components/SiteLayout";

export default function AboutPage() {
  return (
    <SiteLayout>
      <About />

      <section id="company-links" className="relative bg-background py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
              Company Records
            </p>
            <h1 className="font-display text-3xl font-bold uppercase leading-tight tracking-normal text-foreground sm:text-5xl">
              Formal company information for client review
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Open the company profile or organization chart when a client needs
              a more complete view of Technoshine as a service provider.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Link
              href="/company/company-profile"
              className="group rounded-md border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary"
            >
              <Building2 className="mb-5 h-7 w-7 text-primary" />
              <h2 className="font-display text-2xl font-bold uppercase tracking-normal text-foreground">
                Company Profile
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                View the formal company profile presentation.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-primary">
                Open Profile
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/company/company-client"
              className="group rounded-md border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary"
            >
              <FileText className="mb-5 h-7 w-7 text-primary" />
              <h2 className="font-display text-2xl font-bold uppercase tracking-normal text-foreground">
                Client Profile
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Open the client-ready company profile presentation.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-primary">
                Open Client Page
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/company/organization-chart"
              className="group rounded-md border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary"
            >
              <Network className="mb-5 h-7 w-7 text-primary" />
              <h2 className="font-display text-2xl font-bold uppercase tracking-normal text-foreground">
                Organization Chart
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Review the company leadership and department structure.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-primary">
                Open Chart
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
