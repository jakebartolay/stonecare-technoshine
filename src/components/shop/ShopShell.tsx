import type { ReactNode } from "react";
import { BadgeCheck, Search, ShieldCheck, Truck } from "lucide-react";
import { Link } from "wouter";

interface ShopShellProps {
  children: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/stone-care/shops" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export function ShopShell({ children, searchValue, onSearchChange }: ShopShellProps) {
  const hasSearch = typeof searchValue === "string" && Boolean(onSearchChange);

  return (
    <div className="min-h-screen bg-white text-[#1F1A17]">
      <div className="border-b border-[#F0D8C6] bg-white text-[#6B3A12]">
        <div className="mx-auto flex min-h-10 w-full max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-wide sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-[#FF6B00]" />
            Ship from Philippines
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FF6B00]" />
            Marble-safe care
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="h-3.5 w-3.5 text-[#FF6B00]" />
            Official product catalog
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#F0D8C6] bg-white/85 shadow-sm shadow-slate-200/60 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-3 px-4 py-3 sm:px-6 md:grid-cols-[auto_1fr] lg:px-8">
          <Link href="/" className="inline-flex items-center text-xl font-black uppercase tracking-normal text-[#1F1A17] sm:text-2xl">
            TECHNO<span className="text-[#FF6B00]">SHINE</span>
          </Link>

          {hasSearch ? (
            <label className="order-3 col-span-2 flex min-h-11 items-center gap-2 rounded-full border border-[#F0D8C6] bg-white px-4 text-sm text-slate-500 md:order-none md:col-span-1 md:mx-auto md:w-full md:max-w-xl">
              <Search className="h-4 w-4 shrink-0 text-[#FF6B00]" />
              <span className="sr-only">Search products</span>
              <input
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.currentTarget.value)}
                placeholder="Search marble care products"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#1F1A17] outline-none placeholder:text-slate-400"
              />
            </label>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#F0D8C6] bg-white px-4 py-10 text-[#1F1A17] sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <Link href="/" className="inline-flex text-2xl font-black uppercase tracking-normal">
              TECHNO<span className="text-[#FF6B00]">SHINE</span>
            </Link>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
              Browse marble-safe product information, then open the product page when you are ready to purchase.
            </p>
          </div>
          <nav aria-label="Shop footer links" className="sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF6B00]">
              Quick Links
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-[#1F1A17] transition hover:text-[#FF6B00]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </footer>
    </div>
  );
}
