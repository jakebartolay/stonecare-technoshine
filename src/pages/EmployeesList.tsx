import { useEffect, useState, type CSSProperties } from "react";
import { BadgeCheck, BriefcaseBusiness, IdCard, SearchX, ShieldAlert } from "lucide-react";
import { Link } from "wouter";

type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  status: string;
  photoPaths: string[];
};

type LoadState = "loading" | "ready" | "error";

const employeeAssetCacheBust = Date.now().toString();

function withEmployeeCacheBust(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${employeeAssetCacheBust}`;
}

const csvPath = withEmployeeCacheBust(`${import.meta.env.BASE_URL}employees/employees.csv`);
const employeePhotoBasePath = `${import.meta.env.BASE_URL}employees/photos/`;
const employeePhotoExtensions = ["jpg", "jpeg", "png", "webp"];

function getEmployeeId() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("id")?.trim() ?? "";
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function pickField(record: Record<string, string>, keys: string[]) {
  return keys.map((key) => record[key]).find(Boolean) ?? "";
}

function getEmployeePhotoPaths(photo: string) {
  const value = photo.trim();
  if (!value) return [];
  if (value.startsWith("http")) return [value];
  if (value.startsWith("/")) return [withEmployeeCacheBust(value)];
  if (/\.(jpg|jpeg|png|webp)$/i.test(value)) {
    return [withEmployeeCacheBust(`${employeePhotoBasePath}${value}`)];
  }
  return employeePhotoExtensions.map((extension) =>
    withEmployeeCacheBust(`${employeePhotoBasePath}${value}.${extension}`),
  );
}

type EmployeePhotoProps = {
  sources: string[];
  alt: string;
  className: string;
  style: CSSProperties;
};

function EmployeePhoto({ sources, alt, className, style }: EmployeePhotoProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const sourceKey = sources.join("|");

  useEffect(() => {
    setSourceIndex(0);
  }, [sourceKey]);

  const source = sources[sourceIndex];
  if (!source) return null;

  return (
    <img
      src={source}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        setSourceIndex((currentIndex) => currentIndex + 1);
      }}
    />
  );
}

function parseEmployees(csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const [headerLine, ...rows] = lines;
  if (!headerLine) return [];

  const headers = parseCsvLine(headerLine).map(normalizeHeader);

  return rows
    .map((row) => {
      const values = parseCsvLine(row);
      const record = headers.reduce<Record<string, string>>((data, header, index) => {
        data[header] = values[index] ?? "";
        return data;
      }, {});

      const id = pickField(record, ["id", "id_number", "employee_id"]);
      const photo = pickField(record, ["photo", "picture", "pictures"]);

      return {
        id,
        name: pickField(record, ["name", "full_name", "employee_name"]),
        position: pickField(record, ["position", "job_title"]),
        department: pickField(record, ["department"]),
        status: pickField(record, ["status"]) || "active",
        photoPaths: getEmployeePhotoPaths(photo || id),
      };
    })
    .filter((employee) => employee.id);
}

export default function EmployeesList() {
  const employeeId = getEmployeeId();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    let isMounted = true;

    fetch(csvPath, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Employee CSV not found");
        return response.text();
      })
      .then((csv) => {
        if (!isMounted) return;
        setEmployees(parseEmployees(csv));
        setLoadState("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadState("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const employee = employees.find(
    (item) => item.id.toLowerCase() === employeeId.toLowerCase(),
  );
  const isVerified =
    loadState === "ready" &&
    Boolean(employee) &&
    employee?.status.toLowerCase() !== "inactive";
  const title =
    loadState === "loading"
      ? "Checking Employee ID"
      : isVerified
        ? "Verified Employee ID"
        : "Employee ID Not Found";
  const statusText =
    loadState === "loading"
      ? "Checking"
      : isVerified
        ? "Active"
        : "Not Verified";

  return (
    <main className="min-h-screen bg-white text-foreground">
      <section className="employee-verification-shell relative min-h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-20 h-1 bg-primary" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <div
            className={`flex flex-1 items-center gap-8 py-8 lg:py-12 ${
              employee
                ? "flex-col lg:grid lg:grid-cols-[430px_1fr]"
                : "justify-center"
            }`}
          >
            {employee && (
              <div className="mx-auto w-full max-w-[390px]">
                <div className="mb-4 border border-primary/30 bg-white px-4 py-3 text-center shadow-sm lg:hidden">
                  <p className="text-xs font-semibold leading-relaxed text-neutral-800 sm:text-sm">
                    If you found this ID, please return it or call{" "}
                    <a href="tel:+639178241220" className="text-primary hover:underline">
                      0917 824 1220
                    </a>{" "}
                    or email us at{" "}
                    <a
                      href="mailto:contactus@technoshineph.com"
                      className="text-primary hover:underline"
                    >
                      contactus@technoshineph.com
                    </a>
                    .
                  </p>
                </div>
                <div className="relative aspect-[636/1024] overflow-hidden rounded-[20px] bg-white shadow-2xl ring-1 ring-black/10">
                  <img
                    src={withEmployeeCacheBust(`${import.meta.env.BASE_URL}employees/front.jpg`)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {employee.photoPaths.length > 0 && (
                    <EmployeePhoto
                      sources={employee.photoPaths}
                      alt={employee.name || employee.id}
                      className="absolute left-1/2 top-[31.5%] h-[34%] w-[54%] -translate-x-1/2 object-cover"
                      style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}
                    />
                  )}

                  <div className="absolute inset-x-[8%] top-[74%] text-center">
                    <p className="text-[clamp(1rem,5vw,1.45rem)] font-black uppercase leading-tight tracking-normal text-black">
                      {employee.name || "Employee Name"}
                    </p>
                    <p className="mt-2 text-[clamp(0.8rem,3.4vw,1.05rem)] font-black uppercase tracking-normal text-black">
                      {employee.position || "Position"}
                    </p>
                  </div>

                  <div className="absolute bottom-[10%] right-[8%] text-right">
                    <p className="text-[0.62rem] font-bold uppercase tracking-normal text-neutral-600">
                      ID No.
                    </p>
                    <p className="text-lg font-black uppercase tracking-normal text-black">
                      {employeeId || "-"}
                    </p>
                  </div>
                </div>
                <Link
                  href="/"
                  className="mt-5 inline-flex w-full items-center justify-center bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary/90 lg:hidden"
                >
                  Home
                </Link>
              </div>
            )}

            <div
              className={`mx-auto w-full ${
                employee ? "hidden max-w-xl lg:mx-0 lg:block" : "max-w-md"
              }`}
            >
              {employee && (
                <>
                  <p className="mb-3 font-mono text-sm uppercase tracking-[0.22em] text-primary">
                    Employee Verification
                  </p>
                  <h1 className="text-3xl leading-tight text-neutral-950 sm:text-5xl">
                    Technoshine employee record
                  </h1>
                </>
              )}

              <div
                role={!employee ? "dialog" : undefined}
                aria-modal={!employee ? "true" : undefined}
                className={`border border-neutral-200 bg-white p-5 shadow-2xl sm:p-6 ${
                  employee ? "mt-7" : "rounded-lg"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                      isVerified ? "bg-primary/10 text-primary" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {loadState === "error" ? (
                      <ShieldAlert className="h-6 w-6" />
                    ) : isVerified ? (
                      <BadgeCheck className="h-6 w-6" />
                    ) : (
                      <SearchX className="h-6 w-6" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-2xl text-neutral-950">
                      {!employee && loadState === "ready" ? "Employee ID Not Found" : title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {loadState === "loading"
                        ? "Please wait while the employee file is being checked."
                        : loadState === "error"
                          ? "The employee file is missing or cannot be loaded. Please check public/employees/employees.csv."
                          : isVerified
                            ? "This ID is listed in the Technoshine employee file."
                            : "Please check the ID in the link or contact Technoshine for manual confirmation."}
                    </p>
                  </div>
                </div>

                {employee && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="border border-neutral-200 p-4">
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      <IdCard className="h-4 w-4" />
                      <p className="font-mono text-xs uppercase tracking-widest">ID Number</p>
                    </div>
                    <p className="font-display text-xl uppercase tracking-normal text-neutral-950">
                      {employeeId || "Missing"}
                    </p>
                  </div>

                  <div className="border border-neutral-200 p-4">
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      <BadgeCheck className="h-4 w-4" />
                      <p className="font-mono text-xs uppercase tracking-widest">Status</p>
                    </div>
                    <p className="font-display text-xl uppercase tracking-normal text-neutral-950">
                      {statusText}
                    </p>
                  </div>

                  <div className="border border-neutral-200 p-4">
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      <BriefcaseBusiness className="h-4 w-4" />
                      <p className="font-mono text-xs uppercase tracking-widest">Position</p>
                    </div>
                    <p className="text-sm text-neutral-950">
                      {employee?.position || "Not provided"}
                    </p>
                  </div>
                  </div>
                )}

                <Link
                  href="/"
                  className="mt-6 inline-flex w-full items-center justify-center bg-primary px-5 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary/90"
                >
                  Home
                </Link>
              </div>

              {employee && (
                <div className="mt-4 hidden border border-primary/30 bg-white px-4 py-3 text-center shadow-sm lg:block">
                  <p className="text-sm font-semibold leading-relaxed text-neutral-800">
                    If you found this ID, please return it or call{" "}
                    <a href="tel:+639178241220" className="text-primary hover:underline">
                      0917 824 1220
                    </a>{" "}
                    or email us at{" "}
                    <a
                      href="mailto:contactus@technoshineph.com"
                      className="text-primary hover:underline"
                    >
                      contactus@technoshineph.com
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
