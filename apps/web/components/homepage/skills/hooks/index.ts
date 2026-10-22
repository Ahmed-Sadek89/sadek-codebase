"use client";

import { useMemo } from "react";
import { usePublicCategorySkills } from "@repo/hooks/category-skills";
import { usePublicSkills } from "@repo/hooks/skills";
import { categorySkillsQuery, skillsQuery } from "../../utils";
import { groupSkillsByCategory } from "../utils";

/** GET /skills/public and GET /category-skills/public, grouped for display. */
export function useSkillsContent() {
  const skills = usePublicSkills(skillsQuery);
  const categories = usePublicCategorySkills(categorySkillsQuery);

  const groups = useMemo(
    () =>
      groupSkillsByCategory(
        categories.data?.data ?? [],
        skills.data?.data ?? [],
      ),
    [categories.data, skills.data],
  );

  return {
    skills: skills.data?.data ?? [],
    groups,
    isPending: skills.isPending,
  };
}
