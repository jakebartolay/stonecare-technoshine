import { useState } from "react";

export type TierType = "board" | "leadership" | "dept" | "staff";
type AvatarColorType = "orange" | "blue" | "it" | "gray";
type BadgeType = "exec" | "ops" | "it" | "finance" | "admin";
type CardSize = "md" | "sm";

export type TierVisibility = Record<TierType, boolean>;

interface OrgChartProps {
  visibleTiers: TierVisibility;
  exitingTiers: TierVisibility;
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
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#f9fafb" : "#fff",
          border: "0.5px solid",
          borderColor: hovered ? "#9ca3af" : "#e5e7eb",
          borderRadius: 12,
          borderTop: `3px solid ${TIER_COLORS[tier]}`,
          padding: isSmall ? "10px 10px" : "12px 14px",
          width: "100%",
          textAlign: "center",
          transition: "border-color 0.15s, background 0.15s",
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
      </div>
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

export default function OrgChart({
  visibleTiers,
  exitingTiers,
}: OrgChartProps) {
  const showBoard = visibleTiers.board;
  const showLeadership = visibleTiers.leadership;
  const showDepartments = visibleTiers.dept;
  const showStaff = visibleTiers.staff;
  const showDepartmentArea = showDepartments || showStaff;

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
      {showBoard && (
        <>
          <SectionLabel>Board / Ownership</SectionLabel>
          <Row>
            <Card
              name="Erwin Torrefiel"
              role="Managing Director"
              tier="board"
              avatarColor="orange"
              badge={{ type: "exec", label: "Executive" }}
              photo={TEAM_PHOTOS.managingDirector}
              aosDelay={0}
              isExiting={exitingTiers.board}
            />
            <Card
              name="Jo Torrefiel"
              role="COO"
              tier="board"
              avatarColor="orange"
              badge={{ type: "exec", label: "Executive" }}
              photo={TEAM_PHOTOS.coo}
              aosDelay={100}
              isExiting={exitingTiers.board}
            />
          </Row>
        </>
      )}

      {showBoard && (showLeadership || showDepartmentArea) && (
        <Connector height={20} />
      )}

      {showLeadership && (
        <>
          <SectionLabel>Leadership</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Card
              name="Rich Nicollie Torrefiel"
              role="President"
              tier="leadership"
              avatarColor="orange"
              badge={{ type: "exec", label: "Executive" }}
              photo={TEAM_PHOTOS.president}
              aosDelay={200}
              isExiting={exitingTiers.leadership}
            />
            <Connector height={14} />
            <Card
              name="Dexter Piolo Torrefiel"
              role="Vice President"
              tier="leadership"
              avatarColor="orange"
              badge={{ type: "exec", label: "Executive" }}
              photo={TEAM_PHOTOS.vicePresident}
              aosDelay={300}
              isExiting={exitingTiers.leadership}
            />
            <Connector height={14} />
            <Card
              name="Mary-Lou Robellon"
              role="Executive Manager"
              tier="leadership"
              avatarColor="blue"
              badge={{ type: "ops", label: "Operations" }}
              photo={TEAM_PHOTOS.executiveManager}
              aosDelay={400}
              isExiting={exitingTiers.leadership}
            />
          </div>
        </>
      )}

      {showLeadership && showDepartmentArea && <Connector height={20} />}

      {/* Department columns */}
      {showDepartmentArea && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <DeptCol label="Technical">
            {showDepartments && (
              <Card
                name="Mark Antony Daga"
                role="Technical Manager"
                tier="dept"
                avatarColor="blue"
                badge={{ type: "ops", label: "Operations" }}
                photo={TEAM_PHOTOS.technicalManager}
                aosDelay={500}
                isExiting={exitingTiers.dept}
              />
            )}
            {showDepartments && showStaff && <Connector height={12} />}
            {showStaff && (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Card
                    name="Henry Cadorna"
                    role="Operations Mgr"
                    tier="staff"
                    size="sm"
                    photo={TEAM_PHOTOS.operationsManager}
                    aosDelay={900}
                    isExiting={exitingTiers.staff}
                  />
                  <Connector height={8} />
                  <WorkerCard
                    aosDelay={1500}
                    isExiting={exitingTiers.staff}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Card
                    name="Renato Aducal"
                    role="Operations Mgr"
                    tier="staff"
                    size="sm"
                    photo={TEAM_PHOTOS.operationsManager2}
                    aosDelay={1000}
                    isExiting={exitingTiers.staff}
                  />
                  <Connector height={8} />
                  <WorkerCard
                    aosDelay={1600}
                    isExiting={exitingTiers.staff}
                  />
                </div>
              </div>
            )}
          </DeptCol>

          {showDepartments && (
            <DeptCol label="Finance">
              <Card
                name="Romalyn Tabuzo"
                role="Accounting Supervisor"
                tier="dept"
                avatarColor="blue"
                badge={{ type: "finance", label: "Finance" }}
                photo={TEAM_PHOTOS.accountingSupervisor}
                aosDelay={600}
                isExiting={exitingTiers.dept}
              />
            </DeptCol>
          )}

          <DeptCol label="Admin">
            {showDepartments && (
              <Card
                name="Monica Mangilit"
                role="Admin Staff"
                tier="dept"
                avatarColor="blue"
                badge={{ type: "admin", label: "Admin" }}
                photo={TEAM_PHOTOS.adminStaff}
                aosDelay={700}
                isExiting={exitingTiers.dept}
              />
            )}
            {showDepartments && showStaff && <Connector height={12} />}
            {showStaff && (
              <div style={{ display: "flex", gap: 8 }}>
                <Card
                  name="Nonito Regino Guiao Jr"
                  role="Rider Liaison"
                  tier="staff"
                  size="sm"
                  photo={TEAM_PHOTOS.riderLiaison}
                  aosDelay={1100}
                  isExiting={exitingTiers.staff}
                />
                <Card
                  name="Winks Morales Balala"
                  role="Office Aid"
                  tier="staff"
                  size="sm"
                  photo={TEAM_PHOTOS.officeAid}
                  aosDelay={1200}
                  isExiting={exitingTiers.staff}
                />
              </div>
            )}
          </DeptCol>

          <DeptCol label="IT / Creative">
            {showDepartments && (
              <Card
                name="Aljhan Linga"
                role="IT Supervisor"
                tier="dept"
                avatarColor="it"
                badge={{ type: "it", label: "IT" }}
                photo={TEAM_PHOTOS.itSupervisor}
                aosDelay={800}
                isExiting={exitingTiers.dept}
              />
            )}
            {showDepartments && showStaff && <Connector height={12} />}
            {showStaff && (
              <>
                <Card
                  name="Darwin John Canda"
                  role="Graphic Designer"
                  tier="staff"
                  size="sm"
                  photo={TEAM_PHOTOS.graphicDesigner}
                  aosDelay={1300}
                  isExiting={exitingTiers.staff}
                />
                <Connector height={8} />
                <Card
                  name="Jake Bartolay"
                  role="IT Assistant"
                  tier="staff"
                  size="sm"
                  photo={TEAM_PHOTOS.itAssistant}
                  aosDelay={1400}
                  isExiting={exitingTiers.staff}
                />
              </>
            )}
          </DeptCol>
        </div>
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
        minWidth: 130,
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
