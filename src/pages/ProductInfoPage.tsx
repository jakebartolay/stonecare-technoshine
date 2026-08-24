import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Droplets,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useRoute } from "wouter";
import { HelpFooter } from "@/components/help/HelpFooter";
import { getHelpProductInfoFromList, usePublicHelpProductsState } from "@/lib/help-products";
import { useSeo } from "@/lib/use-seo";

const iconClassName = "h-5 w-5";

function assetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function HelpHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/help" className="flex min-w-0 items-center gap-3">
          <img src="/icon.png" alt="Technoshine" className="h-9 w-auto shrink-0" />
          <span className="min-w-0 font-display text-lg font-bold uppercase tracking-normal text-[#1F1A17]">
            Help Center
          </span>
        </Link>
        <Link
          href="/help"
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-neutral-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#1F1A17] transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Help
        </Link>
      </div>
    </header>
  );
}

export default function ProductInfoPage() {
  const [, params] = useRoute<{ productId: string }>("/help/product-info/:productId");
  const [, trailingParams] = useRoute<{ productId: string }>("/help/product-info/:productId/");
  const productId = params?.productId ?? trailingParams?.productId ?? "";
  const { products } = usePublicHelpProductsState();
  const product = getHelpProductInfoFromList(productId, products);

  useSeo({
    title: product
      ? `${product.brand} ${product.name} | Product Info`
      : "Product Information Not Found | TECHNOSHINE",
    description: product
      ? `${product.headline}. ${product.description}`
      : "The requested product information page could not be found.",
    type: product ? "product" : "website",
  });

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F6F7F7] text-[#1F1A17]">
        <HelpHeader />
        <main className="flex-1 px-4 py-14 sm:px-6 lg:px-8">
          <section className="mx-auto max-w-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF6B00]">
              Product Info
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal text-[#1F1A17]">
              Product details not found.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              The QR link may be outdated or the product page may have moved.
            </p>
            <Link
              href="/help"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF6B00] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#D95B00]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Help
            </Link>
          </section>
        </main>
        <HelpFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7F7] text-[#1F1A17]">
      <HelpHeader />
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[16rem_1fr] lg:items-start">
          <aside className="border border-neutral-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              Help Article
            </p>
            <div className="mt-4 space-y-1 text-sm font-semibold text-neutral-700">
              <a href="#overview" className="block px-2 py-2 transition hover:bg-[#FFF8F2] hover:text-[#FF6B00]">
                Overview
              </a>
              <a href="#features" className="block px-2 py-2 transition hover:bg-[#FFF8F2] hover:text-[#FF6B00]">
                Features
              </a>
              <a href="#instructions" className="block px-2 py-2 transition hover:bg-[#FFF8F2] hover:text-[#FF6B00]">
                Instructions
              </a>
              <a href="#safety" className="block px-2 py-2 transition hover:bg-[#FFF8F2] hover:text-[#FF6B00]">
                Safety
              </a>
            </div>
          </aside>

          <article className="min-w-0 border border-neutral-200 bg-white shadow-sm">
            <section id="overview" className="border-b border-neutral-200 p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex min-h-9 items-center gap-2 bg-[#FFF8F2] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#D95B00]">
                  <FileText className={iconClassName} />
                  Product Info
                </span>
                <span className="inline-flex min-h-9 items-center gap-2 border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-neutral-700">
                  <Droplets className={iconClassName} />
                  Water-Based
                </span>
              </div>

              <p className="mt-7 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                {product.brand}
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-normal text-[#1F1A17] sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-3 text-sm font-bold uppercase tracking-wide text-neutral-500">
                {product.surface}
              </p>
              <p className="mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-[#1F1A17]">
                {product.headline}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-700 sm:text-base">
                {product.description}
              </p>
            </section>

            <section id="features" className="border-b border-neutral-200 p-5 sm:p-8">
              <h2 className="font-display text-2xl font-bold uppercase tracking-normal text-[#1F1A17]">
                Key Details
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {product.highlights.map((highlight, index) => (
                  <div key={highlight.title} className="border border-neutral-200 bg-[#FAFAFA] p-4">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center bg-[#FF6B00] text-white">
                      {index === 0 ? <Droplets className={iconClassName} /> : null}
                      {index === 1 ? <CheckCircle2 className={iconClassName} /> : null}
                      {index === 2 ? <Clock3 className={iconClassName} /> : null}
                    </div>
                    <h3 className="font-display text-base font-bold uppercase tracking-normal text-[#1F1A17]">
                      {highlight.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">{highlight.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="instructions" className="border-b border-neutral-200 p-5 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-[#FF6B00] text-white">
                  <Sparkles className={iconClassName} />
                </div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-normal text-[#1F1A17]">
                  How to Use
                </h2>
              </div>

              <figure className="mb-6 border border-neutral-200 bg-white">
                <div className="bg-[#F6F7F7] p-3 sm:p-4">
                  <img
                    src={assetPath(product.howToUseImage.src)}
                    alt={product.howToUseImage.alt}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto max-h-[42rem] w-full object-contain"
                  />
                </div>
                <figcaption className="border-t border-neutral-200 px-4 py-3 text-sm leading-6 text-neutral-600">
                  {product.howToUseImage.caption}
                </figcaption>
              </figure>

              <ol className="space-y-3">
                {product.howToUse.map((step, index) => (
                  <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-6 text-neutral-700">
                    <span className="flex h-8 w-8 items-center justify-center bg-[#1F1A17] text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section id="safety" className="bg-[#FFF8F2] p-5 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-[#1F1A17] text-white">
                  <ShieldCheck className={iconClassName} />
                </div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-normal text-[#1F1A17]">
                  Safety Notes
                </h2>
              </div>
              <ul className="space-y-3">
                {product.safetyNotes.map((note) => (
                  <li key={note} className="flex gap-3 text-sm leading-6 text-neutral-700">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B00]" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/help"
                className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 bg-[#FF6B00] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#D95B00]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Help
              </Link>
            </section>
          </article>
        </div>
      </main>
      <HelpFooter />
    </div>
  );
}
