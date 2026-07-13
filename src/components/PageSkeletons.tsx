import { Skeleton } from "@heroui/react";

export function ServiceCardSkeletons({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-md border border-border bg-card shadow-sm"
          aria-hidden="true"
        >
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="space-y-4 p-6">
            <Skeleton className="h-7 w-3/4 rounded-sm" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-11/12 rounded-sm" />
              <Skeleton className="h-4 w-2/3 rounded-sm" />
            </div>
            <div className="space-y-3 pt-1">
              <Skeleton className="h-4 w-10/12 rounded-sm" />
              <Skeleton className="h-4 w-9/12 rounded-sm" />
              <Skeleton className="h-4 w-11/12 rounded-sm" />
            </div>
            <Skeleton className="h-10 w-36 rounded-sm" />
          </div>
        </div>
      ))}
    </>
  );
}

export function ServiceShowcaseSkeleton() {
  return (
    <div className="min-h-screen bg-white" aria-hidden="true">
      <section className="relative min-h-[78svh] overflow-hidden bg-neutral-950">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/42 to-black/16" />
        <div className="relative z-10 mx-auto flex min-h-[78svh] w-full max-w-7xl flex-col justify-end px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-32 rounded-sm bg-white/20" />
          <Skeleton className="mt-5 h-14 w-full max-w-3xl rounded-sm bg-white/20 sm:h-20" />
          <div className="mt-6 max-w-2xl space-y-3">
            <Skeleton className="h-4 w-full rounded-sm bg-white/20" />
            <Skeleton className="h-4 w-10/12 rounded-sm bg-white/20" />
          </div>
          <Skeleton className="mt-8 h-11 w-40 rounded-sm bg-white/20" />
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <Skeleton className="h-4 w-28 rounded-sm" />
            <Skeleton className="h-10 w-3/4 rounded-sm" />
            <div className="space-y-3 pt-3">
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-11/12 rounded-sm" />
              <Skeleton className="h-4 w-9/12 rounded-sm" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[4/3] rounded-md" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ShopHeroPreviewSkeleton() {
  return (
    <div className="grid h-full grid-cols-3 items-end gap-4" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-44 overflow-hidden rounded-2xl bg-white p-2 shadow-xl shadow-slate-200/70">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="mx-auto mt-3 h-3 w-4/5 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

export function ProductCardSkeletons({
  count = 8,
  layout = "grid",
}: {
  count?: number;
  layout?: "grid" | "list";
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={[
            "overflow-hidden rounded-2xl border border-[#F0D8C6] bg-white shadow-sm shadow-slate-200/60",
            layout === "list" ? "lg:grid lg:grid-cols-[12rem_1fr]" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          <Skeleton className={layout === "list" ? "aspect-square rounded-none" : "aspect-[4/5] rounded-none"} />
          <div className="space-y-3 p-4">
            <Skeleton className="h-3 w-20 rounded-sm" />
            <Skeleton className="h-5 w-10/12 rounded-sm" />
            <Skeleton className="h-4 w-7/12 rounded-sm" />
            <div className="flex items-center justify-between gap-3 pt-3">
              <Skeleton className="h-7 w-20 rounded-sm" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function ProductDetailSkeleton() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="mx-auto w-full max-w-7xl">
        <Skeleton className="mb-5 h-10 w-36 rounded-full" />
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-3 w-14 rounded-sm" />
          <Skeleton className="h-3 w-20 rounded-sm" />
          <Skeleton className="h-3 w-24 rounded-sm" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="min-w-0">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="aspect-[4/3] rounded-2xl" />
              ))}
            </div>
          </div>
          <article className="rounded-3xl border border-[#F0D8C6] bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-7">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
            <Skeleton className="mt-6 h-3 w-28 rounded-sm" />
            <Skeleton className="mt-3 h-12 w-full max-w-xl rounded-sm sm:h-16" />
            <div className="mt-6 flex items-end justify-between gap-4 border-y border-[#F0D8C6] py-5">
              <Skeleton className="h-10 w-40 rounded-sm" />
              <Skeleton className="h-4 w-24 rounded-sm" />
            </div>
            <div className="mt-6 space-y-3">
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-11/12 rounded-sm" />
              <Skeleton className="h-4 w-8/12 rounded-sm" />
            </div>
            <Skeleton className="mt-8 h-12 w-full rounded-full" />
          </article>
        </div>
      </div>
    </section>
  );
}

export function EmployeeVerificationSkeleton() {
  return (
    <div className="space-y-5" aria-hidden="true">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-7 w-8/12 rounded-sm" />
          <Skeleton className="h-4 w-full rounded-sm" />
          <Skeleton className="h-4 w-10/12 rounded-sm" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-24 rounded-sm" />
        <Skeleton className="h-24 rounded-sm" />
      </div>
    </div>
  );
}
