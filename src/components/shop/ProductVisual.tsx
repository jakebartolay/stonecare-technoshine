import type { ShopProduct } from "@/lib/shop-products";

interface ProductVisualProps {
  product: ShopProduct;
  label?: string;
  compact?: boolean;
}

export function ProductVisual({ product, label = "Product image", compact = false }: ProductVisualProps) {
  const isTub = product.size.endsWith("g") || product.category === "Powders";
  const isSpray = product.slug.includes("spray");
  const accent = product.visual.accent;

  return (
    <div
      role="img"
      aria-label={`${product.name} ${label}`}
      className="relative flex h-full min-h-[9rem] w-full items-center justify-center overflow-hidden bg-[#FFF8F2]"
      style={{ backgroundColor: product.visual.surface }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.92),transparent_34%),linear-gradient(135deg,rgba(8,8,8,0.08),transparent_42%)]" />
      <div className="absolute left-4 top-5 h-16 w-16 rounded-full bg-white/70 blur-2xl" />
      <div className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-slate-500/10 to-transparent" />

      <div
        className={[
          "relative flex flex-col items-center justify-end rounded-xl border border-slate-200 bg-white shadow-2xl",
          compact ? "h-[68%] w-[42%] min-w-16" : "h-[72%] w-[34%] min-w-24",
          isTub ? "h-[48%] w-[58%] justify-center rounded-lg" : "",
        ].join(" ")}
      >
        {isSpray ? (
          <div
            className="absolute -top-6 left-1/2 h-8 w-12 -translate-x-1/2 rounded-t-md border border-slate-200 bg-white shadow-sm"
            style={{ borderTopColor: accent }}
          />
        ) : null}

        {!isTub ? (
          <div
            className="absolute -top-5 left-1/2 h-6 w-12 -translate-x-1/2 rounded-t-sm border border-slate-200"
            style={{ backgroundColor: accent }}
          />
        ) : null}

        <div
          className={[
            "mx-auto flex w-[82%] flex-col items-center justify-center rounded-sm px-2 text-center text-white shadow-inner",
            compact ? "min-h-16" : "min-h-24",
            isTub ? "min-h-20 w-[72%]" : "mb-[22%]",
          ].join(" ")}
          style={{ backgroundColor: accent }}
        >
          <span className="font-display text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white/90 sm:text-[0.68rem]">
            TECHNO<span className="text-white">SHINE</span>
          </span>
          <span className="mt-1 text-[0.58rem] font-bold uppercase leading-tight text-white sm:text-[0.72rem]">
            {product.visual.label}
          </span>
          <span className="mt-1 rounded-full bg-white/95 px-2 py-0.5 text-[0.56rem] font-bold uppercase text-[#1F1A17]">
            {product.size}
          </span>
        </div>
      </div>
    </div>
  );
}
