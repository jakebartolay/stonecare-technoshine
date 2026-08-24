import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getHelpProductCode,
  helpProducts,
  mergeHelpProducts,
  type HelpProductInfo,
} from "@/lib/help-products";
import { shopProducts, type ProductBadge, type ShopProduct } from "@/lib/shop-products";
import { serviceItems } from "@/lib/site-content";

export const adminStoreEvent = "technoshine-admin-store-updated";

const productStorageKey = "technoshine-admin-products";
const employeeStorageKey = "technoshine-admin-employees";
const contentStorageKey = "technoshine-admin-content";
const serviceStorageKey = "technoshine-admin-services";
const socialReelStorageKey = "technoshine-admin-social-reels";
const galleryImageStorageKey = "technoshine-admin-gallery-images";
const testimonialStorageKey = "technoshine-admin-testimonials";
const helpProductStorageKey = "technoshine-admin-help-products";
const sessionStorageKey = "technoshine-admin-session";
const loginPreferenceStorageKey = "technoshine-admin-login-preferences-v1";
let hasVerifiedAdminSession = false;
let adminSessionVerification: Promise<AdminSession | null> | null = null;
let adminSessionRevision = 0;
let adminApiRequestSequence = 0;
const adminApiPath = `${import.meta.env.BASE_URL}api/admin.php`;

export const adminProductCategories = [
  "Cleaners",
  "Polishes",
  "Sealers",
  "Stain Care",
  "Professional Care",
] as const;

export const orgChartGroups = [
  { value: "board", label: "Board / Executive" },
  { value: "leadership", label: "Leadership" },
  { value: "dept", label: "Department Head" },
  { value: "staff", label: "Staff" },
] as const;

export type AdminProductCategory = (typeof adminProductCategories)[number];
export type AdminProductBadge = ProductBadge | "";
export type OrgChartGroup = (typeof orgChartGroups)[number]["value"];

