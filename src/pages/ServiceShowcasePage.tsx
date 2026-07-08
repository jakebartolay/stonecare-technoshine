import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import { SiteLayout } from "@/components/SiteLayout";
import { getServiceBySlug, serviceItems } from "@/lib/site-content";
import { useSeo } from "@/lib/use-seo";

function assetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export default function ServiceShowcasePage() {
  const [, params] = useRoute<{ slug: string }>("/services/:slug");
  const [, trailingParams] = useRoute<{ slug: string }>("/services/:slug/");
  const slug = params?.slug ?? trailingParams?.slug ?? "";
  const service = getServiceBySlug(slug);

  useSeo({
    title: service ? `${service.title} | TECHNOSHINE Services` : "Service Not Found | TECHNOSHINE",
    description: service
      ? `${service.summary} View temporary showcase images for completed TECHNOSHINE service work.`
      : "The requested TECHNOSHINE service page could not be found.",
  });

  if (!service) {
    return (
      <SiteLayout>
        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Service Not Found
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal text-foreground">
              This service page is unavailable.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The link may be outdated or the service page may have moved.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 border border-primary bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const relatedServices = serviceItems.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <SiteLayout>
      <section className="relative min-h-[78svh] overflow-hidden bg-black">
        <img
          src={assetPath(service.image)}
          alt={service.title}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/42 to-black/16" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/18" />

        <div className="relative z-10 mx-auto flex min-h-[78svh] w-full max-w-7xl flex-col justify-end px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="mb-8 inline-flex w-fit min-h-10 items-center justify-center gap-2 border border-white/35 bg-white/10 px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-white backdrop-blur transition hover:border-primary hover:bg-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Services
          </Link>

          <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
            Service Showcase
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold uppercase leading-tight tracking-normal sm:text-6xl">
            {service.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/86 sm:text-base">
            {service.summary}
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              Service Scope
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold uppercase leading-tight tracking-normal text-foreground">
              What we handle
            </h2>
            <ul className="mt-6 space-y-4">
              {service.scope.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/82">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div>
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                  Cleaned Showcase
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-normal text-foreground sm:text-4xl">
                  Sample completed surfaces
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Temporary images are placed here so you can replace them with actual cleaned project photos anytime.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {service.showcaseImages.map((image, index) => (
                <figure
                  key={`${image.src}-${index}`}
                  className={index === 0 ? "sm:col-span-2" : undefined}
                >
                  <div className={index === 0 ? "aspect-[16/8] overflow-hidden bg-neutral-100" : "aspect-[4/3] overflow-hidden bg-neutral-100"}>
                    <img
                      src={assetPath(image.src)}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 hover:scale-[1.025]"
                    />
                  </div>
                  <figcaption className="border-x border-b border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-foreground">
                    {image.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7f7] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                More Services
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal text-foreground">
                Explore related care
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-foreground"
            >
              Request Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {relatedServices.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="group overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:border-primary"
              >
                <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img
                    src={assetPath(item.image)}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold uppercase tracking-normal text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
