"use client";

import { useMemo } from "react";
import type { PublicCategorySkill } from "@repo/types/category-skills";
import { toSkillGroups } from "../utils";

/** The loaded categories that have skills, one tab each. */
export function useSkillGroups(categories: PublicCategorySkill[]) {
  return useMemo(() => toSkillGroups(categories), [categories]);
}
