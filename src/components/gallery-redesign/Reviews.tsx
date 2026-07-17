import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MessageSquareQuote, Quote, Star, User } from "lucide-react";
import { useTestimonialsState, type TestimonialRecord } from "@/lib/admin-store";

function normalizeReviewIndex(index: number, totalReviews: number) {
  if (totalReviews === 0) return 0;
  return ((index % totalReviews) + totalReviews) % totalReviews;
}

function ReviewCard({
  active,
  review,
}: {
  active: boolean;
  review: TestimonialRecord;
}) {
  const rating = Math.min(5, Math.max(1, Number(review.rating) || 5));

  return (
    <article
      className={`flex min-h-[292px] flex-col items-center justify-between gap-6 rounded-lg border border-[#c0c0c0]/55 px-5 py-8 text-center backdrop-blur transition-all duration-300 sm:px-7 ${
        active ? "opacity-100" : "opacity-58"
      }`}
    >
      <div className="flex gap-1">
        {Array.from({ length: rating }).map((_, starIndex) => (
          <Star key={starIndex} className="h-4 w-4 fill-primary text-primary" />
        ))}
      </div>

      <blockquote className="flex flex-1 flex-col items-center justify-center gap-4">
        <Quote className="h-7 w-7 fill-primary/20 text-primary/70" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-white/80 sm:text-base">
          &ldquo;{review.quote}&rdquo;
        </p>
      </blockquote>

      <div className="mt-1 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5">
          <User className="h-5 w-5 text-white/50" />
        </div>
        <p className="font-display text-sm uppercase tracking-wide text-white">
          {review.clientName}
        </p>
      </div>
    </article>
  );
}

export function Reviews() {
  const { testimonials } = useTestimonialsState(true);
  const reviews = testimonials.filter((review) => review.isPublished && review.quote);
  const canSlide = reviews.length > 1;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    duration: 34,
    loop: canSlide,
    skipSnaps: false,
    watchDrag: canSlide,
  });

  const syncSelectedIndex = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    setSelectedIndex((current) => Math.min(current, Math.max(reviews.length - 1, 0)));
    emblaApi?.reInit();
  }, [emblaApi, reviews.length]);

  useEffect(() => {
    if (!emblaApi) return;

    syncSelectedIndex();
    emblaApi.on("select", syncSelectedIndex);
    emblaApi.on("reInit", syncSelectedIndex);

    return () => {
      emblaApi.off("select", syncSelectedIndex);
      emblaApi.off("reInit", syncSelectedIndex);
    };
  }, [emblaApi, syncSelectedIndex]);

  const goPrevious = () => {
    if (reviews.length === 0) return;

    setSelectedIndex((current) => normalizeReviewIndex(current - 1, reviews.length));
    emblaApi?.scrollPrev();
  };

  const goNext = () => {
    if (reviews.length === 0) return;

    setSelectedIndex((current) => normalizeReviewIndex(current + 1, reviews.length));
    emblaApi?.scrollNext();
  };

  const showReview = (index: number) => {
    setSelectedIndex(index);
    emblaApi?.scrollTo(index);
  };

  return (
    <section id="reviews" className="relative overflow-hidden bg-foreground py-20">
      <div className="absolute inset-0 tech-pattern opacity-[0.04]" />

      {canSlide ? (
        <>
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous review"
            className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition-colors hover:border-primary hover:bg-primary md:flex sm:left-6 lg:left-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next review"
            className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition-colors hover:border-primary hover:bg-primary md:flex sm:right-6 lg:right-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center" data-aos="fade-up">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-primary">
            Reviews
          </p>
          <h3 className="font-display text-3xl uppercase text-white md:text-5xl">Testimonials</h3>
        </div>

        {reviews.length === 0 ? (
          <div
            role="status"
            className="mx-auto flex min-h-64 max-w-2xl flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/[0.03] px-6 py-10 text-center"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <MessageSquareQuote className="h-10 w-10 text-primary" aria-hidden="true" />
            <h4 className="mt-4 font-display text-2xl font-bold uppercase tracking-normal text-white">
              No testimonials uploaded yet
            </h4>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
              Published reviews will appear here once they are available.
            </p>
          </div>
        ) : (
          <>
            <div ref={emblaRef} className="overflow-hidden py-4" data-aos="fade-up" data-aos-delay="100">
              <div className="-ml-5 flex md:-ml-8">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="min-w-0 shrink-0 basis-full pl-5 md:basis-1/3 md:pl-8"
                  >
                    <ReviewCard review={review} active={index === selectedIndex} />
                  </div>
                ))}
              </div>
            </div>

            {canSlide ? (
              <>
                <div className="mt-10 hidden justify-center gap-2 md:flex">
                  {reviews.map((review, index) => (
                    <button
                      key={review.id}
                      type="button"
                      aria-label={`Show review ${index + 1}`}
                      onClick={() => showReview(index)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === selectedIndex ? "bg-primary" : "bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 md:hidden">
                  <button
                    type="button"
                    onClick={goPrevious}
                    aria-label="Previous review"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition-colors hover:border-primary hover:bg-primary"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex gap-2">
                    {reviews.map((review, index) => (
                      <button
                        key={review.id}
                        type="button"
                        aria-label={`Show review ${index + 1}`}
                        onClick={() => showReview(index)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index === selectedIndex ? "bg-primary" : "bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next review"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition-colors hover:border-primary hover:bg-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
