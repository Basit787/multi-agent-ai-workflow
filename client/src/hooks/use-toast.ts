import { type ExternalToast, toast } from "sonner";
import { toApiError } from "#/lib/parser";

function showSuccessToast(message: string, options?: ExternalToast) {
  toast.success(message, options);
}

function showErrorToast(error: unknown, options?: ExternalToast) {
  toast.error(toApiError(error).message, options);
}

const toasts = { showSuccessToast, showErrorToast };

export function useToast() {
  return toasts;
}
