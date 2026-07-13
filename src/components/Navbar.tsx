import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";

const TOP_LOGO_SRC = `${import.meta.env.BASE_URL}logo/companylogo1.png`;
const SCROLLED_LOGO_SRC = `${import.meta.env.BASE_URL}logo/companylogo2.png`;

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
  const lastScrollYRef = useRef(0);
  const normalizedLocation = location.replace(/\/$/, "") || "/";
  const solidNav = isScrolled || isMobileMenuOpen;
  const usesDarkTransparentNav =
    !solidNav &&
    (normalizedLocation === "/about" ||
      normalizedLocation === "/contact" ||
      normalizedLocation === "/services");

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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isFooterVisible ? -120 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ top: 0 }}
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          solidNav
            ? "border-b border-border bg-background/95 py-[0.70rem] shadow-sm backdrop-blur-md"
            : "border-b border-border/70 bg-background/95 py-[0.70rem] shadow-sm backdrop-blur-md md:border-b-0 md:bg-transparent md:py-5 md:shadow-none md:backdrop-blur-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => handleLinkClick("/")}
              className="group relative z-[61] flex items-center gap-2"
            >
              <span className="relative block h-12 w-[170px] md:h-16 md:w-[210px]">
                <img
                  src={TOP_LOGO_SRC}
                  alt="Technoshine"
                  className={`absolute inset-0 h-12 w-auto max-w-none transition-opacity duration-200 md:h-16 ${
                    solidNav || usesDarkTransparentNav ? "opacity-0" : "opacity-0 md:opacity-100"
                  }`}
                />
                <img
                  src={SCROLLED_LOGO_SRC}
                  alt="Technoshine"
                  className={`absolute inset-0 h-12 w-auto max-w-none transition-opacity duration-200 md:h-16 ${
                    solidNav || usesDarkTransparentNav ? "opacity-100" : "opacity-100 md:opacity-0"
                  }`}
                />
              </span>
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => {
                const isActive =
                  normalizedLocation === link.href ||
                  (link.href !== "/" && normalizedLocation.startsWith(`${link.href}/`));
                const linkTone = isActive
                  ? "text-primary"
                  : solidNav
                    ? "text-muted-foreground hover:text-primary"
                    : usesDarkTransparentNav
                      ? "text-foreground/80 hover:text-primary"
                      : "text-white/80 hover:text-primary";

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => handleLinkClick(link.href)}
                    className={`group relative inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${linkTone}`}
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
              className="relative z-[61] -mr-2 p-2 text-foreground transition-colors hover:text-primary md:hidden"
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
                  const isActive =
                    normalizedLocation === link.href ||
                    (link.href !== "/" && normalizedLocation.startsWith(`${link.href}/`));

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
