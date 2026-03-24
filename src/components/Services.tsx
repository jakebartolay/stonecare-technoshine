import { motion } from "framer-motion";
import { Gem, Layers, Wrench, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: Gem,
    title: "Marble Polishing",
    description: "Diamond-grade polishing that revives dull, scratched marble to a mirror-finish brilliance. We restore depth and natural luminosity to any stone surface.",
  },
  {
    icon: Wrench,
    title: "Crack & Chip Repair",
    description: "Expert structural repair of cracks, chips, and fractures using colour-matched stone epoxies — invisible results, lasting strength.",
  },
  {
    icon: Layers,
    title: "Stone Restoration",
    description: "Full-cycle restoration for marble, granite, travertine, and limestone. From honing rough surfaces to re-levelling lippage across large floor areas.",
  },
  {
    icon: ShieldCheck,
    title: "Sealing & Protection",
    description: "Premium penetrating sealers that guard against staining, etching, and moisture ingress — keeping your stone pristine for years to come.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 relative bg-card border-y border-border">
      <div className="absolute inset-0 tech-pattern opacity-[0.04]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="services-heading" className="text-center mb-16">
          <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">What We Do</h2>
          <h3 className="text-3xl md:text-5xl font-display text-foreground">OUR SERVICES</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background border border-border p-8 group hover:-translate-y-2 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] cursor-crosshair relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />

              <div className="w-14 h-14 bg-card border border-border flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>

              <h4 className="text-xl font-display text-foreground mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h4>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>

              <div className="mt-6 flex items-center text-xs font-mono text-primary/60 group-hover:text-primary transition-colors">
                <span className="mr-2">&gt;</span> Learn More
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
      `}} />
    </section>
  );
}
