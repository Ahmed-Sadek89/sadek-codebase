import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { userInfoService } from "@repo/services/user-info";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../../libs/auth";
import UserInfoPage from "../../../../../../components/user-info";
import { UserInfoSkeleton } from "../../../../../../components/ui/skeleton/user-info-skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaUserInfoTitle"),
    description: t("metaUserInfoDescription"),
  };
}

export default async function Page() {
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    // A 404 (no row yet) or any other failure is not dehydrated, so the
    // client hook fetches again and shows the empty or error state.
    await queryClient
      .query({
        queryKey: queryKeys.userInfo.mine(),
        queryFn: () => userInfoService.findMine({ accessToken }),
      })
      .catch(() => undefined);
  }

  return (
    <Suspense fallback={<UserInfoSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserInfoPage />
      </HydrationBoundary>
    </Suspense>
  );
}
