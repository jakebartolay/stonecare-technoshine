import { useMemo, useState } from "react";
import { Expand, ImageOff } from "lucide-react";
import { Lightbox, type LightboxSlide } from "@/components/gallery-redesign/Lightbox";
import { useGalleryImagesState } from "@/lib/admin-store";

function galleryAssetPath(path: string) {
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function FullGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { images } = useGalleryImagesState(true);
  const galleryItems = useMemo(
    () => images.filter((item) => item.isPublished && item.imageUrl),
    [images],
  );

  const slides: LightboxSlide[] = galleryItems.map((item) => ({
    type: "image",
    src: galleryAssetPath(item.imageUrl),
    caption: item.location ? `${item.title} - ${item.location}` : item.title,
  }));

  return (
    <section id="full-gallery" className="relative bg-card py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center" data-aos="fade-up">
          <h2 className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-primary">
            Gallery
          </h2>
          <h3 className="font-display text-3xl text-foreground md:text-5xl">
            OUR FULL <span className="text-primary">GALLERY</span>
          </h3>
          <p className="mt-4 text-sm text-muted-foreground">
            Every project tells a story of stone restored to its original shine.
          </p>
        </div>

        {galleryItems.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center border border-dashed border-border bg-background px-6 py-10 text-center">
            <ImageOff className="h-10 w-10 text-primary" aria-hidden="true" />
            <h4 className="mt-4 font-display text-2xl font-bold uppercase tracking-normal text-foreground">
              No images uploaded yet
            </h4>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Published gallery images will appear here once they are available.
            </p>
          </div>
        ) : (
          <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
            {galleryItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setOpenIndex(index)}
                data-aos="fade-up"
                data-aos-delay={(index % 4) * 60}
                className="group relative mb-3 block w-full break-inside-avoid overflow-hidden border border-border bg-background sm:mb-4"
              >
                <img
                  src={galleryAssetPath(item.imageUrl)}
                  alt={item.altText || item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="flex items-center gap-2 p-3 font-display text-xs uppercase tracking-wider text-white">
                    <Expand className="h-3.5 w-3.5 text-primary" />
                    {item.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {openIndex !== null && slides.length > 0 && (
        <Lightbox
          slides={slides}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </section>
  );
}
