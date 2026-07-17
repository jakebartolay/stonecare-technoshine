import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function InquiryStrip() {
  return (
    <section
      id="inquiry"
      className="relative overflow-hidden bg-foreground py-14 text-background"
    >
      <div className="absolute inset-0 tech-pattern opacity-[0.05]" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-primary">
            Have a project in mind?
          </p>
          <h3 className="font-display text-2xl uppercase text-background sm:text-3xl">
            Let's talk about your stone
          </h3>
        </div>

        <Link
          href="/contact"
          className="inline-flex min-h-12 items-center justify-center gap-2 border border-primary bg-primary px-7 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-transparent hover:text-primary"
        >
          Inquiry
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
