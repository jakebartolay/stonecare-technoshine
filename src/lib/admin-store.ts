import { useEffect, useMemo, useState } from "react";

import { shopProducts, type ProductBadge, type ShopProduct } from "@/lib/shop-products";
import { serviceItems } from "@/lib/site-content";

export const adminStoreEvent = "technoshine-admin-store-updated";

const productStorageKey = "technoshine-admin-products";
const employeeStorageKey = "technoshine-admin-employees";
const contentStorageKey = "technoshine-admin-content";
const serviceStorageKey = "technoshine-admin-services";
const socialReelStorageKey = "technoshine-admin-social-reels";
const sessionStorageKey = "technoshine-admin-session";
let hasVerifiedAdminSession = false;
let adminSessionVerification: Promise<AdminSession | null> | null = null;
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

export interface AdminProduct extends ShopProduct {
  id: string;
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
  deletedAt?: string;
}

export interface ContentSection {
  id: string;
  key: string;
  title: string;
  body: string;
  updatedAt: string;
}

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

export interface ProductValidationErrors {
  name?: string;
  category?: string;
  price?: string;
  stockLeft?: string;
}

export interface ProductFormData {
  id?: string;
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

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
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

function adminApiUrl(action: string, params?: Record<string, string>) {
  const searchParams = new URLSearchParams({ action, ...(params ?? {}) });
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

  try {
    response = await fetch(adminApiUrl(action, params), {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      ...init,
    });
  } catch {
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
  const payload = await parseApiResponse<{ ok: boolean; url: string }>(response);
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

  adminSessionVerification = (async () => {
    try {
      const payload = await apiRequest<{ ok: boolean; session: AdminSession | null }>("me");
      hasVerifiedAdminSession = true;
      cacheSession(payload.session, payload.session?.remember ?? false);
      return payload.session;
    } catch (error) {
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

export async function loginAdmin(email: string, password: string, remember: boolean) {
  const payload = await apiRequest<{ ok: boolean; session: AdminSession }>("login", {
    method: "POST",
    body: JSON.stringify({ email, password, remember }),
  });
  const session = payload.session;
  hasVerifiedAdminSession = true;
  cacheSession(session, session.remember ?? remember);
  return session;
}

export async function logoutAdmin() {
  try {
    await apiRequest("logout", { method: "POST", body: "{}" });
  } finally {
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
  },
  {
    id: "ORG-OPSMGR-001",
    name: "Henry Cadorna",
    position: "Operations Mgr",
    department: "Technical",
    orgGroup: "staff",
    employeeId: "ORG-OPSMGR-001",
    reportsTo: "ORG-TECH-001",
    photoUrl: "team/Operations%20Mgr.jpg",
  },
  {
    id: "ORG-OPSMGR-002",
    name: "Renato Aducal",
    position: "Operations Mgr",
    department: "Technical",
    orgGroup: "staff",
    employeeId: "ORG-OPSMGR-002",
    reportsTo: "ORG-TECH-001",
    photoUrl: "team/Operations%20Mgr%202.jpg",
  },
  {
    id: "26-001",
    name: "Nonito Regino Guiao Jr",
    position: "Rider Liaison",
    department: "Admin",
    orgGroup: "staff",
    employeeId: "26-001",
    reportsTo: "24-015",
    photoUrl: "employees/photos/26-001.jpg",
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
  },
  {
    id: "ORG-OFFICEAID-001",
    name: "Winks Morales Balala",
    position: "Office Aid",
    department: "Admin",
    orgGroup: "staff",
    employeeId: "ORG-OFFICEAID-001",
    reportsTo: "24-015",
    photoUrl: "team/Office%20Aid.jpg",
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
  },
  {
    id: "ORG-ITASSIST-001",
    name: "Jake Bartolay",
    position: "IT Assistant",
    department: "IT / Creative",
    orgGroup: "staff",
    employeeId: "ORG-ITASSIST-001",
    reportsTo: "ORG-GRAPHIC-001",
    photoUrl: "team/IT%20Assistant.jpg",
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

export async function deleteEmployee(employeeId: string) {
  await apiRequest("employees.delete", {
    method: "POST",
    body: JSON.stringify({ id: employeeId }),
  });
  const deletedAt = now();
  writeJson(
    employeeStorageKey,
    getEmployees().map((employee) =>
      employee.id === employeeId ? { ...employee, deletedAt } : employee,
    ),
  );
}

export function useEmployees(publicOnly = false) {
  const [employees, setEmployees] = useState(() =>
    publicOnly ? getEmployees().filter((employee) => !employee.deletedAt) : getEmployees(),
  );

  useEffect(() => {
    const refresh = () =>
      setEmployees(
        publicOnly ? getEmployees().filter((employee) => !employee.deletedAt) : getEmployees(),
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

export function getContentSections() {
  return readJson<ContentSection[]>(contentStorageKey, seedContentSections);
}

export async function saveContentSections(sections: ContentSection[]) {
  await apiRequest("content.save", {
    method: "POST",
    body: JSON.stringify({ sections }),
  });
  writeJson(contentStorageKey, sections);
}

async function loadContentSections() {
  const payload = await apiRequest<{ ok: boolean; sections: ContentSection[] }>("content");
  writeJson(contentStorageKey, payload.sections);
  return payload.sections;
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

export function useAdminCounts() {
  const products = useAdminProducts(false);
  const employees = useEmployees();
  const contentSections = useContentSections();
  const services = useServicePages();
  const reels = useSocialReels(false);

  return useMemo(
    () => ({
      products: products.length,
      publishedProducts: products.filter((product) => product.isPublished).length,
      employees: employees.filter((employee) => !employee.deletedAt).length,
      contentSections: contentSections.length,
      services: services.length,
      reels: reels.length,
    }),
    [contentSections.length, employees, products, reels.length, services.length],
  );
}
