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
import { ChevronLeft, ChevronRight, Download, Home, RotateCcw } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const PDF_URL = `${import.meta.env.BASE_URL}company-profile/technoshine-profile.pdf`;
const TOTAL_PAGES = 30;
const PAGE_WIDTH = 420;
const PAGE_HEIGHT = 594;
const MIN_PAGE_WIDTH = 96;
const MIN_PAGE_HEIGHT = Math.round((MIN_PAGE_WIDTH * PAGE_HEIGHT) / PAGE_WIDTH);
const BOOK_FRAME_INSET = 28;

type BookSize = {
  pageWidth: number;
  pageHeight: number;
};

function getContainedBookSize(frameWidth: number, frameHeight: number): BookSize {
  const usableWidth = Math.max(MIN_PAGE_WIDTH * 2, frameWidth - BOOK_FRAME_INSET);
  const usableHeight = Math.max(MIN_PAGE_HEIGHT, frameHeight - BOOK_FRAME_INSET);
  const widthBound = usableWidth / 2;
  const heightBound = (usableHeight * PAGE_WIDTH) / PAGE_HEIGHT;
  const pageWidth = Math.floor(
    Math.max(MIN_PAGE_WIDTH, Math.min(PAGE_WIDTH, widthBound, heightBound)),
  );

  return {
    pageWidth,
    pageHeight: Math.floor((pageWidth * PAGE_HEIGHT) / PAGE_WIDTH),
  };
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
  pdf: PDFDocumentProxy | null;
  shouldRender: boolean;
  onRendered?: (pageNumber: number, imageSrc: string) => void;
};

