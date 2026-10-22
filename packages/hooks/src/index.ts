"use client";

export { queryKeys } from "@repo/utils/query-keys";

export {
  useAuthSession,
  useMe,
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
  usePublicCategorySkills,
  useCreateCategorySkill,
  useDeleteCategorySkill,
  useUpdateCategorySkill,
} from "./category-skills";

export {
  useCreateSkill,
  useDeleteSkill,
  useSkill,
  useSkills,
  usePublicSkills,
  useUpdateSkill,
} from "./skills";

export {
  useCategoryProject,
  useCategoryProjects,
  usePublicCategoryProjects,
  useCreateCategoryProject,
  useDeleteCategoryProject,
  useUpdateCategoryProject,
} from "./category-projects";

export {
  useCreateProject,
  useDeleteProject,
  useProject,
  useProjects,
  usePublicProjects,
  useUpdateProject,
} from "./projects";

export {
  useCreateUserInfo,
  useDeleteUserInfo,
  useMyUserInfo,
  useUpdateUserInfo,
  useUserInfo,
  useUserInfos,
  usePublicUserInfo,
} from "./user-info";

export {
  useCreateUserCompany,
  useDeleteUserCompany,
  useMyUserCompanies,
  useUpdateUserCompany,
  useUserCompanies,
  usePublicUserCompanies,
  useUserCompany,
} from "./user-company";

export {
  useCreateWhatCanDo,
  useDeleteWhatCanDo,
  useMyWhatCanDos,
  useUpdateWhatCanDo,
  useWhatCanDo,
  useWhatCanDos,
  usePublicWhatCanDos,
} from "./what-can-do";

export {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUpdateUserDefaultView,
  useUser,
  useUserByEmail,
  useUsers,
} from "./users";
