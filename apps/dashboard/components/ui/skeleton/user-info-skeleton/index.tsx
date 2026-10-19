import { useTranslations } from "next-intl";
import { Skeleton } from "@repo/ui/skeleton";
import { USER_INFO_LINKS, USER_INFO_STATS } from "../../../user-info/utils/constants";

/** Loading placeholder shaped like UserInfoView (also the page's Suspense fallback). */
export function UserInfoSkeleton() {
  const t = useTranslations();

  return (
    <div aria-busy="true" className="space-y-6">
      <span className="sr-only">{t("tableLoading")}</span>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="space-y-3 rounded-xl border bg-card p-6 shadow-sm">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-3/4 max-w-lg" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {USER_INFO_STATS.map(({ field }) => (
          <div
            key={field}
            className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm"
          >
            <Skeleton className="size-11 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <Skeleton className="h-5 w-32" />
          {USER_INFO_LINKS.map(({ field }) => (
            <div key={field} className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
