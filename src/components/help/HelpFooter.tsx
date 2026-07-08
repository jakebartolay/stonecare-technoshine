import { Home, LifeBuoy, Mail } from "lucide-react";
import { Link } from "wouter";

export function HelpFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white text-[#1F1A17]">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div className="flex min-w-0 items-start gap-3">
          <img src="/icon.png" alt="Technoshine" className="h-10 w-auto shrink-0" />
          <div className="min-w-0">
            <p className="font-display text-lg font-bold uppercase tracking-normal">
              TECHNOSHINE Help Center
            </p>
            <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-600">
              Product information, care instructions, and support references for QR-linked help pages.
            </p>
          </div>
        </div>

        <nav aria-label="Help footer links" className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-neutral-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/help"
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-neutral-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
          >
            <LifeBuoy className="h-4 w-4" />
            Help
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-neutral-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
          >
            <Mail className="h-4 w-4" />
            Contact
          </Link>
        </nav>
      </div>

      <div className="border-t border-neutral-100 px-4 py-4 sm:px-6 lg:px-8">
        <p className="mx-auto w-full max-w-6xl text-xs font-mono text-neutral-500">
          &copy; {year} Technoshine. Help Center.
        </p>
      </div>
    </footer>
  );
}
