import { useEffect, useState } from "react";

export interface HelpProductInfo {
  productCode?: string;
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
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const helpProducts: HelpProductInfo[] = [
  {
    slug: "solen-terra-yellow-stain-color-remover",
    legacyIds: ["1", "T-YC1"],
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
  {
    slug: "lumera-medio-granite-polishing-restoring-cream",
    legacyIds: ["T-PR2"],
    brand: "Lumera Medio",
    name: "Granite Polishing & Restoring Cream",
    surface: "For mid-light and warm-toned granite",
    headline: "Professional-grade polishing and restoring cream for mid-light granite",
    description:
      "A professional-grade polishing and restoring cream for mid-light and warm-toned granite. It restores deep gloss and enhances the stone's natural color while shielding it from stains, water marks, and light scratches. Its protective coating extends surface life and keeps beige and neutral granite looking refined — offering lasting protection with easy application for the elegant spaces of five-star hotels.",
    highlights: [
      {
        title: "Protective coating",
        text: "Shields mid-light and warm-toned granite from stains, water marks, and light scratches.",
      },
      {
        title: "Color restoration",
        text: "Restores deep gloss and enhances the natural warmth of beige and neutral granite.",
      },
      {
        title: "Lasting protection",
        text: "Easy to apply with long-lasting protection, built for high-traffic five-star hotel spaces.",
      },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Lumera Medio Granite Polishing & Restoring Cream",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: [
      "PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing.",
    ],
    safetyNotes: [
      "PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing.",
    ],
  },
  {
    slug: "marble-glazer-t-mg2-imported-stone",
    legacyIds: ["T-MG2"],
    brand: "Technoshine",
    name: "Marble Glazer T-MG2 – Imported Stone",
    surface: "For imported marble, artificial stone & cement terrazzo",
    headline: "Non-slip glazing solution for imported marble, artificial stone, and cement terrazzo",
    description:
      "A versatile, non-slip glazing solution for imported marble, artificial stone, and cement terrazzo. Penetrates deep to protect calcium-based surfaces, delivering a lasting glossy sheen across every stone finish in the property. Made for imported marble, artificial stone containing calcium carbonate, and cement terrazzo, this glazing solution delivers an unparalleled finish that accentuates each surface's natural beauty. Its unique formula ensures long-lasting protection and an elegant sheen that withstands the test of time — a practical and refined choice for hotel lobbies, corridors, and premium interior spaces alike.",
    highlights: [
      {
        title: "Non-slip glazing",
        text: "Delivers a lasting glossy, non-slip finish across imported marble, artificial stone, and cement terrazzo.",
      },
      {
        title: "Deep penetration",
        text: "Penetrates deep to protect calcium-based surfaces from within.",
      },
      {
        title: "Long-lasting protection",
        text: "Unique formula ensures lasting protection and an elegant sheen for hotel lobbies and premium interior spaces.",
      },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Marble Glazer T-MG2 Imported Stone",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: [
      "PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing.",
    ],
    safetyNotes: [
      "PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing.",
    ],
  },
  {
    slug: "lustra-natura-t-lc1-natural-stone",
    legacyIds: ["T-LC1"],
    brand: "Lustra Natura",
    name: "Liquid Marble Crystallizer – Natural Stone",
    surface: "For natural marble floors",
    headline: "Professional liquid crystallizer for natural marble floors",
    description:
      "A professional liquid crystallizer for natural marble floors. Reacts with the stone's natural calcium to form a hard, durable crystalline layer — delivering a deep wet-look shine and superior slip resistance for high-traffic hotel spaces. Formulated for natural marble stone, this crystallizer bonds directly with the surface to build a dense, long-lasting shine that ordinary polishes can't match. Through its crystallizing action, it repairs fine scratches and revives dull, worn floors — restoring the depth and clarity of the marble while keeping it slip-resistant. An essential step in any professional maintenance program where floors must stay flawless around the clock.",
    highlights: [
      {
        title: "Crystalline hardening",
        text: "Reacts with the stone's natural calcium to form a hard, durable crystalline layer.",
      },
      {
        title: "Deep wet-look shine",
        text: "Delivers a deep wet-look shine and superior slip resistance for high-traffic hotel spaces.",
      },
      {
        title: "Scratch repair",
        text: "Repairs fine scratches and revives dull, worn floors, restoring the marble's depth and clarity.",
      },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Lustra Natura T-LC1 Natural Stone",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: [
      "PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing.",
    ],
    safetyNotes: [
      "PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing.",
    ],
  },
  {
    slug: "marble-glazer-t-mg1-natural-stone",
    legacyIds: ["T-MG1"],
    brand: "Technoshine",
    name: "Marble Glazer T-MG1 – Natural Stone",
    surface: "For natural marble floors",
    headline: "Non-slip glazing solution for natural marble floors",
    description:
      "An economical, non-slip glazing solution for natural marble floors. Enhances density and brightness while keeping surfaces consistently glossy and well-protected — engineered for the routine maintenance polishing of high-traffic hotel floors. With consistent use, it revitalizes marble by enhancing its natural luster and durability.",
    highlights: [
      { title: "Non-slip glazing", text: "Enhances density and brightness while keeping marble floors consistently glossy and well-protected." },
      { title: "Routine maintenance polish", text: "Engineered for the regular upkeep of high-traffic hotel floors without compromising slip resistance." },
      { title: "Long-term revitalization", text: "With consistent use, enhances the marble's natural luster and durability." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Marble Glazer T-MG1 Natural Stone",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "marble-glazer-t-mg3-synthetic-stone",
    legacyIds: ["T-MG3"],
    brand: "Technoshine",
    name: "Marble Glazer T-MG3 – Synthetic Stone",
    surface: "For premium imported marble & polished calcium-based stone",
    headline: "Premium non-slip glazing solution for high-end imported and polished marble",
    description:
      "A premium, non-slip glazing solution for high-end imported and polished marble. Boosts density and delivers a mirror-like brightness that withstands heavy foot traffic — engineered for five-star hotels and luxury showrooms. Its advanced formulation preserves the natural beauty of the stone even under constant use.",
    highlights: [
      { title: "Mirror-like brightness", text: "Boosts density and delivers a mirror-like brightness that withstands heavy foot traffic." },
      { title: "Built for luxury spaces", text: "Ideal for the regular maintenance polishing of five-star hotels, showrooms, and flagship hospitality spaces." },
      { title: "Non-slip safety", text: "Preserves the stone's elegance while offering safety and peace of mind in high-traffic luxury areas." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Marble Glazer T-MG3 Synthetic Stone",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "lustra-proline-t-lc2-professional-stone",
    legacyIds: ["T-LC2"],
    brand: "Lustra Proline",
    name: "Liquid Marble Crystallizer – Professional Stone",
    surface: "For imported marble, artificial stone & calcium-based surfaces",
    headline: "Versatile liquid crystallizer for imported marble and artificial stone",
    description:
      "A versatile liquid crystallizer for imported marble, artificial stone, and calcium-based surfaces. Chemically bonds with the stone to produce a hard, glossy crystalline finish with a lasting wet-look shine across every marble surface in the property. Its crystallizing action smooths away fine scratches and enhances the stone's natural depth of color.",
    highlights: [
      { title: "Chemical bonding", text: "Chemically bonds with the stone to produce a hard, glossy crystalline finish." },
      { title: "Lasting wet-look shine", text: "Delivers a lasting wet-look shine across every marble surface in the property." },
      { title: "Scratch smoothing", text: "Smooths away fine scratches and enhances the stone's natural depth of color." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Lustra Proline T-LC2 Professional Stone",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "lustra-importa-t-lc3-imported-stone",
    legacyIds: ["T-LC3"],
    brand: "Lustra Importa",
    name: "Liquid Marble Crystallizer – Imported Stone",
    surface: "For high-end imported & polished marble",
    headline: "Premium liquid crystallizer for high-end imported and polished marble",
    description:
      "A premium liquid crystallizer for high-end imported and polished marble. Forms an ultra-hard crystalline layer that delivers an intense mirror-like wet-look shine — engineered for five-star hotels and flagship hospitality floors. Its advanced crystallizing action repairs fine scratches and builds a deep, glass-like finish.",
    highlights: [
      { title: "Ultra-hard crystalline layer", text: "Forms an ultra-hard crystalline layer for an intense mirror-like wet-look shine." },
      { title: "Highest level of protection", text: "Delivers the highest level of shine, durability, and protection for demanding luxury environments." },
      { title: "Scratch repair", text: "Repairs fine scratches and builds a deep, glass-like finish that resists wear under constant foot traffic." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Lustra Importa T-LC3 Imported Stone",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "valenza-suite-t-gr1-indoor",
    legacyIds: ["T-GR1"],
    brand: "Valenza Suite",
    name: "Granite Rust Remover – Indoor",
    surface: "For interior granite surfaces",
    headline: "Rust spot remover for interior granite surfaces",
    description:
      "A specially formulated rust spot remover for interior granite surfaces. Lifts rust stains caused by oxidation or metal contact without damaging the surface luster. Designed for the controlled indoor environments of five-star hotels, it restores a clean, uniform finish while helping prevent the recurrence of rust spots over time.",
    highlights: [
      { title: "Safe indoor formula", text: "Designed for the controlled indoor environments of five-star hotels." },
      { title: "Restores clean finish", text: "Clears rust stains from lobbies, corridors, and suite flooring without etching or dulling." },
      { title: "Prevents recurrence", text: "Helps prevent the recurrence of rust spots over time." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Valenza Suite T-GR1 Indoor",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "valenza-estate-t-gr2-outdoor",
    legacyIds: ["T-GR2"],
    brand: "Valenza Estate",
    name: "Granite Rust Remover – Outdoor",
    surface: "For exterior granite exposed to the elements",
    headline: "Heavy-duty rust spot remover for exterior granite",
    description:
      "A heavy-duty rust spot remover for exterior granite exposed to the elements. Cuts through stubborn rust stains without etching or dulling the surface. Built for the demanding outdoor areas of luxury properties, it restores a clean finish while helping reduce the recurrence of rust spots.",
    highlights: [
      { title: "Heavy-duty formula", text: "Cuts through stubborn rust stains without etching or dulling the surface." },
      { title: "Built for outdoor exposure", text: "Tackles rust formed by rain, oxidation, and metal contamination on driveways, facades, and poolside stone." },
      { title: "Reduces recurrence", text: "Helps reduce the recurrence of rust spots even under constant exposure to the elements." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Valenza Estate T-GR2 Outdoor",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "valenza-terrace-t-gr3-semi-outdoor",
    legacyIds: ["T-GR3"],
    brand: "Valenza Terrace",
    name: "Granite Rust Remover – Semi-Outdoor",
    surface: "For covered and transitional spaces",
    headline: "Versatile rust spot remover for covered and transitional spaces",
    description:
      "A versatile rust spot remover for covered and transitional spaces. Removes rust stains while preserving the stone's original luster. Made for the semi-exposed areas of five-star hotels, it restores a clean, even finish while helping prevent rust spots from returning.",
    highlights: [
      { title: "Preserves original luster", text: "Removes rust stains while preserving the stone's original luster." },
      { title: "Built for semi-exposed areas", text: "Clears rust on terraces, balconies, porte-cochères, and open-air corridors." },
      { title: "Prevents recurrence", text: "Restores a clean, even finish while helping prevent rust spots from returning." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Valenza Terrace T-GR3 Semi-Outdoor",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "velora-interio-t-gs1-indoor",
    legacyIds: ["T-GS1"],
    brand: "Velora Interio",
    name: "Granite Stain Remover – Indoor",
    surface: "For interior granite surfaces",
    headline: "Professional granite stain remover for interior surfaces",
    description:
      "A professional granite stain remover designed for interior surfaces. It eliminates stubborn stains caused by oxidation or metal contamination — cleaning effectively without harming the stone's natural shine or encouraging further stain formation. Ideal for the controlled indoor spaces of five-star hotels, from lobbies to suite flooring.",
    highlights: [
      { title: "Eliminates stubborn stains", text: "Removes stains caused by oxidation or metal contamination." },
      { title: "Preserves natural shine", text: "Cleans effectively without harming the stone's natural shine." },
      { title: "Indoor-grade care", text: "Ideal for the controlled indoor spaces of five-star hotels, from lobbies to suite flooring." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Velora Interio T-GS1 Indoor",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "velora-extera-t-gs2-outdoor",
    legacyIds: ["T-GS2"],
    brand: "Velora Extera",
    name: "Granite Stain Remover – Outdoor",
    surface: "For exterior surfaces exposed to the elements",
    headline: "Heavy-duty granite stain remover for exterior surfaces",
    description:
      "A heavy-duty granite stain remover engineered for exterior surfaces exposed to the elements. It cuts through tough stains caused by oxidation, weathering, or metal contamination — without etching or dulling the stone. Perfect for the demanding outdoor spaces of five-star hotels, from driveways and facades to poolside stone.",
    highlights: [
      { title: "Cuts through tough stains", text: "Removes stains caused by oxidation, weathering, or metal contamination." },
      { title: "Won't etch or dull", text: "Cleans without etching or dulling the stone." },
      { title: "Built for outdoor spaces", text: "Perfect for driveways, facades, and poolside stone." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Velora Extera T-GS2 Outdoor",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "velora-veranda-t-gs3-semi-outdoor",
    legacyIds: ["T-GS3"],
    brand: "Velora Veranda",
    name: "Granite Stain Remover – Semi-Outdoor",
    surface: "For covered and transitional spaces",
    headline: "Versatile granite stain remover for covered and transitional spaces",
    description:
      "A versatile granite stain remover made for covered and transitional spaces. It clears stains caused by oxidation or metal contamination while preserving the stone's natural luster — without dulling the surface or encouraging further stains. Built for the sheltered-yet-exposed areas of luxury properties, such as terraces, balconies, and open-air corridors.",
    highlights: [
      { title: "Preserves natural luster", text: "Clears stains while preserving the stone's natural luster." },
      { title: "No dulling", text: "Cleans without dulling the surface or encouraging further stains." },
      { title: "Built for sheltered-yet-exposed areas", text: "Ideal for terraces, balconies, and open-air corridors." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Velora Veranda T-GS3 Semi-Outdoor",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "silvara-alba-t-ms1-light",
    legacyIds: ["T-MS1"],
    brand: "Silvara Alba",
    name: "Marble Stain Remover – Light",
    surface: "For light and pale-toned marble",
    headline: "Colorless, oxidative stain remover for light-toned marble",
    description:
      "A colorless, oxidative stain remover for light-toned marble. Lifts stubborn stains and metal oxides while preserving the smooth finish of pale surfaces. Specially designed for light and pale-toned marble, it restores the stone's natural brightness and smooth finish.",
    highlights: [
      { title: "Colorless formula", text: "Lifts stubborn stains and metal oxides while preserving the smooth finish of pale surfaces." },
      { title: "Restores brightness", text: "Restores the stone's natural brightness without dulling or damaging the surface." },
      { title: "Built for bright spaces", text: "Ideal for bright lobbies and lightly-shaded marble floors of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Silvara Alba T-MS1 Light",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "silvara-champagne-t-ms2-mid-light",
    legacyIds: ["T-MS2"],
    brand: "Silvara Champagne",
    name: "Marble Stain Remover – Mid Light",
    surface: "For mid-light and warm-toned marble",
    headline: "Colorless, oxidative stain remover for mid-light marble",
    description:
      "A colorless, oxidative stain remover for mid-light and warm-toned marble. Removes stains and metal oxides from beige and champagne surfaces while protecting their finish. It revives the stone's natural warmth without dulling or damage.",
    highlights: [
      { title: "Colorless formula", text: "Removes stains and metal oxides from beige and champagne surfaces while protecting their finish." },
      { title: "Revives natural warmth", text: "Revives the stone's natural warmth without dulling or damage." },
      { title: "Built for elegant interiors", text: "Perfect for the refined marble spaces of luxury hospitality settings." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Silvara Champagne T-MS2 Mid Light",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "silvara-noir-t-ms3-dark",
    legacyIds: ["T-MS3"],
    brand: "Silvara Noir",
    name: "Marble Stain Remover – Dark",
    surface: "For dark and deeply-toned marble",
    headline: "Colorless, oxidative stain remover for dark-toned marble",
    description:
      "A colorless, oxidative stain remover for dark and deeply-toned marble. Cuts through stains and metal oxides while preserving the stone's rich depth and polish. It eliminates stains from black, charcoal, and dark-veined surfaces without fading or damaging the stone.",
    highlights: [
      { title: "Colorless formula", text: "Cuts through stains and metal oxides while preserving the stone's rich depth and polish." },
      { title: "No fading or damage", text: "Eliminates stains from black, charcoal, and dark-veined surfaces without fading the stone." },
      { title: "Built for statement spaces", text: "Built for the dramatic feature walls and statement flooring of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Silvara Noir T-MS3 Dark",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "greva-alto-t-og1-tile",
    legacyIds: ["T-OG1"],
    brand: "Greva Alto",
    name: "Oil & Grease Remover – Tile",
    surface: "For ceramic tile and floor surfaces",
    headline: "Powerful oil and grease remover for ceramic tile surfaces",
    description:
      "A powerful oil and grease remover specially formulated to penetrate and break down stubborn oil, grease, and dirt on ceramic tile and floor surfaces. It lifts heavy buildup and leaves the surface clean and residue-free — engineered for the high-traffic tiled areas of five-star hotels, from kitchens to service floors.",
    highlights: [
      { title: "Breaks down buildup", text: "Penetrates and breaks down stubborn oil, grease, and dirt on tile and floor surfaces." },
      { title: "Residue-free finish", text: "Lifts heavy buildup and leaves the surface clean and residue-free." },
      { title: "Built for high-traffic areas", text: "Engineered for high-traffic tiled areas, from kitchens to service floors." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Greva Alto T-OG1 Tile",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "greva-atlas-t-og2-granite",
    legacyIds: ["T-OG2"],
    brand: "Greva Atlas",
    name: "Oil & Grease Remover – Granite",
    surface: "For granite surfaces",
    headline: "Powerful oil and grease treatment for granite surfaces",
    description:
      "A powerful oil and grease treatment designed to penetrate and dissolve stubborn oil, grease, and dirt on granite surfaces. It cuts through heavy buildup without dulling the stone, leaving a clean, residue-free finish — built for the demanding granite areas of five-star hotels, from lobbies to poolside stone.",
    highlights: [
      { title: "Dissolves stubborn buildup", text: "Penetrates and dissolves stubborn oil, grease, and dirt on granite surfaces." },
      { title: "Won't dull the stone", text: "Cuts through heavy buildup without dulling the stone." },
      { title: "Built for demanding areas", text: "Built for the demanding granite areas of five-star hotels, from lobbies to poolside stone." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Greva Atlas T-OG2 Granite",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "greva-velin-t-og3-marble",
    legacyIds: ["T-OG3"],
    brand: "Greva Velin",
    name: "Oil & Grease Remover – Marble",
    surface: "For marble surfaces",
    headline: "Potent oil and grease treatment for marble surfaces",
    description:
      "A potent oil and grease treatment specifically designed to penetrate and dissolve stubborn oil, grease, and dirt on marble surfaces. It removes heavy buildup while preserving the stone's natural luster, leaving a clean, residue-free finish — made for the elegant marble spaces of five-star hotels.",
    highlights: [
      { title: "Dissolves stubborn buildup", text: "Penetrates and dissolves stubborn oil, grease, and dirt on marble surfaces." },
      { title: "Preserves natural luster", text: "Removes heavy buildup while preserving the stone's natural luster." },
      { title: "Residue-free finish", text: "Made for the elegant marble spaces of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Greva Velin T-OG3 Marble",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "virel-ceram-t-nr1-tile",
    legacyIds: ["T-NR1"],
    brand: "Virel Ceram",
    name: "Neutral Rust Remover – Tile",
    surface: "For ceramic tile surfaces",
    headline: "Neutral-formula rust remover for ceramic tile surfaces",
    description:
      "A neutral-formula rust remover designed for ceramic tile surfaces. It lifts rust stains caused by oxidation or metal contact while preserving the tile's existing gloss — gentle enough to be safe on hands, yet effective on stubborn staining. Ideal for the tiled kitchens, service areas, and wet zones of five-star hotels.",
    highlights: [
      { title: "Neutral formula", text: "Lifts rust stains caused by oxidation or metal contact while preserving the tile's existing gloss." },
      { title: "Gentle yet effective", text: "Gentle enough to be safe on hands, yet effective on stubborn staining." },
      { title: "Built for wet zones", text: "Ideal for tiled kitchens, service areas, and wet zones of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Virel Ceram T-NR1 Tile",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "virel-grande-t-nr2-granite",
    legacyIds: ["T-NR2"],
    brand: "Virel Grande",
    name: "Neutral Rust Remover – Granite",
    surface: "For polished granite",
    headline: "Neutral-formula rust remover for polished granite",
    description:
      "A neutral-formula rust remover designed for polished granite. It removes rust stains from natural and artificial stone without etching or dulling the surface gloss — pH-neutral and safe to handle, while remaining tough on rust. Built for the polished granite floors and features of five-star hotels.",
    highlights: [
      { title: "pH-neutral formula", text: "Removes rust stains from natural and artificial stone without etching or dulling the surface gloss." },
      { title: "Safe to handle", text: "pH-neutral and safe to handle, while remaining tough on rust." },
      { title: "Built for polished floors", text: "Built for the polished granite floors and features of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Virel Grande T-NR2 Granite",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "virel-marmo-t-nr3-marble",
    legacyIds: ["T-NR3"],
    brand: "Virel Marmo",
    name: "Neutral Rust Remover – Marble",
    surface: "For polished marble",
    headline: "Neutral-formula rust remover for polished marble",
    description:
      "A neutral-formula rust remover designed for polished marble. It clears rust stains from delicate natural and artificial stone while safely preserving the surface gloss — gentle on hands, safe on marble, yet effective on oxidation and metal marks. Made for the elegant marble lobbies and statement surfaces of five-star hotels.",
    highlights: [
      { title: "Neutral formula", text: "Clears rust stains from delicate natural and artificial stone while safely preserving surface gloss." },
      { title: "Gentle on marble", text: "Gentle on hands, safe on marble, yet effective on oxidation and metal marks." },
      { title: "Built for elegant spaces", text: "Made for the elegant marble lobbies and statement surfaces of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Virel Marmo T-NR3 Marble",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "solen-monolith-t-yc2-granite",
    legacyIds: ["T-YC2"],
    brand: "Solen Monolith",
    name: "Yellow Stain & Color Remover – Granite",
    surface: "For granite surfaces",
    headline: "Powerful water-based color and stain remover for granite",
    description:
      "A powerful, water-based color and stain remover formulated for granite surfaces. Its strongly oxidizing, non-acidic action clears yellowing, color marks, and common organic stains from wine, tea, and coffee — without harming the stone or its finish. The slow-drying formula stays active on the stained area for a deeper clean, built for the polished granite floors and features of five-star hotels.",
    highlights: [
      { title: "Strongly oxidizing, non-acidic", text: "Clears yellowing, color marks, and organic stains from wine, tea, and coffee without harming the stone." },
      { title: "Slow-drying action", text: "Stays active on the stained area for a deeper clean." },
      { title: "Built for polished floors", text: "Built for the polished granite floors and features of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Solen Monolith T-YC2 Granite",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "solen-statuario-t-yc3-marble",
    legacyIds: ["T-YC3"],
    brand: "Solen Statuario",
    name: "Yellow Stain & Color Remover – Marble",
    surface: "For delicate marble surfaces",
    headline: "Powerful water-based color and stain remover for marble",
    description:
      "A powerful, water-based color and stain remover crafted for delicate marble surfaces. Its strongly oxidizing, non-acidic formula removes yellowing, color marks, and organic stains from wine, tea, and coffee — safely, without etching or damaging the stone. Slow-drying and gentle, it acts directly on the stain to protect the marble's luster, making it ideal for the elegant marble spaces of five-star hotels.",
    highlights: [
      { title: "Strongly oxidizing, non-acidic", text: "Removes yellowing, color marks, and organic stains from wine, tea, and coffee safely." },
      { title: "Slow-drying and gentle", text: "Acts directly on the stain to protect the marble's luster." },
      { title: "Built for elegant spaces", text: "Ideal for the elegant marble spaces of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Solen Statuario T-YC3 Marble",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "lumera-claro-t-pr1-granite-light",
    legacyIds: ["T-PR1"],
    brand: "Lumera Claro",
    name: "Granite Polishing & Restoring Cream – Light",
    surface: "For light-toned granite",
    headline: "Professional-grade polishing and restoring cream for light-toned granite",
    description:
      "A professional-grade polishing and restoring cream for light-toned granite. It restores deep gloss and revives color while protecting pale surfaces against stains, water marks, and light scratches. Its protective coating enhances the stone's natural beauty and extends surface life — delivering lasting protection with easy application, ideal for the bright granite floors and features of five-star hotels.",
    highlights: [
      { title: "Protective coating", text: "Protects pale surfaces against stains, water marks, and light scratches." },
      { title: "Color revival", text: "Restores deep gloss and revives color for bright granite floors." },
      { title: "Lasting protection", text: "Delivers lasting protection with easy application, ideal for five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Lumera Claro T-PR1 Granite Light",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "lumera-nocte-t-pr3-granite-dark",
    legacyIds: ["T-PR3"],
    brand: "Lumera Nocte",
    name: "Granite Polishing & Restoring Cream – Dark",
    surface: "For dark and deeply-toned granite",
    headline: "Professional-grade polishing and restoring cream for dark granite",
    description:
      "A professional-grade polishing and restoring cream for dark and deeply-toned granite. It restores deep gloss and intensifies the rich color of black and charcoal surfaces while protecting against stains, water marks, and light scratches. Its protective coating enhances the stone's dramatic depth and extends its life — delivering lasting protection with easy application, built for the statement granite features of five-star hotels.",
    highlights: [
      { title: "Protective coating", text: "Protects against stains, water marks, and light scratches." },
      { title: "Intensifies rich color", text: "Intensifies the rich color of black and charcoal surfaces." },
      { title: "Lasting protection", text: "Built for the statement granite features of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Lumera Nocte T-PR3 Granite Dark",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "clarion-aura-t-dp1-tiles-light",
    legacyIds: ["T-DP1"],
    brand: "Clarion Aura",
    name: "Tile Decontamination Powder – Light",
    surface: "For light-colored tile",
    headline: "Professional-grade decontamination powder for light-colored tile",
    description:
      "A professional-grade decontamination powder for light-colored tile. Specially formulated to loosen and remove stubborn dirt, grease buildup, and surface stains, it restores a cleaner, fresher, and brighter finish without damaging the surface or dulling its tone. Ideal for the pale tiled floors, kitchens, and wet areas of five-star hotels.",
    highlights: [
      { title: "Loosens stubborn buildup", text: "Loosens and removes stubborn dirt, grease buildup, and surface stains." },
      { title: "Brighter finish", text: "Restores a cleaner, fresher, and brighter finish without damaging the surface." },
      { title: "Built for wet areas", text: "Ideal for pale tiled floors, kitchens, and wet areas of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Clarion Aura T-DP1 Tiles Light",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "clarion-mesa-t-dp2-tiles-mid-light",
    legacyIds: ["T-DP2"],
    brand: "Clarion Mesa",
    name: "Tile Decontamination Powder – Mid Light",
    surface: "For mid-light and neutral-toned tile",
    headline: "Professional-grade decontamination powder for mid-light tile",
    description:
      "A professional-grade decontamination powder for mid-light and neutral-toned tile. Specially formulated to loosen and lift deep-set dirt, grease buildup, and surface stains, it restores a cleaner, fresher, and brighter finish while preserving the tile's natural color. Built for the high-traffic tiled areas of five-star hotels, from service floors to public spaces.",
    highlights: [
      { title: "Lifts deep-set buildup", text: "Loosens and lifts deep-set dirt, grease buildup, and surface stains." },
      { title: "Preserves natural color", text: "Restores a fresher, brighter finish while preserving the tile's natural color." },
      { title: "Built for high-traffic areas", text: "Built for high-traffic tiled areas, from service floors to public spaces." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Clarion Mesa T-DP2 Tiles Mid Light",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "clarion-umbra-t-dp3-tiles-dark",
    legacyIds: ["T-DP3"],
    brand: "Clarion Umbra",
    name: "Tile Decontamination Powder – Dark",
    surface: "For dark-colored tile",
    headline: "Professional-grade decontamination powder for dark-colored tile",
    description:
      "A professional-grade decontamination powder for dark-colored tile. Specially formulated to loosen and remove stubborn dirt, grease buildup, and surface stains, it restores a cleaner, fresher finish without leaving residue or dulling the deep tone of the surface. Made for the dramatic dark-tiled floors and features of five-star hotels.",
    highlights: [
      { title: "Loosens stubborn buildup", text: "Loosens and removes stubborn dirt, grease buildup, and surface stains." },
      { title: "No residue", text: "Restores a cleaner, fresher finish without leaving residue or dulling the deep tone." },
      { title: "Built for dramatic floors", text: "Made for the dramatic dark-tiled floors and features of five-star hotels." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Clarion Umbra T-DP3 Tiles Dark",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "technoshine-t-rc1-product-info",
    legacyIds: ["T-RC1"],
    brand: "TECHNOSHINE",
    name: "T-RC1 Product Information",
    surface: "Details to be added",
    headline: "QR-linked product information page for T-RC1",
    description:
      "Details for this product are not available yet. Update this help product record in the admin panel when the product copy, instructions, and safety notes are ready.",
    highlights: [
      { title: "Product code", text: "Connected to QR links using the T-RC1 product code." },
      { title: "Ready for editing", text: "Use the Help Products admin page to replace this placeholder copy." },
      { title: "Details pending", text: "Product surface, instructions, and safety notes still need final content." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for T-RC1",
      caption: "PLACEHOLDER - replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER - replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER - replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "technoshine-t-rc2-product-info",
    legacyIds: ["T-RC2"],
    brand: "TECHNOSHINE",
    name: "T-RC2 Product Information",
    surface: "Details to be added",
    headline: "QR-linked product information page for T-RC2",
    description:
      "Details for this product are not available yet. Update this help product record in the admin panel when the product copy, instructions, and safety notes are ready.",
    highlights: [
      { title: "Product code", text: "Connected to QR links using the T-RC2 product code." },
      { title: "Ready for editing", text: "Use the Help Products admin page to replace this placeholder copy." },
      { title: "Details pending", text: "Product surface, instructions, and safety notes still need final content." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for T-RC2",
      caption: "PLACEHOLDER - replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER - replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER - replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "technoshine-t-rc3-product-info",
    legacyIds: ["T-RC3"],
    brand: "TECHNOSHINE",
    name: "T-RC3 Product Information",
    surface: "Details to be added",
    headline: "QR-linked product information page for T-RC3",
    description:
      "Details for this product are not available yet. Update this help product record in the admin panel when the product copy, instructions, and safety notes are ready.",
    highlights: [
      { title: "Product code", text: "Connected to QR links using the T-RC3 product code." },
      { title: "Ready for editing", text: "Use the Help Products admin page to replace this placeholder copy." },
      { title: "Details pending", text: "Product surface, instructions, and safety notes still need final content." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for T-RC3",
      caption: "PLACEHOLDER - replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER - replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER - replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "riviva-marble-formula-t-pp1",
    legacyIds: ["T-PP1"],
    brand: "Riviva",
    name: "Marble Deep-Cleaning Paste",
    surface: "For polished and honed marble",
    headline: "Mild deep-cleaning paste for polished and honed marble",
    description:
      "A mild deep-cleaning paste made exclusively for polished and honed marble. It gently lifts embedded dirt, grime, water marks, and surface stains — all without etching or dulling your marble's natural polish. Safe enough for delicate stone, effective enough for everyday buildup.",
    highlights: [
      { title: "Gentle yet effective", text: "Gently lifts embedded dirt, grime, water marks, and surface stains." },
      { title: "Safe on delicate stone", text: "Safe enough for delicate stone, effective enough for everyday buildup." },
      { title: "Preserves natural polish", text: "Cleans without etching or dulling your marble's natural polish." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Riviva T-PP1 Marble Formula",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "riviva-granite-formula-t-pp2",
    legacyIds: ["T-PP2"],
    brand: "Riviva",
    name: "Granite Deep-Cleaning Paste",
    surface: "For granite surfaces",
    headline: "Deep-cleaning paste for granite surfaces",
    description:
      "A specially crafted paste for granite surfaces that removes scuff marks, soap scum, and daily grime with ease. Restores your countertops to their original shine and depth of color, keeping natural granite looking pristine wash after wash.",
    highlights: [
      { title: "Removes scuff marks", text: "Removes scuff marks, soap scum, and daily grime with ease." },
      { title: "Restores shine", text: "Restores your countertops to their original shine and depth of color." },
      { title: "Everyday care", text: "Keeps natural granite looking pristine wash after wash." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Riviva T-PP2 Granite Formula",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
  {
    slug: "riviva-synthetic-countertop-t-pp3",
    legacyIds: ["T-PP3"],
    brand: "Riviva",
    name: "Synthetic Countertop Deep-Cleaning Paste",
    surface: "For synthetic and engineered surfaces",
    headline: "Purpose-built paste for synthetic and engineered surfaces",
    description:
      "A purpose-built paste for synthetic and engineered surfaces. Cuts through scuff marks, soap scum, and everyday grime to bring your countertop back to its original, immaculate finish — no harsh residue, no dulling.",
    highlights: [
      { title: "Cuts through grime", text: "Cuts through scuff marks, soap scum, and everyday grime." },
      { title: "No harsh residue", text: "Brings your countertop back to its original, immaculate finish." },
      { title: "No dulling", text: "Purpose-built for synthetic and engineered surfaces." },
    ],
    howToUseImage: {
      src: "images/client-images/gallery-1.jpg",
      alt: "Temporary instruction manual image for Riviva T-PP3 Synthetic Countertop",
      caption: "PLACEHOLDER — replace with the real how-to-use manual image/artwork for this product.",
    },
    howToUse: ["PLACEHOLDER — replace with the actual application steps from the product label/data sheet before publishing."],
    safetyNotes: ["PLACEHOLDER — replace with the actual safety warnings from the product label/SDS before publishing."],
  },
];

const helpProductsApiPath = `${import.meta.env.BASE_URL}api/admin.php`;

function normalizeHelpProductKey(value: string) {
  return value.trim().toLowerCase();
}

export function getHelpProductCode(product: HelpProductInfo) {
  return product.productCode || product.legacyIds.find((id) => /[a-z]/i.test(id)) || product.legacyIds[0] || product.slug;
}

export function getHelpProductKeys(product: HelpProductInfo) {
  return [product.slug, product.productCode ?? "", ...product.legacyIds]
    .map(normalizeHelpProductKey)
    .filter(Boolean);
}

export function helpProductMatchesId(product: HelpProductInfo, productId: string) {
  const normalized = normalizeHelpProductKey(productId);
  return getHelpProductKeys(product).includes(normalized);
}

export function getHelpProductInfoFromList(productId: string, products: HelpProductInfo[]) {
  return products.find((product) => helpProductMatchesId(product, productId));
}

export function mergeHelpProducts(
  databaseProducts: HelpProductInfo[],
  fallbackProducts: HelpProductInfo[] = helpProducts,
  hiddenProductIds: string[] = [],
) {
  const hiddenKeys = new Set(hiddenProductIds.map(normalizeHelpProductKey).filter(Boolean));
  const merged = fallbackProducts.filter(
    (product) => !getHelpProductKeys(product).some((key) => hiddenKeys.has(key)),
  );
  const keyToIndex = new Map<string, number>();

  merged.forEach((product, index) => {
    getHelpProductKeys(product).forEach((key) => keyToIndex.set(key, index));
  });

  databaseProducts.forEach((product) => {
    const keys = getHelpProductKeys(product);
    const existingIndex = keys.map((key) => keyToIndex.get(key)).find((index) => index !== undefined);

    if (existingIndex === undefined) {
      const nextIndex = merged.length;
      merged.push(product);
      keys.forEach((key) => keyToIndex.set(key, nextIndex));
      return;
    }

    merged[existingIndex] = product;
    keys.forEach((key) => keyToIndex.set(key, existingIndex));
  });

  return merged;
}

export async function fetchPublicHelpProducts() {
  const searchParams = new URLSearchParams({
    action: "help-products.public",
    _cb: `${Date.now()}`,
  });
  const response = await fetch(`${helpProductsApiPath}?${searchParams.toString()}`, {
    cache: "no-store",
    credentials: "include",
  });
  const payload = (await response.json()) as {
    ok?: boolean;
    products?: HelpProductInfo[];
    hiddenProductIds?: string[];
  };

  if (!response.ok || !payload.ok || !Array.isArray(payload.products)) {
    throw new Error("Unable to load help products.");
  }

  return mergeHelpProducts(payload.products, helpProducts, payload.hiddenProductIds ?? []).filter(
    (product) => product.isPublished !== false,
  );
}

export function usePublicHelpProductsState() {
  const [products, setProducts] = useState<HelpProductInfo[]>(helpProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isActive = true;

    async function refresh() {
      setIsLoading(true);
      setError(null);

      try {
        const nextProducts = await fetchPublicHelpProducts();
        if (isActive) setProducts(nextProducts);
      } catch (loadError) {
        if (isActive) {
          setError(loadError);
          setProducts(helpProducts);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void refresh();

    return () => {
      isActive = false;
    };
  }, []);

  return { products, isLoading, error };
}

export function getHelpProductInfo(productId: string) {
  return getHelpProductInfoFromList(productId, helpProducts);
}
