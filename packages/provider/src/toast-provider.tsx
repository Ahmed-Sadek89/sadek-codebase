"use client";

import type { CSSProperties, ComponentProps } from "react";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

// Sonner reads these variables, so toasts follow the @repo/ui/global.css tokens.
const toasterStyle = {
  "--normal-bg": "var(--card)",
  "--normal-text": "var(--card-foreground)",
  "--normal-border": "var(--border)",
} as CSSProperties;

/** Renders toasts fired with `toast` from @repo/libs/toast. Must sit inside ThemeProvider. */
export function ToastProvider(props: ComponentProps<typeof Toaster>) {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position={props.dir === "rtl" ? "bottom-right" : "bottom-left"}
      richColors
      closeButton
      style={toasterStyle}
      {...props}
    />
  );
}
