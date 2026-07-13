import { addToast, closeToast } from "@heroui/react";

type TransactionTone = "success" | "danger" | "warning" | "primary" | "default";

type TransactionToastOptions = {
  title: string;
  description?: string;
  timeout?: number;
};

const toneStyles: Record<TransactionTone, string> = {
  success:
    "!border-l-[6px] !border-l-emerald-500 !bg-emerald-50/95 !text-emerald-700 !ring-emerald-200",
  danger:
    "!border-l-[6px] !border-l-red-500 !bg-red-50/95 !text-red-700 !ring-red-200",
  warning:
    "!border-l-[6px] !border-l-amber-500 !bg-amber-50/95 !text-amber-700 !ring-amber-200",
  primary:
    "!border-l-[6px] !border-l-primary !bg-orange-50/95 !text-primary !ring-orange-200",
  default:
    "!border-l-[6px] !border-l-slate-400 !bg-slate-50/95 !text-slate-600 !ring-slate-200",
};

function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (typeof error === "string" && error.trim()) return error;
  return error instanceof Error && error.message ? error.message : fallback;
}

function showTransactionToast(tone: TransactionTone, options: TransactionToastOptions) {
  return addToast({
    title: options.title,
    description: options.description,
    color: tone,
    severity: tone,
    variant: "flat",
    radius: "md",
    timeout: options.timeout ?? 4600,
    shouldShowTimeoutProgress: true,
    classNames: {
      base: [
        "z-[9999] min-h-16 overflow-hidden bg-white pr-12 text-neutral-950 shadow-[0_18px_48px_rgba(8,8,8,0.18)]",
        "ring-1 ring-black/10 backdrop-blur-md",
        toneStyles[tone],
      ].join(" "),
      content: "!items-start !gap-x-3",
      wrapper: "!min-w-0 !gap-y-1",
      title:
        "!block !whitespace-normal !overflow-visible !text-clip font-display text-sm font-bold uppercase tracking-wide !text-neutral-950",
      description:
        "!block !whitespace-normal !overflow-visible !text-clip font-sans text-sm leading-5 !text-neutral-600",
      icon: "!mt-0.5 !text-current",
      closeButton:
        "!right-2 !top-2 !h-7 !w-7 !min-w-7 !border !border-neutral-200 !bg-white !text-neutral-500 !opacity-100 !shadow-sm hover:!bg-neutral-100 hover:!text-neutral-950",
      closeIcon: "!border-0 !bg-transparent !p-1 !text-current",
      progressTrack: "!inset-x-0 !bottom-0 !top-auto !h-1 !rounded-none !bg-neutral-200",
      progressIndicator: "!h-full !bg-current !opacity-70",
    },
  });
}

export const transactionToast = {
  // Always use this helper for visible transactions: login, logout, save, edit, upload, publish, delete, and form submit.
  success(title: string, description?: string) {
    return showTransactionToast("success", { title, description });
  },
  upload(title: string, description?: string) {
    return showTransactionToast("success", { title, description });
  },
  draft(title: string, description?: string) {
    return showTransactionToast("default", { title, description });
  },
  deleted(title: string, description?: string) {
    return showTransactionToast("danger", { title, description, timeout: 5600 });
  },
  error(title: string, error?: unknown, fallback?: string) {
    return showTransactionToast("danger", {
      title,
      description: getErrorMessage(error, fallback),
      timeout: 6500,
    });
  },
  warning(title: string, description?: string) {
    return showTransactionToast("warning", { title, description, timeout: 5600 });
  },
  info(title: string, description?: string) {
    return showTransactionToast("default", { title, description });
  },
  loading(title: string, description?: string) {
    return showTransactionToast("default", { title, description, timeout: 0 });
  },
  close(key: string | null) {
    if (key) closeToast(key);
  },
};

export { getErrorMessage };
