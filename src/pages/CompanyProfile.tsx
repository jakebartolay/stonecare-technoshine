import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL;
const PROFILE_PAGES = Array.from(
  { length: 30 },
  (_, index) =>
    `${BASE_URL}company-profile/pages/page-${String(index + 1).padStart(2, "0")}.jpg`,
);
const ICON_URL = `${BASE_URL}icon.png`;
const PAGE_WIDTH = 420;
const PAGE_HEIGHT = 594;
const MIN_PAGE_WIDTH = 96;
const MIN_PAGE_HEIGHT = Math.round((MIN_PAGE_WIDTH * PAGE_HEIGHT) / PAGE_WIDTH);
const BOOK_FRAME_INSET = 12;
const PAGE_LOAD_RADIUS = 4;
const INITIAL_PROFILE_PAGE = 1;

type BookSize = {
  pageWidth: number;
  pageHeight: number;
  isPortrait: boolean;
};

function getContainedBookSize(frameWidth: number, frameHeight: number): BookSize {
  const isPortrait = frameWidth < 640;
  const pageCountWidth = isPortrait ? 1 : 2;
  const usableWidth = Math.max(
    MIN_PAGE_WIDTH * pageCountWidth,
    frameWidth - BOOK_FRAME_INSET,
  );
  const usableHeight = Math.max(MIN_PAGE_HEIGHT, frameHeight - BOOK_FRAME_INSET);
  const widthBound = usableWidth / pageCountWidth;
  const heightBound = (usableHeight * PAGE_WIDTH) / PAGE_HEIGHT;
  const pageWidth = Math.floor(
    Math.max(MIN_PAGE_WIDTH, Math.min(PAGE_WIDTH, widthBound, heightBound)),
  );

  return {
    pageWidth,
    pageHeight: Math.floor((pageWidth * PAGE_HEIGHT) / PAGE_WIDTH),
    isPortrait,
  };
}

function getPageLoadWindow(activePage: number, totalPages: number): number[] {
  if (activePage > totalPages) {
    const startPage = Math.max(1, totalPages - PAGE_LOAD_RADIUS + 1);

    return Array.from(
      { length: totalPages - startPage + 1 },
      (_, index) => startPage + index,
    );
  }

  const startPage = Math.max(
    1,
    activePage <= 0 ? 1 : activePage - PAGE_LOAD_RADIUS,
  );
  const endPage = Math.min(
    totalPages,
    activePage <= 0 ? PAGE_LOAD_RADIUS : activePage + PAGE_LOAD_RADIUS,
  );

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );
}

type FlipBookRef = {
  pageFlip: () => {
    flipNext: (corner?: "top" | "bottom") => void;
    flipPrev: (corner?: "top" | "bottom") => void;
    flip: (page: number, corner?: "top" | "bottom") => void;
    turnToNextPage: () => void;
    turnToPrevPage: () => void;
    turnToPage: (page: number) => void;
    getPageCollection?: () => {
      getPages?: () => Array<{
        setDensity?: (density: "soft" | "hard") => void;
        setDrawingDensity?: (density: "soft" | "hard") => void;
      }>;
    };
  };
};

type PdfPageProps = {
  pageNumber: number;
  imageSrc: string;
  shouldLoad: boolean;
};

const PdfPage = forwardRef<HTMLDivElement, PdfPageProps>(
  ({ pageNumber, imageSrc, shouldLoad }, ref) => {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setHasLoaded(false);
      setHasError(false);
    }, [imageSrc]);

    return (
      <div
        ref={ref}
        data-density="hard"
        className="company-profile-page relative flex h-full w-full items-center justify-center overflow-hidden bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
      >
        {shouldLoad && !hasLoaded && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-black/45">
              Loading page {pageNumber}
            </p>
          </div>
        )}
        {hasError && (
          <div className="px-8 text-center font-mono text-xs uppercase tracking-[0.16em] text-red-700">
            Page {pageNumber} could not be loaded.
          </div>
        )}
        {shouldLoad && (
          <img
            src={imageSrc}
            alt={`Technoshine profile page ${pageNumber}`}
            loading={pageNumber <= 2 ? "eager" : "lazy"}
            decoding="async"
            width={PAGE_WIDTH}
            height={PAGE_HEIGHT}
            className="h-full w-full object-contain"
            draggable={false}
            onLoad={() => setHasLoaded(true)}
            onError={() => setHasError(true)}
          />
        )}
        <span className="absolute bottom-3 right-4 rounded-full bg-black/55 px-2 py-1 font-mono text-[10px] text-white">
          {pageNumber}
        </span>
      </div>
    );
  },
);

