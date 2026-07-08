export interface ServiceShowcaseImage {
  src: string;
  alt: string;
  caption: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  summary: string;
  image: string;
  scope: string[];
  showcaseImages: ServiceShowcaseImage[];
}

export const serviceItems: ServiceItem[] = [
  {
    slug: "tiles",
    title: "Tiles Cleaning",
    summary:
      "Professional cleaning and stain treatment for ceramic, porcelain, and other tile surfaces.",
    image: "images/client-images/gallery-12.jpg",
    scope: [
      "Tile surface inspection and cleaning plan",
      "Yellowing, grime, and organic stain treatment",
      "Grout line detailing where applicable",
      "Rinse, dry, and care recommendation after service",
    ],
    showcaseImages: [
      {
        src: "images/client-images/gallery-12.jpg",
        alt: "Cleaned tile surface showcase",
        caption: "Cleaned tile surface",
      },
      {
        src: "images/client-images/gallery-10.jpg",
        alt: "Detailed tile cleaning showcase",
        caption: "Detailed tile cleaning",
      },
      {
        src: "images/before-after/after-5.jpg",
        alt: "Finished tile cleaning result",
        caption: "Finished tile cleaning result",
      },
    ],
  },
  {
    slug: "marble-polishing",
    title: "Marble Polishing",
    summary:
      "Diamond-grade polishing that revives dull, scratched marble to a mirror-finish brilliance.",
    image: "images/client-images/gallery-1.jpg",
    scope: [
      "Deep cleaning and surface preparation",
      "Diamond honing for scratches and dullness",
      "Final polish and gloss recovery",
      "Optional sealing for longer protection",
    ],
    showcaseImages: [
      {
        src: "images/client-images/gallery-1.jpg",
        alt: "Polished marble floor showcase",
        caption: "Polished marble floor",
      },
      {
        src: "images/client-images/gallery-2.jpg",
        alt: "Restored marble hallway showcase",
        caption: "Restored marble hallway",
      },
      {
        src: "images/client-images/gallery-3.jpg",
        alt: "Cleaned marble lobby showcase",
        caption: "Cleaned marble lobby",
      },
      {
        src: "images/before-after/after-1.jpeg",
        alt: "Finished marble polishing result",
        caption: "Finished polish result",
      },
    ],
  },
  {
    slug: "crack-chip-repair",
    title: "Crack & Chip Repair",
    summary:
      "Expert structural repair of cracks, chips, and fractures using color-matched stone epoxies.",
    image: "images/client-images/gallery-9.jpg",
    scope: [
      "Crack assessment and stone matching",
      "Color-matched epoxy filling",
      "Flush sanding and finishing",
      "Detail polish around repaired areas",
    ],
    showcaseImages: [
      {
        src: "images/client-images/gallery-9.jpg",
        alt: "Stone repair detail showcase",
        caption: "Stone repair detail",
      },
      {
        src: "images/client-images/gallery-10.jpg",
        alt: "Cleaned stone surface after repair",
        caption: "Cleaned repair area",
      },
      {
        src: "images/before-after/after-2.jpg",
        alt: "Finished crack and chip repair result",
        caption: "Finished repair result",
      },
    ],
  },
  {
    slug: "stone-restoration",
    title: "Stone Restoration",
    summary:
      "Full-cycle restoration for marble, granite, travertine, limestone, terrazzo, and other natural stone surfaces.",
    image: "images/client-images/gallery-3.jpg",
    scope: [
      "Surface cleaning and stain treatment",
      "Grinding, honing, and leveling",
      "Gloss or matte finish restoration",
      "Maintenance recommendations after turnover",
    ],
    showcaseImages: [
      {
        src: "images/client-images/gallery-3.jpg",
        alt: "Restored natural stone floor showcase",
        caption: "Restored stone floor",
      },
      {
        src: "images/client-images/gallery-12.jpg",
        alt: "Cleaned stone surface showcase",
        caption: "Cleaned stone surface",
      },
      {
        src: "images/client-images/gallery-14.jpg",
        alt: "Refinished stone floor showcase",
        caption: "Refinished floor area",
      },
    ],
  },
  {
    slug: "sealing-protection",
    title: "Sealing & Protection",
    summary:
      "Premium penetrating sealers that guard against staining, etching, and moisture ingress.",
    image: "images/client-images/gallery-12.jpg",
    scope: [
      "Stone porosity inspection",
      "Penetrating sealer application",
      "Buffing and residue removal",
      "Protection guidance for daily care",
    ],
    showcaseImages: [
      {
        src: "images/client-images/gallery-12.jpg",
        alt: "Protected polished floor showcase",
        caption: "Protected polished floor",
      },
      {
        src: "images/client-images/gallery-15.jpg",
        alt: "Sealed stone surface showcase",
        caption: "Sealed stone surface",
      },
      {
        src: "images/before-after/after-5.jpg",
        alt: "Finished sealing protection result",
        caption: "Finished sealing result",
      },
    ],
  },
  {
    slug: "granite-care",
    title: "Granite Care",
    summary:
      "Professional cleaning, refinishing, and protection for granite floors, counters, walls, and feature areas.",
    image: "images/client-images/gallery-11.jpg",
    scope: [
      "Granite surface cleaning",
      "Polish enhancement and spot correction",
      "Joint and edge detailing",
      "Commercial maintenance planning",
    ],
    showcaseImages: [
      {
        src: "images/client-images/gallery-11.jpg",
        alt: "Cleaned granite surface showcase",
        caption: "Cleaned granite surface",
      },
      {
        src: "images/client-images/gallery-10.jpg",
        alt: "Granite detail cleaning showcase",
        caption: "Granite detail cleaning",
      },
      {
        src: "images/before-after/after-4.jpg",
        alt: "Finished granite care result",
        caption: "Finished granite result",
      },
    ],
  },
  {
    slug: "terrazzo-polishing",
    title: "Terrazzo Polishing",
    summary:
      "Restoration and shine recovery for terrazzo surfaces in residential, retail, hotel, and commercial spaces.",
    image: "images/client-images/gallery-13.jpg",
    scope: [
      "Terrazzo deep cleaning",
      "Mechanical honing and polishing",
      "Surface protection treatment",
      "Routine care recommendations",
    ],
    showcaseImages: [
      {
        src: "images/client-images/gallery-13.jpg",
        alt: "Polished terrazzo floor showcase",
        caption: "Polished terrazzo floor",
      },
      {
        src: "images/client-images/gallery-14.jpg",
        alt: "Cleaned terrazzo surface showcase",
        caption: "Cleaned terrazzo surface",
      },
      {
        src: "images/before-after/after-6.jpg",
        alt: "Finished terrazzo polishing result",
        caption: "Finished terrazzo result",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return serviceItems.find((service) => service.slug === slug);
}

export const clientItems = [
  { name: "Shangri-La Manila", icon: "images/client-logo/hotel-icon-1.png" },
  { name: "Marco Polo Hotels", icon: "images/client-logo/hotel-icon-2.png" },
  { name: "Okura Hotels & Resorts", icon: "images/client-logo/hotel-icon-3.png" },
  { name: "Okada Manila", icon: "images/client-logo/hotel-icon-4.png" },
  { name: "Solaire Resort & Casino", icon: "images/client-logo/hotel-icon-5.png" },
  { name: "Waterfront Hotels & Casinos", icon: "images/client-logo/hotel-icon-6.png" },
  { name: "Nustar SkyDeck", icon: "images/client-logo/hotel-icon-7.png" },
  { name: "Marriott Hotels & Resorts", icon: "images/client-logo/hotel-icon-8.png" },
  { name: "Waterfront Hotels & Casinos | Cebu", icon: "images/client-logo/hotel-icon-9.png" },
  { name: "The Manila Hotel", icon: "images/client-logo/hotel-icon-10.png" },
  { name: "City of Dreams Manila", icon: "images/client-logo/hotel-icon-11.png" },
  { name: "Mactan Cebu International Airport", icon: "images/client-logo/hotel-icon-12.png" },
];

export const galleryHighlights = [
  {
    title: "Hotel Lobby Restoration",
    image: "images/client-images/gallery-3.jpg",
    label: "Premium floor finish",
  },
  {
    title: "Commercial Hallway Finish",
    image: "images/client-images/gallery-2.jpg",
    label: "High-traffic stone care",
  },
  {
    title: "Gloss Recovery",
    image: "images/client-images/gallery-13.jpg",
    label: "Polished and protected",
  },
];
