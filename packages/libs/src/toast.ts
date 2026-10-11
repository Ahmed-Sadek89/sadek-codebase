import { toast, type ExternalToast } from "sonner";
import { getApiErrorMessage } from "./axios";

export { toast };
export type { ExternalToast };

export type ToastStatus = "success" | "error" | "info";
export type ToastDirection = "ltr" | "rtl";

export type ShowToastOptions = Omit<ExternalToast, "description"> & {
  title: string;
  description?: string;
  /** Picks the icon and colors. Defaults to "info". */
  status?: ToastStatus;
  /** Text direction of this toast; inherits the Toaster's when omitted. */
  dir?: ToastDirection;
};

/** Shows one toast; returns its id so it can be updated or dismissed. */
export function showToast({
  title,
  description,
  status = "info",
  dir,
  style,
  ...options
}: ShowToastOptions) {
  return toast[status](title, {
    ...options,
    description,
    style: dir ? { direction: dir, ...style } : style,
  });
}

/**
 * Shows the API's error message (or a generic fallback) as an error toast.
 * With a `title`, the message becomes the description instead.
 */
export function toastApiError(
  error: unknown,
  { title, ...options }: Partial<Omit<ShowToastOptions, "status">> = {},
) {
  const message = getApiErrorMessage(error);
  return showToast({
    ...options,
    status: "error",
    title: title ?? message,
    description: title ? message : options.description,
  });
}
