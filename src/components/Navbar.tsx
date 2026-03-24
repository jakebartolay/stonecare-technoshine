import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const TOP_LOGO_SRC = "/logo/companylogo1.png";
const SCROLLED_LOGO_SRC = "/logo/companylogo2.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLinks = [
    { name: "Home", href: "#", section: "home" },
    { name: "Services", href: "#services", section: "services" },
    { name: "About", href: "#about", section: "about" },
    { name: "Gallery", href: "#gallery", section: "gallery" },
    { name: "Team", href: "#team", section: "team" },
    { name: "Contact", href: "#contact", section: "contact" },
  ];

  useEffect(() => {
    const preloadImages = [TOP_LOGO_SRC, SCROLLED_LOGO_SRC].map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });

    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      preloadImages.length = 0;
    };
  }, []);

  useEffect(() => {
    const handleSectionChange = () => {
      const scrollPosition = window.scrollY + 140;
      const sections = navLinks
        .filter((link) => link.section !== "home")
        .map((link) => document.querySelector(link.href))
        .filter((section): section is Element => section !== null);

      if (window.scrollY < 120) {
        setActiveSection("home");
        return;
      }

      const currentSection = sections.find((section) => {
        const top = (section as HTMLElement).offsetTop;
        const height = (section as HTMLElement).offsetHeight;
        return scrollPosition >= top && scrollPosition < top + height;
      });

      if (currentSection instanceof HTMLElement) {
        setActiveSection(currentSection.id);
        return;
      }

      const lastSection = sections[sections.length - 1];
      if (
        lastSection instanceof HTMLElement &&
        scrollPosition >= lastSection.offsetTop
      ) {
        setActiveSection(lastSection.id);
      }
    };

    handleSectionChange();
    window.addEventListener("scroll", handleSectionChange);

    return () => window.removeEventListener("scroll", handleSectionChange);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    section: string,
  ) => {
    e.preventDefault();
    const wasMobileMenuOpen = isMobileMenuOpen;
    setIsMobileMenuOpen(false);
    setActiveSection(section);

    const scrollToTarget = () => {
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.querySelector(href);
        if (element) {
          const top = (element as HTMLElement).offsetTop - 96;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    };

    if (wasMobileMenuOpen) {
      window.setTimeout(scrollToTarget, 220);
      return;
    }

    scrollToTarget();
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveSection("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border py-3 shadow-sm"
          : "backdrop-blur-sm py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group relative z-[61]"
          >
            <span className="relative block h-10 w-[160px]">
              <img
                src={TOP_LOGO_SRC}
                alt="TechnoShine"
                className={`absolute inset-0 h-10 w-auto max-w-none transition-opacity duration-200 ${
                  isScrolled ? "opacity-0" : "opacity-100"
                }`}
              />
              <img
                src={SCROLLED_LOGO_SRC}
                alt="TechnoShine"
                className={`absolute inset-0 h-10 w-auto max-w-none transition-opacity duration-200 ${
                  isScrolled ? "opacity-100" : "opacity-0"
                }`}
              />
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                aria-current={activeSection === link.section ? "page" : undefined}
                onClick={(e) => handleNavClick(e, link.href, link.section)}
                className={`text-sm font-medium transition-all duration-300 uppercase tracking-wider relative group ${
                  activeSection === link.section
                    ? "text-primary"
                    : isScrolled
                      ? "text-muted-foreground hover:text-primary"
                      : "text-white/80 hover:text-primary"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === link.section
                      ? "w-full shadow-[0_0_12px_rgba(255,107,0,0.45)]"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact", "contact")}
              className="px-5 py-2 font-display text-sm font-bold text-white bg-primary border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.6)]"
            >
              FREE QUOTE
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            className={`md:hidden relative z-[61] p-2 -mr-2 transition-colors hover:text-primary ${isScrolled ? "text-foreground" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden relative z-[60] bg-background border-b border-border overflow-hidden shadow-lg"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  aria-current={activeSection === link.section ? "page" : undefined}
                  onClick={(e) => handleNavClick(e, link.href, link.section)}
                  className={`block py-2 text-lg font-display transition-colors uppercase tracking-wider ${
                    activeSection === link.section
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact", "contact")}
                className="mt-2 inline-flex items-center justify-center px-5 py-3 font-display text-sm font-bold text-white bg-primary border border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
              >
                FREE QUOTE
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
