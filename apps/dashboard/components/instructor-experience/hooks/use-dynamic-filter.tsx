"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Sparkles } from "@repo/ui/icons";
import { SkillsFilter } from "../../ui/filters/skills";
import { updateUrlParams } from "../../../utils/url-params";
import { readPositiveInt } from "../../../utils/list-query";
import { PAGE_PARAM, SKILL_ID_PARAM } from "../../../utils/constants";
import type { DynamicFilter } from "../../ui/dynamic-table/types/types";

/**
 * The instructor experience table's dynamic (input) filters, bound to the URL:
 * - Skill: a searchable select of the user's skills → `?skillId=<id>`, which
 *   `getInstructorExperiencesQuery` sends to GET /instructor-experience as `skillId`.
 * Pass the result to `<DynamicTable dynamicFilter={...} />`.
 */
export function useDynamicFilter(): DynamicFilter[] {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const skillId = readPositiveInt(searchParams.get(SKILL_ID_PARAM)) ?? null;

  // A new filter starts from the first page; other params stay.
  const onSkillChange = useCallback((id: number | null) => {
    updateUrlParams({
      [SKILL_ID_PARAM]: id === null ? null : String(id),
      [PAGE_PARAM]: null,
    });
  }, []);

  return useMemo(
    () => [
      {
        paramName: SKILL_ID_PARAM,
        label: t("tableSkillFilterLabel"),
        icon: Sparkles,
        content: <SkillsFilter value={skillId} onChange={onSkillChange} />,
      },
    ],
    [onSkillChange, skillId, t],
  );
}
