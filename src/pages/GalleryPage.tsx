import { BeforeAfter } from "@/components/BeforeAfter";
import { Gallery } from "@/components/Gallery";
import { SiteLayout } from "@/components/SiteLayout";

export default function GalleryPage() {
  return (
    <SiteLayout>
      <Gallery />
      <BeforeAfter />
    </SiteLayout>
  );
}
