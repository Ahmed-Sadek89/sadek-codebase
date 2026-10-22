import { useTranslations } from "next-intl";
import { Card, CardContent } from "@repo/ui/card";
import { SectionTitle } from "../../../ui/section-title";
import { steps } from "./utils";

export function HowItWorks() {
  const t = useTranslations();
  return (
    <section className="py-[76px] max-[700px]:py-[54px] bg-surface">
      <div className="app-container py-0">
        <SectionTitle title={t("howTitle")} copy={t("howCopy")} />
        <div className="grid grid-cols-4 gap-3 max-[700px]:grid-cols-2">
          {steps.map(({ Icon, titleKey, copyKey }, i) => (
            <Card className="border-0 bg-card" key={titleKey}>
              <CardContent className="relative p-[17px]">
                <span className="absolute top-3 end-[13px] text-xl font-bold text-muted-foreground">
                  0{i + 1}
                </span>
                <Icon className="w-[17px] text-primary" />
                <h3 className="mt-[13px] text-xs">{t(titleKey)}</h3>
                <p className="text-[10px] leading-[1.6] text-muted-foreground">
                  {t(copyKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
