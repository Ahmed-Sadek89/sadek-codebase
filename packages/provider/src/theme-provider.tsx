"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export { useTheme } from "next-themes";

// next-themes injects an inline script that applies the theme before first paint.
// It only needs to run in the server HTML. When React renders it on the client
// (e.g. a root layout remount after a locale change) it never executes and React
// warns, so mark it as an inert data block there. The script already suppresses
// hydration warnings, so the differing `type` is safe.
const themeScriptProps = {
  type: typeof window === "undefined" ? "text/javascript" : "text/plain",
};

/** Toggles the `.dark` class that switches the color tokens in @repo/ui/global.css. */
export function ThemeProvider(
  props: ComponentProps<typeof NextThemesProvider>,
) {
  return (
    <NextThemesProvider
      attribute="class"
      disableTransitionOnChange
      scriptProps={themeScriptProps}
      {...props}
    />
  );
}
