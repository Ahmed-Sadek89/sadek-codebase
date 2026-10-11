"use client";

import { useMemo } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useCategorySkills } from "@repo/hooks/category-skills";
import { DynamicTable } from "../ui/dynamic-table";
import { createCategorySkillsColumns } from "./utils/columns";
import { CATEGORY_SKILLS_QUERY } from "./utils/constants";

/** All category-skills page content. Data is prefetched in the route's page.tsx. */
export default function CategorySkillsPage() {
  const t = useTranslations();
  const format = useFormatter();
  // Same query as the server prefetch, so the hydrated cache is reused.
  const { data, isPending, isError, refetch } = useCategorySkills(
    CATEGORY_SKILLS_QUERY,
  );
  // Stable columns: TanStack Table rebuilds its models when they change.
  const columns = useMemo(
    () => createCategorySkillsColumns(t, format),
    [t, format],
  );

  return (
    <main className="space-y-6">
      <DynamicTable
        title={t("categorySkillsTitle")}
        description={t("categorySkillsDescription")}
        columns={columns}
        data={data?.data}
        getRowId={(category) => String(category.id)}
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
    </main>
  );
}
