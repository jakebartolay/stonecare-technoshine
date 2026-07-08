export interface HelpProductInfo {
  slug: string;
  legacyIds: string[];
  brand: string;
  name: string;
  surface: string;
  headline: string;
  description: string;
  highlights: Array<{
    title: string;
    text: string;
  }>;
  howToUseImage: {
    src: string;
    alt: string;
    caption: string;
  };
  howToUse: string[];
  safetyNotes: string[];
}

export const helpProducts: HelpProductInfo[] = [
  {
    slug: "solen-terra-yellow-stain-color-remover",
    legacyIds: ["1"],
    brand: "Solen Terra",
    name: "Yellow Stain & Color Remover",
    surface: "For ceramic tile surfaces",
    headline: "Powerful water-based color removal and stain remover",
    description:
      "Specially crafted for ceramic tile surfaces, this remover tackles yellowing, color marks, and stains from wine, tea, coffee, and other common organic sources.",
    highlights: [
      {
        title: "Water-based formula",
        text: "Made for targeted color and stain removal on ceramic tile surfaces.",
      },
      {
        title: "Organic stain care",
        text: "Helps address yellowing, color transfer, wine, tea, coffee, and similar stain sources.",
      },
      {
        title: "Slow-drying action",
        text: "Stays workable on the stained area so it can act directly when applied as instructed.",
      },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Solen Terra Yellow Stain & Color Remover",
      caption: "Temporary instruction image. Replace this file path with the final how-to-use manual artwork.",
    },
    howToUse: [
      "Clean the ceramic tile surface and remove loose dirt before application.",
      "Apply directly to the yellow stain, color mark, or organic stain.",
      "Allow the slow-drying formula to work on the affected area as directed on the product label.",
      "Wipe, rinse with clean water, and dry the surface. Repeat only if the label allows it.",
    ],
    safetyNotes: [
      "Test first on a small hidden area before full application.",
      "Use only on ceramic tile surfaces unless the product label says otherwise.",
      "Wear suitable hand protection and keep the product away from children.",
      "Do not mix with other cleaning chemicals.",
    ],
  },
];

export function getHelpProductInfo(productId: string) {
  return helpProducts.find(
    (product) => product.slug === productId || product.legacyIds.includes(productId),
  );
}
