import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Menu, X } from "lucide-react";
import { Link } from "wouter";

const TOP_LOGO_SRC = "/logo/companylogo1.png";
const SCROLLED_LOGO_SRC = "/logo/companylogo2.png";
const DESKTOP_NAV_HEIGHT = 64;
const MOBILE_NAV_HEIGHT = 64;
const WARNING_HEIGHT = 40;
const MOBILE_MENU_CLOSE_DELAY = 260;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(() => {
    try {
      return localStorage.getItem("siteWarningDismissed") !== "true";
    } catch {
      return true;
    }
  });
  const lastScrollYRef = React.useRef(0);

  const navLinks = [
    { name: "Home", href: "#", section: "home" },
    { name: "Services", href: "#services", section: "services" },
    { name: "About Us", href: "#about", section: "about" },
    { name: "Gallery", href: "#gallery", section: "gallery" },
    // { name: "Team", href: "#team", section: "team" },
    { name: "Contact", href: "#contact", section: "contact" },
  ];

  const isMobileViewport = () => window.matchMedia("(max-width: 767px)").matches;

  const getScrollOffset = () => {
    const base = isMobileViewport() ? MOBILE_NAV_HEIGHT : DESKTOP_NAV_HEIGHT;
    return base + (isWarningVisible ? WARNING_HEIGHT : 0);
  };

  const scrollToSection = (href: string) => {
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.querySelector(href);
    if (!element) return;

    const top =
      (element as HTMLElement).getBoundingClientRect().top +
      window.scrollY -
      getScrollOffset();

    window.scrollTo({ top, behavior: "smooth" });
  };

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
      const scrollPosition = window.scrollY + getScrollOffset() + 1;
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

  useEffect(() => {
    const handleFooterVisibility = () => {
      const footer = document.getElementById("footer");
      if (!footer) return;

      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (isScrollingUp) {
        setIsFooterVisible(false);
        return;
      }

      const footerTop = footer.getBoundingClientRect().top + window.scrollY;
      const hidePoint = footerTop + footer.offsetHeight * 0.45;
      const viewportPoint = window.scrollY + window.innerHeight;
      const shouldHide = viewportPoint >= hidePoint;

      setIsFooterVisible(shouldHide);
      if (shouldHide) {
        setIsMobileMenuOpen(false);
      }
    };

    handleFooterVisibility();
    window.addEventListener("scroll", handleFooterVisibility);
    window.addEventListener("resize", handleFooterVisibility);

    return () => {
      window.removeEventListener("scroll", handleFooterVisibility);
      window.removeEventListener("resize", handleFooterVisibility);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    section: string,
  ) => {
    e.preventDefault();
    const shouldUseMobileFlow = isMobileViewport();
    setIsMobileMenuOpen(false);
    setActiveSection(section);

    if (shouldUseMobileFlow) {
      window.setTimeout(() => scrollToSection(href), MOBILE_MENU_CLOSE_DELAY);
      return;
    }

    scrollToSection(href);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveSection("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <AnimatePresence>
        {isWarningVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed left-0 right-0 top-0 w-full"
            style={{
              zIndex: 9999,
              backgroundColor: "#FEF3C7",
              color: "#92400E",
              borderBottom: "1px solid #FDE68A",
              pointerEvents: "auto",
            }}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-2 text-sm">
                <div className="flex items-center gap-3 text-sm">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>This site is still undergoing development.</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Dismiss development warning"
                    className="rounded-md p-2"
                    style={{ pointerEvents: "auto", background: "transparent" }}
                    onClick={() => {
                      setIsWarningVisible(false);
                      try {
                        localStorage.setItem("siteWarningDismissed", "true");
                      } catch {}
                    }}
                  >
                    <X className="h-4 w-4" style={{ color: "#92400E" }} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isFooterVisible ? -120 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ top: isWarningVisible ? WARNING_HEIGHT : 0 }}
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
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
                className={`absolute inset-0 h-12 w-auto max-w-none transition-opacity duration-200 ${
                  isScrolled ? "opacity-0" : "opacity-100"
                }`}
              />
              {/* h-10 pinaka size */}
              <img
                src={SCROLLED_LOGO_SRC}
                alt="TechnoShine"
                className={`absolute inset-0 h-12 w-auto max-w-none transition-opacity duration-200 ${
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
            <Link
              href="/company-profile"
              className={`text-sm font-medium transition-all duration-300 uppercase tracking-wider relative group ${
                isScrolled
                  ? "text-muted-foreground hover:text-primary"
                  : "text-white/80 hover:text-primary"
              }`}
            >
              Company Profile
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
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
              <Link
                href="/company-profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-lg font-display transition-colors uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                Company Profile
              </Link>
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
    </>
  );
}
