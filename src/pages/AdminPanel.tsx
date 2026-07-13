import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import {
  Boxes,
  ChevronLeft,
  BriefcaseBusiness,
  ChevronRight,
  Download,
  Edit3,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Save,
  Search,
  ServerCrash,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminProductCategories,
  createBlankProduct,
  deleteEmployee,
  deleteProduct,
  formDataToProduct,
  logoutAdmin,
  orgChartGroups,
  productToFormData,
  saveContentSections,
  saveEmployees,
  saveSocialReels,
  saveServicePages,
  saveAdminProducts,
  uploadServiceImage,
  upsertProduct,
  useAdminCounts,
  useAdminProducts,
  useAdminSession,
  useContentSections,
  useEmployees,
  useServicePagesState,
  useSocialReels,
  validateProduct,
  type AdminProduct,
  type ContentSection,
  type EmployeeRecord,
  type ProductFormData,
  type ProductValidationErrors,
  type ServiceImageRecord,
  type ServicePageRecord,
  type SocialReelRecord,
} from "@/lib/admin-store";
import { shopSizes } from "@/lib/shop-products";
import { transactionToast } from "@/lib/transaction-toast";

type AdminPageProps = {
  children: ReactNode;
  title: string;
  eyebrow: string;
  actions?: ReactNode;
};

type ProductView = "table" | "cards";
const employeePageSize = 8;
const reelPageSize = 8;

const navItems = [
  { label: "Dashboard", href: "/company/admin/dashboard", icon: LayoutDashboard },
  { label: "Services", href: "/company/admin/services", icon: Images },
  { label: "Reels", href: "/company/admin/reels", icon: Video },
  { label: "Products", href: "/company/admin/products", icon: ShoppingBag },
  { label: "Employees", href: "/company/admin/employees", icon: Users },
  { label: "Content", href: "/company/admin/content", icon: FileText },
];

function isAdminNavItemActive(location: string, itemHref: string) {
  return (
    location === itemHref ||
    (itemHref === "/company/admin/dashboard" &&
      (location === "/company/admin" || location === "/company/admin/"))
  );
}

