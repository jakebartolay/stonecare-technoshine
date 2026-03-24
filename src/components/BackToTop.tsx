import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            window.scrollTo({ top: 0, behavior: "smooth" });
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
            <motion.div
              animate={{ y: hovered ? -2 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
