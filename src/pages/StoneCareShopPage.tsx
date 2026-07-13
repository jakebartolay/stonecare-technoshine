import { useMemo, useState } from "react";
import { Filter, Grid2X2, LayoutList, SlidersHorizontal, X } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@heroui/react";
import { ProductCardSkeletons, ShopHeroPreviewSkeleton } from "@/components/PageSkeletons";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { ShopShell } from "@/components/shop/ShopShell";
import { adminProductCategories, useAdminProductsState } from "@/lib/admin-store";
import { shopSizes, shopUseFor, type ShopProduct } from "@/lib/shop-products";
import { useSeo } from "@/lib/use-seo";

const shopCategories = ["All", ...adminProductCategories];
const priceRanges = ["All prices", "PHP 0 placeholders", "Under PHP 500"];

type ViewMode = "grid" | "list";

interface FilterPanelProps {
  activeCategory: string;
  priceRange: string;
  selectedSizes: string[];
  selectedUses: string[];
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: string) => void;
  onToggleSize: (size: string) => void;
  onToggleUse: (use: string) => void;
  onClear: () => void;
}

function FilterPanel({
  activeCategory,
  priceRange,
  selectedSizes,
  selectedUses,
  onCategoryChange,
  onPriceRangeChange,
  onToggleSize,
  onToggleUse,
  onClear,
}: FilterPanelProps) {
  return (
    <aside className="rounded-2xl border border-[#F0D8C6] bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#FF6B00]" />
          <h2 className="font-display text-lg font-bold uppercase tracking-normal text-[#1F1A17]">
            Filters
          </h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-bold uppercase tracking-wide text-slate-500 transition hover:text-[#FF6B00]"
        >
          Clear
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
            Category
          </h3>
          <div className="space-y-2">
            {shopCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={[
                  "flex min-h-10 w-full items-center justify-between rounded-sm border px-3 text-left text-sm font-semibold transition",
                  activeCategory === category
                    ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                    : "border-[#F0D8C6] bg-white text-[#1F1A17] hover:border-[#FF6B00]",
                ].join(" ")}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
            Price Range
          </h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => onPriceRangeChange(range)}
                className={[
                  "min-h-9 w-full rounded-sm border px-3 text-left text-sm font-semibold transition",
                  priceRange === range
                    ? "border-[#D95B00] bg-[#D95B00] text-white"
                    : "border-[#F0D8C6] bg-white text-[#1F1A17] hover:border-[#FF6B00]",
                ].join(" ")}
              >
                {range}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
            Size
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {shopSizes.map((size) => (
              <label
                key={size}
                className="flex min-h-10 items-center gap-2 rounded-lg border border-[#F0D8C6] px-3 text-sm font-semibold text-[#1F1A17]"
              >
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => onToggleSize(size)}
                  className="h-4 w-4 accent-[#FF6B00]"
                />
                {size}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
            Use For
          </h3>
          <div className="space-y-2">
            {shopUseFor.map((use) => (
              <label
                key={use}
                className="flex min-h-10 items-center gap-2 rounded-lg border border-[#F0D8C6] px-3 text-sm font-semibold text-[#1F1A17]"
              >
                <input
                  type="checkbox"
                  checked={selectedUses.includes(use)}
                  onChange={() => onToggleUse(use)}
                  className="h-4 w-4 accent-[#FF6B00]"
                />
                {use}
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

function productMatchesSearch(product: ShopProduct, query: string) {
  const searchable = [
    product.name,
    product.category,
    product.size,
    product.usesLine,
    product.description,
    ...product.useFor,
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(query.toLowerCase().trim());
}

export default function StoneCareShopPage() {
  const { products: shopProducts, isLoading } = useAdminProductsState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(priceRanges[0]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedUses, setSelectedUses] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("Popular");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useSeo({
    title: "Marble Care Products | TECHNOSHINE Stonecare Shop",
    description:
      "Browse TECHNOSHINE marble care products for cleaning, polishing, sealing, stain removal, and professional stone restoration. Available through Shopee.",
  });

  const toggleSize = (size: string) => {
    setSelectedSizes((current) =>
      current.includes(size) ? current.filter((item) => item !== size) : [...current, size],
    );
  };

  const toggleUse = (use: string) => {
    setSelectedUses((current) =>
      current.includes(use) ? current.filter((item) => item !== use) : [...current, use],
    );
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setPriceRange(priceRanges[0]);
    setSelectedSizes([]);
    setSelectedUses([]);
    setSearch("");
  };

  const visibleProducts = useMemo(() => {
    const filtered = shopProducts.filter((product) => {
      const matchesSearch = !search.trim() || productMatchesSearch(product, search);
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(product.size);
      const matchesUse =
        selectedUses.length === 0 ||
        selectedUses.some((use) => product.useFor.includes(use as ShopProduct["useFor"][number]));
      const matchesPrice = priceRange === "All prices" || product.price <= 500;

      return matchesSearch && matchesCategory && matchesSize && matchesUse && matchesPrice;
    });

    return filtered.sort((first, second) => {
      if (sortBy === "Newest") {
        return Number(Boolean(second.badge === "New Arrival")) - Number(Boolean(first.badge === "New Arrival"));
      }

      if (sortBy === "Stock left") {
        return first.stockLeft - second.stockLeft;
      }

      return second.stockLeft - first.stockLeft;
    });
  }, [activeCategory, priceRange, search, selectedSizes, selectedUses, shopProducts, sortBy]);

  const filters = (
    <FilterPanel
      activeCategory={activeCategory}
      priceRange={priceRange}
      selectedSizes={selectedSizes}
      selectedUses={selectedUses}
      onCategoryChange={setActiveCategory}
      onPriceRangeChange={setPriceRange}
      onToggleSize={toggleSize}
      onToggleUse={toggleUse}
      onClear={clearFilters}
    />
  );

  return (
    <ShopShell searchValue={search} onSearchChange={setSearch}>
      <section className="relative overflow-hidden bg-white px-4 py-12 text-[#1F1A17] sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="relative z-10">
            <span className="inline-flex rounded-full border border-[#FF6B00]/25 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D95B00] shadow-sm">
              Available on Shopee
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold uppercase tracking-normal text-[#1F1A17] sm:text-6xl">
              Shine is Simple.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Marble-safe cleaners, polish, sealers, and professional care products from TECHNOSHINE Stonecare &
              Restoration.
            </p>
          </div>
          <div className="relative z-10 hidden min-h-56 overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-6 shadow-2xl shadow-orange-100/70 backdrop-blur lg:block">
            {isLoading ? (
              <ShopHeroPreviewSkeleton />
            ) : (
              <div className="grid h-full grid-cols-3 items-end gap-4">
                {shopProducts.slice(0, 3).map((product) => (
                  <div key={product.slug} className="h-44 overflow-hidden rounded-2xl bg-white p-2 shadow-xl shadow-slate-200/70">
                    <div className="h-32 overflow-hidden rounded-xl">
                      <ProductVisual product={product} compact />
                    </div>
                    <p className="mt-2 text-center text-[0.66rem] font-bold uppercase leading-tight text-[#1F1A17]">
                      {product.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-3 border-b border-[#F0D8C6] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <nav aria-label="Breadcrumb" className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <Link href="/" className="transition hover:text-[#FF6B00]">
                  Home
                </Link>
                <span className="mx-2 text-neutral-300">›</span>
                <span>Stone Care</span>
                <span className="mx-2 text-neutral-300">›</span>
                <span className="text-[#1F1A17]">Shops</span>
              </nav>
              {isLoading ? (
                <Skeleton className="mt-3 h-4 w-44 rounded-sm" aria-hidden="true" />
              ) : (
                <p className="mt-3 text-sm font-semibold text-neutral-600">
                  Showing {visibleProducts.length} of {shopProducts.length} products
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#F0D8C6] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#1F1A17] shadow-sm transition hover:border-[#FF6B00] hover:text-[#FF6B00] lg:hidden"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_1fr]">
            <div className="hidden lg:block">{filters}</div>

            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F0D8C6] bg-white p-3 shadow-sm shadow-slate-200/60">
                <div className="flex items-center gap-1 rounded-full border border-[#F0D8C6] bg-[#FFF8F2] p-1">
                  <button
                    type="button"
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-sm transition",
                      viewMode === "grid" ? "bg-[#FF6B00] text-white" : "text-[#1F1A17] hover:text-[#FF6B00]",
                    ].join(" ")}
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                    title="List view"
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-sm transition",
                      viewMode === "list" ? "bg-[#FF6B00] text-white" : "text-[#1F1A17] hover:text-[#FF6B00]",
                    ].join(" ")}
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
                  Sort by:
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.currentTarget.value)}
                    className="min-h-10 rounded-full border border-[#F0D8C6] bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#1F1A17] outline-none focus:border-[#FF6B00]"
                  >
                    <option>Popular</option>
                    <option>Newest</option>
                    <option>Stock left</option>
                  </select>
                </label>
              </div>

              {isLoading ? (
                <div
                  className={
                    viewMode === "list"
                      ? "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1"
                      : "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
                  }
                >
                  <ProductCardSkeletons count={viewMode === "list" ? 4 : 8} layout={viewMode} />
                </div>
              ) : visibleProducts.length > 0 ? (
                <div
                  className={
                    viewMode === "list"
                      ? "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1"
                      : "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
                  }
                >
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.slug} product={product} layout={viewMode} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#F0D8C6] bg-white px-5 py-14 text-center">
                  <h2 className="font-display text-2xl font-bold uppercase tracking-normal text-[#1F1A17]">
                    No products found
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
                    Try clearing a filter or searching for another marble care product.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 bg-[#1F1A17]/45 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-y-0 left-0 w-[min(22rem,88vw)] overflow-y-auto bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-xl font-bold uppercase tracking-normal text-[#1F1A17]">
                Product Filters
              </p>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close filters"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F0D8C6] text-[#1F1A17]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filters}
          </div>
        </div>
      ) : null}
    </ShopShell>
  );
}