const PdfPage = forwardRef<HTMLDivElement, PdfPageProps>(
  ({ pageNumber, pdf, shouldRender, onRendered }, ref) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isRendered, setIsRendered] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      if (!pdf || !shouldRender || isRendered) return;

      let cancelled = false;
      let page: PDFPageProxy | null = null;

      const renderPage = async () => {
        try {
          page = await pdf.getPage(pageNumber);
          if (cancelled) return;

          const viewport = page.getViewport({ scale: 1 });
          const scale = Math.min(PAGE_WIDTH / viewport.width, PAGE_HEIGHT / viewport.height) * 2;
          const scaledViewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d", { alpha: false });
          if (!context) return;

          canvas.width = Math.floor(scaledViewport.width);
          canvas.height = Math.floor(scaledViewport.height);
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvas, canvasContext: context, viewport: scaledViewport }).promise;
          if (!cancelled) {
            const renderedImage = canvas.toDataURL("image/jpeg", 0.92);
            setImageSrc(renderedImage);
            setIsRendered(true);
            onRendered?.(pageNumber, renderedImage);
          }

          canvas.width = 1;
          canvas.height = 1;
        } catch {
          if (!cancelled) {
            setHasError(true);
          }
        }
      };

      renderPage();

      return () => {
        cancelled = true;
        page?.cleanup();
      };
    }, [isRendered, onRendered, pageNumber, pdf, shouldRender]);

    return (
      <div
        ref={ref}
        data-density="hard"
        className="company-profile-page relative flex h-full w-full items-center justify-center overflow-hidden bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
      >
        {!isRendered && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f6f3ed] text-center">
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
        {imageSrc && (
          <img
            src={imageSrc}
            alt={`TechnoShine profile page ${pageNumber}`}
            className="h-full w-full object-contain"
            draggable={false}
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
        className="company-profile-cover relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#120f0b] p-8 text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,0,0.2),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.14),transparent_38%),linear-gradient(160deg,#18130d,#080706_72%)]" />
        <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <div className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="absolute -right-16 top-12 h-44 w-44 rotate-45 border border-primary/30" />
        <div className="absolute -left-14 bottom-16 h-36 w-36 rotate-45 border border-white/10" />

        <div className="relative z-10">
          <img src="/icon.png" alt="" className="h-16 w-auto" draggable={false} />
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.24em] text-primary">
            {isFront ? "Interactive Company Profile" : "TechnoShine"}
          </p>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-[clamp(2rem,8vw,3.75rem)] font-black uppercase leading-[0.9] tracking-normal text-white">
            {isFront ? "TechnoShine" : "Thank You"}
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            {isFront
              ? "Premium marble, granite, terrazzo, and natural stone restoration specialists."
              : "For inquiries and project coordination, contact TechnoShine through the details on this site."}
          </p>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-4">
          <span aria-hidden="true" />
          <div className="h-14 w-14 rotate-45 border border-primary/60 bg-primary/10" />
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
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [error, setError] = useState(false);
  const [pageImages, setPageImages] = useState<Record<number, string>>({});
  const [hoverPeek, setHoverPeek] = useState<HoverPeek | null>(null);
  const [bookSize, setBookSize] = useState<BookSize>(() =>
    getContainedBookSize(
      typeof window === "undefined" ? PAGE_WIDTH * 2 : window.innerWidth - 32,
      typeof window === "undefined" ? PAGE_HEIGHT : window.innerHeight - 190,
    ),
  );
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const task = pdfjsLib.getDocument(PDF_URL);

    task.promise
      .then((loadedPdf) => {
        if (cancelled) return;
        setPdf(loadedPdf);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      task.destroy();
    };
  }, []);

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
          currentSize.pageHeight === nextSize.pageHeight
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

  const pages = useMemo(
    () =>
      Array.from({ length: pdf?.numPages ?? TOTAL_PAGES }, (_, index) => index + 1),
    [pdf?.numPages],
  );
  const canGoPrev = activePage > 0;
  const canGoNext = activePage < pages.length + 1;
  const hoverPreviewPage = hoverPeek?.startsWith("next")
    ? activePage === 0
      ? 1
      : activePage + 2
    : activePage - 1;
  const hoverPreviewSrc =
    hoverPreviewPage >= 1 && hoverPreviewPage <= pages.length
      ? pageImages[hoverPreviewPage]
      : null;

  const handlePageRendered = (pageNumber: number, renderedImage: string) => {
    setPageImages((currentImages) => {
      if (currentImages[pageNumber] === renderedImage) return currentImages;
      return { ...currentImages, [pageNumber]: renderedImage };
    });
  };

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
  const goCover = () => {
    if (!canGoPrev) return;

    setHoverPeek(null);
    scheduleHardPageRefresh();
    bookRef.current?.pageFlip().turnToPage(0);
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

  return (
    <main className="relative h-screen h-[100dvh] overflow-hidden bg-background text-foreground">
      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <header className="company-profile-header flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goCover}
              disabled={!canGoPrev}
              className="inline-flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
              aria-label="Back to cover"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <a
              href={PDF_URL}
              download
              className="inline-flex h-10 items-center gap-2 border border-primary/80 px-4 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-primary hover:text-white"
            >
              <Download className="h-4 w-4" />
              PDF
            </a>
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col items-center overflow-hidden px-4 pb-3 sm:px-6 lg:px-8">
          <div className="company-profile-heading shrink-0 pb-3 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              Interactive Company Profile
            </p>
            <h1 className="mt-1 text-2xl leading-tight text-foreground sm:text-3xl">
              TechnoShine Profile
            </h1>
          </div>

          <div
            ref={bookFrameRef}
            className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-visible"
          >
            <div className="relative flex w-full max-w-[980px] items-center justify-center overflow-visible">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="group absolute left-0 z-20 hidden h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur transition-all hover:border-primary/80 hover:bg-primary hover:text-white hover:shadow-[0_0_30px_rgba(255,107,0,0.35)] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-black/35 disabled:text-white/25 disabled:shadow-none disabled:hover:border-white/10 disabled:hover:bg-black/35 disabled:hover:text-white/25 lg:flex"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <div className="company-profile-book-shell w-full overflow-visible rounded-sm border border-border bg-background p-2 shadow-2xl sm:p-3">
              {loading && (
                <div className="flex min-h-[42vh] flex-col items-center justify-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Loading company profile
                  </p>
                </div>
              )}

              {error && (
                <div className="flex min-h-[42vh] flex-col items-center justify-center gap-4 text-center">
                  <p className="font-display text-2xl text-foreground">
                    Company profile could not be loaded.
                  </p>
                  <a href={PDF_URL} className="font-mono text-xs uppercase tracking-widest text-primary">
                    Open PDF directly
                  </a>
                </div>
              )}

              {!loading && !error && (
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
                    key={`${bookSize.pageWidth}x${bookSize.pageHeight}-${pages.length}`}
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
                    usePortrait={false}
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
                    renderOnlyPageLengthChange
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
                    <ProfileCoverPage variant="front" />
                    {pages.map((pageNumber) => (
                      <PdfPage
                        key={pageNumber}
                        pageNumber={pageNumber}
                        pdf={pdf}
                        shouldRender={Boolean(pdf)}
                        onRendered={handlePageRendered}
                      />
                    ))}
                    <ProfileCoverPage variant="back" />
                  </HTMLFlipBook>

                  {hoverPeek && hoverPreviewSrc && (
                    <div
                      aria-hidden="true"
                      className="company-profile-page-peek"
                      data-peek={hoverPeek}
                    >
                      <img src={hoverPreviewSrc} alt="" draggable={false} />
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="group absolute right-0 z-20 hidden h-14 w-14 translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur transition-all hover:border-primary/80 hover:bg-primary hover:text-white hover:shadow-[0_0_30px_rgba(255,107,0,0.35)] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-black/35 disabled:text-white/25 disabled:shadow-none disabled:hover:border-white/10 disabled:hover:bg-black/35 disabled:hover:text-white/25 lg:flex"
              aria-label="Next page"
            >
              <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
            </button>
            </div>
          </div>

          <div className="company-profile-controls mt-2 flex w-full max-w-[980px] shrink-0 flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              className="inline-flex h-11 items-center gap-2 border border-border bg-background px-4 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:text-muted-foreground lg:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <p className="mx-auto font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {currentLabel}
            </p>

            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="inline-flex h-11 items-center gap-2 border border-border bg-background px-4 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:text-muted-foreground lg:hidden"
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
