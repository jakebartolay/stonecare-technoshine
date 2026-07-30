import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ExternalLink, Send, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { transactionToast } from "@/lib/transaction-toast";

const CONTACT_ENDPOINT = `${import.meta.env.BASE_URL}contact-submit.php`;
const PRIMARY_EMAIL = "erwin.torrefiel@technoshineph.com";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const formEntrance = {
  hidden: { opacity: 0, y: 42, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const officeAddress =
  "Unit 110, Union Square Condominium, 15th Avenue, Cubao, Quezon City, Philippines.";
const officeMapQuery = encodeURIComponent(officeAddress);
const officeMapEmbedSrc = `https://www.google.com/maps?q=${officeMapQuery}&output=embed`;
const officeMapHref = `https://www.google.com/maps/search/?api=1&query=${officeMapQuery}`;

function LocationCard() {
  return (
    <div className="home-accent-card bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
      <div className="flex items-center gap-4 text-primary mb-4">
        <MapPin className="w-6 h-6" />
        <h4 className="font-display text-lg text-foreground">Location</h4>
      </div>
      <p className="text-muted-foreground font-mono text-sm">
        Unit 110, Union Square Condominium,<br />
        15th Avenue, Cubao, Quezon City,<br />
        Philippines.
      </p>

      <div className="mt-5 aspect-[16/10] overflow-hidden border border-border bg-neutral-100">
        <iframe
          title="Technoshine office location map"
          src={officeMapEmbedSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <a
        href={officeMapHref}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-primary transition-colors hover:text-foreground"
      >
        Open in Google Maps
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}

export function Contact() {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [shakeForm, setShakeForm] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    shouldFocusError: false,
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSending(true);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      const contentType = response.headers.get("content-type") ?? "";
      const responseText = await response.text();

      if (!contentType.includes("application/json")) {
        throw new Error("Contact email endpoint is not running.");
      }

      if (!responseText.trim()) {
        throw new Error("Contact server returned an empty response.");
      }

      let result: {
        ok?: boolean;
        message?: string;
      };

      try {
        result = JSON.parse(responseText) as {
          ok?: boolean;
          message?: string;
        };
      } catch {
        throw new Error("Contact server returned an invalid JSON response.");
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Submission failed.");
      }

      transactionToast.success("Request sent", "Please wait. We will contact you as soon as possible.");
      reset();
    } catch (error) {
      transactionToast.error(
        "Submission failed",
        error instanceof Error && error.message.includes("endpoint")
          ? new Error("Email sending needs the PHP hosting server. On localhost, please test after deployment.")
          : error,
        "Something went wrong. Please email us directly instead.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const onInvalid = () => {
    setShakeForm(false);
    window.requestAnimationFrame(() => setShakeForm(true));
    window.setTimeout(() => setShakeForm(false), 420);
  };

  return (
    <section id="contact" className="relative flex min-h-screen items-center overflow-hidden bg-background pb-20 pt-32 sm:pt-36 lg:py-20">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center" data-aos="fade-up">
          <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">Get In Touch</h2>
          <h3 className="text-3xl md:text-5xl font-display text-foreground">BOOK A FREE <span className="text-primary">ASSESSMENT</span></h3>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.4fr] lg:items-start">

          {/* Contact Info Desktop */}
          <div
            data-aos="fade-right"
            className="hidden lg:block space-y-5"
          >
            <LocationCard />

            <div className="home-accent-card bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
              <div className="flex items-center gap-4 text-primary mb-4">
                <Mail className="w-6 h-6" />
                <h4 className="font-display text-lg text-foreground">Email Us</h4>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                {PRIMARY_EMAIL}<br />
                contactus@technoshineph.com
              </p>
            </div>

            <div className="home-accent-card bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
              <div className="flex items-center gap-4 text-primary mb-4">
                <Phone className="w-6 h-6" />
                <h4 className="font-display text-lg text-foreground">Call Us</h4>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                0917 824 1220<br />
                Mon - Sat, 9am - 6pm
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            variants={formEntrance}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
            className="home-elevated-surface relative self-start border border-border bg-card p-6 sm:p-8"
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50" />

            <motion.form
              animate={shakeForm ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.42 }}
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-xs font-mono uppercase ${errors.name ? "text-red-500" : "text-muted-foreground"}`}>Your Name</label>
                  <input
                    {...register("name")}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full bg-background border px-4 py-3 text-foreground focus:outline-none transition-all font-mono text-sm ${
                      errors.name
                        ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-border hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                    }`}
                    placeholder="Jane Smith"
                  />
                  {errors.name && focusedField !== "name" && <p className="text-red-500 text-xs font-mono">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-mono uppercase ${errors.email ? "text-red-500" : "text-muted-foreground"}`}>Email Address</label>
                  <input
                    {...register("email")}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full bg-background border px-4 py-3 text-foreground focus:outline-none transition-all font-mono text-sm ${
                      errors.email
                        ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-border hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                    }`}
                    placeholder="jane@example.com"
                  />
                  {errors.email && focusedField !== "email" && <p className="text-red-500 text-xs font-mono">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Property / Company (Optional)</label>
                <input
                  {...register("company")}
                  onFocus={() => setFocusedField("company")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm"
                  placeholder="Hotel Grand, Private Residence..."
                />
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase ${errors.message ? "text-red-500" : "text-muted-foreground"}`}>Describe Your Stone & Requirements</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-background border px-4 py-3 text-foreground focus:outline-none transition-all font-mono text-sm resize-none ${
                    errors.message
                      ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-border hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                  }`}
                  placeholder="E.g. Carrara marble kitchen floor, heavy etching and scratches, approx 40 sqm..."
                />
                {errors.message && focusedField !== "message" && <p className="text-red-500 text-xs font-mono">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSending}
                className="w-full py-4 bg-primary text-white font-display font-bold text-lg uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting || isSending ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    Send Enquiry <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.form>
          </motion.div>

          {/* Contact Info Phoneview */}
          <div
            data-aos="fade-up"
            className="mt-10 space-y-6 lg:hidden"
          >
          <LocationCard />

          <div className="home-accent-card bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
            <div className="flex items-center gap-4 text-primary mb-4">
              <Mail className="w-6 h-6" />
              <h4 className="font-display text-lg text-foreground">Email Us</h4>
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              {PRIMARY_EMAIL}<br />
              contactus@technoshineph.com
            </p>
          </div>

          <div className="home-accent-card bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
            <div className="flex items-center gap-4 text-primary mb-4">
              <Phone className="w-6 h-6" />
              <h4 className="font-display text-lg text-foreground">Call Us</h4>
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              0917 824 1220<br />
              Mon - Sat, 9am - 6pm
            </p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
