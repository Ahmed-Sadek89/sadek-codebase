import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import { localize } from "../../../../../utils/localize";
import { formatWorkPeriod, getHostname } from "../utils";

export function ExperienceItem({ company }: { company: UserCompany }) {
  const t = useTranslations();
  const locale = useLocale();
  const description = localize(
    locale,
    company.description_en,
    company.description_ar,
  );
  return (
    <article className="relative pt-6 before:absolute before:top-[3px] before:size-2 before:rounded-full before:bg-primary before:content-[''] max-[700px]:pt-0 max-[700px]:pb-[18px] max-[700px]:ps-[22px] max-[700px]:before:start-0">
      <span className="text-[9px] text-primary">
        {formatWorkPeriod(company, locale, t("experiencePresent"))}
      </span>
      <h3 className="mt-2 mb-0.5 flex items-center gap-1.5 text-[13px]">
        {company.logo && (
          <Image
            alt=""
            className="size-4 rounded-sm object-contain"
            height={16}
            src={company.logo}
            unoptimized
            width={16}
          />
        )}
        {localize(locale, company.name_en, company.name_ar)}
      </h3>
      {company.company_site && (
        <a
          className="text-[10px] font-bold text-secondary-foreground no-underline hover:text-primary"
          dir="ltr"
          href={company.company_site}
          rel="noreferrer"
          target="_blank"
        >
          {getHostname(company.company_site)}
        </a>
      )}
      {description && (
        <p className="text-[10px] leading-[1.65] text-muted-foreground">
          {description}
        </p>
      )}
    </article>
  );
}
