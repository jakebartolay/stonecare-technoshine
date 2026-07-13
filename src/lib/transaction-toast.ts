import { addToast, closeToast } from "@heroui/react";

type TransactionTone = "success" | "danger" | "warning" | "primary" | "default";

type TransactionToastOptions = {
  title: string;
  description?: string;
  timeout?: number;
};

const toneStyles: Record<TransactionTone, string> = {
  success: "border-l-4 border-l-emerald-500",
  danger: "border-l-4 border-l-red-500",
  warning: "border-l-4 border-l-amber-500",
  primary: "border-l-4 border-l-primary",
  default: "border-l-4 border-l-neutral-400",
};

function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
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
        toneStyles[tone],
        "z-[9999] min-h-16 overflow-hidden bg-white pr-12 text-neutral-950 shadow-[0_18px_48px_rgba(8,8,8,0.18)]",
        "ring-1 ring-black/10 backdrop-blur-md",
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
    return showTransactionToast("primary", { title, description });
  },
  loading(title: string, description?: string) {
    return showTransactionToast("default", { title, description, timeout: 0 });
  },
  close(key: string | null) {
    if (key) closeToast(key);
  },
};

export { getErrorMessage };