PdfPage.displayName = "PdfPage";

type ProfileCoverPageProps = {
  variant: "front" | "back";
};

const ProfileCoverPage = forwardRef<HTMLDivElement, ProfileCoverPageProps>(
  ({ variant }, ref) => {
    const isFront = variant === "front";
    const isBack = variant === "back";

    return (
      <div
        ref={ref}
        data-density="hard"
        className="company-profile-cover relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-[#120f0b] p-4 text-center text-white sm:gap-8 sm:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,0,0.2),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.14),transparent_38%),linear-gradient(160deg,#18130d,#080706_72%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <div className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="absolute -right-16 top-12 h-44 w-44 rotate-45 border border-primary/30" />
        <div className="absolute -left-14 bottom-16 h-36 w-36 rotate-45 border border-white/10" />

        <div className="relative z-10 flex flex-col items-center">
          <img src={ICON_URL} alt="" className="h-10 w-auto sm:h-16" draggable={false} />
          <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.18em] text-primary sm:mt-8 sm:text-xs sm:tracking-[0.24em]">
            {isFront ? "Interactive Company Profile" : "Technoshine"}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="font-display text-[clamp(1.15rem,7vw,2rem)] font-black uppercase leading-[0.9] tracking-normal text-white sm:text-[clamp(2rem,8vw,3.75rem)]">
            {isFront ? "Technoshine" : "Thank You"}
          </h2>
          <p className="mt-3 max-w-[12rem] text-center text-[10px] leading-relaxed text-white/55 sm:mt-4 sm:max-w-xs sm:text-sm">
            {isFront
              ? "Premium marble, granite, terrazzo, and natural stone restoration specialists."
              : "For inquiries and project coordination, contact Technoshine through the details on this site."}
          </p>
        </div>

        <div className="absolute bottom-4 right-4 z-10 sm:bottom-8 sm:right-8">
          <span aria-hidden="true" />
          <div className="h-9 w-9 rotate-45 border border-primary/60 bg-primary/10 sm:h-14 sm:w-14" />
        </div>
      </div>
    );
  },
);

ProfileCoverPage.displayName = "ProfileCoverPage";

type HoverPeek = "previous-top" | "previous-bottom" | "next-top" | "next-bottom";

