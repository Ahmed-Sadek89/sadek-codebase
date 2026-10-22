"use client";

import { useTranslations } from "next-intl";
import { SectionTitle } from "../components/section-title";
import { SectionStatus } from "../components/section-status";
import { ServiceRow } from "./components";
import { useServices } from "./hooks";

export function Services() {
  const t = useTranslations();
  const { services, isPending } = useServices();
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
        <SectionStatus isPending={isPending} emptyText={t("servicesEmpty")} />
      )}
    </section>
  );
}
