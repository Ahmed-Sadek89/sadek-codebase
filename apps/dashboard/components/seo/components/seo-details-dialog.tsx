"use client";

import Image from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { TwitterCard } from "@repo/constants/twitter-card";
import type { Seo } from "@repo/types/seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { ImageIcon, ScanSearch } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";
import { AppDialog } from "../../ui/dialog";
import { StatusBadgeCell } from "../../ui/cells";
import { SeoUrlsDetails } from "./seo-urls-details";
import { isMediaUrl } from "../../../libs/media";
import {
  getPreviewSite,
  getPreviewTexts,
  getRobotsBadge,
  PREVIEW_LANGUAGES,
  pageLabel,
  twitterCardLabelKey,
  type PreviewLanguage,
} from "../utils/constants";

/** The website's default tab icon (the dashboard serves the same file). */
const DEFAULT_SITE_ICON = "/icon.png";

type SeoDetailsDialogProps = {
  /** Kept while closing so the content doesn't vanish during the animation. */
  seo: Seo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** One SEO version as Google and a shared link would show it, opened from the View action. */
export function SeoDetailsDialog({
  seo,
  open,
  onOpenChange,
}: SeoDetailsDialogProps) {
  const t = useTranslations();
  const format = useFormatter();
  const locale = useLocale();
  if (!seo) return null;

  const details = [
    { label: t("seoDetailsJobTitle"), en: seo.jobTitle_en, ar: seo.jobTitle_ar },
    { label: t("seoDetailsKeywords"), en: seo.keywords_en, ar: seo.keywords_ar },
  ];

  return (
    <AppDialog
      Icon={ScanSearch}
      className="sm:max-w-3xl"
      description={t("seoDetailsDescription")}
      onOpenChange={onOpenChange}
      open={open}
      title={t("seoDetailsTitle", { id: seo.id })}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadgeCell value={pageLabel(locale, seo.page)} tone="primary" />
          <StatusBadgeCell
            value={seo.isActive ? t("seoStatusLive") : t("seoStatusDraft")}
            tone={seo.isActive ? "success" : "neutral"}
          />
          <StatusBadgeCell {...getRobotsBadge(seo)} />
          <span className="text-xs text-muted-foreground">
            {t("seoDetailsUpdatedAt", {
              date: format.dateTime(new Date(seo.updatedAt), {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            })}
          </span>
        </div>

        <Tabs defaultValue="en">
          <TabsList>
            {PREVIEW_LANGUAGES.map((language) => (
              <TabsTrigger key={language} value={language}>
                {language === "en" ? t("seoLanguageEn") : t("seoLanguageAr")}
              </TabsTrigger>
            ))}
          </TabsList>
          {PREVIEW_LANGUAGES.map((language) => (
            <TabsContent key={language} value={language} className="mt-4 space-y-5">
              <PreviewPanels seo={seo} language={language} />
              <dl className="grid gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm sm:grid-cols-2">
                {details.map(({ label, en, ar }) => {
                  const value = language === "ar" ? ar || en : en;
                  return (
                    <div key={label} className="min-w-0 space-y-1">
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd
                        dir={language === "ar" ? "rtl" : "ltr"}
                        className={cn("break-words", !value && "text-muted-foreground")}
                      >
                        {value || t("seoDetailsNotSet")}
                      </dd>
                    </div>
                  );
                })}
                <div className="min-w-0 space-y-1">
                  <dt className="text-xs text-muted-foreground">{t("seoFormTwitterHandleLabel")}</dt>
                  <dd dir="ltr" className={cn(!seo.twitterHandle && "text-muted-foreground")}>
                    {seo.twitterHandle || t("seoDetailsNotSet")}
                  </dd>
                </div>
                <div className="min-w-0 space-y-1">
                  <dt className="text-xs text-muted-foreground">{t("seoFormTwitterCardLabel")}</dt>
                  <dd>
                    {t(twitterCardLabelKey(seo.twitterCard))}
                  </dd>
                </div>
              </dl>
            </TabsContent>
          ))}
        </Tabs>

        <SeoUrlsDetails seo={seo} />
      </div>
    </AppDialog>
  );
}

/** The Google result and the shared-link card for one language. */
function PreviewPanels({ seo, language }: { seo: Seo; language: PreviewLanguage }) {
  const t = useTranslations();
  const texts = getPreviewTexts(seo, language);
  const site = getPreviewSite(seo) ?? t("seoPreviewSite");
  const dir = language === "ar" ? "rtl" : "ltr";
  const isLarge = seo.twitterCard === TwitterCard.SUMMARY_LARGE_IMAGE;
  const image = isMediaUrl(seo.ogImage) ? seo.ogImage : null;
  // The tab icon, as Google shows it beside the site; the site's default otherwise.
  const favicon = isMediaUrl(seo.favicon) ? seo.favicon : DEFAULT_SITE_ICON;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">{t("seoPreviewGoogle")}</h3>
        <div dir={dir} lang={language} className="space-y-1 rounded-xl border border-border bg-card p-4">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-background">
              <Image
                src={favicon}
                alt={seo.favicon ? t("seoDetailsFavicon") : t("seoDetailsFaviconDefault")}
                width={16}
                height={16}
                className="size-4 object-contain"
              />
            </span>
            <span dir="ltr" className="truncate">{site}</span>
          </p>
          {/* Google cuts titles near 60 characters and snippets near 160. */}
          <p className="truncate text-lg leading-snug text-primary">{texts.metaTitle}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">{texts.metaDescription}</p>
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">{t("seoPreviewSocial")}</h3>
        <div
          dir={dir}
          lang={language}
          className={cn(
            "overflow-hidden rounded-xl border border-border bg-card",
            !isLarge && "flex items-stretch",
          )}
        >
          <div
            className={cn(
              "relative shrink-0 bg-muted",
              isLarge ? "aspect-[1200/630] w-full" : "aspect-square w-28",
            )}
          >
            {image ? (
              // next/image throws for hosts outside the allowed patterns.
              <Image
                src={image}
                alt={texts.ogImageAlt ?? ""}
                fill
                sizes={isLarge ? "384px" : "112px"}
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <ImageIcon className="size-8 text-muted-foreground" aria-hidden />
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-1 p-3">
            <p dir="ltr" className="truncate text-xs uppercase text-muted-foreground">{site}</p>
            <p className="truncate font-semibold">{texts.ogTitle}</p>
            <p className="line-clamp-2 text-sm text-muted-foreground">{texts.ogDescription}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
