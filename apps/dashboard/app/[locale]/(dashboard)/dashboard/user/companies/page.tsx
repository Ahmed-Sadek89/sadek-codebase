import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { userCompanyService } from "@repo/services/user-company";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../../libs/auth";
import UserCompaniesPage from "../../../../../../components/user-companies";
import { TableContentSkeleton } from "../../../../../../components/ui/skeleton/table-content-skeleton";
import { getUserCompaniesQuery } from "../../../../../../components/user-companies/utils/constants";
import {
  readListQueryParams,
  recordParamReader,
} from "../../../../../../utils/list-query";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaUserCompaniesTitle"),
    description: t("metaUserCompaniesDescription"),
  };
}

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/dashboard/user/companies">) {
  // ?search=&page=&limit=&order= (any combination). The client builds the same
  // query from useSearchParams, so the prefetch key matches.
  const query = getUserCompaniesQuery(
    readListQueryParams(recordParamReader(await searchParams)),
  );
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    await queryClient.query({
      queryKey: queryKeys.userCompany.mine(query),
      queryFn: () => userCompanyService.findMine(query, { accessToken }),
    });
  }

  return (
    <Suspense fallback={<TableContentSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserCompaniesPage />
      </HydrationBoundary>
    </Suspense>
  );
}
