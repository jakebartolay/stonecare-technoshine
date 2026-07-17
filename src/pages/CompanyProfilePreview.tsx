import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL;
const PROFILE_PAGE_COUNT = 26;
const PROFILE_ASSET_VERSION = "20260715";
const PROFILE_PAGES = Array.from(
  { length: PROFILE_PAGE_COUNT },
  (_, index) =>
    `${BASE_URL}company-profile/pages/2026-PRESENT/${index + 1}.jpg?v=${PROFILE_ASSET_VERSION}`,
);
const DESKTOP_QUERY = "(min-width: 1024px)";

function isControlTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("button, a"));
}

export default function CompanyProfilePreview() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pagesPerView, setPagesPerView] = useState(() =>
    typeof window === "undefined" || !window.matchMedia(DESKTOP_QUERY).matches ? 1 : 2,
  );
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const visiblePages = useMemo(
    () =>
      PROFILE_PAGES.slice(
        pageIndex,
        Math.min(pageIndex + pagesPerView, PROFILE_PAGES.length),
      ),
    [pageIndex, pagesPerView],
  );

  const pageStep = pagesPerView;
  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex + pagesPerView < PROFILE_PAGES.length;
  const pageLabel =
    pagesPerView === 1
      ? `Page ${pageIndex + 1} of ${PROFILE_PAGES.length}`
      : `Pages ${pageIndex + 1}-${Math.min(
          pageIndex + pagesPerView,
          PROFILE_PAGES.length,
        )} of ${PROFILE_PAGES.length}`;

  const goPrev = () => {
    setPageIndex((currentIndex) => Math.max(0, currentIndex - pageStep));
  };

  const goNext = () => {
    setPageIndex((currentIndex) =>
      Math.min(PROFILE_PAGES.length - pagesPerView, currentIndex + pageStep),
    );
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const updatePagesPerView = () => {
      const nextPagesPerView = mediaQuery.matches ? 2 : 1;

      setPagesPerView(nextPagesPerView);
      setPageIndex((currentIndex) => {
        const alignedIndex =
          nextPagesPerView === 2 ? currentIndex - (currentIndex % 2) : currentIndex;

        return Math.min(
          Math.max(0, alignedIndex),
          PROFILE_PAGES.length - nextPagesPerView,
        );
      });
    };

    updatePagesPerView();
    mediaQuery.addEventListener("change", updatePagesPerView);

    return () => mediaQuery.removeEventListener("change", updatePagesPerView);
  }, []);

  useEffect(() => {
    PROFILE_PAGES.slice(0, 4).forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    const nextPreloadPages = PROFILE_PAGES.slice(
      pageIndex,
      Math.min(PROFILE_PAGES.length, pageIndex + 4),
    );

    nextPreloadPages.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [pageIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageStep, pagesPerView]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isControlTarget(event.target)) return;

    swipeStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;

    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (Math.abs(dx) < 48 || Math.abs(dy) > 80) return;

    if (dx < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  return (
    <main className="relative h-screen h-[100dvh] overflow-hidden bg-[#f3f4f2] text-foreground">
      <Link
        href="/"
        className="absolute left-1/2 top-3 z-30 inline-flex h-10 -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/85 px-4 font-display text-xs font-bold uppercase tracking-wider text-black/70 shadow-sm backdrop-blur transition-colors hover:border-primary hover:text-primary sm:top-5"
        aria-label="Back to home"
        title="Back to home"
      >
        <Home className="h-4 w-4" />
        Back to home
      </Link>

      <section
        className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden px-2 py-3 sm:px-5 sm:py-6"
        onPointerCancel={() => {
          swipeStartRef.current = null;
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.92),transparent_46%),linear-gradient(180deg,#ffffff_0%,#ecefed_100%)]" />

        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          className="absolute left-3 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-[0_18px_42px_rgba(0,0,0,0.16)] backdrop-blur transition-all hover:border-primary/80 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white/45 disabled:text-black/20 lg:flex"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="relative z-10 grid h-full w-full max-w-[calc(100vw-1rem)] grid-cols-1 place-items-center gap-0 sm:max-w-[calc(100vw-2.5rem)] lg:max-w-[calc(100vw-9rem)] lg:grid-cols-2">
          {visiblePages.map((src, index) => {
            const pageNumber = pageIndex + index + 1;

            return (
              <figure
                key={src}
                className={`flex h-full min-h-0 w-full items-center ${
                  pagesPerView === 2
                    ? index === 0
                      ? "justify-end"
                      : "justify-start"
                    : "justify-center"
                }`}
              >
                <img
                  src={src}
                  alt={`Technoshine company profile page ${pageNumber}`}
                  width={2000}
                  height={1414}
                  loading="eager"
                  decoding={pageNumber <= 4 ? "sync" : "async"}
                  fetchPriority={pageNumber <= 4 ? "high" : "auto"}
                  className="h-auto w-auto max-h-full max-w-full object-contain shadow-[0_24px_68px_rgba(0,0,0,0.18)]"
                  draggable={false}
                />
              </figure>
            );
          })}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          className="absolute right-3 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-[0_18px_42px_rgba(0,0,0,0.16)] backdrop-blur transition-all hover:border-primary/80 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-white/45 disabled:text-black/20 lg:flex"
          aria-label="Next page"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 mx-auto flex w-full max-w-[1240px] items-center justify-center gap-2 px-3 text-center sm:bottom-5 sm:gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="pointer-events-auto inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 font-display text-xs font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:text-black/25 lg:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <p className="pointer-events-auto rounded-full border border-black/10 bg-white/85 px-3 py-2 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-black/60 shadow-sm backdrop-blur">
            {pageLabel}
          </p>

          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="pointer-events-auto inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 font-display text-xs font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:text-black/25 lg:hidden"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
