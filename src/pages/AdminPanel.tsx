import { Component, FormEvent, lazy, ReactNode, Suspense, useEffect, useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import {
  Activity,
  Boxes,
  ChevronLeft,
  BriefcaseBusiness,
  ChevronRight,
  Download,
  Edit3,
  FileText,
  ImageOff,
  Images,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
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
import { ProductVisual } from "@/components/shop/ProductVisual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminProductCategories,
  createBlankProduct,
  deleteEmployee,
  deleteGalleryImage,
  deleteProduct,
  deleteTestimonial,
  defaultHomepageHeroBackground,
  formDataToProduct,
  getContentSectionBody,
  homepageHeroBackgroundContentKey,
  logoutAdmin,
  orgChartGroups,
  productToFormData,
  saveContentSections,
  saveEmployees,
  saveGalleryImage,
  saveSocialReels,
  saveServicePages,
  saveTestimonial,
  saveAdminProducts,
  uploadContentImageFile,
  uploadGalleryImageFile,
  uploadServiceImage,
  upsertProduct,
  useAdminCountsState,
  useAdminProducts,
  useAdminSession,
  useContentSections,
  useEmployees,
  useGalleryImagesState,
  useServicePagesState,
  useSocialReels,
  useTestimonialsState,
  validateProduct,
  type AdminProduct,
  type ContentSection,
  type EmployeeRecord,
  type GalleryImageRecord,
  type ProductFormData,
  type ProductValidationErrors,
  type ServiceImageRecord,
  type ServicePageRecord,
  type SocialReelRecord,
  type TestimonialRecord,
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
const adminTablePageSize = 8;
const adminSidebarPreferenceKey = "technoshine:admin-sidebar:v1";
const adminVersion = "0.25";
const adminActionButtonStyles = {
  edit:
    "!border-sky-300 bg-sky-50 text-sky-700 shadow-sm hover:!border-sky-400 hover:bg-sky-100 hover:text-sky-800 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:shadow-none",
  draft:
    "!border-slate-300 bg-slate-100 text-slate-700 shadow-sm hover:!border-slate-400 hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:shadow-none",
  publish:
    "!border-emerald-700 bg-emerald-700 text-white shadow-sm hover:!border-emerald-800 hover:bg-emerald-800 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:shadow-none",
  delete:
    "!border-red-700 bg-red-700 text-white shadow-sm hover:!border-red-800 hover:bg-red-800 hover:text-white focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:shadow-none",
} as const;

function getTablePagination(totalItems: number, requestedPage: number) {
  const pageCount = Math.max(1, Math.ceil(totalItems / adminTablePageSize));
  const currentPage = Math.min(Math.max(1, requestedPage), pageCount);
  const startIndex = (currentPage - 1) * adminTablePageSize;
  const endIndex = Math.min(startIndex + adminTablePageSize, totalItems);

  return {
    currentPage,
    endIndex,
    firstItem: totalItems === 0 ? 0 : startIndex + 1,
    lastItem: endIndex,
    pageCount,
    startIndex,
  };
}

function loadAdminSidebarCollapsed() {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(adminSidebarPreferenceKey) === "collapsed";
  } catch {
    return false;
  }
}

function saveAdminSidebarCollapsed(isCollapsed: boolean) {
  try {
    window.localStorage.setItem(
      adminSidebarPreferenceKey,
      isCollapsed ? "collapsed" : "expanded",
    );
  } catch {
    // The sidebar remains usable when storage is unavailable or blocked.
  }
}

const loadAdminDashboardChart = () => import("@/components/admin/AdminDashboardChart");
const AdminDashboardChart = lazy(loadAdminDashboardChart);

const navItems = [
  { label: "Dashboard", href: "/company/admin/dashboard", icon: LayoutDashboard },
  { label: "Services", href: "/company/admin/services", icon: Images },
  { label: "Gallery", href: "/company/admin/gallery", icon: Images },
  { label: "Reels", href: "/company/admin/reels", icon: Video },
  { label: "Reviews", href: "/company/admin/reviews", icon: MessageSquareQuote },
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
  collapsed = false,
  id,
  location,
  className,
  onNavigate,
}: {
  collapsed?: boolean;
  id?: string;
  location: string;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <nav id={id} aria-label="Admin navigation" className={className}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = isAdminNavItemActive(location, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={`flex min-h-12 items-center rounded-lg text-sm font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
              collapsed ? "justify-center px-2" : "gap-3 px-3.5"
            } ${
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
            <span className={collapsed ? "sr-only" : undefined}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function PaginationControls({
  currentPage,
  firstItem,
  itemLabel,
  lastItem,
  onPageChange,
  pageCount,
  totalItems,
}: {
  currentPage: number;
  firstItem: number;
  itemLabel: string;
  lastItem: number;
  onPageChange: (page: number) => void;
  pageCount: number;
  totalItems: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 px-4 py-3 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {firstItem}-{lastItem} of {totalItems} {itemLabel}
      </p>
      <nav
        aria-label={`${itemLabel} pagination`}
        className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start"
      >
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={currentPage === 1}
          aria-label={`Previous ${itemLabel} page`}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Prev
        </Button>
        <span
          className="min-w-24 text-center font-semibold tabular-nums text-neutral-950"
          aria-live="polite"
          aria-atomic="true"
        >
          Page {currentPage} of {pageCount}
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={currentPage === pageCount}
          aria-label={`Next ${itemLabel} page`}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </nav>
    </div>
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
  isPublished: false,
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(loadAdminSidebarCollapsed);
  const activeNavItem = navItems.find((item) => isAdminNavItemActive(location, item.href));

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "TECHNOSHINE | ADMIN";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    saveAdminSidebarCollapsed(isSidebarCollapsed);
  }, [isSidebarCollapsed]);

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
      <main className="min-h-dvh bg-[#f5f6f6] text-neutral-950">
        <div
          className={`grid min-h-dvh transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none ${
            isSidebarCollapsed
              ? "lg:grid-cols-[5.5rem_minmax(0,1fr)]"
              : "lg:grid-cols-[17rem_minmax(0,1fr)]"
          }`}
        >
          <aside
            id="admin-desktop-sidebar"
            className={`sticky top-0 z-40 min-w-0 border-b border-neutral-800 bg-neutral-950 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:h-dvh lg:max-h-dvh lg:min-h-0 lg:flex-col lg:overflow-hidden lg:border-b-0 lg:border-r lg:px-4 lg:py-5 lg:transition-[width] lg:duration-200 lg:ease-out motion-reduce:transition-none ${
              isSidebarCollapsed ? "lg:w-[5.5rem]" : "lg:w-[17rem]"
            }`}
          >
            <div
              className={`flex h-16 items-center justify-between gap-4 px-4 lg:h-auto lg:shrink-0 lg:px-0 ${
                isSidebarCollapsed ? "lg:justify-center" : ""
              }`}
            >
              <div className={`min-w-0 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
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

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="hidden h-11 w-11 shrink-0 border-white/15 text-white hover:bg-white/10 focus-visible:ring-primary lg:inline-flex"
                aria-controls="admin-desktop-sidebar"
                aria-expanded={!isSidebarCollapsed}
                aria-label={isSidebarCollapsed ? "Expand admin sidebar" : "Collapse admin sidebar"}
                title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
                onClick={() => setIsSidebarCollapsed((current) => !current)}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>

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
                  className="flex h-dvh max-h-dvh w-[min(20rem,86vw)] flex-col gap-0 overflow-hidden border-neutral-800 bg-neutral-950 p-0 text-white sm:max-w-xs [&>button]:right-3 [&>button]:top-3 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-md [&>button]:text-white [&>button]:hover:bg-white/10"
                >
                  <SheetHeader className="shrink-0 border-b border-neutral-800 px-5 py-5 text-left">
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
                    className="grid min-h-0 flex-1 content-start gap-2 overflow-y-auto overscroll-contain px-4 py-5"
                  />

                  <div className="shrink-0 border-t border-neutral-800 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-11 w-full justify-start border-white/15 text-white hover:bg-white/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </Button>
                    <p className="mt-2 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                      Version {adminVersion}
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <AdminNavLinks
              id="admin-desktop-navigation"
              collapsed={isSidebarCollapsed}
              location={location}
              className={`mt-8 hidden min-h-0 flex-1 content-start gap-2 overflow-y-auto overscroll-contain pb-2 lg:grid ${
                isSidebarCollapsed ? "pr-0" : "pr-1"
              }`}
            />

            <div className="hidden shrink-0 border-t border-neutral-800 pt-4 lg:block">
              <Button
                type="button"
                variant="ghost"
                className={`min-h-11 w-full border-white/15 text-white hover:bg-white/10 ${
                  isSidebarCollapsed ? "justify-center px-0" : "justify-start"
                }`}
                onClick={handleLogout}
                title={isSidebarCollapsed ? "Logout" : undefined}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className={isSidebarCollapsed ? "sr-only" : undefined}>Logout</span>
              </Button>
              <p className="mt-2 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                {isSidebarCollapsed ? `v${adminVersion}` : `Version ${adminVersion}`}
              </p>
            </div>
          </aside>

          <section className="min-w-0 lg:col-start-2">
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
  href,
  label,
  loading,
  value,
  icon: Icon,
}: {
  href: string;
  label: string;
  loading: boolean;
  value: number | null;
  icon: typeof Boxes;
}) {
  return (
    <Link
      href={href}
      aria-busy={value === null && loading}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Card
        component="article"
        variant="outlined"
        className="h-full !overflow-hidden !rounded-xl !border-neutral-200 !bg-white !shadow-sm transition-[border-color,box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:!border-primary/60 group-hover:!shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
      >
        <CardMedia
          component="div"
          aria-hidden="true"
          className="h-1.5 bg-gradient-to-r from-primary via-orange-400 to-neutral-950"
        />
        <CardContent className="!p-5 !pb-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</p>
              {value === null && loading ? (
                <span className="mt-3 block h-9 w-14 motion-safe:animate-pulse rounded bg-neutral-200" />
              ) : (
                <p className="mt-2 font-display text-4xl font-bold text-neutral-950">{value ?? "--"}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-neutral-950">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>
        </CardContent>
        <CardActions className="!px-5 !pb-4 !pt-0">
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400 transition-colors group-hover:text-primary">
            Open
            <ChevronRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </CardActions>
      </Card>
    </Link>
  );
}

function AdminDashboardChartSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard chart"
      className="space-y-5 motion-safe:animate-pulse"
    >
      <div className="grid min-h-[27rem] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="p-5 sm:p-6">
          <div className="h-3 w-40 rounded bg-neutral-200" />
          <div className="mt-4 h-8 w-64 max-w-full rounded bg-neutral-200" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-neutral-100" />
          <div className="mt-8 grid gap-5">
            {[72, 86, 54, 68, 44].map((width) => (
              <div key={width} className="flex items-center gap-4">
                <div className="h-3 w-20 rounded bg-neutral-100" />
                <div className="h-7 rounded bg-primary/15" style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-neutral-950 p-6">
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="mt-10 h-12 w-24 rounded bg-white/10" />
          <div className="mt-10 h-2 w-full rounded bg-white/10" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <div key={item} className="min-h-[23rem] rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="h-2 w-24 rounded bg-primary/15" />
            <div className="mt-4 h-6 w-40 rounded bg-neutral-200" />
            <div className="mt-3 h-4 w-full rounded bg-neutral-100" />
            <div className="mt-2 h-4 w-4/5 rounded bg-neutral-100" />
            <div className="mx-auto mt-8 h-44 w-44 rounded-full border-[20px] border-neutral-100" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading dashboard chart</span>
    </div>
  );
}

class AdminDashboardChartErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <section
          role="alert"
          className="flex min-h-[18rem] flex-col items-center justify-center border border-amber-200 bg-amber-50 px-6 text-center shadow-sm"
        >
          <ServerCrash className="h-8 w-8 text-amber-600" aria-hidden="true" />
          <h2 className="mt-4 text-xl text-neutral-950">Dashboard chart could not be loaded.</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600">
            Reload this page to fetch the latest dashboard chart files.
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}

export function AdminDashboard() {
  const { counts, error, hasData, isFetching, isLoading, lastUpdatedAt } = useAdminCountsState();
  const metricCounts = hasData ? counts : null;

  useEffect(() => {
    void loadAdminDashboardChart().catch(() => undefined);
  }, []);

  return (
    <AdminLayout title="Admin Dashboard" eyebrow="Company Admin">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          href="/company/admin/dashboard"
          label="Live Viewers"
          loading={isLoading}
          value={metricCounts?.liveVisitors ?? null}
          icon={Activity}
        />
        <MetricCard
          href="/company/admin/employees"
          label="Employees"
          loading={isLoading}
          value={metricCounts?.employees ?? null}
          icon={Users}
        />
        <MetricCard
          href="/company/admin/services"
          label="Services"
          loading={isLoading}
          value={metricCounts?.services ?? null}
          icon={Images}
        />
        <MetricCard
          href="/company/admin/gallery"
          label="Gallery Images"
          loading={isLoading}
          value={metricCounts?.galleryImages ?? null}
          icon={Images}
        />
        <MetricCard
          href="/company/admin/reels"
          label="Reels"
          loading={isLoading}
          value={metricCounts?.reels ?? null}
          icon={Video}
        />
        <MetricCard
          href="/company/admin/reviews"
          label="Reviews"
          loading={isLoading}
          value={metricCounts?.testimonials ?? null}
          icon={MessageSquareQuote}
        />
        <MetricCard
          href="/company/admin/products"
          label="Products"
          loading={isLoading}
          value={metricCounts?.products ?? null}
          icon={ShoppingBag}
        />
        <MetricCard
          href="/company/admin/products"
          label="Published"
          loading={isLoading}
          value={metricCounts?.publishedProducts ?? null}
          icon={Boxes}
        />
        <MetricCard
          href="/company/admin/content"
          label="Content Sections"
          loading={isLoading}
          value={metricCounts?.contentSections ?? null}
          icon={FileText}
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <AdminDashboardChartSkeleton />
        ) : (
          <AdminDashboardChartErrorBoundary>
            <Suspense fallback={<AdminDashboardChartSkeleton />}>
              <AdminDashboardChart
                counts={counts}
                hasData={hasData}
                hasError={Boolean(error)}
                isRefreshing={isFetching}
                lastUpdatedAt={lastUpdatedAt}
              />
            </Suspense>
          </AdminDashboardChartErrorBoundary>
        )}
      </div>
    </AdminLayout>
  );
}

function AdminProductMediaCard({
  onDelete,
  onEdit,
  onTogglePublish,
  product,
}: {
  onDelete: (product: AdminProduct) => void | Promise<void>;
  onEdit: (product: AdminProduct) => void;
  onTogglePublish: (product: AdminProduct) => void | Promise<void>;
  product: AdminProduct;
}) {
  return (
    <Card
      component="article"
      variant="outlined"
      className="group flex h-full flex-col !overflow-hidden !rounded-xl !border-neutral-200 !bg-white !shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:!border-primary/50 hover:!shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
    >
      <CardMedia component="div" className="relative aspect-[4/3] overflow-hidden bg-[#fff8f2]">
        <ProductVisual product={product} compact />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-gradient-to-b from-black/45 to-transparent p-3">
          <span className="rounded-full bg-white/95 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-800 shadow-sm">
            {product.category}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm ${
              product.isPublished
                ? "bg-emerald-700 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {product.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </CardMedia>

      <CardContent className="flex flex-1 flex-col !p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          {product.brand}
        </p>
        <h3 className="mt-1 text-lg leading-snug text-neutral-950">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">{product.usesLine}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="font-display text-2xl font-bold text-primary">{product.priceLabel}</p>
          <p className={`text-xs font-bold ${product.stockLeft <= 7 ? "text-red-700" : "text-neutral-500"}`}>
            {product.stockLeft} left
          </p>
        </div>
      </CardContent>

      <CardActions className="!grid !grid-cols-[1fr_1fr_auto] !gap-2 !border-t !border-neutral-200 !bg-neutral-50 !p-3">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={`w-full ${adminActionButtonStyles.edit}`}
          onClick={() => onEdit(product)}
        >
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          Edit
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={`w-full ${
            product.isPublished
              ? adminActionButtonStyles.draft
              : adminActionButtonStyles.publish
          }`}
          onClick={() => void onTogglePublish(product)}
        >
          {product.isPublished ? "Unpublish" : "Publish"}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className={adminActionButtonStyles.delete}
          aria-label={`Delete ${product.name}`}
          title={`Delete ${product.name}`}
          onClick={() => void onDelete(product)}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </CardActions>
    </Card>
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

function createTestimonialId(clientName: string, testimonials: TestimonialRecord[]) {
  const normalizedClientName = clientName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
  const baseId = normalizedClientName || "testimonial";
  const usedIds = new Set(testimonials.map((testimonial) => testimonial.id));

  if (!usedIds.has(baseId)) return baseId;

  let suffix = 2;
  while (usedIds.has(`${baseId.slice(0, 58)}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseId.slice(0, 58)}-${suffix}`;
}

function createBlankTestimonial(nextOrder: number): TestimonialRecord {
  const timestamp = new Date().toISOString();

  return {
    id: "",
    quote: "",
    clientName: "",
    rating: 5,
    sortOrder: nextOrder,
    isPublished: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function testimonialMatchesSearch(testimonial: TestimonialRecord, query: string) {
  const search = query.trim().toLowerCase();
  if (!search) return true;

  return [testimonial.id, testimonial.quote, testimonial.clientName]
    .join(" ")
    .toLowerCase()
    .includes(search);
}

function createGalleryImageId(title: string, images: GalleryImageRecord[]) {
  const normalizedTitle = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
    .replace(/-+$/g, "");
  const baseId = normalizedTitle || "gallery-image";
  const usedIds = new Set(images.map((image) => image.id));

  if (!usedIds.has(baseId)) return baseId;

  let suffix = 2;
  while (usedIds.has(`${baseId.slice(0, 58)}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseId.slice(0, 58)}-${suffix}`;
}

function createBlankGalleryImage(nextOrder: number): GalleryImageRecord {
  const timestamp = new Date().toISOString();

  return {
    id: "",
    title: "",
    location: "",
    imageUrl: "",
    altText: "",
    sortOrder: nextOrder,
    isFeatured: false,
    isHero: false,
    isPublished: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function galleryImageMatchesSearch(image: GalleryImageRecord, query: string) {
  const search = query.trim().toLowerCase();
  if (!search) return true;

  return [image.id, image.title, image.location, image.altText]
    .join(" ")
    .toLowerCase()
    .includes(search);
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
  const [servicePage, setServicePage] = useState(1);
  const [mediaPage, setMediaPage] = useState(1);

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
  const servicePagination = getTablePagination(filteredServices.length, servicePage);
  const paginatedServices = filteredServices.slice(
    servicePagination.startIndex,
    servicePagination.endIndex,
  );
  const serviceMediaRows = useMemo(
    () =>
      selectedService
        ? [
            { kind: "hero" as const },
            ...selectedService.images.map((image, imageIndex) => ({
              kind: "gallery" as const,
              image,
              imageIndex,
            })),
          ]
        : [],
    [selectedService],
  );
  const mediaPagination = getTablePagination(serviceMediaRows.length, mediaPage);
  const paginatedServiceMediaRows = serviceMediaRows.slice(
    mediaPagination.startIndex,
    mediaPagination.endIndex,
  );

  useEffect(() => {
    if (!filteredServices.length) return;
    if (filteredServices.some((service) => service.slug === selectedSlug)) return;
    setSelectedSlug(filteredServices[0].slug);
  }, [filteredServices, selectedSlug]);

  useEffect(() => {
    setServicePage(1);
  }, [serviceQuery]);

  useEffect(() => {
    setMediaPage(1);
  }, [selectedSlug]);

  useEffect(() => {
    setServicePage((current) => Math.min(current, servicePagination.pageCount));
  }, [servicePagination.pageCount]);

  useEffect(() => {
    setMediaPage((current) => Math.min(current, mediaPagination.pageCount));
  }, [mediaPagination.pageCount]);

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
      transactionToast.upload("Image uploaded to draft", "Changes saved to draft. Click Save to publish.");
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
            <table className="w-full min-w-[820px] text-left text-sm">
              <caption className="sr-only">Services directory</caption>
              <thead className="bg-neutral-950 text-xs uppercase tracking-wide text-white">
                <tr>
                  <th scope="col" className="w-16 px-4 py-3 font-semibold">No.</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Preview</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Service</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Slug</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Gallery</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.map((service, index) => {
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
                      <td className="px-4 py-3 font-mono text-xs font-bold text-neutral-500">
                        {servicePagination.startIndex + index + 1}
                      </td>
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
                            variant="outline"
                            className={adminActionButtonStyles.edit}
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

          <PaginationControls
            currentPage={servicePagination.currentPage}
            firstItem={servicePagination.firstItem}
            itemLabel="services"
            lastItem={servicePagination.lastItem}
            onPageChange={setServicePage}
            pageCount={servicePagination.pageCount}
            totalItems={filteredServices.length}
          />
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
                              transactionToast.upload("Compression complete", `${Math.round(usedFile.size/1024/1024)}MB`);
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
                                transactionToast.upload("Compression complete", `${Math.round(usedFile.size/1024/1024)}MB`);
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
                  <table className="w-full min-w-[880px] border-collapse bg-white text-sm">
                    <caption className="sr-only">
                      Image rows for {selectedService.title}
                    </caption>
                    <thead className="bg-neutral-950 text-left text-xs uppercase tracking-wide text-white">
                      <tr>
                        <th scope="col" className="w-16 px-3 py-3 font-semibold">No.</th>
                        <th scope="col" className="w-28 px-3 py-3 font-semibold">Type</th>
                        <th scope="col" className="w-36 px-3 py-3 font-semibold">Preview</th>
                        <th scope="col" className="w-48 px-3 py-3 font-semibold">Caption</th>
                        <th scope="col" className="w-48 px-3 py-3 font-semibold">Alt Text</th>
                        <th scope="col" className="w-48 px-3 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedServiceMediaRows.map((row, index) => {
                        const rowNumber = mediaPagination.startIndex + index + 1;

                        if (row.kind === "hero") {
                          return (
                            <tr
                              key={`${selectedService.slug}:hero`}
                              className="align-top transition hover:bg-neutral-50"
                            >
                              <td className="border-b border-neutral-200 px-3 py-3 font-mono text-xs font-bold text-neutral-500">
                                {rowNumber}
                              </td>
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
                                  {uploadingKey === `${selectedService.slug}:hero`
                                    ? "Uploading"
                                    : "Upload"}
                                </label>
                              </td>
                            </tr>
                          );
                        }

                        const { image, imageIndex } = row;
                        const rowUploadKey = `${selectedService.slug}:gallery:${image.id}`;

                        return (
                          <tr key={image.id} className="align-top transition hover:bg-neutral-50">
                            <td className="border-b border-neutral-200 px-3 py-3 font-mono text-xs font-bold text-neutral-500">
                              {rowNumber}
                            </td>
                            <td className="border-b border-neutral-200 px-3 py-3">
                              <span className="font-mono text-xs font-bold text-neutral-500">
                                Gallery #{imageIndex + 1}
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
                              <Label
                                htmlFor={`${selectedService.slug}-${image.id}-caption`}
                                className="sr-only"
                              >
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
                              <Label
                                htmlFor={`${selectedService.slug}-${image.id}-alt`}
                                className="sr-only"
                              >
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
                                        transactionToast.error(
                                          "File too large",
                                          "Files 200MB+ are not accepted. Please reduce size.",
                                        );
                                        event.currentTarget.value = "";
                                        return;
                                      }
                                      let usedFile = file;
                                      if (file.size > 10 * 1024 * 1024) {
                                        transactionToast.info(
                                          "Compressing image",
                                          "Reducing image size before upload...",
                                        );
                                        try {
                                          usedFile = await compressImageFile(file);
                                          transactionToast.upload(
                                            "Compression complete",
                                            `${Math.round(usedFile.size / 1024 / 1024)}MB`,
                                          );
                                        } catch (error) {
                                          transactionToast.error(
                                            "Compression failed",
                                            "Unable to reduce image size. Please reduce manually.",
                                          );
                                          event.currentTarget.value = "";
                                          return;
                                        }
                                      }

                                      void uploadGalleryImage(
                                        selectedService.slug,
                                        image.id,
                                        usedFile,
                                      );
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
                                    uploadingKey === rowUploadKey
                                      ? "pointer-events-none opacity-60"
                                      : "",
                                  ].join(" ")}
                                >
                                  <Upload className="h-4 w-4" />
                                  {uploadingKey === rowUploadKey ? "Uploading" : "Upload"}
                                </label>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  className={adminActionButtonStyles.delete}
                                  onClick={() =>
                                    removeServiceImage(selectedService.slug, image.id)
                                  }
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
                  <PaginationControls
                    currentPage={mediaPagination.currentPage}
                    firstItem={mediaPagination.firstItem}
                    itemLabel="image rows"
                    lastItem={mediaPagination.lastItem}
                    onPageChange={setMediaPage}
                    pageCount={mediaPagination.pageCount}
                    totalItems={serviceMediaRows.length}
                  />
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

export function AdminGallery() {
  const { images, isLoading, error } = useGalleryImagesState(false);
  const [drafts, setDrafts] = useState<GalleryImageRecord[]>(images);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<GalleryImageRecord>(() => createBlankGalleryImage(images.length + 1));
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [imagePendingDelete, setImagePendingDelete] = useState<GalleryImageRecord | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    setDrafts(images);
  }, [images]);

  const filteredImages = useMemo(
    () => drafts.filter((image) => galleryImageMatchesSearch(image, query)),
    [drafts, query],
  );
  const galleryPagination = getTablePagination(filteredImages.length, page);
  const paginatedImages = filteredImages.slice(
    galleryPagination.startIndex,
    galleryPagination.endIndex,
  );
  const generatedImageId = form.id || createGalleryImageId(form.title || "gallery-image", drafts);
  const isDeleteConfirmed = Boolean(
    imagePendingDelete && deleteConfirmation === imagePendingDelete.id,
  );

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    setPage((current) => Math.min(current, galleryPagination.pageCount));
  }, [galleryPagination.pageCount]);

  function openNewImage() {
    setForm(createBlankGalleryImage(drafts.length + 1));
    setIsEditorOpen(true);
  }

  function openEditImage(image: GalleryImageRecord) {
    setForm(image);
    setIsEditorOpen(true);
  }

  function openDeleteImage(image: GalleryImageRecord) {
    setDeleteConfirmation("");
    setImagePendingDelete(image);
  }

  function closeDeleteImage() {
    setDeleteConfirmation("");
    setImagePendingDelete(null);
  }

  function updateGalleryForm<K extends keyof GalleryImageRecord>(key: K, value: GalleryImageRecord[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadSelectedGalleryImage(file: File | undefined) {
    if (!file) return;

    const fallbackTitle = fileNameToCaption(file.name) || "Gallery Image";
    const title = form.title.trim() || fallbackTitle;
    const galleryId = form.id || createGalleryImageId(title, drafts);

    setIsUploading(true);
    try {
      const imageUrl = await uploadGalleryImageFile(file, galleryId, form.imageUrl);
      setForm((current) => ({
        ...current,
        id: galleryId,
        title: current.title.trim() || title,
        altText: current.altText.trim() || title,
        imageUrl,
      }));
      transactionToast.upload("Image uploaded", "Save the gallery item to publish the new image.");
    } catch (uploadError) {
      transactionToast.error("Gallery upload failed", uploadError);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSaveGalleryImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();
    const imageUrl = form.imageUrl.trim();

    if (!title) {
      transactionToast.warning("Missing title", "Add a short title for this gallery image.");
      return;
    }

    if (!imageUrl) {
      transactionToast.warning("Missing image", "Upload an image before saving this gallery item.");
      return;
    }

    const timestamp = new Date().toISOString();
    const nextImage: GalleryImageRecord = {
      ...form,
      id: form.id || createGalleryImageId(title, drafts),
      title,
      location: form.location.trim(),
      imageUrl,
      altText: form.altText.trim() || title,
      sortOrder: Number(form.sortOrder) || drafts.length + 1,
      createdAt: form.createdAt || timestamp,
      updatedAt: timestamp,
    };

    setIsSaving(true);
    try {
      await saveGalleryImage(nextImage);
      const exists = drafts.some((image) => image.id === nextImage.id);
      const nextDrafts = exists
        ? drafts.map((image) => (image.id === nextImage.id ? nextImage : image))
        : [...drafts, nextImage];
      setDrafts([...nextDrafts].sort((first, second) => first.sortOrder - second.sortOrder));
      transactionToast.success(
        nextImage.isPublished ? "Gallery image saved" : "Gallery image saved as draft",
        nextImage.isPublished
          ? "Published gallery images appear on the website."
          : "Draft images stay hidden from the public gallery.",
      );
      setIsEditorOpen(false);
    } catch (saveError) {
      transactionToast.error("Gallery save failed", saveError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteGalleryImage() {
    if (!imagePendingDelete || deleteConfirmation !== imagePendingDelete.id) return;

    setIsSaving(true);
    try {
      await deleteGalleryImage(imagePendingDelete.id);
      setDrafts((current) => current.filter((image) => image.id !== imagePendingDelete.id));
      transactionToast.deleted("Gallery image deleted", "The image was removed from the module.");
      closeDeleteImage();
    } catch (deleteError) {
      transactionToast.error("Gallery delete failed", deleteError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout
      title="Gallery Images"
      eyebrow="Gallery Module"
      actions={
        <Button type="button" onClick={openNewImage}>
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Gallery API is unavailable right now. Cached images are shown until the server responds again.
        </div>
      ) : null}

      <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Website Gallery
              </p>
              <h2 className="mt-1 text-2xl leading-tight text-neutral-950">
                Image Table
              </h2>
              <div className="mt-3 grid gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:grid-cols-3">
                <span className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                  {drafts.length} total images
                </span>
                <span className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                  {drafts.filter((image) => image.isPublished).length} published
                </span>
                <span className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                  {drafts.filter((image) => image.isFeatured).length} homepage
                </span>
              </div>
            </div>

            <label className="flex min-h-11 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 focus-within:border-primary">
              <Search className="h-4 w-4 shrink-0 text-primary" />
              <span className="sr-only">Search gallery images</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                placeholder="Search images"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-primary"
                  aria-label="Clear gallery search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <caption className="sr-only">Gallery images</caption>
            <thead className="bg-neutral-950 text-xs uppercase tracking-wide text-white">
              <tr>
                <th scope="col" className="w-16 px-4 py-3 font-semibold">No.</th>
                <th scope="col" className="px-4 py-3 font-semibold">Image</th>
                <th scope="col" className="px-4 py-3 font-semibold">Placement</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedImages.map((image, index) => (
                <tr key={image.id} className="border-t border-neutral-200 transition hover:bg-neutral-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-neutral-500">
                    {galleryPagination.startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                        {image.imageUrl ? (
                          <img
                            src={adminAssetPath(image.imageUrl)}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-400">
                            <ImageOff className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-base font-bold uppercase tracking-normal text-neutral-950">
                          {image.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-neutral-500">{image.id}</p>
                        {image.location ? (
                          <p className="mt-1 truncate text-xs text-neutral-500">{image.location}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-neutral-700">
                        Order {image.sortOrder}
                      </span>
                      {image.isFeatured ? (
                        <span className="rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                          Homepage
                        </span>
                      ) : null}
                      {image.isHero ? (
                        <span className="rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
                          Hero
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-flex rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
                        image.isPublished
                          ? "border border-emerald-200 bg-emerald-100 text-emerald-800"
                          : "border border-slate-300 bg-slate-100 text-slate-700",
                      ].join(" ")}
                    >
                      {image.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className={adminActionButtonStyles.edit}
                        onClick={() => openEditImage(image)}
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className={adminActionButtonStyles.delete}
                        onClick={() => openDeleteImage(image)}
                      >
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

        {filteredImages.length === 0 ? (
          <div className="border-t border-neutral-200 p-8 text-center">
            <ImageOff className="mx-auto h-10 w-10 text-neutral-400" />
            <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
              {query ? "No images found" : "No images uploaded yet"}
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              {query ? "Try a different search term." : "Upload a gallery image to show it on the website."}
            </p>
          </div>
        ) : null}

        <PaginationControls
          currentPage={galleryPagination.currentPage}
          firstItem={galleryPagination.firstItem}
          itemLabel="gallery images"
          lastItem={galleryPagination.lastItem}
          onPageChange={setPage}
          pageCount={galleryPagination.pageCount}
          totalItems={filteredImages.length}
        />
      </section>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-h-[92vh] max-w-[min(68rem,96vw)] overflow-y-auto p-0 sm:rounded-lg">
          <section className="overflow-hidden bg-white">
            <div className="border-b border-neutral-200 p-4 pr-12">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Gallery Module
              </p>
              <DialogTitle className="mt-1 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
                {form.id ? "Edit Gallery Image" : "Add Gallery Image"}
              </DialogTitle>
            </div>

            <form onSubmit={handleSaveGalleryImage} className="grid gap-5 p-4 lg:grid-cols-[1fr_24rem]">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gallery-title">Title</Label>
                    <Input
                      id="gallery-title"
                      value={form.title}
                      onChange={(event) => updateGalleryForm("title", event.currentTarget.value)}
                      placeholder="Hotel Lobby Restoration"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gallery-location">Detail / Label</Label>
                    <Input
                      id="gallery-location"
                      value={form.location}
                      onChange={(event) => updateGalleryForm("location", event.currentTarget.value)}
                      placeholder="Premium floor finish"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gallery-alt">Alt Text</Label>
                  <Input
                    id="gallery-alt"
                    value={form.altText}
                    onChange={(event) => updateGalleryForm("altText", event.currentTarget.value)}
                    placeholder="Describe the image for accessibility"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gallery-id">Image ID</Label>
                    <Input id="gallery-id" value={generatedImageId} readOnly />
                    <p className="text-xs text-neutral-500">
                      Used for delete confirmation.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gallery-sort-order">Sort Order</Label>
                    <Input
                      id="gallery-sort-order"
                      type="number"
                      min={1}
                      value={form.sortOrder}
                      onChange={(event) => updateGalleryForm("sortOrder", Number(event.currentTarget.value))}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Label
                    htmlFor="gallery-published"
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-neutral-700"
                  >
                    <input
                      id="gallery-published"
                      type="checkbox"
                      checked={form.isPublished}
                      className="h-4 w-4 rounded border-neutral-300 accent-primary"
                      onChange={(event) => updateGalleryForm("isPublished", event.currentTarget.checked)}
                    />
                    Published
                  </Label>
                  <Label
                    htmlFor="gallery-featured"
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-neutral-700"
                  >
                    <input
                      id="gallery-featured"
                      type="checkbox"
                      checked={form.isFeatured}
                      className="h-4 w-4 rounded border-neutral-300 accent-primary"
                      onChange={(event) => updateGalleryForm("isFeatured", event.currentTarget.checked)}
                    />
                    Homepage
                  </Label>
                  <Label
                    htmlFor="gallery-hero"
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-neutral-700"
                  >
                    <input
                      id="gallery-hero"
                      type="checkbox"
                      checked={form.isHero}
                      className="h-4 w-4 rounded border-neutral-300 accent-primary"
                      onChange={(event) => updateGalleryForm("isHero", event.currentTarget.checked)}
                    />
                    Hero slide
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gallery-image-url">Image URL</Label>
                  <Input
                    id="gallery-image-url"
                    value={form.imageUrl}
                    onChange={(event) => updateGalleryForm("imageUrl", event.currentTarget.value)}
                    placeholder="uploads/gallery/image.jpg"
                  />
                </div>

                <div className="flex flex-wrap gap-2 border-t border-neutral-200 pt-4">
                  <Button type="submit" disabled={isSaving || isUploading}>
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
                <div className="aspect-[4/3] overflow-hidden rounded-md border border-neutral-200 bg-white">
                  {form.imageUrl ? (
                    <img
                      src={adminAssetPath(form.imageUrl)}
                      alt={form.altText || form.title || "Gallery preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center text-sm font-semibold text-neutral-500">
                      <ImageOff className="mb-3 h-8 w-8 text-neutral-400" />
                      No image uploaded yet
                    </div>
                  )}
                </div>

                <input
                  id="gallery-file-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const selectedFile = event.currentTarget.files?.[0];
                    event.currentTarget.value = "";
                    void uploadSelectedGalleryImage(selectedFile);
                  }}
                />
                <Label
                  htmlFor="gallery-file-upload"
                  className={`mt-3 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-neutral-950 ${
                    isUploading ? "pointer-events-none opacity-60" : ""
                  }`}
                  aria-disabled={isUploading}
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading" : form.imageUrl ? "Replace Image" : "Upload Image"}
                </Label>
                <p className="mt-3 text-xs leading-5 text-neutral-500">
                  JPG, PNG, and WEBP files are optimized to a smaller JPG when uploaded.
                </p>
              </div>
            </form>
          </section>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(imagePendingDelete)}
        onOpenChange={(open) => {
          if (!open && !isSaving) closeDeleteImage();
        }}
      >
        <DialogContent className="max-w-md">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
              Delete Gallery Image
            </p>
            <DialogTitle className="mt-2 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="mt-3 leading-6">
              This permanently deletes <strong className="text-neutral-950">{imagePendingDelete?.title}</strong>.
              This action cannot be undone.
            </DialogDescription>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (isDeleteConfirmed) void handleDeleteGalleryImage();
            }}
            className="space-y-4"
          >
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-sm text-neutral-700">Type this Image ID to confirm:</p>
              <code className="mt-2 block select-all font-mono text-sm font-bold text-neutral-950">
                {imagePendingDelete?.id}
              </code>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-gallery-confirmation">Image ID</Label>
              <Input
                id="delete-gallery-confirmation"
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.currentTarget.value)}
                placeholder={imagePendingDelete?.id}
                autoComplete="off"
                autoFocus
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={isSaving} onClick={closeDeleteImage}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className={adminActionButtonStyles.delete}
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

export function AdminReviews() {
  const { testimonials, error } = useTestimonialsState(false);
  const [drafts, setDrafts] = useState<TestimonialRecord[]>(testimonials);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<TestimonialRecord>(() => createBlankTestimonial(testimonials.length + 1));
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [testimonialPendingDelete, setTestimonialPendingDelete] = useState<TestimonialRecord | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    setDrafts(testimonials);
  }, [testimonials]);

  const filteredTestimonials = useMemo(
    () => drafts.filter((testimonial) => testimonialMatchesSearch(testimonial, query)),
    [drafts, query],
  );
  const testimonialPagination = getTablePagination(filteredTestimonials.length, page);
  const paginatedTestimonials = filteredTestimonials.slice(
    testimonialPagination.startIndex,
    testimonialPagination.endIndex,
  );
  const generatedTestimonialId = form.id || createTestimonialId(form.clientName || "testimonial", drafts);
  const isDeleteConfirmed = Boolean(
    testimonialPendingDelete && deleteConfirmation === testimonialPendingDelete.id,
  );

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    setPage((current) => Math.min(current, testimonialPagination.pageCount));
  }, [testimonialPagination.pageCount]);

  function openNewTestimonial() {
    setForm(createBlankTestimonial(drafts.length + 1));
    setIsEditorOpen(true);
  }

  function openEditTestimonial(testimonial: TestimonialRecord) {
    setForm(testimonial);
    setIsEditorOpen(true);
  }

  function openDeleteTestimonial(testimonial: TestimonialRecord) {
    setDeleteConfirmation("");
    setTestimonialPendingDelete(testimonial);
  }

  function closeDeleteTestimonial() {
    setDeleteConfirmation("");
    setTestimonialPendingDelete(null);
  }

  function updateTestimonialForm<K extends keyof TestimonialRecord>(
    key: K,
    value: TestimonialRecord[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSaveTestimonial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const quote = form.quote.trim();
    const clientName = form.clientName.trim();

    if (!quote) {
      transactionToast.warning("Missing review", "Add the testimonial text before saving.");
      return;
    }

    if (!clientName) {
      transactionToast.warning("Missing client name", "Add the client label or name for this testimonial.");
      return;
    }

    const timestamp = new Date().toISOString();
    const nextTestimonial: TestimonialRecord = {
      ...form,
      id: form.id || createTestimonialId(clientName, drafts),
      quote,
      clientName,
      rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
      sortOrder: Number(form.sortOrder) || drafts.length + 1,
      createdAt: form.createdAt || timestamp,
      updatedAt: timestamp,
    };

    setIsSaving(true);
    try {
      await saveTestimonial(nextTestimonial);
      const exists = drafts.some((testimonial) => testimonial.id === nextTestimonial.id);
      const nextDrafts = exists
        ? drafts.map((testimonial) =>
            testimonial.id === nextTestimonial.id ? nextTestimonial : testimonial,
          )
        : [...drafts, nextTestimonial];
      setDrafts([...nextDrafts].sort((first, second) => first.sortOrder - second.sortOrder));
      transactionToast.success(
        nextTestimonial.isPublished ? "Review saved" : "Review saved as draft",
        nextTestimonial.isPublished
          ? "Published reviews appear on the Testimonials section."
          : "Draft reviews stay hidden from the public website.",
      );
      setIsEditorOpen(false);
    } catch (saveError) {
      transactionToast.error("Review save failed", saveError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTestimonial() {
    if (!testimonialPendingDelete || deleteConfirmation !== testimonialPendingDelete.id) return;

    setIsSaving(true);
    try {
      await deleteTestimonial(testimonialPendingDelete.id);
      setDrafts((current) =>
        current.filter((testimonial) => testimonial.id !== testimonialPendingDelete.id),
      );
      transactionToast.deleted("Review deleted", "The testimonial was removed from the module.");
      closeDeleteTestimonial();
    } catch (deleteError) {
      transactionToast.error("Review delete failed", deleteError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout
      title="Client Reviews"
      eyebrow="Testimonials Module"
      actions={
        <Button type="button" onClick={openNewTestimonial}>
          <Plus className="h-4 w-4" />
          Add Review
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Reviews API is unavailable right now. Cached testimonials are shown until the server responds again.
        </div>
      ) : null}

      <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Website Testimonials
              </p>
              <h2 className="mt-1 text-2xl leading-tight text-neutral-950">
                Reviews Table
              </h2>
              <div className="mt-3 grid gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:grid-cols-2">
                <span className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                  {drafts.length} total reviews
                </span>
                <span className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                  {drafts.filter((testimonial) => testimonial.isPublished).length} published
                </span>
              </div>
            </div>

            <label className="flex min-h-11 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 focus-within:border-primary">
              <Search className="h-4 w-4 shrink-0 text-primary" />
              <span className="sr-only">Search reviews</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                placeholder="Search reviews"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-primary"
                  aria-label="Clear review search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <caption className="sr-only">Client testimonials</caption>
            <thead className="bg-neutral-950 text-xs uppercase tracking-wide text-white">
              <tr>
                <th scope="col" className="w-16 px-4 py-3 font-semibold">No.</th>
                <th scope="col" className="px-4 py-3 font-semibold">Review</th>
                <th scope="col" className="px-4 py-3 font-semibold">Rating</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTestimonials.map((testimonial, index) => (
                <tr key={testimonial.id} className="border-t border-neutral-200 transition hover:bg-neutral-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-neutral-500">
                    {testimonialPagination.startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <MessageSquareQuote className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-base font-bold uppercase tracking-normal text-neutral-950">
                          {testimonial.clientName}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-600">
                          {testimonial.quote}
                        </p>
                        <p className="mt-1 truncate text-xs text-neutral-500">{testimonial.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                      {testimonial.rating}/5
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-flex rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
                        testimonial.isPublished
                          ? "border border-emerald-200 bg-emerald-100 text-emerald-800"
                          : "border border-slate-300 bg-slate-100 text-slate-700",
                      ].join(" ")}
                    >
                      {testimonial.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className={adminActionButtonStyles.edit}
                        onClick={() => openEditTestimonial(testimonial)}
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className={adminActionButtonStyles.delete}
                        onClick={() => openDeleteTestimonial(testimonial)}
                      >
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

        {filteredTestimonials.length === 0 ? (
          <div className="border-t border-neutral-200 p-8 text-center">
            <MessageSquareQuote className="mx-auto h-10 w-10 text-neutral-400" />
            <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
              {query ? "No reviews found" : "No testimonials uploaded yet"}
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              {query ? "Try a different search term." : "Add a testimonial to show it on the website."}
            </p>
          </div>
        ) : null}

        <PaginationControls
          currentPage={testimonialPagination.currentPage}
          firstItem={testimonialPagination.firstItem}
          itemLabel="reviews"
          lastItem={testimonialPagination.lastItem}
          onPageChange={setPage}
          pageCount={testimonialPagination.pageCount}
          totalItems={filteredTestimonials.length}
        />
      </section>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-h-[92vh] max-w-[min(62rem,96vw)] overflow-y-auto p-0 sm:rounded-lg">
          <section className="overflow-hidden bg-white">
            <div className="border-b border-neutral-200 p-4 pr-12">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Testimonials Module
              </p>
              <DialogTitle className="mt-1 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
                {form.id ? "Edit Review" : "Add Review"}
              </DialogTitle>
            </div>

            <form onSubmit={handleSaveTestimonial} className="grid gap-5 p-4 lg:grid-cols-[1fr_20rem]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testimonial-quote">Review</Label>
                  <textarea
                    id="testimonial-quote"
                    value={form.quote}
                    onChange={(event) => updateTestimonialForm("quote", event.currentTarget.value)}
                    placeholder="Paste the client testimonial here"
                    className="min-h-36 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-client">Client Name / Label</Label>
                    <Input
                      id="testimonial-client"
                      value={form.clientName}
                      onChange={(event) => updateTestimonialForm("clientName", event.currentTarget.value)}
                      placeholder="Hotel Lobby Client"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-rating">Rating</Label>
                    <select
                      id="testimonial-rating"
                      value={form.rating}
                      onChange={(event) => updateTestimonialForm("rating", Number(event.currentTarget.value))}
                      className="flex min-h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} star{rating === 1 ? "" : "s"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-id">Review ID</Label>
                    <Input id="testimonial-id" value={generatedTestimonialId} readOnly />
                    <p className="text-xs text-neutral-500">Used for delete confirmation.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-sort-order">Sort Order</Label>
                    <Input
                      id="testimonial-sort-order"
                      type="number"
                      min={1}
                      value={form.sortOrder}
                      onChange={(event) => updateTestimonialForm("sortOrder", Number(event.currentTarget.value))}
                    />
                  </div>
                </div>

                <Label
                  htmlFor="testimonial-published"
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-neutral-700"
                >
                  <input
                    id="testimonial-published"
                    type="checkbox"
                    checked={form.isPublished}
                    className="h-4 w-4 rounded border-neutral-300 accent-primary"
                    onChange={(event) => updateTestimonialForm("isPublished", event.currentTarget.checked)}
                  />
                  Published on website
                </Label>

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
                <article className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: Math.min(5, Math.max(1, Number(form.rating) || 5)) }).map((_, index) => (
                      <span key={index} aria-hidden="true">*</span>
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-6 text-neutral-700">
                    "{form.quote || "Client testimonial preview"}"
                  </blockquote>
                  <p className="mt-4 font-display text-sm font-bold uppercase tracking-normal text-neutral-950">
                    {form.clientName || "Client Name"}
                  </p>
                </article>
              </div>
            </form>
          </section>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(testimonialPendingDelete)}
        onOpenChange={(open) => {
          if (!open && !isSaving) closeDeleteTestimonial();
        }}
      >
        <DialogContent className="max-w-md">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
              Delete Review
            </p>
            <DialogTitle className="mt-2 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="mt-3 leading-6">
              This permanently deletes <strong className="text-neutral-950">{testimonialPendingDelete?.clientName}</strong>.
              This action cannot be undone.
            </DialogDescription>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (isDeleteConfirmed) void handleDeleteTestimonial();
            }}
            className="space-y-4"
          >
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-sm text-neutral-700">Type this Review ID to confirm:</p>
              <code className="mt-2 block select-all font-mono text-sm font-bold text-neutral-950">
                {testimonialPendingDelete?.id}
              </code>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-testimonial-confirmation">Review ID</Label>
              <Input
                id="delete-testimonial-confirmation"
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.currentTarget.value)}
                placeholder={testimonialPendingDelete?.id}
                autoComplete="off"
                autoFocus
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={isSaving} onClick={closeDeleteTestimonial}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className={adminActionButtonStyles.delete}
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
  const reelPagination = getTablePagination(filteredReels.length, page);
  const paginatedReels = filteredReels.slice(
    reelPagination.startIndex,
    reelPagination.endIndex,
  );
  const generatedReelId = form.id || createSocialReelId(form.title, drafts);
  const isDeleteConfirmed = Boolean(
    reelPendingDelete && deleteConfirmation === reelPendingDelete.id,
  );

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    setPage((current) => Math.min(current, reelPagination.pageCount));
  }, [reelPagination.pageCount]);

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

  async function persistReels(
    nextReels: SocialReelRecord[],
    successTitle: string,
    successTone: "success" | "draft" | "deleted" = "success",
  ) {
    setIsSaving(true);
    try {
      await saveSocialReels(nextReels);
      setDrafts(nextReels);
      if (successTone === "deleted") {
        transactionToast.deleted(successTitle, "The reel was removed from the module.");
      } else if (successTone === "draft") {
        transactionToast.draft(successTitle, "The reel stays hidden from the homepage.");
      } else {
        transactionToast.success(successTitle, "Reels module was updated.");
      }
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

    if (
      await persistReels(
        nextReels,
        nextReel.isPublished
          ? exists
            ? "Reel updated"
            : "Reel added"
          : "Reel saved as draft",
        nextReel.isPublished ? "success" : "draft",
      )
    ) {
      setIsEditorOpen(false);
    }
  }

  async function handleDeleteReel() {
    if (!reelPendingDelete || deleteConfirmation !== reelPendingDelete.id) return;

    const nextReels = drafts.filter((reel) => reel.id !== reelPendingDelete.id);
    if (await persistReels(nextReels, "Reel deleted", "deleted")) {
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
            <caption className="sr-only">Facebook videos and reels</caption>
            <thead className="bg-neutral-950 text-xs uppercase tracking-wide text-white">
              <tr>
                <th scope="col" className="w-16 px-4 py-3 font-semibold">No.</th>
                <th scope="col" className="px-4 py-3 font-semibold">Video</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReels.map((reel, index) => (
                <tr key={reel.id} className="border-t border-neutral-200 transition hover:bg-neutral-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-neutral-500">
                    {reelPagination.startIndex + index + 1}
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
                          ? "border border-emerald-200 bg-emerald-100 text-emerald-800"
                          : "border border-slate-300 bg-slate-100 text-slate-700",
                      ].join(" ")}
                    >
                      {reel.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className={adminActionButtonStyles.edit}
                        onClick={() => openEditReel(reel)}
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className={adminActionButtonStyles.delete}
                        onClick={() => openDeleteReel(reel)}
                      >
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

        <PaginationControls
          currentPage={reelPagination.currentPage}
          firstItem={reelPagination.firstItem}
          itemLabel="reels"
          lastItem={reelPagination.lastItem}
          onPageChange={setPage}
          pageCount={reelPagination.pageCount}
          totalItems={filteredReels.length}
        />
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
                variant="destructive"
                className={adminActionButtonStyles.delete}
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
  const [page, setPage] = useState(1);
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

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
  const productPagination = getTablePagination(visibleProducts.length, page);
  const paginatedProducts = visibleProducts.slice(
    productPagination.startIndex,
    productPagination.endIndex,
  );

  useEffect(() => {
    setPage(1);
  }, [category, query, sortBy]);

  useEffect(() => {
    setPage((current) => Math.min(current, productPagination.pageCount));
  }, [productPagination.pageCount]);

  function updateForm<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors({});
  }

  function resetForm() {
    setForm(createBlankProduct());
    setErrors({});
  }

  function openNewProductEditor() {
    resetForm();
    setIsProductEditorOpen(true);
  }

  function openEditProductEditor(product: AdminProduct) {
    setForm(productToFormData(product));
    setErrors({});
    setIsProductEditorOpen(true);
  }

  function handleProductEditorOpenChange(open: boolean) {
    if (!open && isSavingProduct) return;

    setIsProductEditorOpen(open);
    if (!open) resetForm();
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

    setIsSavingProduct(true);
    try {
      await upsertProduct(form);
      setIsProductEditorOpen(false);
      resetForm();
      if (form.isPublished) {
        transactionToast.success(
          isEditing ? "Product updated" : "Product created",
          `${form.name || "Product"} was saved successfully.`,
        );
      } else {
        transactionToast.draft(
          "Product saved as draft",
          `${form.name || "Product"} stays hidden until published.`,
        );
      }
    } catch (error) {
      transactionToast.error("Product save failed", error);
    } finally {
      setIsSavingProduct(false);
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
      if (nextProduct.isPublished) {
        transactionToast.success("Product published", product.name);
      } else {
        transactionToast.draft("Product drafted", product.name);
      }
    } catch (error) {
      saveAdminProducts(previousProducts);
      transactionToast.error("Publish update failed", error);
    }
  }

  async function handleDeleteProduct(product: AdminProduct) {
    try {
      await deleteProduct(product.id);
      transactionToast.deleted("Product deleted", product.name);
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
          <Button type="button" onClick={openNewProductEditor}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      }
    >
      <>
        <section className="min-w-0">
          <div className="mb-4 grid gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm md:grid-cols-[1fr_auto_auto]">
            <label className="flex min-h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3">
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
              className="min-h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold"
            >
              <option>All</option>
              {adminProductCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.currentTarget.value)}
              className="min-h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold"
            >
              <option>Newest</option>
              <option>Popular</option>
              <option>Price</option>
            </select>
          </div>

          {view === "cards" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <AdminProductMediaCard
                  key={product.id}
                  product={product}
                  onDelete={handleDeleteProduct}
                  onEdit={openEditProductEditor}
                  onTogglePublish={togglePublish}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-md shadow-neutral-200/60">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <caption className="sr-only">Products and shop inventory</caption>
                  <thead className="bg-neutral-950 text-white">
                    <tr>
                      <th scope="col" className="w-16 px-4 py-3">No.</th>
                      <th scope="col" className="px-4 py-3">Product</th>
                      <th scope="col" className="px-4 py-3">Category</th>
                      <th scope="col" className="px-4 py-3">Price</th>
                      <th scope="col" className="px-4 py-3">Stock</th>
                      <th scope="col" className="px-4 py-3">Published</th>
                      <th scope="col" className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product, index) => (
                      <tr key={product.id} className="border-t border-neutral-200 transition-colors hover:bg-orange-50/50">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-neutral-500">
                          {productPagination.startIndex + index + 1}
                        </td>
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
                            className={`rounded-full border px-3 py-1 text-xs font-bold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                              product.isPublished
                                ? "border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 focus-visible:ring-emerald-500"
                                : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-500"
                            }`}
                          >
                            {product.isPublished ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className={adminActionButtonStyles.edit}
                              onClick={() => openEditProductEditor(product)}
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className={adminActionButtonStyles.delete}
                              onClick={() => void handleDeleteProduct(product)}
                            >
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

              <PaginationControls
                currentPage={productPagination.currentPage}
                firstItem={productPagination.firstItem}
                itemLabel="products"
                lastItem={productPagination.lastItem}
                onPageChange={setPage}
                pageCount={productPagination.pageCount}
                totalItems={visibleProducts.length}
              />
            </div>
          )}
        </section>

        <Dialog open={isProductEditorOpen} onOpenChange={handleProductEditorOpenChange}>
          <DialogContent className="max-h-[92vh] max-w-[min(68rem,96vw)] overflow-y-auto p-0 sm:rounded-lg">
            <div className="border-b border-neutral-200 px-5 py-4 pr-14">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                Product Editor
              </p>
              <DialogTitle className="mt-1 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
                {form.id ? "Edit Product" : "Add Product"}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-6 text-neutral-600">
                {form.id
                  ? "Update the product details and save your changes."
                  : "Enter the product details, preview the card, then add it to the shop list."}
              </DialogDescription>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Name</Label>
                  <Input
                    id="product-name"
                    value={form.name}
                    onChange={(event) => updateForm("name", event.currentTarget.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "product-name-error" : undefined}
                    autoFocus
                  />
                  {errors.name ? (
                    <p id="product-name-error" className="text-xs font-semibold text-red-700">{errors.name}</p>
                  ) : null}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
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
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Price</Label>
                    <Input
                      id="product-price"
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) => updateForm("price", Number(event.currentTarget.value))}
                      aria-invalid={Boolean(errors.price)}
                      aria-describedby={errors.price ? "product-price-error" : undefined}
                    />
                    {errors.price ? (
                      <p id="product-price-error" className="text-xs font-semibold text-red-700">{errors.price}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-stock">Stock</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      min="0"
                      value={form.stockLeft}
                      onChange={(event) => updateForm("stockLeft", Number(event.currentTarget.value))}
                      aria-invalid={Boolean(errors.stockLeft)}
                      aria-describedby={errors.stockLeft ? "product-stock-error" : undefined}
                    />
                    {errors.stockLeft ? (
                      <p id="product-stock-error" className="text-xs font-semibold text-red-700">{errors.stockLeft}</p>
                    ) : null}
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
              </div>

              <aside className="self-start rounded-md border border-neutral-200 bg-neutral-50 p-3 lg:sticky lg:top-0">
                <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  Product Preview
                </p>
                <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
                  <ProductCard product={previewProduct} />
                </div>
              </aside>

              <div className="flex flex-col-reverse gap-2 border-t border-neutral-200 pt-4 sm:flex-row sm:justify-end lg:col-span-2">
                <Button type="button" variant="outline" disabled={isSavingProduct} onClick={() => handleProductEditorOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSavingProduct}>
                  <Save className="h-4 w-4" />
                  {isSavingProduct ? "Saving Product" : form.id ? "Update Product" : "Add Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </>
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
  const currentEmployees = employees.filter((employee) => !employee.deletedAt);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [form, setForm] = useState<EmployeeRecord>(blankEmployee);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingEmployee, setIsSavingEmployee] = useState(false);
  const [page, setPage] = useState(1);
  const [employeePendingDelete, setEmployeePendingDelete] = useState<EmployeeRecord | null>(null);
  const [employeeDeleteConfirmation, setEmployeeDeleteConfirmation] = useState("");

  const departments = ["All", ...Array.from(new Set(currentEmployees.map((employee) => employee.department).filter(Boolean)))];
  const visibleEmployees = currentEmployees.filter((employee) => {
    const matchesDepartment = department === "All" || employee.department === department;
    const orgGroupLabel = orgChartGroups.find((group) => group.value === employee.orgGroup)?.label ?? employee.orgGroup;
    const matchesQuery = [
      employee.name,
      employee.position,
      employee.employeeId,
      employee.department,
      orgGroupLabel,
      employee.isPublished ? "active" : "draft",
    ]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesDepartment && matchesQuery;
  });
  const employeePagination = getTablePagination(visibleEmployees.length, page);
  const paginatedEmployees = visibleEmployees.slice(
    employeePagination.startIndex,
    employeePagination.endIndex,
  );
  const isEmployeeDeleteConfirmed = Boolean(
    employeePendingDelete && employeeDeleteConfirmation === employeePendingDelete.employeeId,
  );

  useEffect(() => {
    setPage(1);
  }, [department, query]);

  useEffect(() => {
    setPage((current) => Math.min(current, employeePagination.pageCount));
  }, [employeePagination.pageCount]);

  function resetForm() {
    setForm({ ...blankEmployee });
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

  function handleEmployeeModalOpenChange(open: boolean) {
    if (open) {
      setIsModalOpen(true);
      return;
    }

    if (!isSavingEmployee) closeEmployeeModal();
  }

  function updateEmployeeForm<K extends keyof EmployeeRecord>(key: K, value: EmployeeRecord[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openDeleteEmployee(employee: EmployeeRecord) {
    setEmployeeDeleteConfirmation("");
    setEmployeePendingDelete(employee);
  }

  function closeDeleteEmployee() {
    setEmployeeDeleteConfirmation("");
    setEmployeePendingDelete(null);
  }

  async function persistEmployees(
    nextEmployees: EmployeeRecord[],
    successTitle: string,
    successDescription: string,
    successTone: "success" | "draft" = "success",
  ) {
    setIsSavingEmployee(true);
    try {
      await saveEmployees(nextEmployees);
      if (successTone === "draft") {
        transactionToast.draft(successTitle, successDescription);
      } else {
        transactionToast.success(successTitle, successDescription);
      }
      return true;
    } catch (error) {
      transactionToast.error("Employee save failed", error);
      return false;
    } finally {
      setIsSavingEmployee(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.employeeId.trim()) {
      transactionToast.warning("Employee needs details", "Name and employee ID are required.");
      return;
    }

    const normalizedEmployeeId = form.employeeId.trim();
    const hasDuplicateId = employees.some(
      (employee) =>
        !employee.deletedAt &&
        employee.id !== form.id &&
        employee.employeeId.toLowerCase() === normalizedEmployeeId.toLowerCase(),
    );
    if (hasDuplicateId) {
      transactionToast.warning("Employee ID already exists", normalizedEmployeeId);
      return;
    }

    const id = form.id || normalizedEmployeeId;
    const nextEmployee = {
      ...form,
      id,
      employeeId: normalizedEmployeeId,
      name: form.name.trim(),
      position: form.position.trim(),
      department: form.department.trim(),
      orgGroup: form.orgGroup || "staff",
    };
    const exists = employees.some((employee) => employee.id === id);
    const nextEmployees = exists
      ? employees.map((employee) => (employee.id === id ? nextEmployee : employee))
      : [nextEmployee, ...employees];

    if (
      await persistEmployees(
        nextEmployees,
        nextEmployee.isPublished
          ? exists
            ? "Employee updated"
            : "Employee added"
          : "Employee saved as draft",
        nextEmployee.isPublished
          ? `${nextEmployee.name} was saved successfully.`
          : `${nextEmployee.name} stays hidden from the public organization chart.`,
        nextEmployee.isPublished ? "success" : "draft",
      )
    ) {
      closeEmployeeModal();
    }
  }

  async function handleToggleEmployeeStatus(employee: EmployeeRecord) {
    const nextEmployee = { ...employee, isPublished: !employee.isPublished };
    const nextEmployees = employees.map((item) =>
      item.id === employee.id ? nextEmployee : item,
    );

    await persistEmployees(
      nextEmployees,
      nextEmployee.isPublished ? "Employee activated" : "Employee moved to draft",
      nextEmployee.isPublished
        ? `${employee.name} is now visible on the public organization chart.`
        : `${employee.name} is now hidden from the public organization chart.`,
      nextEmployee.isPublished ? "success" : "draft",
    );
  }

  async function handleDeleteEmployee() {
    if (!employeePendingDelete || !isEmployeeDeleteConfirmed) return;

    setIsSavingEmployee(true);
    try {
      await deleteEmployee(employeePendingDelete);
      transactionToast.deleted("Employee deleted", employeePendingDelete.employeeId);
      closeDeleteEmployee();
    } catch (error) {
      transactionToast.error("Employee delete failed", error);
    } finally {
      setIsSavingEmployee(false);
    }
  }

  return (
    <AdminLayout
      title="Employees"
      eyebrow="HR Records"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportEmployees(currentEmployees)}>
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1240px] text-left text-sm">
              <caption className="sr-only">Employee records</caption>
              <thead className="bg-neutral-950 text-white">
                <tr>
                  <th scope="col" className="w-16 px-4 py-3">No.</th>
                  <th scope="col" className="px-4 py-3">Employee</th>
                  <th scope="col" className="px-4 py-3">Role</th>
                  <th scope="col" className="px-4 py-3">Department</th>
                  <th scope="col" className="px-4 py-3">Org Group</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Manager</th>
                  <th scope="col" className="min-w-[21rem] whitespace-nowrap px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee, index) => (
                  <tr key={employee.id} className="border-t border-neutral-200">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-neutral-500">
                      {employeePagination.startIndex + index + 1}
                    </td>
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
                      <span
                        className={[
                          "inline-flex rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
                          employee.isPublished
                            ? "border border-emerald-200 bg-emerald-100 text-emerald-800"
                            : "border border-slate-300 bg-slate-100 text-slate-700",
                        ].join(" ")}
                      >
                        {employee.isPublished ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {currentEmployees.find((manager) => manager.employeeId === employee.reportsTo)?.name || "-"}
                    </td>
                    <td className="min-w-[21rem] px-4 py-3 align-middle">
                      <div className="flex flex-nowrap items-center justify-end gap-2 whitespace-nowrap">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className={adminActionButtonStyles.edit}
                          disabled={isSavingEmployee}
                          onClick={() => openEditEmployeeModal(employee)}
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className={
                            employee.isPublished
                              ? adminActionButtonStyles.draft
                              : adminActionButtonStyles.publish
                          }
                          disabled={isSavingEmployee}
                          onClick={() => void handleToggleEmployeeStatus(employee)}
                        >
                          {employee.isPublished ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <ShieldCheck className="h-4 w-4" />
                          )}
                          {employee.isPublished ? "Draft" : "Activate"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className={adminActionButtonStyles.delete}
                          disabled={isSavingEmployee}
                          onClick={() => openDeleteEmployee(employee)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-neutral-500">
                      No employees found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={employeePagination.currentPage}
            firstItem={employeePagination.firstItem}
            itemLabel="employees"
            lastItem={employeePagination.lastItem}
            onPageChange={setPage}
            pageCount={employeePagination.pageCount}
            totalItems={visibleEmployees.length}
          />
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={handleEmployeeModalOpenChange}>
        <DialogContent className="max-h-[92vh] max-w-[min(40rem,96vw)] overflow-y-auto p-0 sm:rounded-lg">
          <div className="border-b border-neutral-200 p-5 pr-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Employee Record
            </p>
            <DialogTitle className="mt-1 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
              {form.id ? "Edit Employee" : "Add Employee"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Add or edit an employee record and choose whether it is active or saved as a draft.
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="employee-name">Name</Label>
              <Input
                id="employee-name"
                value={form.name}
                placeholder="Name"
                disabled={isSavingEmployee}
                autoFocus
                onChange={(event) => updateEmployeeForm("name", event.currentTarget.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employee-id">Employee ID</Label>
                <Input
                  id="employee-id"
                  value={form.employeeId}
                  placeholder="Employee ID"
                  readOnly={Boolean(form.id)}
                  disabled={isSavingEmployee}
                  aria-describedby="employee-id-help"
                  onChange={(event) => updateEmployeeForm("employeeId", event.currentTarget.value)}
                />
                <p id="employee-id-help" className="text-xs text-neutral-500">
                  {form.id
                    ? "Employee ID is fixed after creation and is used for delete confirmation."
                    : "This ID will be used for delete confirmation after the record is saved."}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee-status">Status</Label>
                <select
                  id="employee-status"
                  value={form.isPublished ? "active" : "draft"}
                  disabled={isSavingEmployee}
                  onChange={(event) => updateEmployeeForm("isPublished", event.currentTarget.value === "active")}
                  className="flex min-h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
                <p className="text-xs text-neutral-500">
                  {form.isPublished
                    ? "Active employees appear on the public organization chart."
                    : "Draft employees stay hidden from the public organization chart."}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employee-position">Role / Position</Label>
                <Input
                  id="employee-position"
                  value={form.position}
                  placeholder="Position"
                  disabled={isSavingEmployee}
                  onChange={(event) => updateEmployeeForm("position", event.currentTarget.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-department">Department / Column</Label>
                <Input
                  id="employee-department"
                  value={form.department}
                  placeholder="Department"
                  disabled={isSavingEmployee}
                  onChange={(event) => updateEmployeeForm("department", event.currentTarget.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-org-group">Org Chart Group</Label>
              <select
                id="employee-org-group"
                value={form.orgGroup}
                disabled={isSavingEmployee}
                onChange={(event) =>
                  updateEmployeeForm("orgGroup", event.currentTarget.value as EmployeeRecord["orgGroup"])
                }
                className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
                disabled={isSavingEmployee}
                onChange={(event) => updateEmployeeForm("reportsTo", event.currentTarget.value)}
                className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">No manager</option>
                {currentEmployees
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
                disabled={isSavingEmployee}
                onChange={(event) => updateEmployeeForm("photoUrl", event.currentTarget.value)}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-neutral-200 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={isSavingEmployee} onClick={closeEmployeeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingEmployee}>
                <Save className="h-4 w-4" />
                {isSavingEmployee ? "Saving" : "Save Employee"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(employeePendingDelete)}
        onOpenChange={(open) => {
          if (!open && !isSavingEmployee) closeDeleteEmployee();
        }}
      >
        <DialogContent className="max-w-md">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
              Delete Employee
            </p>
            <DialogTitle className="mt-2 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="mt-3 leading-6">
              This removes <strong className="text-neutral-950">{employeePendingDelete?.name}</strong> from the
              active employee records and public organization chart. There is no restore control on this screen.
            </DialogDescription>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (isEmployeeDeleteConfirmed) void handleDeleteEmployee();
            }}
            className="space-y-4"
          >
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-sm text-neutral-700">Type this Employee ID to confirm:</p>
              <code className="mt-2 block select-all font-mono text-sm font-bold text-neutral-950">
                {employeePendingDelete?.employeeId}
              </code>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-employee-confirmation">Employee ID</Label>
              <Input
                id="delete-employee-confirmation"
                value={employeeDeleteConfirmation}
                onChange={(event) => setEmployeeDeleteConfirmation(event.currentTarget.value)}
                placeholder={employeePendingDelete?.employeeId}
                autoComplete="off"
                autoFocus
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={isSavingEmployee} onClick={closeDeleteEmployee}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className={adminActionButtonStyles.delete}
                disabled={!isEmployeeDeleteConfirmed || isSavingEmployee}
              >
                <Trash2 className="h-4 w-4" />
                {isSavingEmployee ? "Deleting" : "Confirm Delete"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export function AdminContent() {
  const sections = useContentSections();
  const [drafts, setDrafts] = useState<ContentSection[]>(sections);
  const [isUploadingHeroBackground, setIsUploadingHeroBackground] = useState(false);

  useEffect(() => {
    setDrafts(sections);
  }, [sections]);

  const heroBackgroundUrl = getContentSectionBody(
    drafts,
    homepageHeroBackgroundContentKey,
    defaultHomepageHeroBackground,
  );

  function updateSection(id: string, updates: Partial<ContentSection>) {
    setDrafts((current) => current.map((section) => (section.id === id ? { ...section, ...updates } : section)));
  }

  function updateSectionByKey(key: string, updates: Partial<ContentSection>) {
    setDrafts((current) => {
      const existingSection = current.find((section) => section.key === key);
      if (existingSection) {
        return current.map((section) => (section.key === key ? { ...section, ...updates } : section));
      }

      return [
        ...current,
        {
          id: key.replace(/[^a-z0-9]+/gi, "-").toLowerCase(),
          key,
          title: updates.title ?? "Homepage Hero Background",
          body: updates.body ?? "",
          updatedAt: new Date().toISOString(),
        },
      ];
    });
  }

  function addSection() {
    const id = `section-${Date.now()}`;
    setDrafts((current) => [
      ...current,
      { id, key: "custom.section", title: "New Section", body: "", updatedAt: new Date().toISOString() },
    ]);
  }

  async function uploadHomepageBackground(file: File | undefined) {
    if (!file) return;

    setIsUploadingHeroBackground(true);
    try {
      const imageUrl = await uploadContentImageFile(file, homepageHeroBackgroundContentKey, heroBackgroundUrl);
      updateSectionByKey(homepageHeroBackgroundContentKey, {
        title: "Homepage Hero Background",
        body: imageUrl,
        updatedAt: new Date().toISOString(),
      });
      transactionToast.upload("Homepage background uploaded", "Click Save All to apply it to the live homepage.");
    } catch (error) {
      transactionToast.error("Homepage background upload failed", error);
    } finally {
      setIsUploadingHeroBackground(false);
    }
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
        <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm">
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Homepage
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-normal text-neutral-950">
                  Hero Background
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                  Upload or paste the image path used behind the main homepage hero.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="homepage-hero-background">Background Image URL</Label>
                <Input
                  id="homepage-hero-background"
                  value={heroBackgroundUrl}
                  placeholder={defaultHomepageHeroBackground}
                  onChange={(event) =>
                    updateSectionByKey(homepageHeroBackgroundContentKey, {
                      title: "Homepage Hero Background",
                      body: event.currentTarget.value,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    updateSectionByKey(homepageHeroBackgroundContentKey, {
                      title: "Homepage Hero Background",
                      body: defaultHomepageHeroBackground,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset Default
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Preview
              </p>
              <div className="aspect-[16/10] overflow-hidden rounded-md border border-neutral-200 bg-white">
                {heroBackgroundUrl ? (
                  <img
                    src={adminAssetPath(heroBackgroundUrl)}
                    alt="Homepage background preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center text-sm font-semibold text-neutral-500">
                    <ImageOff className="mb-3 h-8 w-8 text-neutral-400" />
                    No homepage background set
                  </div>
                )}
              </div>

              <input
                id="homepage-background-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const selectedFile = event.currentTarget.files?.[0];
                  event.currentTarget.value = "";
                  void uploadHomepageBackground(selectedFile);
                }}
              />
              <Label
                htmlFor="homepage-background-upload"
                className={`mt-3 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-neutral-950 ${
                  isUploadingHeroBackground ? "pointer-events-none opacity-60" : ""
                }`}
                aria-disabled={isUploadingHeroBackground}
              >
                <Upload className="h-4 w-4" />
                {isUploadingHeroBackground ? "Uploading" : "Upload Background"}
              </Label>
              <p className="mt-3 text-xs leading-5 text-neutral-500">
                Large JPG, PNG, and WEBP files are accepted then optimized on upload. Click Save All after uploading.
              </p>
            </div>
          </div>
        </section>

        {drafts.filter((section) => section.key !== homepageHeroBackgroundContentKey).map((section) => (
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
