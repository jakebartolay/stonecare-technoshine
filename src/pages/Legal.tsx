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
  lastUpdated?: string;
  showAuthor?: boolean;
  sections: LegalSection[];
};

const defaultLastUpdated = "May 25, 2026";

function LegalPage({
  eyebrow,
  title,
  intro,
  lastUpdated = defaultLastUpdated,
  showAuthor = true,
  sections,
}: LegalPageProps) {
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
              {showAuthor
                ? `Author: manager staff | Last updated: ${lastUpdated}`
                : `Last updated: ${lastUpdated}`}
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
      title="PRIVACY POLICY"
      intro="This Privacy Policy explains how Technoshine handles information submitted through this website."
      lastUpdated="July 2026"
      showAuthor={false}
      sections={[
        {
          heading: "WHO WE ARE",
          body: [
            'Technoshine Stonecare and Restoration ("Technoshine", "we", "us") operates this website. Office: Unit 110, Union Square Condominium, 15th Avenue, Cubao, Quezon City, Philippines.',
          ],
        },
        {
          heading: "INFORMATION WE COLLECT",
          body: [
            "When you use our contact or quote request form, we collect the information you provide: your name, email address, company or property name (optional), and the details of your enquiry. We do not collect data through advertising or analytics trackers.",
          ],
        },
        {
          heading: "HOW WE USE YOUR INFORMATION",
          body: [
            "We use the information you submit only to respond to your enquiry, prepare quotations or site assessments, and communicate with you about requested services. We do not sell, rent, or share your personal information with third parties for marketing purposes.",
          ],
        },
        {
          heading: "DATA RETENTION",
          body: [
            "Enquiry details are kept only as long as needed to handle your request and for reasonable business records, after which they are deleted.",
          ],
        },
        {
          heading: "DATA SECURITY",
          body: [
            "We take reasonable organizational and technical measures to protect the personal information submitted through this website against unauthorized access, disclosure, or loss.",
          ],
        },
        {
          heading: "YOUR RIGHTS",
          body: [
            "Under the Data Privacy Act of 2012 (RA 10173), you have the right to access, correct, or request deletion of your personal information, and to object to its processing. To exercise these rights, contact us using the details below.",
          ],
        },
        {
          heading: "CONTACT US",
          body: [
            "For privacy-related questions or requests:",
            "Email: contactus@technoshineph.com",
            "Phone: 0917 824 1220",
            "Address: Unit 110, Union Square Condominium, 15th Avenue, Cubao, Quezon City, Philippines",
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
      intro="These Terms of Service describe the basic rules for using the Technoshine website."
      sections={[
        {
          heading: "Website Use",
          body: [
            "You may browse this website to learn about Technoshine services and submit inquiries for quotations or assessments.",
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
            "All website text, branding, layout, photos, graphics, and project images are protected content of Technoshine or their respective owners.",
            "Do not copy, reuse, download, scrape, repost, or use website images and materials for commercial or promotional purposes without written permission.",
          ],
        },
        {
          heading: "External Links",
          body: [
            "This website may link to external platforms such as social media pages. Technoshine is not responsible for the content, policies, or practices of external websites.",
          ],
        },
        {
          heading: "Updates",
          body: [
            "Technoshine may update these terms when needed. Continued use of the website means you accept the latest version posted here.",
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
