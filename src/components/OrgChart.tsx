import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { EmployeeRecord } from "@/lib/admin-store";

export type TierType = "board" | "leadership" | "dept" | "staff";
type AvatarColorType = "orange" | "blue" | "it" | "gray";
type BadgeType = "exec" | "ops" | "it" | "finance" | "admin";
type CardSize = "md" | "sm";

export type TierVisibility = Record<TierType, boolean>;

interface OrgChartProps {
  visibleTiers: TierVisibility;
  exitingTiers: TierVisibility;
  employees?: EmployeeRecord[];
}

interface BadgeProp {
  type: BadgeType;
  label: string;
}

interface CardProps {
  name: string;
  role: string;
  tier?: TierType;
  avatarColor?: AvatarColorType;
  badge?: BadgeProp;
  photo?: string;
  size?: CardSize;
  isExiting?: boolean;
}

interface AvatarProps {
  name: string;
  avatarColor?: AvatarColorType;
  photo?: string;
  size?: number;
}

interface BadgeComponentProps {
  type: BadgeType;
  label: string;
}

interface ConnectorProps {
  height?: number;
}

interface ReportingNode {
  employee: EmployeeRecord;
  children: ReportingNode[];
}

interface SectionLabelProps {
  children: React.ReactNode;
}

interface RowProps {
  children: React.ReactNode;
}

const ORANGE = "#E25B18";
const GOLD = "#B5760A";
const BLUE = "#185FA5";

const TIER_COLORS = {
  board: ORANGE,
  leadership: GOLD,
  dept: BLUE,
  staff: "#9ca3af",
};

const TIER_LABELS = {
  board: "Board / Executive",
  leadership: "Leadership",
  dept: "Department head",
  staff: "Staff",
};

const BADGE_STYLES = {
  exec: { background: "#FAEEDA", color: "#854F0B" },
  ops: { background: "#E6F1FB", color: "#0C447C" },
  it: { background: "#E1F5EE", color: "#085041" },
  finance: { background: "#F1EFE8", color: "#444441" },
  admin: { background: "#F1EFE8", color: "#444441" },
};

const AVATAR_STYLES = {
  orange: { background: "#FAEEDA", color: "#854F0B" },
  blue: { background: "#E6F1FB", color: "#185FA5" },
  it: { background: "#E1F5EE", color: "#085041" },
  gray: { background: "#F1EFE8", color: "#5F5E5A" },
};

const EXECUTIVE_MANAGER_ID = "MLR-001";
const REPORTING_NODE_GAP = 12;
const CORE_EMPLOYEE_ORDER = [
  "ORG-MD-001",
  "ORG-COO-001",
  "ORG-PRES-001",
  "ORG-VP-001",
  EXECUTIVE_MANAGER_ID,
  "24-015",
  "26-001",
  "ORG-OFFICEAID-001",
  "ORG-TECH-001",
  "ORG-OPSMGR-001",
  "ORG-OPSMGR-002",
  "23-003",
  "ORG-IT-001",
  "ORG-GRAPHIC-001",
  "ORG-ITASSIST-001",
] as const;
const CORE_EMPLOYEE_ORDER_INDEX = new Map<string, number>(
  CORE_EMPLOYEE_ORDER.map((employeeId, index) => [employeeId, index]),
);
const CORE_REPORTING_RELATIONSHIPS = new Map<string, string>([
  ["ORG-PRES-001", "ORG-MD-001"],
  ["ORG-VP-001", "ORG-PRES-001"],
  [EXECUTIVE_MANAGER_ID, "ORG-VP-001"],
  ["24-015", EXECUTIVE_MANAGER_ID],
  ["26-001", EXECUTIVE_MANAGER_ID],
  ["ORG-OFFICEAID-001", EXECUTIVE_MANAGER_ID],
  ["ORG-TECH-001", EXECUTIVE_MANAGER_ID],
  ["ORG-OPSMGR-001", "ORG-TECH-001"],
  ["ORG-OPSMGR-002", "ORG-TECH-001"],
  ["23-003", EXECUTIVE_MANAGER_ID],
  ["ORG-IT-001", EXECUTIVE_MANAGER_ID],
  ["ORG-GRAPHIC-001", "ORG-IT-001"],
  ["ORG-ITASSIST-001", "ORG-IT-001"],
]);
const CORE_ROLE_LABELS = new Map<string, string>([
  ["ORG-OPSMGR-001", "Operations Manager 1"],
  ["ORG-OPSMGR-002", "Operations Manager 2"],
  ["26-001", "Rider / Liaison"],
  ["ORG-OFFICEAID-001", "Office Aide"],
]);

