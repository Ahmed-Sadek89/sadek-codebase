import { useTranslations } from "next-intl";
import { HeroSkeleton, SectionSkeleton } from "./components";
import { skeletonSections } from "./utils";

/** Homepage placeholder streamed by app/[locale]/loading.tsx while the data loads. */
export function HomePageSkeleton() {
  const t = useTranslations();
  return (
    <div
      aria-busy="true"
      aria-label={t("loadingLabel")}
      className="overflow-hidden"
    >
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
