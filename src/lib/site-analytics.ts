const visitorStorageKey = "technoshine-site-visitor-id-v1";
const visitStorageKey = "technoshine-site-visit-id-v1";
const heartbeatIntervalMs = 30_000;

type VisitorTrackingEvent = "page_view" | "heartbeat";
type VisitorDeviceType = "desktop" | "mobile" | "tablet" | "unknown";

function canUseLocalStorage() {
  if (typeof window === "undefined") return false;

  try {
    return Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function createVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getVisitorId() {
  if (!canUseLocalStorage()) return createVisitorId();

  const storedId = window.localStorage.getItem(visitorStorageKey);
  if (storedId) return storedId;

  const nextId = createVisitorId();
  window.localStorage.setItem(visitorStorageKey, nextId);
  return nextId;
}

function getVisitId() {
  if (typeof window === "undefined") return createVisitorId();

  try {
    const storedId = window.sessionStorage.getItem(visitStorageKey);
    if (storedId) return storedId;

    const nextId = createVisitorId();
    window.sessionStorage.setItem(visitStorageKey, nextId);
    return nextId;
  } catch {
    return getVisitorId();
  }
}

function getTrackingPath() {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}` || "/";
}

function isAdminPath(path: string) {
  return path.startsWith("/company/admin");
}

function getDeviceType(): VisitorDeviceType {
  if (typeof navigator === "undefined") return "unknown";

  const userAgent = navigator.userAgent.toLowerCase();
  if (!userAgent) return "unknown";
  if (/ipad|tablet|kindle|playbook|silk/.test(userAgent)) return "tablet";
  if (/android/.test(userAgent) && !/mobile/.test(userAgent)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|phone|opera mini|windows phone/.test(userAgent)) {
    return "mobile";
  }

  return "desktop";
}

export function trackSiteVisitor(eventType: VisitorTrackingEvent = "heartbeat") {
  if (typeof window === "undefined") return;

  const path = getTrackingPath();
  if (isAdminPath(path)) return;

  void fetch(`${import.meta.env.BASE_URL}api/admin.php?action=visitors.track`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      visitorId: getVisitorId(),
      visitId: getVisitId(),
      eventType,
      deviceType: getDeviceType(),
      path,
    }),
  }).catch(() => {
    // Visitor analytics should never interrupt the public website.
  });
}

export function trackSitePageView() {
  trackSiteVisitor("page_view");
}

export { heartbeatIntervalMs };
