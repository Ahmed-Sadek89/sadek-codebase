"use client";

export { queryKeys } from "@repo/utils/query-keys";

export {
  useAuthSession,
  useLogin,
  useRefreshToken,
  useChangePassword,
  useLogout,
} from "./auth";

export {
  useGuardedMutation,
  useGuardedQuery,
  usePublicMutation,
  usePublicQuery,
} from "./api";
export type {
  GuardedMutationOptions,
  GuardedQueryOptions,
  PublicMutationOptions,
  PublicQueryOptions,
} from "./api";

export {
  useCategorySkill,
  useCategorySkills,
  useCreateCategorySkill,
  useDeleteCategorySkill,
  useUpdateCategorySkill,
} from "./category-skills";

export {
  useCreateSkill,
  useDeleteSkill,
  useSkill,
  useSkills,
  useUpdateSkill,
} from "./skills";

export {
  useCategoryProject,
  useCategoryProjects,
  useCreateCategoryProject,
  useDeleteCategoryProject,
  useUpdateCategoryProject,
} from "./category-projects";

export {
  useCreateProject,
  useDeleteProject,
  useProject,
  useProjects,
  useUpdateProject,
} from "./projects";
