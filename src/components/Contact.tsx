import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const { toast } = useToast();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [shakeForm, setShakeForm] = useState(false);
  const [isQuoteMode, setIsQuoteMode] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    shouldFocusError: false,
  });

  useEffect(() => {
    const handleQuoteMode = () => {
      setIsQuoteMode(true);
      setValue(
        "message",
        "I'd like to request a free quote for stone restoration.",
        { shouldDirty: true },
      );
    };

    window.addEventListener("open-free-quote", handleQuoteMode);
    return () => window.removeEventListener("open-free-quote", handleQuoteMode);
  }, [setValue]);

  useEffect(() => {
    reset({
      name: "",
      email: "",
      company: "",
      message: "",
    });
    setIsQuoteMode(false);
    setFocusedField(null);
  }, [reset]);

  const onSubmit = (data: ContactFormValues) => {
    setIsSending(true);

    fetch(`${import.meta.env.BASE_URL}contact-form.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        inquiryType: isQuoteMode ? "free-quote" : "assessment",
      }),
    })
      .then(async (response) => {
        const result = (await response.json().catch(() => null)) as
          | { ok?: boolean; message?: string; error?: string }
          | null;

        if (!response.ok || !result?.ok) {
          throw new Error(
            result?.error || result?.message || "Something went wrong. Please try again.",
          );
        }

        toast({
          variant: "success",
          title: isQuoteMode ? "Quote Request Received" : "Request Received",
          description: isQuoteMode
            ? "We'll be in touch shortly with your free quote details."
            : "We'll be in touch shortly to arrange your free assessment.",
        });
        reset();
        setIsQuoteMode(false);
        setFocusedField(null);
      })
      .catch((error: unknown) => {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        });
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const onInvalid = () => {
    setShakeForm(false);
    window.requestAnimationFrame(() => setShakeForm(true));
    window.setTimeout(() => setShakeForm(false), 420);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">
            {isQuoteMode ? "Free Quote Request" : "Get In Touch"}
          </h2>
          <h3 className="text-3xl md:text-5xl font-display text-foreground">
            {isQuoteMode ? (
              <>
                REQUEST YOUR <span className="text-primary">FREE QUOTE</span>
              </>
            ) : (
              <>
                BOOK A FREE <span className="text-primary">ASSESSMENT</span>
              </>
            )}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm mt-4">
            {isQuoteMode
              ? "Tell us about your stone surface and project scope, and we'll recommend the right treatment with a free quote."
              : "Tell us about your stone surface and we'll help arrange the right restoration assessment."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block lg:col-span-1 space-y-8"
          >
            <div className="bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
              <div className="flex items-center gap-4 text-primary mb-4">
                <MapPin className="w-6 h-6" />
                <h4 className="font-display text-lg text-foreground">Location</h4>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                Unit 110 Union Square Condominium,<br />
                15th Avenue, Cubao, Quezon City,<br />
                Philippines.
              </p>
            </div>

            <div className="bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
              <div className="flex items-center gap-4 text-primary mb-4">
                <Mail className="w-6 h-6" />
                <h4 className="font-display text-lg text-foreground">Email Us</h4>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                contactus@technoshineph.com<br />
                erwin.torrefiel@technoshineph.com
              </p>
            </div>

            <div className="bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
              <div className="flex items-center gap-4 text-primary mb-4">
                <Phone className="w-6 h-6" />
                <h4 className="font-display text-lg text-foreground">Call Us</h4>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                +44 (0)20 7946 0321<br />
                Mon - Sat, 9am - 6pm
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={
              shakeForm
                ? { duration: 0.22, ease: "easeInOut" }
                : { delay: 0.2 }
            }
            animate={shakeForm ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : undefined}
            className={`lg:col-span-2 bg-card border p-8 relative transition-all duration-300 ${
              isQuoteMode
                ? "border-primary shadow-[0_0_24px_rgba(255,107,0,0.12)]"
                : "border-border"
            }`}
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50" />

            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              autoComplete="off"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-xs font-mono uppercase ${errors.name ? "text-red-500" : "text-muted-foreground"}`}>
                    Your Name
                  </label>
                  <input
                    {...register("name")}
                    autoComplete="off"
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full bg-background border px-4 py-3 text-foreground focus:outline-none transition-all font-mono text-sm ${
                      errors.name
                        ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-border hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                    }`}
                    placeholder="Jane Smith"
                  />
                  {errors.name && focusedField !== "name" && (
                    <p className="text-red-500 text-xs font-mono">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-mono uppercase ${errors.email ? "text-red-500" : "text-muted-foreground"}`}>
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    autoComplete="off"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full bg-background border px-4 py-3 text-foreground focus:outline-none transition-all font-mono text-sm ${
                      errors.email
                        ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-border hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                    }`}
                    placeholder="jane@example.com"
                  />
                  {errors.email && focusedField !== "email" && (
                    <p className="text-red-500 text-xs font-mono">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">
                  Property / Company 
                </label>
                <input
                  {...register("company")}
                  autoComplete="off"
                  onFocus={() => setFocusedField("company")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm"
                  placeholder="Hotel Grand, Private Residence..."
                />
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase ${errors.message ? "text-red-500" : "text-muted-foreground"}`}>
                  Describe Your Stone & Requirements
                </label>
                <textarea
                  {...register("message")}
                  autoComplete="off"
                  rows={5}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-background border px-4 py-3 text-foreground focus:outline-none transition-all font-mono text-sm resize-none ${
                    errors.message
                      ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-border hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                  }`}
                  placeholder="E.g. Carrara marble kitchen floor, heavy etching and scratches, approx 40m2..."
                />
                {errors.message && focusedField !== "message" && (
                  <p className="text-red-500 text-xs font-mono">{errors.message.message}</p>
                )}
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
                    {isQuoteMode ? "Request Quote" : "Send Enquiry"} <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 space-y-6 lg:hidden"
          >
            <div className="bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
              <div className="flex items-center gap-4 text-primary mb-4">
                <MapPin className="w-6 h-6" />
                <h4 className="font-display text-lg text-foreground">Location</h4>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                Unit 110 Union Square Condominium,<br />
                15th Avenue, Cubao, Quezon City,<br />
                Philippines.
              </p>
            </div>

            <div className="bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
              <div className="flex items-center gap-4 text-primary mb-4">
                <Mail className="w-6 h-6" />
                <h4 className="font-display text-lg text-foreground">Email Us</h4>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                contactus@technoshineph.com<br />
                erwin.torrefiel@technoshineph.com
              </p>
            </div>

            <div className="bg-card border border-border p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.1)] transition-all">
              <div className="flex items-center gap-4 text-primary mb-4">
                <Phone className="w-6 h-6" />
                <h4 className="font-display text-lg text-foreground">Call Us</h4>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                +44 (0)20 7946 0321<br />
                Mon - Sat, 9am - 6pm
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