export interface AdminSession {
  email: string;
  role: "admin" | "editor";
  remember: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface AdminCounts {
  employees: number;
  products: number;
  publishedProducts: number;
  contentSections: number;
  services: number;
  reels: number;
  galleryImages: number;
  testimonials: number;
  liveVisitors: number;
  totalVisits: number;
  pageViews: number;
  desktopVisits: number;
  mobileVisits: number;
  tabletVisits: number;
  unknownDeviceVisits: number;
}

export interface AdminProduct extends ShopProduct {
  id: string;
  code?: string;
  category: AdminProductCategory;
  badge?: ProductBadge;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeRecord {
  id: string;
  name: string;
  position: string;
  department: string;
  orgGroup: OrgChartGroup;
  employeeId: string;
  reportsTo: string;
  photoUrl: string;
  isPublished: boolean;
  deletedAt?: string;
}

export interface ContentSection {
  id: string;
  key: string;
  title: string;
  body: string;
  updatedAt: string;
}

export const homepageHeroBackgroundContentKey = "homepage.hero.background";
export const defaultHomepageHeroBackground = "images/hero-marble-floor-stair.jpg";

export interface ServiceImageRecord {
  id: string;
  imageUrl: string;
  altText: string;
  caption: string;
  sortOrder: number;
}

export interface ServicePageRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  heroImageUrl: string;
  images: ServiceImageRecord[];
  updatedAt: string;
}

export interface SocialReelRecord {
  id: string;
  title: string;
  href: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImageRecord {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isFeatured: boolean;
  isHero: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialRecord {
  id: string;
  quote: string;
  clientName: string;
  rating: number;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductValidationErrors {
  name?: string;
  category?: string;
  price?: string;
  stockLeft?: string;
}

export interface ProductFormData {
  id?: string;
  code: string;
  slug?: string;
  brand: string;
  name: string;
  category: AdminProductCategory;
  size: ShopProduct["size"];
  usesLine: string;
  price: number;
  stockLeft: number;
  badge: AdminProductBadge;
  imageUrl: string;
  shopeeUrl: string;
  isPublished: boolean;
  description: string;
}

export interface AdminHelpProduct extends HelpProductInfo {
  productCode: string;
  legacyIds: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HelpProductFormData {
  originalProductCode?: string;
  productCode: string;
  slug: string;
  legacyIdsText: string;
  brand: string;
  name: string;
  surface: string;
  headline: string;
  description: string;
  highlightsText: string;
  howToUseImageSrc: string;
  howToUseImageAlt: string;
  howToUseImageCaption: string;
  howToUseText: string;
  safetyNotesText: string;
  isPublished: boolean;
}

export interface HelpProductValidationErrors {
  productCode?: string;
  slug?: string;
  name?: string;
}

function canUseStorage() {
  if (typeof window === "undefined") return false;

  try {
    return Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function now() {
  return new Date().toISOString();
}

function emitStoreUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(adminStoreEvent));
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  emitStoreUpdate();
}

function readStorageJson<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const stored = storage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export interface AdminLoginPreferences {
  email: string;
  remember: boolean;
}

export function getAdminLoginPreferences(): AdminLoginPreferences {
  if (!canUseStorage()) return { email: "", remember: false };

  const stored = readStorageJson<Partial<AdminLoginPreferences>>(
    window.localStorage,
    loginPreferenceStorageKey,
    {},
  );
  const remember = stored.remember === true;

  return {
    email: remember && typeof stored.email === "string" ? stored.email : "",
    remember,
  };
}

export function saveAdminLoginPreferences(email: string, remember: boolean) {
  if (!canUseStorage()) return;

  try {
    if (!remember) {
      window.localStorage.removeItem(loginPreferenceStorageKey);
      return;
    }

    window.localStorage.setItem(
      loginPreferenceStorageKey,
      JSON.stringify({ email: email.trim().toLowerCase(), remember: true }),
    );
  } catch {
    // Login should still succeed when the browser blocks persistent storage.
  }
}

function adminApiUrl(
  action: string,
  params?: Record<string, string>,
  bypassServerCache = false,
) {
  const searchParams = new URLSearchParams({ action, ...(params ?? {}) });
  if (bypassServerCache) {
    adminApiRequestSequence += 1;
    searchParams.set("_cb", `${Date.now()}-${adminApiRequestSequence}`);
  }
  return `${adminApiPath}?${searchParams.toString()}`;
}

class AdminApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "AdminApiError";
  }
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const responseText = await response.text();
  let payload = {} as T & { message?: string };

  if (!responseText.trim()) {
    throw new AdminApiError(
      "Unable to connect to the server. Please try again later or contact the system administrator if the problem continues.",
      response.status,
    );
  }

  if (responseText.trim()) {
    try {
      payload = JSON.parse(responseText) as T & { message?: string };
    } catch {
      throw new AdminApiError(
        response.ok
          ? "Server returned an invalid JSON response."
          : "Server returned a non-JSON error. Check the PHP API or database connection.",
        response.status,
      );
    }
  }

  if (!response.ok) {
    throw new AdminApiError(payload.message ?? "API request failed.", response.status);
  }

  return payload;
}

async function apiRequest<T>(
  action: string,
  init?: RequestInit,
  params?: Record<string, string>,
): Promise<T> {
  let response: Response;
  const method = (init?.method ?? "GET").toUpperCase();

  try {
    response = await fetch(adminApiUrl(action, params, method === "GET"), {
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      ...init,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;

    throw new AdminApiError(
      "Cannot reach the admin API. Start the PHP API server or check the deployed API path.",
    );
  }

  return parseApiResponse<T>(response);
}

export async function uploadServiceImage(
  file: File,
  serviceSlug: string,
  slot: string,
  previousImageUrl = "",
) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("serviceSlug", serviceSlug);
  formData.append("slot", slot);
  if (previousImageUrl) {
    formData.append("previousImageUrl", previousImageUrl);
  }

  const response = await fetch(adminApiUrl("services.upload-image"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const payload = await parseApiResponse<{ ok: boolean; url: string; optimizedBytes?: number }>(response);
  return payload.url;
}

export async function uploadGalleryImageFile(
  file: File,
  galleryId: string,
  previousImageUrl = "",
) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("galleryId", galleryId);
  if (previousImageUrl) {
    formData.append("previousImageUrl", previousImageUrl);
  }

  const response = await fetch(adminApiUrl("gallery.upload-image"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const payload = await parseApiResponse<{ ok: boolean; url: string; optimizedBytes?: number }>(response);
  return payload.url;
}

export async function uploadContentImageFile(
  file: File,
  contentKey: string,
  previousImageUrl = "",
) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("contentKey", contentKey);
  if (previousImageUrl) {
    formData.append("previousImageUrl", previousImageUrl);
  }

  const response = await fetch(adminApiUrl("content.upload-image"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const payload = await parseApiResponse<{ ok: boolean; url: string; optimizedBytes?: number }>(response);
  return payload.url;
}

function isSessionExpired(session: AdminSession) {
  if (!session.expiresAt) return false;
  const expiresAt = Date.parse(session.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt <= Date.now();
}

function readStoredSession(storage: Storage) {
  const session = readStorageJson<AdminSession | null>(storage, sessionStorageKey, null);
  if (session && isSessionExpired(session)) {
    storage.removeItem(sessionStorageKey);
    return null;
  }

  return session;
}

function cacheSession(session: AdminSession | null, remember = true) {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(sessionStorageKey);
  window.sessionStorage.removeItem(sessionStorageKey);

  if (session) {
    const targetStorage = (session.remember ?? remember) ? window.localStorage : window.sessionStorage;
    targetStorage.setItem(sessionStorageKey, JSON.stringify(session));
  }

  emitStoreUpdate();
}

async function verifyAdminSession() {
  if (adminSessionVerification) return adminSessionVerification;

  const verificationRevision = adminSessionRevision;

  adminSessionVerification = (async () => {
    try {
      const payload = await apiRequest<{ ok: boolean; session: AdminSession | null }>("me");
      if (verificationRevision !== adminSessionRevision) return getAdminSession();

      hasVerifiedAdminSession = true;
      cacheSession(payload.session, payload.session?.remember ?? false);
      return payload.session;
    } catch (error) {
      if (verificationRevision !== adminSessionRevision) return getAdminSession();

      hasVerifiedAdminSession = true;

      const cachedSession = getAdminSession();
      if (cachedSession && !(error instanceof AdminApiError && error.status === 401)) {
        return cachedSession;
      }

      cacheSession(null);
      return null;
    } finally {
      adminSessionVerification = null;
    }
  })();

  return adminSessionVerification;
}

export function slugifyProductName(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `product-${Date.now()}`
  );
}

export function formatProductPrice(price: number) {
  return `\u20b1${Number.isFinite(price) ? price.toLocaleString("en-PH") : "0"}`;
}

function normalizeCategory(category: string): AdminProductCategory {
  return adminProductCategories.includes(category as AdminProductCategory)
    ? (category as AdminProductCategory)
    : "Professional Care";
}

function normalizeProduct(product: ShopProduct, index: number): AdminProduct {
  const timestamp = product.createdAt ?? new Date(2026, 0, index + 1).toISOString();
  const price = Number(product.price) || 0;

  return {
    ...product,
    id: product.id ?? product.slug,
    code: product.code ?? "",
    slug: product.slug || slugifyProductName(product.name),
    brand: product.brand || "TECHNOSHINE",
    category: normalizeCategory(product.category),
    price,
    priceLabel: formatProductPrice(price),
    stockLeft: Number(product.stockLeft) || 0,
    usesLine: product.usesLine || "Marble-safe stone care",
    imageUrl: product.imageUrl ?? "",
    isPublished: product.isPublished ?? true,
    createdAt: timestamp,
    updatedAt: product.updatedAt ?? timestamp,
  };
}

export function getAdminProducts() {
  return readJson<AdminProduct[]>(
    productStorageKey,
    shopProducts.map((product, index) => normalizeProduct(product, index)),
  ).map((product, index) => normalizeProduct(product, index));
}

export function getPublishedProducts() {
  return getAdminProducts().filter((product) => product.isPublished);
}

export function saveAdminProducts(products: AdminProduct[]) {
  writeJson(productStorageKey, products);
}

async function loadAdminProducts(publishedOnly = false) {
  const payload = await apiRequest<{ ok: boolean; products: AdminProduct[] }>(
    "products",
    undefined,
    publishedOnly ? { published: "true" } : undefined,
  );
  const products = payload.products.map((product, index) => normalizeProduct(product, index));
  writeJson(productStorageKey, products);
  return products;
}

export function validateProduct(product: ProductFormData) {
  const errors: ProductValidationErrors = {};

  if (!product.name.trim()) errors.name = "Name is required.";
  if (!adminProductCategories.includes(product.category)) errors.category = "Choose a valid category.";
  if (!Number.isFinite(Number(product.price)) || Number(product.price) < 0) {
    errors.price = "Price must be zero or higher.";
  }
  if (!Number.isInteger(Number(product.stockLeft)) || Number(product.stockLeft) < 0) {
    errors.stockLeft = "Stock must be a whole number.";
  }

  return errors;
}

export function createBlankProduct(): ProductFormData {
  return {
    code: "",
    brand: "TECHNOSHINE",
    name: "",
    category: "Cleaners",
    size: "500ml",
    usesLine: "",
    price: 0,
    stockLeft: 0,
    badge: "",
    imageUrl: "",
    shopeeUrl: "",
    isPublished: false,
    description: "",
  };
}

export function productToFormData(product: AdminProduct): ProductFormData {
  return {
    id: product.id,
    code: product.code ?? "",
    slug: product.slug,
    brand: product.brand,
    name: product.name,
    category: product.category,
    size: product.size,
    usesLine: product.usesLine,
    price: product.price,
    stockLeft: product.stockLeft,
    badge: product.badge ?? "",
    imageUrl: product.imageUrl ?? "",
    shopeeUrl: product.shopeeUrl,
    isPublished: product.isPublished,
    description: product.description,
  };
}

export function formDataToProduct(formData: ProductFormData, existing?: AdminProduct): AdminProduct {
  const id = formData.id || formData.slug || slugifyProductName(formData.name);
  const slug = formData.slug || slugifyProductName(formData.name);
  const timestamp = now();
  const price = Number(formData.price) || 0;
  const stockLeft = Number(formData.stockLeft) || 0;
  const accent = existing?.visual.accent ?? "#FF6B00";

  return {
    id,
    code: formData.code.trim(),
    slug,
    brand: formData.brand.trim() || "TECHNOSHINE",
    name: formData.name.trim(),
    category: formData.category,
    size: formData.size,
    useFor: existing?.useFor ?? ["Floors", "Countertops"],
    usesLine: formData.usesLine.trim() || "Marble-safe stone care",
    price,
    priceLabel: formatProductPrice(price),
    stockLeft,
    badge: formData.badge || undefined,
    imageUrl: formData.imageUrl.trim(),
    description: formData.description.trim() || formData.usesLine.trim() || "TECHNOSHINE stone-care product.",
    howToUse: existing?.howToUse ?? [
      "Clean the surface before application.",
      "Apply product as directed.",
      "Wipe or buff until the desired finish is achieved.",
    ],
    shopeeUrl: formData.shopeeUrl.trim() || "https://shopee.ph/search?keyword=Technoshine",
    visual: existing?.visual ?? {
      accent,
      surface: "#FFF8F2",
      label: formData.category,
    },
    isPublished: formData.isPublished,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export async function upsertProduct(formData: ProductFormData) {
  const products = getAdminProducts();
  const existing = products.find((product) => product.id === formData.id);
  const nextProduct = formDataToProduct(formData, existing);
  await apiRequest("products.save", {
    method: "POST",
    body: JSON.stringify(nextProduct),
  });
  const nextProducts = existing
    ? products.map((product) => (product.id === nextProduct.id ? nextProduct : product))
    : [nextProduct, ...products];

  saveAdminProducts(nextProducts);
  return nextProduct;
}

export async function deleteProduct(productId: string) {
  await apiRequest("products.delete", {
    method: "POST",
    body: JSON.stringify({ id: productId }),
  });
  saveAdminProducts(getAdminProducts().filter((product) => product.id !== productId));
}

function uniqueTextValues(values: string[]) {
  const seen = new Set<string>();
  return values
    .map((value) => value.trim())
    .filter((value) => {
      const key = value.toLowerCase();
      if (!value || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function splitCommaOrLineList(value: string) {
  return uniqueTextValues(value.split(/[\n,]+/));
}

function splitLineList(value: string) {
  return uniqueTextValues(value.split(/\r?\n/));
}

function normalizeProductCode(value: string) {
  return value.trim().toUpperCase();
}

function formatHighlightsText(highlights: HelpProductInfo["highlights"]) {
  return highlights.map((highlight) => `${highlight.title}: ${highlight.text}`).join("\n");
}

function parseHighlightsText(value: string): HelpProductInfo["highlights"] {
  return splitLineList(value).map((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return { title: "Detail", text: line };
    }

    const title = line.slice(0, separatorIndex).trim() || "Detail";
    const text = line.slice(separatorIndex + 1).trim() || title;
    return { title, text };
  });
}

export function helpProductCodeList(product: Pick<AdminHelpProduct, "productCode" | "legacyIds">) {
  return uniqueTextValues([product.productCode, ...product.legacyIds]);
}

function normalizeHelpProduct(product: HelpProductInfo, index: number): AdminHelpProduct {
  const timestamp = product.createdAt ?? new Date(2026, 0, index + 1).toISOString();
  const productCode = normalizeProductCode(getHelpProductCode(product));
  const legacyIds = uniqueTextValues(product.legacyIds ?? []);

  return {
    ...product,
    productCode,
    slug: product.slug || slugifyProductName(product.name || productCode),
    legacyIds,
    brand: product.brand || "TECHNOSHINE",
    name: product.name || productCode,
    surface: product.surface || "",
    headline: product.headline || "",
    description: product.description || "",
    highlights: Array.isArray(product.highlights) ? product.highlights : [],
    howToUseImage: {
      src: product.howToUseImage?.src ?? "",
      alt: product.howToUseImage?.alt ?? "",
      caption: product.howToUseImage?.caption ?? "",
    },
    howToUse: Array.isArray(product.howToUse) ? product.howToUse : [],
    safetyNotes: Array.isArray(product.safetyNotes) ? product.safetyNotes : [],
    isPublished: product.isPublished ?? true,
    createdAt: timestamp,
    updatedAt: product.updatedAt ?? timestamp,
  };
}

export function getAdminHelpProducts() {
  return readJson<AdminHelpProduct[]>(
    helpProductStorageKey,
    helpProducts.map((product, index) => normalizeHelpProduct(product, index)),
  ).map((product, index) => normalizeHelpProduct(product, index));
}

export function saveAdminHelpProducts(products: AdminHelpProduct[]) {
  writeJson(helpProductStorageKey, products.map((product, index) => normalizeHelpProduct(product, index)));
}

async function loadAdminHelpProducts() {
  const payload = await apiRequest<{ ok: boolean; products: HelpProductInfo[] }>("help-products");
  const products = mergeHelpProducts(payload.products ?? [], helpProducts).map((product, index) =>
    normalizeHelpProduct(product, index),
  );
  saveAdminHelpProducts(products);
  return products;
}

export function createBlankHelpProduct(): HelpProductFormData {
  return {
    productCode: "",
    slug: "",
    legacyIdsText: "",
    brand: "TECHNOSHINE",
    name: "",
    surface: "",
    headline: "",
    description: "",
    highlightsText: "",
    howToUseImageSrc: "images/client-images/gallery-1.jpg",
    howToUseImageAlt: "",
    howToUseImageCaption: "",
    howToUseText: "",
    safetyNotesText: "",
    isPublished: false,
  };
}

export function helpProductToFormData(product: AdminHelpProduct): HelpProductFormData {
  const productCode = normalizeProductCode(product.productCode);
  return {
    originalProductCode: productCode,
    productCode,
    slug: product.slug,
    legacyIdsText: product.legacyIds
      .filter((legacyId) => legacyId.toLowerCase() !== productCode.toLowerCase())
      .join(", "),
    brand: product.brand,
    name: product.name,
    surface: product.surface,
    headline: product.headline,
    description: product.description,
    highlightsText: formatHighlightsText(product.highlights),
    howToUseImageSrc: product.howToUseImage.src,
    howToUseImageAlt: product.howToUseImage.alt,
    howToUseImageCaption: product.howToUseImage.caption,
    howToUseText: product.howToUse.join("\n"),
    safetyNotesText: product.safetyNotes.join("\n"),
    isPublished: product.isPublished,
  };
}

export function formDataToHelpProduct(formData: HelpProductFormData, existing?: AdminHelpProduct): AdminHelpProduct {
  const timestamp = now();
  const productCode = normalizeProductCode(formData.productCode);
  const slug = formData.slug.trim() || slugifyProductName(formData.name || productCode);
  const legacyIds = splitCommaOrLineList(formData.legacyIdsText).filter(
    (legacyId) => legacyId.toLowerCase() !== productCode.toLowerCase(),
  );

  return {
    productCode,
    slug,
    legacyIds,
    brand: formData.brand.trim() || "TECHNOSHINE",
    name: formData.name.trim(),
    surface: formData.surface.trim(),
    headline: formData.headline.trim(),
    description: formData.description.trim(),
    highlights: parseHighlightsText(formData.highlightsText),
    howToUseImage: {
      src: formData.howToUseImageSrc.trim(),
      alt: formData.howToUseImageAlt.trim() || `${formData.name.trim()} instruction image`,
      caption: formData.howToUseImageCaption.trim(),
    },
    howToUse: splitLineList(formData.howToUseText),
    safetyNotes: splitLineList(formData.safetyNotesText),
    isPublished: formData.isPublished,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export function validateHelpProduct(product: HelpProductFormData): HelpProductValidationErrors {
  const errors: HelpProductValidationErrors = {};
  if (!product.productCode.trim()) errors.productCode = "Product code is required.";
  if (!product.slug.trim() && !product.name.trim()) errors.slug = "Add a URL slug or product name.";
  if (!product.name.trim()) errors.name = "Product name is required.";
  return errors;
}

export async function upsertHelpProduct(formData: HelpProductFormData) {
  const products = getAdminHelpProducts();
  const existing = products.find(
    (product) =>
      product.productCode.toLowerCase() === (formData.originalProductCode ?? formData.productCode).toLowerCase(),
  );
  const nextProduct = formDataToHelpProduct(formData, existing);

  await apiRequest("help-products.save", {
    method: "POST",
    body: JSON.stringify({
      ...nextProduct,
      originalProductCode: formData.originalProductCode,
    }),
  });

  const nextProducts = products.some((product) => product.productCode === existing?.productCode)
    ? products.map((product) => (product.productCode === existing?.productCode ? nextProduct : product))
    : [nextProduct, ...products];

  saveAdminHelpProducts(nextProducts);
  return nextProduct;
}

export async function deleteHelpProduct(productCode: string) {
  await apiRequest("help-products.delete", {
    method: "POST",
    body: JSON.stringify({ productCode }),
  });
  saveAdminHelpProducts(
    getAdminHelpProducts().filter((product) => product.productCode.toLowerCase() !== productCode.toLowerCase()),
  );
}

export function useAdminHelpProductsState() {
  const [products, setProducts] = useState(() => getAdminHelpProducts());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isActive = true;
    const refresh = () => setProducts(getAdminHelpProducts());
    const refreshFromApi = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextProducts = await loadAdminHelpProducts();
        if (isActive) setProducts(nextProducts);
      } catch (loadError) {
        if (!isActive) return;
        setError(loadError);
        refresh();
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void refreshFromApi();
    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refresh);
      isActive = false;
    };
  }, []);

  return { products, isLoading, error };
}

export function useAdminHelpProducts() {
  return useAdminHelpProductsState().products;
}

export async function loginAdmin(email: string, password: string, remember: boolean) {
  const payload = await apiRequest<{ ok: boolean; session: AdminSession }>("login", {
    method: "POST",
    body: JSON.stringify({ email, password, remember }),
  });
  const session = payload.session;
  adminSessionRevision += 1;
  hasVerifiedAdminSession = true;
  cacheSession(session, session.remember ?? remember);
  return session;
}

export async function logoutAdmin() {
  try {
    await apiRequest("logout", { method: "POST", body: "{}" });
  } finally {
    adminSessionRevision += 1;
    hasVerifiedAdminSession = false;
    cacheSession(null);
  }
}

export function getAdminSession() {
  if (!canUseStorage()) return null;
  return (
    readStoredSession(window.localStorage) ??
    readStoredSession(window.sessionStorage)
  );
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null | undefined>(() => {
    const cachedSession = getAdminSession();
    return cachedSession ?? undefined;
  });

  useEffect(() => {
    const refresh = () => setSession(getAdminSession());

    if (!hasVerifiedAdminSession) {
      void verifyAdminSession().then(setSession);
    }

    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return session;
}

export function useAdminProductsState(publishedOnly = false) {
  const [products, setProducts] = useState(() =>
    publishedOnly ? getPublishedProducts() : getAdminProducts(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isActive = true;
    const refresh = () => setProducts(publishedOnly ? getPublishedProducts() : getAdminProducts());
    const refreshFromApi = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const nextProducts = await loadAdminProducts(publishedOnly);
        if (!isActive) return;
        setProducts(nextProducts);
      } catch (loadError) {
        if (!isActive) return;
        setError(loadError);
        refresh();
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void refreshFromApi();
    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refresh);
      isActive = false;
    };
  }, [publishedOnly]);

  return { products, isLoading, error };
}

export function useAdminProducts(publishedOnly = false) {
  return useAdminProductsState(publishedOnly).products;
}

const orgChartGroupValues = new Set<OrgChartGroup>(orgChartGroups.map((group) => group.value));

function inferOrgGroup(employee: Pick<EmployeeRecord, "department" | "position" | "employeeId" | "reportsTo">) {
  const department = employee.department.trim().toLowerCase();
  const position = employee.position.trim().toLowerCase();

  if (department.includes("board")) return "board";
  if (department.includes("leadership")) return "leadership";
  if (
    ["ORG-TECH-001", "23-003", "24-015", "ORG-IT-001"].includes(employee.employeeId) ||
    position.includes("manager") ||
    position.includes("supervisor")
  ) {
    return "dept";
  }

  return employee.reportsTo ? "staff" : "staff";
}

function normalizeEmployee(employee: EmployeeRecord): EmployeeRecord {
  const orgGroup = orgChartGroupValues.has(employee.orgGroup)
    ? employee.orgGroup
    : inferOrgGroup(employee);

  return {
    ...employee,
    orgGroup,
    reportsTo: employee.reportsTo ?? "",
    photoUrl: employee.photoUrl ?? "",
    isPublished: employee.isPublished ?? !employee.deletedAt,
  };
}

const seedEmployees: EmployeeRecord[] = [
  {
    id: "ORG-MD-001",
    name: "Erwin Torrefiel",
    position: "Managing Director",
    department: "Board / Ownership",
    orgGroup: "board",
    employeeId: "ORG-MD-001",
    reportsTo: "",
    photoUrl: "team/MANAGING%20DIRECTOR.png",
    isPublished: true,
  },
  {
    id: "ORG-COO-001",
    name: "Jo Torrefiel",
    position: "COO",
    department: "Board / Ownership",
    orgGroup: "board",
    employeeId: "ORG-COO-001",
    reportsTo: "",
    photoUrl: "team/COO.jpg",
    isPublished: true,
  },
  {
    id: "ORG-PRES-001",
    name: "Rich Nicollie Torrefiel",
    position: "President",
    department: "Leadership",
    orgGroup: "leadership",
    employeeId: "ORG-PRES-001",
    reportsTo: "ORG-MD-001",
    photoUrl: "team/President.jpg",
    isPublished: true,
  },
  {
    id: "ORG-VP-001",
    name: "Dexter Piolo Torrefiel",
    position: "Vice President",
    department: "Leadership",
    orgGroup: "leadership",
    employeeId: "ORG-VP-001",
    reportsTo: "ORG-PRES-001",
    photoUrl: "team/Vice%20President.jpg",
    isPublished: true,
  },
  {
    id: "MLR-001",
    name: "Mary-Lou Robellon",
    position: "Executive Manager",
    department: "Leadership",
    orgGroup: "leadership",
    employeeId: "MLR-001",
    reportsTo: "ORG-VP-001",
    photoUrl: "team/Executive%20Manager.jpg",
    isPublished: true,
  },
  {
    id: "ORG-TECH-001",
    name: "Mark Antony Daga",
    position: "Technical Manager",
    department: "Technical",
    orgGroup: "dept",
    employeeId: "ORG-TECH-001",
    reportsTo: "MLR-001",
    photoUrl: "team/Technical%20Manager.jpg",
    isPublished: true,
  },
  {
    id: "ORG-OPSMGR-001",
    name: "Henry Cadorna",
    position: "Operations Manager 1",
    department: "Technical",
    orgGroup: "staff",
    employeeId: "ORG-OPSMGR-001",
    reportsTo: "ORG-TECH-001",
    photoUrl: "team/Operations%20Mgr.jpg",
    isPublished: true,
  },
  {
    id: "ORG-OPSMGR-002",
    name: "Renato Aducal",
    position: "Operations Manager 2",
    department: "Technical",
    orgGroup: "staff",
    employeeId: "ORG-OPSMGR-002",
    reportsTo: "ORG-TECH-001",
    photoUrl: "team/Operations%20Mgr%202.jpg",
    isPublished: true,
  },
  {
    id: "26-001",
    name: "Nonito Regino Guiao Jr",
    position: "Rider / Liaison",
    department: "Admin",
    orgGroup: "staff",
    employeeId: "26-001",
    reportsTo: "MLR-001",
    photoUrl: "employees/photos/26-001.jpg",
    isPublished: true,
  },
  {
    id: "26-003",
    name: "Vincent Bryan A. Gallardo",
    position: "Project Engineer",
    department: "Technical",
    orgGroup: "staff",
    employeeId: "26-003",
    reportsTo: "ORG-TECH-001",
    photoUrl: "employees/photos/26-003.png",
    isPublished: true,
    deletedAt: now(),
  },
  {
    id: "24-015",
    name: "Monica Mangilit",
    position: "Admin Staff",
    department: "Admin",
    orgGroup: "dept",
    employeeId: "24-015",
    reportsTo: "MLR-001",
    photoUrl: "employees/photos/24-015.png",
    isPublished: true,
  },
  {
    id: "ORG-OFFICEAID-001",
    name: "Winks Morales Balala",
    position: "Office Aide",
    department: "Admin",
    orgGroup: "staff",
    employeeId: "ORG-OFFICEAID-001",
    reportsTo: "MLR-001",
    photoUrl: "team/Office%20Aid.jpg",
    isPublished: true,
  },
  {
    id: "23-003",
    name: "Romalyn Tabuzo",
    position: "Accounting Supervisor",
    department: "Finance",
    orgGroup: "dept",
    employeeId: "23-003",
    reportsTo: "MLR-001",
    photoUrl: "employees/photos/23-003.jpg",
    isPublished: true,
  },
  {
    id: "ORG-IT-001",
    name: "Aljhan Linga",
    position: "IT Supervisor",
    department: "IT / Creative",
    orgGroup: "dept",
    employeeId: "ORG-IT-001",
    reportsTo: "MLR-001",
    photoUrl: "team/IT%20Supervisor.jpg",
    isPublished: true,
  },
  {
    id: "ORG-GRAPHIC-001",
    name: "Darwin John Canda",
    position: "Graphic Designer",
    department: "IT / Creative",
    orgGroup: "staff",
    employeeId: "ORG-GRAPHIC-001",
    reportsTo: "ORG-IT-001",
    photoUrl: "team/Graphic%20Designer.jpg",
    isPublished: true,
  },
  {
    id: "ORG-ITASSIST-001",
    name: "Jake Bartolay",
    position: "IT Assistant",
    department: "IT / Creative",
    orgGroup: "staff",
    employeeId: "ORG-ITASSIST-001",
    reportsTo: "ORG-IT-001",
    photoUrl: "team/IT%20Assistant.jpg",
    isPublished: true,
  },
];

export function getEmployees() {
  return readJson<EmployeeRecord[]>(employeeStorageKey, seedEmployees).map(normalizeEmployee);
}

export async function saveEmployees(employees: EmployeeRecord[]) {
  const normalizedEmployees = employees.map(normalizeEmployee);
  await Promise.all(
    normalizedEmployees.map((employee) =>
      apiRequest("employees.save", {
        method: "POST",
        body: JSON.stringify(employee),
      }),
    ),
  );
  writeJson(employeeStorageKey, normalizedEmployees);
}

async function loadEmployees(publicOnly = false) {
  const payload = await apiRequest<{ ok: boolean; employees: EmployeeRecord[] }>(
    publicOnly ? "employees.public" : "employees",
  );
  const employees = payload.employees.map(normalizeEmployee);
  if (!publicOnly) {
    writeJson(employeeStorageKey, employees);
  }
  return employees;
}

export async function deleteEmployee(employeeRecord: Pick<EmployeeRecord, "id" | "employeeId">) {
  await apiRequest("employees.delete", {
    method: "POST",
    body: JSON.stringify({ id: employeeRecord.id, employeeId: employeeRecord.employeeId }),
  });
  const deletedAt = now();
  writeJson(
    employeeStorageKey,
    getEmployees().map((employee) =>
      employee.id === employeeRecord.id || employee.employeeId === employeeRecord.employeeId
        ? { ...employee, isPublished: false, deletedAt }
        : employee,
    ),
  );
}

export function useEmployees(publicOnly = false) {
  const [employees, setEmployees] = useState(() =>
    publicOnly
      ? getEmployees().filter((employee) => employee.isPublished && !employee.deletedAt)
      : getEmployees(),
  );

  useEffect(() => {
    const refresh = () =>
      setEmployees(
        publicOnly
          ? getEmployees().filter((employee) => employee.isPublished && !employee.deletedAt)
          : getEmployees(),
      );
    const refreshFromApi = async () => {
      try {
        setEmployees(await loadEmployees(publicOnly));
      } catch {
        refresh();
      }
    };

    void refreshFromApi();
    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [publicOnly]);

  return employees;
}

const seedContentSections: ContentSection[] = [
  {
    id: "hero",
    key: "homepage.hero",
    title: "Homepage Hero",
    body: "Marble care, restoration, and stone-safe products for commercial and residential spaces.",
    updatedAt: now(),
  },
  {
    id: "homepage-hero-background",
    key: homepageHeroBackgroundContentKey,
    title: "Homepage Hero Background",
    body: defaultHomepageHeroBackground,
    updatedAt: now(),
  },
  {
    id: "services",
    key: "services.summary",
    title: "Services Summary",
    body: "Cleaning, polishing, sealing, restoration, and maintenance for marble, granite, terrazzo, and tile.",
    updatedAt: now(),
  },
  {
    id: "contact",
    key: "contact.quote",
    title: "Contact / Quote Info",
    body: "For service quotes, call 0917 824 1220 or email contactus@technoshineph.com.",
    updatedAt: now(),
  },
];

function mergeContentSectionDefaults(sections: ContentSection[]) {
  const timestamp = now();
  const byKey = new Map<string, ContentSection>();

  seedContentSections.forEach((section) => {
    byKey.set(section.key, { ...section, updatedAt: section.updatedAt || timestamp });
  });
  sections.forEach((section) => {
    byKey.set(section.key, {
      ...section,
      body: section.body ?? "",
      updatedAt: section.updatedAt || timestamp,
    });
  });

  const seededKeys = new Set(seedContentSections.map((section) => section.key));
  return [
    ...seedContentSections.map((section) => byKey.get(section.key)!),
    ...sections.filter((section) => !seededKeys.has(section.key)).map((section) => byKey.get(section.key)!),
  ];
}

export function getContentSections() {
  return mergeContentSectionDefaults(readJson<ContentSection[]>(contentStorageKey, seedContentSections));
}

export async function saveContentSections(sections: ContentSection[]) {
  const nextSections = mergeContentSectionDefaults(sections);
  await apiRequest("content.save", {
    method: "POST",
    body: JSON.stringify({ sections: nextSections }),
  });
  writeJson(contentStorageKey, nextSections);
}

async function loadContentSections() {
  const payload = await apiRequest<{ ok: boolean; sections: ContentSection[] }>("content");
  const sections = mergeContentSectionDefaults(payload.sections);
  writeJson(contentStorageKey, sections);
  return sections;
}

async function loadPublicContentSections() {
  const payload = await apiRequest<{ ok: boolean; sections: ContentSection[] }>("content.public");
  const sections = mergeContentSectionDefaults(payload.sections);
  writeJson(contentStorageKey, sections);
  return sections;
}

export function getContentSectionBody(
  sections: ContentSection[],
  key: string,
  fallback = "",
) {
  return sections.find((section) => section.key === key)?.body.trim() || fallback;
}

export function useContentSections() {
  const [sections, setSections] = useState(() => getContentSections());

  useEffect(() => {
    const refresh = () => setSections(getContentSections());
    const refreshFromApi = async () => {
      try {
        setSections(await loadContentSections());
      } catch {
        refresh();
      }
    };

    void refreshFromApi();
    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return sections;
}

export function usePublicContentSections() {
  const [sections, setSections] = useState(() => getContentSections());

  useEffect(() => {
    const refresh = () => setSections(getContentSections());
    const refreshFromApi = async () => {
      try {
        setSections(await loadPublicContentSections());
      } catch {
        refresh();
      }
    };

    void refreshFromApi();
    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return sections;
}

const serviceSortOrder = serviceItems.map((service) => service.slug);

const seedServicePages: ServicePageRecord[] = serviceItems.map((service) => ({
  id: service.slug,
  slug: service.slug,
  title: service.title,
  summary: service.summary,
  heroImageUrl: service.image,
  images: service.showcaseImages.map((image, index) => ({
    id: `${service.slug}-${index + 1}`,
    imageUrl: image.src,
    altText: image.alt,
    caption: image.caption,
    sortOrder: index + 1,
  })),
  updatedAt: now(),
}));

function normalizeServicePage(service: ServicePageRecord): ServicePageRecord {
  return {
    ...service,
    id: service.id || service.slug,
    images: [...service.images]
      .sort((first, second) => first.sortOrder - second.sortOrder)
      .map((image, index) => ({
        ...image,
        id: image.id || `${service.slug}-${index + 1}`,
        sortOrder: index + 1,
      })),
  };
}

function sortServicePages(services: ServicePageRecord[]) {
  return [...services].sort((first, second) => {
    const firstIndex = serviceSortOrder.indexOf(first.slug);
    const secondIndex = serviceSortOrder.indexOf(second.slug);

    if (firstIndex === -1 && secondIndex === -1) {
      return first.title.localeCompare(second.title);
    }

    if (firstIndex === -1) return 1;
    if (secondIndex === -1) return -1;
    return firstIndex - secondIndex;
  });
}

function mergeServicePageRecords(services: ServicePageRecord[]) {
  const servicesBySlug = new Map(
    seedServicePages.map((service) => [service.slug, normalizeServicePage(service)]),
  );

  services.map(normalizeServicePage).forEach((service) => {
    servicesBySlug.set(service.slug, service);
  });

  return sortServicePages([...servicesBySlug.values()]);
}

export function getServicePages() {
  return mergeServicePageRecords(readJson<ServicePageRecord[]>(serviceStorageKey, seedServicePages));
}

async function loadServicePages() {
  const payload = await apiRequest<{ ok: boolean; services: ServicePageRecord[] }>("services");
  const services = mergeServicePageRecords(payload.services);
  writeJson(serviceStorageKey, services);
  return services;
}

export async function saveServicePages(services: ServicePageRecord[]) {
  const normalizedServices = mergeServicePageRecords(services);
  await apiRequest("services.save", {
    method: "POST",
    body: JSON.stringify({ services: normalizedServices }),
  });
  writeJson(serviceStorageKey, normalizedServices);
}

export function useServicePagesState() {
  const [services, setServices] = useState(() => getServicePages());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let isActive = true;
    const refresh = () => setServices(getServicePages());
    const refreshFromApi = async () => {
      setIsLoading(true);
      try {
        const nextServices = await loadServicePages();
        if (!isActive) return;
        setServices(nextServices);
        setError(null);
      } catch (loadError) {
        if (!isActive) return;
        setError(loadError);
        refresh();
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void refreshFromApi();
    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refresh);
      isActive = false;
    };
  }, [refreshToken]);

  return {
    services,
    isLoading,
    error,
    retry: () => setRefreshToken((current) => current + 1),
  };
}

export function useServicePages() {
  return useServicePagesState().services;
}

const seedSocialReels: SocialReelRecord[] = [
  {
    id: "company-reel-01",
    title: "Project Reel 01",
    href: "https://www.facebook.com/reel/830650776652467",
    sortOrder: 1,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "company-reel-02",
    title: "Project Reel 02",
    href: "https://www.facebook.com/reel/4472370363007058",
    sortOrder: 2,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
];

function normalizeSocialReel(reel: SocialReelRecord, index: number): SocialReelRecord {
  const timestamp = reel.createdAt || now();

  return {
    id: reel.id || `reel-${Date.now()}-${index + 1}`,
    title: reel.title?.trim() || `Project Reel ${index + 1}`,
    href: reel.href?.trim() || "",
    sortOrder: Number.isFinite(Number(reel.sortOrder)) ? Number(reel.sortOrder) : index + 1,
    isPublished: reel.isPublished ?? true,
    createdAt: timestamp,
    updatedAt: reel.updatedAt || timestamp,
  };
}

function sortSocialReels(reels: SocialReelRecord[]) {
  return reels
    .map(normalizeSocialReel)
    .sort((first, second) => first.sortOrder - second.sortOrder || first.title.localeCompare(second.title))
    .map((reel, index) => ({ ...reel, sortOrder: index + 1 }));
}

export function getSocialReels() {
  return sortSocialReels(readJson<SocialReelRecord[]>(socialReelStorageKey, seedSocialReels));
}

export function getPublishedSocialReels() {
  return getSocialReels().filter((reel) => reel.isPublished && reel.href);
}

async function loadSocialReels(publishedOnly = false) {
  const payload = await apiRequest<{ ok: boolean; reels: SocialReelRecord[] }>(
    publishedOnly ? "reels.public" : "reels",
  );
  const reels = sortSocialReels(payload.reels);
  if (!publishedOnly) {
    writeJson(socialReelStorageKey, reels);
  }
  return reels;
}

export async function saveSocialReels(reels: SocialReelRecord[]) {
  const normalizedReels = sortSocialReels(reels);
  await apiRequest("reels.save", {
    method: "POST",
    body: JSON.stringify({ reels: normalizedReels }),
  });
  writeJson(socialReelStorageKey, normalizedReels);
}

export function useSocialReelsState(publishedOnly = false) {
  const [reels, setReels] = useState(() =>
    publishedOnly ? getPublishedSocialReels() : getSocialReels(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isActive = true;
    const refresh = () => setReels(publishedOnly ? getPublishedSocialReels() : getSocialReels());
    const refreshFromApi = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const nextReels = await loadSocialReels(publishedOnly);
        if (!isActive) return;
        setReels(publishedOnly ? nextReels.filter((reel) => reel.isPublished) : nextReels);
      } catch (loadError) {
        if (!isActive) return;
        setError(loadError);
        refresh();
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void refreshFromApi();
    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refresh);
      isActive = false;
    };
  }, [publishedOnly]);

  return { reels, isLoading, error };
}

export function useSocialReels(publishedOnly = false) {
  return useSocialReelsState(publishedOnly).reels;
}

const seedGalleryImages: GalleryImageRecord[] = [
  {
    id: "gallery-1",
    title: "Marble Floor Polish",
    location: "Polished stone surface",
    imageUrl: "images/client-images/gallery-1.jpg",
    altText: "Marble Floor Polish",
    sortOrder: 1,
    isFeatured: true,
    isHero: false,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "gallery-2",
    title: "Commercial Hallway",
    location: "High-traffic stone care",
    imageUrl: "images/client-images/gallery-2.jpg",
    altText: "Commercial Hallway",
    sortOrder: 2,
    isFeatured: true,
    isHero: true,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "gallery-3",
    title: "Hotel Lobby Restoration",
    location: "Premium floor finish",
    imageUrl: "images/client-images/gallery-3.jpg",
    altText: "Hotel Lobby Restoration",
    sortOrder: 3,
    isFeatured: true,
    isHero: true,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "gallery-9",
    title: "Interior Floor Care",
    location: "Detail cleaning",
    imageUrl: "images/client-images/gallery-9.jpg",
    altText: "Interior Floor Care",
    sortOrder: 4,
    isFeatured: false,
    isHero: true,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "gallery-10",
    title: "Detail Cleaning",
    location: "Natural stone polishing",
    imageUrl: "images/client-images/gallery-10.jpg",
    altText: "Detail Cleaning",
    sortOrder: 5,
    isFeatured: false,
    isHero: false,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "gallery-11",
    title: "Natural Stone Polishing",
    location: "Premium floor finish",
    imageUrl: "images/client-images/gallery-11.jpg",
    altText: "Natural Stone Polishing",
    sortOrder: 6,
    isFeatured: false,
    isHero: false,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "gallery-12",
    title: "Premium Floor Finish",
    location: "Restored stone shine",
    imageUrl: "images/client-images/gallery-12.jpg",
    altText: "Premium Floor Finish",
    sortOrder: 7,
    isFeatured: false,
    isHero: false,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "gallery-13",
    title: "Gloss Recovery",
    location: "Surface refinishing",
    imageUrl: "images/client-images/gallery-13.jpg",
    altText: "Gloss Recovery",
    sortOrder: 8,
    isFeatured: false,
    isHero: false,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "gallery-14",
    title: "Surface Refinishing",
    location: "Protected polished floor",
    imageUrl: "images/client-images/gallery-14.jpg",
    altText: "Surface Refinishing",
    sortOrder: 9,
    isFeatured: false,
    isHero: false,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "gallery-15",
    title: "Protected Finish",
    location: "Polished stone surface",
    imageUrl: "images/client-images/gallery-15.jpg",
    altText: "Protected Finish",
    sortOrder: 10,
    isFeatured: false,
    isHero: false,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
];

function normalizeGalleryImage(image: GalleryImageRecord, index: number): GalleryImageRecord {
  const timestamp = image.createdAt || now();

  return {
    id: image.id || `gallery-${Date.now()}-${index + 1}`,
    title: image.title?.trim() || `Gallery Image ${index + 1}`,
    location: image.location?.trim() || "",
    imageUrl: image.imageUrl?.trim() || "",
    altText: image.altText?.trim() || image.title?.trim() || `Gallery Image ${index + 1}`,
    sortOrder: Number.isFinite(Number(image.sortOrder)) ? Number(image.sortOrder) : index + 1,
    isFeatured: image.isFeatured ?? false,
    isHero: image.isHero ?? false,
    isPublished: image.isPublished ?? true,
    createdAt: timestamp,
    updatedAt: image.updatedAt || timestamp,
  };
}

function sortGalleryImages(images: GalleryImageRecord[]) {
  return images
    .map(normalizeGalleryImage)
    .sort((first, second) => first.sortOrder - second.sortOrder || first.title.localeCompare(second.title))
    .map((image, index) => ({ ...image, sortOrder: index + 1 }));
}

export function getGalleryImages() {
  return sortGalleryImages(readJson<GalleryImageRecord[]>(galleryImageStorageKey, seedGalleryImages));
}

export function getPublishedGalleryImages() {
  return getGalleryImages().filter((image) => image.isPublished && image.imageUrl);
}

async function loadGalleryImages(publishedOnly = false) {
  const payload = await apiRequest<{ ok: boolean; images: GalleryImageRecord[] }>(
    publishedOnly ? "gallery.public" : "gallery",
  );
  const images = sortGalleryImages(payload.images);
  if (!publishedOnly) {
    writeJson(galleryImageStorageKey, images);
  }
  return images;
}

export async function saveGalleryImage(image: GalleryImageRecord) {
  const normalizedImage = normalizeGalleryImage(image, 0);
  await apiRequest("gallery.save", {
    method: "POST",
    body: JSON.stringify(normalizedImage),
  });

  const currentImages = getGalleryImages();
  const exists = currentImages.some((item) => item.id === normalizedImage.id);
  const nextImages = sortGalleryImages(
    exists
      ? currentImages.map((item) => (item.id === normalizedImage.id ? normalizedImage : item))
      : [...currentImages, normalizedImage],
  );
  writeJson(galleryImageStorageKey, nextImages);
  return normalizedImage;
}

export async function deleteGalleryImage(imageId: string) {
  await apiRequest("gallery.delete", {
    method: "POST",
    body: JSON.stringify({ id: imageId }),
  });
  writeJson(
    galleryImageStorageKey,
    getGalleryImages().filter((image) => image.id !== imageId),
  );
}

export function useGalleryImagesState(publishedOnly = false) {
  const [images, setImages] = useState(() =>
    publishedOnly ? [] : getGalleryImages(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isActive = true;
    const refresh = () => setImages(publishedOnly ? getPublishedGalleryImages() : getGalleryImages());
    const refreshFromApi = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const nextImages = await loadGalleryImages(publishedOnly);
        if (!isActive) return;
        setImages(publishedOnly ? nextImages.filter((image) => image.isPublished) : nextImages);
      } catch (loadError) {
        if (!isActive) return;
        setError(loadError);
        refresh();
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void refreshFromApi();
    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refresh);
      isActive = false;
    };
  }, [publishedOnly]);

  return { images, isLoading, error };
}

export function useGalleryImages(publishedOnly = false) {
  return useGalleryImagesState(publishedOnly).images;
}

const seedTestimonials: TestimonialRecord[] = [
  {
    id: "hotel-lobby-client",
    quote:
      "The lobby floor looked dull before the service. After polishing, the shine came back and the space looked ready for guests again.",
    clientName: "Hotel Lobby Client",
    rating: 5,
    sortOrder: 1,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "marble-restoration-client",
    quote:
      "Technoshine explained the process clearly, protected the area, and finished the marble restoration with a clean glossy result.",
    clientName: "Marble Restoration Client",
    rating: 5,
    sortOrder: 2,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "commercial-tile-client",
    quote:
      "Our tiles had heavy stains from daily traffic. The team cleaned the surface well and made the floor much easier to maintain.",
    clientName: "Commercial Tile Client",
    rating: 5,
    sortOrder: 3,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "granite-care-client",
    quote:
      "The granite counters looked newer after treatment. We appreciated the careful work and the simple maintenance advice after the job.",
    clientName: "Granite Care Client",
    rating: 5,
    sortOrder: 4,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "property-admin-client",
    quote:
      "The before and after difference was easy to see. We would recommend Technoshine for clients who need professional stone care.",
    clientName: "Property Admin Client",
    rating: 5,
    sortOrder: 5,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
];

function normalizeTestimonial(testimonial: TestimonialRecord, index: number): TestimonialRecord {
  const timestamp = testimonial.createdAt || now();

  return {
    id: testimonial.id || `testimonial-${Date.now()}-${index + 1}`,
    quote: testimonial.quote?.trim() || "",
    clientName: testimonial.clientName?.trim() || `Client ${index + 1}`,
    rating: Math.min(5, Math.max(1, Number(testimonial.rating) || 5)),
    sortOrder: Number.isFinite(Number(testimonial.sortOrder)) ? Number(testimonial.sortOrder) : index + 1,
    isPublished: testimonial.isPublished ?? true,
    createdAt: timestamp,
    updatedAt: testimonial.updatedAt || timestamp,
  };
}

function sortTestimonials(testimonials: TestimonialRecord[]) {
  return testimonials
    .map(normalizeTestimonial)
    .sort((first, second) => first.sortOrder - second.sortOrder || first.clientName.localeCompare(second.clientName))
    .map((testimonial, index) => ({ ...testimonial, sortOrder: index + 1 }));
}

export function getTestimonials() {
  return sortTestimonials(readJson<TestimonialRecord[]>(testimonialStorageKey, seedTestimonials));
}

export function getPublishedTestimonials() {
  return getTestimonials().filter((testimonial) => testimonial.isPublished && testimonial.quote);
}

async function loadTestimonials(publishedOnly = false) {
  const payload = await apiRequest<{ ok: boolean; testimonials: TestimonialRecord[] }>(
    publishedOnly ? "testimonials.public" : "testimonials",
  );
  const testimonials = sortTestimonials(payload.testimonials);
  if (!publishedOnly) {
    writeJson(testimonialStorageKey, testimonials);
  }
  return testimonials;
}

export async function saveTestimonial(testimonial: TestimonialRecord) {
  const normalizedTestimonial = normalizeTestimonial(testimonial, 0);
  await apiRequest("testimonials.save", {
    method: "POST",
    body: JSON.stringify(normalizedTestimonial),
  });

  const currentTestimonials = getTestimonials();
  const exists = currentTestimonials.some((item) => item.id === normalizedTestimonial.id);
  const nextTestimonials = sortTestimonials(
    exists
      ? currentTestimonials.map((item) => (item.id === normalizedTestimonial.id ? normalizedTestimonial : item))
      : [...currentTestimonials, normalizedTestimonial],
  );
  writeJson(testimonialStorageKey, nextTestimonials);
  return normalizedTestimonial;
}

export async function deleteTestimonial(testimonialId: string) {
  await apiRequest("testimonials.delete", {
    method: "POST",
    body: JSON.stringify({ id: testimonialId }),
  });
  writeJson(
    testimonialStorageKey,
    getTestimonials().filter((testimonial) => testimonial.id !== testimonialId),
  );
}

export function useTestimonialsState(publishedOnly = false) {
  const [testimonials, setTestimonials] = useState(() =>
    publishedOnly ? [] : getTestimonials(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isActive = true;
    const refresh = () => setTestimonials(publishedOnly ? getPublishedTestimonials() : getTestimonials());
    const refreshFromApi = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const nextTestimonials = await loadTestimonials(publishedOnly);
        if (!isActive) return;
        setTestimonials(
          publishedOnly
            ? nextTestimonials.filter((testimonial) => testimonial.isPublished)
            : nextTestimonials,
        );
      } catch (loadError) {
        if (!isActive) return;
        setError(loadError);
        refresh();
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void refreshFromApi();
    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refresh);
      isActive = false;
    };
  }, [publishedOnly]);

  return { testimonials, isLoading, error };
}

export function useTestimonials(publishedOnly = false) {
  return useTestimonialsState(publishedOnly).testimonials;
}

const adminCountsQueryKey = ["admin", "counts"] as const;
const emptyAdminCounts: AdminCounts = {
  employees: 0,
  products: 0,
  publishedProducts: 0,
  contentSections: 0,
  services: 0,
  reels: 0,
  galleryImages: 0,
  testimonials: 0,
  liveVisitors: 0,
  totalVisits: 0,
  pageViews: 0,
  desktopVisits: 0,
  mobileVisits: 0,
  tabletVisits: 0,
  unknownDeviceVisits: 0,
};
const adminCountStorageKeys = new Set([
  productStorageKey,
  employeeStorageKey,
  contentStorageKey,
  serviceStorageKey,
  socialReelStorageKey,
  galleryImageStorageKey,
  testimonialStorageKey,
  helpProductStorageKey,
]);

function normalizeAdminCount(value: unknown, field: string) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new AdminApiError(`Admin count "${field}" is invalid.`);
  }

  return Math.trunc(value);
}

async function loadAdminCounts(signal?: AbortSignal): Promise<AdminCounts> {
  const payload = await apiRequest<{
    ok: boolean;
    counts?: Partial<Record<keyof AdminCounts, unknown>>;
  }>("counts", { signal });
  if (!payload.counts) throw new AdminApiError("Admin counts are missing from the API response.");

  return {
    employees: normalizeAdminCount(payload.counts.employees, "employees"),
    products: normalizeAdminCount(payload.counts.products, "products"),
    publishedProducts: normalizeAdminCount(
      payload.counts.publishedProducts,
      "publishedProducts",
    ),
    contentSections: normalizeAdminCount(payload.counts.contentSections, "contentSections"),
    services: normalizeAdminCount(payload.counts.services, "services"),
    reels: normalizeAdminCount(payload.counts.reels, "reels"),
    galleryImages: normalizeAdminCount(payload.counts.galleryImages, "galleryImages"),
    testimonials: normalizeAdminCount(payload.counts.testimonials, "testimonials"),
    liveVisitors: normalizeAdminCount(payload.counts.liveVisitors, "liveVisitors"),
    totalVisits: normalizeAdminCount(payload.counts.totalVisits, "totalVisits"),
    pageViews: normalizeAdminCount(payload.counts.pageViews, "pageViews"),
    desktopVisits: normalizeAdminCount(payload.counts.desktopVisits, "desktopVisits"),
    mobileVisits: normalizeAdminCount(payload.counts.mobileVisits, "mobileVisits"),
    tabletVisits: normalizeAdminCount(payload.counts.tabletVisits, "tabletVisits"),
    unknownDeviceVisits: normalizeAdminCount(payload.counts.unknownDeviceVisits, "unknownDeviceVisits"),
  };
}

export function useAdminCountsState() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: adminCountsQueryKey,
    queryFn: ({ signal }) => loadAdminCounts(signal),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });

  useEffect(() => {
    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: adminCountsQueryKey });
    };
    const refreshFromStorage = (event: StorageEvent) => {
      if (event.key && adminCountStorageKeys.has(event.key)) refresh();
    };

    window.addEventListener(adminStoreEvent, refresh);
    window.addEventListener("storage", refreshFromStorage);
    return () => {
      window.removeEventListener(adminStoreEvent, refresh);
      window.removeEventListener("storage", refreshFromStorage);
    };
  }, [queryClient]);

  return {
    counts: query.data ?? emptyAdminCounts,
    error: query.error,
    hasData: query.data !== undefined,
    isFetching: query.isFetching,
    isLoading: query.isPending,
    lastUpdatedAt: query.dataUpdatedAt || null,
  };
}

export function useAdminCounts() {
  return useAdminCountsState().counts;
}
