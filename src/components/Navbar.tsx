import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";

const TOP_LOGO_SRC = `${import.meta.env.BASE_URL}logo/companylogo1.png`;
const SCROLLED_LOGO_SRC = `${import.meta.env.BASE_URL}logo/companylogo2.png`;
const WARNING_HEIGHT = 40;

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About Us", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Clients", href: "/clients" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(() => {
    try {
      return localStorage.getItem("siteWarningDismissed") !== "true";
    } catch {
      return true;
    }
  });
  const lastScrollYRef = useRef(0);
  const normalizedLocation = location.replace(/\/$/, "") || "/";
  const solidNav = isScrolled || isMobileMenuOpen;
  const usesDarkTransparentNav =
    !solidNav &&
    (normalizedLocation === "/about" || normalizedLocation === "/contact");

  useEffect(() => {
    const preloadImages = [TOP_LOGO_SRC, SCROLLED_LOGO_SRC].map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });

    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      preloadImages.length = 0;
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href === normalizedLocation) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
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
                <button
                  type="button"
                  aria-label="Dismiss development warning"
                  className="rounded-md bg-transparent p-2"
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
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isFooterVisible ? -120 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ top: isWarningVisible ? WARNING_HEIGHT : 0 }}
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          solidNav
            ? "border-b border-border bg-background/95 py-7 shadow-sm backdrop-blur-md"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => handleLinkClick("/")}
              className="group relative z-[61] flex items-center gap-2"
            >
              <span className="relative block h-16 w-[210px]">
                <img
                  src={TOP_LOGO_SRC}
                  alt="Technoshine"
                  className={`absolute inset-0 h-16 w-auto max-w-none transition-opacity duration-200 ${
                    solidNav || usesDarkTransparentNav ? "opacity-0" : "opacity-100"
                  }`}
                />
                <img
                  src={SCROLLED_LOGO_SRC}
                  alt="Technoshine"
                  className={`absolute inset-0 h-16 w-auto max-w-none transition-opacity duration-200 ${
                    solidNav || usesDarkTransparentNav ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => {
                const isActive = normalizedLocation === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => handleLinkClick(link.href)}
                    className={`group relative text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? "text-primary"
                        : solidNav
                          ? "text-muted-foreground hover:text-primary"
                          : usesDarkTransparentNav
                            ? "text-foreground/80 hover:text-primary"
                            : "text-white/80 hover:text-primary"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                        isActive
                          ? "w-full shadow-[0_0_12px_rgba(255,107,0,0.45)]"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
              <Link
                href="/contact"
                onClick={() => handleLinkClick("/contact")}
                className="border border-primary bg-primary px-5 py-2 font-display text-sm font-bold text-white shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all duration-300 hover:bg-transparent hover:text-primary hover:shadow-[0_0_25px_rgba(255,107,0,0.6)]"
              >
                FREE QUOTE
              </Link>
            </div>

            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              className={`relative z-[61] -mr-2 p-2 transition-colors hover:text-primary md:hidden ${
                solidNav || usesDarkTransparentNav ? "text-foreground" : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative z-[60] overflow-hidden border-b border-border bg-background shadow-lg md:hidden"
            >
              <div className="flex flex-col gap-4 px-4 py-6">
                {navLinks.map((link) => {
                  const isActive = normalizedLocation === link.href;

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => handleLinkClick(link.href)}
                      className={`block py-2 font-display text-lg uppercase tracking-wider transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <Link
                  href="/contact"
                  onClick={() => handleLinkClick("/contact")}
                  className="mt-2 inline-flex items-center justify-center border border-primary bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-transparent hover:text-primary"
                >
                  FREE QUOTE
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
