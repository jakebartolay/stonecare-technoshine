import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { Link, useRoute } from "wouter";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { ShopShell } from "@/components/shop/ShopShell";
import { getRelatedProducts, getShopProduct } from "@/lib/shop-products";
import { useSeo } from "@/lib/use-seo";

const galleryLabels = ["Front", "Detail", "Finish"];

export default function StoneCareProductPage() {
  const [, params] = useRoute<{ slug: string }>("/stone-care/shops/:slug");
  const [, trailingParams] = useRoute<{ slug: string }>("/stone-care/shops/:slug/");
  const slug = params?.slug ?? trailingParams?.slug ?? "";
  const product = useMemo(() => getShopProduct(slug), [slug]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [slug]);

  useSeo({
    title: product
      ? `${product.name} | TECHNOSHINE Stonecare Shop`
      : "Product Not Found | TECHNOSHINE Stonecare Shop",
    description: product
      ? `${product.description} Available through TECHNOSHINE's Shopee catalog.`
      : "The requested TECHNOSHINE marble care product could not be found.",
    type: product ? "product" : "website",
  });

  if (!product) {
    return (
      <ShopShell>
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#F0D8C6] bg-white p-8 text-center shadow-sm shadow-slate-200/60">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF6B00]">
              Product Not Found
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal text-[#1F1A17]">
              This marble care product is unavailable.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              The product link may be outdated or the item may have been removed from the catalog.
            </p>
            <Link
              href="/stone-care/shops"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#D95B00]"
            >
              Back to Shop
            </Link>
          </div>
        </section>
      </ShopShell>
    );
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <ShopShell>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <Link
            href="/stone-care/shops"
            className="mb-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#F0D8C6] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#1F1A17] shadow-sm shadow-slate-200/60 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <nav aria-label="Breadcrumb" className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <Link href="/" className="transition hover:text-[#FF6B00]">
              Home
            </Link>
            <span className="mx-2 text-neutral-300">›</span>
            <Link href="/stone-care/shops" className="transition hover:text-[#FF6B00]">
              Stone Care
            </Link>
            <span className="mx-2 text-neutral-300">›</span>
            <Link href="/stone-care/shops" className="transition hover:text-[#FF6B00]">
              Shops
            </Link>
            <span className="mx-2 text-neutral-300">›</span>
            <span className="text-[#1F1A17]">{product.name}</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-3xl border border-[#F0D8C6] bg-white shadow-xl shadow-slate-200/70">
                <div className="aspect-square">
                  <ProductVisual product={product} label={galleryLabels[activeImage]} />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                {galleryLabels.map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={[
                      "overflow-hidden rounded-2xl border bg-white transition",
                      activeImage === index ? "border-[#FF6B00] ring-2 ring-[#FF6B00]/20" : "border-[#F0D8C6]",
                    ].join(" ")}
                  >
                    <div className="aspect-[4/3]">
                      <ProductVisual product={product} label={label} compact />
                    </div>
                    <span className="block border-t border-[#F0D8C6] px-2 py-2 text-[0.66rem] font-bold uppercase tracking-wide text-[#1F1A17]">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <article className="rounded-3xl border border-[#F0D8C6] bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                {product.badge ? (
                  <span className="rounded-full bg-[#FF6B00] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {product.badge}
                  </span>
                ) : null}
                <span className="rounded-full border border-[#F0D8C6] px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-600">
                  {product.category}
                </span>
                <span className="rounded-full border border-[#F0D8C6] px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-600">
                  {product.size}
                </span>
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
                {product.brand}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-normal text-[#1F1A17] sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-y border-[#F0D8C6] py-5">
                <p className="font-display text-4xl font-bold text-[#FF6B00]">
                  {product.priceLabel}
                </p>
                <p className="text-sm font-bold text-red-600">{product.stockLeft} items left!</p>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-neutral-700 sm:text-base">
                {product.description}
              </p>

              <section className="mt-7">
                <h2 className="font-display text-xl font-bold uppercase tracking-normal text-[#1F1A17]">
                  Para saan ito
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">{product.usesLine}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.useFor.map((use) => (
                    <span
                      key={use}
                      className="rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#D95B00]"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </section>

              <section className="mt-7">
                <h2 className="font-display text-xl font-bold uppercase tracking-normal text-[#1F1A17]">
                  How to Use
                </h2>
                <ol className="mt-4 space-y-3">
                  {product.howToUse.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-relaxed text-neutral-700">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="mt-8 rounded-2xl border border-[#F0D8C6] bg-[#FFF8F2] p-4">
                <p className="flex items-start gap-2 text-xs font-semibold leading-relaxed text-neutral-700">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B00]" />
                  Use as directed on the product label. For professional floor restoration work, test first and follow
                  surface-specific procedures.
                </p>
              </div>

              <a
                href={product.shopeeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#D95B00]"
              >
                Buy on Shopee
                <ExternalLink className="h-4 w-4" />
              </a>
            </article>
          </div>

          <section className="mt-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF6B00]">
                  More from TECHNOSHINE
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-normal text-[#1F1A17] sm:text-3xl">
                  Related products
                </h2>
              </div>
              <Link
                href="/stone-care/shops"
                className="hidden text-xs font-bold uppercase tracking-wide text-[#1F1A17] transition hover:text-[#FF6B00] sm:inline-flex"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.slug} product={relatedProduct} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </ShopShell>
  );
}
