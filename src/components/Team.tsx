import { motion } from "framer-motion";
import { Instagram, Facebook, Linkedin } from "lucide-react";

const team = [
  {
    name: "ERWIN TORREFIEL",
    role: "MANAGING DIRECTOR",
    image: "/team/managing-director.png",
  },
  // {
  //   name: "MARK DELA CRUZ",
  //   role: "Diamond Polishing Expert",
  //   // image: "team-2.png",
  // },
  // {
  //   name: "CARLA REYES",
  //   role: "Crack & Repair Specialist",
  //   // image: "team-3.png",
  // },
  // {
  //   name: "ROMEO VILLANUEVA",
  //   role: "Surface Sealing Technician",
  //   // image: "team-4.png",
  // },
];

export function Team() {
  const base = import.meta.env.BASE_URL;

  return (
    <section
      id="team"
      className="py-24 bg-card border-y border-border relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">
              The Craftsmen
            </h2>
            <h3 className="text-3xl md:text-5xl font-display text-foreground">
              MEET THE{" "}
              <span className="text-primary">TEAM</span>
            </h3>
          </div>
          <p className="text-muted-foreground max-w-md text-sm">
            Certified stone restoration specialists with decades of hands-on experience across residential, hospitality, and commercial projects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group relative"
            >
              <div className="aspect-[3/4] overflow-hidden bg-background border border-border relative">
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />

                <img
                  src={
                    member.image.startsWith("/")
                      ? `${base}${member.image.slice(1)}`
                      : `${base}images/${member.image}`
                  }
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-xl font-display text-white mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs font-mono text-white/70 uppercase">
                    {member.role}
                  </p>

                  <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <a href="#" className="text-white hover:text-primary transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-white hover:text-primary transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-white hover:text-primary transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="absolute inset-0 border border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none shadow-[0_0_15px_rgba(255,107,0,0.3)]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
