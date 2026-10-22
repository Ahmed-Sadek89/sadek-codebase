"use client";

import { useMemo } from "react";
import type { CategorySkill } from "@repo/types/category-skills";
import type { Skill } from "@repo/types/skills";
import { groupSkillsByCategory } from "../utils";

/** Each skill category with its skills, for the right-hand column. */
export function useSkillGroups(categories: CategorySkill[], skills: Skill[]) {
  return useMemo(
    () => groupSkillsByCategory(categories, skills),
    [categories, skills],
  );
}
