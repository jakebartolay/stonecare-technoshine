import { type ReactNode } from "react";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

interface SiteLayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="home-page-shell min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="home-flow flex-grow">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
