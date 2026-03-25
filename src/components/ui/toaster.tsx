import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={3000}>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const Icon =
          variant === "destructive"
            ? AlertCircle
            : variant === "success"
              ? CheckCircle2
              : Info

        const iconClasses =
          variant === "destructive"
            ? "bg-white/15 text-white"
            : variant === "success"
              ? "bg-white/15 text-white"
              : "bg-white/10 text-white"

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex w-full items-center justify-center gap-4 pr-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-inner ${iconClasses}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="grid flex-1 gap-1 text-center">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
