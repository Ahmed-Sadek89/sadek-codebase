"use client";

import { useLocale, useTranslations } from "next-intl";
import type { UserInfoDetails } from "@repo/types/user-info";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Quote } from "@repo/ui/icons";
import { USER_INFO_LINKS, USER_INFO_STATS } from "../utils/constants";
import { localized } from "../../../utils/format";
import { ContactItem } from "./contact-item";
import { InfoStat } from "./info-stat";

type UserInfoViewProps = {
  userInfo: UserInfoDetails;
};

/** Read-only display of GET /user-info/me. */
export function UserInfoView({ userInfo }: UserInfoViewProps) {
  const t = useTranslations();
  const locale = useLocale();
  // Arabic shows the Arabic text when set; every other locale shows English.
  const text = (en: string, ar: string | null) => localized(locale, en, ar);

  return (
    <div className="space-y-6">
      <Card className="gap-3 px-6">
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          {t("userInfoHeadTitleLabel")}
        </p>
        <h2
          dir="auto"
          className="text-xl font-semibold break-words sm:text-2xl"
        >
          {text(userInfo.headTitle_en, userInfo.headTitle_ar)}
        </h2>
        <p dir="auto" className="flex gap-2 text-muted-foreground">
          <Quote
            className="mt-1 size-4 shrink-0 rtl:-scale-x-100"
            aria-hidden
          />
          <span className="break-words">
            {text(userInfo.shortDescription_en, userInfo.shortDescription_ar)}
          </span>
        </p>
      </Card>

      <section aria-label={t("userInfoSectionNumbers")}>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {USER_INFO_STATS.map(({ field, labelKey, icon }) => (
            <li key={field}>
              <InfoStat
                label={t(labelKey)}
                value={userInfo[field]}
                icon={icon}
              />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("userInfoAbout")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              dir="auto"
              className="leading-relaxed break-words whitespace-pre-line"
            >
              {text(userInfo.description_en, userInfo.description_ar)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("userInfoSectionLinks")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {USER_INFO_LINKS.map(({ field, labelKey, icon, href }) => {
                const value = userInfo[field];
                return (
                  <ContactItem
                    key={field}
                    label={t(labelKey)}
                    icon={icon}
                    value={value}
                    href={value ? href(value) : null}
                    linkText={field === "cv" ? t("userInfoOpenCv") : undefined}
                  />
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
