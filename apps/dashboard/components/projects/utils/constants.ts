import type { Project, ProjectsQuery } from "@repo/types/projects";
import {
  readListQueryParams,
  readPositiveInt,
  type ParamReader,
} from "../../../utils/list-query";
import { CATEGORY_ID_PARAM } from "../../../utils/constants";
import type { ProjectFormInput } from "../schema";

/** Characters of a description shown in a table row (full text on hover). */
export const PROJECT_DESCRIPTION_PREVIEW_MAX = 60;

/** Page size when the URL has no `?limit=`. */
export const PROJECTS_LIMIT = 10;

/**
 * The list query for the URL's `search`, `page`, `limit`, `order`,
 * `isActive`, and `categoryId` (any combination). Shared by the server
 * prefetch and the client hook so both build the same query key.
 * `categoryId` is read here, not in readListQueryParams, because only some
 * list endpoints accept it (the others reject unknown params).
 */
export function getProjectsQuery(get: ParamReader): ProjectsQuery {
  const categoryId = readPositiveInt(get(CATEGORY_ID_PARAM));
  return {
    limit: PROJECTS_LIMIT,
    ...readListQueryParams(get),
    ...(categoryId !== undefined && { categoryId }),
  };
}

export const PROJECT_FORM_DEFAULT_VALUES = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  mainImageUrl: "",
  liveUrl: "",
  repoUrl: "",
  isActive: true,
  categoryProjects: [],
} satisfies ProjectFormInput;

/** Form values for a row being edited, or the blank defaults when creating. */
export function toProjectFormInput(project?: Project | null): ProjectFormInput {
  if (!project) return PROJECT_FORM_DEFAULT_VALUES;
  return {
    nameEn: project.nameEn,
    nameAr: project.nameAr,
    descriptionEn: project.descriptionEn,
    descriptionAr: project.descriptionAr,
    mainImageUrl: project.mainImageUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    repoUrl: project.repoUrl ?? "",
    isActive: project.isActive,
    categoryProjects: project.categoryProjects.map(({ id, nameAr, nameEn }) => ({
      id,
      nameAr,
      nameEn,
    })),
  };
}
