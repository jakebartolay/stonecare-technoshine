import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { serviceItems, type ServiceItem } from "@/lib/site-content";

const slideDuration = 60000;
const carouselTransition = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const };

function serviceImagePath(image: string) {
  return `${import.meta.env.BASE_URL}${image}`;
}

export function Services({ items = serviceItems }: { items?: ServiceItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const services = items.length > 0 ? items : serviceItems;

  const goToSlide = (nextIndex: number, nextDirection: number) => {
    setDirection(nextDirection);
    setActiveIndex((nextIndex + services.length) % services.length);
  };

  const goNext = () => goToSlide(activeIndex + 1, 1);

  useEffect(() => {
    const preloadImages = services.map((service) => {
      const image = new Image();
      image.src = serviceImagePath(service.image);
      return image;
    });

    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((currentIndex) => (currentIndex + 1) % services.length);
    }, slideDuration);

    return () => {
      window.clearInterval(timer);
      preloadImages.length = 0;
    };
  }, [services]);

  return (
    <section
      id="services"
      className="relative min-h-screen overflow-hidden bg-black"
    >
      <div className="services-carousel-bg absolute inset-0">
        {services.map((service, index) => (
          <motion.img
            key={service.title}
            src={serviceImagePath(service.image)}
            alt={index === activeIndex ? service.title : ""}
            aria-hidden={index !== activeIndex}
            loading="eager"
            decoding="async"
            animate={{
              opacity: index === activeIndex ? 1 : 0,
              scale: index === activeIndex ? 1 : 1.025,
              x: index === activeIndex ? 0 : direction * -24,
            }}
            transition={carouselTransition}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ))}
      </div>

      <div className="services-carousel-overlay absolute inset-0 bg-gradient-to-r from-black/78 via-black/28 to-black/8" />
      <div className="services-carousel-overlay absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-black/20" />

      <div className="services-carousel-content relative z-10 mx-auto flex min-h-screen w-full max-w-[1216px] flex-col justify-end px-6 pb-16 pt-32 text-white sm:px-10 sm:pb-20 sm:pt-36 lg:px-0 lg:pt-40">
        <div className="space-y-5">
          <div className="relative min-h-[12.5rem] max-w-xl sm:min-h-[12rem]">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                aria-hidden={index !== activeIndex}
                animate={{
                  opacity: index === activeIndex ? 1 : 0,
                  y: index === activeIndex ? 0 : 18,
                  x: index === activeIndex ? 0 : direction * -14,
                }}
                transition={carouselTransition}
                className={`absolute inset-x-0 bottom-0 drop-shadow-[0_3px_18px_rgba(0,0,0,0.76)] [text-shadow:0_2px_8px_rgba(0,0,0,0.82),0_10px_24px_rgba(0,0,0,0.58)] ${
                  index === activeIndex ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <h4 className="font-display text-3xl font-bold uppercase leading-tight tracking-normal sm:text-4xl lg:text-5xl">
                  {String(index + 1).padStart(2, "0")}. {service.title}
                </h4>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/86 sm:text-base">
                  {service.summary}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {services.map((service, index) => (
                <button
                  key={service.title}
                  type="button"
                  onClick={() => goToSlide(index, index >= activeIndex ? 1 : -1)}
                  className="group h-6"
                  aria-label={`Show ${service.title}`}
                >
                  <span className="block h-px w-full bg-white/35">
                    <span
                      className={`block h-px bg-white transition-all duration-500 ${
                        index === activeIndex ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </span>
                </button>
              ))}
            </div>

            <p className="font-mono text-xs text-white/85">
              {activeIndex + 1}/{services.length}
            </p>

            <button
              type="button"
              onClick={goNext}
              className="flex h-9 w-9 items-center justify-center border border-white/35 bg-white/10 text-white transition-colors hover:border-primary hover:bg-primary"
              aria-label="Show next service"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
