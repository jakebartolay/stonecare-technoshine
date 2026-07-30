export type ProductBadge = "Best Seller" | "New Arrival" | "Pro Grade";

export interface ShopProduct {
  id?: string;
  slug: string;
  brand: string;
  name: string;
  category: string;
  size:
    | "250ml"
    | "350ml"
    | "500ml"
    | "1L"
    | "500g"
    | "1kg"
    | "145g"
    | "1L-2L"
    | "3.5kg"
    | "5L"
    | "5kg";
  useFor: Array<"Floors" | "Countertops" | "Bathroom" | "Tables">;
  usesLine: string;
  price: number;
  priceLabel: string;
  stockLeft: number;
  badge?: ProductBadge;
  imageUrl?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  description: string;
  howToUse: string[];
  shopeeUrl: string;
  visual: {
    accent: string;
    surface: string;
    label: string;
  };
}

const shopeeSearchUrl = (query: string) =>
  `https://shopee.ph/search?keyword=${encodeURIComponent(`Technoshine ${query}`)}`;

export const shopProducts: ShopProduct[] = [
  {
    slug: "marble-cleaner-500ml",
    brand: "TECHNOSHINE",
    name: "Marble Cleaner (pH Neutral) 500ml",
    category: "Cleaners",
    size: "500ml",
    useFor: ["Floors", "Countertops"],
    usesLine: "Daily cleaning for marble floors and countertops",
    price: 0,
    priceLabel: "₱0",
    stockLeft: 18,
    badge: "Best Seller",
    description:
      "A marble-safe daily cleaner made for routine upkeep without harsh residue or dulling. Ideal for maintaining polished marble surfaces between professional services.",
    howToUse: [
      "Sweep or wipe loose dust from the surface.",
      "Apply to a damp microfiber cloth or mop.",
      "Clean the area evenly, then wipe dry with a clean cloth.",
    ],
    shopeeUrl: shopeeSearchUrl("Marble Cleaner pH Neutral 500ml"),
    visual: {
      accent: "#FF6B00",
      surface: "#FFF8F2",
      label: "pH Neutral",
    },
  },
  {
    slug: "marble-polish-high-gloss-500ml",
    brand: "TECHNOSHINE",
    name: "Marble Polish (High Gloss) 500ml",
    category: "Polishes",
    size: "500ml",
    useFor: ["Floors", "Countertops", "Tables"],
    usesLine: "Restores shine on dull marble surfaces",
    price: 0,
    priceLabel: "₱0",
    stockLeft: 14,
    badge: "Best Seller",
    description:
      "A gloss-restoring polish for marble surfaces that need a cleaner, brighter finish. Made for spot shine maintenance and light surface refresh work.",
    howToUse: [
      "Clean and dry the marble surface first.",
      "Apply a small amount with a soft applicator pad.",
      "Buff in overlapping circles until the gloss returns.",
    ],
    shopeeUrl: shopeeSearchUrl("Marble Polish High Gloss 500ml"),
    visual: {
      accent: "#1F1A17",
      surface: "#FFF3E8",
      label: "High Gloss",
    },
  },
  {
    slug: "marble-sealer-penetrating-1l",
    brand: "TECHNOSHINE",
    name: "Marble Sealer (Penetrating) 1L",
    category: "Sealers",
    size: "1L",
    useFor: ["Floors", "Countertops", "Bathroom", "Tables"],
    usesLine: "Stain and moisture protection for marble",
    price: 0,
    priceLabel: "₱0",
    stockLeft: 9,
    badge: "New Arrival",
    description:
      "A penetrating marble sealer for added resistance against stains, moisture, and everyday spills. Suitable for stone surfaces that need extra protection.",
    howToUse: [
      "Start with a clean, fully dry surface.",
      "Apply a thin, even coat using a clean applicator.",
      "Allow absorption, remove excess, then let the sealer cure.",
    ],
    shopeeUrl: shopeeSearchUrl("Marble Sealer Penetrating 1L"),
    visual: {
      accent: "#14B8A6",
      surface: "#FFF8F2",
      label: "Sealer",
    },
  },
  {
    slug: "marble-stain-remover-250ml",
    brand: "TECHNOSHINE",
    name: "Marble Stain Remover 250ml",
    category: "Stain Care",
    size: "250ml",
    useFor: ["Countertops", "Bathroom", "Tables"],
    usesLine: "Targets coffee, oil, and hard water stains",
    price: 0,
    priceLabel: "₱0",
    stockLeft: 11,
    badge: "New Arrival",
    description:
      "A targeted stain remover for common marble marks such as coffee, oil, and hard water residue. Designed for controlled spot treatment.",
    howToUse: [
      "Test on a small hidden area before use.",
      "Apply directly to the stained area.",
      "Let it work briefly, then wipe and rinse with a damp cloth.",
    ],
    shopeeUrl: shopeeSearchUrl("Marble Stain Remover 250ml"),
    visual: {
      accent: "#4F46E5",
      surface: "#FFF8F2",
      label: "Stain Care",
    },
  },
  {
    slug: "marble-crystallizer-1l",
    brand: "TECHNOSHINE",
    name: "Marble Crystallizer 1L",
    category: "Professional Care",
    size: "1L",
    useFor: ["Floors"],
    usesLine: "Pro-grade floor crystallization for marble",
    price: 0,
    priceLabel: "₱0",
    stockLeft: 7,
    badge: "Pro Grade",
    description:
      "A professional-grade crystallizer for restoring dense, reflective marble floor finishes. Best used with appropriate floor equipment and trained handling.",
    howToUse: [
      "Clean, hone, and dry the floor before crystallization.",
      "Mist a workable section with the product.",
      "Buff using the correct machine pad until the desired finish appears.",
    ],
    shopeeUrl: shopeeSearchUrl("Marble Crystallizer 1L"),
    visual: {
      accent: "#D95B00",
      surface: "#FFF3E8",
      label: "Pro Grade",
    },
  },
  {
    slug: "marble-polishing-powder-1kg",
    brand: "TECHNOSHINE",
    name: "Marble Polishing Powder 1kg",
    category: "Professional Care",
    size: "1kg",
    useFor: ["Floors", "Countertops", "Tables"],
    usesLine: "For etching and light scratches on marble",
    price: 0,
    priceLabel: "₱0",
    stockLeft: 10,
    badge: "Pro Grade",
    description:
      "A marble polishing powder for correcting light etching, haze, and fine scratches. Intended for controlled polishing and surface refinement.",
    howToUse: [
      "Clean the surface and mask adjacent materials.",
      "Mix powder with water to form a polishing slurry.",
      "Polish in sections, then rinse and dry thoroughly.",
    ],
    shopeeUrl: shopeeSearchUrl("Marble Polishing Powder 1kg"),
    visual: {
      accent: "#334155",
      surface: "#FFF8F2",
      label: "Powder",
    },
  },
  {
    slug: "daily-spray-cleaner-350ml",
    brand: "TECHNOSHINE",
    name: "Daily Spray Cleaner 350ml",
    category: "Cleaners",
    size: "350ml",
    useFor: ["Countertops", "Bathroom", "Tables"],
    usesLine: "Spray-and-wipe cleaner, marble safe",
    price: 0,
    priceLabel: "₱0",
    stockLeft: 22,
    badge: "New Arrival",
    description:
      "A convenient spray-and-wipe cleaner for daily marble-safe touchups. Ideal for counters, tables, and bathroom stone areas.",
    howToUse: [
      "Spray lightly onto the surface or cloth.",
      "Wipe evenly with a microfiber towel.",
      "Dry the surface to prevent streaks or water marks.",
    ],
    shopeeUrl: shopeeSearchUrl("Daily Spray Cleaner 350ml"),
    visual: {
      accent: "#0891B2",
      surface: "#FFF8F2",
      label: "Daily Spray",
    },
  },
  {
    slug: "stain-poultice-deep-stains-500g",
    brand: "TECHNOSHINE",
    name: "Stain Poultice (Deep Stains) 500g",
    category: "Stain Care",
    size: "500g",
    useFor: ["Floors", "Countertops", "Bathroom", "Tables"],
    usesLine: "Deep-seated stain treatment for stone",
    price: 0,
    priceLabel: "₱0",
    stockLeft: 6,
    badge: "Pro Grade",
    description:
      "A poultice treatment for deep-seated stains that need longer contact time. Designed for careful stain extraction on marble and natural stone.",
    howToUse: [
      "Clean the area and prepare the poultice paste.",
      "Apply over the stain and cover as directed.",
      "Allow proper dwell time, then remove, rinse, and dry.",
    ],
    shopeeUrl: shopeeSearchUrl("Stain Poultice Deep Stains 500g"),
    visual: {
      accent: "#64748B",
      surface: "#FFF3E8",
      label: "Poultice",
    },
  },
];

export const shopCategories = ["All", ...Array.from(new Set(shopProducts.map((product) => product.category)))];
export const shopSizes = [
  "250ml",
  "350ml",
  "500ml",
  "1L",
  "500g",
  "1kg",
  "145g",
  "1L-2L",
  "3.5kg",
  "5L",
  "5kg",
] as const;
export const shopUseFor = ["Floors", "Countertops", "Bathroom", "Tables"] as const;

export function getShopProduct(slug: string) {
  return shopProducts.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: ShopProduct, limit = 4) {
  return getRelatedProductsFromList(product, shopProducts, limit);
}

export function getRelatedProductsFromList(product: ShopProduct, products: ShopProduct[], limit = 4) {
  const sameCategory = products.filter(
    (candidate) => candidate.category === product.category && candidate.slug !== product.slug,
  );
  const fallback = products.filter((candidate) => candidate.slug !== product.slug);

  return [...sameCategory, ...fallback]
    .filter((candidate, index, products) => products.findIndex((item) => item.slug === candidate.slug) === index)
    .slice(0, limit);
}
