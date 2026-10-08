"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export { useTheme } from "next-themes";

/** Toggles the `.dark` class that switches the color tokens in @repo/ui/global.css. */
export function ThemeProvider(
  props: ComponentProps<typeof NextThemesProvider>,
) {
  return (
    <NextThemesProvider attribute="class" disableTransitionOnChange {...props} />
  );
}
