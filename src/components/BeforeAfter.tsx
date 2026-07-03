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

  return (
    <section id="before-after" className="relative flex min-h-screen items-center bg-background py-20">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[360px_1fr] lg:items-start">
        {/* Header */}
        <div data-aos="fade-up">
          <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">
            The Difference
          </h2>
          <h3 className="text-3xl md:text-5xl font-display text-foreground mb-4">
            BEFORE <span className="text-primary">&</span> AFTER
          </h3>
          <p className="text-muted-foreground max-w-xl text-sm">
            Drag the slider left or right to reveal the transformation. See exactly what our restoration process achieves.
          </p>

          {/* Project selector */}
          <div className="mt-8 flex flex-col gap-3" data-aos="fade-left" data-aos-delay="120">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
              Select Project
            </p>
            {projects.map((p, i) => (
              <button
                key={`${p.title}-${p.before}`}
                onClick={() => setActive(i)}
                className={`home-accent-card group relative flex items-center gap-4 p-4 border transition-all duration-200 text-left ${
                  i === active
                    ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(255,107,0,0.1)]"
                    : "border-border hover:border-primary/50 bg-background"
                }`}
              >
                <div className="relative w-16 h-16 shrink-0 overflow-hidden border border-border">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${p.after}`}
                    alt={p.label}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  {i === active && (
                    <div className="absolute inset-0 border-2 border-primary" />
                  )}
                </div>
                <div>
                  <p className="text-black text-xs font-mono uppercase tracking-[0.18em]">
                    {p.title}
                  </p>
                  <p
                    className={`font-display text-sm uppercase tracking-wide ${
                      i === active ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {p.label}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5 font-mono">
                    Project {i + 1} of {projects.length}
                  </p>
                </div>
                {i === active && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          {/* Slider */}
          <div data-aos="zoom-in-right">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Slider
                before={projects[active].before}
                after={projects[active].after}
                title={projects[active].title}
              />
              <p className="mt-3 text-center font-display text-foreground text-lg uppercase tracking-wider">
                {projects[active].label}
              </p>
            </motion.div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
