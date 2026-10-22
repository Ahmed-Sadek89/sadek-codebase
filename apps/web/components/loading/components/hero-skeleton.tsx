import { Skeleton } from "@repo/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="app-container flex min-h-[650px] flex-col items-center py-[76px] max-[700px]:min-h-[590px] max-[700px]:py-[54px]">
      <Skeleton className="mb-3 size-[100px] rounded-full" />
      <Skeleton className="mb-[14px] h-3 w-40" />
      <Skeleton className="mb-3 h-14 w-full max-w-[760px] max-[700px]:h-8" />
      <Skeleton className="mb-[14px] h-14 w-full max-w-[560px] max-[700px]:h-8" />
      <Skeleton className="mb-2 h-3 w-full max-w-[620px]" />
      <Skeleton className="mb-[18px] h-3 w-full max-w-[480px]" />
      <div className="flex gap-2.5">
        <Skeleton className="h-9 w-32 rounded-[30px]" />
        <Skeleton className="h-9 w-28 rounded-[30px]" />
      </div>
    </section>
  );
}
