import { HeroSkeleton, SectionSkeleton } from "./components";
import { skeletonSections } from "./utils";

/** Homepage placeholder streamed by app/loading.tsx while the data loads. */
export function HomePageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="overflow-hidden">
      <HeroSkeleton />
      {skeletonSections.map((section) => (
        <SectionSkeleton
          background={section.background}
          key={section.id}
          rows={section.rows}
        />
      ))}
    </div>
  );
}
