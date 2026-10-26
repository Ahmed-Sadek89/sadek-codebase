import type {
  InstructorExperience,
  InstructorExperiencesQuery,
} from "@repo/types/instructor-experience";
import { plainTextToHtml } from "@repo/rich-text";
import {
  readListQueryParams,
  readPositiveInt,
  type ParamReader,
} from "../../../utils/list-query";
import { SKILL_ID_PARAM } from "../../../utils/constants";
import type { InstructorExperienceFormInput } from "../schema";

/** Page size when the URL has no `?limit=`. */
export const INSTRUCTOR_EXPERIENCES_LIMIT = 10;

export const INSTRUCTOR_EXPERIENCES_HREF = "/dashboard/instructor-experience";

/**
 * The list query for the URL's `search`, `page`, `limit`, `order`,
 * `isActive`, and `skillId` (any combination). Shared by the server prefetch
 * and the client hook so both build the same query key.
 */
export function getInstructorExperiencesQuery(
  get: ParamReader,
): InstructorExperiencesQuery {
  const skillId = readPositiveInt(get(SKILL_ID_PARAM));
  return {
    limit: INSTRUCTOR_EXPERIENCES_LIMIT,
    ...readListQueryParams(get),
    ...(skillId !== undefined && { skillId }),
  };
}

export const INSTRUCTOR_EXPERIENCE_FORM_DEFAULT_VALUES = {
  name: "",
  courseLink: "",
  coverPhotoUrl: "",
  descriptionEn: "",
  descriptionAr: "",
  startAt: "",
  endAt: "",
  coursePlatformName: "",
  coursePlatformUrl: "",
  rank: "0",
  isActive: true,
  skills: [],
} satisfies InstructorExperienceFormInput;

/** An ISO date as the `YYYY-MM-DD` a date input holds. */
export function toDateInput(iso: string): string {
  return iso.slice(0, 10);
}

/** Form values for a row being edited, or the blank defaults when creating. */
export function toInstructorExperienceFormInput(
  row?: InstructorExperience | null,
): InstructorExperienceFormInput {
  if (!row) return INSTRUCTOR_EXPERIENCE_FORM_DEFAULT_VALUES;
  return {
    name: row.name,
    courseLink: row.courseLink,
    coverPhotoUrl: row.coverPhotoUrl ?? "",
    descriptionEn: plainTextToHtml(row.descriptionEn),
    descriptionAr: plainTextToHtml(row.descriptionAr),
    startAt: toDateInput(row.startAt),
    endAt: toDateInput(row.endAt),
    coursePlatformName: row.coursePlatformName,
    coursePlatformUrl: row.coursePlatformUrl,
    rank: String(row.rank),
    isActive: row.isActive,
    skills: row.skills.map(({ id, name }) => ({ id, name })),
  };
}
