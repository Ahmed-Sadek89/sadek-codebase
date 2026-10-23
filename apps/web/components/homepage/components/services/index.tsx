"use client";

import { useTranslations } from "next-intl";
import type { WhatCanDo } from "@repo/types/what-can-do";
import type { InfiniteQueryState } from "../../utils";
import { SectionTitle } from "../../../ui/section-title";
import { SectionStatus } from "../../../ui/section-status";
import { AccordionList } from "../../../ui/accordion";
import { ShowMoreButton } from "../../../ui/show-more-button";
import { useServiceItems } from "./hooks";

export function Services({
  services: query,
}: {
  /** The loaded pages, plus "show more": `hasMore`, `isLoadingMore`, `loadMore`. */
  services: InfiniteQueryState<WhatCanDo>;
}) {
  const t = useTranslations();
  const services = useServiceItems(query.data);
  return (
    <section
      id="services"
      className="relative isolate overflow-hidden bg-surface py-[76px] max-[700px]:py-[54px]"
    >
      <div
        aria-hidden="true"
        className="absolute -end-32 top-1/4 -z-10 size-80 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="app-container py-0">
        <SectionTitle title={t("servicesTitle")} copy={t("servicesCopy")} />
        {services.length ? (
          // One item open at a time; the first starts open and can be closed.
          <AccordionList className="mx-auto max-w-[900px]" items={services} />
        ) : (
          <SectionStatus
            isLoading={query.isLoading}
            isError={query.isError}
            emptyText={t("servicesEmpty")}
          />
        )}
        {services.length > 0 && query.hasMore && (
          <ShowMoreButton
            isLoading={query.isLoadingMore}
            onClick={query.loadMore}
          />
        )}
      </div>
    </section>
  );
}