export default function CompanyProfile() {
  const bookRef = useRef<FlipBookRef | null>(null);
  const bookFrameRef = useRef<HTMLDivElement | null>(null);
  const pages = PROFILE_PAGES;
  const [activePage, setActivePage] = useState(INITIAL_PROFILE_PAGE);
  const [hoverPeek, setHoverPeek] = useState<HoverPeek | null>(null);
  const [loadedPageNumbers, setLoadedPageNumbers] = useState<Set<number>>(
    () => new Set(getPageLoadWindow(INITIAL_PROFILE_PAGE, PROFILE_PAGES.length)),
  );
  const [bookSize, setBookSize] = useState<BookSize>(() =>
    getContainedBookSize(
      typeof window === "undefined" ? PAGE_WIDTH * 2 : window.innerWidth - 32,
      typeof window === "undefined" ? PAGE_HEIGHT : window.innerHeight - 190,
    ),
  );
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const nextPageNumbers = getPageLoadWindow(activePage, pages.length);

    setLoadedPageNumbers((currentPageNumbers) => {
      const mergedPageNumbers = new Set(currentPageNumbers);
      let hasNewPage = false;

      nextPageNumbers.forEach((pageNumber) => {
        if (!mergedPageNumbers.has(pageNumber)) {
          mergedPageNumbers.add(pageNumber);
          hasNewPage = true;
        }
      });

      return hasNewPage ? mergedPageNumbers : currentPageNumbers;
    });
  }, [activePage, pages.length]);

  useEffect(() => {
    const frame = bookFrameRef.current;
    if (!frame) return;

    let animationFrame = 0;
    const updateBookSize = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const { width, height } = frame.getBoundingClientRect();
        if (width <= 0 || height <= 0) return;

        const nextSize = getContainedBookSize(width, height);
        setBookSize((currentSize) =>
          currentSize.pageWidth === nextSize.pageWidth &&
          currentSize.pageHeight === nextSize.pageHeight &&
          currentSize.isPortrait === nextSize.isPortrait
            ? currentSize
            : nextSize,
        );
      });
    };

    updateBookSize();

    const observer = new ResizeObserver(updateBookSize);
    observer.observe(frame);
    window.addEventListener("resize", updateBookSize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", updateBookSize);
    };
  }, []);

  const canGoPrev = activePage > 0;
  const canGoNext = activePage < pages.length + 1;
  const hoverPreviewPage = hoverPeek?.startsWith("next")
    ? activePage === 0
      ? 1
      : activePage + 2
    : activePage - 1;
  const hoverPreviewSrc =
    hoverPreviewPage >= 1 && hoverPreviewPage <= pages.length
      ? pages[hoverPreviewPage - 1]
      : null;

  const forceHardPageDensity = () => {
    const flip = bookRef.current?.pageFlip();
    const bookPages = flip?.getPageCollection?.().getPages?.() ?? [];

    bookPages.forEach((page) => {
      page.setDensity?.("hard");
      page.setDrawingDensity?.("hard");
    });
  };

  const scheduleHardPageRefresh = () => {
    forceHardPageDensity();
    window.requestAnimationFrame(forceHardPageDensity);
    window.setTimeout(forceHardPageDensity, 120);
  };

  const goPrev = () => {
    if (!canGoPrev) return;

    setHoverPeek(null);
    scheduleHardPageRefresh();
    bookRef.current?.pageFlip().turnToPrevPage();
  };
  const goNext = () => {
    if (!canGoNext) return;

    setHoverPeek(null);
    scheduleHardPageRefresh();
    bookRef.current?.pageFlip().turnToNextPage();
  };
  const handleBookPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const handleBookPointerUp = (event: PointerEvent<HTMLDivElement>) => {
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
  const handleBookMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const edgeSize = Math.min(84, rect.width * 0.16);
    const isTopCorner = y <= edgeSize;
    const isBottomCorner = y >= rect.height - edgeSize;
    let nextPeek: HoverPeek | null = null;

    if (isTopCorner || isBottomCorner) {
      const corner = isTopCorner ? "top" : "bottom";

      if (x <= edgeSize && canGoPrev) {
        nextPeek = `previous-${corner}` as HoverPeek;
      } else if (x >= rect.width - edgeSize && canGoNext) {
        nextPeek = `next-${corner}` as HoverPeek;
      }
    }

    setHoverPeek((currentPeek) => (currentPeek === nextPeek ? currentPeek : nextPeek));
  };
  const currentLabel =
    activePage === 0
      ? "Cover"
      : activePage > pages.length
        ? "Back Cover"
        : `Page ${activePage} of ${pages.length}`;
  const safeStartPage = Math.min(activePage, pages.length + 1);
  const flipBookPages = useMemo(
    () => [
      <ProfileCoverPage key="profile-cover-front" variant="front" />,
      ...pages.map((imageSrc, index) => {
        const pageNumber = index + 1;

        return (
          <PdfPage
            key={imageSrc}
            pageNumber={pageNumber}
            imageSrc={imageSrc}
            shouldLoad={loadedPageNumbers.has(pageNumber)}
          />
        );
      }),
      <ProfileCoverPage key="profile-cover-back" variant="back" />,
    ],
    [loadedPageNumbers, pages],
  );

  return (
    <main className="company-profile-shell relative h-screen h-[100dvh] overflow-hidden bg-background text-foreground">
      <Link
        href="/"
        className="absolute left-4 top-4 z-[140] inline-flex h-10 items-center gap-2 border border-black/10 bg-white/90 px-3 font-mono text-xs uppercase tracking-[0.16em] text-black/70 shadow-sm backdrop-blur transition-colors hover:border-primary hover:text-primary sm:left-6 sm:top-6"
        aria-label="Back to home"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <section className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-4 pt-5 sm:justify-start sm:px-6 sm:pt-6 lg:px-8">
          <div className="company-profile-heading mx-auto flex w-full max-w-[1180px] shrink-0 flex-col items-center pb-2 text-center sm:pb-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              Company Profile
            </p>
            <h1 className="mx-auto mt-1 max-w-xs text-center text-xl leading-tight text-black sm:max-w-none sm:text-3xl">
              Technoshine Profile
            </h1>
            <p className="mx-auto mt-2 hidden max-w-2xl text-sm leading-relaxed text-black/60 sm:block">
              Stone restoration, polishing, and surface care credentials for residential and commercial projects.
            </p>
          </div>

          <div
            ref={bookFrameRef}
            className="relative mx-auto flex h-[68vh] min-h-[430px] w-full flex-none items-center justify-center overflow-visible text-center sm:h-auto sm:min-h-0 sm:flex-1"
          >
            <div className="relative mx-auto flex w-full max-w-[1040px] items-center justify-center overflow-visible">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="group absolute left-0 z-20 hidden h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur transition-all hover:border-primary/80 hover:bg-primary hover:text-white hover:shadow-[0_18px_44px_rgba(255,107,0,0.24)] disabled:cursor-not-allowed disabled:border-black/5 disabled:bg-white/50 disabled:text-black/20 disabled:shadow-none disabled:hover:border-black/5 disabled:hover:bg-white/50 disabled:hover:text-black/20 lg:flex"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <div className="company-profile-book-shell company-profile-reader-shell mx-auto w-full overflow-visible rounded-sm border border-black/10 bg-white/90 p-1 sm:p-3">
              <div
                className="company-profile-book-stage relative mx-auto w-full"
                onMouseLeave={() => setHoverPeek(null)}
                onMouseMove={handleBookMouseMove}
                onPointerCancel={() => {
                  swipeStartRef.current = null;
                }}
                onPointerDown={handleBookPointerDown}
                onPointerUp={handleBookPointerUp}
              >
                <HTMLFlipBook
                  key={`${bookSize.pageWidth}x${bookSize.pageHeight}-${bookSize.isPortrait}-${pages.length}`}
                  ref={bookRef}
                  className="company-profile-book mx-auto"
                  style={{}}
                  width={bookSize.pageWidth}
                  height={bookSize.pageHeight}
                  minWidth={MIN_PAGE_WIDTH}
                  maxWidth={bookSize.pageWidth}
                  minHeight={MIN_PAGE_HEIGHT}
                  maxHeight={bookSize.pageHeight}
                  size="stretch"
                  startPage={safeStartPage}
                  drawShadow
                  flippingTime={900}
                  usePortrait={bookSize.isPortrait}
                  startZIndex={20}
                  autoSize
                  maxShadowOpacity={0.3}
                  showCover
                  mobileScrollSupport={false}
                  clickEventForward
                  useMouseEvents={false}
                  swipeDistance={20}
                  showPageCorners={false}
                  disableFlipByClick={false}
                  onInit={(event) => {
                    setActivePage(event.data?.page ?? safeStartPage);
                    scheduleHardPageRefresh();
                  }}
                  onUpdate={scheduleHardPageRefresh}
                  onChangeState={scheduleHardPageRefresh}
                  onFlip={(event) => {
                    setActivePage(event.data);
                    setHoverPeek(null);
                    scheduleHardPageRefresh();
                  }}
                >
                  {flipBookPages}
                </HTMLFlipBook>

                {hoverPeek && hoverPreviewSrc && (
                  <div
                    aria-hidden="true"
                    className="company-profile-page-peek"
                    data-peek={hoverPeek}
                  >
                    <img
                      src={hoverPreviewSrc}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                )}
                </div>
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="group absolute right-0 z-20 hidden h-14 w-14 translate-x-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur transition-all hover:border-primary/80 hover:bg-primary hover:text-white hover:shadow-[0_18px_44px_rgba(255,107,0,0.24)] disabled:cursor-not-allowed disabled:border-black/5 disabled:bg-white/50 disabled:text-black/20 disabled:shadow-none disabled:hover:border-black/5 disabled:hover:bg-white/50 disabled:hover:text-black/20 lg:flex"
              aria-label="Next page"
            >
              <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
            </button>
            </div>
          </div>

          <div className="company-profile-controls mx-auto mt-1 flex w-full max-w-[1040px] shrink-0 flex-wrap items-center justify-center gap-2 pt-1 text-center sm:mt-3 sm:justify-between sm:gap-3 sm:border-t sm:border-black/10 sm:pt-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="order-2 inline-flex h-11 items-center justify-center gap-2 border border-black/10 bg-white px-4 font-display text-xs font-bold uppercase tracking-wider text-black transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:text-black/25 sm:order-none lg:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <p className="order-1 w-full text-center font-mono text-xs uppercase tracking-[0.18em] text-black/60 sm:order-none sm:w-auto">
              {currentLabel}
            </p>

            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="order-3 inline-flex h-11 items-center justify-center gap-2 border border-black/10 bg-white px-4 font-display text-xs font-bold uppercase tracking-wider text-black transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:text-black/25 sm:order-none lg:hidden"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
