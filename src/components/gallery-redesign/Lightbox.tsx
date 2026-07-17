import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxSlide {
  type: "image" | "video";
  src: string;
  caption?: string;
}

interface LightboxProps {
  slides: LightboxSlide[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ slides, index, onClose, onIndexChange }: LightboxProps) {
  const total = slides.length;

  const goPrevious = useCallback(
    () => onIndexChange((index - 1 + total) % total),
    [index, total, onIndexChange],
  );
  const goNext = useCallback(
    () => onIndexChange((index + 1) % total),
    [index, total, onIndexChange],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrevious();
      if (event.key === "ArrowRight") goNext();
    };

    const scrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;

    window.addEventListener("keydown", handleKeyDown);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [onClose, goPrevious, goNext]);

  const slide = slides[index];
  if (!slide) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black text-white"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        {slide.type === "image" && (
          <img
            src={slide.src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-3xl"
          />
        )}
        <div className="absolute inset-0 bg-black/82" />
        <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.95)]" />

        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white shadow-xl backdrop-blur transition-colors hover:bg-primary sm:right-6 sm:top-6"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className="relative z-10 flex h-full w-full max-w-6xl flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-8 sm:py-12"
          onClick={(event) => event.stopPropagation()}
        >
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-0 w-full flex-col items-center"
          >
            {slide.caption && (
              <p className="mb-4 max-w-3xl text-center font-display text-xs uppercase tracking-[0.16em] text-white/82 sm:text-sm">
                {slide.caption}
              </p>
            )}

            <div className="relative inline-flex max-w-full items-center justify-center">
              {total > 1 && (
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={goPrevious}
                  className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-xl backdrop-blur transition-colors hover:bg-primary sm:-left-14"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              {slide.type === "video" ? (
                <div className="aspect-video w-[min(92vw,64rem)] overflow-hidden bg-black shadow-[0_32px_110px_rgba(0,0,0,0.72)]">
                  <iframe
                    src={slide.src}
                    title={slide.caption ?? "Technoshine video"}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={total > 1 ? goNext : undefined}
                  aria-label={total > 1 ? "Next image" : slide.caption ?? "Gallery image"}
                  className="cursor-pointer"
                >
                  <img
                    src={slide.src}
                    alt={slide.caption ?? ""}
                    className="max-h-[54vh] w-auto max-w-full object-contain shadow-[0_32px_110px_rgba(0,0,0,0.72)] sm:max-h-[62vh]"
                  />
                </button>
              )}

              {total > 1 && (
                <button
                  type="button"
                  aria-label="Next"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-xl backdrop-blur transition-colors hover:bg-primary sm:-right-14"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>

          {total > 1 && (
            <div className="mt-5 w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex justify-center overflow-hidden">
                <div className="flex max-w-full gap-2 overflow-x-auto overflow-y-hidden px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {slides.map((item, itemIndex) => (
                  <button
                    key={`${item.src}-${itemIndex}`}
                    type="button"
                    aria-label={`Show image ${itemIndex + 1}`}
                    onClick={() => onIndexChange(itemIndex)}
                    className={`h-16 w-20 shrink-0 overflow-hidden bg-black/50 shadow-lg transition-all duration-200 sm:h-20 sm:w-28 ${
                      itemIndex === index
                        ? "opacity-100 ring-2 ring-primary"
                        : "opacity-55 hover:opacity-90"
                    }`}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.src}
                        alt={item.caption ?? ""}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-widest text-white/70">
                        Video
                      </span>
                    )}
                  </button>
                ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
