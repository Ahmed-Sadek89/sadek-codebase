"use client";

import { useMemo } from "react";
import type {
  PublicCategorySkill,
  PublicCategorySkillItem,
} from "@repo/types/category-skills";
import { fillTrack, tickerDuration, toSkillGroups } from "../utils";

/** The loaded categories that have skills, one stream each. */
export function useSkillGroups(categories: PublicCategorySkill[]) {
  return useMemo(() => toSkillGroups(categories), [categories]);
}

/** A row's ticker track (short lists repeated) and the duration that keeps it slow. */
export function useTickerTrack(skills: PublicCategorySkillItem[]) {
  return useMemo(() => {
    const track = fillTrack(skills);
    return { track, duration: tickerDuration(track.length) };
  }, [skills]);
}
