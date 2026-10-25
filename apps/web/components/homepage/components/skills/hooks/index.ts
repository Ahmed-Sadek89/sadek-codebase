"use client";

import { useMemo, useState } from "react";
import type {
  PublicCategorySkill,
  PublicCategorySkillItem,
} from "@repo/types/category-skills";
import { SKILLS_COLLAPSED_COUNT, toSkillGroups } from "../utils";

/** The loaded categories that have skills, one card each. */
export function useSkillGroups(categories: PublicCategorySkill[]) {
  return useMemo(() => toSkillGroups(categories), [categories]);
}

/** A card's chips: the first SKILLS_COLLAPSED_COUNT until expanded. */
export function useVisibleSkills(skills: PublicCategorySkillItem[]) {
  const [isExpanded, setIsExpanded] = useState(false);
  const canToggle = skills.length > SKILLS_COLLAPSED_COUNT;
  return {
    visible:
      canToggle && !isExpanded
        ? skills.slice(0, SKILLS_COLLAPSED_COUNT)
        : skills,
    hiddenCount: skills.length - SKILLS_COLLAPSED_COUNT,
    isExpanded,
    canToggle,
    toggle: () => setIsExpanded((expanded) => !expanded),
  };
}
