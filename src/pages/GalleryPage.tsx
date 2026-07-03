import { BeforeAfter } from "@/components/BeforeAfter";
import { Gallery } from "@/components/Gallery";
import { SiteLayout } from "@/components/SiteLayout";
import { Link } from "wouter";

function NanoProtectedShieldVideo() {
  return (
    <section id="nano-protected-shield" className="relative h-[112svh] overflow-visible bg-black text-white sm:h-[118svh]">
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden bg-black px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center">
          <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-[0.08em] text-[#F5D27A] drop-shadow-[0_0_18px_rgba(245,210,122,0.34)] sm:text-5xl">
            NANO PROTECTED SHIELD
          </h2>

          <p className="mt-3 max-w-5xl text-xs italic leading-relaxed text-white/68 sm:text-sm lg:whitespace-nowrap">
            &quot;See it in action &mdash; a 30-second before &amp; after demo of our advanced nano-coating protection for natural stone surfaces.&quot;
          </p>

          <div className="mt-8 w-full max-w-[1040px] overflow-hidden rounded-md border-2 border-primary bg-black shadow-2xl shadow-primary/20">
            <div className="relative aspect-video w-full">
              <span className="pointer-events-none absolute right-2 top-2 z-10 inline-flex border border-primary bg-primary px-2 py-1 font-mono text-[0.5rem] font-bold uppercase tracking-[0.12em] text-white shadow-lg sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[0.62rem] sm:tracking-[0.18em]">
                NEW PRODUCT
              </span>
              <iframe
                src="https://www.youtube.com/embed/cd5ym8cx83U?rel=0&modestbranding=1"
                title="NANO PROTECTED SHIELD demo"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>

          <Link
            href="/contact"
            className="mt-8 inline-flex min-h-12 items-center justify-center border border-primary bg-primary px-7 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-transparent hover:text-primary"
          >
            REQUEST A QUOTE
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function GalleryPage() {
  return (
    <SiteLayout>
      <Gallery />
      <BeforeAfter />
      <NanoProtectedShieldVideo />
    </SiteLayout>
  );
}
