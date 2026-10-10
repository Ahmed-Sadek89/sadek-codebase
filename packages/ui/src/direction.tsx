"use client";

import type { ReactNode } from "react";
import { Direction } from "radix-ui";

type Dir = "ltr" | "rtl";

// Radix primitives (select, dropdown, collapsible…) read the reading direction from here.
export function DirectionProvider({
  dir,
  children,
}: {
  dir: Dir;
  children: ReactNode;
}) {
  return <Direction.Provider dir={dir}>{children}</Direction.Provider>;
}

export function useDirection(): Dir {
  return Direction.useDirection();
}
