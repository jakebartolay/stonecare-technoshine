import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const projects = [
  {
    title: "Resident House",
    label: "Marble Floor Polish",
    before: "before-after/before-1.jpeg",
    after: "before-after/after-1.jpeg",
  },
  {
    title: "La Plaza Okada Manila",
    label: "Floor Restoration",
    before: "before-after/before-2.jpg",
    after: "before-after/after-2.jpg",
  },
  {
    title: "Edsa Shangrila",
    label: "Floor Restoration",
    before: "before-after/before-3.jpg",
    after: "before-after/after-3.jpg",
  },
  {
    title: "Diamond Hotel",
    label: "Floor Restoration",
    before: "before-after/before-4.jpg",
    after: "before-after/after-4.jpg",
  },
  {
    title: "Residence",
    label: "Floor Restoration",
    before: "before-after/before-5.jpg",
    after: "before-after/after-5.jpg",
  },
  {
    title: "Makati Underpass",
    label: "Floor Restoration",
    before: "before-after/before-6.jpg",
    after: "before-after/after-6.jpg",
  },
];

function Slider({
  before,
  after,
  title,
}: {
  before: string;
  after: string;
  title: string;
}) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

  const getPosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const startDrag = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      getPosition(event.clientX);
    },
    [getPosition],
  );

  const moveDrag = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragging) return;
      getPosition(event.clientX);
    },
    [dragging, getPosition],
  );

  const stopDrag = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      setDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  const onHandleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((current) => Math.max(0, current - 5));
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((current) => Math.min(100, current + 5));
    }
  }, []);

  const base = import.meta.env.BASE_URL;
  const revealClip = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
  const isShowingTechnoshineWork = position < 50;

  return (
    <div
      ref={containerRef}
      className="home-elevated-surface relative w-full max-w-4xl mx-auto select-none overflow-hidden border border-border"
      style={{ aspectRatio: "4 / 3" }}
    >
      {/* AFTER image (full width, clipped on left) */}
      <img
        src={`${base}images/${after}`}
        alt="After"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* BEFORE image clipped to left side */}
      <div
        className="absolute inset-0"
        style={{ clipPath: revealClip }}
      >
        <img
          src={`${base}images/${before}`}
          alt="Before"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-[0_0_10px_rgba(255,107,0,0.8)]"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <button
        ref={handleRef}
        type="button"
        aria-label="Slide before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary shadow-[0_0_20px_rgba(255,107,0,0.6)] cursor-ew-resize active:cursor-grabbing"
        role="slider"
        style={{ left: `${position}%` }}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onKeyDown={onHandleKeyDown}
      >
        <ChevronLeft className="w-3 h-3 text-white -mr-0.5" />
        <ChevronRight className="w-3 h-3 text-white -ml-0.5" />
      </button>

      {/* Labels */}
      <div
        className={`absolute bottom-3 left-3 z-10 px-2 py-0.5 text-white text-[10px] font-mono uppercase tracking-widest transition-colors ${
          isShowingTechnoshineWork ? "bg-primary/90" : "bg-black/70"
        }`}
      >
        {isShowingTechnoshineWork ? "Technoshine Works" : "Before"}
      </div>
      <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 bg-primary/90 text-white text-[10px] font-mono uppercase tracking-widest">
        After
      </div>

      <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 px-4 py-2 bg-white/85 text-black text-sm font-display uppercase tracking-[0.18em]">
        {title}
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const [active, setActive] = useState(0);
  const previousProject = () => {
    setActive((current) => (current - 1 + projects.length) % projects.length);
  };
  const nextProject = () => {
    setActive((current) => (current + 1) % projects.length);
  };

  return (
    <section id="before-after" className="relative flex min-h-screen items-center bg-background py-20">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <h2 className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-primary">
            The Difference
          </h2>
          <h3 className="mb-4 font-display text-3xl text-foreground md:text-5xl">
            BEFORE <span className="text-primary">&</span> AFTER
          </h3>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Drag the slider left or right to reveal the transformation. See exactly what our restoration process achieves.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl" data-aos="zoom-in">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Slider
              before={projects[active].before}
              after={projects[active].after}
              title={projects[active].title}
            />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
              <p className="font-display text-lg uppercase tracking-wider text-foreground">
                {projects[active].label}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-8" data-aos="fade-up" data-aos-delay="120">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              Select Project
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={previousProject}
              aria-label="Previous project"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex min-w-0 max-w-full gap-3 overflow-hidden">
              {[-1, 0, 1].map((offset) => {
                const index = (active + offset + projects.length) % projects.length;
                const p = projects[index];
                const isActive = offset === 0;

                return (
                  <button
                    key={`${p.title}-${p.before}`}
                    onClick={() => setActive(index)}
                    className={`group hidden min-w-0 items-center gap-3 rounded-md border p-3 text-left transition-all duration-200 sm:flex sm:w-[230px] ${
                      isActive
                        ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(255,107,0,0.1)]"
                        : "border-border bg-background hover:border-primary/50"
                    } ${isActive ? "flex w-[min(68vw,260px)]" : ""}`}
                  >
                    <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-sm border border-border">
                      <img
                        src={`${import.meta.env.BASE_URL}images/${p.after}`}
                        alt={p.label}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {p.title}
                      </p>
                      <p
                        className={`truncate font-display text-xs uppercase tracking-wide ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {p.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={nextProject}
              aria-label="Next project"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
