import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { contactsService } from "@repo/services/contacts";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../libs/auth";
import ContactsPage from "../../../../../components/contacts";
import { TableContentSkeleton } from "../../../../../components/ui/skeleton/table-content-skeleton";
import { getContactsQuery } from "../../../../../components/contacts/utils/constants";
import {
  readListQueryParams,
  recordParamReader,
} from "../../../../../utils/list-query";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaContactsTitle"),
    description: t("metaContactsDescription"),
  };
}

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/dashboard/contacts">) {
  // ?search=&page=&limit=&order= (any combination). The client builds the same
  // query from useSearchParams, so the prefetch key matches.
  const query = getContactsQuery(
    readListQueryParams(recordParamReader(await searchParams)),
  );
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    await queryClient.query({
      queryKey: queryKeys.contacts.list(query),
      queryFn: () => contactsService.findAll(query, { accessToken }),
    });
  }

  return (
    <Suspense fallback={<TableContentSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ContactsPage />
      </HydrationBoundary>
    </Suspense>
  );
}