function AdminNavLinks({
  location,
  className,
  onNavigate,
}: {
  location: string;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Admin navigation" className={className}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = isAdminNavItemActive(location, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
            className={`flex min-h-12 items-center gap-3 rounded-lg px-3.5 text-sm font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
              isActive
                ? "bg-primary text-neutral-950 shadow-sm shadow-primary/20"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-md ${
                isActive ? "bg-black/10" : "bg-white/[0.06]"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

const blankEmployee: EmployeeRecord = {
  id: "",
  name: "",
  position: "",
  department: "",
  orgGroup: "staff",
  employeeId: "",
  reportsTo: "",
  photoUrl: "",
};

function AdminGuard({ children }: { children: ReactNode }) {
  const session = useAdminSession();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (session === null) navigate("/company/admin/login");
  }, [navigate, session]);

  if (session === undefined) {
    return <main className="min-h-screen bg-[#f5f6f6]" />;
  }

  if (session === null) {
    return (
      <main className="min-h-screen bg-[#f5f6f6]" />
    );
  }

  return <>{children}</>;
}

function AdminLayout({ children, title, eyebrow, actions }: AdminPageProps) {
  const [location, navigate] = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const activeNavItem = navItems.find((item) => isAdminNavItemActive(location, item.href));

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "TECHNOSHINE | ADMIN";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  async function handleLogout() {
    setIsMobileNavOpen(false);

    try {
      await logoutAdmin();
      transactionToast.info("Logged out", "Admin session has been cleared.");
    } catch (error) {
      transactionToast.error("Logout warning", error, "Local session was cleared, but the server did not respond.");
    } finally {
      navigate("/company/admin/login");
    }
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-[#f5f6f6] text-neutral-950">
        <div className="grid min-h-screen lg:grid-cols-[17rem_1fr]">
          <aside className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950 text-white lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-4 lg:py-5">
            <div className="flex h-16 items-center justify-between gap-4 px-4 lg:h-auto lg:px-0">
              <div className="min-w-0">
                <Link
                  href="/company/admin/dashboard"
                  className="inline-flex text-xl font-black uppercase tracking-normal"
                >
                  TECHNO<span className="text-primary">SHINE</span>
                </Link>
                <p className="mt-0.5 truncate font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Admin · {activeNavItem?.label ?? "Console"}
                </p>
              </div>

              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-11 w-11 border-white/15 text-white hover:bg-white/10 lg:hidden"
                    aria-label="Open admin navigation"
                  >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="flex w-[min(20rem,86vw)] flex-col gap-0 border-neutral-800 bg-neutral-950 p-0 text-white sm:max-w-xs [&>button]:right-3 [&>button]:top-3 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-md [&>button]:text-white [&>button]:hover:bg-white/10"
                >
                  <SheetHeader className="border-b border-neutral-800 px-5 py-5 text-left">
                    <SheetTitle className="text-left text-xl font-black uppercase tracking-normal text-white">
                      TECHNO<span className="text-primary">SHINE</span>
                    </SheetTitle>
                    <SheetDescription className="text-left font-mono text-xs uppercase tracking-[0.16em] text-white/45">
                      Admin console · {activeNavItem?.label ?? "Navigation"}
                    </SheetDescription>
                  </SheetHeader>

                  <AdminNavLinks
                    location={location}
                    onNavigate={() => setIsMobileNavOpen(false)}
                    className="grid gap-2 overflow-y-auto px-4 py-5"
                  />

                  <div className="mt-auto border-t border-neutral-800 p-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-11 w-full justify-start border-white/15 text-white hover:bg-white/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <AdminNavLinks location={location} className="mt-8 hidden gap-2 lg:grid" />

            <div className="mt-auto hidden border-t border-neutral-800 pt-4 lg:block">
              <Button
                type="button"
                variant="ghost"
                className="min-h-11 w-full justify-start border-white/15 text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </Button>
            </div>
          </aside>

          <section className="min-w-0">
            <header className="border-b border-neutral-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    {eyebrow}
                  </p>
                  <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">{title}</h1>
                </div>
                {actions}
              </div>
            </header>

            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </section>
        </div>
      </main>
    </AdminGuard>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Boxes;
}) {
  return (
    <div className="border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</p>
          <p className="mt-2 font-display text-4xl font-bold text-neutral-950">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const counts = useAdminCounts();

  return (
    <AdminLayout title="Admin Dashboard" eyebrow="Company Admin">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Employees" value={counts.employees} icon={Users} />
        <MetricCard label="Services" value={counts.services} icon={Images} />
        <MetricCard label="Reels" value={counts.reels} icon={Video} />
        <MetricCard label="Products" value={counts.products} icon={ShoppingBag} />
        <MetricCard label="Published" value={counts.publishedProducts} icon={Boxes} />
        <MetricCard label="Content Sections" value={counts.contentSections} icon={FileText} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {navItems.slice(1).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-primary/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-neutral-100 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h2 className="mt-5 text-xl">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Manage {item.label.toLowerCase()} records for Technoshine operations.
              </p>
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}

function productMatches(product: AdminProduct, query: string) {
  const search = query.trim().toLowerCase();
  if (!search) return true;
  return [product.name, product.category, product.brand, product.usesLine]
    .join(" ")
    .toLowerCase()
    .includes(search);
}

function adminAssetPath(path: string) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

function createServiceImage(serviceSlug: string, nextOrder: number): ServiceImageRecord {
  return {
    id: `${serviceSlug}-${Date.now()}-${nextOrder}`,
    imageUrl: "",
    altText: "",
    caption: "",
    sortOrder: nextOrder,
  };
}

function serviceMatchesSearch(service: ServicePageRecord, query: string) {
  const search = query.trim().toLowerCase();
  if (!search) return true;

  return [service.title, service.slug, service.summary]
    .join(" ")
    .toLowerCase()
    .includes(search);
}

function getPreferredServiceSlug(services: ServicePageRecord[]) {
  return services.find((service) => service.slug === "marble-polishing")?.slug ?? services[0]?.slug ?? "";
}

function fileNameToCaption(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function facebookVideoEmbedUrl(href: string, width = 320, height = 568) {
  const params = new URLSearchParams({
    href,
    height: String(height),
    show_text: "false",
    width: String(width),
  });

  return `https://www.facebook.com/plugins/video.php?${params.toString()}`;
}

function isFacebookVideoUrl(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");
    return (
      hostname === "facebook.com" &&
      (url.pathname.includes("/reel/") ||
        url.pathname.includes("/watch") ||
        url.pathname.includes("/videos/"))
    );
  } catch {
    return false;
  }
}

function createBlankSocialReel(nextOrder: number): SocialReelRecord {
  const timestamp = new Date().toISOString();

  return {
    id: "",
    title: "",
    href: "",
    sortOrder: nextOrder,
    isPublished: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createSocialReelId(title: string, reels: SocialReelRecord[]) {
  const normalizedTitle = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
  const baseId = normalizedTitle || "reel";
  const usedIds = new Set(reels.map((reel) => reel.id));

  if (!usedIds.has(baseId)) return baseId;

  let suffix = 2;
  while (usedIds.has(`${baseId.slice(0, 60)}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseId.slice(0, 60)}-${suffix}`;
}

function AdminServicesUnavailable({
  error,
  isRetrying,
  onRetry,
}: {
  error: unknown;
  isRetrying: boolean;
  onRetry: () => void;
}) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : "The admin API did not return a valid response.";

  return (
    <AdminLayout title="Service Images" eyebrow="Service Pages">
      <section
        role="alert"
        aria-live="polite"
        className="relative overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

        <div className="grid min-h-[34rem] lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ServerCrash className="h-7 w-7" aria-hidden="true" />
            </div>

            <p className="mt-7 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              503 / Admin API Offline
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl leading-tight text-neutral-950 sm:text-4xl">
              Service manager is temporarily unavailable.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
              We could not connect to the server, so editing and image uploads are paused for now.
              Your existing service content is safe and remains unchanged.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                size="lg"
                className="font-bold uppercase tracking-wide"
                onClick={onRetry}
                disabled={isRetrying}
              >
                <RefreshCw
                  className={isRetrying ? "animate-spin" : ""}
                  aria-hidden="true"
                />
                {isRetrying ? "Checking server" : "Try again"}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-neutral-300 bg-white font-bold uppercase tracking-wide text-neutral-700 hover:border-primary hover:text-primary"
              >
                <Link href="/company/admin/dashboard">
                  <LayoutDashboard aria-hidden="true" />
                  Back to dashboard
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex max-w-2xl items-start gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-neutral-900">No changes were made</p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  Editing will automatically become available after the connection is restored and
                  you retry.
                </p>
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-between bg-neutral-950 p-6 text-white sm:p-8">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                System status
              </div>
              <p className="mt-8 font-mono text-7xl font-bold leading-none tracking-tighter text-white">
                503
              </p>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-primary">
                Service unavailable
              </p>
            </div>

            <dl className="mt-10 divide-y divide-white/10 border-y border-white/10 text-sm">
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-white/55">Admin panel</dt>
                <dd className="font-semibold text-white">Online</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-white/55">Services API</dt>
                <dd className="font-semibold text-primary">Offline</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-white/55">Editing</dt>
                <dd className="font-semibold text-white">Paused</dd>
              </div>
            </dl>
          </aside>
        </div>

        <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4 sm:px-10 lg:px-12">
          <p className="font-mono text-[11px] leading-5 text-neutral-500">
            Connection detail: {errorMessage}
          </p>
        </div>
      </section>
    </AdminLayout>
  );
}

export function AdminServices() {
  const { services, isLoading, error, retry } = useServicePagesState();
  const [drafts, setDrafts] = useState<ServicePageRecord[]>(services);
  const [serviceQuery, setServiceQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(() => getPreferredServiceSlug(services));
  const [uploadingKey, setUploadingKey] = useState("");
  const [, navigate] = useLocation();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    setDrafts(services);
    setUnsavedChanges(false);
    setSelectedSlug((currentSlug) =>
      services.some((service) => service.slug === currentSlug)
        ? currentSlug
        : getPreferredServiceSlug(services),
    );
  }, [services]);

  const filteredServices = useMemo(
    () => drafts.filter((service) => serviceMatchesSearch(service, serviceQuery)),
    [drafts, serviceQuery],
  );
  const selectedService =
    drafts.find((service) => service.slug === selectedSlug) ?? filteredServices[0];
  const totalGalleryImages = drafts.reduce((total, service) => total + service.images.length, 0);

  useEffect(() => {
    if (!filteredServices.length) return;
    if (filteredServices.some((service) => service.slug === selectedSlug)) return;
    setSelectedSlug(filteredServices[0].slug);
  }, [filteredServices, selectedSlug]);

  function updateService(slug: string, updates: Partial<ServicePageRecord>) {
    setUnsavedChanges(true);
    setDrafts((current) =>
      current.map((service) => (service.slug === slug ? { ...service, ...updates } : service)),
    );
  }

  function openServiceEditor(slug: string) {
    setSelectedSlug(slug);
    setEditDialogOpen(true);
  }

  function updateServiceImage(
    slug: string,
    imageId: string,
    updates: Partial<ServiceImageRecord>,
  ) {
    setUnsavedChanges(true);
    setDrafts((current) =>
      current.map((service) =>
        service.slug === slug
          ? {
              ...service,
              images: service.images.map((image) =>
                image.id === imageId ? { ...image, ...updates } : image,
              ),
            }
          : service,
      ),
    );
  }

  function addServiceImage(slug: string) {
    setUnsavedChanges(true);
    setDrafts((current) =>
      current.map((service) =>
        service.slug === slug
          ? {
              ...service,
              images: [
                ...service.images,
                createServiceImage(service.slug, service.images.length + 1),
              ],
            }
          : service,
      ),
    );
  }

  function removeServiceImage(slug: string, imageId: string) {
    setUnsavedChanges(true);
    setDrafts((current) =>
      current.map((service) =>
        service.slug === slug
          ? {
              ...service,
              images: service.images
                .filter((image) => image.id !== imageId)
                .map((image, index) => ({ ...image, sortOrder: index + 1 })),
            }
          : service,
      ),
    );
  }

  async function uploadImageFile(
    serviceSlug: string,
    file: File | undefined,
    uploadKey: string,
    slot: string,
    previousImageUrl: string,
    applyUploadedImage: (current: ServicePageRecord[], imageUrl: string) => ServicePageRecord[],
  ) {
    if (!file) return;

    setUploadingKey(uploadKey);
    try {
      const imageUrl = await uploadServiceImage(file, serviceSlug, slot, previousImageUrl);
      const nextDrafts = applyUploadedImage(drafts, imageUrl);
      setDrafts(nextDrafts);
      setUnsavedChanges(true);
      transactionToast.success("Image uploaded to draft", "Changes saved to draft. Click Save to publish.");
    } catch (error) {
      transactionToast.error("Image upload failed", error);
    } finally {
      setUploadingKey("");
    }
  }

  useEffect(() => {
    try {
      sessionStorage.removeItem("admin:pendingUpload");
    } catch (e) {
      // ignore storage access errors
    }
  }, []);

  async function compressImageFile(file: File): Promise<File> {
    const TEN_MB = 10 * 1024 * 1024;
    const TWO_HUNDRED_MB = 200 * 1024 * 1024;
    if (file.size <= TEN_MB) return file;
    if (file.size > TWO_HUNDRED_MB) throw new Error("FILE_TOO_LARGE");

    const imageUrl = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("NO_CANVAS_CONTEXT");

    let quality = 0.92;
    let scale = 0.9;
    let attempt = 0;
    let lastBlob: Blob | null = null;

    while (attempt < 8) {
      canvas.width = Math.max(1, Math.round(img.width * Math.pow(scale, attempt)));
      canvas.height = Math.max(1, Math.round(img.height * Math.pow(scale, attempt)));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // try JPEG first
      // eslint-disable-next-line no-await-in-loop
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
      if (!blob) throw new Error("COMPRESSION_FAILED");
      lastBlob = blob;
      if (blob.size <= TEN_MB) break;

      quality = Math.max(0.4, quality - 0.12);
      attempt += 1;
    }

    if (!lastBlob) throw new Error("COMPRESSION_FAILED");

    const compressedFile = new File([lastBlob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: lastBlob.type });
    return compressedFile;
  }

  async function uploadHeroImage(serviceSlug: string, file: File | undefined) {
    const service = drafts.find((item) => item.slug === serviceSlug);
    await uploadImageFile(
      serviceSlug,
      file,
      `${serviceSlug}:hero`,
      "hero",
      service?.heroImageUrl ?? "",
      (current, imageUrl) =>
        current.map((item) =>
          item.slug === serviceSlug ? { ...item, heroImageUrl: imageUrl } : item,
        ),
    );
  }

  async function uploadGalleryImage(serviceSlug: string, imageId: string, file: File | undefined) {
    const service = drafts.find((item) => item.slug === serviceSlug);
    const imageIndex = service?.images.findIndex((image) => image.id === imageId) ?? -1;
    const image = imageIndex >= 0 ? service?.images[imageIndex] : undefined;

    await uploadImageFile(
      serviceSlug,
      file,
      `${serviceSlug}:gallery:${imageId}`,
      `gallery-${imageIndex >= 0 ? imageIndex + 1 : Date.now()}`,
      image?.imageUrl ?? "",
      (current, imageUrl) =>
        current.map((item) =>
          item.slug === serviceSlug
            ? {
                ...item,
                images: item.images.map((galleryImage) =>
                  galleryImage.id === imageId ? { ...galleryImage, imageUrl } : galleryImage,
                ),
              }
            : item,
        ),
    );
  }

  async function uploadNewGalleryImage(serviceSlug: string, file: File | undefined) {
    const service = drafts.find((item) => item.slug === serviceSlug);
    const nextOrder = (service?.images.length ?? 0) + 1;

    await uploadImageFile(
      serviceSlug,
      file,
      `${serviceSlug}:new-gallery`,
      `gallery-${nextOrder}`,
      "",
      (current, imageUrl) =>
        current.map((service) => {
          if (service.slug !== serviceSlug) return service;

          const nextOrder = service.images.length + 1;
          const caption = fileNameToCaption(file?.name ?? "");

          return {
            ...service,
            images: [
              ...service.images,
              {
                ...createServiceImage(service.slug, nextOrder),
                imageUrl,
                altText: `${service.title} service image`,
                caption: caption || `${service.title} image`,
              },
            ],
          };
        }),
    );
  }

  async function saveAll() {
    try {
      await saveServicePages(drafts);
      setUnsavedChanges(false);
      transactionToast.success("Services saved", "Service page images and copy were updated.");
    } catch (error) {
      transactionToast.error("Service save failed", error);
    }
  }

  if (error) {
    return (
      <AdminServicesUnavailable
        error={error}
        isRetrying={isLoading}
        onRetry={retry}
      />
    );
  }

  return (
    <AdminLayout
      title="Service Images"
      eyebrow="Service Pages"
    >
      <div className="space-y-5">
        <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-end">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Service Directory
                </p>
                <h2 className="mt-1 text-2xl leading-tight text-neutral-950">
                  Services Table
                </h2>
                <div className="mt-3 grid gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:grid-cols-2">
                  <span className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                    {drafts.length} total services
                  </span>
                  <span className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                    {totalGalleryImages} gallery images
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="service-search" className="sr-only">
                  Search services
                </Label>
                <div className="flex min-h-11 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 focus-within:border-primary">
                  <Search className="h-4 w-4 shrink-0 text-primary" />
                  <input
                    id="service-search"
                    value={serviceQuery}
                    onChange={(event) => setServiceQuery(event.currentTarget.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    placeholder="Search services"
                  />
                  {serviceQuery ? (
                    <button
                      type="button"
                      onClick={() => setServiceQuery("")}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-primary"
                      aria-label="Clear service search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {filteredServices.length} matching rows
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-neutral-950 text-xs uppercase tracking-wide text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Preview</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Gallery</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => {
                  const isActive = selectedService?.slug === service.slug;

                  return (
                    <tr
                      key={service.slug}
                      className={[
                        "cursor-pointer border-t border-neutral-200 transition",
                        isActive ? "bg-primary/5" : "hover:bg-neutral-50",
                      ].join(" ")}
                      onClick={() => openServiceEditor(service.slug)}
                    >
                      <td className="px-4 py-3">
                        <div className="h-16 w-24 overflow-hidden rounded-md bg-neutral-100">
                          {service.heroImageUrl ? (
                            <img
                              src={adminAssetPath(service.heroImageUrl)}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-display text-base font-bold uppercase tracking-normal text-neutral-950">
                          {service.title}
                        </p>
                        <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-neutral-500">
                          {service.summary}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-neutral-600">
                          {service.slug}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex min-w-16 justify-center rounded-md bg-neutral-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-700">
                          {service.images.length} rows
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant={isActive ? "default" : "outline"}
                            onClick={(event) => {
                              event.stopPropagation();
                              openServiceEditor(service.slug);
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredServices.length === 0 ? (
            <div className="border-t border-neutral-200 p-8 text-center">
              <p className="font-display text-xl font-bold uppercase tracking-normal text-neutral-950">
                No service found
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Try another search term.
              </p>
            </div>
          ) : null}
        </section>

        <div>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-h-[92vh] max-w-[min(88rem,96vw)] overflow-y-auto p-0 sm:rounded-lg">
              {selectedService ? (
            <section className="overflow-hidden bg-white">
              <div className="border-b border-neutral-200 bg-white p-4 pr-12">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Selected Service
                    </p>
                    <DialogTitle className="mt-1 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
                      {selectedService.title}
                    </DialogTitle>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
                      <span className="rounded-md bg-neutral-100 px-2.5 py-1 text-neutral-600">
                        {selectedService.slug}
                      </span>
                      <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">
                        {selectedService.images.length + 1} image rows
                      </span>
                    </div>
                  </div>
                  <Button type="button" size="sm" onClick={saveAll}>
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="grid gap-5 border-b border-neutral-200 bg-neutral-50/60 p-4 lg:grid-cols-[20rem_1fr]">
                <div>
                  <div className="aspect-[4/3] overflow-hidden rounded-md bg-neutral-100 shadow-sm ring-1 ring-neutral-200">
                    {selectedService.heroImageUrl ? (
                      <img
                        src={adminAssetPath(selectedService.heroImageUrl)}
                        alt={selectedService.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <input
                    id={`${selectedService.slug}-hero-upload`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={async (event) => {
                        const file = event.currentTarget.files?.[0];
                        if (!file) return;
                        try {
                          if (file.size > 200 * 1024 * 1024) {
                            transactionToast.error("File too large", "Files 200MB+ are not accepted. Please reduce size.");
                            event.currentTarget.value = "";
                            return;
                          }
                          let usedFile = file;
                          if (file.size > 10 * 1024 * 1024) {
                            transactionToast.info("Compressing image", "Reducing image size before upload...");
                            try {
                              // eslint-disable-next-line no-await-in-loop
                              usedFile = await compressImageFile(file);
                              transactionToast.success("Compression complete", `${Math.round(usedFile.size/1024/1024)}MB`);
                            } catch (e) {
                              transactionToast.error("Compression failed", "Unable to reduce image size. Please reduce manually.");
                              event.currentTarget.value = "";
                              return;
                            }
                          }

                          // perform upload immediately; uploadImageFile will mark pending draft
                          void uploadHeroImage(selectedService.slug, usedFile);
                        } finally {
                          event.currentTarget.value = "";
                        }
                      }}
                  />
                  <label
                    htmlFor={`${selectedService.slug}-hero-upload`}
                    aria-disabled={uploadingKey === `${selectedService.slug}:hero`}
                    className={[
                      "mt-3 inline-flex min-h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-200 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition hover:border-primary hover:text-primary",
                      uploadingKey === `${selectedService.slug}:hero` ? "pointer-events-none opacity-60" : "",
                    ].join(" ")}
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingKey === `${selectedService.slug}:hero` ? "Uploading" : "Upload Hero"}
                  </label>
                </div>

                <div className="min-w-0 rounded-md border border-neutral-200 bg-white p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${selectedService.slug}-title`}>Service Title</Label>
                    <Input
                      id={`${selectedService.slug}-title`}
                      value={selectedService.title}
                      onChange={(event) =>
                        updateService(selectedService.slug, { title: event.currentTarget.value })
                      }
                    />
                  </div>

                  <div className="mt-3 space-y-2">
                    <Label htmlFor={`${selectedService.slug}-summary`}>Summary</Label>
                    <textarea
                      id={`${selectedService.slug}-summary`}
                      value={selectedService.summary}
                      onChange={(event) =>
                        updateService(selectedService.slug, { summary: event.currentTarget.value })
                      }
                      className="min-h-20 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                    <div>
                      <h3 className="text-lg leading-tight">Gallery Images</h3>
                      <p className="text-xs text-neutral-500">
                        {selectedService.images.length} images for {selectedService.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Media Rows
                    </p>
                    <h3 className="mt-1 text-xl leading-tight">Image Table</h3>
                    <p className="text-xs text-neutral-500">
                      {selectedService.images.length + 1} image rows including hero
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <input
                      id={`${selectedService.slug}-new-gallery-upload`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                        onChange={async (event) => {
                          const file = event.currentTarget.files?.[0];
                          if (!file) return;
                          try {
                            if (file.size > 200 * 1024 * 1024) {
                              transactionToast.error("File too large", "Files 200MB+ are not accepted. Please reduce size.");
                              event.currentTarget.value = "";
                              return;
                            }
                            let usedFile = file;
                            if (file.size > 10 * 1024 * 1024) {
                              transactionToast.info("Compressing image", "Reducing image size before upload...");
                              try {
                                usedFile = await compressImageFile(file);
                                transactionToast.success("Compression complete", `${Math.round(usedFile.size/1024/1024)}MB`);
                              } catch (e) {
                                transactionToast.error("Compression failed", "Unable to reduce image size. Please reduce manually.");
                                event.currentTarget.value = "";
                                return;
                              }
                            }

                            void uploadNewGalleryImage(selectedService.slug, usedFile);
                          } finally {
                            event.currentTarget.value = "";
                          }
                        }}
                    />
                    <label
                      htmlFor={`${selectedService.slug}-new-gallery-upload`}
                      aria-disabled={uploadingKey === `${selectedService.slug}:new-gallery`}
                      className={[
                        "inline-flex min-h-8 cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-200 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition hover:border-primary hover:text-primary",
                        uploadingKey === `${selectedService.slug}:new-gallery` ? "pointer-events-none opacity-60" : "",
                      ].join(" ")}
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingKey === `${selectedService.slug}:new-gallery`
                        ? "Uploading"
                        : "Upload New Image"}
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addServiceImage(selectedService.slug)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Empty Row
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-md border border-neutral-200">
                  <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] border-collapse bg-white text-sm">
                    <thead className="bg-neutral-950 text-left text-xs uppercase tracking-wide text-white">
                      <tr>
                        <th className="w-28 px-3 py-3 font-semibold">Type</th>
                        <th className="w-36 px-3 py-3 font-semibold">Preview</th>
                        <th className="w-48 px-3 py-3 font-semibold">Caption</th>
                        <th className="w-48 px-3 py-3 font-semibold">Alt Text</th>
                        <th className="w-48 px-3 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="align-top transition hover:bg-neutral-50">
                        <td className="border-b border-neutral-200 px-3 py-3">
                          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                            Hero
                          </span>
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-3">
                          <div className="h-20 w-28 overflow-hidden rounded-md bg-neutral-100">
                            {selectedService.heroImageUrl ? (
                              <img
                                src={adminAssetPath(selectedService.heroImageUrl)}
                                alt={selectedService.title}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-3 text-xs font-semibold text-neutral-500">
                          Service hero image
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-3 text-xs font-semibold text-neutral-500">
                          {selectedService.title}
                        </td>
                        <td className="border-b border-neutral-200 px-3 py-3">
                          <input
                            id={`${selectedService.slug}-hero-table-upload`}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={(event) => {
                              const file = event.currentTarget.files?.[0];
                              void uploadHeroImage(selectedService.slug, file);
                              event.currentTarget.value = "";
                            }}
                          />
                          <label
                            htmlFor={`${selectedService.slug}-hero-table-upload`}
                            aria-disabled={uploadingKey === `${selectedService.slug}:hero`}
                            className={[
                              "inline-flex min-h-8 cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-200 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition hover:border-primary hover:text-primary",
                              uploadingKey === `${selectedService.slug}:hero`
                                ? "pointer-events-none opacity-60"
                                : "",
                            ].join(" ")}
                          >
                            <Upload className="h-4 w-4" />
                            {uploadingKey === `${selectedService.slug}:hero` ? "Uploading" : "Upload"}
                          </label>
                        </td>
                      </tr>

                      {selectedService.images.map((image, index) => {
                        const rowUploadKey = `${selectedService.slug}:gallery:${image.id}`;

                        return (
                          <tr key={image.id} className="align-top transition hover:bg-neutral-50">
                            <td className="border-b border-neutral-200 px-3 py-3">
                              <span className="font-mono text-xs font-bold text-neutral-500">
                                Gallery #{index + 1}
                              </span>
                            </td>
                            <td className="border-b border-neutral-200 px-3 py-3">
                              <div className="h-20 w-28 overflow-hidden rounded-md bg-neutral-100">
                                {image.imageUrl ? (
                                  <img
                                    src={adminAssetPath(image.imageUrl)}
                                    alt={image.altText || image.caption}
                                    className="h-full w-full object-cover"
                                  />
                                ) : null}
                              </div>
                            </td>
                            <td className="border-b border-neutral-200 px-3 py-3">
                              <Label htmlFor={`${selectedService.slug}-${image.id}-caption`} className="sr-only">
                                Caption
                              </Label>
                            <Input
                              id={`${selectedService.slug}-${image.id}-caption`}
                              value={image.caption}
                              onChange={(event) =>
                                updateServiceImage(selectedService.slug, image.id, {
                                  caption: event.currentTarget.value,
                                })
                              }
                            />
                            </td>
                            <td className="border-b border-neutral-200 px-3 py-3">
                              <Label htmlFor={`${selectedService.slug}-${image.id}-alt`} className="sr-only">
                                Alt Text
                              </Label>
                            <Input
                              id={`${selectedService.slug}-${image.id}-alt`}
                              value={image.altText}
                              onChange={(event) =>
                                updateServiceImage(selectedService.slug, image.id, {
                                  altText: event.currentTarget.value,
                                })
                              }
                            />
                            </td>
                            <td className="border-b border-neutral-200 px-3 py-3">
                              <div className="flex flex-wrap gap-2">
                                <input
                                  id={`${selectedService.slug}-${image.id}-upload`}
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="sr-only"
                                  onChange={async (event) => {
                                    const file = event.currentTarget.files?.[0];
                                    if (!file) return;
                                    try {
                                      if (file.size > 200 * 1024 * 1024) {
                                        transactionToast.error("File too large", "Files 200MB+ are not accepted. Please reduce size.");
                                        event.currentTarget.value = "";
                                        return;
                                      }
                                      let usedFile = file;
                                      if (file.size > 10 * 1024 * 1024) {
                                        transactionToast.info("Compressing image", "Reducing image size before upload...");
                                        try {
                                          usedFile = await compressImageFile(file);
                                          transactionToast.success("Compression complete", `${Math.round(usedFile.size/1024/1024)}MB`);
                                        } catch (e) {
                                          transactionToast.error("Compression failed", "Unable to reduce image size. Please reduce manually.");
                                          event.currentTarget.value = "";
                                          return;
                                        }
                                      }

                                      void uploadGalleryImage(selectedService.slug, image.id, usedFile);
                                    } finally {
                                      event.currentTarget.value = "";
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`${selectedService.slug}-${image.id}-upload`}
                                  aria-disabled={uploadingKey === rowUploadKey}
                                  className={[
                                    "inline-flex min-h-8 cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-200 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-700 transition hover:border-primary hover:text-primary",
                                    uploadingKey === rowUploadKey ? "pointer-events-none opacity-60" : "",
                                  ].join(" ")}
                                >
                                  <Upload className="h-4 w-4" />
                                  {uploadingKey === rowUploadKey ? "Uploading" : "Upload"}
                                </label>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeServiceImage(selectedService.slug, image.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Remove
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </section>
              ) : null}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminReels() {
  const reels = useSocialReels(false);
  const [drafts, setDrafts] = useState<SocialReelRecord[]>(reels);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<SocialReelRecord>(() => createBlankSocialReel(reels.length + 1));
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [reelPendingDelete, setReelPendingDelete] = useState<SocialReelRecord | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    setDrafts(reels);
  }, [reels]);

  const filteredReels = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return drafts;

    return drafts.filter((reel) =>
      [reel.id, reel.title, reel.href]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [drafts, query]);
  const pageCount = Math.max(1, Math.ceil(filteredReels.length / reelPageSize));
  const currentPage = Math.min(page, pageCount);
  const paginatedReels = filteredReels.slice(
    (currentPage - 1) * reelPageSize,
    currentPage * reelPageSize,
  );
  const firstVisibleReel = filteredReels.length === 0 ? 0 : (currentPage - 1) * reelPageSize + 1;
  const lastVisibleReel = Math.min(currentPage * reelPageSize, filteredReels.length);
  const generatedReelId = form.id || createSocialReelId(form.title, drafts);
  const isDeleteConfirmed = Boolean(
    reelPendingDelete && deleteConfirmation === reelPendingDelete.id,
  );

  useEffect(() => {
    setPage(1);
  }, [query]);

  function openNewReel() {
    setForm(createBlankSocialReel(drafts.length + 1));
    setIsEditorOpen(true);
  }

  function openEditReel(reel: SocialReelRecord) {
    setForm(reel);
    setIsEditorOpen(true);
  }

  function openDeleteReel(reel: SocialReelRecord) {
    setDeleteConfirmation("");
    setReelPendingDelete(reel);
  }

  function closeDeleteReel() {
    setDeleteConfirmation("");
    setReelPendingDelete(null);
  }

  function updateReelForm<K extends keyof SocialReelRecord>(key: K, value: SocialReelRecord[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function persistReels(nextReels: SocialReelRecord[], successTitle: string) {
    setIsSaving(true);
    try {
      await saveSocialReels(nextReels);
      setDrafts(nextReels);
      transactionToast.success(successTitle, "Reels module was updated.");
      return true;
    } catch (error) {
      transactionToast.error("Reels save failed", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveReel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();
    const href = form.href.trim();

    if (!title) {
      transactionToast.warning("Missing title", "Add a short title for this video.");
      return;
    }

    if (!isFacebookVideoUrl(href)) {
      transactionToast.warning("Invalid Facebook link", "Use a public Facebook reel, watch, or video link.");
      return;
    }

    const timestamp = new Date().toISOString();
    const nextReel: SocialReelRecord = {
      ...form,
      id: form.id || createSocialReelId(title, drafts),
      title,
      href,
      sortOrder: Number(form.sortOrder) || drafts.length + 1,
      createdAt: form.createdAt || timestamp,
      updatedAt: timestamp,
    };

    const exists = drafts.some((reel) => reel.id === nextReel.id);
    const nextReels = exists
      ? drafts.map((reel) => (reel.id === nextReel.id ? nextReel : reel))
      : [...drafts, nextReel];

    if (await persistReels(nextReels, exists ? "Reel updated" : "Reel added")) {
      setIsEditorOpen(false);
    }
  }

  async function handleDeleteReel() {
    if (!reelPendingDelete || deleteConfirmation !== reelPendingDelete.id) return;

    const nextReels = drafts.filter((reel) => reel.id !== reelPendingDelete.id);
    if (await persistReels(nextReels, "Reel deleted")) {
      closeDeleteReel();
    }
  }

  return (
    <AdminLayout
      title="Facebook Video Links"
      eyebrow="Reels Module"
      actions={
        <Button type="button" onClick={openNewReel}>
          <Plus className="h-4 w-4" />
          Add Reel
        </Button>
      }
    >
      <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Homepage Videos
              </p>
              <h2 className="mt-1 text-2xl leading-tight text-neutral-950">
                Reels Table
              </h2>
              <div className="mt-3 grid gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:grid-cols-2">
                <span className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                  {drafts.length} total videos
                </span>
                <span className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                  {drafts.filter((reel) => reel.isPublished).length} published
                </span>
              </div>
            </div>

            <label className="flex min-h-11 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 focus-within:border-primary">
              <Search className="h-4 w-4 shrink-0 text-primary" />
              <span className="sr-only">Search reels</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                placeholder="Search videos"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-primary"
                  aria-label="Clear reel search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-neutral-950 text-xs uppercase tracking-wide text-white">
              <tr>
                <th className="w-16 px-4 py-3 font-semibold">No.</th>
                <th className="px-4 py-3 font-semibold">Video</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReels.map((reel, index) => (
                <tr key={reel.id} className="border-t border-neutral-200 transition hover:bg-neutral-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-neutral-500">
                    {(currentPage - 1) * reelPageSize + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Video className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-base font-bold uppercase tracking-normal text-neutral-950">
                          {reel.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-neutral-500">
                          {reel.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-flex rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
                        reel.isPublished
                          ? "bg-primary/10 text-primary"
                          : "bg-neutral-100 text-neutral-500",
                      ].join(" ")}
                    >
                      {reel.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => openEditReel(reel)}>
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => openDeleteReel(reel)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReels.length === 0 ? (
          <div className="border-t border-neutral-200 p-8 text-center">
            <Video className="mx-auto h-10 w-10 text-neutral-400" />
            <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
              No videos found
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Add a public Facebook reel or video link.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-neutral-200 px-4 py-3 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {firstVisibleReel}-{lastVisibleReel} of {filteredReels.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <span className="min-w-20 text-center font-semibold text-neutral-950">
              {currentPage} / {pageCount}
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={currentPage === pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-h-[92vh] max-w-[min(64rem,96vw)] overflow-y-auto p-0 sm:rounded-lg">
          <section className="overflow-hidden bg-white">
            <div className="border-b border-neutral-200 p-4 pr-12">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Reels Module
              </p>
              <DialogTitle className="mt-1 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
                {form.id ? "Edit Facebook Video" : "Add Facebook Video"}
              </DialogTitle>
            </div>

            <form onSubmit={handleSaveReel} className="grid gap-5 p-4 lg:grid-cols-[1fr_22rem]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reel-title">Title</Label>
                  <Input
                    id="reel-title"
                    value={form.title}
                    onChange={(event) => updateReelForm("title", event.currentTarget.value)}
                    placeholder="Project Reel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reel-link">Facebook Video Link</Label>
                  <Input
                    id="reel-link"
                    value={form.href}
                    onChange={(event) => updateReelForm("href", event.currentTarget.value)}
                    placeholder="https://www.facebook.com/reel/..."
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reel-id">Reel ID</Label>
                    <Input
                      id="reel-id"
                      value={generatedReelId}
                      readOnly
                      aria-describedby="reel-id-help"
                    />
                    <p id="reel-id-help" className="text-xs text-neutral-500">
                      Generated from the title and used for delete confirmation.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reel-status">Status</Label>
                    <select
                      id="reel-status"
                      value={form.isPublished ? "published" : "draft"}
                      onChange={(event) => updateReelForm("isPublished", event.currentTarget.value === "published")}
                      className="flex min-h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    <p className="text-xs text-neutral-500">
                      {form.isPublished
                        ? "Published reels appear on the homepage."
                        : "Draft reels stay hidden from the homepage."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-neutral-200 pt-4">
                  <Button type="submit" disabled={isSaving}>
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving" : "Save"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Preview
                </p>
                <div className="mx-auto aspect-[9/16] w-full max-w-[20rem] overflow-hidden rounded-md bg-white shadow-sm">
                  {isFacebookVideoUrl(form.href) ? (
                    <iframe
                      src={facebookVideoEmbedUrl(form.href)}
                      title={form.title || "Facebook video preview"}
                      width="320"
                      height="568"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center text-sm font-semibold text-neutral-500">
                      Paste a public Facebook reel or video link to preview it here.
                    </div>
                  )}
                </div>
              </div>
            </form>
          </section>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(reelPendingDelete)}
        onOpenChange={(open) => {
          if (!open && !isSaving) closeDeleteReel();
        }}
      >
        <DialogContent className="max-w-md">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
              Delete Reel
            </p>
            <DialogTitle className="mt-2 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="mt-3 leading-6">
              This permanently deletes <strong className="text-neutral-950">{reelPendingDelete?.title}</strong>.
              This action cannot be undone.
            </DialogDescription>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (isDeleteConfirmed) void handleDeleteReel();
            }}
            className="space-y-4"
          >
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-sm text-neutral-700">Type this Reel ID to confirm:</p>
              <code className="mt-2 block select-all font-mono text-sm font-bold text-neutral-950">
                {reelPendingDelete?.id}
              </code>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-reel-confirmation">Reel ID</Label>
              <Input
                id="delete-reel-confirmation"
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.currentTarget.value)}
                placeholder={reelPendingDelete?.id}
                autoComplete="off"
                autoFocus
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={isSaving} onClick={closeDeleteReel}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant={isDeleteConfirmed ? "destructive" : "outline"}
                disabled={!isDeleteConfirmed || isSaving}
              >
                <Trash2 className="h-4 w-4" />
                {isSaving ? "Deleting" : "Confirm Delete"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export function AdminProducts() {
  const products = useAdminProducts(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [view, setView] = useState<ProductView>("table");
  const [form, setForm] = useState<ProductFormData>(() => createBlankProduct());
  const [errors, setErrors] = useState<ProductValidationErrors>({});

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      return categoryMatch && productMatches(product, query);
    });

    return [...filtered].sort((first, second) => {
      if (sortBy === "Price") return first.price - second.price;
      if (sortBy === "Popular") return second.stockLeft - first.stockLeft;
      return second.updatedAt.localeCompare(first.updatedAt);
    });
  }, [category, products, query, sortBy]);

  function updateForm<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors({});
  }

  function resetForm() {
    setForm(createBlankProduct());
    setErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateProduct(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      transactionToast.warning("Product needs details", Object.values(nextErrors)[0]);
      return;
    }

    const isEditing = Boolean(form.id);

    try {
      await upsertProduct(form);
      resetForm();
      transactionToast.success(
        isEditing ? "Product updated" : "Product created",
        `${form.name || "Product"} was saved successfully.`,
      );
    } catch (error) {
      transactionToast.error("Product save failed", error);
    }
  }

  async function togglePublish(product: AdminProduct) {
    const nextProduct = { ...product, isPublished: !product.isPublished };
    const previousProducts = products;

    saveAdminProducts(
      products.map((item) =>
        item.id === product.id
          ? { ...nextProduct, updatedAt: new Date().toISOString() }
          : item,
      ),
    );

    try {
      await upsertProduct(productToFormData(nextProduct));
      transactionToast.success(
        nextProduct.isPublished ? "Product published" : "Product drafted",
        product.name,
      );
    } catch (error) {
      saveAdminProducts(previousProducts);
      transactionToast.error("Publish update failed", error);
    }
  }

  async function handleDeleteProduct(product: AdminProduct) {
    try {
      await deleteProduct(product.id);
      transactionToast.success("Product deleted", product.name);
    } catch (error) {
      transactionToast.error("Product delete failed", error);
    }
  }

  const previewProduct = formDataToProduct(form, products.find((product) => product.id === form.id));

  return (
    <AdminLayout
      title="Product / Shop List"
      eyebrow="Priority Module"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setView(view === "table" ? "cards" : "table")}>
            {view === "table" ? "Card Preview" : "Table View"}
          </Button>
          <Button type="button" onClick={resetForm}>
            <Plus className="h-4 w-4" />
            New Product
          </Button>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <section className="min-w-0">
          <div className="mb-4 grid gap-3 rounded-md border border-neutral-200 bg-white p-3 shadow-sm md:grid-cols-[1fr_auto_auto]">
            <label className="flex min-h-10 items-center gap-2 border border-neutral-200 bg-white px-3">
              <Search className="h-4 w-4 text-primary" />
              <span className="sr-only">Search products</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Search products"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.currentTarget.value)}
              className="min-h-10 border border-neutral-200 bg-white px-3 text-sm font-semibold"
            >
              <option>All</option>
              {adminProductCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.currentTarget.value)}
              className="min-h-10 border border-neutral-200 bg-white px-3 text-sm font-semibold"
            >
              <option>Newest</option>
              <option>Popular</option>
              <option>Price</option>
            </select>
          </div>

          {view === "cards" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-2">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-neutral-950 text-white">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Published</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProducts.map((product) => (
                      <tr key={product.id} className="border-t border-neutral-200">
                        <td className="px-4 py-3">
                          <p className="font-bold text-neutral-950">{product.name}</p>
                          <p className="text-xs text-neutral-500">{product.usesLine}</p>
                        </td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3 font-bold text-primary">{product.priceLabel}</td>
                        <td className="px-4 py-3">
                          <span className={product.stockLeft <= 7 ? "font-bold text-red-700" : ""}>
                            {product.stockLeft} left
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => togglePublish(product)}
                            className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                              product.isPublished
                                ? "bg-primary/10 text-primary"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            {product.isPublished ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => setForm(productToFormData(product))}>
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button type="button" size="sm" variant="destructive" onClick={() => void handleDeleteProduct(product)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {visibleProducts.length === 0 ? (
                <div className="p-8 text-center text-sm text-neutral-600">No products found.</div>
              ) : null}
            </div>
          )}
        </section>

        <aside className="border border-neutral-200 bg-white p-4 shadow-sm">
          <h2 className="text-xl">{form.id ? "Edit Product" : "Add Product"}</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Name</Label>
              <Input id="product-name" value={form.name} onChange={(event) => updateForm("name", event.currentTarget.value)} />
              {errors.name ? <p className="text-xs font-semibold text-red-700">{errors.name}</p> : null}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="product-category">Category</Label>
                <select
                  id="product-category"
                  value={form.category}
                  onChange={(event) => updateForm("category", event.currentTarget.value as ProductFormData["category"])}
                  className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
                >
                  {adminProductCategories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-size">Size</Label>
                <select
                  id="product-size"
                  value={form.size}
                  onChange={(event) => updateForm("size", event.currentTarget.value as ProductFormData["size"])}
                  className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
                >
                  {shopSizes.map((size) => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="product-price">Price</Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => updateForm("price", Number(event.currentTarget.value))}
                />
                {errors.price ? <p className="text-xs font-semibold text-red-700">{errors.price}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-stock">Stock</Label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  value={form.stockLeft}
                  onChange={(event) => updateForm("stockLeft", Number(event.currentTarget.value))}
                />
                {errors.stockLeft ? <p className="text-xs font-semibold text-red-700">{errors.stockLeft}</p> : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-badge">Badge</Label>
              <select
                id="product-badge"
                value={form.badge}
                onChange={(event) => updateForm("badge", event.currentTarget.value as ProductFormData["badge"])}
                className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
              >
                <option value="">None</option>
                <option>Best Seller</option>
                <option>New Arrival</option>
                <option>Pro Grade</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-usage">Para sa</Label>
              <Input id="product-usage" value={form.usesLine} onChange={(event) => updateForm("usesLine", event.currentTarget.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-image">Image URL</Label>
              <Input id="product-image" value={form.imageUrl} onChange={(event) => updateForm("imageUrl", event.currentTarget.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-shopee">Shopee URL</Label>
              <Input id="product-shopee" value={form.shopeeUrl} onChange={(event) => updateForm("shopeeUrl", event.currentTarget.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">Description</Label>
              <textarea
                id="product-description"
                value={form.description}
                onChange={(event) => updateForm("description", event.currentTarget.value)}
                className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => updateForm("isPublished", event.currentTarget.checked)}
                className="h-4 w-4 accent-primary"
              />
              Publish on public shop
            </Label>
            <div className="overflow-hidden rounded-md border border-neutral-200">
              <ProductCard product={previewProduct} />
            </div>
            <Button type="submit" className="w-full">
              <Save className="h-4 w-4" />
              Save Product
            </Button>
          </form>
        </aside>
      </div>
    </AdminLayout>
  );
}

function exportEmployees(employees: EmployeeRecord[]) {
  const rows = [
    ["employeeId", "name", "position", "department", "orgGroup"],
    ...employees
      .filter((employee) => !employee.deletedAt)
      .map((employee) => [
        employee.employeeId,
        employee.name,
        employee.position,
        employee.department,
        employee.orgGroup,
      ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "technoshine-employee-id-list.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AdminEmployees() {
  const employees = useEmployees();
  const activeEmployees = employees.filter((employee) => !employee.deletedAt);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [form, setForm] = useState<EmployeeRecord>(blankEmployee);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const departments = ["All", ...Array.from(new Set(activeEmployees.map((employee) => employee.department).filter(Boolean)))];
  const visibleEmployees = activeEmployees.filter((employee) => {
    const matchesDepartment = department === "All" || employee.department === department;
    const orgGroupLabel = orgChartGroups.find((group) => group.value === employee.orgGroup)?.label ?? employee.orgGroup;
    const matchesQuery = [employee.name, employee.position, employee.employeeId, employee.department, orgGroupLabel]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesDepartment && matchesQuery;
  });
  const pageCount = Math.max(1, Math.ceil(visibleEmployees.length / employeePageSize));
  const currentPage = Math.min(page, pageCount);
  const paginatedEmployees = visibleEmployees.slice((currentPage - 1) * employeePageSize, currentPage * employeePageSize);
  const firstVisibleEmployee = visibleEmployees.length === 0 ? 0 : (currentPage - 1) * employeePageSize + 1;
  const lastVisibleEmployee = Math.min(currentPage * employeePageSize, visibleEmployees.length);

  useEffect(() => {
    setPage(1);
  }, [department, query]);

  function resetForm() {
    setForm(blankEmployee);
  }

  function openNewEmployeeModal() {
    setForm(blankEmployee);
    setIsModalOpen(true);
  }

  function openEditEmployeeModal(employee: EmployeeRecord) {
    setForm(employee);
    setIsModalOpen(true);
  }

  function closeEmployeeModal() {
    setIsModalOpen(false);
    resetForm();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.employeeId.trim()) {
      transactionToast.warning("Employee needs details", "Name and employee ID are required.");
      return;
    }

    const id = form.id || form.employeeId;
    const nextEmployee = {
      ...form,
      id,
      employeeId: form.employeeId.trim(),
      name: form.name.trim(),
      position: form.position.trim(),
      department: form.department.trim(),
      orgGroup: form.orgGroup || "staff",
    };
    const exists = employees.some((employee) => employee.id === id);

    try {
      await saveEmployees(exists ? employees.map((employee) => (employee.id === id ? nextEmployee : employee)) : [nextEmployee, ...employees]);
      closeEmployeeModal();
      transactionToast.success(
        exists ? "Employee updated" : "Employee added",
        `${nextEmployee.name} was saved successfully.`,
      );
    } catch (error) {
      transactionToast.error("Employee save failed", error);
    }
  }

  async function softDelete(employeeId: string) {
    try {
      await deleteEmployee(employeeId);
      transactionToast.success("Employee deleted", employeeId);
    } catch (error) {
      transactionToast.error("Employee delete failed", error);
    }
  }

  return (
    <AdminLayout
      title="Employees"
      eyebrow="HR Records"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportEmployees(activeEmployees)}>
            <Download className="h-4 w-4" />
            Export ID List
          </Button>
          <Button type="button" onClick={openNewEmployeeModal}>
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      }
    >
      <section>
        <div className="mb-4 grid gap-3 border border-neutral-200 bg-white p-3 md:grid-cols-[1fr_auto]">
          <label className="flex min-h-10 items-center gap-2 border border-neutral-200 px-3">
            <Search className="h-4 w-4 text-primary" />
            <span className="sr-only">Search employees</span>
            <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} className="flex-1 bg-transparent text-sm outline-none" placeholder="Search employees" />
          </label>
          <select value={department} onChange={(event) => setDepartment(event.currentTarget.value)} className="min-h-10 border border-neutral-200 px-3 text-sm font-semibold">
            {departments.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden border border-neutral-200 bg-white">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="bg-neutral-950 text-white">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Org Group</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="border-t border-neutral-200">
                  <td className="px-4 py-3">
                    <p className="font-bold">{employee.name}</p>
                    <p className="text-xs text-neutral-500">{employee.employeeId}</p>
                  </td>
                  <td className="px-4 py-3">{employee.position}</td>
                  <td className="px-4 py-3">{employee.department}</td>
                  <td className="px-4 py-3">
                    {orgChartGroups.find((group) => group.value === employee.orgGroup)?.label ?? "Staff"}
                  </td>
                  <td className="px-4 py-3">
                    {activeEmployees.find((manager) => manager.employeeId === employee.reportsTo)?.name || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => openEditEmployeeModal(employee)}>
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => void softDelete(employee.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-neutral-500">
                    No employees found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <div className="flex flex-col gap-3 border-t border-neutral-200 px-4 py-3 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {firstVisibleEmployee}-{lastVisibleEmployee} of {visibleEmployees.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <span className="min-w-20 text-center font-semibold text-neutral-950">
                {currentPage} / {pageCount}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={currentPage === pageCount}
                onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
          <div className="max-h-full w-full max-w-lg overflow-y-auto border border-neutral-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Employee Record
                </p>
                <h2 className="mt-1 text-2xl">{form.id ? "Edit Employee" : "Add Employee"}</h2>
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={closeEmployeeModal} aria-label="Close employee form">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="employee-name">Name</Label>
                <Input id="employee-name" value={form.name} placeholder="Name" onChange={(event) => setForm({ ...form, name: event.currentTarget.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-id">Employee ID</Label>
                <Input id="employee-id" value={form.employeeId} placeholder="Employee ID" onChange={(event) => setForm({ ...form, employeeId: event.currentTarget.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employee-position">Role / Position</Label>
                  <Input id="employee-position" value={form.position} placeholder="Position" onChange={(event) => setForm({ ...form, position: event.currentTarget.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-department">Department / Column</Label>
                  <Input id="employee-department" value={form.department} placeholder="Department" onChange={(event) => setForm({ ...form, department: event.currentTarget.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-org-group">Org Chart Group</Label>
                <select
                  id="employee-org-group"
                  value={form.orgGroup}
                  onChange={(event) =>
                    setForm({ ...form, orgGroup: event.currentTarget.value as EmployeeRecord["orgGroup"] })
                  }
                  className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
                >
                  {orgChartGroups.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-manager">Manager / Reports To</Label>
                <select
                  id="employee-manager"
                  value={form.reportsTo}
                  onChange={(event) => setForm({ ...form, reportsTo: event.currentTarget.value })}
                  className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm"
                >
                  <option value="">No manager</option>
                  {activeEmployees
                    .filter((employee) => employee.employeeId !== form.employeeId)
                    .map((employee) => (
                      <option key={employee.id} value={employee.employeeId}>
                        {employee.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-photo">Photo URL</Label>
                <Input
                  id="employee-photo"
                  value={form.photoUrl}
                  placeholder="team/President.jpg"
                  onChange={(event) => setForm({ ...form, photoUrl: event.currentTarget.value })}
                />
              </div>
              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={closeEmployeeModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4" />
                  Save Employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}

export function AdminContent() {
  const sections = useContentSections();
  const [drafts, setDrafts] = useState<ContentSection[]>(sections);

  useEffect(() => {
    setDrafts(sections);
  }, [sections]);

  function updateSection(id: string, updates: Partial<ContentSection>) {
    setDrafts((current) => current.map((section) => (section.id === id ? { ...section, ...updates } : section)));
  }

  function addSection() {
    const id = `section-${Date.now()}`;
    setDrafts((current) => [
      ...current,
      { id, key: "custom.section", title: "New Section", body: "", updatedAt: new Date().toISOString() },
    ]);
  }

  async function saveAll() {
    try {
      await saveContentSections(drafts.map((section) => ({ ...section, updatedAt: new Date().toISOString() })));
      transactionToast.success("Content saved", "Website content sections were updated.");
    } catch (error) {
      transactionToast.error("Content save failed", error);
    }
  }

  return (
    <AdminLayout
      title="Website Content"
      eyebrow="Marketing Content"
      actions={
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={addSection}>
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
          <Button type="button" onClick={saveAll}>
            <Save className="h-4 w-4" />
            Save All
          </Button>
        </div>
      }
    >
      <div className="grid gap-4">
        {drafts.map((section) => (
          <section key={section.id} className="border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[16rem_1fr]">
              <div className="space-y-3">
                <Label htmlFor={`${section.id}-key`}>Content Key</Label>
                <Input id={`${section.id}-key`} value={section.key} onChange={(event) => updateSection(section.id, { key: event.currentTarget.value })} />
                <Label htmlFor={`${section.id}-title`}>Title</Label>
                <Input id={`${section.id}-title`} value={section.title} onChange={(event) => updateSection(section.id, { title: event.currentTarget.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${section.id}-body`}>Body</Label>
                <textarea
                  id={`${section.id}-body`}
                  value={section.body}
                  onChange={(event) => updateSection(section.id, { body: event.currentTarget.value })}
                  className="min-h-40 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                />
                <p className="text-xs text-neutral-500">Last saved: {new Date(section.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </AdminLayout>
  );
}
