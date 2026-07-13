import { useState } from "react";
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
  aosDelay?: number;
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

interface DeptColProps {
  label: string;
  children: React.ReactNode;
}

interface DepartmentGroup {
  department: string;
  heads: EmployeeRecord[];
  staff: EmployeeRecord[];
}

interface DepartmentLineProps {
  groups: DepartmentGroup[];
  showDepartments: boolean;
  showStaff: boolean;
  exitingTiers: TierVisibility;
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

const DEPARTMENT_ORDER = ["Admin", "Finance", "IT / Creative", "Technical"];

function teamPhoto(fileName: string) {
  return `${import.meta.env.BASE_URL}team/${encodeURIComponent(fileName)}`;
}

const TEAM_PHOTOS = {
  managingDirector: teamPhoto("MANAGING DIRECTOR.png"),
  coo: teamPhoto("COO.jpg"),
  president: teamPhoto("President.jpg"),
  vicePresident: teamPhoto("Vice President.jpg"),
  executiveManager: teamPhoto("Executive Manager.jpg"),
  technicalManager: teamPhoto("Technical Manager.jpg"),
  operationsManager: teamPhoto("Operations Mgr.jpg"),
  operationsManager2: teamPhoto("Operations Mgr 2.jpg"),
  accountingSupervisor: teamPhoto("Accounting Supervisor.jpg"),
  adminStaff: teamPhoto("Admin Staff.jpg"),
  riderLiaison: teamPhoto("Rider Liaison.jpg"),
  officeAid: teamPhoto("Office Aid.jpg"),
  itSupervisor: teamPhoto("IT Supervisor.jpg"),
  graphicDesigner: teamPhoto("Graphic Designer.jpg"),
  itAssistant: teamPhoto("IT Assistant.jpg"),
};

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
  aosDelay = 0,
  isExiting = false,
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const isSmall = size === "sm";
  const cardWidth = isSmall ? 124 : tier === "leadership" ? 168 : 148;
  const avatarSize = isSmall ? 38 : 52;

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={aosDelay}
      data-aos-duration="500"
      data-aos-once="true"
      data-aos-offset="0"
      data-aos-anchor-placement="top-bottom"
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

function sortByReportingOrder(employees: EmployeeRecord[]) {
  const byManager = new Map<string, EmployeeRecord[]>();
  const byId = new Map(employees.map((employee) => [employee.employeeId, employee]));
  const roots: EmployeeRecord[] = [];

  employees.forEach((employee) => {
    if (employee.reportsTo && byId.has(employee.reportsTo)) {
      const reports = byManager.get(employee.reportsTo) ?? [];
      reports.push(employee);
      byManager.set(employee.reportsTo, reports);
      return;
    }

    roots.push(employee);
  });

  const sortByName = (items: EmployeeRecord[]) =>
    [...items].sort((first, second) => first.name.localeCompare(second.name));
  const ordered: EmployeeRecord[] = [];
  const visit = (employee: EmployeeRecord) => {
    ordered.push(employee);
    sortByName(byManager.get(employee.employeeId) ?? []).forEach(visit);
  };

  sortByName(roots).forEach(visit);
  return ordered;
}

function departmentOrderIndex(department: string) {
  const normalized = department.trim().toLowerCase();

  if (normalized.includes("admin")) return 0;
  if (normalized.includes("finance") || normalized.includes("account")) return 1;
  if (/\bit\b/.test(normalized) || normalized.includes("creative") || normalized.includes("information tech")) return 2;
  if (
    normalized.includes("technical") ||
    normalized.includes("operations") ||
    normalized.includes("project") ||
    normalized.includes("engineering")
  ) {
    return 3;
  }

  return DEPARTMENT_ORDER.length;
}

function groupDepartments(employees: EmployeeRecord[]): DepartmentGroup[] {
  const groups = new Map<string, { heads: EmployeeRecord[]; staff: EmployeeRecord[] }>();

  employees.forEach((employee) => {
    const department = employee.department.trim() || "Other";
    const group = groups.get(department) ?? { heads: [], staff: [] };

    if (employee.orgGroup === "dept") {
      group.heads.push(employee);
    } else if (employee.orgGroup === "staff") {
      group.staff.push(employee);
    }

    groups.set(department, group);
  });

  return [...groups.entries()]
    .map(([department, group]) => ({
      department,
      heads: sortByReportingOrder(group.heads),
      staff: sortByReportingOrder(group.staff),
    }))
    .sort((first, second) => {
      const orderDifference = departmentOrderIndex(first.department) - departmentOrderIndex(second.department);
      return orderDifference || first.department.localeCompare(second.department);
    });
}

function EmployeeCard({
  employee,
  tier,
  size = "md",
  aosDelay,
  isExiting,
}: {
  employee: EmployeeRecord;
  tier: TierType;
  size?: CardSize;
  aosDelay: number;
  isExiting: boolean;
}) {
  return (
    <Card
      name={employee.name}
      role={employee.position}
      tier={tier}
      avatarColor={avatarColorForEmployee(employee)}
      badge={badgeForEmployee(employee)}
      photo={employeeAssetPath(employee.photoUrl)}
      size={size}
      aosDelay={aosDelay}
      isExiting={isExiting}
    />
  );
}

function DepartmentLine({
  groups,
  showDepartments,
  showStaff,
  exitingTiers,
}: DepartmentLineProps) {
  const columnCount = groups.length;
  const lineInset = `${50 / columnCount}%`;

  return (
    <div style={{ width: "100%", overflowX: "auto", paddingBottom: 8 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 940,
          minWidth: columnCount > 1 ? columnCount * 158 : 150,
          margin: "0 auto",
          paddingTop: columnCount > 1 ? 24 : 0,
        }}
      >
        {columnCount > 1 && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 10,
              left: lineInset,
              right: lineInset,
              height: 1,
              background: "#d1d5db",
            }}
          />
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columnCount}, minmax(130px, 1fr))`,
            gap: 12,
            alignItems: "start",
          }}
        >
          {groups.map((group, groupIndex) => (
            <div
              key={group.department}
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                minWidth: 0,
              }}
            >
              {columnCount > 1 && (
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
              )}

              <DeptCol label={group.department}>
                {showDepartments &&
                  group.heads.map((employee, index) => (
                    <div
                      key={employee.id}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                      {index > 0 && <Connector height={8} />}
                      <EmployeeCard
                        employee={employee}
                        tier="dept"
                        aosDelay={500 + groupIndex * 100 + index * 50}
                        isExiting={exitingTiers.dept}
                      />
                    </div>
                  ))}

                {showDepartments && group.heads.length > 0 && showStaff && group.staff.length > 0 && (
                  <Connector height={12} />
                )}

                {showStaff && group.staff.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                    {group.staff.map((employee, index) => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        tier="staff"
                        size="sm"
                        aosDelay={900 + groupIndex * 120 + index * 60}
                        isExiting={exitingTiers.staff}
                      />
                    ))}
                  </div>
                )}
              </DeptCol>
            </div>
          ))}
        </div>
      </div>
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
  const showDepartments = visibleTiers.dept;
  const showStaff = visibleTiers.staff;
  const showDepartmentArea = showDepartments || showStaff;
  const activeEmployees = employees.filter((employee) => !employee.deletedAt);
  const boardEmployees = sortByReportingOrder(
    activeEmployees.filter((employee) => employee.orgGroup === "board"),
  );
  const leadershipEmployees = sortByReportingOrder(
    activeEmployees.filter((employee) => employee.orgGroup === "leadership"),
  );
  const departmentGroups = groupDepartments(activeEmployees);
  const visibleDepartmentGroups = departmentGroups.filter(
    (group) => (showDepartments && group.heads.length > 0) || (showStaff && group.staff.length > 0),
  );
  const hasBoard = boardEmployees.length > 0;
  const hasLeadership = leadershipEmployees.length > 0;
  const hasDepartmentArea = visibleDepartmentGroups.length > 0;

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: "2rem 1rem",
        overflow: "visible",
        minWidth: 320,
      }}
    >
      {showBoard && hasBoard && (
        <>
          <SectionLabel>Board / Ownership</SectionLabel>
          <Row>
            {boardEmployees.map((employee, index) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                tier="board"
                aosDelay={index * 100}
                isExiting={exitingTiers.board}
              />
            ))}
          </Row>
        </>
      )}

      {showBoard && hasBoard && ((showLeadership && hasLeadership) || (showDepartmentArea && hasDepartmentArea)) && (
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
                  aosDelay={200 + index * 100}
                  isExiting={exitingTiers.leadership}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {showLeadership && hasLeadership && showDepartmentArea && hasDepartmentArea && (
        <Connector height={20} />
      )}

      {showDepartmentArea && hasDepartmentArea && (
        <DepartmentLine
          groups={visibleDepartmentGroups}
          showDepartments={showDepartments}
          showStaff={showStaff}
          exitingTiers={exitingTiers}
        />
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

function DeptCol({ label, children }: DeptColProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minWidth: 130,
        maxWidth: 260,
      }}
    >
      <SectionLabel>{label}</SectionLabel>
      {children}
    </div>
  );
}

function WorkerCard({
  aosDelay,
  isExiting,
}: {
  aosDelay: number;
  isExiting: boolean;
}) {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={aosDelay}
      data-aos-duration="500"
      data-aos-once="true"
      data-aos-offset="0"
      data-aos-anchor-placement="top-bottom"
      style={{
        width: 110,
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
      <div
        style={{
          background: "#f9fafb",
          border: "0.5px solid #e5e7eb",
          borderRadius: 8,
          padding: "6px 10px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          Labor / Worker
        </div>
      </div>
    </div>
  );
}
