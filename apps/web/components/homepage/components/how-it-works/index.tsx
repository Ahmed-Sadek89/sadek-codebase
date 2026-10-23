"use client";

import { useTranslations } from "next-intl";
import type { PublicUserInfoResponse } from "@repo/types/user-info";
import { SectionTitle } from "../../../ui/section-title";
import type { QueryState } from "../../utils";
import { CoverBackdrop, StepCard, WorkTogether } from "./components";
import { useCoverPhoto } from "./hooks";
import { steps } from "./utils";

/**
 * How I work, set on the owner's cover photo: the process steps as glass
 * cards, then the "let's work together" call to action.
 */
export function HowItWorks({
  userInfo,
}: {
  userInfo: QueryState<PublicUserInfoResponse | undefined>;
}) {
  const t = useTranslations();
  const coverPhoto = useCoverPhoto(userInfo.data);
  return (
    <section
      aria-labelledby="how-it-works-title"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <CoverBackdrop src={coverPhoto} />
      {/* Dark tokens over the photo, in light and dark mode alike. */}
      <div className="dark app-container py-0 text-foreground">
        <SectionTitle
          id="how-it-works-title"
          title={t("howTitle")}
          copy={t("howCopy")}
        />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => (
            <StepCard
              index={index}
              isLast={index === steps.length - 1}
              key={step.titleKey}
              step={step}
            />
          ))}
        </ol>
        <WorkTogether />
      </div>
    </section>
  );
}
