const visitorStorageKey = "technoshine-site-visitor-id-v1";
const heartbeatIntervalMs = 30_000;

function canUseStorage() {
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
  if (!canUseStorage()) return createVisitorId();

  const storedId = window.localStorage.getItem(visitorStorageKey);
  if (storedId) return storedId;

  const nextId = createVisitorId();
  window.localStorage.setItem(visitorStorageKey, nextId);
  return nextId;
}

function getTrackingPath() {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}` || "/";
}

function isAdminPath(path: string) {
  return path.startsWith("/company/admin");
}

export function trackSiteVisitor() {
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
      path,
    }),
  }).catch(() => {
    // Visitor analytics should never interrupt the public website.
  });
}

export { heartbeatIntervalMs };
