"use client";

import { useTranslations } from "next-intl";
import type { WhatCanDo } from "@repo/types/what-can-do";
import type { QueryState } from "../../utils";
import { SectionTitle } from "../section-title";
import { SectionStatus } from "../section-status";
import { ServiceRow } from "./components";
import { useSortedServices } from "./hooks";

export function Services({
  services: query,
}: {
  services: QueryState<WhatCanDo[]>;
}) {
  const t = useTranslations();
  const services = useSortedServices(query.data);
  return (
    <section
      id="services"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-surface"
    >
      <SectionTitle title={t("servicesTitle")} copy={t("servicesCopy")} />
      {services.length ? (
        <div className="border-t border-border">
          {services.map((service, index) => (
            <ServiceRow key={service.id} service={service} index={index} />
          ))}
        </div>
      ) : (
        <SectionStatus
          isLoading={query.isLoading}
          isError={query.isError}
          emptyText={t("servicesEmpty")}
        />
      )}
    </section>
  );
}
