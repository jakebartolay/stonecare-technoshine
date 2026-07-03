import { Heart } from "lucide-react";
import { Link } from "wouter";
import { ProductVisual } from "@/components/shop/ProductVisual";
import type { ShopProduct } from "@/lib/shop-products";

interface ProductCardProps {
  product: ShopProduct;
  layout?: "grid" | "list";
}

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const isList = layout === "list";

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-2xl border border-[#F0D8C6] bg-white shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:border-[#FF6B00]/60 hover:shadow-xl hover:shadow-orange-100/70",
        isList ? "lg:grid lg:grid-cols-[15rem_1fr]" : "flex h-full flex-col",
      ].join(" ")}
    >
      <Link
        href={`/stone-care/shops/${product.slug}`}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={`View ${product.name}`}
      >
        <span className="sr-only">View {product.name}</span>
      </Link>

      <div className="relative">
        <div className={isList ? "h-full min-h-52" : "aspect-square"}>
          <ProductVisual product={product} compact={!isList} />
        </div>

        {product.badge ? (
          <span className="absolute left-2 top-2 rounded-full bg-[#FF6B00] px-2 py-1 text-[0.58rem] font-bold uppercase tracking-wide text-white shadow-sm sm:left-3 sm:top-3 sm:text-[0.64rem]">
            {product.badge}
          </span>
        ) : null}

        <button
          type="button"
          aria-label={`Save ${product.name}`}
          title="Save product"
          className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#1F1A17] shadow-sm transition hover:border-[#FF6B00] hover:text-[#FF6B00] sm:right-3 sm:top-3"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#FF6B00] sm:text-[0.68rem]">
          {product.brand}
        </p>

        <h3 className="mt-1 min-h-[2.7rem] text-sm font-bold leading-snug text-[#1F1A17] transition group-hover:text-[#FF6B00] sm:text-base">
          {product.name}
        </h3>

        <p className="mt-2 min-h-[2.45rem] text-[0.68rem] leading-relaxed text-neutral-600 sm:text-xs">
          <span className="font-bold text-[#1F1A17]">Para sa:</span> {product.usesLine}
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
          <p className="font-display text-xl font-bold text-[#FF6B00] sm:text-2xl">
            {product.priceLabel}
          </p>
          <p className="text-[0.66rem] font-bold text-red-600 sm:text-xs">
            {product.stockLeft} items left!
          </p>
        </div>

        <span className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#F0D8C6] bg-[#FFF8F2] px-3 py-2 text-center text-[0.68rem] font-bold uppercase tracking-wide text-[#D95B00] transition group-hover:border-[#FF6B00] group-hover:bg-[#FFF3E8] sm:text-xs">
          View Product
        </span>
      </div>
    </article>
  );
}
