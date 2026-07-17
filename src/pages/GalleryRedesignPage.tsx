import { FullGallery } from "@/components/gallery-redesign/FullGallery";
import { HeroMediaSlider } from "@/components/gallery-redesign/HeroMediaSlider";
import { InquiryStrip } from "@/components/gallery-redesign/InquiryStrip";
import { Reviews } from "@/components/gallery-redesign/Reviews";
import { WorkGrid } from "@/components/gallery-redesign/WorkGrid";
import { BeforeAfter } from "@/components/BeforeAfter";
import { SiteLayout } from "@/components/SiteLayout";

export default function GalleryRedesignPage() {
  return (
    <SiteLayout>
      <HeroMediaSlider />
      <WorkGrid />
      <InquiryStrip />
      <BeforeAfter />
      <FullGallery />
      <Reviews />
    </SiteLayout>
  );
}
