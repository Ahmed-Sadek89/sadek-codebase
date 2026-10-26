"use client";

import { useLocale, useTranslations } from "next-intl";
import type { InstructorExperience } from "@repo/types/instructor-experience";
import { RichTextContent } from "@repo/ui/rich-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { FormCard } from "../../project-form/components/form-card";
import { CourseHero } from "./course-hero";

const LANGUAGES = [
  { lang: "en", dir: "ltr", labelKey: "projectViewLangEn" },
  { lang: "ar", dir: "rtl", labelKey: "projectViewLangAr" },
] as const;

/** The course hero, then the description with one tab per language (opening on the current locale). */
export function ViewContent({
  instructorExperience,
}: {
  instructorExperience: InstructorExperience;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const descriptions = {
    en: instructorExperience.descriptionEn,
    ar: instructorExperience.descriptionAr,
  };

  return (
    <div className="min-w-0 space-y-6">
      <CourseHero instructorExperience={instructorExperience} />
      <FormCard title={t("instructorExperienceFormSectionDescription")}>
        <Tabs defaultValue={locale === "ar" ? "ar" : "en"}>
          <TabsList>
            {LANGUAGES.map(({ lang, labelKey }) => (
              <TabsTrigger key={lang} value={lang}>
                {t(labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>
          {LANGUAGES.map(({ lang, dir }) => (
            <TabsContent key={lang} value={lang} lang={lang} dir={dir} className="pt-2">
              <RichTextContent html={descriptions[lang]} className="text-[15px]" />
            </TabsContent>
          ))}
        </Tabs>
      </FormCard>
    </div>
  );
}
