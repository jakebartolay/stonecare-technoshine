import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail } from "lucide-react";
// import { useSubmitContact } from "@/lib/api-client-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const { toast } = useToast();
  const submitMutation = {
    mutate: (data: any, callbacks?: any) => {
      console.log("Form submitted", data);
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    isPending: false,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

    const onSubmit = (data: ContactFormValues) => {
      submitMutation.mutate(
        { data },
        {
          onSuccess: () => {
            toast({
              title: "Request Received",
              description: "We'll be in touch shortly to arrange your free assessment.",
            });
            reset();
          },
          onError: () => {
            toast({
              variant: "destructive",
              title: "Submission Failed",
              description: "Something went wrong. Please try again.",
            });
          },
        }
      );
    };
  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-primary font-mono text-sm tracking-[0.2em] mb-3 uppercase">Get In Touch</h2>
          <h3 className="text-3xl md:text-5xl font-display text-foreground">BOOK A FREE <span className="text-primary">ASSESSMENT</span></h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Info Desktop */}
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
                Mon – Sat, 9am – 6pm
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-card border border-border p-8 relative"
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Your Name</label>
                  <input
                    {...register("name")}
                    className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm"
                    placeholder="Jane Smith"
                  />
                  {errors.name && <p className="text-destructive text-xs font-mono">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Email Address</label>
                  <input
                    {...register("email")}
                    className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm"
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="text-destructive text-xs font-mono">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Property / Company (Optional)</label>
                <input
                  {...register("company")}
                  className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm"
                  placeholder="Hotel Grand, Private Residence..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Describe Your Stone & Requirements</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm resize-none"
                  placeholder="E.g. Carrara marble kitchen floor, heavy etching and scratches, approx 40m²..."
                />
                {errors.message && <p className="text-destructive text-xs font-mono">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitMutation.isPending}
                className="w-full py-4 bg-primary text-white font-display font-bold text-lg uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting || submitMutation.isPending ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    Send Enquiry <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info Phoneview */}
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
              Mon – Sat, 9am – 6pm
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
