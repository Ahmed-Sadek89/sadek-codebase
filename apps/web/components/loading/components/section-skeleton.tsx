import { Skeleton } from "@repo/ui/skeleton";
import { cn } from "@repo/ui/utils";

export function SectionSkeleton({
  background,
  rows,
}: {
  background: string;
  rows: number;
}) {
  return (
    <section
      className={cn("w-full py-[76px] max-[700px]:py-[54px]", background)}
    >
      <div className="app-container py-0">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="mx-auto flex max-w-[820px] flex-col gap-4">
          {Array.from({ length: rows }, (_, i) => (
            <Skeleton className="h-16 w-full" key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
