import { ArrowLeft, ArrowRight, FileText, LifeBuoy, Search } from "lucide-react";
import { Link } from "wouter";
import { HelpFooter } from "@/components/help/HelpFooter";
import { helpProducts } from "@/lib/help-products";
import { useSeo } from "@/lib/use-seo";

export default function HelpPage() {
  useSeo({
    title: "Help Center | TECHNOSHINE",
    description: "Find TECHNOSHINE help articles, product information, and care instructions.",
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7F7] text-[#1F1A17]">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/help" className="flex min-w-0 items-center gap-3">
            <img src="/icon.png" alt="Technoshine" className="h-9 w-auto shrink-0" />
            <span className="min-w-0 font-display text-lg font-bold uppercase tracking-normal text-[#1F1A17]">
              Help Center
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-neutral-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#1F1A17] transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <section className="border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center bg-[#FF6B00] text-white">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              TECHNOSHINE Support
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-normal sm:text-5xl">
              Help Center
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-700 sm:text-base">
              Product details, use instructions, and safety reminders for QR-linked TECHNOSHINE help pages.
            </p>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[0.7fr_1fr]">
            <div className="border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-[#1F1A17] text-white">
                  <Search className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-bold uppercase tracking-normal">
                  Product Info
                </h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-700">
                Open the matching QR product article for care details and usage notes.
              </p>
            </div>

            <div className="grid gap-4">
              {helpProducts.map((product) => (
                <Link
                  key={product.slug}
                  href={`/help/product-info/${product.slug}`}
                  className="group border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-[#FF6B00]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center bg-[#FFF8F2] text-[#FF6B00]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
                        {product.brand}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-bold uppercase leading-tight tracking-normal text-[#1F1A17]">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-700">{product.surface}</p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-neutral-400 transition group-hover:text-[#FF6B00]" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <HelpFooter />
    </div>
  );
}
