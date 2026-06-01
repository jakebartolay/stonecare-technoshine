import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

type LegalSection = {
  heading: string;
  body: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

const lastUpdated = "May 25, 2026";

function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <section className="border-b border-border bg-card py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="mb-8 inline-flex font-mono text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:text-foreground"
            >
              &lt; Back to Home
            </Link>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
            <h1 className="text-4xl leading-tight text-foreground md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {intro}
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Author: manager staff | Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-10">
              {sections.map((section) => (
                <article key={section.heading} className="border-b border-border pb-8">
                  <h2 className="mb-4 text-2xl text-foreground">
                    {section.heading}
                  </h2>
                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This Privacy Policy explains how TechnoShine handles information submitted through this website."
      sections={[
        {
          heading: "Information We Collect",
          body: [
            "When you contact us through the website, we may collect your name, email address, company or property name, and the message or service details you submit.",
            "We do not intentionally collect sensitive personal information through this website.",
          ],
        },
        {
          heading: "How We Use Information",
          body: [
            "We use submitted information to respond to inquiries, prepare quotations, coordinate assessments, and communicate about requested stone care or restoration services.",
            "We do not sell personal information submitted through this website.",
          ],
        },
        {
          heading: "Tracking and Analytics",
          body: [
            "This website does not currently use analytics trackers, advertising pixels, or tracking cookies.",
            "If tracking tools are added in the future, this policy should be updated before or when those tools are enabled.",
          ],
        },
        {
          heading: "Photos and Website Content",
          body: [
            "Photos, project images, logos, text, and other website content are owned by TechnoShine or used with permission, unless otherwise stated.",
            "Images and website materials may not be copied, downloaded, reposted, edited, or used for another business without written permission.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "For privacy-related requests or questions, contact TechnoShine through the contact details listed on this website.",
          ],
        },
      ]}
    />
  );
}

export function TermsOfService() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      intro="These Terms of Service describe the basic rules for using the TechnoShine website."
      sections={[
        {
          heading: "Website Use",
          body: [
            "You may browse this website to learn about TechnoShine services and submit inquiries for quotations or assessments.",
            "You agree not to misuse the website, attempt unauthorized access, or interfere with its normal operation.",
          ],
        },
        {
          heading: "Quotations and Services",
          body: [
            "Information on this website is provided for general service awareness. Final pricing, scope, and schedules may depend on site inspection, material condition, location, and project requirements.",
            "Submitting an inquiry does not automatically create a service agreement.",
          ],
        },
        {
          heading: "Content Ownership",
          body: [
            "All website text, branding, layout, photos, graphics, and project images are protected content of TechnoShine or their respective owners.",
            "Do not copy, reuse, download, scrape, repost, or use website images and materials for commercial or promotional purposes without written permission.",
          ],
        },
        {
          heading: "External Links",
          body: [
            "This website may link to external platforms such as social media pages. TechnoShine is not responsible for the content, policies, or practices of external websites.",
          ],
        },
        {
          heading: "Updates",
          body: [
            "TechnoShine may update these terms when needed. Continued use of the website means you accept the latest version posted here.",
          ],
        },
      ]}
    />
  );
}

export function CookiePolicy() {
  return (
    <LegalPage
      eyebrow="Cookies"
      title="Cookie Policy"
      intro="This Cookie Policy explains the current cookie and tracking status of this website."
      sections={[
        {
          heading: "No Tracking Cookies",
          body: [
            "This website does not currently use tracking cookies, advertising cookies, analytics cookies, or marketing pixels.",
            "We do not use cookies to follow visitors across websites or build advertising profiles.",
          ],
        },
        {
          heading: "Basic Browser Storage",
          body: [
            "The site may use basic browser storage for small interface preferences, such as remembering display or navigation settings.",
            "This storage is used only for site behavior and is not used for advertising or analytics tracking.",
          ],
        },
        {
          heading: "Future Changes",
          body: [
            "If analytics, advertising, chat widgets, or other third-party tools are added later, this Cookie Policy should be updated to explain what is used and why.",
          ],
        },
      ]}
    />
  );
}
