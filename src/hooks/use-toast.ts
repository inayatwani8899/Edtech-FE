import * as React from "react"
import { toast as sonnerToast } from "sonner"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

function toast({ title, description, variant, ...props }: ToastProps & { title?: React.ReactNode; description?: React.ReactNode }) {
  const message = title ? String(title) : (description ? String(description) : "");
  const options = title && description ? { description: String(description) } : {};

  if (variant === "destructive") {
    sonnerToast.error(message, options);
  } else if (variant === "success") {
    sonnerToast.success(message, options);
  } else {
    // Check if variant/type indicates positive confirmation
    const isSuccess = variant === "success" || (props as any).type === "success";
    if (isSuccess) {
      sonnerToast.success(message, options);
    } else {
      sonnerToast(message, options);
    }
  }

  return {
    id: String(Math.random()),
    dismiss: () => {},
    update: () => {},
  }
}

function useToast() {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  return {
    toasts,
    toast,
    dismiss: () => {},
  }
}

export { useToast, toast }
