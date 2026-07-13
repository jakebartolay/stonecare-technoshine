import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Download, Eye, EyeOff, Home, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import AOS from "aos";
import OrgChart, {
  type TierType,
  type TierVisibility,
} from "@/components/OrgChart";
import { useEmployees } from "@/lib/admin-store";

const CHART_WIDTH = 900;
const DEFAULT_VISIBILITY: TierVisibility = {
  board: true,
  leadership: true,
  dept: true,
  staff: true,
};
const DEFAULT_EXIT_STATE: TierVisibility = {
  board: false,
  leadership: false,
  dept: false,
  staff: false,
};
const EXIT_DURATION = 240;
const TIER_CONTROLS: Array<{
  tier: TierType;
  label: string;
  color: string;
}> = [
  { tier: "board", label: "Board / Executive", color: "#E25B18" },
  { tier: "leadership", label: "Leadership", color: "#B5760A" },
  { tier: "dept", label: "Department head", color: "#185FA5" },
  { tier: "staff", label: "Staff", color: "#9ca3af" },
];
const ORGANIZATION_BG = `${import.meta.env.BASE_URL}team/organizationbg.jpg`;
const ORGANIZATION_PDF = `${import.meta.env.BASE_URL}org-chart.pdf`;

export default function OrganizationChart() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const employees = useEmployees(true);
  const [scale, setScale] = useState(1);
  const [visibleTiers, setVisibleTiers] =
    useState<TierVisibility>(DEFAULT_VISIBILITY);
  const [exitingTiers, setExitingTiers] =
    useState<TierVisibility>(DEFAULT_EXIT_STATE);
  const exitTimersRef = useRef<
    Partial<Record<TierType, number>>
  >({});

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const chart = chartRef.current;
    if (!viewport || !chart) return;

    const fitChart = () => {
      const availableWidth = viewport.clientWidth;
      const availableHeight = viewport.clientHeight;
      const chartWidth = chart.scrollWidth;
      const chartHeight = chart.scrollHeight;

      if (!availableWidth || !availableHeight || !chartWidth || !chartHeight) {
        return;
      }

      setScale(Math.min(1, availableWidth / chartWidth, availableHeight / chartHeight));
    };

    fitChart();

    const observer = new ResizeObserver(fitChart);
    observer.observe(viewport);
    observer.observe(chart);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      AOS.refreshHard();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [visibleTiers]);

  useEffect(() => {
    return () => {
      Object.values(exitTimersRef.current).forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, []);

  const toggleTier = (tier: TierType) => {
    const pendingTimer = exitTimersRef.current[tier];
    if (pendingTimer) {
      window.clearTimeout(pendingTimer);
      delete exitTimersRef.current[tier];
    }

    if (exitingTiers[tier]) {
      setExitingTiers((current) => ({ ...current, [tier]: false }));
      return;
    }

    if (visibleTiers[tier]) {
      setExitingTiers((current) => ({ ...current, [tier]: true }));
      exitTimersRef.current[tier] = window.setTimeout(() => {
        setVisibleTiers((current) => ({ ...current, [tier]: false }));
        setExitingTiers((current) => ({ ...current, [tier]: false }));
        delete exitTimersRef.current[tier];
      }, EXIT_DURATION);
      return;
    }

    setExitingTiers((current) => ({ ...current, [tier]: false }));
    setVisibleTiers((current) => ({ ...current, [tier]: true }));
  };

  const showAllTiers = () => {
    Object.values(exitTimersRef.current).forEach((timer) => {
      window.clearTimeout(timer);
    });
    exitTimersRef.current = {};
    setExitingTiers({ ...DEFAULT_EXIT_STATE });
    setVisibleTiers({ ...DEFAULT_VISIBILITY });
  };

  return (
    <main className="relative flex h-screen h-[100dvh] flex-col overflow-hidden bg-white text-foreground">
      <img
        src={ORGANIZATION_BG}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-white/50" />

      <aside
        aria-label="Organization chart filters"
        className="absolute inset-x-2 bottom-2 z-30 rounded-xl border border-black/10 bg-white/95 p-2 shadow-[0_16px_45px_rgba(0,0,0,0.16)] backdrop-blur sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-1/2 sm:w-44 sm:-translate-y-1/2 sm:p-3"
      >
        <Link
          href="/"
          aria-label="Back to homepage"
          className="mb-2 inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-2 font-mono text-[8px] uppercase tracking-[0.1em] text-black/70 transition-colors hover:border-primary hover:text-primary sm:h-9 sm:text-[9px]"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>

        <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-col sm:gap-2">
          {TIER_CONTROLS.map((item) => {
            const isVisible =
              visibleTiers[item.tier] && !exitingTiers[item.tier];
            const VisibilityIcon = isVisible ? Eye : EyeOff;

            return (
              <button
                key={item.tier}
                type="button"
                aria-pressed={isVisible}
                aria-label={`${isVisible ? "Hide" : "Show"} ${item.label}`}
                onClick={() => toggleTier(item.tier)}
                className={`flex min-h-9 items-center gap-1.5 rounded-md border px-2 text-left font-display text-[8px] font-bold uppercase leading-tight tracking-wide transition-colors sm:min-h-10 sm:gap-2 sm:px-3 sm:text-[11px] ${
                  isVisible
                    ? "border-black/10 bg-white text-black"
                    : "border-black/5 bg-neutral-100 text-black/35"
                }`}
                style={{
                  borderLeft: `3px solid ${isVisible ? item.color : "#d1d5db"}`,
                }}
              >
                <VisibilityIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={showAllTiers}
          className="mt-1.5 inline-flex h-7 w-full items-center justify-center gap-2 rounded-md border border-black/10 px-2 font-mono text-[8px] uppercase tracking-[0.1em] text-black/60 transition-colors hover:border-primary hover:text-primary sm:mt-2 sm:h-8 sm:text-[9px]"
        >
          <RotateCcw className="h-3 w-3" />
          Show All
        </button>

        <a
          href={ORGANIZATION_PDF}
          download="org-chart.pdf"
          aria-label="Download organization chart PDF"
          className="mt-1.5 inline-flex h-7 w-full items-center justify-center gap-2 rounded-md border border-primary bg-primary px-2 font-mono text-[8px] uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-primary sm:mt-2 sm:h-8 sm:text-[9px]"
        >
          <Download className="h-3 w-3" />
          Download Chart
        </a>
      </aside>

      <section
        aria-label="Technoshine organization chart"
        className="relative min-h-0 w-full flex-1 overflow-hidden"
      >
        <div
          ref={viewportRef}
          className="absolute inset-x-0 bottom-[220px] top-0 sm:bottom-0 sm:right-[184px]"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              ref={chartRef}
              style={{
                width: CHART_WIDTH,
                flexShrink: 0,
                transform: `scale(${scale})`,
                transformOrigin: "center",
              }}
            >
              <OrgChart
                employees={employees}
                visibleTiers={visibleTiers}
                exitingTiers={exitingTiers}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
