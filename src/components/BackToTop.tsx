import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, LoaderCircle } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const lastScrollYRef = useRef(0);
  const spinTimeoutRef = useRef<number | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      const footer = document.getElementById("footer");
      let isFooterVisible = false;

      if (footer && !isScrollingUp) {
        const footerTop = footer.getBoundingClientRect().top + window.scrollY;
        const hidePoint = footerTop + footer.offsetHeight * 0.45;
        const viewportPoint = window.scrollY + window.innerHeight;
        isFooterVisible = viewportPoint >= hidePoint;
      }

      setVisible(currentScrollY > 400 && !isFooterVisible);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility);
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      if (spinTimeoutRef.current) {
        window.clearTimeout(spinTimeoutRef.current);
      }
      if (scrollAnimationRef.current) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (scrollAnimationRef.current) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
    }

    const startY = window.scrollY;
    const duration = Math.min(1100, Math.max(650, startY * 0.45));
    const startTime = window.performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startY * (1 - easedProgress));

      if (progress < 1) {
        scrollAnimationRef.current = window.requestAnimationFrame(animateScroll);
      }
    };

    scrollAnimationRef.current = window.requestAnimationFrame(animateScroll);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          onClick={() => {
            setHovered(false);
            setSpinning(true);
            if (spinTimeoutRef.current) {
              window.clearTimeout(spinTimeoutRef.current);
            }
            spinTimeoutRef.current = window.setTimeout(() => {
              setSpinning(false);
            }, 700);
            scrollToTop();
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") {
              setHovered(true);
            }
          }}
          onPointerLeave={() => setHovered(false)}
          onBlur={() => setHovered(false)}
          className="fixed bottom-8 right-8 z-50"
          aria-label="Back to top"
        >
          {/* Outer pulsing ring */}
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${hovered ? "#22c55e" : "#ffffff"}`,
            }}
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Second slower ring */}
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${hovered ? "#22c55e" : "#ff6b00"}`,
            }}
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />

          {/* Main circle */}
          <motion.div
            className="relative w-12 h-12 rounded-full flex items-center justify-center border-2"
            animate={{
              backgroundColor: hovered ? "#22c55e" : "#ff6b00",
              borderColor: hovered ? "#22c55e" : "#ffffff",
              boxShadow: hovered
                ? "0 0 25px rgba(34,197,94,0.6)"
                : "0 0 20px rgba(255,107,0,0.5)",
            }}
            transition={{ duration: 0.25 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {spinning ? (
                <motion.div
                  key="spinner"
                  initial={{ opacity: 0, scale: 0.65 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  exit={{ opacity: 0, scale: 0.65 }}
                  transition={{
                    opacity: { duration: 0.12 },
                    scale: { duration: 0.12 },
                    rotate: { duration: 0.65, ease: "linear" },
                  }}
                >
                  <LoaderCircle className="w-5 h-5 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="arrow"
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1, y: hovered ? -2 : 0 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                  transition={{ duration: 0.18 }}
                >
                  <ChevronUp className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