function getInitials(name: string) {
  return name
    .split(" ")
    .filter((w) => w.length > 1)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function Avatar({ name, avatarColor = "gray", photo, size = 52 }: AvatarProps) {
  const style = AVATAR_STYLES[avatarColor] || AVATAR_STYLES.gray;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 8px",
        fontSize: size * 0.28,
        fontWeight: 500,
        flexShrink: 0,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        ...style,
      }}
    >
      {photo ? (
        <img
          src={photo}
          alt={name}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}

function Badge({ type, label }: BadgeComponentProps) {
  const s = BADGE_STYLES[type] || BADGE_STYLES.admin;
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 9,
        padding: "2px 7px",
        borderRadius: 4,
        marginTop: 5,
        fontWeight: 500,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        ...s,
      }}
    >
      {label}
    </span>
  );
}

function ProfileDialogContent({
  name,
  role,
  tier,
  avatarColor,
  badge,
  photo,
}: {
  name: string;
  role: string;
  tier: TierType;
  avatarColor: AvatarColorType;
  badge?: BadgeProp;
  photo?: string;
}) {
  return (
    <DialogContent className="max-w-[min(92vw,520px)] overflow-hidden border border-black/10 bg-white p-0 text-neutral-950 shadow-2xl sm:rounded-lg">
      <div
        className="h-1 w-full"
        style={{ background: TIER_COLORS[tier] }}
      />
      <div className="p-6 sm:p-8">
        <DialogHeader className="items-center text-center">
          <Avatar
            name={name}
            avatarColor={avatarColor}
            photo={photo}
            size={132}
          />
          <DialogTitle className="font-display text-3xl font-bold uppercase leading-tight tracking-normal text-neutral-950">
            {name}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
            {role}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              Group
            </p>
            <p className="mt-1 font-display text-sm font-bold uppercase tracking-normal text-neutral-950">
              {TIER_LABELS[tier]}
            </p>
          </div>
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              Role
            </p>
            <p className="mt-1 font-display text-sm font-bold uppercase tracking-normal text-neutral-950">
              {badge?.label ?? role}
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function Card({
  name,
  role,
  tier = "staff",
  avatarColor = "gray",
  badge,
  photo,
  size = "md",
  isExiting = false,
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const isSmall = size === "sm";
  const cardWidth = isSmall ? 124 : tier === "leadership" ? 168 : 148;
  const avatarSize = isSmall ? 38 : 52;

  return (
    <div
      style={{
        width: cardWidth,
        flexShrink: 0,
        ...(isExiting
          ? {
              opacity: 0,
              transform: "translateY(14px) scale(0.97)",
              transition:
                "opacity 220ms ease, transform 220ms ease",
              transitionDelay: "0ms",
            }
          : {}),
      }}
    >
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`View details for ${name}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              appearance: "none",
              background: hovered ? "#f9fafb" : "#fff",
              border: "0.5px solid",
              borderColor: hovered ? "#9ca3af" : "#e5e7eb",
              borderRadius: 12,
              borderTop: `3px solid ${TIER_COLORS[tier]}`,
              cursor: "zoom-in",
              display: "block",
              font: "inherit",
              padding: isSmall ? "10px 10px" : "12px 14px",
              width: "100%",
              textAlign: "center",
              transition: "border-color 0.15s, background 0.15s, transform 0.15s",
            }}
          >
            <Avatar
              name={name}
              avatarColor={avatarColor}
              photo={photo}
              size={avatarSize}
            />
            <div
              style={{
                fontSize: isSmall ? 11 : 12,
                fontWeight: 500,
                color: "#111827",
                lineHeight: 1.35,
                marginBottom: 3,
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: isSmall ? 9 : 10,
                color: "#6b7280",
                lineHeight: 1.3,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              {role}
            </div>
            {badge && <Badge type={badge.type} label={badge.label} />}
          </button>
        </DialogTrigger>
        <ProfileDialogContent
          name={name}
          role={role}
          tier={tier}
          avatarColor={avatarColor}
          badge={badge}
          photo={photo}
        />
      </Dialog>
    </div>
  );
}

function Connector({ height = 20 }: ConnectorProps) {
  return (
    <div
      style={{
        width: 1,
        height,
        background: "#d1d5db",
        margin: "0 auto",
        flexShrink: 0,
      }}
    />
  );
}

function employeeAssetPath(path: string) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

function badgeForEmployee(employee: EmployeeRecord): BadgeProp {
  const department = employee.department.toLowerCase();

  if (employee.orgGroup === "board" || employee.orgGroup === "leadership") {
    return { type: "exec", label: "Executive" };
  }

  if (department.includes("it") || department.includes("creative")) {
    return { type: "it", label: employee.department || "IT" };
  }

  if (department.includes("finance") || department.includes("account")) {
    return { type: "finance", label: employee.department || "Finance" };
  }

  if (department.includes("admin")) {
    return { type: "admin", label: employee.department || "Admin" };
  }

  return { type: "ops", label: employee.department || "Operations" };
}

function avatarColorForEmployee(employee: EmployeeRecord): AvatarColorType {
  const department = employee.department.toLowerCase();
  if (employee.orgGroup === "board" || employee.orgGroup === "leadership") return "orange";
  if (department.includes("it") || department.includes("creative")) return "it";
  if (employee.orgGroup === "dept") return "blue";
  return "gray";
}

function displayRoleForEmployee(employee: EmployeeRecord) {
  return CORE_ROLE_LABELS.get(employee.employeeId) ?? employee.position;
}

function employeeHierarchyOrder(employee: EmployeeRecord) {
  return CORE_EMPLOYEE_ORDER_INDEX.get(employee.employeeId) ?? Number.MAX_SAFE_INTEGER;
}

function sortByHierarchyOrder(employees: EmployeeRecord[]) {
  return [...employees].sort((first, second) => {
    const orderDifference = employeeHierarchyOrder(first) - employeeHierarchyOrder(second);
    return orderDifference || first.name.localeCompare(second.name);
  });
}

function reportingManagerId(employee: EmployeeRecord) {
  return CORE_REPORTING_RELATIONSHIPS.get(employee.employeeId) ?? employee.reportsTo;
}

function buildReportingForest(employees: EmployeeRecord[], executiveManagerId: string) {
  const reportingEmployees = employees.filter(
    (employee) => employee.orgGroup === "dept" || employee.orgGroup === "staff",
  );
  const reportingEmployeeById = new Map(
    reportingEmployees.map((employee) => [employee.employeeId, employee]),
  );
  const childrenByManager = new Map<string, EmployeeRecord[]>();
  const roots: EmployeeRecord[] = [];

  reportingEmployees.forEach((employee) => {
    const managerId = reportingManagerId(employee);
    if (managerId === executiveManagerId || reportingEmployeeById.has(managerId)) {
      const children = childrenByManager.get(managerId) ?? [];
      children.push(employee);
      childrenByManager.set(managerId, children);
      return;
    }

    roots.push(employee);
  });

  const visited = new Set<string>();
  const buildNode = (employee: EmployeeRecord, ancestors: Set<string>): ReportingNode => {
    visited.add(employee.employeeId);
    const nextAncestors = new Set(ancestors);
    nextAncestors.add(employee.employeeId);
    const children = sortByHierarchyOrder(childrenByManager.get(employee.employeeId) ?? [])
      .filter((child) => !nextAncestors.has(child.employeeId))
      .map((child) => buildNode(child, nextAncestors));

    return { employee, children };
  };
  const requestedRoots = childrenByManager.get(executiveManagerId) ?? [];
  const requestedRootIds = new Set(requestedRoots.map((employee) => employee.employeeId));
  const initialRoots = sortByHierarchyOrder([
    ...requestedRoots,
    ...roots.filter((employee) => !requestedRootIds.has(employee.employeeId)),
  ]);
  const forest = initialRoots.map((employee) => buildNode(employee, new Set<string>()));

  sortByHierarchyOrder(reportingEmployees).forEach((employee) => {
    if (!visited.has(employee.employeeId)) {
      forest.push(buildNode(employee, new Set<string>()));
    }
  });

  return forest;
}

function filterVisibleReportingNodes(
  nodes: ReportingNode[],
  visibleTiers: TierVisibility,
): ReportingNode[] {
  return nodes.flatMap((node) => {
    const children = filterVisibleReportingNodes(node.children, visibleTiers);
    if (!visibleTiers[node.employee.orgGroup]) return children;
    return [{ ...node, children }];
  });
}

function reportingNodeWidth(node: ReportingNode, depth = 0): number {
  const cardWidth = depth === 0 ? 148 : 124;
  if (node.children.length === 0) return cardWidth;

  const childrenWidth =
    node.children.reduce(
      (total, child) => total + reportingNodeWidth(child, depth + 1),
      0,
    ) +
    REPORTING_NODE_GAP * (node.children.length - 1);
  return Math.max(cardWidth, childrenWidth);
}

function EmployeeCard({
  employee,
  tier,
  size = "md",
  isExiting,
}: {
  employee: EmployeeRecord;
  tier: TierType;
  size?: CardSize;
  isExiting: boolean;
}) {
  return (
    <Card
      name={employee.name}
      role={displayRoleForEmployee(employee)}
      tier={tier}
      avatarColor={avatarColorForEmployee(employee)}
      badge={badgeForEmployee(employee)}
      photo={employeeAssetPath(employee.photoUrl)}
      size={size}
      isExiting={isExiting}
    />
  );
}

function ReportingNodeView({
  node,
  depth,
  exitingTiers,
}: {
  node: ReportingNode;
  depth: number;
  exitingTiers: TierVisibility;
}) {
  const width = reportingNodeWidth(node, depth);
  const childWidths = node.children.map((child) => reportingNodeWidth(child, depth + 1));
  const childrenWidth =
    childWidths.reduce((total, childWidth) => total + childWidth, 0) +
    REPORTING_NODE_GAP * Math.max(0, childWidths.length - 1);
  const hasMultipleChildren = node.children.length > 1;
  const firstChildCenter = (childWidths[0] ?? 0) / 2;
  const lastChildCenter = childrenWidth - (childWidths.at(-1) ?? 0) / 2;

  return (
    <div
      style={{
        width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <EmployeeCard
        employee={node.employee}
        tier={node.employee.orgGroup}
        size={depth === 0 ? "md" : "sm"}
        isExiting={exitingTiers[node.employee.orgGroup]}
      />

      {node.children.length === 1 ? (
        <>
          <Connector height={18} />
          <ul
            aria-label={`Direct reports to ${node.employee.name}`}
            style={{ listStyle: "none", margin: 0, padding: 0 }}
          >
            <li>
              <ReportingNodeView
                node={node.children[0]}
                depth={depth + 1}
                exitingTiers={exitingTiers}
              />
            </li>
          </ul>
        </>
      ) : null}

      {hasMultipleChildren ? (
        <div
          style={{
            position: "relative",
            width: childrenWidth,
            paddingTop: 24,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: 1,
              height: 10,
              background: "#d1d5db",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 10,
              left: firstChildCenter,
              width: lastChildCenter - firstChildCenter,
              height: 1,
              background: "#d1d5db",
            }}
          />
          <ul
            aria-label={`Direct reports to ${node.employee.name}`}
            style={{
              display: "grid",
              gridTemplateColumns: childWidths.map((childWidth) => `${childWidth}px`).join(" "),
              gap: REPORTING_NODE_GAP,
              alignItems: "start",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {node.children.map((child) => (
              <li
                key={child.employee.id}
                style={{ position: "relative", display: "flex", justifyContent: "center" }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    width: 1,
                    height: 14,
                    background: "#d1d5db",
                  }}
                />
                <ReportingNodeView
                  node={child}
                  depth={depth + 1}
                  exitingTiers={exitingTiers}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ReportingTree({
  nodes,
  managerName,
  exitingTiers,
}: {
  nodes: ReportingNode[];
  managerName: string;
  exitingTiers: TierVisibility;
}) {
  const nodeWidths = nodes.map((node) => reportingNodeWidth(node));
  const width =
    nodeWidths.reduce((total, nodeWidth) => total + nodeWidth, 0) +
    REPORTING_NODE_GAP * Math.max(0, nodeWidths.length - 1);
  const hasMultipleNodes = nodes.length > 1;
  const firstNodeCenter = (nodeWidths[0] ?? 0) / 2;
  const lastNodeCenter = width - (nodeWidths.at(-1) ?? 0) / 2;

  return (
    <div
      style={{
        position: "relative",
        width,
        margin: "0 auto",
        paddingTop: hasMultipleNodes ? 24 : 0,
      }}
    >
      {hasMultipleNodes ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 10,
            left: firstNodeCenter,
            width: lastNodeCenter - firstNodeCenter,
            height: 1,
            background: "#d1d5db",
          }}
        />
      ) : null}
      <ul
        aria-label={`Direct reports to ${managerName}`}
        style={{
          display: "grid",
          gridTemplateColumns: nodeWidths.map((nodeWidth) => `${nodeWidth}px`).join(" "),
          gap: REPORTING_NODE_GAP,
          alignItems: "start",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {nodes.map((node) => (
          <li
            key={node.employee.id}
            style={{ position: "relative", display: "flex", justifyContent: "center" }}
          >
            {hasMultipleNodes ? (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: -14,
                  left: "50%",
                  width: 1,
                  height: 14,
                  background: "#d1d5db",
                }}
              />
            ) : null}
            <ReportingNodeView
              node={node}
              depth={0}
              exitingTiers={exitingTiers}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function useOrgChartData(employees: EmployeeRecord[] = []) {
  return useMemo(() => {
    const activeEmployees = employees.filter(
      (employee) => employee.isPublished && !employee.deletedAt,
    );
    const nextBoardEmployees = sortByHierarchyOrder(
      activeEmployees.filter((employee) => employee.orgGroup === "board"),
    );
    const nextLeadershipEmployees = sortByHierarchyOrder(
      activeEmployees.filter((employee) => employee.orgGroup === "leadership"),
    );
    const nextExecutiveManager =
      nextLeadershipEmployees.find((employee) => employee.employeeId === EXECUTIVE_MANAGER_ID) ??
      nextLeadershipEmployees.at(-1);

    return {
      boardEmployees: nextBoardEmployees,
      leadershipEmployees: nextLeadershipEmployees,
      executiveManager: nextExecutiveManager,
      reportingForest: buildReportingForest(
        activeEmployees,
        nextExecutiveManager?.employeeId ?? EXECUTIVE_MANAGER_ID,
      ),
    };
  }, [employees]);
}

function InlineAvatar({
  employee,
  size = 46,
}: {
  employee: EmployeeRecord;
  size?: number;
}) {
  const style = AVATAR_STYLES[avatarColorForEmployee(employee)] || AVATAR_STYLES.gray;
  const photo = employeeAssetPath(employee.photoUrl);

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 text-xs font-semibold"
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      {photo ? (
        <img
          src={photo}
          alt={employee.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(employee.name)
      )}
    </div>
  );
}

function MobileEmployeeCard({
  employee,
  tier,
  isExiting,
  compact = false,
}: {
  employee: EmployeeRecord;
  tier: TierType;
  isExiting: boolean;
  compact?: boolean;
}) {
  const badge = badgeForEmployee(employee);
  const badgeStyle = BADGE_STYLES[badge.type] || BADGE_STYLES.admin;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`View details for ${employee.name}`}
          className="flex min-h-[74px] w-full items-center gap-3 rounded-md border border-black/10 bg-white/95 p-3 text-left shadow-sm transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          style={{
            borderLeft: `4px solid ${TIER_COLORS[tier]}`,
            ...(isExiting
              ? {
                  opacity: 0,
                  transform: "translateY(10px) scale(0.98)",
                  transition: "opacity 220ms ease, transform 220ms ease",
                }
              : {}),
          }}
        >
          <InlineAvatar employee={employee} size={compact ? 40 : 48} />
          <span className="min-w-0 flex-1">
            <span className="block break-words font-display text-[15px] font-bold uppercase leading-tight tracking-normal text-neutral-950">
              {employee.name}
            </span>
            <span className="mt-1 block break-words text-[11px] font-semibold uppercase leading-snug tracking-wide text-neutral-600">
              {displayRoleForEmployee(employee)}
            </span>
            <span
              className="mt-2 inline-flex max-w-full rounded-sm px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em]"
              style={badgeStyle}
            >
              <span className="truncate">{badge.label}</span>
            </span>
          </span>
        </button>
      </DialogTrigger>
      <ProfileDialogContent
        name={employee.name}
        role={displayRoleForEmployee(employee)}
        tier={tier}
        avatarColor={avatarColorForEmployee(employee)}
        badge={badge}
        photo={employeeAssetPath(employee.photoUrl)}
      />
    </Dialog>
  );
}

function MobileSection({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: color }}
        />
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function MobileReportingNode({
  node,
  exitingTiers,
  depth = 0,
}: {
  node: ReportingNode;
  exitingTiers: TierVisibility;
  depth?: number;
}) {
  return (
    <li className="relative">
      <MobileEmployeeCard
        employee={node.employee}
        tier={node.employee.orgGroup}
        isExiting={exitingTiers[node.employee.orgGroup]}
        compact={depth > 0}
      />

      {node.children.length > 0 ? (
        <ul className="ml-4 mt-2 space-y-2 border-l border-black/10 pl-3">
          {node.children.map((child) => (
            <MobileReportingNode
              key={child.employee.id}
              node={child}
              depth={depth + 1}
              exitingTiers={exitingTiers}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function MobileOrgChart({
  visibleTiers,
  exitingTiers,
  employees = [],
}: OrgChartProps) {
  const showBoard = visibleTiers.board;
  const showLeadership = visibleTiers.leadership;
  const {
    boardEmployees,
    leadershipEmployees,
    reportingForest,
  } = useOrgChartData(employees);
  const visibleReportingNodes = useMemo(
    () => filterVisibleReportingNodes(reportingForest, visibleTiers),
    [reportingForest, visibleTiers],
  );
  const hasVisibleEmployees =
    (showBoard && boardEmployees.length > 0) ||
    (showLeadership && leadershipEmployees.length > 0) ||
    visibleReportingNodes.length > 0;

  if (!hasVisibleEmployees) {
    return (
      <div className="rounded-md border border-dashed border-black/15 bg-white/90 p-5 text-center text-sm font-semibold text-neutral-600 shadow-sm">
        No visible team members.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      {showBoard && boardEmployees.length > 0 ? (
        <MobileSection title="Board / Executive" color={TIER_COLORS.board}>
          <div className="space-y-2">
            {boardEmployees.map((employee) => (
              <MobileEmployeeCard
                key={employee.id}
                employee={employee}
                tier="board"
                isExiting={exitingTiers.board}
              />
            ))}
          </div>
        </MobileSection>
      ) : null}

      {showLeadership && leadershipEmployees.length > 0 ? (
        <MobileSection title="Leadership" color={TIER_COLORS.leadership}>
          <div className="space-y-2">
            {leadershipEmployees.map((employee) => (
              <MobileEmployeeCard
                key={employee.id}
                employee={employee}
                tier="leadership"
                isExiting={exitingTiers.leadership}
              />
            ))}
          </div>
        </MobileSection>
      ) : null}

      {visibleReportingNodes.length > 0 ? (
        <MobileSection title="Departments / Staff" color={TIER_COLORS.dept}>
          <ul className="space-y-2">
            {visibleReportingNodes.map((node) => (
              <MobileReportingNode
                key={node.employee.id}
                node={node}
                exitingTiers={exitingTiers}
              />
            ))}
          </ul>
        </MobileSection>
      ) : null}
    </div>
  );
}

export default function OrgChart({
  visibleTiers,
  exitingTiers,
  employees = [],
}: OrgChartProps) {
  const showBoard = visibleTiers.board;
  const showLeadership = visibleTiers.leadership;
  const { boardEmployees, leadershipEmployees, reportingForest, executiveManager } =
    useOrgChartData(employees);
  const visibleReportingNodes = useMemo(
    () => filterVisibleReportingNodes(reportingForest, visibleTiers),
    [reportingForest, visibleTiers],
  );
  const hasBoard = boardEmployees.length > 0;
  const hasLeadership = leadershipEmployees.length > 0;
  const hasReportingArea = visibleReportingNodes.length > 0;

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: "2rem 1rem",
        overflow: "visible",
        minWidth: 1164,
      }}
    >
      {showBoard && hasBoard && (
        <>
          <SectionLabel>Managing Director / COO</SectionLabel>
          <Row>
            {boardEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                tier="board"
                isExiting={exitingTiers.board}
              />
            ))}
          </Row>
        </>
      )}

      {showBoard && hasBoard && ((showLeadership && hasLeadership) || hasReportingArea) && (
        <Connector height={20} />
      )}

      {showLeadership && hasLeadership && (
        <>
          <SectionLabel>Leadership</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {leadershipEmployees.map((employee, index) => (
              <div key={employee.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {index > 0 && <Connector height={14} />}
                <EmployeeCard
                  employee={employee}
                  tier="leadership"
                  isExiting={exitingTiers.leadership}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {showLeadership && hasLeadership && hasReportingArea && (
        <Connector height={20} />
      )}

      {hasReportingArea && (
        <>
          <SectionLabel>Executive Manager direct reports</SectionLabel>
          <ReportingTree
            nodes={visibleReportingNodes}
            managerName={executiveManager?.name ?? "Executive Manager"}
            exitingTiers={exitingTiers}
          />
        </>
      )}
    </div>
  );
}

function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p
      style={{
        fontSize: 10,
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        textAlign: "center",
        marginBottom: 12,
        fontWeight: 500,
      }}
    >
      {children}
    </p>
  );
}

function Row({ children }: RowProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}
