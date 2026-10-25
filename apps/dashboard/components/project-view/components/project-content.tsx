"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { ProjectDetails } from "@repo/types/projects";
import { Card } from "@repo/ui/card";
import { ImageOff } from "@repo/ui/icons";
import { RichTextContent } from "@repo/ui/rich-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { isMediaUrl } from "../../../libs/media";
import { localized } from "../../../utils/format";
import { FormCard } from "../../project-form/components/form-card";

const LANGUAGES = [
  { lang: "en", dir: "ltr", labelKey: "projectViewLangEn" },
  { lang: "ar", dir: "rtl", labelKey: "projectViewLangAr" },
] as const;

/** The cover image, then the project's texts with one tab per language. */
export function ProjectContent({ project }: { project: ProjectDetails }) {
  const t = useTranslations();
  const locale = useLocale();
  const texts = {
    en: {
      name: project.nameEn,
      summary: project.shortDescriptionEn,
      description: project.descriptionEn,
    },
    ar: {
      name: project.nameAr,
      summary: project.shortDescriptionAr,
      description: project.descriptionAr,
    },
  };

  return (
    <div className="min-w-0 space-y-6">
      <Card className="overflow-hidden p-0">
        {/* next/image throws for hosts outside the allowed patterns. */}
        {isMediaUrl(project.mainImageUrl) ? (
          <Image
            src={project.mainImageUrl}
            alt={localized(locale, project.nameEn, project.nameAr)}
            width={1280}
            height={720}
            priority
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-muted/40 text-muted-foreground">
            <ImageOff className="size-10" aria-hidden />
            <span className="text-sm">{t("projectViewNoImage")}</span>
          </div>
        )}
      </Card>

      <Tabs defaultValue={locale === "ar" ? "ar" : "en"}>
        <TabsList>
          {LANGUAGES.map(({ lang, labelKey }) => (
            <TabsTrigger key={lang} value={lang}>
              {t(labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
        {LANGUAGES.map(({ lang, dir }) => (
          <TabsContent key={lang} value={lang} lang={lang} dir={dir} className="space-y-6">
            <FormCard title={t("projectViewSummary")}>
              <h2 className="text-xl font-semibold">{texts[lang].name}</h2>
              <p className="leading-relaxed text-muted-foreground">
                {texts[lang].summary || "—"}
              </p>
            </FormCard>
            <FormCard title={t("projectViewDescription")}>
              <RichTextContent html={texts[lang].description} className="text-[15px]" />
            </FormCard>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
