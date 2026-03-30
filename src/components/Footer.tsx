import { Link } from "wouter";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 tech-pattern opacity-[0.04]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 justify-items-center">
          
          {/* DESKTOP VIEW */}
          <div className="hidden md:block">
            <h4 className="text-white font-display uppercase tracking-widest mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {["Home", "Services", "About", "Gallery", "Team", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                    className="text-white/50 hover:text-primary text-sm font-mono transition-colors"
                  >
                    | {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4 group inline-flex">
              <img
                src="/logo/companylogo3.png"
                alt="TechnoShine"
                className="h-20 md:h-60 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:block text-center">
            <h4 className="text-white font-display uppercase tracking-widest mb-4">
              Legal
            </h4>
            <ul className="space-y-2 mb-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-primary text-sm font-mono transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            {/* 🔥 SUBDOMAINS */}
            <h4 className="text-white font-display uppercase tracking-widest mb-4">
              Our Websites
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="https://construction.technoshineph.com" target="_blank" className="text-white/50 hover:text-primary text-sm font-mono">
                  Construction
                </a>
              </li>
              <li>
                <a href="https://trading.technoshineph.com" target="_blank" className="text-white/50 hover:text-primary text-sm font-mono">
                  Trading
                </a>
              </li>
              <li>
                <a href="https://technoshineph.com" target="_blank" className="text-white/50 hover:text-primary text-sm font-mono">
                  Technoshine
                </a>
              </li>
            </ul>
          </div>

          {/* PHONE VIEW */}
          <div className="block md:hidden text-center">
            <Link href="/" className="flex items-center justify-center mb-4 group">
              <img
                src="/logo/companylogo3.png"
                alt="TechnoShine"
                className="h-60 w-auto mx-auto"
              />
            </Link>
            <p className="text-white/50 text-sm max-w-sm font-light mx-auto">
              Premium marble and natural stone restoration specialists.
            </p>
          </div>

          <div className="block md:hidden text-center">
            <h4 className="text-white font-display uppercase tracking-widest mb-4">
              Navigation
            </h4>
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {["Home", "Services", "About", "Gallery", "Team", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                    className="text-white/50 hover:text-primary text-sm font-mono"
                  >
                    | {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="block md:hidden text-center">
            <h4 className="text-white font-display uppercase tracking-widest mb-4">
              Legal
            </h4>
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-primary text-sm font-mono">
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            {/* 🔥 SUBDOMAINS MOBILE */}
            <h4 className="text-white font-display uppercase tracking-widest mb-3">
              Our Websites
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://construction.technoshineph.com" target="_blank" className="text-white/50 hover:text-primary text-sm font-mono">
                Construction
              </a>
              <a href="https://trading.technoshineph.com/index.php" target="_blank" className="text-white/50 hover:text-primary text-sm font-mono">
                Trading
              </a>
              <a href="https://technoshineph.com" target="_blank" className="text-white/50 hover:text-primary text-sm font-mono">
                Technoshine
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex w-full justify-center items-center">
          <p className="text-white/40 text-xs font-mono text-center w-full">
            &copy; {year} TECHNOSHINE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}