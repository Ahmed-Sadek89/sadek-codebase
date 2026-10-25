import { Skeleton } from "@repo/ui/skeleton";

function CardSkeleton({ rows, tall = false }: { rows: number; tall?: boolean }) {
  return (
    <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <Skeleton className="h-4 w-32" />
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className={tall ? "h-44 w-full" : "h-9 w-full"} />
      ))}
    </div>
  );
}

/** Placeholder with the project page's shape: action bar, main column, side panel. */
export function ProjectFormSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <Skeleton className="size-9 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="hidden h-9 w-40 sm:block" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <CardSkeleton rows={2} />
          <CardSkeleton rows={2} tall />
        </div>
        <div className="space-y-6">
          <CardSkeleton rows={1} tall />
          <CardSkeleton rows={1} />
          <CardSkeleton rows={2} />
        </div>
      </div>
    </div>
  );
}
