"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCategorySkills } from "@repo/hooks/category-skills";
import { DynamicTable } from "../ui/dynamic-table";
import useColumns from "./hooks/use-columns";
import { readListQueryParams } from "../../utils/list-query";
import { getCategorySkillsQuery } from "./utils/constants";

/** All category-skills page content. Data is prefetched in the route's page.tsx. */
export default function CategorySkillsPage() {
  const t = useTranslations();
  // ?search=&page=&limit= (any combination); the search box writes ?search=.
  const searchParams = useSearchParams();
  // Same query as the server prefetch, so the hydrated cache is reused.
  // useSearchParams returns a new object only when the URL changes.
  const query = useMemo(
    () =>
      getCategorySkillsQuery(
        readListQueryParams((name) => searchParams.get(name)),
      ),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } =
    useCategorySkills(query);
  const columns = useColumns({busy: false});

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
        onReload={() => void refetch()}
        isRefreshing={isFetching}
        pagination={data}
        showCreate={true}
      />
    </main>
  );
}
