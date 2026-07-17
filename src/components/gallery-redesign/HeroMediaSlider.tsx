import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useGalleryImagesState, type GalleryImageRecord } from "@/lib/admin-store";

type HeroSlide =
  | { type: "video"; id: string; src: string; poster: string; title: string; caption: string }
  | { type: "image"; id: string; src: string; alt: string; title: string; caption: string };

const heroVideoSlide: HeroSlide = {
  type: "video",
  id: "gallery-process-video",
  src: "videos/technoshine-gallery-hero.mp4",
  poster: "videos/technoshine-gallery-poster.jpg",
  title: "Our Craft, In Motion",
  caption: "A look at the Technoshine restoration process",
};

const slideDuration = 7000;
const videoControlsHideDelay = 2000;

function galleryAssetPath(path: string) {
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

function galleryImageToHeroSlide(image: GalleryImageRecord): HeroSlide {
  return {
    type: "image",
    id: image.id,
    src: image.imageUrl,
    alt: image.altText || image.title,
    title: image.title,
    caption: image.location || "Technoshine project work",
  };
}

export function HeroMediaSlider() {
  const { images } = useGalleryImagesState(true);
  const heroSlides = useMemo(() => {
    const publishedImages = images.filter((image) => image.isPublished && image.imageUrl);
    const heroImages = publishedImages.filter((image) => image.isHero);
    const imageSlides = (heroImages.length > 0 ? heroImages : publishedImages)
      .slice(0, 3)
      .map(galleryImageToHeroSlide);

    return [heroVideoSlide, ...imageSlides];
  }, [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isVideoPlaying, setIsVideoPlaying] = useState(heroSlides[0].type === "video");
  const [areVideoControlsVisible, setAreVideoControlsVisible] = useState(true);
  const activeSlide = heroSlides[Math.min(activeIndex, heroSlides.length - 1)] ?? heroVideoSlide;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoControlsTimerRef = useRef<number | null>(null);
  const slidesRef = useRef(heroSlides);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    slidesRef.current = heroSlides;
    setActiveIndex((current) => Math.min(current, heroSlides.length - 1));
  }, [heroSlides]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const goToSlide = useCallback((nextIndex: number, nextDirection: number) => {
    const totalSlides = slidesRef.current.length || 1;
    setDirection(nextDirection);
    setActiveIndex((nextIndex + totalSlides) % totalSlides);
  }, []);

  const goPrevious = useCallback(() => goToSlide(activeIndex - 1, -1), [activeIndex, goToSlide]);
  const goNext = useCallback(() => goToSlide(activeIndex + 1, 1), [activeIndex, goToSlide]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const currentSlides = slidesRef.current;
      const currentSlide = currentSlides[activeIndexRef.current] ?? heroVideoSlide;
      if (currentSlide.type === "video") return;

      setDirection(1);
      setActiveIndex((currentIndex) => (currentIndex + 1) % (currentSlides.length || 1));
    }, slideDuration);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsVideoPlaying(activeSlide.type === "video");
    setAreVideoControlsVisible(activeSlide.type === "video");

    if (videoControlsTimerRef.current) {
      window.clearTimeout(videoControlsTimerRef.current);
    }

    if (activeSlide.type === "video") {
      videoControlsTimerRef.current = window.setTimeout(() => {
        setAreVideoControlsVisible(false);
      }, videoControlsHideDelay);
    }

    return () => {
      if (videoControlsTimerRef.current) {
        window.clearTimeout(videoControlsTimerRef.current);
      }
    };
  }, [activeIndex, activeSlide.type]);

  const revealVideoControls = useCallback(() => {
    if (activeSlide.type !== "video") return;

    setAreVideoControlsVisible(true);

    if (videoControlsTimerRef.current) {
      window.clearTimeout(videoControlsTimerRef.current);
    }

    videoControlsTimerRef.current = window.setTimeout(() => {
      setAreVideoControlsVisible(false);
    }, videoControlsHideDelay);
  }, [activeSlide.type]);

  const startAutoplayVideo = useCallback(() => {
    const video = videoRef.current;
    if (activeSlide.type !== "video" || !video) return;

    video.autoplay = true;
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 1;
    setIsVideoPlaying(true);
    void video
      .play()
      .then(() => setIsVideoPlaying(true))
      .catch(() => setIsVideoPlaying(false));
  }, [activeSlide.type]);

  const playActiveVideo = useCallback(
    (shouldRevealControls = true) => {
      const video = videoRef.current;
      if (activeSlide.type !== "video" || !video) return;

      video.autoplay = true;
      video.defaultMuted = false;
      video.muted = false;
      video.volume = 1;
      setIsVideoPlaying(true);
      if (shouldRevealControls) {
        revealVideoControls();
      }
      void video
        .play()
        .then(() => setIsVideoPlaying(true))
        .catch(() => setIsVideoPlaying(false));
    },
    [activeSlide.type, revealVideoControls],
  );

  useEffect(() => {
    if (activeSlide.type !== "video") return;

    startAutoplayVideo();
  }, [activeIndex, activeSlide.type, startAutoplayVideo]);

  useEffect(() => {
    if (activeSlide.type !== "video") return;

    const enableSoundAfterGesture = () => {
      const video = videoRef.current;
      if (!video) return;

      video.defaultMuted = false;
      video.muted = false;
      video.volume = 1;
      void video.play().then(() => setIsVideoPlaying(true));
    };

    window.addEventListener("pointerdown", enableSoundAfterGesture, { once: true });
    window.addEventListener("keydown", enableSoundAfterGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", enableSoundAfterGesture);
      window.removeEventListener("keydown", enableSoundAfterGesture);
    };
  }, [activeIndex, activeSlide.type]);

  const pauseActiveVideo = useCallback(() => {
    const video = videoRef.current;
    if (activeSlide.type !== "video" || !video) return;

    video.pause();
    revealVideoControls();
    setIsVideoPlaying(false);
  }, [activeSlide.type, revealVideoControls]);

  const toggleActiveVideo = useCallback(() => {
    if (isVideoPlaying) {
      pauseActiveVideo();
      return;
    }

    playActiveVideo();
  }, [isVideoPlaying, pauseActiveVideo, playActiveVideo]);

  const videoPoster =
    activeSlide.type === "video" ? galleryAssetPath(activeSlide.poster) : null;

  return (
    <section
      id="gallery-hero"
      className="relative flex h-[100svh] items-stretch overflow-hidden bg-black"
      onMouseMove={revealVideoControls}
      onPointerDown={revealVideoControls}
    >
      <AnimatePresence custom={direction} mode="sync" initial={false}>
        <motion.div
          key={activeSlide.id}
          custom={direction}
          initial={{ opacity: 0, scale: 1.04, x: direction * 36 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 1.02, x: direction * -36 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="absolute inset-0 h-full w-full"
        >
          {activeSlide.type === "video" ? (
            <div className="relative h-full w-full overflow-hidden bg-black">
              <img
                src={videoPoster ?? ""}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-2xl"
              />
              <img
                src={videoPoster ?? ""}
                alt=""
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[-18%] h-[52%] w-full scale-x-110 scale-y-[-1] object-cover object-bottom opacity-35 blur-sm [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.72),transparent)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.72),transparent)]"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0_42%,rgba(0,0,0,0.48)_78%)]" />
              <div className="relative z-10 h-full w-full overflow-hidden bg-black shadow-[0_32px_90px_rgba(0,0,0,0.5)]">
                <video
                  ref={videoRef}
                  src={galleryAssetPath(activeSlide.src)}
                  poster={videoPoster ?? undefined}
                  className="h-full w-full object-cover"
                  muted
                  autoPlay
                  playsInline
                  preload="auto"
                  onLoadedMetadata={startAutoplayVideo}
                  onLoadedData={startAutoplayVideo}
                  onCanPlay={startAutoplayVideo}
                  onPlay={() => setIsVideoPlaying(true)}
                  onEnded={goNext}
                />
              </div>
            </div>
          ) : (
            <img
              src={galleryAssetPath(activeSlide.src)}
              alt={activeSlide.alt}
              className="h-full w-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div
        className={`absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/70 transition-opacity duration-500 ${
          activeSlide.type === "video" ? "opacity-60" : "opacity-100"
        }`}
      />

      <div className="relative z-10 flex min-h-full w-full flex-col justify-end px-4 pb-16 pt-32 sm:px-6 sm:pb-20 lg:px-10">
        <div
          className={`pointer-events-none mx-auto max-w-4xl text-center text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] transition-opacity duration-500 ${
            activeSlide.type === "video" && !areVideoControlsVisible
              ? "opacity-0"
              : "opacity-100"
          }`}
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
            Technoshine Stone Care
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-normal sm:text-5xl lg:text-6xl">
            {activeSlide.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium uppercase tracking-[0.16em] text-white/85">
            {activeSlide.caption}
          </p>
        </div>

        {activeSlide.type === "video" && (
          <div
            className={`absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-opacity duration-500 ${
              areVideoControlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={toggleActiveVideo}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/55 bg-primary text-white shadow-[0_18px_42px_rgba(0,0,0,0.42)] transition-all hover:scale-105 hover:bg-white hover:text-primary sm:h-14 sm:w-14"
              aria-label={isVideoPlaying ? "Pause video" : "Play video"}
              title={isVideoPlaying ? "Pause" : "Play"}
            >
              {isVideoPlaying ? (
                <Pause className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-current sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        )}

        <div className="absolute inset-x-4 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between transition-opacity duration-500 sm:inset-x-6 lg:inset-x-10">
          <button
            type="button"
            onClick={goPrevious}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur transition-colors hover:border-primary hover:bg-primary sm:h-12 sm:w-12"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur transition-colors hover:border-primary hover:bg-primary sm:h-12 sm:w-12"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="relative z-10 mx-auto mt-10 flex gap-2 transition-opacity duration-500">
          {heroSlides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${slideIndex + 1}`}
              onClick={() => goToSlide(slideIndex, slideIndex > activeIndex ? 1 : -1)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                slideIndex === activeIndex
                  ? "scale-125 bg-primary ring-2 ring-primary/35"
                  : "bg-white/45 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
