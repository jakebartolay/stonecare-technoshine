import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const projects = [
  {
    title: "Okada Manila",
    label: "Marble Floor Polish",
    before: "before-1.jpeg",
    after: "after-1.jpeg",
  },
  // {
  //   label: "Countertop Restoration",
  //   before: "before-2.png",
  //   after: "after-2.png",
  // },
  {
    title: "Edsa Shangrila",
    label: "Floor Restoration",
    before: "before-3.jpg",
    after: "after-3.jpg",
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

  const getPosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = () => setDragging(true);
  const onMouseMove = useCallback(
    (e: MouseEvent) => { if (dragging) getPosition(e.clientX); },
    [dragging, getPosition]
  );
  const onMouseUp = useCallback(() => setDragging(false), []);

  const onTouchMove = useCallback(
    (e: TouchEvent) => { getPosition(e.touches[0].clientX); },
    [getPosition]
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const base = import.meta.env.BASE_URL;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto select-none overflow-hidden cursor-col-resize border border-border"
      style={{ aspectRatio: "4 / 3" }}
      onMouseDown={onMouseDown}
      onTouchMove={(e) => onTouchMove(e.nativeEvent)}
    >
      {/* AFTER image (full width, clipped on left) */}
      <img
        src={`${base}images/${after}`}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* BEFORE image clipped to left side */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={`${base}images/${before}`}
          alt="Before"
          className="absolute inset-0 h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-[0_0_10px_rgba(255,107,0,0.8)]"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-primary shadow-[0_0_20px_rgba(255,107,0,0.6)] flex items-center justify-center border-2 border-white cursor-grab active:cursor-grabbing"
        style={{ left: `${position}%` }}
      >
        <ChevronLeft className="w-3 h-3 text-white -mr-0.5" />
        <ChevronRight className="w-3 h-3 text-white -ml-0.5" />
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 bg-black/70 text-white text-[10px] font-mono uppercase tracking-widest">
        Before
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
    <section id="before-after" className="py-24 bg-card relative">
      <div className="absolute inset-0 tech-pattern opacity-[0.03]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">
            The Difference
          </h2>
          <h3 className="text-3xl md:text-5xl font-display text-foreground mb-4">
            BEFORE <span className="text-primary">&</span> AFTER
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Drag the slider left or right to reveal the transformation. See exactly what our restoration process achieves.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Slider */}
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

          {/* Project selector */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
              Select Project
            </p>
            {projects.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setActive(i)}
                className={`group relative flex items-center gap-4 p-4 border transition-all duration-200 text-left ${
                  i === active
                    ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(255,107,0,0.1)]"
                    : "border-border hover:border-primary/50 bg-background"
                }`}
              >
                <div className="relative w-16 h-16 shrink-0 overflow-hidden border border-border">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${p.after}`}
                    alt={p.label}
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

            {/* Hint */}
            {/* <div className="mt-4 p-4 border border-dashed border-primary/30 bg-primary/5">
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                <span className="text-primary">TIP:</span> Drag the orange handle on the image to compare before &amp; after results. Works on mobile too.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
