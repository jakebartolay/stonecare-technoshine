import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";

type ErrorPageProps = {
  code: string;
  eyebrow: string;
  title: string;
  message: string;
};

export function ErrorPage({ code, eyebrow, title, message }: ErrorPageProps) {
  useEffect(() => {
    document.title = `${code} ${eyebrow}`;
  }, [code, eyebrow]);

  return (
    <main className="min-h-screen bg-foreground text-white">
      <section className="relative flex min-h-screen items-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 tech-pattern opacity-[0.04]" />
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-primary">
              {code} Error / {eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              {message}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary/90"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white/70 transition-colors hover:border-primary hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white/70 transition-colors hover:border-primary hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <p className="font-mono text-[7rem] font-bold leading-none tracking-tighter text-white sm:text-[8rem]">
              {code}
            </p>
            <div className="mt-6 h-px w-full bg-white/10" />
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.24em] text-white/45">
              HTTP Response Code
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
