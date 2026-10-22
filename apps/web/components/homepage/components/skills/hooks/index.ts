"use client";

import { useMemo } from "react";
import type { PublicCategorySkill } from "@repo/types/category-skills";
import { toSkillGroups, uniqueSkills } from "../utils";

/**
 * GET /category-skills/public already embeds each category's skills: the
 * chips list every skill once, the groups list them per category.
 */
export function useSkillsContent(categories: PublicCategorySkill[]) {
  return useMemo(
    () => ({
      skills: uniqueSkills(categories),
      groups: toSkillGroups(categories),
    }),
    [categories],
  );
}
