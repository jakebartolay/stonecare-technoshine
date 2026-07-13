import { ArrowLeft, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function AdminUrlError() {
  useEffect(() => {
    document.title = "404 Invalid Admin URL";
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
      <section className="w-full max-w-xl border border-white/10 bg-white/[0.04] p-6 text-center shadow-2xl sm:p-8">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          404 Error / Invalid Admin URL
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/15 px-5 font-display text-sm font-bold uppercase tracking-wider text-white/80 transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back Previous Page
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/15 px-5 font-display text-sm font-bold uppercase tracking-wider text-white/80 transition-colors hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </section>
    </main>
  );
}
