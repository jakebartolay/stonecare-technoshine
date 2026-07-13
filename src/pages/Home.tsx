import { Hero } from "@/components/Hero";
import { Clients } from "@/components/Clients";
import {
  AboutPreview,
  HomeContactPreview,
  ServicesPreview,
  SocialReelsPreview,
  WorkPreview,
} from "@/components/HomePreviews";
import { SiteLayout } from "@/components/SiteLayout";

export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Clients />
      <ServicesPreview />
      <SocialReelsPreview />
      <AboutPreview />
      <WorkPreview />
      <HomeContactPreview />
    </SiteLayout>
  );
}
