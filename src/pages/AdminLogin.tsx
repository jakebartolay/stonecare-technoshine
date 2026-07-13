import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAdminLoginPreferences,
  loginAdmin,
  saveAdminLoginPreferences,
  useAdminSession,
} from "@/lib/admin-store";
import { transactionToast } from "@/lib/transaction-toast";

type FormStatus = "idle" | "submitting";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const session = useAdminSession();
  const [initialPreferences] = useState(getAdminLoginPreferences);
  const [email, setEmail] = useState(initialPreferences.email);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(initialPreferences.remember);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");

  useEffect(() => {
    if (session) navigate("/company/admin/dashboard");
  }, [navigate, session]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedEmail = String(formData.get("username") ?? email).trim();
    const submittedPassword = String(formData.get("password") ?? password);
    const submittedRemember = formData.get("remember") === "on";

    if (!submittedEmail || !submittedPassword) {
      transactionToast.warning("Missing login details", "Enter your admin email and password.");
      return;
    }

    setEmail(submittedEmail);
    setPassword(submittedPassword);
    setRemember(submittedRemember);
    setShowPassword(false);
    setStatus("submitting");

    window.setTimeout(() => {
      void loginAdmin(submittedEmail, submittedPassword, submittedRemember)
        .then(() => {
          saveAdminLoginPreferences(submittedEmail, submittedRemember);
          transactionToast.success("Login successful", "Redirecting to the admin dashboard.");
          navigate("/company/admin/dashboard");
        })
        .catch((error: Error) => {
          setStatus("idle");
          transactionToast.error("Login failed", error, "Invalid admin email or password.");
        });
    }, 650);
  }

  const isSubmitting = status === "submitting";

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative isolate flex min-h-screen overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/marble-hall.jpg`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,0.88),rgba(0,0,0,0.68)_46%,rgba(0,0,0,0.34))]" />
        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-primary" />

        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_430px] lg:px-8">
          <div className="flex min-h-[34vh] flex-col justify-between py-5 lg:min-h-0 lg:py-8">
            <Link href="/" className="inline-flex w-fit items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}logo/companylogo3.png`}
                alt="Technoshine"
                className="h-12 w-auto"
              />
            </Link>

            <div className="max-w-2xl py-10 lg:py-0">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Company Admin
              </p>
              <h1 className="mt-4 text-4xl leading-none text-white sm:text-6xl">
                Technoshine control access
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
                Restricted access for Technoshine internal company records and employee tools.
              </p>
            </div>
          </div>

          <div className="flex items-center pb-8 lg:pb-0">
            <form
              onSubmit={handleSubmit}
              autoComplete="on"
              className="w-full rounded-lg border border-white/14 bg-white p-5 text-neutral-950 shadow-2xl sm:p-6"
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl text-neutral-950">Admin Login</h2>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">
                    Sign in to continue to the company admin area.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <Input
                      id="admin-email"
                      name="username"
                      type="email"
                      value={email}
                      autoComplete="username"
                      autoCapitalize="none"
                      inputMode="email"
                      spellCheck={false}
                      placeholder="admin@technoshineph.com"
                      className="h-11 rounded-md border-neutral-300 bg-white pl-10 text-neutral-950"
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setStatus("idle");
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <Input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      autoComplete="current-password"
                      placeholder="Enter password"
                      className="h-11 rounded-md border-neutral-300 bg-white px-10 text-neutral-950"
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setStatus("idle");
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <Label
                  htmlFor="remember-admin"
                  className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700"
                >
                  <input
                    id="remember-admin"
                    name="remember"
                    type="checkbox"
                    checked={remember}
                    className="h-4 w-4 rounded border-neutral-300 accent-primary"
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  Remember me
                </Label>
                <a
                  href="mailto:contactus@technoshineph.com"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Need access?
                </a>
              </div>

              <Button
                type="submit"
                className="mt-6 h-11 w-full rounded-md font-display text-sm font-bold uppercase tracking-wider"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Checking" : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Link
                href="/"
                className="mt-4 inline-flex w-full justify-center text-sm font-semibold text-neutral-600 hover:text-primary"
              >
                Back to website
              </Link>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
