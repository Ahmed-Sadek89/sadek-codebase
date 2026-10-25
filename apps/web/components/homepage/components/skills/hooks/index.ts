"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { PublicCategorySkill } from "@repo/types/category-skills";
import { toSkillGroups } from "../utils";

/** The loaded categories that have skills, one tab each. */
export function useSkillGroups(categories: PublicCategorySkill[]) {
  return useMemo(() => toSkillGroups(categories), [categories]);
}

/** Whether `query` matches; false on the server and during hydration. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
