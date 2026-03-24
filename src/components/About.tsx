import { motion, useInView } from "framer-motion";
import { Award, Target, Eye } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function useCountUp(target: number, duration = 2000, inView = false) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return count;
}

function StatCounter({
  target,
  suffix,
  label,
  delay = 0,
  inView,
  format,
}: {
  target: number;
  suffix: string;
  label: string;
  delay?: number;
  inView: boolean;
  format?: (n: number) => string;
}) {
  const delayedView = useRef(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (inView && !delayedView.current) {
      delayedView.current = true;
      const t = setTimeout(() => setActive(true), delay);
      return () => clearTimeout(t);
    }
  }, [inView, delay]);

  const count = useCountUp(target, 2000, active);
  const display = format ? format(count) : count.toString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="border-l-2 border-primary pl-4"
    >
      <div className="text-3xl font-display font-bold text-foreground mb-1 tabular-nums">
        {display}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="text-xs font-mono text-primary/70 uppercase tracking-widest">
        {label}
      </div>
    </motion.div>
  );
}

export function About() {
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(statsRef, { once: true, margin: "-80px" });
  return (
    <section id="about" className="py-24 relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full opacity-40" />
            <div className="relative border border-primary/30 bg-card p-2">
              <img
                src={`${import.meta.env.BASE_URL}images/marble-hall.png`}
                alt="Grand marble hall"
                className="w-full h-auto object-cover contrast-110"
              />
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
            </div>

            <div className="absolute -bottom-6 -right-6 bg-background border border-primary p-4 shadow-[0_0_15px_rgba(255,107,0,0.2)] hidden sm:block">
              <div className="flex items-center gap-3 text-primary font-mono text-sm font-bold">
                <Award className="w-5 h-5" />
                MASTER CRAFTSMEN
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">
              Our Story
            </h2>
            <h3 className="text-3xl md:text-5xl font-display text-foreground mb-6">
              RESTORING <br />
              <span className="text-primary">TIMELESS</span> STONE
            </h3>

            <div className="space-y-6 text-muted-foreground font-light text-lg">
              <p>
                <b className="font-bold">Founded in 1993,</b> Technoshine had its humble beginning doing stone restoration in Rizal. For more than <b className="font-bold">30 years of passion and dedication</b>, we had been restoring natural stones to homes, hotels, malls and the like. Servicing to clients who value their natural stones and need not to replace.
              </p>

              <p>
                Technoshine has grown year by year. Continuously developing and nurturing our skills and methodology, we become experts in our field of service. Our experiences and understanding of natural stones have enriched the knowledge and approached of our skilled stone specialists and craftsmen. 
              </p>
            </div>

            <div ref={statsRef} className="mt-10 grid grid-cols-2 gap-6">
              <StatCounter
                target={30}
                suffix="+"
                label="Years of Experience"
                delay={0}
                inView={inView}
              />
              <StatCounter
                target={5000}
                suffix="+"
                label="Projects Completed"
                delay={300}
                inView={inView}
                format={(n) => n.toLocaleString()}
              />
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group border border-border hover:border-primary transition-colors duration-300 bg-card p-8 overflow-hidden"
          >
            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
            <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />

            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <Target className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">Who We Are</p>
                <h4 className="text-2xl font-display text-foreground uppercase">Our Mission</h4>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              To remain the No. 1 and the only legitimate stone care and restoration in the country.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-widest">
              <span className="w-6 h-0.5 bg-primary" />
              Precision. Integrity. Craftsmanship.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative group border border-border hover:border-primary transition-colors duration-300 bg-card p-8 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
            <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />

            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <Eye className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">Where We're Going</p>
                <h4 className="text-2xl font-display text-foreground uppercase">Our Vision</h4>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              • To provide our customers who value their natural stones with five star standard and high quality services and products that would restore and revive their stones without replacement in a professional, caring and reasonable price manner, doing our best at all times. 
              <br></br>
              <br></br>
              • Our employees are our heart, we will continuously support its career and professional development to create a positive impact in our company’s future growth. 
              <br></br>
              <br></br>
              • To operate efficiently and reliably by valuing our clients’ businesses to achieve its main goal.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-widest">
              <span className="w-6 h-0.5 bg-primary" />
              Excellence Across Southeast Asia.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
